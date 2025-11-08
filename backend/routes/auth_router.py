from fastapi import APIRouter, HTTPException, Depends, status, Response, Request
from models.customer import CustomerCreate, CustomerLogin, CustomerResponse
from utils.auth import get_password_hash, verify_password, create_access_token
from datetime import datetime
import uuid

router = APIRouter()

def get_db(request: Request):
    """Dependency to get database"""
    return request.app.state.db

@router.post("/user/register", status_code=status.HTTP_201_CREATED)
async def register_customer(customer: CustomerCreate, db=Depends(get_db)):
    """Register a new customer"""
    
    # Validate required fields
    if not customer.name or not customer.contact_no or not customer.password:
        raise HTTPException(
            status_code=400,
            detail="Name, contact number, and password are required"
        )
    
    # Check if customer already exists
    existing_customer = await db.customers.find_one({"contact_no": customer.contact_no})
    if existing_customer:
        raise HTTPException(
            status_code=409,
            detail="Customer with this contact number already exists. Please login instead."
        )
    
    # Get default cafe if not provided
    if not customer.cafe:
        default_cafe = await db.caves.find_one()
        if not default_cafe:
            raise HTTPException(
                status_code=500,
                detail="No cafe available for registration. Please contact administrator."
            )
        customer.cafe = str(default_cafe["_id"])
    
    # Hash password
    hashed_password = get_password_hash(customer.password)
    
    # Create customer document
    customer_dict = customer.dict(exclude={"password"})
    customer_dict.update({
        "_id": str(uuid.uuid4()),
        "password": hashed_password,
        "is_active": True,
        "is_deleted": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Insert into database
    result = await db.customers.insert_one(customer_dict)
    
    # Return customer data
    return {
        "status": True,
        "message": "Customer registered successfully! Please login with your credentials.",
        "customer": {
            "_id": customer_dict["_id"],
            "name": customer_dict["name"],
            "contact_no": customer_dict["contact_no"],
            "email": customer_dict.get("email"),
            "cafe": customer_dict["cafe"]
        }
    }

@router.post("/user/login")
async def login_customer(
    credentials: CustomerLogin,
    response: Response,
    db=Depends(get_db)
):
    """Login a customer with contact number and password"""
    
    # Validate input
    if not credentials.contact_no or not credentials.password:
        raise HTTPException(
            status_code=400,
            detail="Contact number and password are required"
        )
    
    # Find customer
    customer = await db.customers.find_one({"contact_no": credentials.contact_no})
    if not customer:
        raise HTTPException(
            status_code=401,
            detail="Invalid contact number or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, customer["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid contact number or password"
        )
    
    # Generate JWT token
    token_data = {
        "id": customer["_id"],
        "contact_no": customer["contact_no"],
        "cafe": customer["cafe"],
        "name": customer["name"]
    }
    access_token = create_access_token(data=token_data)
    
    # Set cookie
    response.set_cookie(
        key="customer_token",
        value=access_token,
        httponly=True,
        secure=True if os.getenv("NODE_ENV") == "production" else False,
        samesite="strict",
        max_age=60 * 60 * 18  # 18 hours
    )
    
    # Return customer data
    return {
        "status": True,
        "message": "Customer login successful",
        "token": access_token,
        "customer": {
            "_id": customer["_id"],
            "name": customer["name"],
            "contact_no": customer["contact_no"],
            "cafe": customer["cafe"]
        }
    }

@router.post("/user/logout")
async def logout_customer(response: Response):
    """Logout a customer"""
    response.delete_cookie(key="customer_token")
    return {"status": True, "message": "Logout successful"}

@router.get("/user/me")
async def get_current_customer(request: Request, db=Depends(get_db)):
    """Get current logged-in customer"""
    token = request.cookies.get("customer_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    from utils.auth import decode_access_token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    customer = await db.customers.find_one({"_id": payload["id"]})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Remove password from response
    customer.pop("password", None)
    return {"status": True, "customer": customer}

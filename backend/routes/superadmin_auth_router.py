from fastapi import APIRouter, HTTPException, Depends, status, Response, Request
from models.superadmin import SuperAdminCreate, SuperAdminLogin, SuperAdminResponse
from utils.auth import get_password_hash, verify_password, create_access_token
from datetime import datetime
import uuid
import os

router = APIRouter()

def get_db(request: Request):
    """Dependency to get database"""
    return request.app.state.db

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_superadmin(superadmin: SuperAdminCreate, db=Depends(get_db)):
    """Register a new super admin"""
    
    # Check if super admin already exists
    existing_admin = await db.superadmins.find_one({"email": superadmin.email})
    if existing_admin:
        raise HTTPException(
            status_code=409,
            detail="Super admin with this email already exists"
        )
    
    # Hash password
    hashed_password = get_password_hash(superadmin.password)
    
    # Create super admin document
    admin_dict = superadmin.dict(exclude={"password"})
    admin_dict.update({
        "_id": str(uuid.uuid4()),
        "password": hashed_password,
        "is_active": True,
        "is_deleted": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Insert into database
    result = await db.superadmins.insert_one(admin_dict)
    
    # Return admin data
    return {
        "status": True,
        "message": "Super admin registered successfully!",
        "user": {
            "_id": admin_dict["_id"],
            "email": admin_dict["email"],
            "name": admin_dict["name"],
            "role": admin_dict["role"]
        }
    }

@router.post("/login")
async def login_superadmin(
    credentials: SuperAdminLogin,
    response: Response,
    db=Depends(get_db)
):
    """Login a super admin with email and password"""
    
    # Validate input
    if not credentials.email or not credentials.password:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required"
        )
    
    # Find super admin
    admin = await db.superadmins.find_one({"email": credentials.email})
    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Check if admin is active
    if not admin.get("is_active", False):
        raise HTTPException(
            status_code=403,
            detail="Account is inactive. Please contact support."
        )
    
    # Verify password
    if not verify_password(credentials.password, admin["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Generate JWT token
    token_data = {
        "id": admin["_id"],
        "email": admin["email"],
        "name": admin["name"],
        "role": admin["role"]
    }
    access_token = create_access_token(data=token_data)
    
    # Set cookie
    response.set_cookie(
        key="superadmin_token",
        value=access_token,
        httponly=True,
        secure=True if os.getenv("NODE_ENV") == "production" else False,
        samesite="strict",
        max_age=60 * 60 * 24 * 7  # 7 days
    )
    
    # Return response matching frontend expectation
    return {
        "status": True,
        "message": "Login successful",
        "data": {
            "token": access_token,
            "user": {
                "_id": admin["_id"],
                "email": admin["email"],
                "name": admin["name"],
                "role": admin["role"]
            }
        }
    }

@router.post("/logout")
async def logout_superadmin(response: Response):
    """Logout a super admin"""
    response.delete_cookie(key="superadmin_token")
    return {"status": True, "message": "Logout successful"}

@router.get("/me")
async def get_current_superadmin(request: Request, db=Depends(get_db)):
    """Get current logged-in super admin"""
    token = request.cookies.get("superadmin_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    from utils.auth import decode_access_token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    admin = await db.superadmins.find_one({"_id": payload["id"]})
    if not admin:
        raise HTTPException(status_code=404, detail="Super admin not found")
    
    # Remove password from response
    admin.pop("password", None)
    return {"status": True, "user": admin}

from fastapi import APIRouter, Depends, Request

router = APIRouter()

def get_db(request: Request):
    return request.app.state.db

@router.get("/dashboard")
async def get_admin_dashboard(db=Depends(get_db)):
    """Get admin dashboard data"""
    return {"message": "Admin dashboard endpoint"}

@router.get("/customers")
async def get_customers(db=Depends(get_db)):
    """Get all customers"""
    return {"message": "Get customers endpoint"}

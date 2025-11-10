from fastapi import APIRouter, Depends, Request

router = APIRouter()

def get_db(request: Request):
    return request.app.state.db

@router.get("/profile")
async def get_user_profile(db=Depends(get_db)):
    """Get user profile"""
    return {"message": "User profile endpoint"}

@router.get("/bookings")
async def get_user_bookings(db=Depends(get_db)):
    """Get user bookings"""
    return {"message": "User bookings endpoint"}

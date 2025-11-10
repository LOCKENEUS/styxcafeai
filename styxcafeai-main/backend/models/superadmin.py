from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SuperAdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "superadmin"

class SuperAdminLogin(BaseModel):
    email: EmailStr
    password: str

class SuperAdminResponse(BaseModel):
    _id: str
    email: str
    name: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "_id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "superadmin@styxcafe.com",
                "name": "Super Admin",
                "role": "superadmin",
                "is_active": True,
                "created_at": "2025-11-10T00:00:00"
            }
        }

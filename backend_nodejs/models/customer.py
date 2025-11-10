from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    contact_no: str
    age: Optional[str] = None
    address: Optional[str] = None
    gender: Optional[str] = "N/A"
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    credit_eligibility: Optional[str] = "No"
    credit_limit: Optional[int] = 0
    credit_amount: Optional[int] = 0

class CustomerCreate(CustomerBase):
    password: str
    cafe: Optional[str] = None

class CustomerLogin(BaseModel):
    contact_no: str
    password: str

class CustomerResponse(CustomerBase):
    id: str = Field(alias="_id")
    cafe: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CustomerInDB(CustomerBase):
    id: str = Field(alias="_id")
    cafe: str
    password: str
    is_active: bool = True
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

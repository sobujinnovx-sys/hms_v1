from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class DoctorBase(BaseModel):
    specialization: str
    license_number: str
    phone: str
    bio: Optional[str] = None
    office_hours: Optional[str] = None


class DoctorCreate(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str
    specialization: str
    license_number: str
    phone: str
    bio: Optional[str] = None
    office_hours: Optional[str] = None


class DoctorUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    office_hours: Optional[str] = None


class DoctorResponse(BaseModel):
    id: int
    user_id: int
    specialization: str
    license_number: str
    phone: str
    bio: Optional[str]
    office_hours: Optional[str]
    created_at: datetime
    updated_at: datetime

    # User info
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

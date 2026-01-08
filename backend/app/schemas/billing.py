from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum


class BillStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentBase(BaseModel):
    amount: float
    payment_method: str
    notes: Optional[str] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(PaymentBase):
    id: int
    bill_id: int
    status: PaymentStatus
    transaction_id: Optional[str]
    payment_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class BillBase(BaseModel):
    patient_id: int
    amount: float
    tax: Optional[float] = 0.0
    description: Optional[str] = None
    due_date: datetime
    appointment_id: Optional[int] = None


class BillCreate(BillBase):
    pass


class BillUpdate(BaseModel):
    amount: Optional[float] = None
    tax: Optional[float] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[BillStatus] = None


class BillResponse(BillBase):
    id: int
    bill_number: str
    total_amount: float
    status: BillStatus
    issue_date: datetime
    created_at: datetime
    updated_at: datetime
    payments: List[PaymentResponse] = []

    class Config:
        from_attributes = True

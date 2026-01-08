from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.db.session import get_db
from app.schemas.billing import (
    BillCreate, BillUpdate, BillResponse,
    PaymentCreate, PaymentResponse
)
from app.models.billing import Bill, Payment
from app.core.security import get_current_user, check_role

router = APIRouter(prefix="/api/v1/billing", tags=["Billing"])


def generate_bill_number():
    """Generate a unique bill number."""
    return f"BILL-{uuid.uuid4().hex[:8].upper()}"


@router.post("/bills", response_model=BillResponse)
def create_bill(
    bill_data: BillCreate,
    current_user: dict = Depends(check_role(["admin", "receptionist"])),
    db: Session = Depends(get_db)
):
    """Create a new bill."""
    bill_number = generate_bill_number()
    total_amount = bill_data.amount + (bill_data.tax or 0.0)
    
    db_bill = Bill(
        patient_id=bill_data.patient_id,
        appointment_id=bill_data.appointment_id,
        bill_number=bill_number,
        amount=bill_data.amount,
        tax=bill_data.tax or 0.0,
        total_amount=total_amount,
        description=bill_data.description,
        due_date=bill_data.due_date
    )
    
    db.add(db_bill)
    db.commit()
    db.refresh(db_bill)
    return db_bill


@router.get("/bills", response_model=list[BillResponse])
def list_bills(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    patient_id: int = Query(None),
    status: str = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List bills with optional filters."""
    query = db.query(Bill)
    
    if patient_id:
        query = query.filter(Bill.patient_id == patient_id)
    if status:
        query = query.filter(Bill.status == status)
    
    bills = query.offset(skip).limit(limit).all()
    return bills


@router.get("/bills/{bill_id}", response_model=BillResponse)
def get_bill(
    bill_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get bill by ID."""
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    return bill


@router.put("/bills/{bill_id}", response_model=BillResponse)
def update_bill(
    bill_id: int,
    bill_update: BillUpdate,
    current_user: dict = Depends(check_role(["admin", "receptionist"])),
    db: Session = Depends(get_db)
):
    """Update bill."""
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    
    update_data = bill_update.dict(exclude_unset=True)
    
    # Recalculate total if amount or tax changes
    if "amount" in update_data or "tax" in update_data:
        amount = update_data.get("amount", bill.amount)
        tax = update_data.get("tax", bill.tax)
        update_data["total_amount"] = amount + tax
    
    for field, value in update_data.items():
        setattr(bill, field, value)
    
    db.commit()
    db.refresh(bill)
    return bill


@router.delete("/bills/{bill_id}")
def delete_bill(
    bill_id: int,
    current_user: dict = Depends(check_role(["admin"])),
    db: Session = Depends(get_db)
):
    """Delete bill (Admin only)."""
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    
    db.delete(bill)
    db.commit()
    
    return {"message": f"Bill {bill_id} deleted successfully"}


# Payment endpoints
@router.post("/bills/{bill_id}/payments", response_model=PaymentResponse)
def create_payment(
    bill_id: int,
    payment_data: PaymentCreate,
    current_user: dict = Depends(check_role(["admin", "receptionist"])),
    db: Session = Depends(get_db)
):
    """Create a payment for a bill."""
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    
    db_payment = Payment(
        bill_id=bill_id,
        **payment_data.dict()
    )
    
    db.add(db_payment)
    
    # Update bill status if payment is completed
    if payment_data.payment_method and payment_data.amount >= bill.total_amount:
        bill.status = "paid"
    
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.get("/bills/{bill_id}/payments", response_model=list[PaymentResponse])
def list_bill_payments(
    bill_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List payments for a bill."""
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    
    payments = db.query(Payment).filter(Payment.bill_id == bill_id).all()
    return payments

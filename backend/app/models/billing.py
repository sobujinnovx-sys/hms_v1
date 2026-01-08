from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
from app.db.base import Base


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


class Bill(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    bill_number = Column(String(50), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    tax = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(BillStatus), default=BillStatus.PENDING, nullable=False)
    issue_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="bills")
    payments = relationship("Payment", back_populates="bill")

    def __repr__(self):
        return f"<Bill(id={self.id}, bill_number={self.bill_number}, amount={self.total_amount})>"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    bill_id = Column(Integer, ForeignKey("bills.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)  # credit_card, debit_card, cash, etc.
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    transaction_id = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    payment_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    bill = relationship("Bill", back_populates="payments")

    def __repr__(self):
        return f"<Payment(id={self.id}, bill_id={self.bill_id}, amount={self.amount})>"

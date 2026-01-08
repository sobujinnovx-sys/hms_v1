from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.models.appointment import Appointment
from app.core.security import get_current_user, check_role

router = APIRouter(prefix="/api/v1/appointments", tags=["Appointments"])


@router.post("", response_model=AppointmentResponse)
def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: dict = Depends(check_role(["admin", "receptionist", "doctor"])),
    db: Session = Depends(get_db)
):
    """Create a new appointment."""
    db_appointment = Appointment(**appointment_data.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


@router.get("", response_model=list[AppointmentResponse])
def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    patient_id: int = Query(None),
    doctor_id: int = Query(None),
    status_filter: str = Query(None, alias="status"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List appointments with optional filters."""
    query = db.query(Appointment)
    
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)
    if doctor_id:
        query = query.filter(Appointment.doctor_id == doctor_id)
    if status_filter:
        query = query.filter(Appointment.status == status_filter)
    
    appointments = query.offset(skip).limit(limit).all()
    return appointments


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointment by ID."""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    current_user: dict = Depends(check_role(["admin", "receptionist", "doctor"])),
    db: Session = Depends(get_db)
):
    """Update appointment."""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    update_data = appointment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)
    
    db.commit()
    db.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    current_user: dict = Depends(check_role(["admin", "receptionist"])),
    db: Session = Depends(get_db)
):
    """Delete appointment."""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    db.delete(appointment)
    db.commit()
    
    return {"message": f"Appointment {appointment_id} deleted successfully"}

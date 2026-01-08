from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.medical_record import (
    MedicalRecordCreate, MedicalRecordUpdate, MedicalRecordResponse,
    PrescriptionCreate, PrescriptionResponse
)
from app.models.medical_record import MedicalRecord, Prescription
from app.core.security import get_current_user, check_role

router = APIRouter(prefix="/api/v1/medical-records", tags=["Medical Records"])


@router.post("", response_model=MedicalRecordResponse)
def create_medical_record(
    record_data: MedicalRecordCreate,
    current_user: dict = Depends(check_role(["admin", "doctor"])),
    db: Session = Depends(get_db)
):
    """Create a new medical record."""
    db_record = MedicalRecord(
        patient_id=record_data.patient_id,
        doctor_id=record_data.doctor_id,
        appointment_id=record_data.appointment_id,
        diagnosis=record_data.diagnosis,
        treatment=record_data.treatment,
        notes=record_data.notes
    )
    
    db.add(db_record)
    db.flush()
    
    # Add prescriptions if provided
    if record_data.prescriptions:
        for prescription_data in record_data.prescriptions:
            db_prescription = Prescription(
                medical_record_id=db_record.id,
                **prescription_data.dict()
            )
            db.add(db_prescription)
    
    db.commit()
    db.refresh(db_record)
    return db_record


@router.get("", response_model=list[MedicalRecordResponse])
def list_medical_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    patient_id: int = Query(None),
    doctor_id: int = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List medical records with optional filters."""
    query = db.query(MedicalRecord)
    
    if patient_id:
        query = query.filter(MedicalRecord.patient_id == patient_id)
    if doctor_id:
        query = query.filter(MedicalRecord.doctor_id == doctor_id)
    
    records = query.offset(skip).limit(limit).all()
    return records


@router.get("/{record_id}", response_model=MedicalRecordResponse)
def get_medical_record(
    record_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get medical record by ID."""
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found")
    return record


@router.put("/{record_id}", response_model=MedicalRecordResponse)
def update_medical_record(
    record_id: int,
    record_update: MedicalRecordUpdate,
    current_user: dict = Depends(check_role(["admin", "doctor"])),
    db: Session = Depends(get_db)
):
    """Update medical record."""
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found")
    
    update_data = record_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
    
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_medical_record(
    record_id: int,
    current_user: dict = Depends(check_role(["admin"])),
    db: Session = Depends(get_db)
):
    """Delete medical record (Admin only)."""
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found")
    
    db.delete(record)
    db.commit()
    
    return {"message": f"Medical record {record_id} deleted successfully"}


# Prescription endpoints
@router.post("/{record_id}/prescriptions", response_model=PrescriptionResponse)
def create_prescription(
    record_id: int,
    prescription_data: PrescriptionCreate,
    current_user: dict = Depends(check_role(["admin", "doctor"])),
    db: Session = Depends(get_db)
):
    """Add prescription to medical record."""
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found")
    
    db_prescription = Prescription(
        medical_record_id=record_id,
        **prescription_data.dict()
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription

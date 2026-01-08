from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class PrescriptionBase(BaseModel):
    medication_name: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionResponse(PrescriptionBase):
    id: int
    medical_record_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MedicalRecordBase(BaseModel):
    patient_id: int
    doctor_id: int
    diagnosis: str
    treatment: str
    notes: Optional[str] = None
    appointment_id: Optional[int] = None


class MedicalRecordCreate(MedicalRecordBase):
    prescriptions: Optional[List[PrescriptionCreate]] = None


class MedicalRecordUpdate(BaseModel):
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None


class MedicalRecordResponse(MedicalRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime
    prescriptions: List[PrescriptionResponse] = []

    class Config:
        from_attributes = True

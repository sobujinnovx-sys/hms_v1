#!/usr/bin/env python
"""Populate database with dummy data."""
import sys
sys.path.insert(0, '.')

from app.db.session import SessionLocal
from app.models.user import User, RoleEnum
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment, AppointmentStatus
from app.models.medical_record import MedicalRecord, Prescription
from app.models.billing import Bill, Payment, PaymentStatus, BillStatus
from datetime import datetime, timedelta
import uuid

try:
    db = SessionLocal()
    
    # Clear existing data
    db.query(Payment).delete()
    db.query(Bill).delete()
    db.query(Prescription).delete()
    db.query(MedicalRecord).delete()
    db.query(Appointment).delete()
    db.query(Doctor).delete()
    db.query(Patient).delete()
    db.query(User).delete()
    db.commit()
    
    # Create admin user
    admin = User(
        email="admin@hospital.com",
        username="admin",
        full_name="Admin User",
        hashed_password="admin123",
        role=RoleEnum.ADMIN,
        is_active=True
    )
    db.add(admin)
    db.flush()
    
    # Create doctor users
    doctor1_user = User(
        email="dr.john@hospital.com",
        username="drjohn",
        full_name="Dr. John Smith",
        hashed_password="doctor123",
        role=RoleEnum.DOCTOR,
        is_active=True
    )
    db.add(doctor1_user)
    db.flush()
    
    doctor2_user = User(
        email="dr.sarah@hospital.com",
        username="drsarah",
        full_name="Dr. Sarah Johnson",
        hashed_password="doctor123",
        role=RoleEnum.DOCTOR,
        is_active=True
    )
    db.add(doctor2_user)
    db.flush()
    
    # Create doctors
    doctor1 = Doctor(
        user_id=doctor1_user.id,
        specialization="Cardiology",
        license_number="LIC001",
        phone="555-0101",
        office_hours="9AM-5PM"
    )
    db.add(doctor1)
    
    doctor2 = Doctor(
        user_id=doctor2_user.id,
        specialization="Neurology",
        license_number="LIC002",
        phone="555-0102",
        office_hours="10AM-6PM"
    )
    db.add(doctor2)
    db.flush()
    
    # Create patients
    patients_data = [
        {
            "first_name": "Michael",
            "last_name": "Johnson",
            "email": "michael.j@example.com",
            "phone": "555-0201",
            "date_of_birth": datetime(1985, 5, 15),
            "address": "123 Main St, City, State 12345",
            "gender": "M",
            "blood_type": "O+"
        },
        {
            "first_name": "Emily",
            "last_name": "Davis",
            "email": "emily.d@example.com",
            "phone": "555-0202",
            "date_of_birth": datetime(1990, 8, 22),
            "address": "456 Oak Ave, City, State 67890",
            "gender": "F",
            "blood_type": "A+"
        },
        {
            "first_name": "Robert",
            "last_name": "Wilson",
            "email": "robert.w@example.com",
            "phone": "555-0203",
            "date_of_birth": datetime(1978, 3, 10),
            "address": "789 Pine Rd, City, State 24680",
            "gender": "M",
            "blood_type": "B+"
        },
        {
            "first_name": "Jessica",
            "last_name": "Brown",
            "email": "jessica.b@example.com",
            "phone": "555-0204",
            "date_of_birth": datetime(1995, 11, 5),
            "address": "321 Elm St, City, State 13579",
            "gender": "F",
            "blood_type": "AB+"
        },
    ]
    
    patients = []
    for p_data in patients_data:
        patient = Patient(**p_data)
        db.add(patient)
        patients.append(patient)
    db.flush()
    
    # Create appointments
    for i, patient in enumerate(patients):
        appointment = Appointment(
            patient_id=patient.id,
            doctor_id=doctor1_user.id if i % 2 == 0 else doctor2_user.id,
            appointment_date=datetime.now() + timedelta(days=i+1),
            reason="Regular Checkup",
            status=AppointmentStatus.SCHEDULED
        )
        db.add(appointment)
    
    db.flush()
    
    # Create medical records
    for i, patient in enumerate(patients):
        record = MedicalRecord(
            patient_id=patient.id,
            doctor_id=doctor1_user.id if i % 2 == 0 else doctor2_user.id,
            diagnosis=f"Patient diagnosis #{i+1}",
            treatment="Prescribed medication",
            notes=f"Patient notes for record {i+1}"
        )
        db.add(record)
        db.flush()
        
        # Add prescriptions
        prescription = Prescription(
            medical_record_id=record.id,
            medication_name="Aspirin",
            dosage="100mg",
            frequency="Once daily",
            duration="30 days"
        )
        db.add(prescription)
    
    db.flush()
    
    # Create bills
    for i, patient in enumerate(patients):
        amount = 500.00 + (i * 100)
        tax = 50.00
        total_amount = amount + tax
        bill = Bill(
            patient_id=patient.id,
            bill_number=f"BILL-{uuid.uuid4().hex[:8].upper()}",
            amount=amount,
            tax=tax,
            total_amount=total_amount,
            status=BillStatus.PAID if i % 2 == 0 else BillStatus.PENDING,
            description=f"Medical services for patient {i+1}",
            due_date=datetime.now() + timedelta(days=30)
        )
        db.add(bill)
        db.flush()
        
        # Add payments if bill is paid
        if bill.status == BillStatus.PAID:
            payment = Payment(
                bill_id=bill.id,
                amount=total_amount,
                payment_method="Credit Card",
                status=PaymentStatus.COMPLETED
            )
            db.add(payment)
    
    db.commit()
    print("✓ Database populated with dummy data!")
    print(f"  - Admin users: 1")
    print(f"  - Doctors: 2")
    print(f"  - Patients: {len(patients)}")
    print(f"  - Appointments: {len(patients)}")
    print(f"  - Medical Records: {len(patients)}")
    print(f"  - Bills: {len(patients)}")
    db.close()
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

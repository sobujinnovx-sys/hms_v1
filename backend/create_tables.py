#!/usr/bin/env python
"""Create all database tables."""
import sys
sys.path.insert(0, '.')

from app.db.session import engine
from app.db.base import Base
from app.models import User, Patient, Doctor, Appointment, MedicalRecord, Prescription, Bill, Payment

# Create all tables
Base.metadata.create_all(bind=engine)
print("✓ All tables created successfully!")

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    specialization = Column(String(255), nullable=False)
    license_number = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    bio = Column(Text, nullable=True)
    office_hours = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="doctor")

    def __repr__(self):
        return f"<Doctor(id={self.id}, user_id={self.user_id}, specialization={self.specialization})>"

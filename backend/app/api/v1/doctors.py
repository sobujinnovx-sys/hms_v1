from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse
from app.models.doctor import Doctor
from app.models.user import User, RoleEnum
from app.core.security import get_current_user, check_role, hash_password

router = APIRouter(prefix="/api/v1/doctors", tags=["Doctors"])


@router.post("", response_model=DoctorResponse)
def create_doctor(
    doctor_data: DoctorCreate,
    current_user: dict = Depends(check_role(["admin"])),
    db: Session = Depends(get_db)
):
    """Create a new doctor (Admin only)."""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == doctor_data.email) | (User.username == doctor_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already exists"
        )
    
    # Check if license number already exists
    existing_license = db.query(Doctor).filter(Doctor.license_number == doctor_data.license_number).first()
    if existing_license:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="License number already exists"
        )
    
    # Create user
    hashed_password = hash_password(doctor_data.password)
    db_user = User(
        email=doctor_data.email,
        username=doctor_data.username,
        full_name=doctor_data.full_name,
        hashed_password=hashed_password,
        role=RoleEnum.DOCTOR
    )
    
    db.add(db_user)
    db.flush()  # Flush to get the user ID without committing
    
    # Create doctor
    db_doctor = Doctor(
        user_id=db_user.id,
        specialization=doctor_data.specialization,
        license_number=doctor_data.license_number,
        phone=doctor_data.phone,
        bio=doctor_data.bio,
        office_hours=doctor_data.office_hours
    )
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    
    # Build response
    response = DoctorResponse(
        id=db_doctor.id,
        user_id=db_doctor.user_id,
        specialization=db_doctor.specialization,
        license_number=db_doctor.license_number,
        phone=db_doctor.phone,
        bio=db_doctor.bio,
        office_hours=db_doctor.office_hours,
        created_at=db_doctor.created_at,
        updated_at=db_doctor.updated_at,
        email=db_user.email,
        username=db_user.username,
        full_name=db_user.full_name
    )
    return response


@router.get("", response_model=list[DoctorResponse])
def list_doctors(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all doctors."""
    doctors = db.query(Doctor).offset(skip).limit(limit).all()
    
    responses = []
    for doctor in doctors:
        responses.append(DoctorResponse(
            id=doctor.id,
            user_id=doctor.user_id,
            specialization=doctor.specialization,
            license_number=doctor.license_number,
            phone=doctor.phone,
            bio=doctor.bio,
            office_hours=doctor.office_hours,
            created_at=doctor.created_at,
            updated_at=doctor.updated_at,
            email=doctor.user.email,
            username=doctor.user.username,
            full_name=doctor.user.full_name
        ))
    
    return responses


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(
    doctor_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get doctor by ID."""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    return DoctorResponse(
        id=doctor.id,
        user_id=doctor.user_id,
        specialization=doctor.specialization,
        license_number=doctor.license_number,
        phone=doctor.phone,
        bio=doctor.bio,
        office_hours=doctor.office_hours,
        created_at=doctor.created_at,
        updated_at=doctor.updated_at,
        email=doctor.user.email,
        username=doctor.user.username,
        full_name=doctor.user.full_name
    )


@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: int,
    doctor_update: DoctorUpdate,
    current_user: dict = Depends(check_role(["admin"])),
    db: Session = Depends(get_db)
):
    """Update doctor (Admin only)."""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    # Update doctor fields
    if doctor_update.specialization:
        doctor.specialization = doctor_update.specialization
    if doctor_update.license_number:
        existing = db.query(Doctor).filter(
            Doctor.license_number == doctor_update.license_number,
            Doctor.id != doctor_id
        ).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="License number already exists")
        doctor.license_number = doctor_update.license_number
    if doctor_update.phone:
        doctor.phone = doctor_update.phone
    if doctor_update.bio:
        doctor.bio = doctor_update.bio
    if doctor_update.office_hours:
        doctor.office_hours = doctor_update.office_hours
    
    # Update user fields
    user = doctor.user
    if doctor_update.full_name:
        user.full_name = doctor_update.full_name
    if doctor_update.email:
        existing = db.query(User).filter(User.email == doctor_update.email, User.id != user.id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already taken")
        user.email = doctor_update.email
    
    db.commit()
    db.refresh(doctor)
    
    return DoctorResponse(
        id=doctor.id,
        user_id=doctor.user_id,
        specialization=doctor.specialization,
        license_number=doctor.license_number,
        phone=doctor.phone,
        bio=doctor.bio,
        office_hours=doctor.office_hours,
        created_at=doctor.created_at,
        updated_at=doctor.updated_at,
        email=user.email,
        username=user.username,
        full_name=user.full_name
    )


@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    current_user: dict = Depends(check_role(["admin"])),
    db: Session = Depends(get_db)
):
    """Delete doctor (Admin only)."""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    # Also delete the associated user
    user = doctor.user
    db.delete(doctor)
    db.delete(user)
    db.commit()
    
    return {"message": f"Doctor {doctor_id} deleted successfully"}

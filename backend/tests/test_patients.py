import pytest
from fastapi import status
from datetime import date


def test_create_patient(client):
    """Test patient creation."""
    response = client.post(
        "/api/v1/patients",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "555-1234",
            "date_of_birth": "1990-01-01",
            "gender": "Male",
            "address": "123 Main St",
            "city": "Springfield",
            "state": "IL",
            "zip_code": "62701",
            "blood_type": "O+",
            "allergies": "Penicillin"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"


def test_get_patients_list(client):
    """Test getting patients list."""
    # Create a patient first
    client.post(
        "/api/v1/patients",
        json={
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "date_of_birth": "1985-05-15",
            "gender": "Female"
        }
    )
    
    # Get list
    response = client.get("/api/v1/patients")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) > 0


def test_get_patient_by_id(client):
    """Test getting patient by ID."""
    # Create patient
    create_response = client.post(
        "/api/v1/patients",
        json={
            "first_name": "Bob",
            "last_name": "Johnson",
            "email": "bob@example.com",
            "date_of_birth": "1992-03-20",
            "gender": "Male"
        }
    )
    
    patient_id = create_response.json()["id"]
    
    # Get by ID
    response = client.get(f"/api/v1/patients/{patient_id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["first_name"] == "Bob"


def test_update_patient(client):
    """Test updating patient."""
    # Create patient
    create_response = client.post(
        "/api/v1/patients",
        json={
            "first_name": "Alice",
            "last_name": "Williams",
            "date_of_birth": "1988-07-10",
            "gender": "Female"
        }
    )
    
    patient_id = create_response.json()["id"]
    
    # Update
    response = client.put(
        f"/api/v1/patients/{patient_id}",
        json={
            "phone": "555-9999",
            "address": "456 Oak Ave"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["phone"] == "555-9999"

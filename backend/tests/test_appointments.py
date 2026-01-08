from fastapi import status


def test_create_appointment(client):
    """Test appointment creation."""
    response = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": 1,
            "doctor_id": 1,
            "appointment_date": "2024-02-15T10:00:00",
            "reason": "Regular checkup"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["reason"] == "Regular checkup"
    assert data["status"] == "scheduled"


def test_get_appointments_list(client):
    """Test getting appointments list."""
    response = client.get("/api/v1/appointments")
    
    assert response.status_code == status.HTTP_200_OK


def test_update_appointment_status(client):
    """Test updating appointment status."""
    # Create appointment
    create_response = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": 1,
            "doctor_id": 1,
            "appointment_date": "2024-02-20T14:00:00",
            "reason": "Follow-up visit"
        }
    )
    
    appointment_id = create_response.json()["id"]
    
    # Update status
    response = client.put(
        f"/api/v1/appointments/{appointment_id}",
        json={"status": "completed"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "completed"

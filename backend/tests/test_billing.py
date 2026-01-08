from fastapi import status


def test_create_bill(client):
    """Test bill creation."""
    response = client.post(
        "/api/v1/billing/bills",
        json={
            "patient_id": 1,
            "amount": 250.00,
            "tax": 25.00,
            "description": "Consultation fee",
            "due_date": "2024-02-28T00:00:00"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["amount"] == 250.00
    assert data["total_amount"] == 275.00
    assert "bill_number" in data


def test_get_bills_list(client):
    """Test getting bills list."""
    response = client.get("/api/v1/billing/bills")
    
    assert response.status_code == status.HTTP_200_OK


def test_create_payment(client):
    """Test payment creation."""
    # Create bill first
    bill_response = client.post(
        "/api/v1/billing/bills",
        json={
            "patient_id": 1,
            "amount": 100.00,
            "tax": 10.00,
            "due_date": "2024-03-01T00:00:00"
        }
    )
    
    bill_id = bill_response.json()["id"]
    
    # Create payment
    response = client.post(
        f"/api/v1/billing/bills/{bill_id}/payments",
        json={
            "amount": 110.00,
            "payment_method": "credit_card"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["amount"] == 110.00

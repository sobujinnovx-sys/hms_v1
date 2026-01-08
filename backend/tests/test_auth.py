import pytest
from fastapi import status
from app.core.security import hash_password
from app.models.user import User, RoleEnum


def test_user_registration(client, test_db):
    """Test user registration."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "testpassword123",
            "role": "receptionist"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert data["username"] == "testuser"
    assert "password" not in data


def test_user_registration_duplicate_email(client, test_db):
    """Test registration with duplicate email."""
    # Create first user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser1",
            "full_name": "Test User 1",
            "password": "testpass123",
            "role": "receptionist"
        }
    )
    
    # Try to create another user with same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser2",
            "full_name": "Test User 2",
            "password": "testpass123",
            "role": "receptionist"
        }
    )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_user_login(client, test_db):
    """Test user login."""
    # Register user first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "testpassword123",
            "role": "receptionist"
        }
    )
    
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "testpassword123"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_user_login_invalid_credentials(client, test_db):
    """Test login with invalid credentials."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_current_user(client, test_db):
    """Test getting current user info."""
    # Register and login
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "testpassword123",
            "role": "receptionist"
        }
    )
    
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "testpassword123"
        }
    )
    
    token = login_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "testuser@example.com"

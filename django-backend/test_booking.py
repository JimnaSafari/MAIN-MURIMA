#!/usr/bin/env python3
"""
Test script to verify booking endpoint with proper Content-Type headers.
"""
import requests
import json

API_BASE = 'http://localhost:8000/api'

def test_booking_creation():
    """Test creating a booking with proper headers"""

    # First, let's create a test user and get a token
    print("1. Testing user registration...")
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User"
    }

    try:
        response = requests.post(f'{API_BASE}/auth/register/',
                               json=register_data,
                               headers={'Content-Type': 'application/json'})

        if response.status_code == 201:
            print("✅ User registered successfully")
            token = response.json()['tokens']['access']
        elif response.status_code == 400 and 'username' in response.json():
            # User might already exist, try to login
            print("User exists, trying to login...")
            login_response = requests.post(f'{API_BASE}/auth/login/',
                                         json={"username": "testuser", "password": "testpass123"},
                                         headers={'Content-Type': 'application/json'})
            if login_response.status_code == 200:
                print("✅ User logged in successfully")
                token = login_response.json()['tokens']['access']
            else:
                print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")
                return False
        else:
            print(f"❌ Registration failed: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        print(f"❌ Registration/login error: {e}")
        return False

    # Now test the booking endpoint
    print("\n2. Testing booking creation...")
    booking_data = {
        "property": 1,  # Assuming property ID 1 exists
        "guest_name": "Test Guest",
        "guest_email": "guest@example.com",
        "guest_phone": "+1234567890",
        "booking_date": "2025-12-25",
        "check_in_date": "2025-12-25",
        "check_out_date": "2025-12-27"
    }

    try:
        print(f"Sending booking data: {json.dumps(booking_data, indent=2)}")
        print(f"Token: {token[:20]}...")

        response = requests.post(f'{API_BASE}/bookings/',
                               json=booking_data,
                               headers={
                                   'Content-Type': 'application/json',
                                   'Authorization': f'Bearer {token}'
                               })

        print(f"Response status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"Response body: {response.text}")

        if response.status_code == 201:
            print("✅ Booking created successfully!")
            return True
        else:
            print(f"❌ Booking failed: {response.status_code}")
            if response.headers.get('content-type', '').startswith('application/json'):
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            return False

    except Exception as e:
        print(f"❌ Booking request error: {e}")
        return False

def test_content_type_header():
    """Test that our requests have the correct Content-Type"""
    print("\n3. Testing Content-Type header handling...")

    # Test with correct Content-Type
    test_data = {"test": "data"}

    response = requests.post(f'{API_BASE}/auth/login/',
                           json=test_data,
                           headers={'Content-Type': 'application/json'})

    print(f"Request Content-Type should be 'application/json'")
    print(f"Response status: {response.status_code}")

    if response.status_code != 415:
        print("✅ Content-Type header is being sent correctly")
        return True
    else:
        print(f"❌ Content-Type issue: {response.text}")
        return False

if __name__ == '__main__':
    print("Testing Booking API with proper headers...")
    print("=" * 50)

    success = test_content_type_header() and test_booking_creation()

    if success:
        print("\n✅ All booking tests passed!")
    else:
        print("\n❌ Some tests failed!")
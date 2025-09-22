#!/usr/bin/env python3
import requests
import json

API_BASE = 'http://localhost:8000/api'

# Test login first
print("1. Testing login...")
login_data = {
    "username": "testuser",
    "password": "testpass123"
}

response = requests.post(f'{API_BASE}/auth/login/',
                        json=login_data,
                        headers={'Content-Type': 'application/json'})

print(f"Login response: {response.status_code}")
if response.status_code == 200:
    token = response.json()['tokens']['access']
    print(f"✅ Login successful, token: {token[:20]}...")

    # Test booking creation
    print("\n2. Testing booking creation...")
    booking_data = {
        "property": 1,
        "guest_name": "Test Guest",
        "guest_email": "guest@example.com",
        "guest_phone": "+1234567890",
        "booking_date": "2025-12-25"
    }

    print(f"Booking data: {json.dumps(booking_data, indent=2)}")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    print(f"Headers: {headers}")

    booking_response = requests.post(f'{API_BASE}/bookings/',
                                   json=booking_data,
                                   headers=headers)

    print(f"Booking response status: {booking_response.status_code}")
    print(f"Booking response: {booking_response.text}")

    if booking_response.status_code == 201:
        print("✅ Booking created successfully!")
    else:
        print("❌ Booking failed")

else:
    print(f"❌ Login failed: {response.text}")
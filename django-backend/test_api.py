#!/usr/bin/env python3
"""
Test script to verify Django API endpoints are working correctly.
"""
import requests
import json
import sys

API_BASE = 'http://localhost:8000/api'

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f'{API_BASE}/health/')
        print(f"Health Check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_properties_endpoint():
    """Test the properties endpoint"""
    try:
        response = requests.get(f'{API_BASE}/properties/')
        print(f"Properties: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if 'results' in data:
                print(f"Found {len(data['results'])} properties")
            else:
                print(f"Found {len(data) if isinstance(data, list) else 1} properties")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Properties test failed: {e}")
        return False

def test_marketplace_endpoint():
    """Test the marketplace endpoint"""
    try:
        response = requests.get(f'{API_BASE}/marketplace/')
        print(f"Marketplace: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if 'results' in data:
                print(f"Found {len(data['results'])} marketplace items")
            else:
                print(f"Found {len(data) if isinstance(data, list) else 1} marketplace items")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Marketplace test failed: {e}")
        return False

def test_moving_services_endpoint():
    """Test the moving services endpoint"""
    try:
        response = requests.get(f'{API_BASE}/moving-services/')
        print(f"Moving Services: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if 'results' in data:
                print(f"Found {len(data['results'])} moving services")
            else:
                print(f"Found {len(data) if isinstance(data, list) else 1} moving services")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Moving services test failed: {e}")
        return False

def test_cors_headers():
    """Test CORS headers"""
    try:
        response = requests.options(f'{API_BASE}/properties/', headers={
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'GET'
        })
        print(f"CORS test: {response.status_code}")
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }
        print(f"CORS headers: {cors_headers}")
        return True
    except Exception as e:
        print(f"CORS test failed: {e}")
        return False

def main():
    """Run all API tests"""
    print("Testing Django API endpoints...")
    print("=" * 50)

    tests = [
        test_health_check,
        test_properties_endpoint,
        test_marketplace_endpoint,
        test_moving_services_endpoint,
        test_cors_headers,
    ]

    results = []
    for test in tests:
        print(f"\nRunning {test.__name__}...")
        result = test()
        results.append(result)
        print("-" * 30)

    print(f"\nTest Results:")
    print(f"Passed: {sum(results)}/{len(results)}")

    if all(results):
        print("✅ All tests passed! API is ready for frontend integration.")
        return 0
    else:
        print("❌ Some tests failed. Check the Django server is running.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
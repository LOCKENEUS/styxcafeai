#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class StyxBackendTester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.passed_tests.append(name)
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        print("\n=== TESTING BASIC ENDPOINTS ===")
        
        # Test root auth endpoint
        self.run_test("Auth Root", "GET", "auth/", 200)
        
        # Test Styx data endpoint
        self.run_test("Get Styx Data", "GET", "auth/", 200)

    def test_customer_auth_flow(self):
        """Test customer authentication flow"""
        print("\n=== TESTING CUSTOMER AUTH FLOW ===")
        
        # Test customer registration
        customer_data = {
            "name": "Test Customer",
            "email": "test@example.com",
            "contact_no": "9876543210"
        }
        
        success, response = self.run_test(
            "Customer Registration",
            "POST",
            "auth/user/register",
            201,
            data=customer_data
        )
        
        # Test send OTP
        otp_data = {"contact_no": "9876543210"}
        self.run_test(
            "Send Login OTP",
            "POST",
            "auth/user/send-otp",
            200,
            data=otp_data
        )
        
        # Test verify OTP (will fail without real OTP)
        verify_data = {"contact_no": "9876543210", "otp": "123456"}
        self.run_test(
            "Verify OTP (Expected to fail)",
            "POST",
            "auth/user/verify-otp",
            400,  # Expecting failure with fake OTP
            data=verify_data
        )

    def test_admin_auth_flow(self):
        """Test admin authentication"""
        print("\n=== TESTING ADMIN AUTH FLOW ===")
        
        # Test admin login
        admin_data = {
            "email": "styx.mumbai@example.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/admin/login",
            200,
            data=admin_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Admin token obtained: {self.token[:20]}...")

    def test_cafe_signup(self):
        """Test cafe owner signup (List Your Court)"""
        print("\n=== TESTING CAFE SIGNUP ===")
        
        cafe_data = {
            "ownerName": "Test Cafe Owner",
            "cafeName": "Test Cafe",
            "email": "testcafe@example.com",
            "phone": "9876543210",
            "address": "Test Address",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001"
        }
        
        self.run_test(
            "Cafe Owner Signup",
            "POST",
            "auth/cafe-signup",
            201,
            data=cafe_data
        )

    def test_user_endpoints(self):
        """Test user-related endpoints"""
        print("\n=== TESTING USER ENDPOINTS ===")
        
        # Test filter cafes
        self.run_test(
            "Filter Cafes",
            "GET",
            "user/filterCafes",
            200
        )

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Styx Backend API Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 50)
        
        self.test_basic_endpoints()
        self.test_customer_auth_flow()
        self.test_admin_auth_flow()
        self.test_cafe_signup()
        self.test_user_endpoints()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 TEST SUMMARY")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   - {failure}")
        
        if self.passed_tests:
            print(f"\n✅ PASSED TESTS:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = StyxBackendTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
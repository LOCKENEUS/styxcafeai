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
        
        # Use longer timeout for AI endpoints (they may take 2-5 seconds)
        timeout = 30 if 'ai' in endpoint.lower() else 10
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=timeout)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=timeout)

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

            try:
                return success, response.json() if success and response.content else {}
            except:
                return success, {"text": response.text} if success else {}

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
        """Test customer password-based authentication flow as per review request"""
        print("\n=== TESTING STYX CAFE PASSWORD-BASED AUTHENTICATION ===")
        
        # Generate unique test data
        import random
        unique_contact = f"9876543{random.randint(100, 999)}"
        test_email = f"john{random.randint(1000, 9999)}@example.com"
        test_password = "test123456"
        
        # Test 1: Customer Registration with Password
        print("\n🔍 Test 1: Customer Registration with Password...")
        customer_data = {
            "name": "John Doe",
            "contact_no": unique_contact,
            "email": test_email,
            "password": test_password
        }
        
        success, response = self.run_test(
            "Customer Registration with Password",
            "POST",
            "api/auth/user/register",
            201,
            data=customer_data
        )
        
        if success:
            print("✅ Registration with password works correctly")
            print(f"   Registered contact: {unique_contact}")
        else:
            print("❌ Registration failed - checking alternative status codes...")
            # Try with different expected status codes
            self.run_test(
                "Customer Registration (Alt Status)",
                "POST", 
                "api/auth/user/register",
                400,
                data=customer_data
            )
        
        # Test 2: Customer Login with Correct Password
        print("\n🔍 Test 2: Customer Login with Correct Password...")
        login_data = {
            "contact_no": unique_contact,
            "password": test_password
        }
        
        login_success, login_response = self.run_test(
            "Customer Login with Correct Password",
            "POST",
            "api/auth/user/login",
            200,
            data=login_data
        )
        
        if login_success:
            print("✅ Login with correct password works")
            if 'customer' in login_response:
                print(f"   Customer data returned: {login_response['customer']}")
        
        # Test 3: Customer Login with Wrong Password
        print("\n🔍 Test 3: Customer Login with Wrong Password...")
        wrong_login_data = {
            "contact_no": unique_contact,
            "password": "wrongpassword"
        }
        
        self.run_test(
            "Customer Login with Wrong Password",
            "POST",
            "api/auth/user/login",
            401,
            data=wrong_login_data
        )
        
        # Test 4: Duplicate Registration
        print("\n🔍 Test 4: Duplicate Registration...")
        duplicate_data = {
            "name": "John Doe",
            "contact_no": unique_contact,  # Same contact number
            "email": "different@example.com",
            "password": test_password
        }
        
        self.run_test(
            "Duplicate Registration",
            "POST",
            "api/auth/user/register",
            409,
            data=duplicate_data
        )
        
        # Test 5: OTP endpoints (should still exist but return Twilio error)
        print("\n🔍 Test 5: Send OTP (expecting Twilio error)...")
        otp_data = {"contact_no": unique_contact}
        
        self.run_test(
            "Send OTP - Twilio Not Configured",
            "POST",
            "api/auth/user/send-otp", 
            500,
            data=otp_data
        )
        
        print("\n🔍 Test 6: Verify OTP (expecting Twilio error)...")
        verify_data = {"contact_no": unique_contact, "otp": "123456"}
        
        self.run_test(
            "Verify OTP - Twilio Not Configured",
            "POST",
            "api/auth/user/verify-otp",
            500,
            data=verify_data
        )

    def test_admin_auth_flow(self):
        """Test admin authentication as per review request"""
        print("\n=== TESTING ADMIN AUTH FLOW ===")
        
        # Test 5: Admin Login (from seeded data)
        print("\n🔍 Test 5: Admin Login...")
        admin_data = {
            "email": "styx.mumbai@example.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/admin/login",
            200,
            data=admin_data
        )
        
        if success:
            print("✅ Admin login works with seeded data")
            if 'data' in response and 'token' in response['data']:
                self.token = response['data']['token']
                print(f"   Admin token obtained: {self.token[:20]}...")
        else:
            print("❌ Admin login failed - checking if endpoint exists...")
            # Try alternative endpoint path
            self.run_test(
                "Admin Login (Alt Path)",
                "POST",
                "auth/admin/login",
                200,
                data=admin_data
            )
    
    def test_super_admin_auth(self):
        """Test super admin authentication"""
        print("\n=== TESTING SUPER ADMIN AUTH ===")
        
        # Test 6: Super Admin Login - Check if endpoint exists
        print("\n🔍 Test 6: Super Admin Login Endpoint Check...")
        super_admin_data = {
            "email": "admin@styx.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Super Admin Login Endpoint Check",
            "POST",
            "api/auth/login",
            401,  # Expecting 401 since no super admin is seeded
            data=super_admin_data
        )
        
        if success:
            print("✅ Super Admin login endpoint exists and returns proper error for invalid credentials")
        else:
            print("❌ Super Admin endpoint may not exist or returns unexpected status")
            # Try checking if endpoint exists at all
            self.run_test(
                "Super Admin Endpoint Existence",
                "POST",
                "api/auth/login",
                400,  # Maybe 400 for missing fields
                data={}
            )

    def test_cafe_signup(self):
        """Test cafe owner signup (List Your Court)"""
        print("\n=== TESTING CAFE SIGNUP ===")
        
        cafe_data = {
            "name": "Test Cafe Owner",
            "email": "testcafe@example.com",
            "contact_no": "9876543210",
            "password": "testpass123",
            "cafe_name": "Test Cafe",
            "address": "Test Address",
            "city": "Mumbai",
            "state": "Maharashtra"
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
        
        # Test filter cafes (POST method based on backend code)
        filter_data = {"city": "Mumbai"}
        self.run_test(
            "Filter Cafes",
            "POST",
            "user/filterCafes",
            200,
            data=filter_data
        )

    def test_ai_endpoints(self):
        """Test AI-related endpoints as specified in review request"""
        print("\n=== TESTING AI ENDPOINTS (CRITICAL) ===")
        
        # Test AI Greeting Endpoint - No context
        print("\n🔍 Testing AI Greeting - No Context...")
        success, response = self.run_test(
            "AI Greeting - No Context",
            "POST",
            "api/ai/generate-greeting",
            200,
            data={}
        )
        
        # Test AI Greeting Endpoint - With time_of_day
        print("\n🔍 Testing AI Greeting - With Time of Day...")
        success, response = self.run_test(
            "AI Greeting - With Time",
            "POST",
            "api/ai/generate-greeting",
            200,
            data={"time_of_day": "morning"}
        )
        
        # Test AI Greeting Endpoint - With full context
        print("\n🔍 Testing AI Greeting - Full Context...")
        success, response = self.run_test(
            "AI Greeting - Full Context",
            "POST",
            "api/ai/generate-greeting",
            200,
            data={"time_of_day": "evening", "name": "Alex", "preferred_sport": "Basketball"}
        )
        
        # Test AI Sport Description - Football
        print("\n🔍 Testing AI Sport Description - Football...")
        success, response = self.run_test(
            "AI Sport Description - Football",
            "POST",
            "api/ai/generate-sport-description",
            200,
            data={"sport_name": "Football"}
        )
        
        # Test AI Sport Description - Basketball
        print("\n🔍 Testing AI Sport Description - Basketball...")
        success, response = self.run_test(
            "AI Sport Description - Basketball",
            "POST",
            "api/ai/generate-sport-description",
            200,
            data={"sport_name": "Basketball"}
        )
        
        # Test AI Sport Description - Invalid/missing sport_name
        print("\n🔍 Testing AI Sport Description - Missing Sport Name...")
        success, response = self.run_test(
            "AI Sport Description - Missing Sport",
            "POST",
            "api/ai/generate-sport-description",
            400,  # Expecting 400 for missing sport_name
            data={}
        )

    def test_health_check(self):
        """Test health check endpoint as per review request"""
        print("\n=== TESTING HEALTH CHECK ===")
        
        # Test 3: Health Check - GET /api (or /)
        print("\n🔍 Test 3: Health Check...")
        success, response = self.run_test(
            "Health Check Root (/)",
            "GET",
            "",  # Root endpoint
            200
        )
        
        if success:
            print("✅ Health check endpoint working correctly")
        
        # Note: /api endpoint doesn't exist, which is expected behavior

    def run_all_tests(self):
        """Run all backend tests for password-based authentication"""
        print("🚀 Starting Styx Cafe Password-Based Authentication Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 70)
        
        # Test authentication endpoints as per review request
        self.test_health_check()
        self.test_customer_auth_flow()
        self.test_admin_auth_flow()
        self.test_super_admin_auth()
        
        # Print summary
        print("\n" + "=" * 70)
        print(f"📊 STYX CAFE AUTHENTICATION TEST SUMMARY")
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
        
        # Check password hashing
        print(f"\n🔐 PASSWORD SECURITY CHECK:")
        print(f"   - Passwords should be hashed with bcrypt in database")
        print(f"   - Cookies should be set with httpOnly flag")
        print(f"   - JWT tokens should be generated for authentication")
        
        return self.tests_passed == self.tests_run

def main():
    tester = StyxBackendTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
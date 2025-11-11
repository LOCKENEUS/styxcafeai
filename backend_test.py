#!/usr/bin/env python3
"""
Backend API Testing for Razorpay Payment Integration
Tests for Razorpay payment order creation and verification endpoints
"""

import requests
import json
import time
from datetime import datetime
import sys
import random
import string
import os

# Configuration - Backend running on localhost:8001 (Node.js backend)
BASE_URL = "http://localhost:8001/api"
ADMIN_ENDPOINTS = {
    "login": f"{BASE_URL}/auth/admin/login",
    "payment": f"{BASE_URL}/admin/booking/payment",
    "verify_payment": f"{BASE_URL}/admin/booking/verify-payment"
}

class RazorpayPaymentTest:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.auth_token = None
        self.test_cafe_id = None
        
    def log_result(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
    
    # Removed helper methods - not needed for payment testing
    
    def authenticate_admin(self):
        """Authenticate as admin and get token"""
        print("\n=== Authenticating as Admin ===")
        
        try:
            login_data = {
                "email": "styx.mumbai@example.com",
                "password": "admin123"
            }
            
            response = self.session.post(ADMIN_ENDPOINTS["login"], json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data and "token" in data["data"]:
                    self.auth_token = data["data"]["token"]
                    self.test_cafe_id = data["data"]["cafe"]["_id"]  # Get actual cafe ID
                    
                    # Set authorization header for all future requests
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.auth_token}"
                    })
                    
                    self.log_result(
                        "Admin Authentication",
                        True,
                        f"Successfully authenticated as admin",
                        {
                            "cafe_id": self.test_cafe_id,
                            "token_length": len(self.auth_token) if self.auth_token else 0
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Admin Authentication",
                        False,
                        "Invalid response structure from login API",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Admin Authentication",
                    False,
                    f"Failed to authenticate: {error_msg}",
                    {"status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Admin Authentication",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_razorpay_credentials_configuration(self):
        """Test 1: Verify Razorpay credentials are properly configured"""
        print("\n=== Testing Razorpay Credentials Configuration ===")
        
        try:
            # Check if Razorpay SDK is working by making a test payment order
            test_data = {
                "amount": 1,  # Minimum amount for testing
                "currency": "INR",
                "receipt": "test_config_check"
            }
            
            response = self.session.post(ADMIN_ENDPOINTS["payment"], json=test_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("success") and "order" in data:
                    order = data["order"]
                    
                    # Check if order has required Razorpay fields
                    required_fields = ["id", "amount", "currency", "receipt"]
                    missing_fields = [field for field in required_fields if field not in order]
                    
                    if not missing_fields:
                        self.log_result(
                            "Razorpay Credentials Configuration",
                            True,
                            "Razorpay credentials are properly configured and SDK is working",
                            {
                                "order_id": order.get("id"),
                                "amount": order.get("amount"),
                                "currency": order.get("currency"),
                                "receipt": order.get("receipt")
                            }
                        )
                        return True
                    else:
                        self.log_result(
                            "Razorpay Credentials Configuration",
                            False,
                            f"Order missing required fields: {missing_fields}",
                            {"order": order}
                        )
                        return False
                else:
                    self.log_result(
                        "Razorpay Credentials Configuration",
                        False,
                        "Invalid response structure - missing 'order' field",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Razorpay Credentials Configuration",
                    False,
                    f"Failed to create test order: {error_msg}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Razorpay Credentials Configuration Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_payment_order_creation(self):
        """Test 2: Create Razorpay payment order with correct response structure"""
        print("\n=== Testing Payment Order Creation ===")
        
        try:
            # Test data as specified in the review request
            payment_data = {
                "amount": 500,
                "currency": "INR",
                "receipt": "test_receipt_001"
            }
            
            print(f"Creating payment order with amount: ₹{payment_data['amount']}")
            print(f"Expected amount in paise: {payment_data['amount'] * 100}")
            
            response = self.session.post(ADMIN_ENDPOINTS["payment"], json=payment_data)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if response has correct structure: { success: true, order: {...} }
                if data.get("success") and "order" in data:
                    order = data["order"]
                    
                    # Verify amount conversion to paise
                    expected_amount_paise = payment_data["amount"] * 100
                    actual_amount = order.get("amount")
                    
                    if actual_amount == expected_amount_paise:
                        self.log_result(
                            "Payment Order Creation",
                            True,
                            f"Payment order created successfully with correct structure",
                            {
                                "order_id": order.get("id"),
                                "amount_rupees": payment_data["amount"],
                                "amount_paise": actual_amount,
                                "currency": order.get("currency"),
                                "receipt": order.get("receipt"),
                                "response_structure": "{ success: true, order: {...} }"
                            }
                        )
                        
                        # Additional validation of order fields
                        required_fields = ["id", "amount", "currency", "receipt"]
                        order_validation = all(field in order for field in required_fields)
                        
                        if order_validation:
                            self.log_result(
                                "Payment Order Field Validation",
                                True,
                                "All required order fields are present",
                                {
                                    "fields_present": required_fields,
                                    "order_id_format": order.get("id", "").startswith("order_")
                                }
                            )
                        else:
                            missing_fields = [field for field in required_fields if field not in order]
                            self.log_result(
                                "Payment Order Field Validation",
                                False,
                                f"Missing required fields: {missing_fields}",
                                {"order": order}
                            )
                        
                        return order.get("id")
                    else:
                        self.log_result(
                            "Payment Order Creation",
                            False,
                            f"Amount conversion incorrect. Expected: {expected_amount_paise}, Got: {actual_amount}",
                            {
                                "expected_paise": expected_amount_paise,
                                "actual_paise": actual_amount,
                                "order": order
                            }
                        )
                        return None
                else:
                    # Check if it's the old structure { success: true, data: {...} }
                    if data.get("success") and "data" in data:
                        self.log_result(
                            "Payment Order Creation",
                            False,
                            "Response uses old structure { success: true, data: {...} } instead of { success: true, order: {...} }",
                            {"response": data}
                        )
                    else:
                        self.log_result(
                            "Payment Order Creation",
                            False,
                            "Invalid response structure",
                            {"response": data}
                        )
                    return None
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Payment Order Creation",
                    False,
                    f"Failed to create payment order: {error_msg}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return None
                
        except Exception as e:
            self.log_result(
                "Payment Order Creation Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return None
    
    def test_customer_creation_without_password(self):
        """Test 1: Create customer WITHOUT password (booking flow scenario)"""
        print("\n=== Testing Customer Creation WITHOUT Password ===")
        
        try:
            # Generate test data without password
            contact_no = self.generate_random_contact()
            customer_data = self.create_test_customer_data(include_password=False, contact_no=contact_no)
            
            # Expected auto-generated password (last 4 digits of contact)
            expected_password = contact_no[-4:]
            
            print(f"Creating customer with contact: {contact_no}")
            print(f"Expected auto-generated password: {expected_password}")
            
            # Make API call
            response = self.session.post(ADMIN_ENDPOINTS["customer_create"], json=customer_data)
            
            if response.status_code == 201:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    customer = data.get("data", {})
                    customer_id = customer.get("_id")
                    
                    self.created_customers.append(customer_id)
                    
                    self.log_result(
                        "Customer Creation Without Password",
                        True,
                        f"Customer created successfully without providing password",
                        {
                            "customer_id": customer_id,
                            "name": customer.get("name"),
                            "contact_no": customer.get("contact_no"),
                            "expected_password": expected_password,
                            "password_auto_generated": True
                        }
                    )
                    
                    # Verify the customer was created with correct data
                    if (customer.get("name") == customer_data["name"] and 
                        customer.get("contact_no") == customer_data["contact_no"]):
                        
                        self.log_result(
                            "Customer Data Validation",
                            True,
                            "Customer data matches input data",
                            {
                                "name_match": customer.get("name") == customer_data["name"],
                                "contact_match": customer.get("contact_no") == customer_data["contact_no"]
                            }
                        )
                        return customer_id
                    else:
                        self.log_result(
                            "Customer Data Validation",
                            False,
                            "Customer data does not match input data",
                            {
                                "expected_name": customer_data["name"],
                                "actual_name": customer.get("name"),
                                "expected_contact": customer_data["contact_no"],
                                "actual_contact": customer.get("contact_no")
                            }
                        )
                        return None
                else:
                    self.log_result(
                        "Customer Creation Without Password",
                        False,
                        "Invalid response structure from customer creation API",
                        {"response": data}
                    )
                    return None
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Customer Creation Without Password",
                    False,
                    f"Failed to create customer: {error_msg}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return None
                
        except Exception as e:
            self.log_result(
                "Customer Creation Without Password Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return None
    
    def test_customer_creation_with_password(self):
        """Test 2: Create customer WITH explicit password (normal flow)"""
        print("\n=== Testing Customer Creation WITH Password ===")
        
        try:
            # Generate test data with password
            contact_no = self.generate_random_contact()
            customer_data = self.create_test_customer_data(include_password=True, contact_no=contact_no)
            
            print(f"Creating customer with contact: {contact_no}")
            print(f"Provided password: {customer_data['password']}")
            
            # Make API call
            response = self.session.post(ADMIN_ENDPOINTS["customer_create"], json=customer_data)
            
            if response.status_code == 201:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    customer = data.get("data", {})
                    customer_id = customer.get("_id")
                    
                    self.created_customers.append(customer_id)
                    
                    self.log_result(
                        "Customer Creation With Password",
                        True,
                        f"Customer created successfully with provided password",
                        {
                            "customer_id": customer_id,
                            "name": customer.get("name"),
                            "contact_no": customer.get("contact_no"),
                            "password_provided": True
                        }
                    )
                    
                    # Verify the customer was created with correct data
                    if (customer.get("name") == customer_data["name"] and 
                        customer.get("contact_no") == customer_data["contact_no"]):
                        
                        self.log_result(
                            "Customer Data Validation With Password",
                            True,
                            "Customer data matches input data",
                            {
                                "name_match": customer.get("name") == customer_data["name"],
                                "contact_match": customer.get("contact_no") == customer_data["contact_no"]
                            }
                        )
                        return customer_id
                    else:
                        self.log_result(
                            "Customer Data Validation With Password",
                            False,
                            "Customer data does not match input data",
                            {
                                "expected_name": customer_data["name"],
                                "actual_name": customer.get("name"),
                                "expected_contact": customer_data["contact_no"],
                                "actual_contact": customer.get("contact_no")
                            }
                        )
                        return None
                else:
                    self.log_result(
                        "Customer Creation With Password",
                        False,
                        "Invalid response structure from customer creation API",
                        {"response": data}
                    )
                    return None
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Customer Creation With Password",
                    False,
                    f"Failed to create customer: {error_msg}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return None
                
        except Exception as e:
            self.log_result(
                "Customer Creation With Password Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return None
    
    def test_customer_list_verification(self, customer_id):
        """Test 3: Verify created customer appears in customer list"""
        print("\n=== Testing Customer List Verification ===")
        
        if not customer_id:
            self.log_result(
                "Customer List Verification",
                False,
                "No customer ID provided for verification",
                {}
            )
            return False
        
        try:
            # Call customer list API
            response = self.session.get(f"{ADMIN_ENDPOINTS['customer_list']}/{self.test_cafe_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    customers = data.get("data", [])
                    
                    # Look for our created customer
                    customer_found = False
                    for customer in customers:
                        if customer.get("_id") == customer_id:
                            customer_found = True
                            break
                    
                    if customer_found:
                        self.log_result(
                            "Customer List Verification",
                            True,
                            f"Created customer found in customer list",
                            {
                                "customer_id": customer_id,
                                "total_customers": len(customers)
                            }
                        )
                        return True
                    else:
                        self.log_result(
                            "Customer List Verification",
                            False,
                            f"Created customer not found in customer list",
                            {
                                "customer_id": customer_id,
                                "total_customers": len(customers),
                                "customer_ids": [c.get("_id") for c in customers[:5]]  # First 5 IDs
                            }
                        )
                        return False
                else:
                    self.log_result(
                        "Customer List Verification",
                        False,
                        "Invalid response structure from customer list API",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Customer List Verification",
                    False,
                    f"Failed to fetch customer list: {error_msg}",
                    {"status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Customer List Verification Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_duplicate_customer_prevention(self):
        """Test 4: Verify duplicate customer prevention works"""
        print("\n=== Testing Duplicate Customer Prevention ===")
        
        try:
            # Create first customer
            contact_no = self.generate_random_contact()
            customer_data = self.create_test_customer_data(include_password=False, contact_no=contact_no)
            
            # First creation should succeed
            response1 = self.session.post(ADMIN_ENDPOINTS["customer_create"], json=customer_data)
            
            if response1.status_code == 201:
                data1 = response1.json()
                if data1.get("status") and "data" in data1:
                    customer_id = data1["data"].get("_id")
                    self.created_customers.append(customer_id)
                    
                    # Try to create duplicate customer with same contact number
                    customer_data["name"] = "Different Name"  # Change name but keep same contact
                    response2 = self.session.post(ADMIN_ENDPOINTS["customer_create"], json=customer_data)
                    
                    if response2.status_code == 409:  # Conflict status code
                        data2 = response2.json()
                        if not data2.get("status"):  # Should be false for error
                            self.log_result(
                                "Duplicate Customer Prevention",
                                True,
                                "Duplicate customer creation properly prevented",
                                {
                                    "first_customer_id": customer_id,
                                    "duplicate_status_code": response2.status_code,
                                    "error_message": data2.get("message")
                                }
                            )
                            return True
                        else:
                            self.log_result(
                                "Duplicate Customer Prevention",
                                False,
                                "Duplicate customer creation returned success status",
                                {"response": data2}
                            )
                            return False
                    else:
                        self.log_result(
                            "Duplicate Customer Prevention",
                            False,
                            f"Duplicate customer creation did not return expected 409 status code",
                            {
                                "expected_status": 409,
                                "actual_status": response2.status_code,
                                "response": response2.text
                            }
                        )
                        return False
                else:
                    self.log_result(
                        "Duplicate Customer Prevention Setup",
                        False,
                        "Failed to create first customer for duplicate test",
                        {"response": data1}
                    )
                    return False
            else:
                self.log_result(
                    "Duplicate Customer Prevention Setup",
                    False,
                    f"Failed to create first customer: {response1.status_code}",
                    {"response": response1.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Duplicate Customer Prevention Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def run_all_tests(self):
        """Run all tests and return summary"""
        print("🚀 Starting Customer Creation Backend Tests")
        print("=" * 60)
        
        # Setup test data
        if not self.setup_test_data():
            print("❌ Failed to setup test data. Exiting.")
            return {"overall_success": False}
        
        # Test 1: Customer creation without password (booking flow)
        customer_id_1 = self.test_customer_creation_without_password()
        
        # Test 2: Customer creation with password (normal flow)
        customer_id_2 = self.test_customer_creation_with_password()
        
        # Test 3: Verify customer appears in list (using first customer)
        test3_result = self.test_customer_list_verification(customer_id_1)
        
        # Test 4: Duplicate customer prevention
        test4_result = self.test_duplicate_customer_prevention()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed_tests = sum(1 for result in self.test_results if result["success"])
        total_tests = len(self.test_results)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        
        # Detailed results
        print("\n📋 Detailed Results:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['test']}: {result['message']}")
        
        # Critical issues
        critical_issues = [r for r in self.test_results if not r["success"]]
        if critical_issues:
            print("\n🚨 Critical Issues Found:")
            for issue in critical_issues:
                print(f"- {issue['test']}: {issue['message']}")
                if issue.get("details"):
                    print(f"  Details: {issue['details']}")
        
        # Overall result
        test1_result = customer_id_1 is not None
        test2_result = customer_id_2 is not None
        overall_success = test1_result and test2_result and test3_result and test4_result
        
        print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
        
        # Test-specific results
        print(f"\n📝 Test Results Summary:")
        print(f"✅ Customer Creation Without Password: {'PASS' if test1_result else 'FAIL'}")
        print(f"✅ Customer Creation With Password: {'PASS' if test2_result else 'FAIL'}")
        print(f"✅ Customer List Verification: {'PASS' if test3_result else 'FAIL'}")
        print(f"✅ Duplicate Prevention: {'PASS' if test4_result else 'FAIL'}")
        
        return {
            "overall_success": overall_success,
            "test1_without_password": test1_result,
            "test2_with_password": test2_result,
            "test3_list_verification": test3_result,
            "test4_duplicate_prevention": test4_result,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "detailed_results": self.test_results,
            "critical_issues": critical_issues,
            "created_customers": self.created_customers
        }

if __name__ == "__main__":
    tester = CustomerCreationTest()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_success"] else 1)
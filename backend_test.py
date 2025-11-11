#!/usr/bin/env python3
"""
Backend API Testing for Customer Creation Fix
Tests for customer creation without password (booking flow) and with password (normal flow)
"""

import requests
import json
import time
from datetime import datetime
import sys
import random
import string

# Configuration - Backend running on localhost:8002 (Node.js backend)
BASE_URL = "http://localhost:8002/api"
ADMIN_ENDPOINTS = {
    "customer_create": f"{BASE_URL}/admin/customer",
    "customer_list": f"{BASE_URL}/admin/customer/list",
    "customer_details": f"{BASE_URL}/admin/customer"
}

class CustomerCreationTest:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_customers = []
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
    
    def generate_random_contact(self):
        """Generate a random 10-digit contact number"""
        return "9" + "".join(random.choices(string.digits, k=9))
    
    def generate_random_name(self):
        """Generate a random customer name"""
        first_names = ["Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Anita", "Karan", "Meera"]
        last_names = ["Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Nair", "Joshi"]
        return f"{random.choice(first_names)} {random.choice(last_names)}"
    
    def setup_test_data(self):
        """Setup test data - find or create a cafe ID"""
        print("\n=== Setting up test data ===")
        
        # For testing, we'll use a mock cafe ID (MongoDB ObjectId format)
        # In a real scenario, this would be fetched from the database
        self.test_cafe_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format
        
        self.log_result(
            "Test Data Setup",
            True,
            f"Using test cafe ID: {self.test_cafe_id}",
            {"cafe_id": self.test_cafe_id}
        )
        
        return True
    
    def create_test_customer_data(self, include_password=False, contact_no=None):
        """Create test data for customer creation"""
        if not contact_no:
            contact_no = self.generate_random_contact()
            
        data = {
            "cafe": self.test_cafe_id,
            "name": self.generate_random_name(),
            "contact_no": contact_no,
            "email": f"test{int(time.time())}@example.com",
            "age": "25",
            "address": "123 Test Street, Test City",
            "gender": "Male",
            "country": "India",
            "state": "Maharashtra",
            "city": "Mumbai"
        }
        
        if include_password:
            data["password"] = "testpass123"
            
        return data
    
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
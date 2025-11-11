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
                    self.test_cafe_id = data["data"]["cafe"]["_id"]
                    
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
    
    def test_payment_verification_endpoint(self):
        """Test 3: Verify payment verification endpoint exists and responds"""
        print("\n=== Testing Payment Verification Endpoint ===")
        
        try:
            # Create a mock payment verification request
            # Note: This won't be a real payment, just testing endpoint availability
            verification_data = {
                "razorpay_order_id": "order_test_123",
                "razorpay_payment_id": "pay_test_123",
                "razorpay_signature": "test_signature",
                "booking_id": "test_booking_id",
                "amount": 50000,  # 500 rupees in paise
                "paid_amount": 500,
                "total": 500
            }
            
            response = self.session.post(ADMIN_ENDPOINTS["verify_payment"], json=verification_data)
            
            # We expect this to fail with signature verification, but endpoint should exist
            if response.status_code in [400, 500]:  # Expected failure due to invalid signature
                data = response.json() if response.content else {}
                
                # Check if it's a signature verification error (expected)
                if "signature" in str(data.get("message", "")).lower() or "invalid" in str(data.get("message", "")).lower():
                    self.log_result(
                        "Payment Verification Endpoint",
                        True,
                        "Payment verification endpoint exists and responds correctly (signature validation working)",
                        {
                            "status_code": response.status_code,
                            "error_message": data.get("message"),
                            "endpoint_accessible": True
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Payment Verification Endpoint",
                        True,
                        "Payment verification endpoint exists but returned unexpected error",
                        {
                            "status_code": response.status_code,
                            "response": data,
                            "endpoint_accessible": True
                        }
                    )
                    return True
            elif response.status_code == 404:
                self.log_result(
                    "Payment Verification Endpoint",
                    False,
                    "Payment verification endpoint not found",
                    {"status_code": response.status_code}
                )
                return False
            else:
                # Unexpected success or other status
                data = response.json() if response.content else {}
                self.log_result(
                    "Payment Verification Endpoint",
                    True,
                    f"Payment verification endpoint accessible (status: {response.status_code})",
                    {
                        "status_code": response.status_code,
                        "response": data,
                        "endpoint_accessible": True
                    }
                )
                return True
                
        except Exception as e:
            self.log_result(
                "Payment Verification Endpoint Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_multiple_payment_orders(self):
        """Test 4: Create multiple payment orders to test consistency"""
        print("\n=== Testing Multiple Payment Orders ===")
        
        try:
            test_amounts = [100, 250, 500, 1000]  # Different amounts in rupees
            created_orders = []
            
            for amount in test_amounts:
                payment_data = {
                    "amount": amount,
                    "currency": "INR",
                    "receipt": f"test_receipt_{amount}_{int(time.time())}"
                }
                
                response = self.session.post(ADMIN_ENDPOINTS["payment"], json=payment_data)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if data.get("success") and "order" in data:
                        order = data["order"]
                        expected_amount_paise = amount * 100
                        actual_amount = order.get("amount")
                        
                        if actual_amount == expected_amount_paise:
                            created_orders.append({
                                "amount_rupees": amount,
                                "amount_paise": actual_amount,
                                "order_id": order.get("id"),
                                "receipt": order.get("receipt")
                            })
                        else:
                            self.log_result(
                                f"Multiple Orders - Amount {amount}",
                                False,
                                f"Amount conversion failed for ₹{amount}",
                                {
                                    "expected_paise": expected_amount_paise,
                                    "actual_paise": actual_amount
                                }
                            )
                            return False
                    else:
                        self.log_result(
                            f"Multiple Orders - Amount {amount}",
                            False,
                            f"Invalid response structure for ₹{amount}",
                            {"response": data}
                        )
                        return False
                else:
                    self.log_result(
                        f"Multiple Orders - Amount {amount}",
                        False,
                        f"Failed to create order for ₹{amount}",
                        {"status_code": response.status_code}
                    )
                    return False
            
            if len(created_orders) == len(test_amounts):
                self.log_result(
                    "Multiple Payment Orders",
                    True,
                    f"Successfully created {len(created_orders)} payment orders with different amounts",
                    {
                        "orders_created": len(created_orders),
                        "amounts_tested": test_amounts,
                        "all_orders": created_orders
                    }
                )
                return True
            else:
                self.log_result(
                    "Multiple Payment Orders",
                    False,
                    f"Only {len(created_orders)} out of {len(test_amounts)} orders created successfully",
                    {"created_orders": created_orders}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Multiple Payment Orders Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def run_all_tests(self):
        """Run all tests and return summary"""
        print("🚀 Starting Razorpay Payment Integration Backend Tests")
        print("=" * 70)
        
        # Setup - authenticate admin
        if not self.authenticate_admin():
            print("❌ Failed to authenticate admin. Exiting.")
            return {"overall_success": False}
        
        # Test 1: Razorpay credentials configuration
        test1_result = self.test_razorpay_credentials_configuration()
        
        # Test 2: Payment order creation with correct structure
        order_id = self.test_payment_order_creation()
        test2_result = order_id is not None
        
        # Test 3: Payment verification endpoint
        test3_result = self.test_payment_verification_endpoint()
        
        # Test 4: Multiple payment orders
        test4_result = self.test_multiple_payment_orders()
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        
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
        overall_success = test1_result and test2_result and test3_result and test4_result
        
        print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
        
        # Test-specific results
        print(f"\n📝 Test Results Summary:")
        print(f"✅ Razorpay Configuration: {'PASS' if test1_result else 'FAIL'}")
        print(f"✅ Payment Order Creation: {'PASS' if test2_result else 'FAIL'}")
        print(f"✅ Payment Verification Endpoint: {'PASS' if test3_result else 'FAIL'}")
        print(f"✅ Multiple Payment Orders: {'PASS' if test4_result else 'FAIL'}")
        
        # Key findings
        if overall_success:
            print(f"\n🎉 Key Findings:")
            print(f"- Razorpay credentials are properly configured")
            print(f"- Payment endpoint returns correct structure: {{ success: true, order: {{...}} }}")
            print(f"- Amount conversion to paise (×100) is working correctly")
            print(f"- Payment verification endpoint is accessible")
            print(f"- Multiple payment orders can be created consistently")
        
        return {
            "overall_success": overall_success,
            "test1_razorpay_config": test1_result,
            "test2_payment_order": test2_result,
            "test3_verification_endpoint": test3_result,
            "test4_multiple_orders": test4_result,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "detailed_results": self.test_results,
            "critical_issues": critical_issues,
            "created_order_id": order_id
        }

if __name__ == "__main__":
    tester = RazorpayPaymentTest()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_success"] else 1)
#!/usr/bin/env python3
"""
Purchase Order Creation Error Handling Test
Tests the specific error handling scenarios mentioned in the review request
"""

import requests
import json
import time
from datetime import datetime
import sys
import os

# Configuration - Use external URL from environment
BASE_URL = "https://styx-inventory.preview.emergentagent.com/api"

class POErrorHandlingTest:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.admin_token = None
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
        print(f"{status}: {test_name}")
        print(f"   {message}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def authenticate_admin(self):
        """Authenticate as admin and get token"""
        print("=== Authenticating as Admin ===")
        
        try:
            login_data = {
                "email": "styx.mumbai@example.com",
                "password": "admin123"
            }
            
            response = self.session.post(f"{BASE_URL}/auth/admin/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data and "token" in data["data"]:
                    self.admin_token = data["data"]["token"]
                    self.test_cafe_id = data["data"]["cafe"]["_id"]
                    
                    self.log_result(
                        "Admin Authentication",
                        True,
                        f"Successfully authenticated as admin",
                        {
                            "cafe_id": self.test_cafe_id,
                            "token_length": len(self.admin_token) if self.admin_token else 0
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
    
    def test_invalid_objectid_format(self):
        """Test 1: Invalid ObjectId Format"""
        print("=== Test 1: Invalid ObjectId Format ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Invalid ObjectId Format Test",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Create PO data with invalid ObjectId format
            po_data = {
                "cafe": self.test_cafe_id,
                "vendor_id": None,
                "user_type": "Admin",
                "delivery_type": "Organization",
                "delivery_date": "2024-12-31",
                "payment_terms": "Net 30",
                "reference": "TEST-REF-001",
                "description": "Test Purchase Order with Invalid Item ID",
                "items": [
                    {
                        "id": "test_item_123",  # Invalid ObjectId format
                        "qty": 10,
                        "price": 100,
                        "hsn": "1234",
                        "tax": None,
                        "tax_amt": 0,
                        "total": 1000
                    }
                ],
                "subtotal": 1000,
                "discount_value": 0,
                "discount_type": "flat",
                "tax": [],
                "total": 1000,
                "adjustment_amount": 0,
                "internal_team_notes": "Test notes"
            }
            
            response = self.session.post(f"{BASE_URL}/admin/inventory/po", json=po_data, headers=headers)
            
            # Expected: 400 Bad Request with specific error message
            if response.status_code == 400:
                data = response.json()
                expected_message = "Invalid item ID format: test_item_123. Please select valid items."
                
                if not data.get("status") and expected_message in data.get("message", ""):
                    self.log_result(
                        "Invalid ObjectId Format Test",
                        True,
                        "✅ Correctly rejected invalid ObjectId format",
                        {
                            "status_code": response.status_code,
                            "error_message": data.get("message"),
                            "expected_message": expected_message,
                            "validation_working": True
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Invalid ObjectId Format Test",
                        False,
                        f"Wrong error message. Expected: '{expected_message}', Got: '{data.get('message', '')}'",
                        {"response": data}
                    )
                    return False
            else:
                self.log_result(
                    "Invalid ObjectId Format Test",
                    False,
                    f"Expected 400 status code, got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Invalid ObjectId Format Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_valid_objectid_nonexistent_item(self):
        """Test 2: Valid ObjectId but Non-existent Item"""
        print("=== Test 2: Valid ObjectId but Non-existent Item ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Valid ObjectId Non-existent Item Test",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Create PO data with valid ObjectId format but non-existent item
            po_data = {
                "cafe": self.test_cafe_id,
                "vendor_id": None,
                "user_type": "Admin",
                "delivery_type": "Organization",
                "delivery_date": "2024-12-31",
                "payment_terms": "Net 30",
                "reference": "TEST-REF-002",
                "description": "Test Purchase Order with Non-existent Item ID",
                "items": [
                    {
                        "id": "507f1f77bcf86cd799439011",  # Valid ObjectId format but doesn't exist
                        "qty": 5,
                        "price": 200,
                        "hsn": "5678",
                        "tax": None,
                        "tax_amt": 0,
                        "total": 1000
                    }
                ],
                "subtotal": 1000,
                "discount_value": 0,
                "discount_type": "flat",
                "tax": [],
                "total": 1000,
                "adjustment_amount": 0,
                "internal_team_notes": "Test notes"
            }
            
            response = self.session.post(f"{BASE_URL}/admin/inventory/po", json=po_data, headers=headers)
            
            # Expected: 400 Bad Request with specific error message
            if response.status_code == 400:
                data = response.json()
                expected_message = "Item with ID 507f1f77bcf86cd799439011 not found. Please select valid items from inventory."
                
                if not data.get("status") and expected_message in data.get("message", ""):
                    self.log_result(
                        "Valid ObjectId Non-existent Item Test",
                        True,
                        "✅ Correctly rejected non-existent item ID",
                        {
                            "status_code": response.status_code,
                            "error_message": data.get("message"),
                            "expected_message": expected_message,
                            "validation_working": True
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Valid ObjectId Non-existent Item Test",
                        False,
                        f"Wrong error message. Expected: '{expected_message}', Got: '{data.get('message', '')}'",
                        {"response": data}
                    )
                    return False
            else:
                self.log_result(
                    "Valid ObjectId Non-existent Item Test",
                    False,
                    f"Expected 400 status code, got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Valid ObjectId Non-existent Item Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_missing_required_fields(self):
        """Test 3: Missing Required Fields"""
        print("=== Test 3: Missing Required Fields ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Missing Required Fields Test",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test with empty items array
            po_data_empty_items = {
                "cafe": self.test_cafe_id,
                "vendor_id": None,
                "user_type": "Admin",
                "delivery_type": "Organization",
                "delivery_date": "2024-12-31",
                "payment_terms": "Net 30",
                "reference": "TEST-REF-003",
                "description": "Test Purchase Order with Empty Items",
                "items": [],  # Empty items array
                "subtotal": 0,
                "discount_value": 0,
                "discount_type": "flat",
                "tax": [],
                "total": 0,
                "adjustment_amount": 0,
                "internal_team_notes": "Test notes"
            }
            
            response1 = self.session.post(f"{BASE_URL}/admin/inventory/po", json=po_data_empty_items, headers=headers)
            
            # Test with missing items field
            po_data_missing_items = {
                "cafe": self.test_cafe_id,
                "vendor_id": None,
                "user_type": "Admin",
                "delivery_type": "Organization",
                "delivery_date": "2024-12-31",
                "payment_terms": "Net 30",
                "reference": "TEST-REF-004",
                "description": "Test Purchase Order with Missing Items Field",
                # Missing "items" field entirely
                "subtotal": 0,
                "discount_value": 0,
                "discount_type": "flat",
                "tax": [],
                "total": 0,
                "adjustment_amount": 0,
                "internal_team_notes": "Test notes"
            }
            
            response2 = self.session.post(f"{BASE_URL}/admin/inventory/po", json=po_data_missing_items, headers=headers)
            
            # Check both responses
            success_count = 0
            expected_message = "Required fields must be provided"
            
            # Check response 1 (empty items array)
            if response1.status_code == 400:
                data1 = response1.json()
                if not data1.get("status") and expected_message in data1.get("message", ""):
                    success_count += 1
                    print(f"   ✅ Empty items array correctly rejected: {data1.get('message')}")
                else:
                    print(f"   ❌ Empty items array: Wrong error message: {data1.get('message')}")
            else:
                print(f"   ❌ Empty items array: Expected 400, got {response1.status_code}")
            
            # Check response 2 (missing items field)
            if response2.status_code == 400:
                data2 = response2.json()
                if not data2.get("status") and expected_message in data2.get("message", ""):
                    success_count += 1
                    print(f"   ✅ Missing items field correctly rejected: {data2.get('message')}")
                else:
                    print(f"   ❌ Missing items field: Wrong error message: {data2.get('message')}")
            else:
                print(f"   ❌ Missing items field: Expected 400, got {response2.status_code}")
            
            if success_count == 2:
                self.log_result(
                    "Missing Required Fields Test",
                    True,
                    "✅ Both empty items array and missing items field correctly rejected",
                    {
                        "empty_items_status": response1.status_code,
                        "missing_items_status": response2.status_code,
                        "validation_working": True
                    }
                )
                return True
            else:
                self.log_result(
                    "Missing Required Fields Test",
                    False,
                    f"Only {success_count}/2 validation tests passed",
                    {
                        "empty_items_response": response1.text,
                        "missing_items_response": response2.text
                    }
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Missing Required Fields Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_valid_item_id_if_exists(self):
        """Test 4: Valid Item ID (if items exist)"""
        print("=== Test 4: Valid Item ID (if items exist) ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Valid Item ID Test",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # First, try to get existing items from the inventory
            items_response = self.session.get(f"{BASE_URL}/admin/inventory/item/list/{self.test_cafe_id}", headers=headers)
            
            if items_response.status_code == 200:
                items_data = items_response.json()
                items_list = items_data.get("data", [])
                
                if items_list and len(items_list) > 0:
                    # Use the first available item
                    test_item = items_list[0]
                    test_item_id = test_item["_id"]
                    
                    po_data = {
                        "cafe": self.test_cafe_id,
                        "vendor_id": None,
                        "user_type": "Admin",
                        "delivery_type": "Organization",
                        "delivery_date": "2024-12-31",
                        "payment_terms": "Net 30",
                        "reference": "TEST-REF-005",
                        "description": "Test Purchase Order with Valid Item ID",
                        "items": [
                            {
                                "id": test_item_id,  # Valid existing item ID
                                "qty": 2,
                                "price": 150,
                                "hsn": "9999",
                                "tax": None,
                                "tax_amt": 0,
                                "total": 300
                            }
                        ],
                        "subtotal": 300,
                        "discount_value": 0,
                        "discount_type": "flat",
                        "tax": [],
                        "total": 300,
                        "adjustment_amount": 0,
                        "internal_team_notes": "Test notes with valid item"
                    }
                    
                    response = self.session.post(f"{BASE_URL}/admin/inventory/po", json=po_data, headers=headers)
                    
                    # Should proceed further in the flow (may fail on other validations but shouldn't fail on item ID)
                    if response.status_code in [200, 201]:
                        data = response.json()
                        self.log_result(
                            "Valid Item ID Test",
                            True,
                            "✅ Valid item ID accepted and PO creation proceeded",
                            {
                                "status_code": response.status_code,
                                "item_id": test_item_id,
                                "item_name": test_item.get("name", "Unknown"),
                                "po_created": data.get("status", False)
                            }
                        )
                        return True
                    elif response.status_code == 400:
                        data = response.json()
                        error_message = data.get("message", "")
                        
                        # If it fails on item ID validation, that's a problem
                        if "Invalid item ID" in error_message or "not found" in error_message:
                            self.log_result(
                                "Valid Item ID Test",
                                False,
                                f"Valid item ID was rejected: {error_message}",
                                {"item_id": test_item_id, "response": data}
                            )
                            return False
                        else:
                            # Failed on other validation (acceptable)
                            self.log_result(
                                "Valid Item ID Test",
                                True,
                                f"✅ Valid item ID passed validation, failed on other validation: {error_message}",
                                {
                                    "status_code": response.status_code,
                                    "item_id": test_item_id,
                                    "other_validation_error": error_message
                                }
                            )
                            return True
                    else:
                        self.log_result(
                            "Valid Item ID Test",
                            False,
                            f"Unexpected status code: {response.status_code}",
                            {"status_code": response.status_code, "response": response.text}
                        )
                        return False
                else:
                    self.log_result(
                        "Valid Item ID Test",
                        True,
                        "⚠️ No items found in inventory to test with - skipping valid item ID test",
                        {"items_count": len(items_list)}
                    )
                    return True
            else:
                self.log_result(
                    "Valid Item ID Test",
                    False,
                    f"Failed to fetch items list: {items_response.status_code}",
                    {"status_code": items_response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Valid Item ID Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def run_all_tests(self):
        """Run all Purchase Order error handling tests"""
        print("🚀 Starting Purchase Order Error Handling Tests")
        print("=" * 70)
        
        # Authentication
        if not self.authenticate_admin():
            print("❌ Failed to authenticate. Exiting.")
            return {"overall_success": False}
        
        # Run all tests
        test_results = {
            "invalid_objectid_format": self.test_invalid_objectid_format(),
            "valid_objectid_nonexistent_item": self.test_valid_objectid_nonexistent_item(),
            "missing_required_fields": self.test_missing_required_fields(),
            "valid_item_id": self.test_valid_item_id_if_exists()
        }
        
        # Summary
        print("=" * 70)
        print("📊 PURCHASE ORDER ERROR HANDLING TEST SUMMARY")
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
            print(f"{status} {result['test']}")
            print(f"   {result['message']}")
        
        # Critical issues
        critical_issues = [r for r in self.test_results if not r["success"]]
        if critical_issues:
            print("\n🚨 Critical Issues Found:")
            for issue in critical_issues:
                print(f"- {issue['test']}: {issue['message']}")
        
        # Overall result
        overall_success = passed_tests == total_tests
        
        print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
        
        return {
            "overall_success": overall_success,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "detailed_results": self.test_results,
            "critical_issues": critical_issues,
            "test_results": test_results
        }

if __name__ == "__main__":
    tester = POErrorHandlingTest()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_success"] else 1)
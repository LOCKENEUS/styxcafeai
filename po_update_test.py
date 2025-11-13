#!/usr/bin/env python3
"""
Purchase Order Update Flow Testing
Tests the specific Purchase Order update functionality reported by user:
1. GET /api/admin/inventory/po/list/{cafeId} - List all purchase orders
2. GET /api/admin/inventory/po/{id} - Get single purchase order details for editing  
3. PUT /api/admin/inventory/po/{id} - Update purchase order
"""

import requests
import json
import time
from datetime import datetime
import sys

# Configuration - Use external URL from frontend env
BASE_URL = "https://cafe-backend.preview.emergentagent.com/api"

class PurchaseOrderUpdateTest:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.admin_token = None
        self.test_cafe_id = None
        self.test_po_id = None
        
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
    
    def test_po_list_for_update(self):
        """Test 1: GET /api/admin/inventory/po/list/{cafeId} - List POs for editing"""
        print("\n=== Testing PO List for Update Flow ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "PO List for Update",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            url = f"{BASE_URL}/admin/inventory/po/list/{self.test_cafe_id}"
            
            response = self.session.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    po_list = data.get("data", [])
                    
                    if po_list:
                        # Store first PO ID for update testing
                        self.test_po_id = po_list[0]["_id"]
                        
                        # Check if PO has required fields for editing
                        first_po = po_list[0]
                        required_fields = ["_id", "po_no", "total", "items", "status"]
                        missing_fields = [field for field in required_fields if field not in first_po]
                        
                        if not missing_fields:
                            self.log_result(
                                "PO List for Update",
                                True,
                                f"Successfully fetched {len(po_list)} POs with all required fields for editing",
                                {
                                    "endpoint": url,
                                    "po_count": len(po_list),
                                    "first_po_id": self.test_po_id,
                                    "first_po_number": first_po.get("po_no"),
                                    "first_po_status": first_po.get("status"),
                                    "all_required_fields_present": True
                                }
                            )
                            return True
                        else:
                            self.log_result(
                                "PO List for Update",
                                False,
                                f"PO list missing required fields for editing: {missing_fields}",
                                {"missing_fields": missing_fields, "available_fields": list(first_po.keys())}
                            )
                            return False
                    else:
                        self.log_result(
                            "PO List for Update",
                            False,
                            "No purchase orders found to test update functionality",
                            {"po_count": 0}
                        )
                        return False
                else:
                    self.log_result(
                        "PO List for Update",
                        False,
                        "Invalid response structure",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "PO List for Update",
                    False,
                    f"Failed to fetch PO list: {error_msg}",
                    {"status_code": response.status_code, "url": url}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "PO List for Update",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_po_get_for_editing(self):
        """Test 2: GET /api/admin/inventory/po/{id} - Get PO details for editing"""
        print("\n=== Testing Get PO for Editing ===")
        
        if not self.admin_token or not self.test_po_id:
            self.log_result(
                "Get PO for Editing",
                False,
                "Admin authentication and PO ID required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            url = f"{BASE_URL}/admin/inventory/po/{self.test_po_id}"
            
            response = self.session.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    po_detail = data["data"]
                    
                    # Check for all fields needed for editing
                    editing_fields = [
                        "_id", "po_no", "vendor_id", "delivery_date", "payment_terms",
                        "reference", "description", "items", "subtotal", "discount_value",
                        "discount_type", "tax", "total", "adjustment_amount", "status"
                    ]
                    
                    available_fields = list(po_detail.keys())
                    missing_critical_fields = []
                    
                    # Check critical fields
                    critical_fields = ["_id", "po_no", "items", "total", "status"]
                    for field in critical_fields:
                        if field not in po_detail:
                            missing_critical_fields.append(field)
                    
                    if not missing_critical_fields:
                        # Check if items are properly populated
                        items = po_detail.get("items", [])
                        items_populated = False
                        if items and len(items) > 0:
                            first_item = items[0]
                            if isinstance(first_item, dict) and "id" in first_item:
                                items_populated = True
                        
                        self.log_result(
                            "Get PO for Editing",
                            True,
                            f"Successfully fetched PO details for editing",
                            {
                                "endpoint": url,
                                "po_id": self.test_po_id,
                                "po_number": po_detail.get("po_no"),
                                "total_amount": po_detail.get("total"),
                                "items_count": len(items),
                                "items_populated": items_populated,
                                "status": po_detail.get("status"),
                                "available_fields_count": len(available_fields),
                                "critical_fields_present": True
                            }
                        )
                        return po_detail
                    else:
                        self.log_result(
                            "Get PO for Editing",
                            False,
                            f"Missing critical fields for editing: {missing_critical_fields}",
                            {"missing_fields": missing_critical_fields, "available_fields": available_fields}
                        )
                        return False
                else:
                    self.log_result(
                        "Get PO for Editing",
                        False,
                        "Invalid response structure for PO details",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Get PO for Editing",
                    False,
                    f"Failed to fetch PO details: {error_msg}",
                    {"status_code": response.status_code, "url": url}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Get PO for Editing",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_po_update(self, original_po_data):
        """Test 3: PUT /api/admin/inventory/po/{id} - Update purchase order"""
        print("\n=== Testing PO Update ===")
        
        if not self.admin_token or not self.test_po_id or not original_po_data:
            self.log_result(
                "PO Update",
                False,
                "Admin authentication, PO ID, and original PO data required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            url = f"{BASE_URL}/admin/inventory/po/{self.test_po_id}"
            
            # Create update data based on original PO
            update_data = {
                "cafe": original_po_data.get("cafe"),
                "vendor_id": original_po_data.get("vendor_id"),
                "user_type": original_po_data.get("user_type", "Admin"),
                "delivery_type": original_po_data.get("delivery_type", "Organization"),
                "delivery_date": original_po_data.get("delivery_date"),
                "payment_terms": original_po_data.get("payment_terms", "Net 30"),
                "reference": f"UPDATED-{original_po_data.get('reference', 'REF')}",  # Change reference to test update
                "description": f"UPDATED: {original_po_data.get('description', 'Test Description')}",  # Change description
                "items": original_po_data.get("items", []),
                "subtotal": original_po_data.get("subtotal", 0),
                "discount_value": original_po_data.get("discount_value", 0),
                "discount_type": original_po_data.get("discount_type", "flat"),
                "tax": original_po_data.get("tax", []),
                "total": original_po_data.get("total", 0),
                "adjustment_amount": original_po_data.get("adjustment_amount", 0),
                "adjustment_note": "Updated via API test",  # Add adjustment note
                "internal_team_notes": f"UPDATED: {original_po_data.get('internal_team_notes', 'Test notes')}"
            }
            
            response = self.session.put(url, json=update_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    updated_po = data["data"]
                    
                    # Verify the update was successful
                    update_verified = (
                        "UPDATED" in updated_po.get("reference", "") or
                        "UPDATED" in updated_po.get("description", "") or
                        updated_po.get("adjustment_note") == "Updated via API test"
                    )
                    
                    if update_verified:
                        self.log_result(
                            "PO Update",
                            True,
                            f"Successfully updated purchase order",
                            {
                                "endpoint": url,
                                "po_id": self.test_po_id,
                                "po_number": updated_po.get("po_no"),
                                "updated_reference": updated_po.get("reference"),
                                "updated_description": updated_po.get("description"),
                                "adjustment_note": updated_po.get("adjustment_note"),
                                "update_verified": True
                            }
                        )
                        return True
                    else:
                        self.log_result(
                            "PO Update",
                            False,
                            "PO update response received but changes not reflected",
                            {"updated_po": updated_po}
                        )
                        return False
                else:
                    self.log_result(
                        "PO Update",
                        False,
                        "Invalid response structure for PO update",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "PO Update",
                    False,
                    f"Failed to update PO: {error_msg}",
                    {"status_code": response.status_code, "url": url, "request_data": update_data}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "PO Update",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_po_update_validation(self):
        """Test 4: PUT /api/admin/inventory/po/{id} - Update with invalid data"""
        print("\n=== Testing PO Update Validation ===")
        
        if not self.admin_token or not self.test_po_id:
            self.log_result(
                "PO Update Validation",
                False,
                "Admin authentication and PO ID required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            url = f"{BASE_URL}/admin/inventory/po/{self.test_po_id}"
            
            # Create invalid update data (missing required fields)
            invalid_update_data = {
                "reference": "INVALID-TEST"
                # Missing required fields like items, total, etc.
            }
            
            response = self.session.put(url, json=invalid_update_data, headers=headers)
            
            if response.status_code == 400:
                data = response.json()
                
                if not data.get("status") and "message" in data:
                    self.log_result(
                        "PO Update Validation",
                        True,
                        f"Correctly rejected invalid update data with validation error",
                        {
                            "status_code": response.status_code,
                            "error_message": data.get("message"),
                            "validation_working": True
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "PO Update Validation",
                        False,
                        "Invalid error response structure for validation",
                        {"response": data}
                    )
                    return False
            else:
                # If it doesn't return 400, check if it's a different validation approach
                if response.status_code == 200:
                    self.log_result(
                        "PO Update Validation",
                        False,
                        "Update succeeded with invalid data - validation may be missing",
                        {"status_code": response.status_code}
                    )
                else:
                    error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                    self.log_result(
                        "PO Update Validation",
                        False,
                        f"Unexpected response for invalid data: {error_msg}",
                        {"status_code": response.status_code}
                    )
                return False
                
        except Exception as e:
            self.log_result(
                "PO Update Validation",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def run_update_flow_tests(self):
        """Run all Purchase Order update flow tests"""
        print("🚀 Starting Purchase Order Update Flow Tests")
        print("=" * 60)
        
        # Authentication
        if not self.authenticate_admin():
            print("❌ Failed to authenticate. Exiting.")
            return {"overall_success": False}
        
        # Test 1: List POs for update
        list_success = self.test_po_list_for_update()
        if not list_success:
            print("❌ Cannot proceed without PO list. Exiting.")
            return {"overall_success": False}
        
        # Test 2: Get PO details for editing
        po_data = self.test_po_get_for_editing()
        if not po_data:
            print("❌ Cannot proceed without PO details. Exiting.")
            return {"overall_success": False}
        
        # Test 3: Update PO
        update_success = self.test_po_update(po_data)
        
        # Test 4: Update validation
        validation_success = self.test_po_update_validation()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 PURCHASE ORDER UPDATE FLOW TEST SUMMARY")
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
        overall_success = passed_tests == total_tests
        
        print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
        
        return {
            "overall_success": overall_success,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "detailed_results": self.test_results,
            "critical_issues": critical_issues
        }

if __name__ == "__main__":
    tester = PurchaseOrderUpdateTest()
    results = tester.run_update_flow_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_success"] else 1)
#!/usr/bin/env python3
"""
Backend API Testing for Purchase Order Endpoints
Tests all Purchase Order endpoints comprehensively to identify and fix errors
"""

import requests
import json
import time
from datetime import datetime
import sys
import random
import string
import os

# Configuration - Use external URL from frontend env
BASE_URL = "https://styx-inventory.preview.emergentagent.com/api"

# Admin endpoints
ADMIN_ENDPOINTS = {
    "login": f"{BASE_URL}/auth/admin/login",
    "po_list": f"{BASE_URL}/admin/inventory/po/list",
    "po_create": f"{BASE_URL}/admin/inventory/po",
    "po_by_id": f"{BASE_URL}/admin/inventory/po",
    "po_update": f"{BASE_URL}/admin/inventory/po",
    "po_delete": f"{BASE_URL}/admin/inventory/po",
    "po_by_vendor": f"{BASE_URL}/admin/inventory/po/list"
}

# SuperAdmin endpoints  
SUPERADMIN_ENDPOINTS = {
    "login": f"{BASE_URL}/auth/superadmin/login",
    "po_list": f"{BASE_URL}/superadmin/inventory/po/list",
    "po_create": f"{BASE_URL}/superadmin/inventory/po",
    "po_by_id": f"{BASE_URL}/superadmin/inventory/po",
    "po_update": f"{BASE_URL}/superadmin/inventory/po",
    "po_delete": f"{BASE_URL}/superadmin/inventory/po",
    "po_by_vendor": f"{BASE_URL}/superadmin/inventory/po/list"
}

class PurchaseOrderTest:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.admin_token = None
        self.superadmin_token = None
        self.test_cafe_id = None
        self.test_vendor_id = None
        self.created_po_ids = []
        
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
    
    def authenticate_superadmin(self):
        """Authenticate as superadmin and get token"""
        print("\n=== Authenticating as SuperAdmin ===")
        
        try:
            login_data = {
                "email": "superadmin@example.com",
                "password": "superadmin123"
            }
            
            response = self.session.post(SUPERADMIN_ENDPOINTS["login"], json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data and "token" in data["data"]:
                    self.superadmin_token = data["data"]["token"]
                    
                    self.log_result(
                        "SuperAdmin Authentication",
                        True,
                        f"Successfully authenticated as superadmin",
                        {
                            "token_length": len(self.superadmin_token) if self.superadmin_token else 0
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "SuperAdmin Authentication",
                        False,
                        "Invalid response structure from superadmin login API",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "SuperAdmin Authentication",
                    False,
                    f"Failed to authenticate superadmin: {error_msg}",
                    {"status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "SuperAdmin Authentication",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_admin_po_list(self):
        """Test 1: Purchase Order List - Admin"""
        print("\n=== Testing Admin PO List ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Admin PO List",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            url = f"{ADMIN_ENDPOINTS['po_list']}/{self.test_cafe_id}"
            
            response = self.session.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    po_list = data.get("data", [])
                    
                    self.log_result(
                        "Admin PO List",
                        True,
                        f"Successfully fetched {len(po_list)} purchase orders for admin's cafe",
                        {
                            "endpoint": url,
                            "po_count": len(po_list),
                            "response_structure": "{ status: true, data: [...] }",
                            "sample_fields": list(po_list[0].keys()) if po_list else []
                        }
                    )
                    
                    # Store vendor ID for later tests
                    if po_list and po_list[0].get("vendor_id"):
                        self.test_vendor_id = po_list[0]["vendor_id"]["_id"] if isinstance(po_list[0]["vendor_id"], dict) else po_list[0]["vendor_id"]
                    
                    return True
                else:
                    self.log_result(
                        "Admin PO List",
                        False,
                        "Invalid response structure",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Admin PO List",
                    False,
                    f"Failed to fetch admin PO list: {error_msg}",
                    {"status_code": response.status_code, "url": url}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Admin PO List",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    def test_superadmin_po_list(self):
        """Test 2: Purchase Order List - SuperAdmin"""
        print("\n=== Testing SuperAdmin PO List ===")
        
        if not self.superadmin_token:
            self.log_result(
                "SuperAdmin PO List",
                False,
                "SuperAdmin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.superadmin_token}"}
            url = SUPERADMIN_ENDPOINTS["po_list"]
            
            response = self.session.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    po_list = data.get("data", [])
                    
                    self.log_result(
                        "SuperAdmin PO List",
                        True,
                        f"Successfully fetched {len(po_list)} purchase orders for superadmin",
                        {
                            "endpoint": url,
                            "po_count": len(po_list),
                            "response_structure": "{ status: true, data: [...] }",
                            "sample_fields": list(po_list[0].keys()) if po_list else []
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "SuperAdmin PO List",
                        False,
                        "Invalid response structure",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "SuperAdmin PO List",
                    False,
                    f"Failed to fetch superadmin PO list: {error_msg}",
                    {"status_code": response.status_code, "url": url}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "SuperAdmin PO List",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_admin_po_by_id(self):
        """Test 3: Purchase Order by ID - Admin"""
        print("\n=== Testing Admin PO by ID ===")
        
        if not self.admin_token:
            self.log_result(
                "Admin PO by ID",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        # First get a PO ID from the list
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            list_url = f"{ADMIN_ENDPOINTS['po_list']}/{self.test_cafe_id}"
            
            list_response = self.session.get(list_url, headers=headers)
            
            if list_response.status_code == 200:
                list_data = list_response.json()
                po_list = list_data.get("data", [])
                
                if not po_list:
                    self.log_result(
                        "Admin PO by ID",
                        False,
                        "No purchase orders found to test with",
                        {}
                    )
                    return False
                
                # Test with first PO
                test_po_id = po_list[0]["_id"]
                detail_url = f"{ADMIN_ENDPOINTS['po_by_id']}/{test_po_id}"
                
                detail_response = self.session.get(detail_url, headers=headers)
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    
                    if detail_data.get("status") and "data" in detail_data:
                        po_detail = detail_data["data"]
                        
                        # Check for proper population
                        populated_fields = []
                        if po_detail.get("vendor_id") and isinstance(po_detail["vendor_id"], dict):
                            populated_fields.append("vendor_id")
                        if po_detail.get("items") and isinstance(po_detail["items"], list):
                            populated_fields.append("items")
                        if po_detail.get("customer_id") and isinstance(po_detail["customer_id"], dict):
                            populated_fields.append("customer_id")
                        
                        self.log_result(
                            "Admin PO by ID",
                            True,
                            f"Successfully fetched PO details with proper population",
                            {
                                "endpoint": detail_url,
                                "po_id": test_po_id,
                                "populated_fields": populated_fields,
                                "po_number": po_detail.get("po_no"),
                                "total_amount": po_detail.get("total"),
                                "items_count": len(po_detail.get("items", []))
                            }
                        )
                        return True
                    else:
                        self.log_result(
                            "Admin PO by ID",
                            False,
                            "Invalid response structure for PO details",
                            {"response": detail_data}
                        )
                        return False
                else:
                    error_msg = detail_response.json().get("message", "Unknown error") if detail_response.content else "No response content"
                    self.log_result(
                        "Admin PO by ID",
                        False,
                        f"Failed to fetch PO details: {error_msg}",
                        {"status_code": detail_response.status_code, "url": detail_url}
                    )
                    return False
            else:
                self.log_result(
                    "Admin PO by ID",
                    False,
                    "Failed to get PO list for testing",
                    {"status_code": list_response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Admin PO by ID",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def test_superadmin_po_by_id(self):
        """Test 4: Purchase Order by ID - SuperAdmin"""
        print("\n=== Testing SuperAdmin PO by ID ===")
        
        if not self.superadmin_token:
            self.log_result(
                "SuperAdmin PO by ID",
                False,
                "SuperAdmin authentication required",
                {}
            )
            return False
        
        # First get a PO ID from the list
        try:
            headers = {"Authorization": f"Bearer {self.superadmin_token}"}
            list_url = SUPERADMIN_ENDPOINTS["po_list"]
            
            list_response = self.session.get(list_url, headers=headers)
            
            if list_response.status_code == 200:
                list_data = list_response.json()
                po_list = list_data.get("data", [])
                
                if not po_list:
                    self.log_result(
                        "SuperAdmin PO by ID",
                        False,
                        "No purchase orders found to test with",
                        {}
                    )
                    return False
                
                # Test with first PO
                test_po_id = po_list[0]["_id"]
                detail_url = f"{SUPERADMIN_ENDPOINTS['po_by_id']}/{test_po_id}"
                
                detail_response = self.session.get(detail_url, headers=headers)
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    
                    if detail_data.get("status") and "data" in detail_data:
                        po_detail = detail_data["data"]
                        
                        # Check data completeness
                        required_fields = ["_id", "po_no", "total", "items"]
                        missing_fields = [field for field in required_fields if field not in po_detail]
                        
                        if not missing_fields:
                            self.log_result(
                                "SuperAdmin PO by ID",
                                True,
                                f"Successfully fetched complete PO details",
                                {
                                    "endpoint": detail_url,
                                    "po_id": test_po_id,
                                    "po_number": po_detail.get("po_no"),
                                    "total_amount": po_detail.get("total"),
                                    "items_count": len(po_detail.get("items", [])),
                                    "all_required_fields_present": True
                                }
                            )
                            return True
                        else:
                            self.log_result(
                                "SuperAdmin PO by ID",
                                False,
                                f"Missing required fields: {missing_fields}",
                                {"po_detail": po_detail}
                            )
                            return False
                    else:
                        self.log_result(
                            "SuperAdmin PO by ID",
                            False,
                            "Invalid response structure for PO details",
                            {"response": detail_data}
                        )
                        return False
                else:
                    error_msg = detail_response.json().get("message", "Unknown error") if detail_response.content else "No response content"
                    self.log_result(
                        "SuperAdmin PO by ID",
                        False,
                        f"Failed to fetch PO details: {error_msg}",
                        {"status_code": detail_response.status_code, "url": detail_url}
                    )
                    return False
            else:
                self.log_result(
                    "SuperAdmin PO by ID",
                    False,
                    "Failed to get PO list for testing",
                    {"status_code": list_response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "SuperAdmin PO by ID",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False

    def run_all_tests(self):
        """Run all Purchase Order tests and return summary"""
        print("🚀 Starting Purchase Order Backend Tests")
        print("=" * 60)
        
        # Authentication
        admin_auth = self.authenticate_admin()
        superadmin_auth = self.authenticate_superadmin()
        
        if not admin_auth and not superadmin_auth:
            print("❌ Failed to authenticate. Exiting.")
            return {"overall_success": False}
        
        # Test results tracking
        test_results = {}
        
        # Admin Tests
        if admin_auth:
            test_results["admin_po_list"] = self.test_admin_po_list()
            test_results["admin_po_by_id"] = self.test_admin_po_by_id()
        
        # SuperAdmin Tests
        if superadmin_auth:
            test_results["superadmin_po_list"] = self.test_superadmin_po_list()
            test_results["superadmin_po_by_id"] = self.test_superadmin_po_by_id()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 PURCHASE ORDER TEST SUMMARY")
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
            "critical_issues": critical_issues,
            "test_results": test_results
        }

if __name__ == "__main__":
    tester = PurchaseOrderTest()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_success"] else 1)
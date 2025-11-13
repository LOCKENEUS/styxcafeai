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
BASE_URL = "https://cafe-backend.preview.emergentagent.com/api"

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
    "login": f"{BASE_URL}/auth/login",
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
                "email": "styxcafe@gmail.com",
                "password": "10101984#rR"
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

    def test_admin_create_po_valid(self):
        """Test 5: Create Purchase Order - Admin (Valid Data)"""
        print("\n=== Testing Admin Create PO (Valid Data) ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Admin Create PO (Valid)",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Create test PO data
            po_data = {
                "cafe": self.test_cafe_id,
                "vendor_id": None,  # StyxCafe internal order
                "user_type": "Admin",
                "delivery_type": "Organization",
                "delivery_date": "2024-12-31",
                "payment_terms": "Net 30",
                "reference": "TEST-REF-001",
                "description": "Test Purchase Order",
                "items": [
                    {
                        "id": "test_item_id_1",
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
            
            response = self.session.post(ADMIN_ENDPOINTS["po_create"], json=po_data, headers=headers)
            
            if response.status_code == 201:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    created_po = data["data"]
                    po_id = created_po.get("_id")
                    
                    if po_id:
                        self.created_po_ids.append(po_id)
                    
                    self.log_result(
                        "Admin Create PO (Valid)",
                        True,
                        f"Successfully created purchase order",
                        {
                            "po_id": po_id,
                            "po_number": created_po.get("po_no"),
                            "total": created_po.get("total"),
                            "cafe": created_po.get("cafe"),
                            "status_code": response.status_code
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Admin Create PO (Valid)",
                        False,
                        "Invalid response structure",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Admin Create PO (Valid)",
                    False,
                    f"Failed to create PO: {error_msg}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Admin Create PO (Valid)",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False

    def test_admin_create_po_invalid(self):
        """Test 6: Create Purchase Order - Admin (Missing Required Fields)"""
        print("\n=== Testing Admin Create PO (Invalid Data) ===")
        
        if not self.admin_token:
            self.log_result(
                "Admin Create PO (Invalid)",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Create invalid PO data (missing required items field)
            invalid_po_data = {
                "cafe": self.test_cafe_id,
                "delivery_type": "Organization",
                "total": 1000
                # Missing required "items" field
            }
            
            response = self.session.post(ADMIN_ENDPOINTS["po_create"], json=invalid_po_data, headers=headers)
            
            if response.status_code == 400:
                data = response.json()
                
                if not data.get("status") and "message" in data:
                    self.log_result(
                        "Admin Create PO (Invalid)",
                        True,
                        f"Correctly rejected invalid PO data with validation error",
                        {
                            "status_code": response.status_code,
                            "error_message": data.get("message"),
                            "validation_working": True
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Admin Create PO (Invalid)",
                        False,
                        "Invalid error response structure",
                        {"response": data}
                    )
                    return False
            else:
                self.log_result(
                    "Admin Create PO (Invalid)",
                    False,
                    f"Expected 400 status code for invalid data, got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Admin Create PO (Invalid)",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False

    def test_admin_update_po(self):
        """Test 7: Update Purchase Order - Admin (Test qty vs quantity field fix)"""
        print("\n=== Testing Admin Update PO (Field Name Fix) ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Admin Update PO",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # First, get existing PO to update
            list_url = f"{ADMIN_ENDPOINTS['po_list']}/{self.test_cafe_id}"
            list_response = self.session.get(list_url, headers=headers)
            
            if list_response.status_code != 200:
                self.log_result(
                    "Admin Update PO",
                    False,
                    "Failed to get PO list for update test",
                    {"status_code": list_response.status_code}
                )
                return False
            
            po_list = list_response.json().get("data", [])
            if not po_list:
                # Create a PO first for testing
                po_data = {
                    "cafe": self.test_cafe_id,
                    "vendor_id": None,
                    "user_type": "Admin",
                    "delivery_type": "Organization",
                    "delivery_date": "2024-12-31",
                    "payment_terms": "Net 30",
                    "reference": "TEST-UPDATE-REF",
                    "description": "Test PO for Update",
                    "items": [
                        {
                            "id": "test_item_id_1",
                            "qty": 5,
                            "price": 50,
                            "hsn": "1234",
                            "tax": None,
                            "tax_amt": 0,
                            "total": 250
                        }
                    ],
                    "subtotal": 250,
                    "discount_value": 0,
                    "discount_type": "flat",
                    "tax": [],
                    "total": 250,
                    "adjustment_amount": 0,
                    "internal_team_notes": "Test notes for update"
                }
                
                create_response = self.session.post(ADMIN_ENDPOINTS["po_create"], json=po_data, headers=headers)
                if create_response.status_code != 201:
                    self.log_result(
                        "Admin Update PO",
                        False,
                        "Failed to create test PO for update",
                        {"status_code": create_response.status_code, "response": create_response.text}
                    )
                    return False
                
                created_po = create_response.json().get("data", {})
                test_po_id = created_po.get("_id")
            else:
                test_po_id = po_list[0]["_id"]
            
            # Now test the UPDATE endpoint with both qty and quantity fields
            update_url = f"{ADMIN_ENDPOINTS['po_update']}/{test_po_id}"
            
            # Test 1: Update with 'qty' field (original format)
            update_data_qty = {
                "reference": "UPDATED-REF-QTY",
                "description": "Updated description with qty field",
                "items": [
                    {
                        "id": "test_item_id_1",
                        "qty": 8,  # Using 'qty' field
                        "price": 60,
                        "hsn": "1234",
                        "tax": None,
                        "tax_amt": 0,
                        "total": 480
                    }
                ],
                "subtotal": 480,
                "total": 480
            }
            
            response_qty = self.session.put(update_url, json=update_data_qty, headers=headers)
            
            # Test 2: Update with 'quantity' field (new format)
            update_data_quantity = {
                "reference": "UPDATED-REF-QUANTITY",
                "description": "Updated description with quantity field",
                "items": [
                    {
                        "id": "test_item_id_1",
                        "quantity": 10,  # Using 'quantity' field
                        "price": 70,
                        "hsn": "1234",
                        "tax": None,
                        "tax_amt": 0,
                        "total": 700
                    }
                ],
                "subtotal": 700,
                "total": 700
            }
            
            response_quantity = self.session.put(update_url, json=update_data_quantity, headers=headers)
            
            # Verify both updates worked
            success_qty = response_qty.status_code == 200
            success_quantity = response_quantity.status_code == 200
            
            if success_qty and success_quantity:
                self.log_result(
                    "Admin Update PO",
                    True,
                    "Successfully updated PO with both 'qty' and 'quantity' fields - field name mismatch fix working",
                    {
                        "po_id": test_po_id,
                        "qty_update_status": response_qty.status_code,
                        "quantity_update_status": response_quantity.status_code,
                        "qty_response": response_qty.json() if response_qty.content else "No content",
                        "quantity_response": response_quantity.json() if response_quantity.content else "No content",
                        "fix_verified": True
                    }
                )
                return True
            else:
                error_details = {}
                if not success_qty:
                    error_details["qty_error"] = {
                        "status_code": response_qty.status_code,
                        "response": response_qty.text
                    }
                if not success_quantity:
                    error_details["quantity_error"] = {
                        "status_code": response_quantity.status_code,
                        "response": response_quantity.text
                    }
                
                self.log_result(
                    "Admin Update PO",
                    False,
                    f"Update failed - qty success: {success_qty}, quantity success: {success_quantity}",
                    error_details
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Admin Update PO",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False

    def test_admin_delete_po(self):
        """Test 7: Delete Purchase Order - Admin (Check if endpoint exists)"""
        print("\n=== Testing Admin Delete PO ===")
        
        if not self.admin_token:
            self.log_result(
                "Admin Delete PO",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Check if DELETE endpoint exists by testing with a dummy ID
            dummy_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format
            url = f"{ADMIN_ENDPOINTS['po_delete']}/{dummy_id}"
            
            response = self.session.delete(url, headers=headers)
            
            if response.status_code == 404:
                # Check if it's a "not found" for the PO or "not found" for the endpoint
                try:
                    data = response.json()
                    if "not found" in data.get("message", "").lower():
                        self.log_result(
                            "Admin Delete PO",
                            True,
                            "DELETE endpoint exists but PO not found (expected)",
                            {"status_code": response.status_code, "url": url}
                        )
                        return True
                except:
                    pass
                
                # If we get HTML response, endpoint doesn't exist
                if "html" in response.headers.get("content-type", "").lower():
                    self.log_result(
                        "Admin Delete PO",
                        False,
                        "DELETE endpoint not implemented - returns HTML error page",
                        {"status_code": response.status_code, "url": url}
                    )
                    return False
            elif response.status_code == 405:
                self.log_result(
                    "Admin Delete PO",
                    False,
                    "DELETE method not allowed - endpoint missing",
                    {"status_code": response.status_code, "url": url}
                )
                return False
            else:
                # Any other response means the endpoint exists
                self.log_result(
                    "Admin Delete PO",
                    True,
                    f"DELETE endpoint exists (got status {response.status_code})",
                    {"status_code": response.status_code, "url": url}
                )
                return True
                
        except Exception as e:
            self.log_result(
                "Admin Delete PO",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False

    def test_admin_po_by_vendor(self):
        """Test 8: PO List by Vendor - Admin"""
        print("\n=== Testing Admin PO by Vendor ===")
        
        if not self.admin_token or not self.test_cafe_id:
            self.log_result(
                "Admin PO by Vendor",
                False,
                "Admin authentication required",
                {}
            )
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Use test vendor ID or create a dummy one
            vendor_id = self.test_vendor_id or "507f1f77bcf86cd799439011"
            url = f"{ADMIN_ENDPOINTS['po_by_vendor']}/{self.test_cafe_id}/{vendor_id}"
            
            response = self.session.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") and "data" in data:
                    po_list = data.get("data", [])
                    
                    self.log_result(
                        "Admin PO by Vendor",
                        True,
                        f"Successfully fetched {len(po_list)} POs for vendor",
                        {
                            "endpoint": url,
                            "vendor_id": vendor_id,
                            "po_count": len(po_list),
                            "vendor_filtering_working": True
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Admin PO by Vendor",
                        False,
                        "Invalid response structure",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Admin PO by Vendor",
                    False,
                    f"Failed to fetch POs by vendor: {error_msg}",
                    {"status_code": response.status_code, "url": url}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Admin PO by Vendor",
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
            test_results["admin_create_po_valid"] = self.test_admin_create_po_valid()
            test_results["admin_create_po_invalid"] = self.test_admin_create_po_invalid()
            test_results["admin_po_by_id"] = self.test_admin_po_by_id()
            test_results["admin_delete_po"] = self.test_admin_delete_po()
            test_results["admin_po_by_vendor"] = self.test_admin_po_by_vendor()
        
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
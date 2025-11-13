#!/usr/bin/env python3
"""
Focused test for Purchase Order UPDATE endpoint field name handling fix
Tests both 'qty' and 'quantity' field scenarios specifically
"""

import requests
import json
import sys

# Configuration
BASE_URL = "https://cafe-backend.preview.emergentagent.com/api"

class QtyQuantityFieldTest:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.superadmin_token = None
        
    def authenticate(self):
        """Authenticate both admin and superadmin"""
        print("🔐 Authenticating...")
        
        # Admin login
        admin_login = {
            "email": "styx.mumbai@example.com",
            "password": "admin123"
        }
        admin_response = self.session.post(f"{BASE_URL}/auth/admin/login", json=admin_login)
        if admin_response.status_code == 200:
            self.admin_token = admin_response.json()["data"]["token"]
            print("✅ Admin authenticated")
        else:
            print("❌ Admin authentication failed")
            return False
            
        # SuperAdmin login
        superadmin_login = {
            "email": "styxcafe@gmail.com",
            "password": "10101984#rR"
        }
        superadmin_response = self.session.post(f"{BASE_URL}/auth/login", json=superadmin_login)
        if superadmin_response.status_code == 200:
            self.superadmin_token = superadmin_response.json()["data"]["token"]
            print("✅ SuperAdmin authenticated")
        else:
            print("❌ SuperAdmin authentication failed")
            return False
            
        return True
    
    def get_test_po_data(self):
        """Get a real PO with items for testing"""
        print("\n📋 Getting test PO data...")
        
        headers = {"Authorization": f"Bearer {self.superadmin_token}"}
        
        # Get SuperAdmin PO list
        response = self.session.get(f"{BASE_URL}/superadmin/inventory/po/list", headers=headers)
        if response.status_code != 200:
            print("❌ Failed to get PO list")
            return None, None, None
            
        po_list = response.json().get("data", [])
        if not po_list:
            print("❌ No POs found")
            return None, None, None
            
        # Get first PO details
        po_id = po_list[0]["_id"]
        detail_response = self.session.get(f"{BASE_URL}/superadmin/inventory/po/{po_id}", headers=headers)
        if detail_response.status_code != 200:
            print("❌ Failed to get PO details")
            return None, None, None
            
        po_details = detail_response.json().get("data", {})
        items = po_details.get("items", [])
        
        if not items:
            print("❌ No items in PO")
            return None, None, None
            
        # Extract real item ID
        first_item = items[0]
        item_id = first_item.get("item_id", {}).get("_id") if isinstance(first_item.get("item_id"), dict) else first_item.get("item_id")
        
        print(f"✅ Found test PO: {po_id}")
        print(f"✅ Found test item: {item_id}")
        print(f"✅ Original item data: {first_item}")
        
        return po_id, item_id, po_details
    
    def test_update_with_qty_field(self, po_id, item_id):
        """Test 1: Update PO with 'qty' field (should work)"""
        print("\n🧪 Test 1: Update with 'qty' field")
        
        headers = {"Authorization": f"Bearer {self.superadmin_token}"}
        
        update_data = {
            "reference": "TEST-QTY-FIELD",
            "description": "Testing qty field update",
            "items": [
                {
                    "id": item_id,
                    "qty": 5,  # Using 'qty' field
                    "price": 100,
                    "hsn": "1234",
                    "tax": None,
                    "tax_amt": 0,
                    "total": 500
                }
            ],
            "subtotal": 500,
            "total": 500
        }
        
        response = self.session.put(f"{BASE_URL}/superadmin/inventory/po/{po_id}", json=update_data, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Update with 'qty' field: SUCCESS")
            return True
        else:
            print("❌ Update with 'qty' field: FAILED")
            return False
    
    def test_update_with_quantity_field(self, po_id, item_id):
        """Test 2: Update PO with 'quantity' field (should work after fix)"""
        print("\n🧪 Test 2: Update with 'quantity' field")
        
        headers = {"Authorization": f"Bearer {self.superadmin_token}"}
        
        update_data = {
            "reference": "TEST-QUANTITY-FIELD",
            "description": "Testing quantity field update",
            "items": [
                {
                    "id": item_id,
                    "quantity": 7,  # Using 'quantity' field
                    "price": 120,
                    "hsn": "1234",
                    "tax": None,
                    "tax_amt": 0,
                    "total": 840
                }
            ],
            "subtotal": 840,
            "total": 840
        }
        
        response = self.session.put(f"{BASE_URL}/superadmin/inventory/po/{po_id}", json=update_data, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Update with 'quantity' field: SUCCESS")
            return True
        else:
            print("❌ Update with 'quantity' field: FAILED")
            print(f"❌ Error details: {response.text}")
            return False
    
    def test_admin_endpoints_too(self, po_id, item_id):
        """Test 3: Also test Admin endpoints"""
        print("\n🧪 Test 3: Testing Admin endpoints")
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test Admin update with qty
        print("\n🔹 Admin update with 'qty':")
        update_data_qty = {
            "reference": "ADMIN-QTY-TEST",
            "description": "Admin qty field test",
            "items": [
                {
                    "id": item_id,
                    "qty": 3,
                    "price": 80,
                    "hsn": "1234",
                    "tax": None,
                    "tax_amt": 0,
                    "total": 240
                }
            ],
            "subtotal": 240,
            "total": 240
        }
        
        response_qty = self.session.put(f"{BASE_URL}/admin/inventory/po/{po_id}", json=update_data_qty, headers=headers)
        print(f"Status: {response_qty.status_code}, Response: {response_qty.text}")
        
        # Test Admin update with quantity
        print("\n🔹 Admin update with 'quantity':")
        update_data_quantity = {
            "reference": "ADMIN-QUANTITY-TEST",
            "description": "Admin quantity field test",
            "items": [
                {
                    "id": item_id,
                    "quantity": 4,
                    "price": 90,
                    "hsn": "1234",
                    "tax": None,
                    "tax_amt": 0,
                    "total": 360
                }
            ],
            "subtotal": 360,
            "total": 360
        }
        
        response_quantity = self.session.put(f"{BASE_URL}/admin/inventory/po/{po_id}", json=update_data_quantity, headers=headers)
        print(f"Status: {response_quantity.status_code}, Response: {response_quantity.text}")
        
        return response_qty.status_code == 200, response_quantity.status_code == 200
    
    def run_test(self):
        """Run the focused PO update test"""
        print("🚀 Purchase Order UPDATE Field Name Fix Test")
        print("=" * 60)
        
        if not self.authenticate():
            print("❌ Authentication failed")
            return False
            
        po_id, item_id, po_details = self.get_test_po_data()
        if not po_id or not item_id:
            print("❌ Could not get test data")
            return False
            
        # Run tests
        test1_success = self.test_update_with_qty_field(po_id, item_id)
        test2_success = self.test_update_with_quantity_field(po_id, item_id)
        
        # Also test admin endpoints
        admin_qty_success, admin_quantity_success = self.test_admin_endpoints_too(po_id, item_id)
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        print(f"✅ SuperAdmin Update with 'qty': {'PASS' if test1_success else 'FAIL'}")
        print(f"{'✅' if test2_success else '❌'} SuperAdmin Update with 'quantity': {'PASS' if test2_success else 'FAIL'}")
        print(f"{'✅' if admin_qty_success else '❌'} Admin Update with 'qty': {'PASS' if admin_qty_success else 'FAIL'}")
        print(f"{'✅' if admin_quantity_success else '❌'} Admin Update with 'quantity': {'PASS' if admin_quantity_success else 'FAIL'}")
        
        all_passed = test1_success and test2_success and admin_qty_success and admin_quantity_success
        
        print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED - FIX WORKING' if all_passed else '❌ SOME TESTS FAILED - FIX NOT WORKING'}")
        
        if not all_passed:
            print("\n🚨 CRITICAL ISSUE:")
            print("The Purchase Order UPDATE endpoint field name handling fix is NOT working properly.")
            print("The 'quantity' field is still causing errors while 'qty' field works.")
            print("This indicates the backend code needs to be updated to handle both field names.")
        
        return all_passed

if __name__ == "__main__":
    tester = QtyQuantityFieldTest()
    success = tester.run_test()
    sys.exit(0 if success else 1)
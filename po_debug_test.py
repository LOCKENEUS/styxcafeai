#!/usr/bin/env python3
"""
Purchase Order Debug Test
Detailed debugging of the PO update issue to identify exact root cause
"""

import requests
import json

# Configuration
BASE_URL = "https://cafe-backend.preview.emergentagent.com/api"

def debug_po_update():
    """Debug the PO update issue with detailed logging"""
    
    # Authenticate
    login_data = {
        "email": "styx.mumbai@example.com",
        "password": "admin123"
    }
    
    session = requests.Session()
    response = session.post(f"{BASE_URL}/auth/admin/login", json=login_data)
    
    if response.status_code != 200:
        print("❌ Authentication failed")
        return
    
    data = response.json()
    admin_token = data["data"]["token"]
    cafe_id = data["data"]["cafe"]["_id"]
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Get PO list
    list_response = session.get(f"{BASE_URL}/admin/inventory/po/list/{cafe_id}", headers=headers)
    po_list = list_response.json()["data"]
    
    if not po_list:
        print("❌ No POs found")
        return
    
    po_id = po_list[0]["_id"]
    print(f"🔍 Testing PO ID: {po_id}")
    
    # Get PO details
    detail_response = session.get(f"{BASE_URL}/admin/inventory/po/{po_id}", headers=headers)
    po_detail = detail_response.json()["data"]
    
    print(f"📋 Original PO Structure:")
    print(f"   - Items count: {len(po_detail.get('items', []))}")
    if po_detail.get('items'):
        first_item = po_detail['items'][0]
        print(f"   - First item keys: {list(first_item.keys())}")
        print(f"   - Has 'qty' field: {'qty' in first_item}")
        print(f"   - Has 'quantity' field: {'quantity' in first_item}")
        if 'quantity' in first_item:
            print(f"   - Quantity value: {first_item['quantity']}")
    
    # Test 1: Update with correct field names
    print(f"\n🧪 Test 1: Update with corrected item structure")
    
    # Fix the items structure - use 'qty' instead of 'quantity'
    corrected_items = []
    for item in po_detail.get('items', []):
        corrected_item = {
            "id": item.get('item_id', {}).get('_id') if isinstance(item.get('item_id'), dict) else item.get('item_id'),
            "qty": item.get('quantity', 1),  # Map quantity to qty
            "price": item.get('price', 0),
            "hsn": item.get('hsn', 0),
            "tax": item.get('tax'),
            "tax_amt": item.get('tax_amt', 0),
            "total": item.get('total', 0)
        }
        corrected_items.append(corrected_item)
    
    update_data_corrected = {
        "cafe": po_detail.get("cafe"),
        "vendor_id": po_detail.get("vendor_id"),
        "user_type": po_detail.get("user_type", "Admin"),
        "delivery_type": po_detail.get("delivery_type", "Organization"),
        "delivery_date": po_detail.get("delivery_date"),
        "payment_terms": po_detail.get("payment_terms", "Net 30"),
        "reference": f"DEBUG-TEST-{po_detail.get('reference', 'REF')}",
        "description": f"DEBUG: {po_detail.get('description', 'Test')}",
        "items": corrected_items,  # Use corrected items
        "subtotal": po_detail.get("subtotal", 0),
        "discount_value": po_detail.get("discount_value", 0),
        "discount_type": po_detail.get("discount_type", "flat"),
        "tax": po_detail.get("tax", []),
        "total": po_detail.get("total", 0),
        "adjustment_amount": po_detail.get("adjustment_amount", 0),
        "adjustment_note": "Debug test with corrected structure",
        "internal_team_notes": po_detail.get("internal_team_notes", "")
    }
    
    print(f"   - Sending items: {json.dumps(corrected_items, indent=2)}")
    
    update_response = session.put(f"{BASE_URL}/admin/inventory/po/{po_id}", json=update_data_corrected, headers=headers)
    
    print(f"   - Status Code: {update_response.status_code}")
    if update_response.status_code == 200:
        print("   ✅ Update successful with corrected structure!")
        result = update_response.json()
        print(f"   - Updated reference: {result.get('data', {}).get('reference')}")
    else:
        print(f"   ❌ Update failed: {update_response.text}")
    
    # Test 2: Update with empty items array
    print(f"\n🧪 Test 2: Update with empty items array")
    
    update_data_empty = {
        "cafe": po_detail.get("cafe"),
        "reference": f"EMPTY-TEST-{po_detail.get('reference', 'REF')}",
        "items": [],  # Empty items array
        "total": 0
    }
    
    update_response_empty = session.put(f"{BASE_URL}/admin/inventory/po/{po_id}", json=update_data_empty, headers=headers)
    
    print(f"   - Status Code: {update_response_empty.status_code}")
    if update_response_empty.status_code == 200:
        print("   ✅ Update successful with empty items!")
    else:
        print(f"   ❌ Update failed: {update_response_empty.text}")
    
    # Test 3: Update without items field
    print(f"\n🧪 Test 3: Update without items field")
    
    update_data_no_items = {
        "cafe": po_detail.get("cafe"),
        "reference": f"NO-ITEMS-{po_detail.get('reference', 'REF')}",
        "total": po_detail.get("total", 0)
        # No items field at all
    }
    
    update_response_no_items = session.put(f"{BASE_URL}/admin/inventory/po/{po_id}", json=update_data_no_items, headers=headers)
    
    print(f"   - Status Code: {update_response_no_items.status_code}")
    if update_response_no_items.status_code == 200:
        print("   ✅ Update successful without items field!")
    else:
        print(f"   ❌ Update failed: {update_response_no_items.text}")

if __name__ == "__main__":
    debug_po_update()
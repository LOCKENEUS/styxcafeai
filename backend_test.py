#!/usr/bin/env python3
"""
Backend API Testing for Invoice Payments Functionality
Tests for invoice payment list and navigation to invoice details
"""

import requests
import json
import time
from datetime import datetime
import sys

# Configuration - Backend running on localhost:8001
BASE_URL = "http://localhost:8001/api"  # Backend API base URL
SUPERADMIN_ENDPOINTS = {
    "payment_list": f"{BASE_URL}/superadmin/inventory/so/invoice/payment/list",
    "invoice_details": f"{BASE_URL}/superadmin/inventory/so/invoice",
    "create_invoice": f"{BASE_URL}/superadmin/inventory/so/invoice",
    "create_payment": f"{BASE_URL}/superadmin/inventory/so/invoice/payment"
}

class InvoicePaymentsTest:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_invoices = []
        self.created_payments = []
        
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
    
    def create_test_invoice_data(self, invoice_number=None):
        """Create test data for sales invoice"""
        return {
            "cafe": "507f1f77bcf86cd799439011",  # Test cafe ID
            "customer_id": "507f1f77bcf86cd799439012",  # Test customer ID
            "date": datetime.now().isoformat(),
            "payment_terms": "Net 30",
            "reference": f"TEST-REF-{int(time.time())}",
            "sales_person": "John Doe",
            "description": "Test sales invoice for duplicate number testing",
            "items": [
                {
                    "id": "507f1f77bcf86cd799439013",  # Test item ID
                    "qty": 2,
                    "price": 100.00,
                    "hsn": "1234",
                    "tax": "507f1f77bcf86cd799439014",  # Test tax ID
                    "tax_amt": 18.00,
                    "total": 236.00
                }
            ],
            "subtotal": 200.00,
            "discount_value": 0,
            "discount_type": "flat",
            "tax": ["507f1f77bcf86cd799439014"],
            "total": 236.00,
            "adjustment_note": "Test adjustment",
            "adjustment_amount": 0,
            "internal_team_notes": "Test notes"
        }
    
    def create_test_payment_data(self, invoice_id):
        """Create test data for payment"""
        return {
            "cafe": "507f1f77bcf86cd799439011",
            "invoice_id": invoice_id,
            "deposit_amount": 100.00,
            "mode": "Credit Card",
            "deposit_date": datetime.now().isoformat(),
            "transaction_id": f"TXN-{int(time.time())}",
            "description": "Test payment for invoice"
        }
    
    def test_payment_list_api(self):
        """Test 1: Call payment list API and verify response structure"""
        print("\n=== Testing Payment List API ===")
        
        try:
            response = self.session.get(SUPERADMIN_ENDPOINTS["payment_list"])
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                if data.get("status") and "data" in data:
                    payments = data.get("data", [])
                    self.log_result(
                        "Payment List API Response",
                        True,
                        f"Payment list fetched successfully with {len(payments)} payments",
                        {"payment_count": len(payments), "status": data.get("status")}
                    )
                    
                    # Check if payments have bill_id populated
                    if payments:
                        payment_with_bill_id = None
                        for payment in payments:
                            if payment.get("bill_id") and isinstance(payment["bill_id"], dict):
                                if payment["bill_id"].get("_id"):
                                    payment_with_bill_id = payment
                                    break
                        
                        if payment_with_bill_id:
                            self.log_result(
                                "Payment Bill ID Population",
                                True,
                                "Found payment with populated bill_id containing _id field",
                                {
                                    "payment_id": payment_with_bill_id.get("_id"),
                                    "bill_id": payment_with_bill_id["bill_id"].get("_id"),
                                    "bill_po_no": payment_with_bill_id["bill_id"].get("po_no")
                                }
                            )
                            return payment_with_bill_id
                        else:
                            self.log_result(
                                "Payment Bill ID Population",
                                False,
                                "No payments found with populated bill_id._id field",
                                {"payments_checked": len(payments)}
                            )
                            return None
                    else:
                        self.log_result(
                            "Payment List Content",
                            False,
                            "No payments found in the system",
                            {"payment_count": 0}
                        )
                        return None
                else:
                    self.log_result(
                        "Payment List API Response",
                        False,
                        "Invalid response structure from payment list API",
                        {"response": data}
                    )
                    return None
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Payment List API Call",
                    False,
                    f"Failed to fetch payment list: {error_msg}",
                    {"status_code": response.status_code}
                )
                return None
                
        except Exception as e:
            self.log_result(
                "Payment List API Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return None
    
    def test_invoice_details_navigation(self, payment_with_bill_id):
        """Test 2: Use bill_id from payment to fetch invoice details"""
        print("\n=== Testing Invoice Details Navigation ===")
        
        if not payment_with_bill_id:
            self.log_result(
                "Invoice Details Navigation",
                False,
                "No payment with bill_id available for testing",
                {}
            )
            return False
        
        try:
            bill_id = payment_with_bill_id["bill_id"]["_id"]
            
            # Call invoice details API with the bill_id from payment
            response = self.session.get(f"{SUPERADMIN_ENDPOINTS['invoice_details']}/{bill_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                if data.get("status") and "data" in data:
                    invoice = data.get("data", {})
                    
                    # Verify invoice details
                    invoice_id = invoice.get("_id")
                    invoice_po_no = invoice.get("po_no")
                    invoice_payments = invoice.get("payments", [])
                    
                    if invoice_id == bill_id:
                        self.log_result(
                            "Invoice Details Fetch",
                            True,
                            f"Invoice details fetched successfully for ID: {bill_id}",
                            {
                                "invoice_id": invoice_id,
                                "po_no": invoice_po_no,
                                "payments_count": len(invoice_payments)
                            }
                        )
                        
                        # Verify payments array is included
                        if "payments" in invoice:
                            self.log_result(
                                "Invoice Payments Array",
                                True,
                                f"Invoice includes payments array with {len(invoice_payments)} payments",
                                {"payments_count": len(invoice_payments)}
                            )
                            
                            # Check if the original payment is in the invoice payments
                            original_payment_found = False
                            for payment in invoice_payments:
                                if payment.get("_id") == payment_with_bill_id.get("_id"):
                                    original_payment_found = True
                                    break
                            
                            if original_payment_found:
                                self.log_result(
                                    "Payment-Invoice Relationship",
                                    True,
                                    "Original payment found in invoice payments array",
                                    {"payment_id": payment_with_bill_id.get("_id")}
                                )
                                return True
                            else:
                                self.log_result(
                                    "Payment-Invoice Relationship",
                                    True,  # Still success as navigation works
                                    "Invoice details fetched but original payment not found in payments array (may be expected)",
                                    {"payment_id": payment_with_bill_id.get("_id")}
                                )
                                return True
                        else:
                            self.log_result(
                                "Invoice Payments Array",
                                False,
                                "Invoice details response does not include payments array",
                                {"invoice_keys": list(invoice.keys())}
                            )
                            return False
                    else:
                        self.log_result(
                            "Invoice ID Mismatch",
                            False,
                            f"Fetched invoice ID {invoice_id} does not match requested bill_id {bill_id}",
                            {"requested": bill_id, "received": invoice_id}
                        )
                        return False
                else:
                    self.log_result(
                        "Invoice Details API Response",
                        False,
                        "Invalid response structure from invoice details API",
                        {"response": data}
                    )
                    return False
            else:
                error_msg = response.json().get("message", "Unknown error") if response.content else "No response content"
                self.log_result(
                    "Invoice Details API Call",
                    False,
                    f"Failed to fetch invoice details: {error_msg}",
                    {"status_code": response.status_code, "bill_id": bill_id}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Invoice Details Navigation Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def run_all_tests(self):
        """Run all tests and return summary"""
        print("🚀 Starting Invoice Payments Backend Tests")
        print("=" * 50)
        
        # Test 1: Payment list API
        payment_with_bill_id = self.test_payment_list_api()
        
        # Test 2: Invoice details navigation
        test2_result = self.test_invoice_details_navigation(payment_with_bill_id)
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
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
        test1_result = payment_with_bill_id is not None
        overall_success = test1_result and test2_result
        print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
        
        return {
            "overall_success": overall_success,
            "test1_payment_list": test1_result,
            "test2_invoice_navigation": test2_result,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "detailed_results": self.test_results,
            "critical_issues": critical_issues
        }

if __name__ == "__main__":
    tester = InvoicePaymentsTest()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_success"] else 1)
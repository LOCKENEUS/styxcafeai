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

# Configuration - Using VITE_API_URL from frontend .env
BASE_URL = "/api"  # Backend API base URL
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
    
    def test_payment_preview_functionality(self):
        """Test 2: Create invoice, add payment, verify payment appears in invoice details"""
        print("\n=== Testing Payment Preview Functionality ===")
        
        try:
            # Use the first created invoice or create a new one
            if self.created_invoices:
                invoice_id = self.created_invoices[0]
                self.log_result(
                    "Using Existing Invoice",
                    True,
                    f"Using invoice ID: {invoice_id}",
                    {"invoice_id": invoice_id}
                )
            else:
                # Create a new invoice for payment testing
                invoice_data = self.create_test_invoice_data()
                response = self.session.post(
                    ADMIN_ENDPOINTS["create_invoice"],
                    json=invoice_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 201:
                    invoice_id = response.json().get("data", {}).get("_id")
                    self.created_invoices.append(invoice_id)
                    self.log_result(
                        "New Invoice for Payment Test",
                        True,
                        f"Created invoice ID: {invoice_id}",
                        {"invoice_id": invoice_id}
                    )
                else:
                    self.log_result(
                        "New Invoice for Payment Test",
                        False,
                        "Failed to create invoice for payment testing",
                        {"response": response.json()}
                    )
                    return False
            
            # Get initial invoice details (before payment)
            response = self.session.get(f"{ADMIN_ENDPOINTS['get_invoice']}/{invoice_id}")
            if response.status_code == 200:
                initial_invoice = response.json().get("data", {})
                initial_payments = initial_invoice.get("payments", [])
                self.log_result(
                    "Initial Invoice Details",
                    True,
                    f"Invoice fetched, initial payments count: {len(initial_payments)}",
                    {"payments_count": len(initial_payments)}
                )
            else:
                self.log_result(
                    "Initial Invoice Details",
                    False,
                    "Failed to fetch initial invoice details",
                    {"status_code": response.status_code}
                )
                return False
            
            # Create a payment for the invoice
            payment_data = self.create_test_payment_data(invoice_id)
            response = self.session.post(
                ADMIN_ENDPOINTS["create_payment"],
                json=payment_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                payment = response.json().get("data", {})
                payment_id = payment.get("_id")
                self.created_payments.append(payment_id)
                self.log_result(
                    "Payment Creation",
                    True,
                    f"Payment created successfully: {payment_id}",
                    {"payment_id": payment_id, "amount": payment_data["deposit_amount"]}
                )
            else:
                error_msg = response.json().get("message", "Unknown error")
                self.log_result(
                    "Payment Creation",
                    False,
                    f"Failed to create payment: {error_msg}",
                    {"status_code": response.status_code, "response": response.json()}
                )
                return False
            
            # Wait a moment for the payment to be processed
            time.sleep(1)
            
            # Get updated invoice details (after payment)
            response = self.session.get(f"{ADMIN_ENDPOINTS['get_invoice']}/{invoice_id}")
            if response.status_code == 200:
                updated_invoice = response.json().get("data", {})
                updated_payments = updated_invoice.get("payments", [])
                
                # Check if payments array exists and contains the new payment
                if "payments" in updated_invoice:
                    if len(updated_payments) > len(initial_payments):
                        # Find the new payment
                        new_payment = None
                        for payment in updated_payments:
                            if payment.get("_id") == payment_id:
                                new_payment = payment
                                break
                        
                        if new_payment:
                            # Verify payment details
                            expected_amount = payment_data["deposit_amount"]
                            actual_amount = new_payment.get("deposit_amount")
                            expected_mode = payment_data["mode"]
                            actual_mode = new_payment.get("mode")
                            
                            if actual_amount == expected_amount and actual_mode == expected_mode:
                                self.log_result(
                                    "Payment Preview Verification",
                                    True,
                                    "Payment correctly appears in invoice details with correct information",
                                    {
                                        "payment_id": payment_id,
                                        "amount": actual_amount,
                                        "mode": actual_mode,
                                        "total_payments": len(updated_payments)
                                    }
                                )
                                return True
                            else:
                                self.log_result(
                                    "Payment Preview Verification",
                                    False,
                                    "Payment details don't match expected values",
                                    {
                                        "expected_amount": expected_amount,
                                        "actual_amount": actual_amount,
                                        "expected_mode": expected_mode,
                                        "actual_mode": actual_mode
                                    }
                                )
                                return False
                        else:
                            self.log_result(
                                "Payment Preview Verification",
                                False,
                                "Created payment not found in invoice payments array",
                                {"payment_id": payment_id, "payments_in_invoice": len(updated_payments)}
                            )
                            return False
                    else:
                        self.log_result(
                            "Payment Preview Verification",
                            False,
                            "Payments count did not increase after payment creation",
                            {
                                "initial_count": len(initial_payments),
                                "updated_count": len(updated_payments)
                            }
                        )
                        return False
                else:
                    self.log_result(
                        "Payment Preview Verification",
                        False,
                        "Payments array not found in invoice details response",
                        {"invoice_keys": list(updated_invoice.keys())}
                    )
                    return False
            else:
                self.log_result(
                    "Updated Invoice Details",
                    False,
                    "Failed to fetch updated invoice details after payment",
                    {"status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Payment Preview Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
    def run_all_tests(self):
        """Run all tests and return summary"""
        print("🚀 Starting Sales Invoice Backend Tests")
        print("=" * 50)
        
        # Test 1: Duplicate invoice numbers
        test1_result = self.test_duplicate_invoice_numbers()
        
        # Test 2: Payment preview functionality  
        test2_result = self.test_payment_preview_functionality()
        
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
        overall_success = test1_result and test2_result
        print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
        
        return {
            "overall_success": overall_success,
            "test1_duplicate_numbers": test1_result,
            "test2_payment_preview": test2_result,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "detailed_results": self.test_results,
            "critical_issues": critical_issues
        }

if __name__ == "__main__":
    tester = SalesInvoiceTest()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_success"] else 1)
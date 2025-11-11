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

class SalesInvoiceTest:
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
    
    def test_duplicate_invoice_numbers(self):
        """Test 1: Create multiple invoices and verify unique invoice numbers"""
        print("\n=== Testing Duplicate Invoice Number Fix ===")
        
        try:
            # Create 3 invoices sequentially
            for i in range(3):
                invoice_data = self.create_test_invoice_data()
                
                response = self.session.post(
                    ADMIN_ENDPOINTS["create_invoice"],
                    json=invoice_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 201:
                    invoice = response.json().get("data", {})
                    invoice_id = invoice.get("_id")
                    so_no = invoice.get("so_no")
                    
                    if invoice_id:
                        self.created_invoices.append(invoice_id)
                    
                    if so_no and so_no.startswith("SI-"):
                        self.log_result(
                            f"Invoice Creation {i+1}",
                            True,
                            f"Invoice created with number: {so_no}",
                            {"invoice_id": invoice_id, "so_no": so_no}
                        )
                    else:
                        self.log_result(
                            f"Invoice Creation {i+1}",
                            False,
                            f"Invalid invoice number format: {so_no}",
                            {"response": response.json()}
                        )
                        return False
                else:
                    error_msg = response.json().get("message", "Unknown error")
                    self.log_result(
                        f"Invoice Creation {i+1}",
                        False,
                        f"Failed to create invoice: {error_msg}",
                        {"status_code": response.status_code, "response": response.json()}
                    )
                    
                    # Check if it's a duplicate key error
                    if "E11000" in error_msg or "duplicate" in error_msg.lower():
                        self.log_result(
                            "Duplicate Key Error Check",
                            False,
                            "E11000 duplicate key error still occurring",
                            {"error": error_msg}
                        )
                        return False
                
                # Small delay between requests
                time.sleep(0.5)
            
            # Verify all invoices have unique numbers
            if len(self.created_invoices) >= 2:
                # Get invoice numbers for comparison
                invoice_numbers = []
                for invoice_id in self.created_invoices:
                    response = self.session.get(f"{ADMIN_ENDPOINTS['get_invoice']}/{invoice_id}")
                    if response.status_code == 200:
                        so_no = response.json().get("data", {}).get("so_no")
                        if so_no:
                            invoice_numbers.append(so_no)
                
                # Check for uniqueness
                if len(invoice_numbers) == len(set(invoice_numbers)):
                    self.log_result(
                        "Invoice Number Uniqueness",
                        True,
                        f"All {len(invoice_numbers)} invoices have unique numbers",
                        {"numbers": invoice_numbers}
                    )
                    return True
                else:
                    duplicates = [num for num in invoice_numbers if invoice_numbers.count(num) > 1]
                    self.log_result(
                        "Invoice Number Uniqueness",
                        False,
                        f"Duplicate invoice numbers found: {duplicates}",
                        {"all_numbers": invoice_numbers}
                    )
                    return False
            else:
                self.log_result(
                    "Invoice Creation Summary",
                    False,
                    f"Only {len(self.created_invoices)} invoices created, expected at least 2",
                    {"created_count": len(self.created_invoices)}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Duplicate Invoice Test",
                False,
                f"Exception occurred: {str(e)}",
                {"exception_type": type(e).__name__}
            )
            return False
    
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
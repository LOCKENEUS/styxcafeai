import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
// import { addPurchaseBillPayment, getPaymentById } from '../../../../store/AdminSlice/Inventory/CollectPurchaseBill';
import { 
  addPurchaseBillPayment as addPayment, 
  getPurchaseBillPaymentById as getPaymentById 
} from '../../../../store/AdminSlice/Inventory/CollectPurchaseBill';

const CollectBillPayment = ({ show, handleClose, maxAmount, invoiceId, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.payments || {});
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  const [showError, setShowError] = useState(false);

  // Reset form data and error state when modal opens
  useEffect(() => {
    if (show) {
      setShowError(false);
      setFormData({
        bill_id: invoiceId,
        deposit_amount: maxAmount,
        mode: 'Cash',
        deposit_date: new Date().toISOString().split('T')[0],
        transaction_id: '',
        description: '',
        cafe: cafeId
      });
    }
  }, [show, maxAmount, invoiceId, cafeId]);

  const [formData, setFormData] = useState({
    bill_id: invoiceId,
    deposit_amount: maxAmount,
    mode: 'Cash',
    deposit_date: new Date().toISOString().split('T')[0],
    transaction_id: '',
    description: '',
    cafe: cafeId
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'deposit_amount') {
      const amount = parseFloat(value);
      if (amount > maxAmount) {
        setShowError(true);
        return; // Don't update the value if it exceeds maxAmount
      }
      setShowError(false);
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.deposit_amount) > maxAmount) {
      setShowError(true);
      return;
    }
    try {
      await dispatch(addPayment(formData)).unwrap();
      // Fetch updated payment data
      await dispatch(getPaymentById(invoiceId));
      // Close modal and trigger success callback
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to collect payment:', error);
      setShowError(true);
    }
  };

  return (
    <Modal style={{ zIndex: 10000 }} show={show} onHide={handleClose} centered >
      <ModalHeader closeButton style={{ backgroundColor: '#bad1f7', padding:"1rem" }}>
        <ModalTitle>Collect Payment</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {showError && (
          <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
            Amount cannot exceed ₹{maxAmount}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Deposit Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="deposit_amount"
                  value={formData.deposit_amount}
                  onChange={handleInputChange}
                  max={maxAmount}
                  min={0}
                  required
                  isInvalid={showError}
                />
                <Form.Control.Feedback type="invalid">
                  Amount cannot exceed ₹{maxAmount}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Maximum allowed amount: ₹{maxAmount}
                </Form.Text>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Money Order">Money Order</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Deposit Date</Form.Label>
                <Form.Control
                  type="date"
                  name="deposit_date"
                  value={formData.deposit_date}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Transaction ID</Form.Label>
                <Form.Control
                  type="text"
                  name="transaction_id"
                  value={formData.transaction_id}
                  onChange={handleInputChange}
                  placeholder="Unique identity"
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short details..."
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading || showError}
        >
          {loading ? 'Collecting...' : 'Collect'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CollectBillPayment;

import React, { useState } from 'react';
import { Button, Row, Col, Form, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";

const CollectPayment = ({ show, handleClose, maxAmount = 0 }) => {
  const [formData, setFormData] = useState({
    deposit_amount: maxAmount,
    payment_mode: 'Cash',
    deposit_date: new Date().toISOString().split('T')[0],
    transaction_id: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSubmit && onSubmit(formData);
    handleClose();
  };

  return (
    <Modal style={{ zIndex: 10000 }} show={show} onHide={handleClose} centered >
      <ModalHeader closeButton style={{ backgroundColor: '#bad1f7' , padding:"1rem" }}>
        <ModalTitle>Collect Payment</ModalTitle>
      </ModalHeader>
      <ModalBody>
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
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select
                  name="payment_mode"
                  value={formData.payment_mode}
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
        <Button variant="primary" onClick={handleSubmit}>
          Collect
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CollectPayment;

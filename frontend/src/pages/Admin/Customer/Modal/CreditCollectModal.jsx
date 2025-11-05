import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreditCollectModal = ({ show, onHide, amount, onCollectCash, onCollectOnline, handleChange, creditTotal}) => {
  // const [amount, setAmount] = useState("");

  const handleCashClick = () => {
    if (amount && parseFloat(amount) > 0) {
      onCollectCash(amount);
      handleChange("");
      onHide();
    }
  };
  
  const handleOnlineClick = () => {                            
    if (amount && parseFloat(amount) > 0) {
      onCollectOnline(amount);
      // handleChange("");
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Collect Credit Amount ( ₹{creditTotal} )</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Enter Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount to collect"
            value={amount}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleCashClick}>
          Collect Cash
        </Button>
        <Button variant="primary" onClick={handleOnlineClick}>
          Collect Online
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreditCollectModal;        
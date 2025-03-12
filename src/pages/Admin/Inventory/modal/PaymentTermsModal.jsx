import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const PaymentTermsModal = ({ show, handleClose}) => {
  return (  
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="bg-light">
        <Modal.Title>Payment Terms</Modal.Title>
        <Button 
          variant="link" 
          className="btn-close" 
          onClick={handleClose}
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => {
          e.preventDefault();
        
          handleClose();
        }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label htmlFor="term_name">Term name</Form.Label>
                <Form.Control
                  id="term_name"
                  name="name" 
                  type="text"
                  placeholder="Net 15"
                
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label htmlFor="term_days">No of days</Form.Label>
                <Form.Control
                  id="term_days"
                  name="days"
                  type="number" 
                  placeholder="15"
                
                  
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Button 
                variant="info"
                className="text-white"
                type="submit"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentTermsModal; 
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const PaymentTermsModal = ({ show, handleClose}) => {
  const [formData,setFormData]=useState({
    term_name: '',
    term_days: '',
  });
  const handleSubmit =()=>{
    console.log("Submit ",formData);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (  
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header  className="bg-info bg-opacity-25 ">
      <h4 className="fs-2 mt-0 mb-4">Payment Terms</h4>
        <Button 
          variant="link" 
          className="btn-close mb-3" 
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
                <Form.Label className='fw-semibold text-muted' htmlFor="term_name">Term name</Form.Label>
                <Form.Control
                  id="term_name"
                  name="term_name" 
                  type="text"
                  placeholder="Net 15"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className='fw-semibold text-muted' htmlFor="term_days">No of days</Form.Label>
                <Form.Control
                  id="term_days"
                  name="term_days"
                  type="number" 
                  placeholder="15"
                  onChange={handleChange}
                  
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Button 
                variant="outline-primary"
                className="mx-2 float-end my-2"
                type="submit"
                onClick={handleSubmit}
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
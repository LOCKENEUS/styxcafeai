import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomField } from '../../../../store/AdminSlice/CustomField';
import { addSaCustomField } from '../../../../store/slices/Inventory/customField';

const PaymentTermsModal = ({ show, handleClose, onCreated }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customFields.loading);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Payment Terms',
    description: 'Custom field for product'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map term_name to name and term_days to code
      const submitData = {
        ...formData,
        name: formData.term_name,
        code: formData.term_days
      };

      const response = await dispatch(addSaCustomField(submitData));
      
      if (onCreated && response) {
        onCreated(response);
      }
      
      handleClose();
      setFormData({
        name: '',
        code: '',
        type: 'Payment Terms',
        description: 'Custom field for product'
      });
    } catch (error) {
      console.error('Error creating payment term:', error);
    }
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
import React from 'react'
import { Button, ListGroup, Modal } from 'react-bootstrap';

const ViewDetails = ({ subscription, onHide }) => {
    return (
      <Modal show={!!subscription} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{subscription?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Description:</span>
              <span>{subscription?.description}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Amount:</span>
              <span>${subscription?.amount}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Discount:</span>
              <span>{subscription?.discount}%</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Tax:</span>
              <span>{subscription?.tax}%</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Total Amount:</span>
              <span className="text-success">${subscription?.totalAmount?.toFixed(2)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Plan:</span>
              <span>{subscription?.plan}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Benefits:</strong>
              <ul className="mt-2">
                {subscription?.benefits?.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Game Benefits:</strong>
              <ul className="mt-2">
                {subscription?.gameBenefits?.map((gameBenefit, index) => (
                  <li key={index}>{gameBenefit}</li>
                ))}
              </ul>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

export default ViewDetails

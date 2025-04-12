import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const GameDeleteModal = ({ show, handleClose, gameId }) => {

    console.log("gameId delete  ",gameId);
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title><h2 className="text-primary fw-bold">Game Delete</h2></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 style={{fontSize: "16px", fontWeight: "500"}}>Are you sure you want to delete this game?</h4>
      </Modal.Body>
      <div className="d-flex justify-content-end align-items-end mb-4 mx-3">
      <Button variant="secondary" className='me-2' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleClose}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default GameDeleteModal;

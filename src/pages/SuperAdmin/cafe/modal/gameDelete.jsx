import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteGame } from '../../../../store/slices/gameSlice';
import { useNavigate } from 'react-router-dom';

const GameDeleteModal = ({ show, handleClose, gameId ,cafeId}) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    

    const handaleDelete = async () => {
      try {
        const result = await dispatch(deleteGame(gameId));
    
        // Optional: Check for success
        if (deleteGame.fulfilled.match(result)) {
          handleClose(); // close modal
          navigate("/superadmin/cafe/viewdetails", {
            state: { cafeId: cafeId },
          });
        } else {
          console.error("Failed to delete game", result);
        }
      } catch (error) {
        console.error("Error deleting game", error);
      }
    };
    
  return (
    <Modal show={show} onHide={handleClose}  
    className='size-xs'
    centered>
      <Modal.Header closeButton>
        <Modal.Title><h2 className="text-primary fw-bold">Game Delete</h2></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 style={{fontSize: "16px"}}>Are you sure you want to delete this game?</h4>
      </Modal.Body>
      <div className="d-flex justify-content-end align-items-end mb-4 mx-3">
      <Button variant="secondary" className='me-2' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handaleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default GameDeleteModal;

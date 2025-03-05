import React, { useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  Card,
  Image,
  Modal,
} from "react-bootstrap";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { updateGame, deleteGame, setSelectedGame } from '../../../store/slices/gameSlice';

const GameDetails = ({ game, onClose, onEdit }) => {
  const dispatch = useDispatch();
  const { selectedGame } = useSelector((state) => state.games);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const handleDeleteGame = () => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      dispatch(deleteGame(game.id));
      onClose();
    }
  };

  return (
    <div className="p-4">
      <Button variant="outline-secondary" onClick={onClose} className="mb-4 text-primary">
        ← Back to List
      </Button>

      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <Card.Title className="text-primary">{game.name}</Card.Title>
            <div className="d-flex gap-2">
              <Button variant="outline-warning" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
            </div>
          </div>

          <Row>
            <Col md={6} className="d-flex justify-content-center align-items-center">
              <dl className="row">
                <dt className="col-sm-5">Type</dt>
                <dd className="col-sm-7">{game.type}</dd>

                {game.type === "Multiplayer" && (
                  <>
                    <dt className="col-sm-5">Players</dt>
                    <dd className="col-sm-7">{game.numberOfPlayers}</dd>
                  </>
                )}

                <dt className="col-sm-5">Prize</dt>
                <dd className="col-sm-7">{game.prize}</dd>

                <dt className="col-sm-5">Zone</dt>
                <dd className="col-sm-7">{game.zone}</dd>

                <dt className="col-sm-5">Players</dt>
                <dd className="col-sm-7">{game.players}</dd>

                <dt className="col-sm-5">Cancellation</dt>
                <dd className="col-sm-7">{game.cancellation}</dd>
              </dl>
            </Col>

            <Col md={6}>
              {game.image && (
                <Image
                  src={game.image || "/placeholder.svg"}
                  fluid
                  thumbnail
                  className="mb-3"
                  alt="Game preview"
                  style={{ height: "20rem" }}
                />
              )}
            </Col>
          </Row>

          <Card className="mt-3">
            <Card.Header className="fw-bold">Game Details</Card.Header>
            <Card.Body>
              <Card.Text>{game.details || "No additional details provided"}</Card.Text>
            </Card.Body>
          </Card>

          {/* Time Slot functionality is commented out for now */}
          {/*
          <Button className="mt-3" variant="outline-info" onClick={() => setShowTimeSlotModal(true)}>
            Add Time Slot
          </Button>

          {timeSlots && timeSlots.length > 0 && (
            <Card className="mt-3">
              <Card.Header className="fw-bold">Time Slots</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Duration (hours)</th>
                      <th className="text-center">Action</th>
                      <th className="text-center">Edit Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, index) => (
                      <tr key={index}>
                        <td>{slot.start}</td>
                        <td>{slot.end}</td>
                        <td>{calculateDuration(slot.start, slot.end)}</td>
                        <td className="text-center">
                          <Button
                            variant="link"
                            onClick={() => handleDeleteTimeSlot(index)}
                            className="text-danger p-0"
                          >
                            <BiTrash size={20} />
                          </Button>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="link"
                            onClick={() => {
                              setEditingSlot({
                                index,
                                start: slot.start,
                                end: slot.end,
                              });
                              setShowEditModal(true);
                            }}
                            className="text-success p-0"
                          >
                            <BiEdit size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
          */}
          

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this game? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteGame();
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GameDetails;
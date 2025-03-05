import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  updateGame,
  deleteGame,
  getGameById,
} from "../../../../store/slices/gameSlice";
import CreateSlot from "../Slots/CreateSlot";
import { deleteslot, getslots } from "../../../../store/slices/slotsSlice";
import { IoMdAdd } from "react-icons/io";

const GameDetails = ({ game, onClose, onEdit, gameId, cafeId }) => {
  const baseURL = import.meta.env.VITE_API_URL;

  const [existingSlot, setExistingSlot] = useState("");
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const { selectedGame } = useSelector((state) => state.games);
  const timeSlots = useSelector((state) => state.slots.slots);

  useEffect(() => {
    if (gameId) {
      dispatch(getGameById(gameId));
    }
  }, [gameId, dispatch]);

  useEffect(() => {
    if (gameId) {
      dispatch(getslots(gameId));
    }
  }, [gameId, dispatch]);

  useEffect(() => {
    if (selectedGame) {
      console.log("Fetched Game Data:", selectedGame);
    }
  }, [selectedGame]);

  const handleEditSlot = (slot) => {
    setExistingSlot(slot);
    setIsEditing(true);
    setShowTimeSlotModal(true);
  };

  const handleDeleteGame = () => {
    dispatch(deleteGame(game._id));
    onClose();
  };

  const handleDeleteSlot = (id) => {
    dispatch(deleteslot(id));
  };

  function calculateDuration(start_time, end_time) {
    const [startHours, startMinutes] = start_time.split(":").map(Number);
    const [endHours, endMinutes] = end_time.split(":").map(Number);

    let start = new Date();
    let end = new Date();

    start.setHours(startHours, startMinutes, 0);
    end.setHours(endHours, endMinutes, 0);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    let diffMs = end - start;
    let diffMinutes = Math.floor(diffMs / (1000 * 60));
    let hours = Math.floor(diffMinutes / 60);
    let minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  return (
    <div className="">
      <Button
        variant="outline-secondary"
        onClick={onClose}
        className="mb-4 text-primary"
      >
        ← Back to List
      </Button>

      <Card className="shadow">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <Card.Title className="text-primary">
              {selectedGame.data.name}
            </Card.Title>
            <div className="d-flex gap-2">
              <Button variant="outline-warning" onClick={onEdit}>
                Edit
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          <Row>
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <dl className="row">
                <dt className="col-sm-5">Type</dt>
                <dd className="col-sm-7">{selectedGame.data.type}</dd>

                {game.type === "Multiplayer" && (
                  <>
                    <dt className="col-sm-5">Players</dt>
                    <dd className="col-sm-7">
                      {selectedGame.data.numberOfPlayers}
                    </dd>
                  </>
                )}

                <dt className="col-sm-5">Price</dt>
                <dd className="col-sm-7">{selectedGame.data.price}</dd>

                <dt className="col-sm-5">Zone</dt>
                <dd className="col-sm-7">{selectedGame.data.zone}</dd>

                <dt className="col-sm-5"> No. of Players</dt>
                <dd className="col-sm-7">{selectedGame.data.players}</dd>

                <dt className="col-sm-5">Cancellation</dt>
                <dd className="col-sm-7">
                  {selectedGame.data.cancellation ? "Yes" : "No"}
                </dd>

                <dt className="col-sm-5">Commission</dt>
                <dd className="col-sm-7">
                  {selectedGame.data.commission}<span>%</span>
                </dd>
              </dl>
            </Col>

            <Col md={6}>
              {selectedGame.data.gameImage && (
                <Image
                  src={`${baseURL}/${selectedGame.data.gameImage}`}
                  fluid
                  thumbnail
                  className="mb-3"
                  alt="Game preview"
                // style={{ height: "20rem" }}
                />
              )}
            </Col>
          </Row>

          <Card className="mt-3">
            <Card.Header className="fw-bold">Game Details</Card.Header>
            <Card.Body>
              <Card.Text>
                {game.details || "No additional details provided"}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Time Slot functionality is commented out for now */}

          <Card className="mt-3">
            <Card.Header className="fw-bold">
              Time Slots
              <IoMdAdd size={20} className="mx-4 border border-2" onClick={() => setShowTimeSlotModal(true)} />
            </Card.Header>
            <Card.Body className="p-0">
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
                  {Array.isArray(timeSlots) && timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => (
                      <tr key={index} >
                        <td>{slot.start_time}</td>
                        <td>{slot.end_time}</td>
                        <td>
                          {calculateDuration(slot.start_time, slot.end_time)}
                        </td>
                        <td className="text-center">
                          <Button variant="link" className="text-danger p-0"
                            onClick={() => handleDeleteSlot(slot._id)}
                          >
                            <BiTrash size={20} />
                          </Button>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="link"
                            className="text-success p-0"
                            onClick={() => handleEditSlot(slot)}
                          >
                            <BiEdit size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <Button
                          className="mt-3"
                          variant="outline-info"
                          onClick={() => setShowTimeSlotModal(true)}
                        >
                          Add Time Slot
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this game? This action cannot be
              undone.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
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

      <CreateSlot
        show={showTimeSlotModal}
        handleClose={() => setShowTimeSlotModal(false)}
        cafeId={cafeId}
        isEditing={isEditing}
        existingSlot={existingSlot}
        gameId={game?._id}
      />
    </div>
  );
};

export default GameDetails;

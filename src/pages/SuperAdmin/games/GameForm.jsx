import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Offcanvas,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import { addGame, updateGame } from '../../../store/slices/gameSlice';
import { selectCafes } from '../../../store/slices/cafeSlice';

const GameForm = ({ showCanvas, handleCloseCanvas, isEditing, editIndex }) => {
  const dispatch = useDispatch();
  const cafes = useSelector(selectCafes);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth < 768 ? "90%" : "50%");

  const initialFormData = {
    name: "",
    type: "Single player",
    numberOfPlayers: "",
    prize: "",
    zone: "Indoor",
    size: "",
    players: "",
    cancellation: "No",
    details: "",
    image: null,
    selectCafe: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? "80%" : "50%");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // // Append all fields except image
    // Object.entries(formData).forEach(([key, value]) => {
    //   if (key !== 'image' && value !== null) {
    //     formDataToSend.append(key, value);
    //     // Log each appended value for debugging
    //     console.log(`Appending ${key}: ${value}`);
    //   }
    // });

    // // Append image file if exists
    // if (formData.image instanceof File) {
    //   formDataToSend.append('image', formData.image);
    //   console.log(`Appending image: ${formData.image.name}`);
    // }

    // Log the entire FormData object for debugging
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    if (isEditing) {
      dispatch(updateGame({ id: formData.id, updatedData: formDataToSend }));
    } else {
      dispatch(addGame(formDataToSend));
    }
    
    // Log the form data to the console
    console.log(formData);
    setFormData(initialFormData);
    handleCloseCanvas();
  };

  return (
    <Offcanvas show={showCanvas} onHide={handleCloseCanvas} style={{ width }} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <h2 className="text-primary fw-bold">{isEditing ? "Edit Game" : "Create New Game"}</h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ padding: "1.4rem" }}>
         <Form onSubmit={handleSubmit} className="rounded-3 bg-white">
          <Form.Group className="mb-2">
            <Form.Label htmlFor="gameName" className="fw-bold text-secondary">Name of Game</Form.Label>
            <Form.Control
              id="gameName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="py-2 border-2"
              placeholder="Enter game name"
            />
          </Form.Group>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label htmlFor="gameType" className="fw-bold text-secondary">Type of Game</Form.Label>
              <Form.Select
                id="gameType"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="form-select-lg border-2"
              >
                <option>Single player</option>
                <option>Multiplayer</option>
              </Form.Select>
              {formData.type === "Multiplayer" && (
                <Form.Group className="mb-2 mt-2">
                  <Form.Label htmlFor="numberOfPlayers" className="fw-bold text-secondary">Number of Players</Form.Label>
                  <Form.Control
                    id="numberOfPlayers"
                    type="number"
                    name="numberOfPlayers"
                    value={formData.numberOfPlayers}
                    onChange={handleInputChange}
                    required
                    className="py-2 border-2"
                    placeholder="Enter number of players"
                  />
                </Form.Group>
              )}
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gamePrize" className="fw-bold text-secondary">Prize of Game</Form.Label>
              <Form.Control
                id="gamePrize"
                type="number"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
                required
                className="py-2 border-2"
                placeholder="Enter prize amount"
              />
            </Col>
          </Row>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label htmlFor="gameZone" className="fw-bold text-secondary">Zone of Game</Form.Label>
              <Form.Select
                id="gameZone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                required
                className="form-select-lg border-2"
              >
                <option>Indoor</option>
                <option>Outdoor</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gamePlayers" className="fw-bold text-secondary">Players of Game</Form.Label>
              <Form.Control
                id="gamePlayers"
                type="text"
                name="players"
                value={formData.players}
                onChange={handleInputChange}
                required
                className="py-2 border-2"
                placeholder="Enter number of players"
              />
            </Col>
          </Row>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label htmlFor="gameCancellation" className="fw-bold text-secondary">Cancellation Option</Form.Label>
              <Form.Select
                id="gameCancellation"
                name="cancellation"
                value={formData.cancellation}
                onChange={handleInputChange}
                required
                className="form-select-lg border-2"
              >
                <option>Yes</option>
                <option>No</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold text-secondary d-block">Upload Image</Form.Label>
              <div className="border-2 align-items-center rounded-3 p-3 bg-light">
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  id="fileUploadLocation"
                  ref={fileInputRef}
                />
                <div className="d-flex justify-content-b gap-6 align-content-center">
                  <div className="d-flex justify-content-center align-items-center">
                    <label
                      style={{ width: "10rem", height: "3rem" }}
                      htmlFor="fileUploadLocation"
                      className="btn btn-outline-primary d-flex justify-content-center align-items-center py-2"
                    >
                      Choose File
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="d-flex position-relative align-items-center gap-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ width: "300px" }}
                      />
                      <div
                        onClick={handleRemoveImage}
                        className="py-1"
                        style={{
                          position: "absolute",
                          top: "-15px",
                          right: "-10px",
                        }}
                      >
                        <TiDeleteOutline color="red" size={35} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gameSize" className="fw-bold text-secondary">Size of Game</Form.Label>
              <Form.Control
                id="gameSize"
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="py-2 border-2"
                placeholder="Enter game size (e.g., 10x10 ft)"
              />
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label htmlFor="gameDetails" className="fw-bold text-secondary">Game Details</Form.Label>
            <Form.Control
              id="gameDetails"
              as="textarea"
              rows={4}
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              required
              className="border-2"
              placeholder="Describe the game details..."
            />
          </Form.Group>


          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="success" type="submit" className="px-4 py-2 fw-bold">
              Save Game
            </Button>
            <Button variant="outline-secondary" onClick={handleCloseCanvas} className="px-4 py-2 fw-bold">
              Cancel
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default GameForm;
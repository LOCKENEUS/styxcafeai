import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Offcanvas,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import { addGame, updateGame } from '../../../../store/slices/gameSlice';
// import { selectCafes } from '../../../store/slices/cafeSlice';

const GameForm = ({ showCanvas, handleCloseCanvas, game, isEditing, cafeId }) => {
  const dispatch = useDispatch();
  // const cafes = useSelector(selectCafes);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth < 768 ? "90%" : "50%");
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    name: "",
    type: "Single",
    price: "",
    zone: "Indoor",
    size: "",
    players: "1",
    cancellation: true,
    details: "",
    gameImage: null,
    cafe: cafeId,
    commission: 0,
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
        setFormData((prev) => ({ ...prev, gameImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
    setFormData((prev) => ({ ...prev, gameImage: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();

    // Append fields directly instead of using a loop
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('zone', formData.zone);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('players', formData.players);
    formDataToSend.append('cancellation', formData.cancellation === "Yes" ? true : false);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('cafe', formData.cafe);
    formDataToSend.append('commission', formData.commission);

    // Append image file if exists
    if (formData.gameImage instanceof File) {
      formDataToSend.append('gameImage', formData.gameImage);
      // console.log(`Appending image: ${formData.gameImage.name}`);
    }
    // Log the entire FormData object for debugging
    // for (let pair of formDataToSend.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
    console.log(formData)

    try {
      if (isEditing) {
        await dispatch(updateGame({ id: formData._id, updatedData: formDataToSend }));
      } else {
        await dispatch(addGame(formDataToSend));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }

    // Reset form data and image preview after submission
    setFormData(initialFormData);
    setImagePreview(null);
    handleCloseCanvas();
  };




  console.log("isEditing", isEditing)
  useEffect(() => {
    if (isEditing && cafeId && game) {
      // Set form data for editing
      setFormData({
        name: game.data.name || "",
        type: game.data.type || "Single",
        price: game.data.price || "",
        zone: game.data.zone || "Indoor",
        size: game.data.size || "1",
        players: game.data.players || "",
        cancellation: game.data.cancellation ? "Yes" : "No",
        details: game.data.details || "",
        gameImage: game.data.gameImage || null,
        cafe: game.data.cafe || cafeId,
        _id: game.data._id,
        commission: game.data.commission || "",
      });
      if (game.data.gameImage) {
        setImagePreview(`${import.meta.env.VITE_API_URL}/${game.data.gameImage}`);
      }
    } else {
      // Reset form when creating new game
      setFormData(initialFormData);
      setImagePreview(null);
    }
  }, [isEditing, cafeId, game]);



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
                  <Form.Label htmlFor="players" className="fw-bold text-secondary">Number of Players</Form.Label>
                  <Form.Control
                    id="players"
                    type="number"
                    name="players"
                    value={formData.players}
                    onChange={handleInputChange}
                    required
                    className="py-2 border-2"
                    placeholder="Enter number of players"
                  />
                </Form.Group>
              )}
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gamePrice" className="fw-bold text-secondary">Price of Game</Form.Label>
              <Form.Control
                id="gamePrice"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="py-2 border-2"
                placeholder="Enter price amount"
              />
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
              <Form.Group className="mb-2">
                <Form.Label htmlFor="gameCommission" className="fw-bold text-secondary">Commission (%)</Form.Label>
                <Form.Control
                  id="gameCommission"
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleInputChange}
                  required
                  className="py-2 border-2"
                  placeholder="Enter commission percentage"
                />
                {/* Display calculated commission */}
                {formData.price && formData.commission && (
                  <div className="mt-2 text-secondary">
                    Calculated Commission: ${(formData.price * (formData.commission / 100)).toFixed(2)}
                  </div>
                )}
              </Form.Group>
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
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Game"
              )}
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
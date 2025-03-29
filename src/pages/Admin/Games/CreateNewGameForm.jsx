import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addGame, updateGame } from '../../../store/slices/gameSlice';
import axios from "axios";

const CreateNewGameForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form state with correct keys matching the backend
  const cafeId = JSON.parse(sessionStorage.getItem('user'))?._id;
  const [formData, setFormData] = useState({
    name: "",
    type: "Single",
    price: "",
    zone: "Indoor",
    size: "",
    players: "1",
    cancellation: true,
    payLater: false,
    details: "",
    gameImage: null,
    existingImage: "",
    cafe: cafeId,
  });

  // Modify useEffect to properly fetch and set game data
  useEffect(() => {
    const fetchGameData = async () => {
      if (id) {
        try {
          const user = JSON.parse(sessionStorage.getItem('user'));
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/superadmin/game/${id}`);
          const gameData = response.data.data;
          
          setFormData({
            name: gameData.name || "",
            type: gameData.type || "Single",
            price: gameData.price || "",
            zone: gameData.zone || "Indoor",
            size: gameData.size || "",
            players: gameData.players || "1",
            cancellation: gameData.cancellation,
            details: gameData.details || "",
            gameImage: null,
            existingImage: gameData.gameImage || "",
            cafe: cafeId,
          });

          // Set image preview if exists
          if (gameData.gameImage) {
            setImagePreview(`${process.env.REACT_APP_API_URL}/${gameData.gameImage}`);
          }
        } catch (error) {
          console.error('Error fetching game data:', error);
        }
      }
    };

    fetchGameData();
  }, [id, cafeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cancellation' ? value === 'Yes' : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, gameImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Modify handleSubmit to properly handle form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('zone', formData.zone);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('players', formData.players);
    formDataToSend.append('cancellation', formData.cancellation);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('cafe', formData.cafe);
    formDataToSend.append('payLater', formData.payLater)

    if (formData.gameImage) {
      formDataToSend.append('gameImage', formData.gameImage);
    }

    try {
      if (id) {
        // Edit mode
        await dispatch(updateGame({ id, updatedData: formDataToSend })).unwrap();
      } else {
        // Create mode
        await dispatch(addGame(formDataToSend)).unwrap();
      }
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Failed to save game:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add handleRemoveImage function
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      existingImage: '',
      gameImage: null
    }));
    setImagePreview(null);
  };

  return (
    <div className="container mt-2">
      <h5>
        <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>
          {id ? "Edit Game" : "Create New Game"}
          </span>
      </h5>
      <div className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Game Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Single">Single player</option>
                  <option value="Multiplayer">Multiplayer</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name of Game</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name of Game"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Zone of Game</Form.Label>
                <Form.Select
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                >
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Size of Game</Form.Label>
                <Form.Control
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="Enter Your Game Dimension"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cancellation Option</Form.Label>
                <Form.Select
                  name="cancellation"
                  value={formData.cancellation ? "Yes" : "No"}
                  onChange={handleInputChange}
                >
                  <option value="Yes">Refundable</option>
                  <option value="No">Non-Refundable</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Game Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter Price of Game"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Players</Form.Label>
                <Form.Control
                  type="number"
                  name="players"
                  value={formData.players}
                  onChange={handleInputChange}
                  placeholder="Enter Number of Players"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="">
                <Form.Label>Upload Image</Form.Label>
                {(formData.existingImage || imagePreview) && (
                  <div className="mb-2">
                    <img
                      src={formData.existingImage ? `${process.env.REACT_APP_API_URL}/${formData.existingImage}` : imagePreview}
                      alt="Game preview"
                      style={{ maxWidth: '150px', height: 'auto', marginBottom: '10px' }}
                    />
                    <div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="mt-2"
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                )}
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Pay Later</Form.Label>
                <Form.Select
                  name="payLater"
                  value={formData.payLater}
                  onChange={handleInputChange}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="">
                <Form.Label>Admin Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Enter Game Description"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-2">
            <Button 
              variant="light" 
              className="me-2" 
              onClick={() => navigate('/admin/dashboard')}
              style={{ backgroundColor: 'white', color: 'black', border: '1px solid gray' }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (id ? "Update Game" : "Create Game")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateNewGameForm;

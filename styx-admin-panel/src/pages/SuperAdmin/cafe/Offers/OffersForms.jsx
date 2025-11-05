import React, { useState, useEffect } from "react";
import { Button, Offcanvas, Form, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addOffer, updateOffer, getOffers } from "../../../../store/slices/offerSlice";
import { getGames } from "../../../../store/slices/gameSlice";

const OfferForm = ({ showCanvas, handleCloseCanvas, offer, cafeId, isEditing, handleCreateNewOffer }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    name: "",
    description: "",
    coupon_code: "",
    type: "on date",
    from_datetime: "",
    to_datetime: "",
    game: "",
    min_amount: "",
    max_amount: "",
    discount: "",
    cafe: cafeId
  };
  const { games, loading: gameLoading, error: gameError } = useSelector((state) => state.games);
  const [width, setWidth] = useState(window.innerWidth < 768 ? "90%" : "50%");

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    dispatch(getGames(cafeId)); // Fetch offers when component mounts
  }, [dispatch]);

  useEffect(() => {
    if (isEditing && offer) {
      setFormData({
        ...offer,
        game: offer.game?._id || offer.game || "", // Handle both nested game object and direct ID
        from_datetime: offer.from_datetime ? offer.from_datetime.split("T")[0] : "",
        to_datetime: offer.to_datetime ? offer.to_datetime.split("T")[0] : "",
      });
    } else {
      setFormData(initialFormData); // Reset form when creating a new offer
    }
  }, [isEditing, offer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate a random coupon code
  const generateCouponCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let coupon = "";
    for (let i = 0; i < 8; i++) {
      coupon += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData((prev) => ({ ...prev, coupon_code: coupon }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        await dispatch(updateOffer({ id: offer._id, data: formData })).unwrap();
      } else {
        await dispatch(addOffer(formData)).unwrap();
      }

      // Refresh the offers list
      dispatch(getOffers());
      
      // Reset form data to initial state
      setFormData(initialFormData);
      
      // Close the form
      handleCloseCanvas();
    } catch (error) {
      console.error("Error saving offer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a handler for canvas close to reset form
  const handleClose = () => {
    setFormData(initialFormData);
    handleCloseCanvas();
  };
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? "80%" : "50%");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Offcanvas show={showCanvas} onHide={handleClose} placement="end" style={{ width }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <h2 className="text-primary fw-bold">{isEditing ? "Edit Offer" : "Create New Offer"}</h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Coupon Code</Form.Label>
            <InputGroup>
              <Form.Control type="text" name="coupon_code" value={formData.coupon_code} onChange={handleInputChange} required />
              <Button variant="primary" onClick={generateCouponCode}>Generate</Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleInputChange} required>
              <option>on date</option>
              <option>on game</option>
              <option>on amount</option>
            </Form.Select>
          </Form.Group>

          {formData.type === "on date" && (
            <>
              <Row>
                <Col>
                  <Form.Label>From Date</Form.Label>
                  <Form.Control type="date" name="from_datetime" value={formData.from_datetime} onChange={handleInputChange} required />
                </Col>
                <Col>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control type="date" name="to_datetime" value={formData.to_datetime} onChange={handleInputChange} required />
                </Col>
              </Row>
            </>
          )}

          {formData.type === "on game" && (
            <Form.Group className="mb-2">
              <Form.Label>Game</Form.Label>
              {gameLoading ? (
                <Spinner animation="border" size="sm" />
              ) : gameError ? (
                <div className="text-danger">{gameError}</div>
              ) : (
                <Form.Select name="game" value={formData.game} onChange={handleInputChange} required>
                  <option value="">Select a Game</option>
                  {games.map((game) => (
                    <option key={game._id} value={game._id}>
                      {game.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
          )}

          {formData.type === "on amount" && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Price Amount Min</Form.Label>
                <Form.Control type="number" name="min_amount" value={formData.min_amount} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Price Amount Max</Form.Label>
                <Form.Control type="number" name="max_amount" value={formData.max_amount} onChange={handleInputChange} required />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-2">
            <Form.Label>Discount (%)</Form.Label>
            <Form.Control type="number" name="discount" value={formData.discount} onChange={handleInputChange} required />
          </Form.Group>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Saving...
                </>
              ) : (
                "Save Offer"
              )}
            </Button>
            <Button variant="outline-secondary" onClick={handleClose}>Cancel</Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OfferForm;

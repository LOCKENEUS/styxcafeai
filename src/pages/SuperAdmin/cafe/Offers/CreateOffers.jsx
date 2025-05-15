import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {  getOffersByCafeId, setSelectedOffer, deleteOffer } from "../../../../store/slices/offerSlice"; 
import OfferForm from "./OffersForms";
import { RiDiscountPercentFill, RiDeleteBin6Fill } from "react-icons/ri";
// import { getGameById } from "../../../../store/slices/gameSlice";
import { FaCalendarAlt, FaGamepad, FaDollarSign } from "react-icons/fa";

const CreateOffers = ({ cafeId }) => {
  const dispatch = useDispatch();
  const { offers, loading, error, selectedOffer } = useSelector((state) => state.offers);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  // const {selectedGame} = useSelector((state) => state.selectedGame)


  
// hand to change 
// useEffect(()=>{
//   // check if offer has game id, if not, dispatch get game by id
//   if (!selectedOffer?.gameId && selectedGame?.id){
//     dispatch(getGameById(selectedGame.id))
//   }  // Add check for gameId in offer data
//  // Add check for offer data to display offer details in the table
// },[dispatch])

  useEffect(() => {
    if (cafeId) {  // Add check for cafeId
      dispatch(getOffersByCafeId(cafeId))
    }
  }, [dispatch, cafeId]);

  const handleEdit = (offer) => {
    dispatch(setSelectedOffer(offer));
    setShowCanvas(true);
  };

  const handleCreateNewOffer = () => {
    dispatch(setSelectedOffer(null));
    setShowCanvas(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteOffer(id));
    setShowDeleteModal(false);
    setOfferToDelete(null);
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    dispatch(setSelectedOffer(null));
  };  

  return (
    <div className="p-1">
      <Card.Header className="fw-bold p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Offer Details</h1>
          <Button variant="primary" onClick={handleCreateNewOffer}>
            Create New Offer
          </Button>
        </div>
      </Card.Header>

      <div className="container mt-4">
        { offers && offers.length > 0 ? (
          <div className="row g-4 justify-content-start">
            {offers.map((offer) => (
              <div key={offer._id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
            <Card
      className="shadow-sm border-1 flex-grow-1 position-relative p-1 offer-card"
      style={{ cursor: "pointer", maxWidth: "25rem", transition: "0.3s", borderRadius: "12px" }}
      onClick={() => handleEdit(offer)}
    >
      {/* Delete Icon */}
      <RiDeleteBin6Fill
        size={22}
        className="position-absolute top-0 end-0 m-2 text-danger"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setOfferToDelete(offer);
          setShowDeleteModal(true);
        }}
      />

      {/* Offer Icon */}
      <div className="d-flex justify-content-center mt-2">
        <RiDiscountPercentFill size={80} className="text-primary" />
      </div>

      {/* Offer Details */}
      <Card.Body className="text-center">
        <Card.Title className="fw-bold text-dark">{offer.name}</Card.Title>
        <Card.Text className="text-muted">{offer.description}</Card.Text>
        
        {/* Discount Badge */}
        <Badge bg="info" className="fs-6 fw-semibold px-3 py-2">{offer.discount}% Off</Badge>

        {/* Offer Type Details */}
        <div className="mt-3">
          {offer.type === "on date" && (
            <Card.Text className="text-muted">
              <FaCalendarAlt className="me-2 text-success" />
              <strong>Valid From:</strong> {new Date(offer.from_datetime).toLocaleDateString()}<br />
              <FaCalendarAlt className="me-2 text-success" />
              <strong>Valid Till:</strong> {new Date(offer.to_datetime).toLocaleDateString()}
            </Card.Text>
          )}

          {offer.type === "on game" && (
            <Card.Text className="text-muted">
              <FaGamepad className="me-2 text-success" />
              <strong>Game:</strong> {offer?.game?.name}
            </Card.Text>
          )}

          {offer.type === "on amount" && (
            <Card.Text className="text-muted">
              <FaDollarSign className="me-2 text-success" />
              <strong>Min Amount:</strong> {offer.min_amount}<br />
              <FaDollarSign className="me-2 text-success" />
              <strong>Max Amount:</strong> {offer.max_amount}
            </Card.Text>
          )}
        </div>
      </Card.Body>
    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center fw-bold py-3">No Offers Available</div>
            )}
          </div>
  

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Offer? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(offerToDelete._id)}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <OfferForm
        handleCreateNewOffer={handleCreateNewOffer}
        showCanvas={showCanvas}
        handleCloseCanvas={handleCloseCanvas}
        isEditing={!!selectedOffer}
        cafeId={cafeId}
        offer={selectedOffer}
      />
    </div>
  );
};

export default CreateOffers;

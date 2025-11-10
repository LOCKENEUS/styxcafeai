import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Modal,
} from "react-bootstrap";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
// import { getOfferById, deleteOffer } from "../../../../store/slices/offerSlice";

const OffersDetails = ({ offerId, onClose, onEdit }) => {
  const dispatch = useDispatch();
  const { selectedOffer } = useSelector((state) => state.offers);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // useEffect(() => {
  //   if (offerId) {
  //     dispatch(getOfferById(offerId));
  //   }
  // }, [offerId, dispatch]);

  // const handleDeleteOffer = () => {
  //   dispatch(deleteOffer(offerId));
  //   onClose();
  // };

  return (
    <div className="p-4">
      <Button variant="outline-secondary" onClick={onClose} className="mb-4 text-primary">
        ← Back to List
      </Button>

      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <Card.Title className="text-primary">{selectedOffer?.data?.title}</Card.Title>
            <div className="d-flex gap-2">
              <Button variant="outline-warning" onClick={onEdit}>Edit</Button>
              <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>Delete</Button>
            </div>
          </div>

          <Table striped bordered hover>
            <tbody>
              <tr>
                <td><strong>Description</strong></td>
                <td>{selectedOffer?.data?.description || "No description provided"}</td>
              </tr>
              <tr>
                <td><strong>Discount</strong></td>
                <td>{selectedOffer?.data?.discount}%</td>
              </tr>
              <tr>
                <td><strong>Validity</strong></td>
                <td>{selectedOffer?.data?.validity}</td>
              </tr>
            </tbody>
          </Table>

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this offer? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={"handleDeleteOffer"}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OffersDetails;

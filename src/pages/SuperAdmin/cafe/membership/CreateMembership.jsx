import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMembershipsByCafeId, setSelectedMembership, deleteMembership } from "../../../../store/slices/MembershipSlice";
import MembershipForm from "./MembershipForm"; // You'll need to create this component
import { RiVipCrownFill, RiDeleteBin6Fill } from "react-icons/ri";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { SiListmonk } from "react-icons/si";

const CreateMembership = ({ cafeId }) => {
  const dispatch = useDispatch();
  const { memberships, loading, error, selectedMembership } = useSelector((state) => state.memberships);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [membershipToDelete, setMembershipToDelete] = useState(null);

  useEffect(() => {
    if (cafeId) {
      dispatch(getMembershipsByCafeId(cafeId));
    }

  }, [dispatch, cafeId]);
  console.log("this is mameber ship sata  :",memberships);

  const handleEdit = (membership) => {
    dispatch(setSelectedMembership(membership));
    setShowCanvas(true);
  };

  const handleCreateNewMembership = () => {
    dispatch(setSelectedMembership(null));
    setShowCanvas(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteMembership(id));
    setShowDeleteModal(false);
    setMembershipToDelete(null);
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    dispatch(setSelectedMembership(null));
  };

  return (
    <div className="p-1">
      <Card.Header className="fw-bold p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Membership Details</h1>
          <Button variant="primary" onClick={handleCreateNewMembership}>
            Create New Membership
          </Button>
        </div>
      </Card.Header>

      <div className="container mt-4">
        {memberships && memberships.length > 0 ? (
          <div className="row g-4 justify-content-start">
            {memberships && memberships.map((membership) => (
              <div key={membership._id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                <Card
                  className="shadow-sm border-1 flex-grow-1 position-relative p-2 membership-card"
                  style={{ cursor: "pointer", maxWidth: "25rem", transition: "0.3s", borderRadius: "12px", fontSize: "1.1rem" }}
                  onClick={() => handleEdit(membership)}
                >
                  <RiDeleteBin6Fill
                    size={22}
                    className="position-absolute top-0 end-0 m-2 text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMembershipToDelete(membership);
                      setShowDeleteModal(true);
                    }}
                  />

                  <div className="d-flex justify-content-center mt-2">
                    <RiVipCrownFill size={80} className="text-primary" />
                  </div>

                  <Card.Body className="text-center">
                    <Card.Title className="fw-bold text-dark">{membership.name}</Card.Title>
                    
                    <Badge bg="info" className="fs-6 fw-semibold px-3 py-2 mb-3">
                      {membership.validity}
                    </Badge>

                    <div className="mt-3">
                      <Card.Text className="text-muted">
                        <FaCalendarAlt className="me-2 text-success" />
                        <strong>Limit:</strong> {membership.limit} slots<br/>
                        <FaDollarSign className="me-2 text-success" />
                        <strong>Details:</strong>
                        <ul className="list-unstyled mt-2">
                          {membership.details.map((detail, index) => (
                    <span className="d-flex align-items-center gap-1"> <SiListmonk />   <li key={index}>{detail}</li></span>
                          ))}
                        </ul>
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center fw-bold py-3">No Memberships Available</div>
        )}
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Membership? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(membershipToDelete._id)}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <MembershipForm
        showCanvas={showCanvas}
        handleCloseCanvas={handleCloseCanvas}
        isEditing={!!selectedMembership}
        cafeId={cafeId}
        membership={selectedMembership}
      />
    </div>
  );
};

export default CreateMembership;

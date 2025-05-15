import React, { useState, useEffect } from "react";
import { Button, Row, Col, Image, Card, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteLocation } from "../../../store/slices/locationSlice";
import { fetchCafes, selectCafes } from "../../../store/slices/cafeSlice";
import { useNavigate } from "react-router-dom";

const ViewDetails = ({ location, index, onClose, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const cafes = useSelector(selectCafes);
  const associatedCafes = cafes.filter(cafe => cafe.location?._id === location._id);
  const navigate = useNavigate()
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    const result = await dispatch(deleteLocation(location?._id));

    if (deleteLocation.fulfilled) {
      setShowDeleteModal(false);
      onClose();
    } else {
      console.error("Failed to save location:", result.payload);
    }
  };

  return (
    <div className="p-3 container">
      <Button
        variant="outline-secondary"
        onClick={onClose}
        className="mb-3  text-primary"
      >
        ← Back to List
      </Button>

      <Card className="shadow">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
            <Card.Title className="text-primary">{location.address}</Card.Title>
            <div className="d-flex gap-2 mt-2 mt-md-0">
              <Button variant="outline-warning" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="outline-danger" onClick={handleDeleteClick}>
                Delete
              </Button>
            </div>
          </div>

          <Row className="g-3">
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <dl className="row w-100">
                <dt className="col-4 col-md-3">City</dt>
                <dd className="col-8 col-md-9">{location.city}</dd>

                <dt className="col-4 col-md-3">State</dt>
                <dd className="col-8 col-md-9">{location.state}</dd>

                <dt className="col-4 col-md-3">Country</dt>
                <dd className="col-8 col-md-9">{location.country}</dd>

                <dt className="col-4 col-md-3">Coordinates</dt>
                <dd className="col-8 col-md-9">
                  {location.lat}, {location.long}
                </dd>
              </dl>
            </Col>

            <Col xs={12} md={6} className="text-center">
              {location.locationImage && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/${location.locationImage}`}
                  fluid
                  thumbnail
                  className="mb-3 w-100"
                  alt="Location preview"
                  style={{ maxHeight: "20rem", objectFit: "cover" }}
                />
              )}
            </Col>
          </Row>

          <Card className="mt-3">
            <Card.Header className="fw-bold">Additional Details</Card.Header>
            <Card.Body>
              <Card.Text>
                {location.details || "No additional details provided"}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Add Cafe Details Section */}
          {associatedCafes.length > 0 && (
            <Card className="mt-3">
              <Card.Header className="fw-bold">Associated Cafes</Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Cafe Name</th>
                        <th>Owner Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Website</th>
                        <th>Images</th>
                      </tr>
                    </thead>
                    <tbody>
                      {associatedCafes.map((cafe) => (
                        <tr
                          key={cafe._id}
                          onClick={() => navigate(`/superadmin/cafe/viewdetails/${cafe._id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="text-primary fw-bold">{cafe.cafe_name}</td>
                          <td>{cafe.name}</td>
                          <td>{cafe.email}</td>
                          <td>{cafe.contact_no}</td>
                          <td>
                            <a href={cafe.website_url} target="_blank" rel="noopener noreferrer">
                              {cafe.website_url}
                            </a>
                          </td>
                          <td>
                            {cafe.cafeImage && (
                              <div className="d-flex gap-2 flex-wrap">
                                {cafe.cafeImage.slice(0, 4).map((image, idx) => (
                                  <Image
                                    key={idx}
                                    src={`${import.meta.env.VITE_API_URL}/${image.trim()}`}
                                    fluid
                                    thumbnail
                                    alt={`Cafe image ${idx + 1}`}
                                    style={{ height: "80px", width: "80px", objectFit: "cover" }}
                                  />
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}


        </Card.Body>
      </Card>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this location? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewDetails;

import { Row, Col, Button, Card, Image, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { deleteCafe, fetchCafes, selectCafes } from "../../../store/slices/cafeSlice";
import { useNavigate, useParams } from "react-router-dom";
import CafeGames from "./Games/CafeGames";
import CreateOffers from "./Offers/CreateOffers";
import { setSelectedGame } from '../../../store/slices/gameSlice';
import CafeForm from './CafeForm';
import CreateMembership from "./membership/CreateMembership";

const ViewDetails = () => {
  const { games, selectedGame } = useSelector((state) => state.games);
  const cafes = useSelector(selectCafes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cafeId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [cafe, setCafe] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [formDataState, setFormDataState] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch]);

  useEffect(() => {
    if (cafes.length > 0) {
      console.log("cafes of kreet ", cafes)
      const selectedCafe = cafes.find(cafe => cafe._id === cafeId);
      if (selectedCafe) {
        setCafe(selectedCafe);
      }
    }
  }, [cafes, cafeId]);

  useEffect(() => {
    dispatch(setSelectedGame(null));
  }, [dispatch]);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCafe(cafeId));
    setShowModal(false);
    navigate('/superadmin/create-cafe');
  };

  const handleEdit = () => {
    const editData = {
      ...cafe,
      editId: cafe._id,
      cafeImage: cafe.cafeImage ? cafe.cafeImage.map(path => path.trim()) : [],
      location: cafe.location ? cafe.location._id : null
    };

    setFormDataState(editData);

    const baseURL = import.meta.env.VITE_API_URL;
    const previews = editData.cafeImage.map(path => `${baseURL}/${path}`);
    setImagePreview(previews);

    setShowCanvas(true);
  };

  if (!cafe) {
    return <div>Loading...</div>;
  }

  const baseURL = import.meta.env.VITE_API_URL;
  const imagePaths = cafe.cafeImage ? cafe.cafeImage.map(path => baseURL + "/" + path.trim()) : [];

  return (
    <div className="p-2">
      <Button variant="outline-secondary" onClick={() => navigate('/superadmin/create-cafe')} className="mb-4 text-primary">
        ← Back to List
      </Button>

      <Card className="shadow">
        <Card.Body className="p-1">
          <div className="d-flex justify-content-between align-items-center p-3  mb-4">
            <Card.Title className="text-primary">{cafe.cafe_name}</Card.Title>
            <div className="d-flex gap-2">
              <Button variant="outline-warning" onClick={handleEdit}>Edit</Button>
              <Button variant="outline-danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>

          <h2 className="text-center mb-4 my-4 text-primary">Cafe Details</h2>

          <Row className="justify-content-start">
            <Col md={8}>
              <Card className=" border-0 rounded-3 p-4">
                <Card.Body>
                  <dl className="row">
                    {Object.entries({
                      Address: cafe.address,
                      State: cafe.location ? cafe.location.state : "State not available",
                      Contact: cafe.contact_no,
                      Email: cafe.email,
                      Owner: cafe.name,
                      Website: (
                        <a
                          href={`http://${cafe.website_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Visit Website
                        </a>
                      ),
                    }).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <dt className="col-sm-4 fw-bold text-secondary">{key}</dt>
                        <dd className="col-sm-8">{value}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </Card.Body>
              </Card>
            </Col>
          </Row>


          {/* -----------------------Gallery------------------- */}
          <h1 className="text-primary fw-bold text-center m-5"> Gallery</h1>
          {imagePaths.length > 0 ? (
            <Row className="g-3">
              {imagePaths.map((imagePath, index) => (
                <Col style={{ width: "32%" }} key={index} xs={12} sm={6} md={4} lg={3}>
                  <div className="gallery-item border rounded-3 shadow-sm overflow-hidden">
                    <Image
                      src={imagePath}
                      fluid
                      alt={`Cafe preview ${index + 1}`}
                      className="gallery-image"
                      style={{
                        objectFit: 'cover',
                        height: '13rem',
                        width: '100%',
                        transition: 'transform 0.3s ease-in-out'
                      }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center text-muted">No images available</p>
          )}

          <style jsx>{`
              .gallery-item:hover .gallery-image {
                transform: scale(1.05);
              }
              .gallery-item {
                border: 2px solid #ddd;
                border-radius: 10px;
                padding: 5px;
                background-color: #f9f9f9;
              }
            `}</style>


        </Card.Body>
      </Card>


      {/* Games Data */}
      <h1 className="text-center mb-8 mt-8 text-primary">Games</h1>

      <Card className="mt-3">
        <Card.Body className="p-2">
          <CafeGames cafeId={cafe._id} />
        </Card.Body>
      </Card>

      {/* Offers data */}
      <h1 className="text-center mb-8 mt-8 text-primary"> Offers</h1>
      <Card className="mt-3">
        {/* <Card.Header className="fw-bold">Game details </Card.Header> */}
        <Card.Body>
          <CreateOffers cafeId={cafe._id} />
        </Card.Body>
      </Card>



      {/* Membership data */}
      <h1 className="text-center mb-8 mt-8 text-primary"> Membership</h1>
      <Card className="mt-3">
        {/* <Card.Header className="fw-bold">Game details </Card.Header> */}
        <Card.Body>
          <CreateMembership cafeId={cafe._id} />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this cafe?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>


      <CafeForm
        showCanvas={showCanvas}
        handleCloseCanvas={() => setShowCanvas(false)}
        isEditing={true}
        cafeData={cafe}
        setFormDataState={setFormDataState}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        initialFormData={{}}
        editingIndex={null}
        width="50%"
        setShowCanvas={setShowCanvas}
        fileInputRef={fileInputRef}
        formDataState={formDataState}
      />
    </div>
  );
};

export default ViewDetails
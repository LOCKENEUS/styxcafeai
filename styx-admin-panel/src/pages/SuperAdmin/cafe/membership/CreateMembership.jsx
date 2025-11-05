import React, { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, Card, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMembershipsByCafeId, setSelectedMembership, deleteMembership } from "../../../../store/slices/MembershipSlice";
import MembershipForm from "./MembershipForm"; // You'll need to create this component
import { RiVipCrownFill, RiDeleteBin6Fill } from "react-icons/ri";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { SiListmonk } from "react-icons/si";
import { Link, useLocation, useParams } from "react-router-dom";
import Add from "/assets/superAdmin/cafe/formkit_addWhite.png";
import FrameKing from '/assets/superAdmin/cafe/FrameKing.png';
import Loader from "../../../../components/common/Loader/Loader";
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png';
import { fetchCafesID } from "../../../../store/slices/cafeSlice";

const CreateMembership = () => {

  // const cafeId = useParams().cafeId;

  const [loadingMembership, setLoadingMembership] = useState(true);
  const location = useLocation();
  const { cafeId } = location.state || {};

  const dispatch = useDispatch();
  const { memberships, loading, error, selectedMembership } = useSelector((state) => state.memberships);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [membershipToDelete, setMembershipToDelete] = useState(null);

  // const [cafe, setCafe] = useState(null);
  useEffect(() => {
    dispatch(fetchCafesID(cafeId));
  }, [cafeId, dispatch]);

  const cafeDetails = useSelector((state) => state.cafes);

  // compare cafeId with cafeDetails.cafeId
  const isCafeIdMatch = cafeDetails.cafes?.find(cafe => cafe._id === cafeId);

  useEffect(() => {
    setLoadingMembership(true);
    if (cafeId) {
      dispatch(getMembershipsByCafeId(cafeId)).finally(() => setLoadingMembership(false));
    }

  }, [dispatch, cafeId]);

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
    <Container fluid>
      <Row className="my-5">
        <Card.Header className="fw-bold">
          <Row className="d-flex justify-content-between align-items-center mb-3">
            <Col sm={6} xs={12} className="d-flex align-items-center">

              <Breadcrumb>
                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>Home</Breadcrumb.Item>
                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                  {/* <Link to={`/superadmin/cafe/viewdetails/${cafeId}`}>Membership Details</Link> */}
                  <Link to="/superadmin/cafe/viewdetails"
                    state={{ cafeId: cafeId }}>
                    Membership Details
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > All Membership </Breadcrumb.Item>
              </Breadcrumb>
            </Col>

            <Col sm={6} xs={12} className="d-flex justify-content-end">
              <Button variant="primary" className="rounded-3" onClick={handleCreateNewMembership}>
                <Image src={Add} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                Create  Membership
              </Button>
            </Col>


          </Row>
        </Card.Header>

        <Col sm={12} className="my-3">
          <Row className="g-3">

            <Col sm={4} className="mb-3">
              <Card className="game-card mx-2 my-1 rounded-4  text-center text-sm-start">
                <div className="d-flex flex-column flex-sm-row align-items-center">
                  <Image
                    src={Rectangle389}
                    alt="CafeCall"
                    className="rounded-circle img-fluid mb-2 mb-sm-0"
                    style={{ objectFit: "cover", width: "50px", height: "50px" }}
                  />
                  <div className="ms-sm-3 ">
                    <h5 className="text-primary " style={{ fontSize: "16px", fontWeight: "500" }}>{isCafeIdMatch?.cafe_name}</h5>
                  </div>
                </div>
              </Card>
            </Col>


            <Col sm={12} className="mb-3">






              <Card
                className="game-card mx-2 rounded-4 shadow-lg p-3 h-100"
                onClick={() => dispatch(getGameById(game._id))}
                style={{ cursor: "pointer" }}
              >


                {
                  loadingMembership || !memberships ? (
                    <div className="text-center py-5">
                      <Loader />
                    </div>
                  ) : (
                    <Row className="d-flex">
                      {memberships && memberships.length > 0 ? (
                        memberships.map((membership, index) => (
                          <Col
                            key={index}
                            sm={6}
                            md={4}
                            xs={12}
                            className="d-flex justify-content-center my-3"
                          >
                            <Card
                              className={`w-100 h-100 p-3  rounded-4 border ${index !== memberships.length - 1 ? "border-end-0" : ""
                                }`}
                            >
                              <Row className="align-items-center">
                                {/* Image Section */}
                                <Col xs={12} sm={4} className="text-center mb-3 mb-sm-0">
                                  <Image
                                    src={FrameKing}
                                    alt="CafeCall"
                                    className="rounded-circle"
                                    style={{ objectFit: "cover", width: "68px", height: "68px" }}
                                  />
                                </Col>

                                {/* Membership Name & Expiry */}
                                <Col xs={12} sm={8} className="text-center text-sm-start">
                                  <h5
                                    className="mb-2"
                                    style={{ fontSize: "16px", fontWeight: "500" }}
                                  >
                                    {membership?.name || "Gold Membership"}
                                  </h5>
                                  <Button
                                    className="border-0 rounded-3 text-white"
                                    size="sm"
                                    style={{ backgroundColor: "#2C99FF" }}
                                  >
                                    Expire in {membership?.validity || "1 Month"}
                                  </Button>
                                </Col>

                                {/* Membership Details */}
                                <Col xs={12} className="mx-4">
                                  <h6
                                    className="mt-3"
                                    style={{ fontSize: "16px", fontWeight: "500" }}
                                  >
                                    Membership Details
                                  </h6>
                                  <p
                                    className="text-muted mb-2"
                                    style={{ fontSize: "14px", fontWeight: "400" }}
                                  >


                                    <ul className="text-muted mb-2 ps-3" style={{ fontSize: "14px", fontWeight: "400" }}>
                                      {membership?.details?.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                      ))}
                                    </ul>
                                    {/* {membership?.details?.map((detail, i) => (
                  <span key={i}>
                    {detail}
                    {i !== membership.details.length - 1 && ", "}
                  </span>
                ))} */}
                                  </p>

                                  {/* Price */}
                                  <h6
                                    className="mt-3"
                                    style={{ fontSize: "16px", color: "#00C843", fontWeight: "600" }}
                                  >
                                    Price: ₹ {membership?.price || 1000}
                                  </h6>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <p>No members available</p>
                      )}
                    </Row>

                  )
                }




              </Card>

            </Col>



          </Row>
        </Col>


      </Row>



      <MembershipForm
        showCanvas={showCanvas}
        handleCloseCanvas={handleCloseCanvas}
        isEditing={!!selectedMembership}
        cafeId={cafeId}
        membership={selectedMembership}
      />
    </Container>
  );
};

export default CreateMembership;

import React, { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, Card, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMembershipsByCafeId, setSelectedMembership, deleteMembership } from "../../../../store/slices/MembershipSlice";
import MembershipForm from "./MembershipForm"; // You'll need to create this component
import { RiVipCrownFill, RiDeleteBin6Fill } from "react-icons/ri";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { SiListmonk } from "react-icons/si";
import { Link, useParams } from "react-router-dom";
import Add from "/assets/superAdmin/cafe/formkit_addWhite.png";
import FrameKing from '/assets/superAdmin/cafe/FrameKing.png';

const CreateMembership = () => {

  const cafeId = useParams().cafeId;
  console.log("your cafe id membership ", cafeId);

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
  console.log("this is mameber ship sata  :", memberships);

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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Breadcrumb>
              <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>Home</Breadcrumb.Item>
              <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                <Link to={`/superadmin/cafe/viewdetails/${cafeId}`}>Membership Details</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > All Membership </Breadcrumb.Item>
            </Breadcrumb>



            <Button variant="primary" className="rounded-3" onClick={handleCreateNewMembership}>
              <Image src={Add} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
              Create  Membership
            </Button>
          </div>
        </Card.Header>

        <Col sm={12} className="my-3">
          <Row className="g-3">

            <Col sm={12} className="mb-3">
            <Card
  className="game-card mx-2 rounded-4 shadow-lg p-3 h-100"
  onClick={() => dispatch(getGameById(game._id))}
  style={{ cursor: "pointer" }}
>
  <Row className="d-flex ">
    {memberships && memberships.length > 0 ? (
      memberships.map((membership, index) => (
        <Col key={index} sm={4} xs={12} className="d-flex">
          <div className="my-3">
            <Row className="align-items-center">
              {/* Image Section */}
              <Col xs={4} className="text-center">
                <Image
                  src={FrameKing}
                  alt="CafeCall"
                  className="rounded-circle"
                  style={{ objectFit: "cover", width: "68px", height: "68px" }}
                />
              </Col>

              {/* Membership Name & Expiry */}
              <Col xs={8}>
                <h5 className="mb-2" style={{ fontSize: "16px", fontWeight: "500" }}>
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
                <h6 className="mt-3" style={{ fontSize: "16px", fontWeight: "500" }}>
                  Membership Details
                </h6>
                <p className="text-muted mb-2" style={{ fontSize: "14px", fontWeight: "400" }}>
                  {membership?.details?.map((detail, i) => (
                    <span key={i}>{detail}{i !== membership.details.length - 1 && ", "}</span>
                  ))}
                </p>

                {/* Price */}
                <h6 className="mt-4" style={{ fontSize: "16px", color: "#00C843", fontWeight: "600" }}>
                  Price: ₹ {membership?.price || 1000}
                </h6>
              </Col>
            </Row>
          </div>
        </Col>
      ))
    ) : (
      <p>No members available</p>
    )}
  </Row>
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

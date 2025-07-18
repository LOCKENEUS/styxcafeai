import React, { useEffect } from "react";
import { Container, Row, Col, Card, Image, Spinner } from "react-bootstrap";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";
import { LuPencil } from "react-icons/lu";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../../store/AdminSlice/UserSlice";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "../../../components/common/Breadcrumbs/Breadcrumbs";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, loading } = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserById(id));
  }, [dispatch, id]);

  const defaultProfileImage = profileImg;

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
 
        </Spinner>
      </Container>
    );
  }
  return (
    <Container className="mt-4">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/admin/dashboard" },
            { label: "Customer", active: true }
          ]}
        />
        <Row>
          {/* Sidebar with Profile */}
          <Col md={4}>
            <Card className="p-3 text-center">
              <div className="d-flex justify-content-center flex-column align-items-center">
                <div className="position-relative">
                  <div
                    style={{
                      width: "100%",
                      height: "147px",
                      overflow: "hidden",
                      borderRadius: "8px",
                      marginTop: "-16px",
                      marginRight: "-16px",
                    }}
                  >
                    <img
                      src={profileBg}
                      alt="profileBg"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div
                    style={{ bottom: "4rem" }}
                    className="d-flex position-relative justify-content-center align-items-end"
                  >
                    <Image
                      src={selectedUser?.userProfile ? `${import.meta.env.VITE_API_URL}/${selectedUser.userProfile}` : defaultProfileImage}
                      onError={(e) => {
                        e.target.src = defaultProfileImage;
                      }}
                      style={{ width: "137px", height: "137px", borderRadius: "8px" }}
                    />
                    <button
                      className="btn btn-primary position-absolute rounded-circle"
                      style={{
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        right: "0px"
                      }}
                      onClick={() => navigate(`/admin/users/create-user/${selectedUser?._id}`)}
                    >
                      <LuPencil />
                    </button>
                  </div>
                  <div style={{ position: "relative", bottom: "2rem" }}>
                    <h5>{selectedUser?.name || "N/A"}</h5>
                    <p>{selectedUser?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="d-flex flex-column gap-2 mt-3">
                <p><strong>Gender:</strong> {selectedUser?.gender || "N/A"}</p>
                <p><strong>Email Id:</strong> {selectedUser?.email || "N/A"}</p>
                <p><strong>Phone Number:</strong> {selectedUser?.contact_no || "N/A"}</p>
                <p><strong>Location:</strong> {selectedUser?.city || "N/A"}</p>
                <p><strong>Department:</strong> {selectedUser?.department || "N/A"}</p>
                <p><strong>Role:</strong> {selectedUser?.role || "N/A"}</p>
                <p><strong>Age:</strong> {selectedUser?.age || "N/A"}</p>
              </div>
            </Card>
          </Col>

          {/* Additional Details */}
          <Col md={8}>
            <Card className="p-3 mb-3">
              <h5>Details</h5>
              <div className="d-flex flex-column gap-2">
                <p><strong>Address:</strong> {selectedUser?.address || "N/A"}</p>
                <p><strong>City:</strong> {selectedUser?.city || "N/A"}</p>
                <p><strong>State:</strong> {selectedUser?.state || "N/A"}</p>
                <p><strong>Country:</strong> {selectedUser?.country || "N/A"}</p>
                <p><strong>Status:</strong> {selectedUser?.is_active ? "Active" : "Inactive"}</p>
                <p><strong>Created At:</strong> {new Date(selectedUser?.createdAt).toLocaleDateString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedUser?.updatedAt).toLocaleDateString()}</p>
              </div>
            </Card>
          </Col>
        </Row>

    </Container>
  );
};

export default UserDetails;

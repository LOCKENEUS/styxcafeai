import React, { useEffect } from "react";
import { Container, Row, Col, Card, Image, Spinner } from "react-bootstrap";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerById } from "../../../store/AdminSlice/CustomerSlice";
import { useNavigate } from "react-router-dom";

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCustomer, loading } = useSelector((state) => state.customers);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCustomerById(id));
  }, [dispatch, id]);

  // Add fallback image
  const defaultProfileImage = profileImg; // Your imported default image
  console.log(selectedCustomer);
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
                      src={selectedCustomer?.customerProfile ? `${import.meta.env.VITE_API_URL}/${selectedCustomer.customerProfile}` : defaultProfileImage}
                      onError={(e) => {
                        e.target.src = defaultProfileImage;
                      }}
                      style={{ width: "137px", height: "137px", borderRadius: "8px" }}
                    />
                    <button
                      className="btn btn-primary position-absolute rounded-circle"
                      style={{
                        width: '40px', height: '40px', padding: 0,
                        right: "0px"
                      }}
                      onClick={() => {
                        navigate(`/admin/users/create-customer/${selectedCustomer._id}`)
                        console.log(selectedCustomer._id)
                      }}
                    >
                      <LuPencil />
                    </button>
                  </div>
                  <div style={{ position: "relative", bottom: "2rem" }}>
                    <h5>{selectedCustomer?.name || "N/A"}</h5>
                    <p>{selectedCustomer?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="d-flex flex-column gap-2 mt-3">
                <p><strong>Gender:</strong> {selectedCustomer?.gender || "N/A"}</p>
                <p><strong>Email Id:</strong> {selectedCustomer?.email || "N/A"}</p>
                <p><strong>Phone Number:</strong> {selectedCustomer?.contact_no || "N/A"}</p>
                <p><strong>Location:</strong> {selectedCustomer?.city || "N/A"}</p>
                <p><strong>Department:</strong> {selectedCustomer?.department || "N/A"}</p>
                {/* <p><strong>Company:</strong> {selectedCustomer?.company || "N/A"}</p>
                <p><strong>Bank:</strong> {selectedCustomer?.bank_name || "N/A"}</p>
                <p><strong>Account No.:</strong> {selectedCustomer?.account_number || "N/A"}</p> */}
              </div>
            </Card>
          </Col>

          {/* Billing Details */}
          <Col md={8}>
            <Card className="p-3 mb-3">
              <h5>Details</h5>
              <div className="d-flex flex-column gap-2">
                <p><strong>Address:</strong> {selectedCustomer?.address}</p>
                <p><strong>City:</strong> {selectedCustomer?.city}</p>
                <p><strong>State:</strong> {selectedCustomer?.state}</p>
                <p><strong>Country:</strong> {selectedCustomer?.country}</p>
                {/* <p><strong>Pincode:</strong> 47811054</p>
                <p><strong>Latitude:</strong> 21.1475</p>
                <p><strong>Longitude:</strong> 79.1199</p> */}
              </div>
            </Card>

            {/* Other Documents */}
            {/* <Card className="p-3 mb-3">
              <h5>Other Documents</h5>
              <div className="d-flex flex-wrap align-items-center justify-content-around gap-2">
                <p><strong>Government Id:</strong> 5768RT86T084PZ</p>
                <p><strong>Document:</strong> <img src={pdflogo} alt="pdflogo" /> <a href="#">Documents.pdf</a></p>
              </div>
            </Card> */}

            {/* Bank Details */}
            {/* <Card className="p-3">
              <h5>Bank Details</h5>
              <div className="d-flex flex-wrap justify-content-around gap-2">
                <p><strong>Bank Name:</strong> State Bank of India</p>
                <p><strong>Account Number:</strong> 24578965230</p>
                <p><strong>IFSC/SWIFT/BIC:</strong> SBI0145720124</p>
                <p><strong>Account Type:</strong> Savings</p>
                <p><strong>Created At:</strong> 2025-02-07 10:54:16</p>
                <p><strong>Modified At:</strong> 2025-02-07</p>
              </div>
            </Card> */}
          </Col>
        </Row>
 
    </Container>
  );
};

export default CustomerDetails;

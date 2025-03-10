import React from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";

const VendorDetails = () => {
  return (
    <Container data-aos="fade-down" data-aos-duration="700" className="mt-4">
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
                    marginTop: "",
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
                    src={profileImg}
                    style={{ width: "137px", height: "137px", borderRadius: "8px" }}
                  />
                  <button
                    className="btn btn-primary position-absolute rounded-circle"
                    style={{
                      width: '40px', height: '40px', padding: 0,
                      right: "0px"
                    }}
                  >
                    <LuPencil />
                  </button>
                </div>
                <div style={{ position: "relative", bottom: "2rem" }}>
                  <h5>Shardul Thakur</h5>
                  <p>shardulthakur12@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="d-flex flex-column text-start gap-2 mt-3">
              <p><strong>Email Id:</strong> rohanstyxcafe@gmail.com</p>
              <p><strong>Phone Number:</strong> 9874563210</p>
              <p><strong>Location:</strong> Nagpur</p>
              <p><strong>Company:</strong> Appearance Pvt Ltd</p>
              <p><strong>Bank:</strong> SBI India</p>
              <p><strong>Account No.:</strong> 24578965230</p>
            </div>
          </Card>
        </Col>

        {/* Billing Details */}
        <Col md={8}>
          <Card className="p-3 mb-3">
            <h5>Billing Details</h5>
            <div className="d-flex flex-column gap-2">
              <p><strong>Address:</strong> 2 Smithtown Rd, Morgantown, West Virginia, 26508, United States</p>
              <p><strong>City:</strong> Morgantown</p>
              <p><strong>State:</strong> West Virginia</p>
              <p><strong>Country:</strong> United States</p>
              <p><strong>Pincode:</strong> 47811054</p>
              <p><strong>Latitude:</strong> 21.1475</p>
              <p><strong>Longitude:</strong> 79.1199</p>
            </div>
          </Card>

          {/* Other Documents */}
          <Card className="p-3 mb-3">
            <h5>Other Documents</h5>
            <div className="d-flex flex-wrap align-items-center justify-content-around gap-2">
              <p><strong>Government Id:</strong> 5768RT86T084PZ</p>
              <p><strong>Document:</strong> <img src={pdflogo} alt="pdflogo" /> <a href="#">Documents.pdf</a></p>
            </div>
          </Card>

          {/* Bank Details */}
          <Card className="p-3">
            <h5>Bank Details</h5>
            <div className="d-flex flex-wrap justify-content-around gap-2">
              <p><strong>Bank Name:</strong> State Bank of India</p>
              <p><strong>Account Number:</strong> 24578965230</p>
              <p><strong>IFSC/SWIFT/BIC:</strong> SBI0145720124</p>
              <p><strong>Account Type:</strong> Savings</p>
              <p><strong>Created At:</strong> 2025-02-07 10:54:16</p>
              <p><strong>Modified At:</strong> 2025-02-07</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorDetails;

import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { FaPhone, FaComment, FaEnvelope } from "react-icons/fa";
import { BsFillPencilFill } from "react-icons/bs";
import { GoPencil } from "react-icons/go";

const ViewProfile = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const backend_url = import.meta.env.VITE_API_URL;

  return (
    <div className="container mt-4">
      <Row>
        {/* Profile Section */}
        <Col md={4}>
          <Card
            className="p-2 shadow-sm"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="text-center">
              <Image
                src={
                  user.cafeImage?.[0]
                    ? `${backend_url}/${user.cafeImage[0]}`
                    : "https://xsgames.co/randomusers/avatar.php?g=male"
                }
                style={{ width: "300px", height: "300px", borderRadius: "8px" }}
                fluid
              />
            </div>
            <div className="d-flex justify-content-between mt-4 align-items-center">
              <div className="flex flex-column justify-content-start">
                <h5 className=" mt-2">{user.name}</h5>
                <p className=" text-muted">Cafe ID: {user._id}</p>
              </div>
              {user?.role === "superadmin" ? (
                <div
                  className="bg-primary rounded-circle d-flex justify-content-center align-items-center position-relative"
                  style={{ width: "40px", height: "40px", cursor: "pointer" }}
                  title="Edit Profile"
                >
                  <GoPencil className="text-white" />
                </div>
              ) : (
                <div className="position-relative">
                  <div
                    className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      cursor: "not-allowed",
                    }}
                  >
                    <GoPencil className="text-white" />
                  </div>
                  <div
                    className="position-absolute top-100 start-0 mt-2 p-2 bg-white shadow-sm rounded"
                    style={{ width: "200px", display: "none", zIndex: 1000 }}
                  >
                    <small className="text-muted">
                      Only superadmin can edit
                    </small>
                  </div>
                  <style>
                    {`
                     .position-relative:hover .position-absolute {
                       display: block !important;
                     }
                   `}
                  </style>
                </div>
              )}
            </div>
            <hr />
            <p>
              <strong>Full Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email ID:</strong> {user.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {user.contact_no}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Franchise Name:</strong> {user.cafe_name}
            </p>
            <p>
              <strong>Location:</strong> {user.location?.address}
            </p>
            <p>
              <strong>License Expiry Date:</strong>{" "}
              {new Date(
                new Date(user.createdAt).getTime() +
                  user.yearsOfContract * 365 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
            <div className="d-flex justify-content-around mt-3">
              <FaPhone size={20} />
              <FaComment size={20} />
              <FaEnvelope size={20} />
            </div>
          </Card>
        </Col>

        {/* Franchise Details */}
        <Col md={8}>
          <Card
            className="p-2 shadow-sm"
            style={{ backgroundColor: "transparent" }}
          >
            <h5>Franchise Details</h5>
            <hr />
            <p>
              <strong>Franchise Name:</strong>{" "}
              <span className="fw-bold">{user.cafe_name}</span>
            </p>
            <p>
              <strong>Location:</strong>{" "}
              <span className="fw-bold">{user.location?.address}</span>
            </p>
            <p>
              <strong>Ownership Type:</strong>{" "}
              <span className="fw-bold">{user.ownershipType}</span>
            </p>
            <p>
              <strong>GST No:</strong>{" "}
              <span className="fw-bold">{user.gstNo}</span>
            </p>
            <p>
              <strong>PAN No:</strong>{" "}
              <span className="fw-bold">{user.panNo}</span>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={user.website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website_url}
              </a>
            </p>
            <p>
              <strong>License Expiry Date:</strong>{" "}
              <span className="fw-bold">
                {new Date(
                  new Date(user.createdAt).getTime() +
                    user.yearsOfContract * 365 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
            </p>
          </Card>
          {/* Payment Status */}
          <Row className="mt-4">
            <Col>
              <Card
                className="p-2 shadow-sm"
                style={{ backgroundColor: "transparent" }}
              >
                <h5>Payment Status</h5>
                <hr />
                <p className="text-muted">(Coming Soon...)</p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ViewProfile;

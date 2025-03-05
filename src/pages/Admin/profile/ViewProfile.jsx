import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { FaPhone, FaComment, FaEnvelope } from "react-icons/fa";
import { BsFillPencilFill } from "react-icons/bs";
import { GoPencil } from "react-icons/go";

const ViewProfile = () => {
  return (
    <div className="container mt-4">
      <Row>
        {/* Profile Section */}
        <Col md={4}>
          <Card className="p-2 shadow-sm" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center">
              <Image 
               src="https://xsgames.co/randomusers/avatar.php?g=male"
                style={{ width: '300px', height: '300px', borderRadius: '8px' }} // square shape with slight border radius
                fluid
              />
            </div>
            <div className="d-flex justify-content-between mt-4 align-items-center"> 
              <div className="flex flex-column justify-content-start" > 
            <h5 className=" mt-2">Rohan Rathore</h5>
            <p className=" text-muted">Cafe ID: 147GA4786</p>
            </div>
            <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
              <GoPencil className="text-white" />
            </div>
            </div>
            <hr />
            <p><strong>Full Name:</strong> Rohan Rathore</p>
            <p><strong>Email ID:</strong> rohanstyxcafe@gmail.com</p>
            <p><strong>Phone Number:</strong> 9874563210</p>
            <p><strong>Role:</strong> Admin</p>
            <p><strong>Franchise Name:</strong> Styx Sports Cafe</p>
            <p><strong>Location:</strong> Nagpur</p>
            <p><strong>License Expiry Date:</strong> 04/06/2035</p>
            <div className="d-flex justify-content-around mt-3">
              <FaPhone size={20} />
              <FaComment size={20} />
              <FaEnvelope size={20} />
            </div>
          </Card>
        </Col>
        
        {/* Franchise Details */}
        <Col md={8}>
          <Card className="p-2 shadow-sm" style={{ backgroundColor: 'transparent' }}>
            <h5>Franchise Details</h5>
            <hr />
            <p><strong>Franchise Name:</strong> <span className="fw-bold">STYX SPORTS CAFE</span></p>
            <p><strong>Location:</strong> <span className="fw-bold">Nagpur</span></p>
            <p><strong>Games Assigned:</strong></p>
            <p>
              <a href="#">Snooker & Pool</a> | <a href="#">Pickle ball</a> | <a href="#">Paddle Tennis</a> | <a href="#">Kids Zone</a> | <a href="#">Turf Cricket</a> | <a href="#">Cafe</a>
            </p>
            <p><strong>License Expiry Date:</strong> <span className="fw-bold">04/06/2035</span></p>
          </Card>
              {/* Payment Status */}
      <Row className="mt-4">
        <Col>
          <Card className="p-2 shadow-sm" style={{ backgroundColor: 'transparent' }}>
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

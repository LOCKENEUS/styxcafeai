import React from "react";
import { Card, Button, Row, Col, Image } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { BsFillPencilFill } from "react-icons/bs";

const Signup = () => {
  return (
    <div className="container mt-4">
      <Row>
        {/* Profile Section */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <div className="text-center position-relative">
              <Image
                src="https://picsum.photos/200/300?grayscale"
                roundedCircle
                style={{ width: '180px', height: '180px', objectFit: 'cover' }}
              />
              <div className="position-absolute" style={{ right: '30%', bottom: '0' }}>
                <BsFillPencilFill className="bg-white rounded-circle p-1" style={{ cursor: 'pointer' }} />
              </div>
            </div>
            <h5 className="text-center mt-2">Rohan Rathore</h5>
            <p className="text-center text-muted">Gaming ID: 147GA4786</p>
            <hr />
            <p><strong>User Level:</strong> Stage 1</p>
            <p><strong>Badges Earned:</strong> Bronze Level 2</p>
            <p><strong>Rewards Earned:</strong> 500 Coins</p>
            <p><strong>Membership:</strong> 25 March 2025</p>
            <p><strong>Wallet:</strong> ₹4200</p>
            <p><strong>Payment Method:</strong> Online UPI</p>
          </Card>
        </Col>
        
        {/* Recent Bookings */}
        <Col md={8}>
          <Card className="p-3 shadow-sm">
            <h5>Recent Bookings and History</h5>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <Image 
                  src="https://picsum.photos/200/300?grayscale" 
                  rounded 
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div className="flex flex-column gap-2">
                  <span className="ms-2"><strong>Play Station 5 Booked</strong></span>
                  <p className="mb-1 text-muted">04:00 PM | Sunday, 6 March, 2025</p>
                  <p className="mb-1">Quantity: 2 Tickets</p>
                </div>
              </div>
              <div className="d-flex flex-column">
                <p className="text-success">Amount Paid: ₹700</p>
                <p className="text-success"><FaCheckCircle /> Confirmed</p>
                <p className="text-danger text-decoration-underline" size="sm"><MdCancel /> Cancel Booking</p>
              </div>
            </div>
            <hr />
            <h6>Last Bookings (10)</h6>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Image 
                  src="https://picsum.photos/200/300?grayscale" 
                  rounded 
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <span className="ms-2"><strong>Paddle Tennis</strong></span>
                <p className="mb-1 text-muted">02:45 PM | Wednesday, 1 March, 2025</p>
                <p className="mb-1">Quantity: 1 Ticket</p>
              </div>
              <div>
                <p className="text-success">Amount Paid: ₹700</p>
                <p className="text-success"><FaCheckCircle /> Confirmed</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Game Stats & Performance */}
      <Row className="mt-4">
        <Col>
          <Card className="p-3 shadow-sm">
            <h5>Game Stats & Performance</h5>
            <hr />
            <p className="text-muted">(Coming Soon...)</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;



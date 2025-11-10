import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export const AboutUs = () => {

    return (
        <div style={{ backgroundColor: "#fff" }}>

            {/* Hero / Banner */}
            <div className="text-center py-5" style={{ backgroundColor: "#f9fafb" }}>
                <h1 className="fw-bold">About Us</h1>
                <p className="text-muted fs-5">
                    At Styx, it’s not just a game—it’s a way of life.
                </p>
            </div>

            <Container className="py-5">
                {/* Who We Are */}
                <Row className="mb-5">
                    <Col md={6}>
                        <img
                            src="https://media.istockphoto.com/id/474212364/photo/happiness-friends-in-a-pub.jpg?s=612x612&w=0&k=20&c=4XK-62BlZCOD5-E0qdb838oYGAqc2CuAK7RAarYFZ6c="
                            alt="Cafe People"
                            className="img-fluid rounded shadow "
                        />
                    </Col>
                    <Col md={6} className="d-flex flex-column justify-content-center">
                        <h3 className="fw-bold mb-3">Who We Are</h3>
                        <p>
                            A premier destination for pool enthusiasts! At Styx Café, we’re passionate about
                            creating an exceptional pool experience for players of all levels. Our vibrant
                            community, delicious food, and friendly atmosphere make us the go-to spot for fun and
                            competition. Join us and be part of the Styx family!
                        </p>
                    </Col>
                </Row>

                {/* Vision and Mission */}
                <Row className="mb-5">
                    <Col md={6}>
                        <h3 className="fw-bold mb-3">Our Vision</h3>
                        <p>
                            To make Styx the ultimate destination for billiards enthusiasts, where players of all
                            levels connect, compete, and create unforgettable memories in an inviting and vibrant
                            atmosphere filled with excitement.
                        </p>
                    </Col>
                    <Col md={6}>
                        <h3 className="fw-bold mb-3">Our Mission</h3>
                        <p>
                            At Styx, we are dedicated to delivering an exceptional billiards experience through
                            our cafés, while expanding our franchise model to share our passion for the game and
                            create inviting spaces in communities everywhere.
                        </p>
                    </Col>
                </Row>

                {/* Why Choose Us */}
                {/* <Row className="mb-5 text-center">
          <h3 className="fw-bold mb-4">Why Choose Styx?</h3>
          <Col md={3} className="mb-4">
            <div className="p-3 bg-light rounded shadow-sm h-100">
              <strong>🎱 Top-Notch Pool Tables</strong>
            </div>
          </Col>
          <Col md={3} className="mb-4">
            <div className="p-3 bg-light rounded shadow-sm h-100">
              <strong>🎯 Pool Coaching & Tips</strong>
            </div>
          </Col>
          <Col md={3} className="mb-4">
            <div className="p-3 bg-light rounded shadow-sm h-100">
              <strong>🍔 Game-Time Bites</strong>
            </div>
          </Col>
          <Col md={3} className="mb-4">
            <div className="p-3 bg-light rounded shadow-sm h-100">
              <strong>🍹 Chill Lounge Area</strong>
            </div>
          </Col>
        </Row> */}

                {/* Why Choose Us */}
                <Row className="mb-5 text-center">
                    <h3 className="fw-bold mb-4">Why Choose Styx?</h3>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="feature-card p-4 h-100">
                            <div className="fs-2 mb-2">🎱</div>
                            <strong>Top-Notch Pool Tables</strong>
                        </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="feature-card p-4 h-100">
                            <div className="fs-2 mb-2">🎯</div>
                            <strong>Pool Coaching & Tips</strong>
                        </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="feature-card p-4 h-100">
                            <div className="fs-2 mb-2">🍔</div>
                            <strong>Game-Time Bites</strong>
                        </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                        <div className="feature-card p-4 h-100">
                            <div className="fs-2 mb-2">🍹</div>
                            <strong>Chill Lounge Area</strong>
                        </div>
                    </Col>
                </Row>

                {/* Contact Info */}
                <Row className="mb-5">
                    <Col md={6}>
                        <h3 className="fw-bold mb-3">Contact Us For Table Reservations</h3>
                        <p className="mb-1">📞 <strong>Call:</strong> 0712 356 3648</p>
                        <p className="mb-1">📧 <strong>Email:</strong> support@styxcafe.com</p>
                        <p className="mb-1">📍 <strong>Address:</strong> Plot no 74, Deshpande Layout, Uday Nagar, Nagpur, Maharashtra 440008</p>
                    </Col>
                    <Col md={6}>
                        <h3 className="fw-bold mb-3">Work Hours</h3>
                        <p>🕘 <strong>Daily:</strong> 09:00 AM - 11:00 PM</p>
                        <p>🎉 <strong>Happy Hour:</strong> 09:00 AM - 03:00 PM</p>
                    </Col>
                </Row>

                {/* CTA */}
                <Row className="text-center">
                    <Col>
                        <h4 className="fw-bold">Join the Styx Franchise Today!</h4>
                        <p>Bring the thrill of competitive Eight-ball and café culture to your city.</p>
                        <Button variant="warning" className="fw-bold px-4">
                            Contact Us
                        </Button>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .feature-card {
                background: rgba(255, 255, 255, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                transition: all 0.3s ease;
                }

                .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                background: rgba(255, 255, 255, 0.75);
                }
            `}</style>
        </div>
    );
};


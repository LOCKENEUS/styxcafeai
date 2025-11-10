import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import forgetPasswordIllustration from "/assets/Admin/Forgot password-rafiki.svg"; // Use an appropriate illustration
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminSendPasswordResetEmail } from "../../../store/AdminSlice/AuthSlice";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(adminSendPasswordResetEmail(email)).unwrap();
      // If successful, navigate to change password page
      navigate("/admin/change-password", { state: { email } });
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row  className="w-100">
        {/* Left Side: Illustration */}
        <Col  data-aos-debounce-delay="400" data-aos="fade-right" data-aos-duration="1500" md={6} className="d-flex justify-content-center align-items-center">
          <img src={forgetPasswordIllustration} alt="Forget Password Illustration" className="img-fluid" style={{ maxWidth: "80%" }} />
        </Col>

        {/* Right Side: Forget Password Form */}
        <Col data-aos="fade-right"  data-aos-duration="1000" md={5} className="d-flex justify-content-center align-items-center">
          <Card className="shadow-none border-0 p-5 w-100">
            <Card.Title className="text-center mb-3">
              <h2 className="text-primary">Reset Password</h2>
              <p className="text-muted">Enter your email to reset your password</p>
            </Card.Title>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Email Field */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Reset Password Button */}
                <Button variant="primary" type="submit" className="w-100">
                  Reset Password
                </Button>

                {/* Redirect to Login */}
                <div className="text-center mt-3">
                  <p className="mb-0">
                    Remember your password? <Link to="/admin/login" className="text-primary">Login</Link>
                  </p>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgetPassword;

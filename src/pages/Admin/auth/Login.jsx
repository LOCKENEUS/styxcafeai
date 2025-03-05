import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import LoginImg from "/assets/Admin/LoginImg-min.jpeg"; // Add an illustration image in the project folder
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { Adminlogin } from "../../../store/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setIsAuthenticated }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(Adminlogin(formData)).unwrap();

      if (result && result.token) {
        setIsAuthenticated(true);
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error("Login failed:", error);
      // setErrorMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-4">
      <Row className="shadow-lg justify-content-between align-items-center rounded overflow-hidden w-100" style={{ maxWidth: "1200px", minHeight: "600px" }}>
        {/* Left Section */}
        <Col style={{ height: "40rem" }} lg={5} className="p-0 shadow-lg">
          <div style={{ justifyContent: "stretch" }} className="d-flex flex-column  align-items-center h-100">
            <img
              src={LoginImg}
              alt="Login Illustration"
              style={{
                width: '100%',
                height: '400px', // Increased height
                objectFit: 'cover'
              }}
              className="img-fluid"
            />
            <div className="p-4 d-flex gap-2 flex-column justify-content-center align-items-center">
              <h2 className="text-center " style={{ fontWeight: "lighter" }}>STYX SPORTS CAFE</h2>
              <p className="text-center px-3">Lorem ipsum dolor sit amet consectetur. Lorem massa lobortis quam amet urna in eget eu.</p>
            </div>
          </div>
        </Col>

        {/* Right Section */}
        <Col lg={6} className="bg-white p-3 p-md-5">
          <Card className="border">
            <Card.Body>
              <h1 className="text-center mb-3">Login</h1>
              <p className="text-center text-muted">Welcome back! Please log in to access your account.</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your Email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your Password"
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    type="switch"
                    id="remember-me-switch"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    label="Remember Me"
                  />
                  <Link to="/admin/forgot-password" className="text-primary">Forgot Password?</Link>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : 'Login'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

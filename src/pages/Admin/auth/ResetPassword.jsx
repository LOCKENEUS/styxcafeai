import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import resetPasswordIllustration from "/assets/Admin/Reset-password.svg"; // Use an appropriate illustration
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../../store/slices/authSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
  };

  // Handle password change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(resetPassword({
        email: formData.email,
        newPassword: formData.newPassword,
        otp: otp.join("")
      })).unwrap();

      toast.success("Password reset successful");
      navigate("/admin/login");
    } catch (error) {
      toast.error(error || "Failed to reset password");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100">
        {/* Left Side: Illustration */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <img src={resetPasswordIllustration} alt="Reset Password Illustration" className="img-fluid" style={{ maxWidth: "80%" }} />
        </Col>

        {/* Right Side: Reset Password Form */}
        <Col md={5} className="d-flex justify-content-center align-items-center">
          <Card className="shadow-none border-0 p-5 w-100">
            <Card.Title className="text-center mb-3">
              <h2 className="text-primary">Reset Password</h2>
              <p className="text-muted">Enter the OTP sent to your email and set a new password</p>
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
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    required
                  />
                </Form.Group>

                {/* OTP Input */}
                <Form.Group className="mb-3 text-center">
                  <Form.Label>Enter OTP</Form.Label>
                  <div className="d-flex justify-content-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyUp={(e) => {
                          // Move to next input if value entered
                          if (e.target.value && index < otp.length - 1) {
                            e.target.nextElementSibling.focus();
                          }
                          // Move to previous input on backspace if empty
                          if (e.key === "Backspace" && !e.target.value && index > 0) {
                            e.target.previousElementSibling.focus();
                          }
                        }}
                        maxLength="1"
                        className="form-control text-center fw-bold"
                        style={{
                          width: "45px",
                          height: "45px",
                          fontSize: "24px",
                          fontWeight: "600",
                          color: "#000",
                          padding: "0px",
                          backgroundColor: "#fff",
                          border: "2px solid #dee2e6"
                        }}
                        required
                      />
                    ))}
                  </div>
                </Form.Group>

                {/* New Password Field */}
                <Form.Group className="mb-3" controlId="formBasicNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <div
                      onClick={() => togglePasswordVisibility("newPassword")}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </Form.Group>

                {/* Confirm New Password Field */}
                <Form.Group className="mb-3" controlId="formBasicConfirmNewPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPasswords.confirmNewPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      required
                    />
                    <div
                      onClick={() => togglePasswordVisibility("confirmNewPassword")}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      {showPasswords.confirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </Form.Group>

                {/* Reset Password Button */}
                <Button variant="primary" type="submit" className="w-100">
                  Reset Password
                </Button>

                {/* Redirect to Login */}
                <div className="text-center mt-3">
                  <p className="mb-0">
                    Back to <Link to="/admin/login" className="text-primary">Login</Link>
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

export default ResetPassword;

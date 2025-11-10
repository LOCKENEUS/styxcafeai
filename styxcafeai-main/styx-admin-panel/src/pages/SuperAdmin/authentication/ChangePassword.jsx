import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col, Card, Alert, InputGroup } from 'react-bootstrap';
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const emailFromStore = useSelector((state) => state.auth.email);
  const [formData, setFormData] = useState({
    email: emailFromStore,
    newPassword: '',
    confirmNewPassword: '',
    otp: ['', '', '', '', '', ''],
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const otpRefs = useRef(Array(6).fill(null));

  const getPasswordRequirements = (password) => ({
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecial: /[\d\W]/.test(password),
  });

  const passwordRequirements = getPasswordRequirements(formData.newPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && formData.otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setErrorMessage('Password does not meet all requirements.');
      return;
    }

    if (formData.otp.includes('')) {
      setErrorMessage('Please enter the complete OTP.');
      return;
    }

    setErrorMessage('');

    dispatch(resetPassword({ email: formData.email, newPassword: formData.newPassword, otp: formData.otp.join('') }))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success("Password updated successfully");
          navigate('/superadmin/login');
        } else {
          toast.error("Incorrect OTP. Please try again.");
        }
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  return (
    <Card style={{ maxWidth: '800px', margin: '2rem auto' }} className="p-3 shadow-lg">
      <Card.Header className="text-primary">
        <h3 className="mb-0 text-center">Change Password</h3>
      </Card.Header>
      
      <Card.Body className="p-4">
        {errorMessage && (
          <Alert variant="danger" className="d-flex align-items-center">
            <FaExclamationCircle className="me-2" />
            {errorMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Email Input Field */}
          <Form.Group as={Row} className="mb-4">
            <Form.Label column xs={12} lg={3} className="fw-bold mb-2 mb-lg-0">
              Email
            </Form.Label>
            <Col xs={12} lg={9}>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="py-2"
                value={formData.email}
                readOnly
              />
            </Col>
          </Form.Group>
     {/* OTP Input */}
     <Form.Group as={Row} className="mb-4">
            <Form.Label column xs={12} lg={3} className="fw-bold mb-3 mb-lg-0">
              OTP Verification
            </Form.Label>
            <Col xs={12} lg={9}>
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
                {formData.otp.map((digit, index) => (
                  <Form.Control
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    className="text-center otp-input"
                    style={{ width: '2.5rem', fontSize: '1rem', padding: "4px","border":"2px solid gray" }}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
              <div className="text-muted small mt-2">
                Enter the 6-digit code sent to your email
              </div>
            </Col>
          </Form.Group>

          {/* New Password Field */}
          <Form.Group as={Row} className="mb-4">
            <Form.Label column xs={12} lg={3} className="fw-bold mb-2 mb-lg-0">
              New Password
            </Form.Label>
            <Col xs={12} lg={9}>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Enter new password"
                  required
                  className="py-2"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <InputGroup.Text>
                  <Button
                    variant="link"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="p-0"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Form.Group>

          {/* Confirm Password Field */}
          <Form.Group as={Row} className="mb-4">
            <Form.Label column xs={12} lg={3} className="fw-bold mb-2 mb-lg-0">
              Confirm Password
            </Form.Label>
            <Col xs={12} lg={9}>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmNewPassword"
                  placeholder="Confirm new password"
                  required
                  className="py-2"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                />
                <InputGroup.Text>
                  <Button
                    variant="link"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-0"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup.Text>
              </InputGroup>
              
              <div className="mt-4 bg-light p-3 rounded-3">
                <h6 className="text-muted mb-3">Password Requirements:</h6>
                <ul className="list-unstyled small mb-0">
                  <li className="d-flex align-items-center mb-2">
                    <span className={`badge me-2 ${passwordRequirements.minLength ? 'bg-success' : 'bg-danger'}`}>
                      {passwordRequirements.minLength ? '✓' : '✗'}
                    </span>
                    Minimum 8 characters long
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <span className={`badge me-2 ${passwordRequirements.hasLowercase ? 'bg-success' : 'bg-danger'}`}>
                      {passwordRequirements.hasLowercase ? '✓' : '✗'}
                    </span>
                    At least one lowercase character
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <span className={`badge me-2 ${passwordRequirements.hasUppercase ? 'bg-success' : 'bg-danger'}`}>
                      {passwordRequirements.hasUppercase ? '✓' : '✗'}
                    </span>
                    At least one uppercase character
                  </li>
                  <li className="d-flex align-items-center">
                    <span className={`badge me-2 ${passwordRequirements.hasSpecial ? 'bg-success' : 'bg-danger'}`}>
                      {passwordRequirements.hasSpecial ? '✓' : '✗'}
                    </span>
                    At least one number, symbol, or whitespace
                  </li>
                </ul>
              </div>
            </Col>
          </Form.Group>

          {/* Submit Button */}
          <div className="d-grid gap-2 d-lg-flex justify-content-lg-end mt-5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="px-5 py-2 w-100 w-lg-auto"
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangePassword;
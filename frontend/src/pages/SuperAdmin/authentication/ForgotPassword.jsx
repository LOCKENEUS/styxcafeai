import { useState } from 'react';
import { Row, Col, Form, Button, Image, Container, Spinner } from 'react-bootstrap';
import { FaBackward } from 'react-icons/fa';
import Loginimg from "/assets/LoginImg/LoginImg.avif";

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendPasswordResetEmail, setPasswordResetEmail } from '../../../store/slices/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      dispatch(setPasswordResetEmail(email));
      const response = await dispatch(sendPasswordResetEmail(email));
      if (response.error) {
        setError('Failed to send reset email. Please try again.');
      } else {
        navigate('/change-password');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="min-vh-100 g-0 align-items-center">
        {/* Left Column - Image Section */}
        <Col lg={6} className="d-none d-lg-flex bg-light justify-content-center align-items-center">
          <div className="text-center px-3" style={{ maxWidth: '25rem' }}>
            <Image src={Loginimg} alt="Chatting" fluid className="img-fluid" style={{ maxWidth: '100%' }} />
            <h5 className="mt-4">☕ "Your perfect table, just a click away!" 🍽️</h5>
          </div>
        </Col>

        {/* Right Column - Forgot Password Form */}
        <Col lg={6} className="d-flex justify-content-center align-items-center">
          <div className="w-100 py-4" style={{ maxWidth: '25rem' }}>
            <div className='text-center'>
              <h4>Forgot password?</h4>
              <p>
                Enter the email address you used when you joined and we'll send you instructions to reset your password.
              </p>
            </div>

            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Your email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder="Enter a valid email address"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!error}
                />
                <Form.Control.Feedback type="invalid">
                  {error || 'Please enter a valid email address.'}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Check
                type="checkbox"
                label="Remember me"
                className="mb-4"
              />

              <Button type="submit" variant="primary" size="lg" className="w-100" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Submit'}
              </Button>

              <Link to={"/superadmin/login"} style={{ display: "flex", justifyContent: "center", alignItems: "center", columnGap: "1rem", textDecoration: "none" }} className="w-100 mt-3 bg-white text-primary">
                <FaBackward /> Back to Login
              </Link>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
import { useState } from 'react';
import { Row, Col, Form, Button, Image, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Loginimg from "/assets/LoginImg/LoginImg.avif";
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, loginUser } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [loadingState, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (loginData.email && loginData.password) {
  //     setLoading(true);
  //     const result = await dispatch(loginUser(loginData));

  //     console.log("Login API Response:", result);

  //     if (loginUser.fulfilled) {
  //       navigate('/superadmin/dashboard'); 

  //     } else {
  //       console.error("Login failed:", result.payload);
  //       setErrorMessage("Login failed. Please try again later.");
  //     }
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loginData.email && loginData.password) {
      setLoading(true);
      try {
        const result = await dispatch(loginUser(loginData)).unwrap(); // Ensures proper response handling

        if (result && result.token) {
          navigate('/superadmin/dashboard'); // Redirect on successful login
        }
      } catch (error) {
        console.error("Login failed:", error);
        setErrorMessage("Login failed. Please try again.");
      }
      setLoading(false);
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Row className="min-vh-100 g-0 align-items-center">
      {/* Left Column - Image Section */}
      <Col lg={6} className="d-none d-lg-flex bg-light justify-content-center align-items-center">
        <div className="text-center px-3" style={{ maxWidth: '25rem' }}>
          <Image src={Loginimg} alt="Chatting" fluid className="img-fluid" style={{ maxWidth: '100%' }} />
          <h5 className="mt-4">☕ "Your perfect table, just a click away!" 🍽️</h5>
        </div>
      </Col>

      {/* Right Column - Sign In Form */}
      <Col xs={12} sm={10} md={8} lg={6} className="mx-auto d-flex justify-content-center align-items-center py-4">
        <div className="w-100 p-4  rounded" style={{ maxWidth: '25rem' }}>
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <h1 className="display-6">Sign in</h1>
            </div>
            <hr />

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                placeholder="email@address.com"
                size="lg"
                value={loginData.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="d-flex justify-content-between">
                Password

              </Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8+ characters required"
                  size="lg"
                  minLength="8"
                  value={loginData.password}
                  onChange={handleInputChange}
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
              <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>

            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Remember me"
              className="mb-3"
            />

            {errorMessage && <div className="text-danger">{errorMessage}</div>}

            <Button type="submit" variant="primary" size="lg" className="w-100" disabled={loadingState}>
              {loadingState ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;

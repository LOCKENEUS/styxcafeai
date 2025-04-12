import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCafes, selectCafes } from "../../../../store/slices/cafeSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForwordPassword = ({ show, handleClose, cafeId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const cafes = useSelector(selectCafes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch]);

  const cafe = cafes.find((cafe) => cafe._id === cafeId);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSave = () => {
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      );
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      console.log("Password updated successfully!",newPassword,confirmPassword);
     
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <h2 className="text-center">Reset  Password</h2>

        <Row className="my-3">
          <Col sm={6}>
            <label className="float-end form-label">
              <span className="fw-bold">Cafe Id</span>: {cafe?.name}
            </label>
          </Col>
          <Col sm={6}>
            <label className="form-label">
              <span className="fw-bold">Cafe Name</span>: {cafe?.name}
            </label>
          </Col>
        </Row>

        <Row className="my-3">
          <Col sm={12}>
            <Form.Group className="mb-3 position-relative">
              <Form.Label>
                <span className="fw-bold">New Password</span>
              </Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "38px",
                  cursor: "pointer",
                  color: "#6c757d",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>
          </Col>

          <Col sm={12}>
            <Form.Group className="mb-3 position-relative">
              <Form.Label>
                <span className="fw-bold">Reset  Password</span>
              </Form.Label>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "38px",
                  cursor: "pointer",
                  color: "#6c757d",
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>
          </Col>
        </Row>

        {error && (
          <p className="text-danger text-center" style={{ fontSize: "14px" }}>
            {error}
          </p>
        )}

        <Col sm={12} className="text-center">
          <Button variant="primary" size="lg" onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Modal.Body>
    </Modal>
  );
};

export default ForwordPassword;

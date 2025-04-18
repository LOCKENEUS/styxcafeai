import React, { useState, useEffect } from "react";
import { Offcanvas, Form, Row, Col, Button } from "react-bootstrap";
import TimePicker from "react-time-picker"; // Assuming you're using 'react-time-picker'

const EditSlotOffcanvas = ({ show, handleClose, editData }) => {
  const [formState, setFormState] = useState({
    slotName: "",
    day: "",
    startTime: "",
    endTime: "",
    maxPlayers: "",
    slotPrice: "",
    adminNote: ""
  });
  

  const [selectedGame, setSelectedGame] = useState(null);
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    if (editData) {
      setFormState({
        slotName: editData.slotName || "",
        day: editData.day || "",
        startTime: editData.startTime || "",
        endTime: editData.endTime || "",
        maxPlayers: editData.maxPlayers || "",
        slotPrice: editData.slotPrice || "",
        adminNote: editData.adminNote || "",
      });
      setSelectedGame(editData.selectedGame || null);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.startTime >= formState.endTime) {
      setTimeError("End time must be after start time");
      return;
    }
    setTimeError("");
    console.log("Submitted Data:", formState);
    // handleClose(); // Optional: close the offcanvas after submit
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit Slot</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit} className="rounded-3 bg-white">
          <Row className="mb-3 g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">Slot Name</Form.Label>
                <Form.Control
                  type="text"
                  name="slotName"
                  value={formState.slotName}
                  onChange={handleChange}
                  placeholder="Enter slot name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">Day <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="day"
                  value={formState.day}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Day</option>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3 g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">Start Time <span className="text-danger">*</span></Form.Label>
                <div className="bootstrap-timepicker-wrapper mb-2">
                  <TimePicker
                    name="startTime"
                    value={formState.startTime}
                    onChange={(value) =>
                      handleChange({ target: { name: "startTime", value } })
                    }
                    clearIcon={null}
                    format="hh:mm a"
                    disableClock
                    required
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">End Time <span className="text-danger">*</span></Form.Label>
                <div className="bootstrap-timepicker-wrapper mb-2">
                  <TimePicker
                    name="endTime"
                    value={formState.endTime}
                    onChange={(value) =>
                      handleChange({ target: { name: "endTime", value } })
                    }
                    clearIcon={null}
                    format="hh:mm a"
                    disableClock
                    required
                  />
                </div>
                {timeError && <small className="text-danger">{timeError}</small>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3 g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">Max Players Per Slot</Form.Label>
                <Form.Control
                  type="number"
                  name="maxPlayers"
                  value={formState.maxPlayers || selectedGame?.data?.players || ""}
                  onChange={handleChange}
                  placeholder="Enter max players"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">Slot Price</Form.Label>
                <Form.Control
                  type="number"
                  name="slotPrice"
                  value={formState.slotPrice || selectedGame?.data?.price || ""}
                  onChange={handleChange}
                  placeholder="Enter slot price"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-secondary">Admin Note</Form.Label>
            <Form.Control
              as="textarea"
              className="border-2"
              rows={3}
              name="adminNote"
              value={formState.adminNote}
              onChange={handleChange}
              placeholder="Enter any notes for admin"
            />
          </Form.Group>

          <Button variant="success" type="submit" className="rounded-2 float-end my-5">
            Submit
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default EditSlotOffcanvas;

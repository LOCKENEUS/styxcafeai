import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const CreateSlotForm = () => {
  return (
    <div className="container mt-4">
      <h5>
         <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>Create Slots</span>
      </h5>
      <div className="p-4 ">
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Select Games</Form.Label>
                <Form.Select>
                  <option>Select Your Game</option>
                  <option>Pool</option>
                  <option>Snooker</option>
                  <option>Billiards</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Slot Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your Slot Name" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Day</Form.Label>
                <Form.Select>
                  <option>Pick Day</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Start Time</Form.Label>
                <Form.Control type="time" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>End Time</Form.Label>
                <Form.Control type="time" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Max Players Per Slot</Form.Label>
                <Form.Control type="number" placeholder="Enter Max Players Per Slots" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Slot Price</Form.Label>
                <Form.Control type="number" placeholder="Enter Slot Price" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Admin Note</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter Note for the Players" />
          </Form.Group>

          <div className="d-flex justify-content-end">
          <Button variant="light" className="me-2" style={{ backgroundColor: 'white', color: 'black', border: '1px solid gray' }}>Cancel</Button>
            <Button variant="primary">Create Slot</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateSlotForm;

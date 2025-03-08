import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGames } from "../../../../store/slices/gameSlice";
import { addslot, getslots } from "../../../../store/slices/slotsSlice";

const CreateSlotForm = () => {
  const dispatch = useDispatch();
  const { games = [] } = useSelector((state) => state.games);
  const slots = useSelector((state) => state.slots?.slots || []);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    game_id: "",
    start_time: "",
    end_time: "",
    availability: "true",
  });

  useEffect(() => {
    dispatch(getGames(cafeId));
  }, [dispatch, cafeId]);

  useEffect(() => {
    if (formData.game_id) {
      dispatch(getslots(formData.game_id));
    }
  }, [formData.game_id, dispatch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const convertTo24HourFormat = (time) => {
    const [hour, minute, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i)?.slice(1) || [];
    if (!hour || !minute || !period) return time; // Already in 24-hour format
    let hour24 = parseInt(hour, 10) % 12;
    if (period.toUpperCase() === "PM") hour24 += 12;
    return `${hour24.toString().padStart(2, "0")}:${minute}`;
  };

  const isTimeConflict = (newStart, newEnd, existingSlots) => {
    const newStartTime = new Date(`1970-01-01T${newStart}`).getTime();
    const newEndTime = new Date(`1970-01-01T${newEnd}`).getTime();

    return existingSlots.some((slot) => {
      if (slot.day && slot.day !== formData.day) return false;

      const slotStartTime = new Date(`1970-01-01T${convertTo24HourFormat(slot.start_time)}`).getTime();
      const slotEndTime = new Date(`1970-01-01T${convertTo24HourFormat(slot.end_time)}`).getTime();

      return (
        (newStartTime >= slotStartTime && newStartTime < slotEndTime) ||
        (newEndTime > slotStartTime && newEndTime <= slotEndTime) ||
        (newStartTime <= slotStartTime && newEndTime >= slotEndTime)
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isTimeConflict(formData.start_time, formData.end_time, slots)) {
      alert("There is already a slot created for this time frame.");
      return;
    }

    try {
      await dispatch(addslot(formData)).unwrap();
      navigate(`/admin/games/game-details/${formData.game_id}`);
    } catch (error) {
      console.error("Failed to create slot:", error);
    }
  };

  const labelStyle = { fontWeight: "500", color: "#5A5A5A", fontSize: "1rem" };

  return (
    <div className="container mt-4">
      <h5>
        <Link to="/admin/dashboard">Home</Link> /{" "}
        <span style={{ color: "blue" }}>Create Slots</span>
      </h5>
      <div className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Select Games</Form.Label>
                <Form.Select name="game_id" value={formData.game_id} onChange={handleChange} required>
                  <option value="">Select Your Game</option>
                  {games.map((game) => (
                    <option key={game._id} value={game._id}>
                      {game.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Slot Name</Form.Label>
                <Form.Control type="text" name="slotName" value={formData.slotName} onChange={handleChange} placeholder="Enter your Slot Name" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Date</Form.Label>
                <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Day</Form.Label>
                <Form.Select name="day" value={formData.day} onChange={handleChange} >
                  <option value="">Pick Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Start Time</Form.Label>
                <Form.Control type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>End Time</Form.Label>
                <Form.Control type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Max Players Per Slot</Form.Label>
                <Form.Control type="number" name="maxPlayers" value={formData.maxPlayers} onChange={handleChange} placeholder="Enter Max Players Per Slot" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Slot Price</Form.Label>
                <Form.Control type="number" name="slotPrice" value={formData.slotPrice} onChange={handleChange} placeholder="Enter Slot Price" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Admin Note</Form.Label>
            <Form.Control as="textarea" name="adminNote" rows={3} value={formData.adminNote} onChange={handleChange} placeholder="Enter Note for the Players" />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="light" className="me-2" style={{ backgroundColor: "white", color: "black", border: "1px solid gray" }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">Create Slot</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateSlotForm;

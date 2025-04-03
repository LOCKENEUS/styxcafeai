  import React, { useEffect, useState } from "react";
  import { Modal, Button, Form } from "react-bootstrap";
  import { useDispatch, useSelector } from "react-redux";
  import { getGames } from "../../../../store/slices/gameSlice";
  import { addslot, updateslot } from "../../../../store/slices/slotsSlice";

  const CreateSlotModal = ({ show, handleClose, selectedGame, slot }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;

    const [formData, setFormData] = useState({
      game_id: selectedGame?.data?._id,
      day: "",
      start_time: "",
      end_time: "",
      slot_price: "",
    });

    const convertTo24HourFormat = (time12h) => {
      if (!time12h) return ""; // Handle empty case
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");
      if (modifier === "PM" && hours !== "12") {
        hours = String(parseInt(hours, 10) + 12);
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }
      return `${hours}:${minutes}`;
    };

    useEffect(() => {
      if (slot) {
        setFormData({
          game_id: selectedGame?.data?._id,
          day: slot.day,
          start_time: convertTo24HourFormat(slot.start_time),
          end_time: convertTo24HourFormat(slot.end_time), 
          slot_price: slot.slot_price,
        });
      }
    }, [slot]);

    useEffect(() => {
      if (show) {
        dispatch(getGames(cafeId));
      }
    }, [dispatch, cafeId, show]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if(slot?._id) {
        dispatch(updateslot({ id: slot?._id, updatedData: formData }));
        setFormData({
          game_id: selectedGame?.data?._id,
          day: "",
          start_time: "",
          end_time: "",
          slot_price: "",
        });
        handleClose();
      }else{
        dispatch(addslot(formData));
        setFormData({
          game_id: selectedGame?.data?._id,
          day: "",
          start_time: "",
          end_time: "",
          slot_price: "",
        })
        handleClose();
      }
    };

    const labelStyle = { fontWeight: "500", color: "#5A5A5A", fontSize: "1rem" };
    const inputStyle = { border: "2px solid rgb(163, 164, 164)", borderRadius: "6px" };

    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Day</Form.Label>
              <Form.Select name="day" value={formData.day} onChange={handleChange} style={inputStyle} required>
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

            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Start Time</Form.Label>
              <Form.Control type="time" name="start_time" value={formData.start_time} onChange={handleChange} style={inputStyle} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>End Time</Form.Label>
              <Form.Control type="time" name="end_time" value={formData.end_time} onChange={handleChange} style={inputStyle} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Slot Price</Form.Label>
              <Form.Control type="number" name="slot_price" value={formData.slot_price} onChange={handleChange} style={inputStyle} placeholder="Enter Slot Price" required />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" type="submit">{slot?._id ? "Update Slot" : "Create Slot"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  export default CreateSlotModal;

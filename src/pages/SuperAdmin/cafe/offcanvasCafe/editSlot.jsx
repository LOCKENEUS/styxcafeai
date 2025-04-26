import React, { useState, useEffect } from "react";
import { Offcanvas, Form, Row, Col, Button } from "react-bootstrap";
import TimePicker from "react-time-picker"; // Assuming you're using 'react-time-picker'
import { getSlotDetails, getslots, updateslot } from "../../../../store/slices/slotsSlice";
import { useDispatch, useSelector } from "react-redux";

const EditSlotOffcanvas = ({ show, handleClose, slotID }) => {

  const [errors, setErrors] = useState({});
  console.log("slotID ---", slotID);
  const dispatch = useDispatch();
  const slotList = useSelector((state) => state.slots.slots || []);
  const [timeError, setTimeError] = useState({});
  // map slotList _id to slotID
  const shortlistedSlot = slotList.find((slot) => slot._id === slotID);
  console.log("shortlistedSlot finaly got week  ---", shortlistedSlot);
  const [saveLoder , setSaveLoder] = useState(false);

    // const slotList = useSelector((state) => state.slots.slotList || []);

    useEffect(() => {

      
      dispatch(getSlotDetails(slotID));
    }, [dispatch, slotID]);

    console.log("slots 44---", slotList);
    
  
  const [formState, setFormState] = useState({
    slotName: "",
    day: "",
    startTime: "",
    endTime: "",
    maxPlayers: "",
    slotPrice: "",
    adminNote: ""
  });
  useEffect(() => {
    if (shortlistedSlot) {
      setFormState({
        slotName: shortlistedSlot.slot_name || "",
        day: shortlistedSlot.day || "",
        startTime: convertTo24HourFormat(shortlistedSlot.start_time )|| "",
        endTime: convertTo24HourFormat(shortlistedSlot.end_time)  || "",
        maxPlayers: shortlistedSlot.players || "",
        slotPrice: shortlistedSlot.slot_price || "",
        adminNote: shortlistedSlot.adminNote || ""
      });
    }
  }, [shortlistedSlot]);

  // game_id 
  const GameID= shortlistedSlot?.game_id;

  console.log("GameID find ---", GameID);
  
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    const start = convertTo24HourFormat(updatedFormState.startTime);
  const end = convertTo24HourFormat(updatedFormState.endTime);

  if (end <= start) {
    setErrors({ endTime: 'End time must be after start time.' });
  } else {
    setTimeError({});
    setFormState(updatedFormState);
  }
  
    // atach validation players are not greater than maxPlayers
    if (name === 'maxPlayers') {
      if (value > shortlistedSlot.players) {
        setErrors((prev) => ({
          ...prev,
          maxPlayers: 'Max players cannot be greater than available players.'
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          maxPlayers: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
      setSaveLoder(true);
    const formDataToSend = {
      _id: slotID,
      game_id: GameID,
      start_time: convertTo24HourFormat(formState.startTime),
    end_time: convertTo24HourFormat(formState.endTime),
      day: formState.day,
      players: formState.maxPlayers,
      slot_price: formState.slotPrice,
      slot_name: formState.slotName,
      adminNote: formState.adminNote
    };

    try {
      await dispatch(updateslot({ id: slotID, updatedData: formDataToSend })).unwrap();
      handleClose();
      setSaveLoder(false);
    } catch (error) {
      console.error("Error updating slot:", error);
      setSaveLoder(false);
    }
  };
   

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "600px" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title><h2 className="text-primary fw-bold">Edit Slot</h2></Offcanvas.Title>
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
                  value={formState.slotName || ""}
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
                
                {timeError.endTime && <small className="text-danger">{timeError.endTime}</small>}

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
                  value={formState.maxPlayers  || ""}
                  onChange={handleChange}
                  placeholder="Enter max players"
                />
                {
                errors.maxPlayers && <small className="text-danger">{errors.maxPlayers}</small>
              }
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">Slot Price</Form.Label>
                <Form.Control
                  type="number"
                  name="slotPrice"
                  value={formState.slotPrice ||  ""}
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

          {/* <Button variant="success" type="submit" className="rounded-2 float-end my-5" >
          Save Slot
            
          </Button> */}
          <Button 
  variant="success" 
  type="submit" 
  className="rounded-2 float-end my-5"
  disabled={saveLoder}
>
  {saveLoder ? 'Saving...' : 'Save Slot'}
</Button>

        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default EditSlotOffcanvas;

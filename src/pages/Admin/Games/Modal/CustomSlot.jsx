// import React, { useState } from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { useDispatch } from "react-redux";
// import TimePicker from 'react-time-picker';
// // Also include styles
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';
// import { setSlotDataManually } from "../../../../store/slices/slotsSlice";
// import { useNavigate } from "react-router-dom";


// const CustomSlotModal = ({ show, handleClose, gameId, date }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     start_time: "",
//     end_time: "",
//     slot_price: "",
//   });

//   const convertTo24HourFormat = (time12h) => {
//     if (!time12h) return ""; // Handle empty case
//     const [time, modifier] = time12h.split(" ");
//     let [hours, minutes] = time.split(":");
//     if (modifier === "PM" && hours !== "12") {
//       hours = String(parseInt(hours, 10) + 12);
//     }
//     if (modifier === "AM" && hours === "12") {
//       hours = "00";
//     }
//     return `${hours}:${minutes}`;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleProceed = () => {
//     // You can also add validations here
//     if (!formData.start_time || !formData.end_time || !formData.slot_price) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     dispatch(setSlotDataManually(formData))
//     // onSubmit(formData); // Send to parent
//     navigate(`/admin/bookings/booking-details/${gameId}/0/${date}`);
//     handleClose(); // Optionally close modal after submission
//   };

//   const labelStyle = { fontWeight: "500", color: "#5A5A5A", fontSize: "1rem" };
//   const inputStyle = { border: "2px solid rgb(163, 164, 164)", borderRadius: "6px" };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Create Slot</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>

//           <Form.Group>
//             <Form.Label style={labelStyle}>
//               Start Time<span className="text-danger">*</span>
//             </Form.Label>
//             <div className="bootstrap-timepicker-wrapper mb-2">
//               <TimePicker
//                 name="start_time"
//                 onChange={(value) =>
//                   setFormData({ ...formData, start_time: value })
//                 }
//                 value={formData.start_time}
//                 format="hh:mm a"
//                 disableClock
//                 clearIcon={null}
//                 className="w-100"
//               />
//             </div>
//           </Form.Group>

//           <Form.Group>
//             <Form.Label style={labelStyle}>
//               End Time<span className="text-danger">*</span>
//             </Form.Label>
//             <div className="bootstrap-timepicker-wrapper mb-2">
//               <TimePicker
//                 name="end_time"
//                 onChange={(value) =>
//                   setFormData({ ...formData, end_time: value })
//                 }
//                 value={formData.end_time}
//                 format="hh:mm a"
//                 disableClock
//                 clearIcon={null}
//                 className="w-100"
//               />
//             </div>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label style={labelStyle}>Slot Price</Form.Label>
//             <Form.Control type="number" name="slot_price" value={formData.slot_price} onChange={handleChange} style={inputStyle} placeholder="Enter Slot Price" required />
//           </Form.Group>

//           <div className="d-flex justify-content-end">
//             <Button variant="secondary" className="me-2" onClick={handleClose}>Cancel</Button>
//             <Button variant="primary" type="button" onClick={handleProceed}>Proceed</Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default CustomSlotModal;





import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSlotDataManually } from "../../../../store/slices/slotsSlice";
import { useNavigate } from "react-router-dom";

const CustomSlotModal = ({ show, handleClose, gameId, date }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    slot_price: "",
  });

  const [startTimeParts, setStartTimeParts] = useState({ hour: "", minute: "", period: "AM" });
  const [endTimeParts, setEndTimeParts] = useState({ hour: "", minute: "", period: "AM" });

  const buildTimeString = (hour, minute, period) => {
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
  };

  useEffect(() => {
    const { hour, minute, period } = startTimeParts;
    if (hour && minute && period) {
      setFormData(prev => ({
        ...prev,
        start_time: buildTimeString(hour, minute, period),
      }));
    }
  }, [startTimeParts]);

  useEffect(() => {
    const { hour, minute, period } = endTimeParts;
    if (hour && minute && period) {
      setFormData(prev => ({
        ...prev,
        end_time: buildTimeString(hour, minute, period),
      }));
    }
  }, [endTimeParts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProceed = () => {
    if (!formData.start_time || !formData.end_time || !formData.slot_price) {
      alert("Please fill in all required fields.");
      return;
    }

    const convertTo24HourFormat = (time12h) => {
      if (!time12h) return "";
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

    const payload = {
      ...formData,
      start_time: convertTo24HourFormat(formData.start_time),
      end_time: convertTo24HourFormat(formData.end_time),
    };

    console.log("Payload:", payload);

    dispatch(setSlotDataManually(payload));
    navigate(`/admin/bookings/booking-details/${gameId}/0/${date}`);
    handleClose();
  };

  const labelStyle = { fontWeight: "500", color: "#5A5A5A", fontSize: "1rem" };
  const inputStyle = { border: "2px solid rgb(163, 164, 164)", borderRadius: "6px" };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Slot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label style={labelStyle}>Start Time<span className="text-danger">*</span></Form.Label>
            <Row className="mb-2">
              <Col>
                <Form.Select value={startTimeParts.hour} onChange={(e) =>
                  setStartTimeParts({ ...startTimeParts, hour: e.target.value })
                }>
                  <option value="">HH</option>
                  {[...Array(12)].map((_, i) => {
                    const val = (i + 1).toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select value={startTimeParts.minute} onChange={(e) =>
                  setStartTimeParts({ ...startTimeParts, minute: e.target.value })
                }>
                  <option value="">MM</option>
                  {[...Array(60)].map((_, i) => {
                    const val = i.toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select value={startTimeParts.period} onChange={(e) =>
                  setStartTimeParts({ ...startTimeParts, period: e.target.value })
                }>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group>
            <Form.Label style={labelStyle}>End Time<span className="text-danger">*</span></Form.Label>
            <Row className="mb-2">
              <Col>
                <Form.Select value={endTimeParts.hour} onChange={(e) =>
                  setEndTimeParts({ ...endTimeParts, hour: e.target.value })
                }>
                  <option value="">HH</option>
                  {[...Array(12)].map((_, i) => {
                    const val = (i + 1).toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select value={endTimeParts.minute} onChange={(e) =>
                  setEndTimeParts({ ...endTimeParts, minute: e.target.value })
                }>
                  <option value="">MM</option>
                  {[...Array(60)].map((_, i) => {
                    const val = i.toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select value={endTimeParts.period} onChange={(e) =>
                  setEndTimeParts({ ...endTimeParts, period: e.target.value })
                }>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Slot Price</Form.Label>
            <Form.Control type="number" name="slot_price" value={formData.slot_price} onChange={handleChange} style={inputStyle} placeholder="Enter Slot Price" required />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="button" onClick={handleProceed}>Proceed</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CustomSlotModal;


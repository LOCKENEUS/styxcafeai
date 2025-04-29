// import React, { useEffect, useState } from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { getGames } from "../../../../store/slices/gameSlice";
// import { addslot, updateslot } from "../../../../store/slices/slotsSlice";
// import TimePicker from 'react-time-picker';
// // Also include styles
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';


// const CreateSlotModal = ({ show, handleClose, selectedGame, slot, refetchSlots }) => {
//   const dispatch = useDispatch();
//   const user = JSON.parse(sessionStorage.getItem("user"));
//   const cafeId = user?._id;

//   const [formData, setFormData] = useState({
//     game_id: selectedGame?.data?._id,
//     day: "",
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

//   useEffect(() => {
//     if (slot) {
//       setFormData({
//         game_id: selectedGame?.data?._id,
//         day: slot.day,
//         start_time: convertTo24HourFormat(slot.start_time),
//         end_time: convertTo24HourFormat(slot.end_time),
//         slot_price: slot.slot_price,
//       });
//     }
//   }, [slot]);

//   useEffect(() => {
//     if (show) {
//       dispatch(getGames(cafeId));
//     }
//   }, [dispatch, cafeId, show]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (slot?._id) {
//       dispatch(updateslot({ id: slot?._id, updatedData: formData }));
//       setFormData({
//         game_id: selectedGame?.data?._id,
//         day: "",
//         start_time: "",
//         end_time: "",
//         slot_price: "",
//       });
//       handleClose();
//       refetchSlots(); // Refetch slots after updating
//     } else {
//       dispatch(addslot(formData));
//       console.log("refetch_called");
//       setFormData({
//         game_id: selectedGame?.data?._id,
//         day: "",
//         start_time: "",
//         end_time: "",
//         slot_price: "",
//       })
//       handleClose();
//       refetchSlots(); // Refetch slots after updating
//     }
//   };

//   const labelStyle = { fontWeight: "500", color: "#5A5A5A", fontSize: "1rem" };
//   const inputStyle = { border: "2px solid rgb(163, 164, 164)", borderRadius: "6px" };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Create Slot</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label style={labelStyle}>Day</Form.Label>
//             <Form.Select name="day" value={formData.day} onChange={handleChange} style={inputStyle} required>
//               <option value="">Pick Day</option>
//               <option value="Monday">Monday</option>
//               <option value="Tuesday">Tuesday</option>
//               <option value="Wednesday">Wednesday</option>
//               <option value="Thursday">Thursday</option>
//               <option value="Friday">Friday</option>
//               <option value="Saturday">Saturday</option>
//               <option value="Sunday">Sunday</option>
//             </Form.Select>
//           </Form.Group>

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
//             <Button variant="primary" type="submit">{slot?._id ? "Update Slot" : "Create Slot"}</Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default CreateSlotModal;


































import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getGames } from "../../../../store/slices/gameSlice";
import { addslot, updateslot } from "../../../../store/slices/slotsSlice";
import TimePicker from 'react-time-picker';
// Also include styles
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


const CreateSlotModal = ({ show, handleClose, selectedGame, slot, refetchSlots }) => {

  console.log("slot", slot);
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
  const [startTimeParts, setStartTimeParts] = useState({ hour: "", minute: "", period: "AM" });
  const [endTimeParts, setEndTimeParts] = useState({ hour: "", minute: "", period: "AM" });

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
    const { hour, minute, period } = startTimeParts;
    if (hour && minute && period) {
      setFormData((prev) => ({
        ...prev,
        start_time: buildTimeString(hour, minute, period),
      }));
    }
  }, [startTimeParts]);

  useEffect(() => {
    const { hour, minute, period } = endTimeParts;
    if (hour && minute && period) {
      setFormData((prev) => ({
        ...prev,
        end_time: buildTimeString(hour, minute, period),
      }));
    }
  }, [endTimeParts]);

  useEffect(() => {
    if (slot) {
      const convertTo12HourParts = (time24) => {
        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const period = hour >= 12 ? "PM" : "AM";
        if (hour === 0) hour = 12;
        else if (hour > 12) hour -= 12;
        return {
          hour: hour.toString().padStart(2, '0'),
          minute,
          period,
        };
      };

      const startParts = convertTo12HourParts(slot.start_time);
      const endParts = convertTo12HourParts(slot.end_time);

      setFormData({
        game_id: selectedGame?.data?._id,
        day: slot.day,
        start_time: `${startParts.hour}:${startParts.minute} ${startParts.period}`,
        end_time: `${endParts.hour}:${endParts.minute} ${endParts.period}`,
        slot_price: slot.slot_price,
      });

      setStartTimeParts(startParts);
      setEndTimeParts(endParts);
    }
  }, [slot, selectedGame]);

  console.log("formData...", formData);

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

    const payload = {
      ...formData,
      start_time: convertTo24HourFormat(formData.start_time),
      end_time: convertTo24HourFormat(formData.end_time),
    };

    console.log("payload", payload);

    if (slot?._id) {
      dispatch(updateslot({ id: slot?._id, updatedData: payload }));
      setFormData({
        game_id: selectedGame?.data?._id,
        day: "",
        start_time: "",
        end_time: "",
        slot_price: "",
      });
      handleClose();
      // refetchSlots(); // Refetch slots after updating
    } else {
      dispatch(addslot(payload));
      console.log("refetch_called");
      setFormData({
        game_id: selectedGame?.data?._id,
        day: "",
        start_time: "",
        end_time: "",
        slot_price: "",
      })
      handleClose();
      // refetchSlots(); // Refetch slots after updating
    }
  };

  const buildTimeString = (hour, minute, period) => {
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
  };

  const labelStyle = { fontWeight: "500", color: "#5A5A5A", fontSize: "1rem" };
  const inputStyle = { border: "2px solid rgb(163, 164, 164)", borderRadius: "6px" };

  console.log("formdata", formData);

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
            <Button variant="primary" type="submit">{slot?._id ? "Update Slot" : "Create Slot"}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSlotModal;

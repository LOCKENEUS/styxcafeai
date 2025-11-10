// import { useEffect, useState } from "react";
// import { Button, Col, Container, Form, Offcanvas, Row } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { addslot, getslots } from "../../../../store/slices/slotsSlice";
// import TimePicker from "react-time-picker";
// import { getGameById } from "../../../../store/slices/gameSlice";

// const AddSlotOffcanvas = ({show, handleClose,gameId}) => {
//     const [timeError, setTimeError] = useState(null);
//     const [errors, setErrors] = useState({});
//     const [formState, setFormState] = useState({
//       // game: '',
//       slotName: '',
//       // date: '',
//       day: '',
//       startTime: '',
//       endTime: '',
//       maxPlayers: '',
//       slotPrice: '',
//       adminNote: ''
//     });

//     useEffect(() => {
//       setFormState({
    

//         maxPlayers: selectedGame?.data?.players,
//         slotPrice: selectedGame?.data?.price,
    
//       });
//     }, [show]);

//     const dispatch = useDispatch();
//     const { slots  } = useSelector((state) => state.slots);

//     const cafeId = slots[0]?._id;
//     useEffect(() => {
//       dispatch(getslots(gameId));
//     }, [dispatch, gameId]);


//      const { selectedGame } = useSelector((state) => state.games);
//     useEffect(() => {
//         if (gameId ) {
         
//           dispatch(getGameById(gameId));
          
          
//         }
//       }, [ gameId,dispatch]);
    
//     const handleChange = (e) => {
//       const { name, value } = e.target;
    
//       setFormState((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
  
//       const newStart = name === 'startTime' ? value : formState.startTime;
//       const newEnd = name === 'endTime' ? value : formState.endTime;
    
//       if (newStart && newEnd) {
//         const start = new Date(`01/01/2023 ${newStart}`);
//         const end = new Date(`01/01/2023 ${newEnd}`);
    
//         if (end <= start) {
//           setTimeError("End time must be later than start time.");
//         } else {
//           setTimeError('');
          
//         }
//       }

//       // atach validation players are not greater than maxPlayers
//       if (name === 'maxPlayers') {
//         if (value > selectedGame?.data?.players) {
//           setErrors((prev) => ({
//             ...prev,
//             maxPlayers: 'Max players cannot be greater than available players.'
//           }));
//         } else {
//           setErrors((prev) => ({
//             ...prev,
//             maxPlayers: ''
//           }));
//         }
//       }
      
      
//     };
    
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
    
//       // Prepare object to send instead of FormData
//       const dataToSend = {
//         game_id: gameId,
//         _id: cafeId,
//         // game: formState.game,
//         slot_name: formState.slotName,
//         // date: formState.date,
//         day: formState.day,
//         start_time: formState.startTime,
//         end_time: formState.endTime,
//         players: formState.maxPlayers,
//         slot_price: formState.slotPrice,
//         adminNote: formState.adminNote
//       };
    
//       try {
//         await dispatch(addslot(dataToSend)).unwrap(); 
//         handleClose();
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         toast.error("Failed to update game. Please try again.");
//         handleClose();
//       }

//       // formdata  clear 
//       setFormState({ 

//         // game: '',
//       slotName: '',
//       // date: '',
//       day: '',
//       startTime: '',
//       endTime: '',
//       maxPlayers: '',
//       slotPrice: '',
//       adminNote: ''

//        });


//     };
    

//     return (
//         <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "600px" }}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title><h2 className="text-primary fw-bold">Add Slot</h2></Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <Container>
//           <Form onSubmit={handleSubmit} className="rounded-3 bg-white">
//         <Row className="mb-3 g-4">
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label className="fw-bold text-secondary">Slot Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="slotName"
//                 value={formState.slotName}
//                 onChange={handleChange}
//                 placeholder="Enter slot name"
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label className="fw-bold text-secondary">Day
//                 <span className="text-danger">*</span>
//               </Form.Label>
//               <Form.Select
//                 type="text"
//                 name="day"
//                 value={formState.day}
//                 onChange={handleChange}
//                 placeholder="Enter day"
//                 required
//               >
//                 <option value="">Select Day</option>
//                 <option value={"Monday"}>Monday</option>
//                 <option value={"Tuesday"}>Tuesday</option>
//                 <option value={"Wednesday"}>Wednesday</option>
//                 <option value={"Thursday"}>Thursday</option>
//                 <option value={"Friday"}>Friday</option>
//                 <option value={"Saturday"}>Saturday</option>
//                 <option value={"Sunday"}>Sunday</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row className="mb-3 g-4">
//         </Row>

//         <Row className="mb-3  g-4">
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label className="fw-bold text-secondary">Start Time
//                 <span className="text-danger">*</span>
//               </Form.Label>
//               {/* <Form.Control
//                 type="time"
//                 name="startTime"
//                 value={formState.startTime}
//                 onChange={handleChange}
//                 required
//               /> */}
//                <div className="bootstrap-timepicker-wrapper  mb-2  ">
//               <TimePicker
//                 name="startTime"
//                 value={formState.startTime}
//                 onChange={(value) =>
//                   handleChange({
//                     target: {
//                       name: 'startTime',
//                       value,
//                     },
//                   })
//                 }
//                 clearIcon={null}
//                 format="hh:mm a" 
//                 disableClock
//                 required
                
//               />
//               </div>
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label className="fw-bold text-secondary">End Time
//               <span className="text-danger">*</span>
//               </Form.Label>
//               <div className="bootstrap-timepicker-wrapper  mb-2  ">

//               <TimePicker
//                 name="endTime"
//                 value={formState.endTime}
//                 onChange={(value) =>
//                   handleChange({
//                     target: {
//                       name: 'endTime',
//                       value,
//                     },
//                   })
//                 }
//                 clearIcon={null}
//                 format="hh:mm a" 
//                 disableClock
//                 required
                
//               />
//               </div>
//               {timeError && (
//                 <small className="text-danger">
//                   {timeError}
//                 </small>
//               )}

//             </Form.Group>
//           </Col>
//         </Row>

//         <Row className="mb-3 g-4">
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label className="fw-bold text-secondary">Max Players Per Slot</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="maxPlayers"
//                 value={formState.maxPlayers  || ''}
//                 onChange={handleChange}
//                 placeholder="Enter max players"
//               />
//               {
//                 errors.maxPlayers && <small className="text-danger">{errors.maxPlayers}</small>
//               }
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label className="fw-bold text-secondary">Slot Price</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="slotPrice"
//                 value={formState.slotPrice || ''}
//                 onChange={handleChange}
//                 placeholder="Enter slot price"
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Form.Group className="mb-3">
//           <Form.Label className="fw-bold text-secondary">Admin Note</Form.Label>
//           <Form.Control
//             as="textarea"
//             className="border-2"
//             rows={3}
//             name="adminNote"
//             value={formState.adminNote}
//             onChange={handleChange}
//             placeholder="Enter any notes for admin"
//           />
//         </Form.Group>

//         <Button variant="success" type="submit" className="rounded-2 float-end my-5">
//           Submit 
//         </Button>
//       </Form>
//           </Container>
//         </Offcanvas.Body>
//       </Offcanvas>
//     )

// }
// export default AddSlotOffcanvas;

import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Offcanvas, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addslot, getslots } from "../../../../store/slices/slotsSlice";
import { getGameById } from "../../../../store/slices/gameSlice";

const AddSlotOffcanvas = ({show, handleClose,gameId}) => {
    const [timeError, setTimeError] = useState(null);
    const [errors, setErrors] = useState({});
    const [formState, setFormState] = useState({
      slotName: '',
      day: '',
      startTime: '',
      endTime: '',
      maxPlayers: '',
      slotPrice: '',
      adminNote: ''
    });
    
    // New state for time parts
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

    const buildTimeString = (hour, minute, period) => {
      return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
    };

    useEffect(() => {
      const { hour, minute, period } = startTimeParts;
      if (hour && minute && period) {
        setFormState(prev => ({
          ...prev,
          startTime: buildTimeString(hour, minute, period),
        }));
      }
    }, [startTimeParts]);

    useEffect(() => {
      const { hour, minute, period } = endTimeParts;
      if (hour && minute && period) {
        setFormState(prev => ({
          ...prev,
          endTime: buildTimeString(hour, minute, period),
        }));
      }
    }, [endTimeParts]);

    useEffect(() => {
      setFormState({
        maxPlayers: selectedGame?.data?.players,
        slotPrice: selectedGame?.data?.price,
      });
    }, [show]);

    const dispatch = useDispatch();
    const { slots  } = useSelector((state) => state.slots);

    const cafeId = slots[0]?._id;
    useEffect(() => {
      dispatch(getslots(gameId));
    }, [dispatch, gameId]);

    const { selectedGame } = useSelector((state) => state.games);
    useEffect(() => {
        if (gameId) {
          dispatch(getGameById(gameId));
        }
      }, [ gameId,dispatch]);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
    
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
  
      // Time validation
      if (name === 'startTime' || name === 'endTime') {
        const newStart = name === 'startTime' ? value : formState.startTime;
        const newEnd = name === 'endTime' ? value : formState.endTime;
      
        if (newStart && newEnd) {
          const start = convertTo24HourFormat(newStart);
          const end = convertTo24HourFormat(newEnd);
          const startDate = new Date(`01/01/2023 ${start}`);
          const endDate = new Date(`01/01/2023 ${end}`);
      
          if (endDate <= startDate) {
            setTimeError("End time must be later than start time.");
          } else {
            setTimeError('');
          }
        }
      }

      // Player validation
      if (name === 'maxPlayers') {
        if (value > selectedGame?.data?.players) {
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
    
      // Prepare object to send
      const dataToSend = {
        game_id: gameId,
        _id: cafeId,
        slot_name: formState.slotName,
        day: formState.day,
        start_time: convertTo24HourFormat(formState.startTime),
        end_time: convertTo24HourFormat(formState.endTime),
        players: formState.maxPlayers,
        slot_price: formState.slotPrice,
        adminNote: formState.adminNote
      };
    
      try {
        await dispatch(addslot(dataToSend)).unwrap(); 
        handleClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to update game. Please try again.");
        handleClose();
      }

      // Clear form data
      setFormState({ 
        slotName: '',
        day: '',
        startTime: '',
        endTime: '',
        maxPlayers: '',
        slotPrice: '',
        adminNote: ''
      });
    };
    

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "600px" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><h2 className="text-primary fw-bold">Add Slot</h2></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
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
              <Form.Label className="fw-bold text-secondary">Day
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                type="text"
                name="day"
                value={formState.day}
                onChange={handleChange}
                placeholder="Enter day"
                required
              >
                <option value="">Select Day</option>
                <option value={"Monday"}>Monday</option>
                <option value={"Tuesday"}>Tuesday</option>
                <option value={"Wednesday"}>Wednesday</option>
                <option value={"Thursday"}>Thursday</option>
                <option value={"Friday"}>Friday</option>
                <option value={"Saturday"}>Saturday</option>
                <option value={"Sunday"}>Sunday</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3 g-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold text-secondary">Start Time
                <span className="text-danger">*</span>
              </Form.Label>
              <Row className="mb-2">
                <Col className="">
                  <Form.Select 
                    className="p-2" 
                    value={startTimeParts.hour} 
                    onChange={(e) => setStartTimeParts({ ...startTimeParts, hour: e.target.value })}
                  >
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => {
                      const val = (i + 1).toString().padStart(2, '0');
                      return <option key={val} value={val}>{val}</option>;
                    })}
                  </Form.Select>
                </Col>
                <Col className="px-0">
                  <Form.Select 
                    className="p-2" 
                    value={startTimeParts.minute} 
                    onChange={(e) => setStartTimeParts({ ...startTimeParts, minute: e.target.value })}
                  >
                    <option value="">MM</option>
                    {[...Array(60)].map((_, i) => {
                      const val = i.toString().padStart(2, '0');
                      return <option key={val} value={val}>{val}</option>;
                    })}
                  </Form.Select>
                </Col>
                <Col className="px-0">
                  <Form.Select 
                    className="p-2" 
                    value={startTimeParts.period} 
                    onChange={(e) => setStartTimeParts({ ...startTimeParts, period: e.target.value })}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold text-secondary">End Time
                <span className="text-danger">*</span>
              </Form.Label>
              <Row className="mb-2">
                <Col className="px-0">
                  <Form.Select 
                    className="p-2" 
                    value={endTimeParts.hour} 
                    onChange={(e) => setEndTimeParts({ ...endTimeParts, hour: e.target.value })}
                  >
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => {
                      const val = (i + 1).toString().padStart(2, '0');
                      return <option key={val} value={val}>{val}</option>;
                    })}
                  </Form.Select>
                </Col>
                <Col className="px-0">
                  <Form.Select 
                    className="p-2" 
                    value={endTimeParts.minute} 
                    onChange={(e) => setEndTimeParts({ ...endTimeParts, minute: e.target.value })}
                  >
                    <option value="">MM</option>
                    {[...Array(60)].map((_, i) => {
                      const val = i.toString().padStart(2, '0');
                      return <option key={val} value={val}>{val}</option>;
                    })}
                  </Form.Select>
                </Col>
                <Col className="px-0">
                  <Form.Select 
                    className="p-2" 
                    value={endTimeParts.period} 
                    onChange={(e) => setEndTimeParts({ ...endTimeParts, period: e.target.value })}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </Form.Select>
                </Col>
              </Row>
              {timeError && (
                <small className="text-danger">
                  {timeError}
                </small>
              )}
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
                value={formState.maxPlayers  || ''}
                onChange={handleChange}
                placeholder="Enter max players"
              />
              {errors.maxPlayers && <small className="text-danger">{errors.maxPlayers}</small>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold text-secondary">Slot Price</Form.Label>
              <Form.Control
                type="number"
                name="slotPrice"
                value={formState.slotPrice || ''}
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
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    )
}

export default AddSlotOffcanvas;
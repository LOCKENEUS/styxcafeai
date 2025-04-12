import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Offcanvas, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addslot, getslots } from "../../../../store/slices/slotsSlice";
import TimePicker from "react-time-picker";

const AddSlotOffcanvas = ({show, handleClose,gameId}) => {
    console.log("Offcanvas game id",gameId);


    const [formState, setFormState] = useState({
      // game: '',
      slotName: '',
      // date: '',
      day: '',
      startTime: '',
      endTime: '',
      maxPlayers: '',
      slotPrice: '',
      adminNote: ''
    });

    const dispatch = useDispatch();
    const { slots  } = useSelector((state) => state.slots);
    const cafeId = slots[0]?._id;
    useEffect(() => {
      dispatch(getslots(gameId));
    }, [dispatch, gameId]);


    // console.log("Form State slots:", slots);
    // console.log("Form State slot CafeID:", cafeId);
  
    const handleChange = async (e) => {
      const { name, value } = e.target;
      setFormState({ ...formState, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log("Adding Slot:", formState);
    
      // Prepare object to send instead of FormData
      const dataToSend = {
        game_id: gameId,
        _id: cafeId,
        // game: formState.game,
        slot_name: formState.slotName,
        // date: formState.date,
        day: formState.day,
        start_time: formState.startTime,
        end_time: formState.endTime,
        maxPlayers: formState.maxPlayers,
        slot_price: formState.slotPrice,
        adminNote: formState.adminNote
      };
    
      try {
        await dispatch(addslot(dataToSend)).unwrap(); // send as plain object
        handleClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to update game. Please try again.");
        handleClose();
      }
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
          {/* <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold text-secondary">Select Game
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                type="text"
                name="game"
                value={formState.game}
                onChange={handleChange}
                placeholder="Enter game name"
                required
              >
                <option value="">Select Game</option>
                <option>101</option>
                <option>102</option>
              </Form.Select>
            </Form.Group>
          </Col> */}
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
          {/* <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold text-secondary">Date
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col> */}
          {/* <Col md={6}>
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
          </Col> */}
        </Row>

        <Row className="mb-3  g-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold text-secondary">Start Time
                <span className="text-danger">*</span>
              </Form.Label>
              {/* <Form.Control
                type="time"
                name="startTime"
                value={formState.startTime}
                onChange={handleChange}
                required
              /> */}
               <div className="bootstrap-timepicker-wrapper  mb-2  ">
              <TimePicker
                name="startTime"
                value={formState.startTime}
                onChange={(value) =>
                  handleChange({
                    target: {
                      name: 'startTime',
                      value,
                    },
                  })
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
              <Form.Label className="fw-bold text-secondary">End Time
              <span className="text-danger">*</span>
              </Form.Label>
              <div className="bootstrap-timepicker-wrapper  mb-2  ">

              <TimePicker
                name="startTime"
                value={formState.endTime}
                onChange={(value) =>
                  handleChange({
                    target: {
                      name: 'endTime',
                      value,
                    },
                  })
                }
                clearIcon={null}
                format="hh:mm a" 
                disableClock
                required
                
              />
              </div>
              {/* <Form.Control
                type="time"
                name="endTime"
                value={formState.endTime}
                onChange={handleChange}
                required
              /> */}
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
                value={formState.maxPlayers}
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
                value={formState.slotPrice}
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

        <Button variant="primary" type="submit">
          Submit 
        </Button>
      </Form>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    )

}
export default AddSlotOffcanvas;
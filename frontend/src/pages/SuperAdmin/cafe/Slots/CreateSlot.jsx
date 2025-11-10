import React, { useState, useEffect } from "react";
import { Button, Col, Form, Offcanvas, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getGames } from "../../../../store/slices/gameSlice";
import { addslot, updateslot } from "../../../../store/slices/slotsSlice";
import { toast } from "react-toastify";

const CreateSlot = ({
  show,
  handleClose,
  cafeId,
  isEditing,
  existingSlot,
  gameId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    availability: "true",
  });

  const [width, setWidth] = useState(window.innerWidth < 768 ? "80%" : "30%");

  const dispatch = useDispatch();
  const { games = [] } = useSelector((state) => state.games);

  const [startTimeParts, setStartTimeParts] = useState({ hour: "", minute: "", period: "AM" });
const [endTimeParts, setEndTimeParts] = useState({ hour: "", minute: "", period: "AM" });

const buildTimeString = (hour, minute, period) => {
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
};

const convertTo24HourFormat = (time12h) => {
  if (!time12h) return "";
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "PM" && hours !== "12") hours = String(parseInt(hours) + 12);
  if (modifier === "AM" && hours === "12") hours = "00";
  return `${hours}:${minutes}`;
};

// Update formData on dropdown change
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
  if (existingSlot) {
    const convertTo12HourParts = (time24) => {
      const [hourStr, minute] = time24.split(":");
      let hour = parseInt(hourStr, 10);
      const period = hour >= 12 ? "PM" : "AM";
      if (hour === 0) hour = 12;
      else if (hour > 12) hour -= 12;
      return {
        hour: hour.toString().padStart(2, "0"),
        minute,
        period,
      };
    };

    setStartTimeParts(convertTo12HourParts(existingSlot.start_time));
    setEndTimeParts(convertTo12HourParts(existingSlot.end_time));
  }
}, [existingSlot]);


  useEffect(() => {
    dispatch(getGames(cafeId));
  }, [dispatch, cafeId]);

  useEffect(() => {
    if (existingSlot) {
      setFormData({
        game: existingSlot._id || "",
        start_time: existingSlot.start_time || "",
        end_time: existingSlot.end_time || "",
        availability: existingSlot.availability ? "true" : "false",
      });
    }
  }, [existingSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     if (isEditing) {
  //       await dispatch(
  //         updateslot({ id: existingSlot?._id, updatedData: formData })
  //       ).unwrap();
  //       toast.success("Slot updated successfully!");
  //     } else {
  //       await dispatch(addslot({ ...formData, game_id: gameId })).unwrap();
  //       toast.success("Slot added successfully!");
  //     }

  //     setFormData({
  //       start_time: "",
  //       end_time: "",
  //       availability: "true",
  //     });
  //     handleClose();
  //   } catch (error) {
  //     toast.error(error || "Something went wrong. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const payload = {
    ...formData,
    start_time: convertTo24HourFormat(formData.start_time),
    end_time: convertTo24HourFormat(formData.end_time),
  };

  try {
    if (isEditing) {
      await dispatch(updateslot({ id: existingSlot?._id, updatedData: payload })).unwrap();
      toast.success("Slot updated successfully!");
    } else {
      await dispatch(addslot({ ...payload, game_id: gameId })).unwrap();
      toast.success("Slot added successfully!");
    }

    setFormData({
      start_time: "",
      end_time: "",
      availability: "true",
    });
    setStartTimeParts({ hour: "", minute: "", period: "AM" });
    setEndTimeParts({ hour: "", minute: "", period: "AM" });
    handleClose();
  } catch (error) {
    toast.error(error || "Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <h2 className="text-primary fw-bold">
            {!isEditing ? "Add New Slot" : "Edit Slot"}
          </h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          {/* <Row className="mb-2">
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="start_time"
                  className="fw-bold text-secondary"
                >
                  Start Time
                </Form.Label>
                <Form.Control
                  type="time"
                  id="start_time"
                  required
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="end_time"
                  className="fw-bold text-secondary"
                >
                  End Time
                </Form.Label>
                <Form.Control
                  type="time"
                  id="end_time"
                  required
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
          </Row> */}

          <Row className="mb-2">
  <Col md={12}>
    <Form.Group className="mb-2">
      <Form.Label htmlFor="start_time" className="fw-bold text-secondary">
        Start Time
      </Form.Label>
      <Row className="mb-2">
        <Col>
          <Form.Select
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
</Row>

<Row className="mb-2">
  <Col md={12}>
    <Form.Group className="mb-2">
      <Form.Label htmlFor="end_time" className="fw-bold text-secondary">
        End Time
      </Form.Label>
      <Row className="mb-2">
        <Col>
          <Form.Select
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
            value={endTimeParts.period}
            onChange={(e) => setEndTimeParts({ ...endTimeParts, period: e.target.value })}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </Form.Select>
        </Col>
      </Row>
    </Form.Group>
  </Col>
</Row>


          <Row className="mb-2">
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="availability"
                  className="fw-bold text-secondary"
                >
                  Available
                </Form.Label>
                <Form.Select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="py-2 border-2"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-2 d-flex gap-2 justify-content-end">
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Slot"
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              className="px-4 py-2 fw-bold"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CreateSlot;

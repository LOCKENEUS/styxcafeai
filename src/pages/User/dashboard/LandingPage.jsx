import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Button, Card, Badge, Carousel, Table } from 'react-bootstrap';
import { BiMapPin } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchCafeDetails, fetchGameDetails } from '../../../store/userSlice/BookingSlice';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './LandingPage.css';
import AuthOffcanvas from '../auth/AuthOffcanvas';

const LandingPage = () => {

  const images = [
    'https://www.ussportscamps.com/media/images/pickleball/tips/what-is-pickleball-group-rally.jpg', // replace with actual image paths
    'https://www.ussportscamps.com/media/images/pickleball/tips/what-is-pickleball-group-rally.jpg',
    'https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Training_Paddles/content.jpg&nw=780',
  ];

  const [activeTab, setActiveTab] = useState('book');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);

  const cafe = queryParams.get('cafe');
  const game = queryParams.get('game');

  const { cafeDetails, gameDetails, loading, error } = useSelector((state) => state.userBooking);

  useEffect(() => {
    // Fetch data based on cafe and game
    if (cafe && game) {
      // Fetch data for the selected cafe and game
      dispatch(fetchCafeDetails(cafe));
      dispatch(fetchGameDetails(game));
    }
  }, [cafe, game]);

  const [expanded, setExpanded] = useState(true);

  const toggleCard = () => setExpanded(!expanded);

  // Generate time slots from 6 AM to 12 AM (midnight)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      const time = hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      slots.push({ hour, time });
    }
    return slots;
  };

  // Generate dates for current day and next 3 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dates.push({
        date: date,
        dayName,
        dateStr,
        fullDate: date.toDateString()
      });
    }
    return dates;
  };

  const timeSlots = generateTimeSlots();
  const dates = generateDates();

  const handleSlotClick = (dateIndex, timeIndex) => {
    const date = dates[dateIndex];
    const dayName = date.date.toLocaleDateString('en-US', { weekday: 'long' });
    const availableSlots = gameDetails?.slots?.[dayName] || [];

    const matchingSlot = availableSlots.find(
      (s) => s.start_time === `${timeSlots[timeIndex].hour.toString().padStart(2, '0')}:00`
    );

    console.log("selected slots...", selectedSlots)

    if (!matchingSlot) return;

    const slotKey = `${dateIndex}-${timeIndex}`;
    const isAlreadySelected = selectedSlots?.some(s => s._key === slotKey);

    let updatedSlots;
    if (isAlreadySelected) {
      updatedSlots = selectedSlots.filter(s => s._key !== slotKey);
    } else {
      const slotInfo = {
        _key: slotKey, // unique identifier
        ...matchingSlot,
        uiDate: date.fullDate,        // e.g., "2025-08-09"
        uiDayName: date.dayName,      // e.g., "Saturday"
      };
      updatedSlots = [...selectedSlots, slotInfo];
    }

    setSelectedSlots(updatedSlots);
  };

  const handleBookNow = () => {
    setShowSlots(!showSlots);
    if (!showSlots) {
      setSelectedSlots([]); // Clear selections when opening
    }
  };

  return (
    <Container fluid className="p-3">
      <Row className="d-flex flex-column flex-md-row align-items-start">
        <Col md={5} className="position-relative mb-3 mb-md-0">
          <div className="carousel-wrapper position-relative" style={{ maxHeight: '300px', overflow: 'hidden' }}>
            <Carousel controls={true} indicators={true} interval={null}>
              {images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100 object-fit-cover rounded-2"
                    src={img}
                    alt={`Slide ${idx}`}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </Col>

        <Col md={7}>
          <div className="d-flex px-4 py-2 justify-content-between align-items-start">
            <div>
              <h2 className="fw-bold">{cafeDetails?.cafe_name} | {cafeDetails?.city} <Badge bg="warning" className="text-dark fw-bold">Open</Badge></h2>
              <p className="mb-1 text-muted" style={{ fontSize: '1.2rem' }}>
                <BiMapPin className="me-1" />
                {cafeDetails?.location?.address}
              </p>
              <p className="mb-0" style={{ fontSize: '1rem' }}>
                <strong>{gameDetails?.name}</strong>
              </p>
            </div>

            <div className="text-end">
              <Button className="p-0 border-0 btn-style">
                <FaStar color="#ffc107" size={16} />
                <span className="ms-1 text-dark fw-bold">4.88</span>
              </Button>
            </div>
          </div>

          <Row className="p-4">
            <Col md={2}>
              <div><img src="/assets/Admin/Game/paylater.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />Online Payment</div>
            </Col>
            <Col md={2}>
              <div><img src="/assets/Admin/Game/singleplayer.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />Single Player</div>
            </Col>
            <Col md={2}>
              <div><img src="/assets/Admin/Game/indoor.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />Indoor</div>
            </Col>
            <Col md={2}>
              <div><img src="/assets/Admin/Game/crosssign.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />Cross Sign</div>
            </Col>
          </Row>

          <Row className="p-4">
            <Col md={8}>
              <h2>&#x20B9; {gameDetails?.price} per hour</h2>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="book" className="fw-bold text-uppercase text-warning">Book A Slot</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="details" className="fw-bold text-uppercase">Details</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="book">
              <Row>
                <Col lg={8}>
                  {/* Step 2 */}
                  <div className="p-3 bg-light rounded shadow-sm mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="step-circle">1</div>
                      <h5 className="mb-0 ms-2 fw-bold">Select an Activity </h5>
                    </div>
                    <p className="text-muted ps-4 mb-0">{gameDetails?.name}</p>
                  </div>

                  <Row>
                    <Col lg={12}>
                      {/* Step for Slot Selection */}
                      <div className="p-3 bg-white rounded shadow-sm mb-3">
                        <div className="d-flex align-items-center mb-3">
                          <div className="step-circle">2</div>
                          <h5 className="mb-0 ms-2 fw-bold">Select Your Time Slots</h5>
                        </div>

                        {/* Book Now Button */}
                        <div className="mb-4">
                          <Button
                            className="btn-style fw-bold px-4 py-2"
                            onClick={handleBookNow}
                            size="lg"
                          >
                            {showSlots ? 'Hide Available Slots' : 'Show Available Slots'}
                          </Button>
                        </div>

                        {/* Time Slots Grid */}
                        {showSlots && (
                          <div className="mt-4">
                            <div className="mb-3">
                              <Badge bg="warning" className="text-dark fw-bold me-2">Available Slots</Badge>
                              <small className="text-muted">Click on slots to select multiple time slots</small>
                            </div>

                            <div className="table-responsive">
                              <Table bordered className="mb-0">
                                <thead>
                                  <tr>
                                    <th className="time-header text-center" style={{ width: '120px', borderColor: '#ffc107' }}>
                                      <div className="fw-bold">Time</div>
                                    </th>
                                    {dates.map((date, index) => (
                                      <th key={index} className="date-header text-center" style={{ borderColor: '#ffc107' }}>
                                        <div className="fw-bold">{date.dayName}</div>
                                        <small style={{ opacity: 0.8 }}>{date.dateStr}</small>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {timeSlots.map((slot, timeIndex) => (
                                    <tr key={timeIndex}>
                                      <td className="time-header text-center align-middle fw-bold" style={{ borderColor: '#ffc107' }}>
                                        {slot.time}
                                      </td>
                                      {dates.map((date, dateIndex) => {
                                        const slotId = `${dateIndex}-${timeIndex}`;
                                        const isSelected = selectedSlots.some(slot => slot._key === slotId);

                                        const dayName = date.date.toLocaleDateString('en-US', { weekday: 'long' });
                                        const availableSlots = gameDetails?.slots?.[dayName] || [];

                                        const slotMatch = availableSlots.find(
                                          (s) => s.start_time === `${slot.hour.toString().padStart(2, '0')}:00`
                                        );

                                        const isAvailable = !!slotMatch && slotMatch.availability;

                                        return (
                                          <td key={dateIndex} className="p-2" style={{ borderColor: '#ffc107' }}>
                                            {isAvailable ? (
                                              <Button
                                                className={`slot-btn w-100 ${isSelected ? 'selected' : ''}`}
                                                onClick={() => handleSlotClick(dateIndex, timeIndex)}
                                                variant=""
                                              >
                                                {isSelected ? '✓ Selected' : 'Available'}
                                              </Button>
                                            ) : (
                                              <Button className="slot-btn w-100 disabled" variant="light" disabled>
                                                Unavailable
                                              </Button>
                                            )}
                                          </td>
                                        );
                                      })}

                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col lg={4}>
                  {/* {selectedSlots.length > 0 ? (

                    selectedSlots.map((slot, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded border">
                        <div>
                          <div className="fw-semibold text-primary">{slot.uiDayName}</div>
                          <small className="text-muted">{slot.start_time} - {slot.end_time}</small>
                        </div>
                        <Badge bg="success">₹{slot.slot_price}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="bg-light p-5 text-center rounded shadow-sm h-100 d-flex flex-column justify-content-center">
                      <div className="text-muted">
                        <div className="mb-3">
                          <div
                            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '80px',
                              height: '80px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '50%',
                              border: '2px dashed #dee2e6'
                            }}
                          >
                            📅
                          </div>
                        </div>
                        <div className="fw-semibold">No slots selected yet!</div>
                        <small>Click "Show Available Slots" and select your preferred time slots</small>
                      </div>
                    </div>
                  )} */}

                  {selectedSlots.length > 0 ? (
                    <div className="booking-summary p-4 shadow-sm h-100">
                      <h5 className="fw-bold mb-3 text-center">
                        <Badge bg="warning" className="text-dark">Booking Summary</Badge>
                      </h5>
                      <Card style={{ backgroundColor: '#ffffffff', borderColor: '#e2be9dff' }} className="p-2 rounded-2 mb-3">
                        <div
                          onClick={toggleCard}
                          className="d-flex justify-content-between align-items-center"
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="fw-semibold text-muted">Know more</span>
                          {expanded ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {expanded && (
                          <div className="mt-2 ps-1">
                            <p className="mb-1">- FREE Pickleball equipment rental is available on-site.</p>
                            <p className="mb-0">- Please maintain cleanliness on courts.</p>
                          </div>
                        )}
                      </Card>

                      <div className="mb-3">
                        <h6 className="fw-bold">Selected Slots ({selectedSlots.length}):</h6>
                        <div className="max-height-200" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {selectedSlots?.map((slot, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded border">
                              {/* <div>
                                <div className="fw-semibold text-primary">{slot.dayName}</div>
                                <small className="text-muted">{slot.time}</small>
                              </div>
                              <Badge bg="success">₹300</Badge> */}
                              <div>
                                <div className="fw-semibold text-primary">{slot.uiDayName}</div>
                                <small className="text-muted">{slot.start_time} - {slot.end_time}</small>
                              </div>
                              <Badge bg="success">₹{slot.slot_price}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold">Total Amount:</span>
                        <span className="fw-bold h5 mb-0 text-primary">  ₹{selectedSlots.reduce((total, slot) => total + (slot.slot_price || 0), 0)}</span>
                      </div>

                      {isAuthenticated ? <Button
                        className="w-100 fw-bold py-2"
                        style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#2b2a2aff' }}
                        size="lg"
                      >
                        Proceed to Book ({selectedSlots.size} slots)
                      </Button>
                        :
                        <Button
                          className="w-100 fw-bold py-2"
                          style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#2b2a2aff' }}
                          size="lg"
                          onClick={() => setShowCanvas(true)}
                        >
                          Login/SignUp
                        </Button>
                      }
                    </div>
                  ) : (
                    <div className="bg-light p-5 text-center rounded shadow-sm h-100 d-flex flex-column justify-content-center">
                      <div className="text-muted">
                        <div className="mb-3">
                          <div
                            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '80px',
                              height: '80px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '50%',
                              border: '2px dashed #dee2e6'
                            }}
                          >
                            📅
                          </div>
                        </div>
                        <div className="fw-semibold">No slots selected yet!</div>
                        <small>Click "Show Available Slots" and select your preferred time slots</small>
                      </div>
                    </div>
                  )}

                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="details">
              <div className="bg-white p-4 rounded shadow-sm">
                <h5>Venue Details</h5>
                <p>This is where venue details or any other content will be shown.</p>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Row>
      <AuthOffcanvas show={showCanvas} onClose={() => setShowCanvas(false)} cafe={cafe} />
    </Container >
  );
};

export default LandingPage;
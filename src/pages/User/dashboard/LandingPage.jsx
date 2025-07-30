import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Button, Card, Badge, Carousel, Table } from 'react-bootstrap';
import { BiMapPin } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchCafeDetails } from '../../../store/userSlice/BookingSlice';

const LandingPage = () => {
  
  const images = [
    'https://www.ussportscamps.com/media/images/pickleball/tips/what-is-pickleball-group-rally.jpg', // replace with actual image paths
    'https://www.ussportscamps.com/media/images/pickleball/tips/what-is-pickleball-group-rally.jpg',
    'https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Training_Paddles/content.jpg&nw=780',
  ];

  const activities = [
    {
      name: 'Padel',
      price: 750,
      facilities: '1 Facility/Session Available',
    },
    {
      name: 'Pickleball (Outdoor)',
      price: 300,
      facilities: '2 Facilities/Sessions Available',
    },
  ];

  const [activeTab, setActiveTab] = useState('book');

  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState(new Set());

  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);

  const cafe = queryParams.get('cafe');
  const game = queryParams.get('game');

  const { cafeDetails, loading, error } = useSelector((state) => state.userBooking);

  console.log("cafe details", cafeDetails)

  useEffect(() => {
    // Fetch data based on cafe and game
    if (cafe && game) {
      // Fetch data for the selected cafe and game
      dispatch(fetchCafeDetails(cafe));
    }
  }, [cafe, game]);

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
    const slotId = `${dateIndex}-${timeIndex}`;
    const newSelectedSlots = new Set(selectedSlots);

    if (newSelectedSlots.has(slotId)) {
      newSelectedSlots.delete(slotId);
    } else {
      newSelectedSlots.add(slotId);
    }

    setSelectedSlots(newSelectedSlots);
  };

  const handleBookNow = () => {
    setShowSlots(!showSlots);
    if (!showSlots) {
      setSelectedSlots(new Set()); // Clear selections when opening
    }
  };

  const getSelectedSlotsInfo = () => {
    const selected = [];
    selectedSlots.forEach(slotId => {
      const [dateIndex, timeIndex] = slotId.split('-').map(Number);
      selected.push({
        date: dates[dateIndex].fullDate,
        time: timeSlots[timeIndex].time,
        dayName: dates[dateIndex].dayName
      });
    });
    return selected;
  };

  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  // Sample players data - replace with your actual data
  const availablePlayers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', rating: 4.5 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', rating: 4.2 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', rating: 4.8 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', rating: 4.1 },
    { id: 5, name: 'David Brown', email: 'david@example.com', rating: 4.6 },
    { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', rating: 4.3 },
    { id: 7, name: 'Tom Davis', email: 'tom@example.com', rating: 4.7 },
    { id: 8, name: 'Emily Taylor', email: 'emily@example.com', rating: 4.4 },
  ];

  const handleSelectPlayerClick = () => {
    setShowInput(!showInput);
    if (!showInput) {
      setSearchTerm('');
      setFilteredPlayers([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredPlayers([]);
    } else {
      const filtered = availablePlayers.filter(player =>
        player.name.toLowerCase().includes(value.toLowerCase()) ||
        player.email.toLowerCase().includes(value.toLowerCase())
      ).filter(player => !selectedPlayers.find(selected => selected.id === player.id));
      setFilteredPlayers(filtered);
    }
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayers([...selectedPlayers, player]);
    setSearchTerm('');
    setFilteredPlayers([]);
    setShowInput(false);
  };

  const handleRemovePlayer = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(player => player.id !== playerId));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" style={{ color: '#ffc107' }}>☆</span>);
    }
    return stars;
  };

  return (
    <Container fluid className="p-3">
      {/* <style>
        {`
          .step-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #ffc107;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .btn-style {
            color: #2b2a2aff;
            background-color: #fafafa;
            border: 1px solid #ffc107;
          }
        `}
      </style> */}

      <style>
        {`
          .step-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #ffc107;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
          }

          .btn-style {
            color: #2b2a2aff;
            background-color: #fafafa;
            border: 1px solid #ffc107;
          }

          .btn-style:hover {
            background-color: #ffc107;
            color: #fff;
          }

          .slot-btn {
            min-height: 45px;
            border: 1px solid #dee2e6;
            background-color: #fafafa;
            color: #2b2a2aff;
            font-size: 0.85rem;
            transition: all 0.2s ease;
          }

          .slot-btn:hover {
            border-color: #ffc107;
            background-color: #fff8e1;
          }

          .slot-btn.selected {
            background-color: #ffc107;
            border-color: #ffc107;
            color: #fff;
            font-weight: bold;
          }

          .time-header {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2b2a2aff;
          }

          .date-header {
            background-color: #2b2a2aff;
            color: #fff;
          }

          .booking-summary {
            background: linear-gradient(135deg, #fff8e1 0%, #fafafa 100%);
            border: 1px solid #ffc107;
            border-radius: 8px;
          }
        `}
      </style>

      {/* <style>
        {`
          .step-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #ffc107;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
          }

          .btn-style {
            color: #2b2a2aff;
            background-color: #fafafa;
            border: 1px solid #ffc107;
            transition: all 0.2s ease;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
          }

          .btn-style:hover {
            background-color: #ffc107;
            color: #fff;
          }

          .search-input {
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 1rem;
            width: 100%;
            outline: none;
          }

          .search-input:focus {
            box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
            border-color: #ffc107;
          }

          .search-input:disabled {
            background-color: #f8f9fa;
            border-color: #dee2e6;
            color: #6c757d;
          }

          .player-item {
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            margin-bottom: 8px;
            padding: 16px;
            background-color: #fff;
          }

          .player-item:hover {
            background-color: #fff8e1;
            border-color: #ffc107;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }

          .selected-player {
            background: linear-gradient(135deg, #fff8e1 0%, #fafafa 100%);
            border: 1px solid #ffc107;
            border-radius: 8px;
            margin-bottom: 10px;
            padding: 16px;
          }

          .remove-btn {
            background-color: #dc3545;
            border: none;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: bold;
          }

          .remove-btn:hover {
            background-color: #c82333;
            transform: scale(1.1);
          }

          .dropdown-list {
            max-height: 250px;
            overflow-y: auto;
            border: 1px solid #ffc107;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            position: absolute;
            width: 100%;
            z-index: 1000;
            margin-top: 8px;
          }

          .badge {
            background-color: #ffc107;
            color: #2b2a2aff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: bold;
          }

          .badge-primary {
            background-color: #007bff;
            color: white;
          }

          .badge-success {
            background-color: #28a745;
            color: white;
          }

          .card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 1.5rem;
            margin-bottom: 1rem;
          }

          .empty-state {
            background-color: #f8f9fa;
            padding: 3rem;
            text-align: center;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .summary-card {
            background: linear-gradient(135deg, #fff8e1 0%, #fafafa 100%);
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 8px;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #dee2e6;
          }

          .row {
            display: flex;
            flex-wrap: wrap;
            margin: -0.5rem;
          }

          .col-lg-8 {
            flex: 0 0 66.666667%;
            max-width: 66.666667%;
            padding: 0.5rem;
          }

          .col-lg-4 {
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
            padding: 0.5rem;
          }

          .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%;
            padding: 0.5rem;
          }

          @media (max-width: 768px) {
            .col-lg-8, .col-lg-4, .col-md-6 {
              flex: 0 0 100%;
              max-width: 100%;
            }
          }
        `}
      </style> */}
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
          <div className="d-flex p-4 justify-content-between align-items-start">
            <div>
              <h2 className="fw-bold">{cafeDetails?.cafe_name} | {cafeDetails?.city} <Badge bg="warning" className="text-dark fw-bold">Open</Badge></h2>
              <p className="mb-1 text-muted" style={{ fontSize: '1.2rem' }}>
                <BiMapPin className="me-1" />
                 {cafeDetails?.location?.address}
              </p>
              <p className="mb-0" style={{ fontSize: '1rem' }}>
                <strong>Game:</strong> Pickle Ball
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
              <h2>&#x20B9; 300 per hour</h2>
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
                  {/* <div className="p-3 bg-white rounded shadow-sm mb-3">
                    <div className="d-flex align-items-center mb-3">
                      <div className="step-circle">1</div>
                      <h5 className="mb-0 ms-2 fw-bold">Choose convinient slot</h5>
                    </div>

                    <Row>
                      {activities.map((act, idx) => (
                        <Col sm={6} key={idx} className="mb-3">
                          <Card className="border rounded">
                            <Card.Body>
                              <Card.Title className="fw-semibold">{act.name}</Card.Title>
                              <Card.Text className="text-muted small">{act.facilities}</Card.Text>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold">₹ {act.price} <small className="text-muted">onwards</small></div>
                                <Button className='btn-style' size="sm">Book</Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div> */}

                  {/* <div className="row">
                    <div className="col-lg-8">
                      <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                          <div className="step-circle">4</div>
                          <h5 style={{ margin: '0 0 0 0.5rem', fontWeight: 'bold' }}>Select Players</h5>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <button
                            className="btn-style"
                            onClick={handleSelectPlayerClick}
                          >
                            {showInput ? 'Cancel Selection' : 'Select Player'}
                          </button>
                        </div>

                        {showInput && (
                          <div style={{ marginBottom: '1rem', position: 'relative' }}>
                            <input
                              type="text"
                              placeholder="Search players by name or email..."
                              value={searchTerm}
                              onChange={handleSearchChange}
                              className="search-input"
                              autoFocus
                            />

                            {filteredPlayers.length > 0 ? (
                              <div className="dropdown-list">
                                {filteredPlayers.map((player) => (
                                  <div
                                    key={player.id}
                                    className="player-item"
                                    onClick={() => handlePlayerSelect(player)}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div>
                                        <div style={{ fontWeight: '600', color: '#007bff' }}>{player.name}</div>
                                        <small style={{ color: '#6c757d' }}>{player.email}</small>
                                      </div>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          {renderStars(player.rating)}
                                          <span style={{ marginLeft: '4px', fontSize: '0.8rem', color: '#6c757d' }}>({player.rating})</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ): (
                              <div className="dropdown-list">
                                {availablePlayers.map((player) => (
                                  <div
                                    key={player.id}
                                    className="player-item"
                                    onClick={() => handlePlayerSelect(player)}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div>
                                        <div style={{ fontWeight: '600', color: '#007bff' }}>{player.name}</div>
                                        <small style={{ color: '#6c757d' }}>{player.email}</small>
                                      </div>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          {renderStars(player.rating)}
                                          <span style={{ marginLeft: '4px', fontSize: '0.8rem', color: '#6c757d' }}>({player.rating})</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {searchTerm && filteredPlayers.length === 0 && (
                              <div className="dropdown-list" style={{ padding: '1rem', textAlign: 'center', color: '#6c757d' }}>
                                No players found matching "{searchTerm}"
                              </div>
                            )}
                          </div>
                        )}

                        {selectedPlayers.length > 0 && (
                          <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                              <span className="badge">
                                Selected Players ({selectedPlayers.length})
                              </span>
                            </div>

                            <div className="row">
                              {selectedPlayers.map((player) => (
                                <div key={player.id} className="col-md-6">
                                  <div className="selected-player">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div style={{ flexGrow: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#007bff', marginBottom: '4px' }}>{player.name}</div>
                                        <small style={{ color: '#6c757d', display: 'block', marginBottom: '8px' }}>{player.email}</small>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          {renderStars(player.rating)}
                                          <span style={{ marginLeft: '4px', fontSize: '0.8rem', color: '#6c757d' }}>({player.rating})</span>
                                        </div>
                                      </div>
                                      <button
                                        className="remove-btn"
                                        onClick={() => handleRemovePlayer(player.id)}
                                        title="Remove player"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4">
                      {selectedPlayers.length > 0 ? (
                        <div className="summary-card">
                          <h5 style={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                            <span className="badge">Player Summary</span>
                          </h5>

                          <div style={{ marginBottom: '1rem' }}>
                            <h6 style={{ fontWeight: 'bold' }}>Team Composition:</h6>
                            <div className="summary-item">
                              <span>Total Players:</span>
                              <span className="badge badge-primary">{selectedPlayers.length}</span>
                            </div>
                            <div className="summary-item">
                              <span>Average Rating:</span>
                              <span className="badge badge-success">
                                {selectedPlayers.length > 0
                                  ? (selectedPlayers.reduce((sum, p) => sum + p.rating, 0) / selectedPlayers.length).toFixed(1)
                                  : '0.0'
                                }
                              </span>
                            </div>
                          </div>

                          <hr />

                          <div style={{ textAlign: 'center' }}>
                            <small style={{ color: '#6c757d' }}>
                              {selectedPlayers.length === 0 && "No players selected"}
                              {selectedPlayers.length === 1 && "Single player selected"}
                              {selectedPlayers.length > 1 && `${selectedPlayers.length} players ready to play`}
                            </small>
                          </div>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <div style={{ color: '#6c757d' }}>
                            <div style={{ marginBottom: '1rem' }}>
                              <div
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '50%',
                                  border: '2px dashed #dee2e6',
                                  margin: '0 auto 1rem auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '2rem'
                                }}
                              >
                                👥
                              </div>
                            </div>
                            <div style={{ fontWeight: '600' }}>No players selected!</div>
                            <small>Click "Select Player" to add players to your game</small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Step 2 */}
                  <div className="p-3 bg-light rounded shadow-sm mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="step-circle">1</div>
                      <h5 className="mb-0 ms-2 fw-bold">Choose a Facility</h5>
                    </div>
                    <p className="text-muted ps-4 mb-0">Please select an activity to view available facilities</p>
                  </div>

                  {/* Step 3 */}
                  {/* <div className="p-3 bg-light rounded shadow-sm mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="step-circle">3</div>
                      <h5 className="mb-0 ms-2 fw-bold">Select Slots</h5>
                    </div>
                  </div> */}

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
                                        const isSelected = selectedSlots.has(slotId);

                                        return (
                                          <td key={dateIndex} className="p-2" style={{ borderColor: '#ffc107' }}>
                                            <Button
                                              className={`slot-btn w-100 ${isSelected ? 'selected' : ''}`}
                                              onClick={() => handleSlotClick(dateIndex, timeIndex)}
                                              variant=""
                                            >
                                              {isSelected ? '✓ Selected' : 'Available'}
                                            </Button>
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

                    {/* <Col lg={4}>
                      {selectedSlots.size > 0 ? (
                        <div className="booking-summary p-4 shadow-sm h-100">
                          <h5 className="fw-bold mb-3 text-center">
                            <Badge bg="warning" className="text-dark">Booking Summary</Badge>
                          </h5>

                          <div className="mb-3">
                            <h6 className="fw-bold">Selected Slots ({selectedSlots.size}):</h6>
                            <div className="max-height-200" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {getSelectedSlotsInfo().map((slot, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded border">
                                  <div>
                                    <div className="fw-semibold text-primary">{slot.dayName}</div>
                                    <small className="text-muted">{slot.time}</small>
                                  </div>
                                  <Badge bg="success">₹300</Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <hr />

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-bold">Total Amount:</span>
                            <span className="fw-bold h5 mb-0 text-primary">₹{selectedSlots.size * 300}</span>
                          </div>

                          <Button
                            className="w-100 fw-bold py-2"
                            style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#2b2a2aff' }}
                            size="lg"
                          >
                            Proceed to Book ({selectedSlots.size} slots)
                          </Button>
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
                    </Col> */}
                  </Row>
                </Col>

                <Col lg={4}>
                  {selectedSlots.size > 0 ? (
                    <div className="booking-summary p-4 shadow-sm h-100">
                      <h5 className="fw-bold mb-3 text-center">
                        <Badge bg="warning" className="text-dark">Booking Summary</Badge>
                      </h5>

                      <div className="mb-3">
                        <h6 className="fw-bold">Selected Slots ({selectedSlots.size}):</h6>
                        <div className="max-height-200" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {getSelectedSlotsInfo().map((slot, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded border">
                              <div>
                                <div className="fw-semibold text-primary">{slot.dayName}</div>
                                <small className="text-muted">{slot.time}</small>
                              </div>
                              <Badge bg="success">₹300</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold">Total Amount:</span>
                        <span className="fw-bold h5 mb-0 text-primary">₹{selectedSlots.size * 300}</span>
                      </div>

                      <Button
                        className="w-100 fw-bold py-2"
                        style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#2b2a2aff' }}
                        size="lg"
                      >
                        Proceed to Book ({selectedSlots.size} slots)
                      </Button>
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
    </Container >
  );
};

export default LandingPage;
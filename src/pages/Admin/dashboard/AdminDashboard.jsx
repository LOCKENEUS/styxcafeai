import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import user_forbid_fil from '/assets/Admin/Dashboard/mingcute_user-forbid-fill.svg';
import user_x_fill from '/assets/Admin/Dashboard/mingcute_user-x-fill.svg';
import user_check from '/assets/Admin/Dashboard/solar_user-check-bold.svg';
import rupee_circle from '/assets/Admin/Dashboard/mynaui_rupee-circle-solid.svg';
import { BsXCircle, BsCheckCircle, BsCalculator, BsCalendar3, BsSearch } from 'react-icons/bs';
import { MdOutlineArrowOutward } from 'react-icons/md';

import gm1 from '/assets/Admin/Dashboard/GamesImage/gm1.png'
import gm2 from '/assets/Admin/Dashboard/GamesImage/gm2.png'
import gm3 from '/assets/Admin/Dashboard/GamesImage/gm3.png'
import TGm1 from '/assets/Admin/Dashboard/GamesImage/TGm1.png'
import TGm2 from '/assets/Admin/Dashboard/GamesImage/Tgm2.png'
import { Link } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGames } from '../../../store/slices/gameSlice';
import { useNavigate } from 'react-router-dom';
import Nogame from "/assets/Admin/Game/No Game.png";
import gsap from 'gsap';

const summaryData = [
  {
    title: "Total Online Bookings",
    value: "145",
    icon: user_check,
    bgColor: '#00AF0F0D'
  },
  {
    title: "Total Waiting Bookings",
    value: "45",
    icon: user_forbid_fil,
    bgColor: '#F0D4000D'
  },
  {
    title: "Total Cancel Booking",
    value: "05",
    icon: user_x_fill,
    bgColor: '#FF00000D'
  },
  {
    title: "Total Payments",
    value: "7200",
    icon: rupee_circle,
    bgColor: '#00D5ED0D'
  }
];

const tournaments = [
  {
    title: "Black Warrior Gaming Tournaments",
    datetime: "04:00 PM | Sunday, 6 March, 2025",
    price: 700,
    image: TGm1,
    isLive: true
  },
  {
    title: "Snooker Championship 2025",
    datetime: "06:00 PM | Monday, 7 March, 2025",
    price: 1200,
    image: TGm2,
    isLive: false
  }
  // Add more tournaments as needed
];

const bookingsData = [
  {
    id: 1,
    name: "Rahul Vishvakarma",
    game: "Snooker & Pool",
    datetime: "04:00 PM | Sunday, 6 March, 2025",
    quantity: 2,
    image: TGm1
  },
  {
    id: 2,
    name: "Rohan Shetty",
    game: "Paddle Tennis",
    datetime: "04:00 PM | Sunday, 6 March, 2025",
    quantity: 1,
    image: gm1
  },
  {
    id: 3,
    name: "Shreya Mahajan",
    game: "Paddle Tennis",
    datetime: "04:00 PM | Sunday, 6 March, 2025",
    quantity: 1,
    image: gm2
  },
  {
    id: 4,
    name: "Rohan Shetty",
    game: "Paddle Tennis",
    datetime: "04:00 PM | Sunday, 6 March, 2025",
    quantity: 1,
    image: gm3
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { games } = useSelector((state) => state.games);
  const cafeId = JSON.parse(sessionStorage.getItem('user'))?._id;
  const summaryCardsRef = useRef(null);
  const gamesRef = useRef(null);
  const tournamentsRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (cafeId) {
      dispatch(getGames(cafeId));
    }
  }, [dispatch, cafeId]);

  // Animation effects
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set([containerRef.current, ".summary-card", ".game-card", ".tournament-card", ".booking-item"], { 
        opacity: 0,
        y: 20
      });

      // Main container fade in
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      // Summary cards animation
      gsap.to(".summary-card", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      });

      // Games cards animation
      gsap.to(".game-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gamesRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Tournament cards animation
      gsap.to(".tournament-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tournamentsRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Booking items animation
      gsap.to(".booking-item", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.4
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Container fluid className="p-2" ref={containerRef}>
      <h3 className="mb-4">Hello, Styx Cafe</h3>

      {/* Search Bar for Mobile */}
      <Row className="d-md-none mb-3">
        <Col>
          <input
            type="text"
            placeholder="Search Tournaments, Games, Score"
            className="form-control position-relative"
            style={{ paddingLeft: '40px' }}
          />
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mt-4 mb-4">
        {summaryData.map((item, index) => (
          <Col key={index} xs={6} md={3}>
            <div className="summary-card">
              <div className='desktop-view d-none d-md-flex align-items-center justify-content-around p-2 w-100'>
                <span className='d-flex align-items-center justify-content-center rounded-4'
                  style={{ width: '50px', height: '50px', background: item.bgColor }}>
                  <img src={item.icon} alt={item.title} />
                </span>
                <div>
                  <small className="text-muted">{item.title}</small>
                  <h2 className="mt-2">{item.value}</h2>
                </div>
              </div>

              <div className='mobile-view d-md-none d-flex flex-column p-2 w-100'>
                <small className="text-muted">{item.title}</small>
                <div className='d-flex align-items-center justify-content-between mt-2'>
                  <span className='d-flex align-items-center justify-content-center rounded-4'
                    style={{ width: '50px', height: '50px', background: item.bgColor }}>
                    <img src={item.icon} alt={item.title} />
                  </span>
                  <h2 className="mb-0">{item.value}</h2>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Mobile Bookings Card */}
      <div className="d-md-none mb-4">
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="border-bottom py-3">
              <div className="d-flex gap-3">
                <div style={{ width: '60px', height: '60px' }}>
                  <img
                    src={bookingsData[0].image}
                    alt={bookingsData[0].name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">{bookingsData[0].name}</h6>
                  <small className="text-muted d-block">{bookingsData[0].game}</small>
                  <small className="text-muted d-block">{bookingsData[0].datetime}</small>
                  <small className="text-muted d-block">Quantity: {bookingsData[0].quantity} Tickets</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <BsXCircle className="text-danger" style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                  <BsCheckCircle className="text-success" style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                </div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </div>

      <Row className="g-4">
        {/* Left Column */}
        <Col md={8}>
          {/* Listed Games */}
          <Card className="border-0" ref={gamesRef}>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <Card.Title style={{ fontSize: "1.2rem" }}>Listed Games</Card.Title>
                <Link to="/admin/games/recommended" className="text-primary" style={{ cursor: 'pointer', fontWeight: "bold" }}>View All</Link>
              </div>
              {games.length > 0 ? (
                <div className="horizontal-scroll">
                  <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
                    {games.slice(0, 3).map((game) => (
                      <Col key={game._id} xs={10} sm={6} md={6} lg={4} style={{ padding: '0 0.5rem' }}>
                        <Card className="border-0 h-100 game-card" style={{ 
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          willChange: 'transform'
                        }}>
                          <Card.Img
                            variant="top"
                            src={`${import.meta.env.VITE_API_URL}/${game.gameImage}`}
                            alt={game.name}
                            style={{
                              height: '150px',
                              objectFit: 'cover'
                            }}
                          />
                          <Card.Body>
                            <Card.Title className="h6">{game.name}</Card.Title>
                            <Card.Text>
                              <small className="text-success">
                                ● {game.type} ({game.size} players)
                              </small>
                            </Card.Text>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="text-primary px-2 py-1 rounded-pill" style={{ backgroundColor: '#FAFAFA', fontSize: '0.9rem' }}>₹{game.price}/Person</span>
                              <button
                                className="btn btn-primary rounded-circle"
                                style={{ width: '35px', height: '35px', padding: 0 }}
                                onClick={() => navigate(`/admin/games/${game._id}`)}
                              >
                                <MdOutlineArrowOutward />
                              </button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ) : (
                <div className="text-center py-4">
                  <img 
                    src={Nogame} 
                    alt="No games found" 
                    style={{ width: '100px', opacity: 0.7 }}
                  />
                  <h5 className="mt-3 text-muted">No Games Listed</h5>
                  <p className="text-muted">Add your first game to get started</p>
                  <button 
                    className="btn btn-primary mt-2"
                    onClick={() => navigate('/admin/games/create-new-game/')}
                  >
                    Add Game
                  </button>
                </div>
              )}
            </Card.Body>
          </Card>
          {/* Tournaments */}
          <Card className="border-0 mt-4" ref={tournamentsRef}>
            <Card.Body>
              <div className="d-flex mb-4 justify-content-between align-items-center">
                <Card.Title style={{ fontSize: "1.2rem", marginBottom: "0.8rem" }}>Tournaments</Card.Title>
                <span className="text-primary" style={{ cursor: 'pointer', fontWeight: "bold" }}>View All</span>
              </div>
              <div className="horizontal-scroll">
                <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
                  {tournaments.map((tournament) => (
                    <Col key={tournament.title} xs={10} sm={6} md={6} lg={6} style={{ padding: '0 0.5rem' }}>
                      <Card className="border-0 tournament-card" style={{ 
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        willChange: 'transform'
                      }}>
                        <div className="position-relative">
                          <Card.Img
                            variant="top"
                            src={tournament.image}
                            alt={tournament.title}
                            style={{
                              height: '200px',
                              objectFit: 'cover'
                            }}
                          />
                          {tournament.isLive && (
                            <Badge
                              bg="success"
                              className="position-absolute top-0 start-0 m-3"
                              style={{ fontSize: '0.7rem', padding: '0.25em 0.5em' }}
                            >
                              Live Tournament
                            </Badge>
                          )}
                        </div>
                        <Card.Body>
                          <Card.Title className="mb-2">{tournament.title}</Card.Title>
                          <small className="text-muted d-block mb-3">
                            <BsCalendar3 className='me-2' />
                            {tournament.datetime}
                          </small>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-primary px-3 py-2 rounded-pill" style={{ backgroundColor: '#FAFAFA' }}>
                              ₹ {tournament.price}/Person
                            </span>
                            <button
                              className="btn btn-primary rounded-circle"
                              style={{ width: '40px', height: '40px', padding: 0 }}
                            >
                              <MdOutlineArrowOutward />
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card.Body>
          </Card>

        </Col>

        {/* Right Column */}
        <Col md={4}>
          {/* Desktop Bookings Card */}
          <div className="d-none d-md-block">
            <Card className="border-0">
              <Card.Body>
                <Card.Title style={{ fontSize: "1.2rem", marginBottom: "0.8rem" }} className="mb-4">Bookings</Card.Title>
                <ListGroup variant="flush">
                  {bookingsData.map((booking) => (
                    <ListGroup.Item key={booking.id} className="border-bottom py-3 booking-item">
                      <div className="d-flex gap-3">
                        <div style={{ width: '60px', height: '60px' }}>
                          <img
                            src={booking.image}
                            alt={booking.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{booking.name}</h6>
                          <small className="text-muted d-block">{booking.game}</small>
                          <small className="text-muted d-block">{booking.datetime}</small>
                          <small className="text-muted d-block">Quantity: {booking.quantity} Tickets</small>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <BsXCircle className="text-danger" style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                          <BsCheckCircle className="text-success" style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
          {/* Other Tournaments */}
          <Card className="border-0">
            <Card.Body>
              <ListGroup variant="flush">
                {[/* Repeat for other tournaments */].map((tournament, idx) => (
                  <ListGroup.Item key={idx}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Snooker And Pool</h5>
                        <small>04:00 PM | Sunday, 6 March, 2025</small>
                      </div>
                      <Badge bg="light" className="text-dark">♥ 1200/Person</Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
      .horizontal-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding-bottom: 1rem;
}

.horizontal-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

@media (max-width: 991px) {
  .horizontal-scroll .row {
    flex-wrap: nowrap !important;
  }
  
  .card-title {
    font-size: 1rem !important;
  }
  
  .card-body {
    padding: 1rem;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .summary-card {
    padding: 0.5rem;
  }
  
  .mobile-view h2 {
    font-size: 1.25rem;
  }
}

.summary-card {
  gap: 2rem;
  border-radius: 8px;
  background-color: #fff;
}

@media (max-width: 768px) {
  .summary-card {
    margin-bottom: 1rem;
  }
  
  .mobile-view h2 {
    font-size: 1.5rem;
  }
}
      `}</style>
    </Container>
  );
};

export default AdminDashboard;
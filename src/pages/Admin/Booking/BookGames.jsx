import React, { useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getGames } from '../../../store/slices/gameSlice';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import GamePlaceholder from '../Games/components/GamePlaceholder';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs/Breadcrumbs';

const BookGames = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { games, status } = useSelector((state) => state.games);

  useEffect(() => {
    window.scrollTo(0, 0);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) {
      dispatch(getGames(user._id));
    }
  }, [dispatch]);

  // Animate game cards with GSAP
  useEffect(() => {
    if (status === 'succeeded' && games.length > 0) {
      const cards = document.querySelectorAll('.game-card');
      if (cards.length === 0) return;

      gsap.set(cards, {
        opacity: 0,
        y: 50
      });

      setTimeout(() => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: {
            amount: 0.3,
            from: "start"
          },
          ease: "power2.out",
          clearProps: "all"
        });
      }, 100);
    }
  }, [status, games]);

  const indoorGames = games.filter(game => game.zone === 'Indoor');
  const outdoorGames = games.filter(game => game.zone === 'Outdoor');

  return (
    <Container fluid>
      <style>
        {`
          .horizontal-scroll {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: 1rem;
          }

          .horizontal-scroll::-webkit-scrollbar {
            display: none;
          }

          @media (max-width: 768px) {
            .horizontal-scroll .row {
              flex-wrap: nowrap !important;
            }
          }

          @media (min-width: 769px) {
            .horizontal-scroll {
              overflow-x: visible;
            }
            .horizontal-scroll .row {
              flex-wrap: wrap !important;
              row-gap: 2rem;
            }
          }
        `}
      </style>

      <Breadcrumbs
        items={[
          { label: "Home", path: "/admin/dashboard" },
          { label: "Book Game", active: true }
        ]}
      />

      {/* Indoor Games Section */}
      <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
        <h5 className="text-dark fw-bold" style={{ fontSize: 'clamp(20px, 5vw, 25px)', margin: 0 }}>
          Indoor Games
        </h5>
      </div>

      <div data-aos="fade-right" data-aos-duration="600" className="horizontal-scroll mb-5">
        <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
          {indoorGames.length > 0 ? (
            indoorGames.map((game) => (
              <Col key={game._id} lg={2.4} xs={8} md={3} style={{ padding: '0 0.5rem' }}>
                <Card
                  className="shadow-sm game-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/games/${game._id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={`${import.meta.env.VITE_API_URL}/${game.gameImage}`}
                    alt={game.name}
                    style={{ height: '120px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{game.name}</Card.Title>
                    <Card.Text style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <small className="text-success">
                        ● {game.type} ({game.players} players) {game?.payLater && <span className="text-warning">Pay Later</span>}
                      </small>
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className="text-primary fw-bold px-3 py-2 rounded-pill"
                        style={{ backgroundColor: '#f2f2f2' }}
                      >
                        ₹{game.price}/Hour
                      </span>
                      <button
                        className="btn btn-primary rounded-circle"
                        style={{ width: '40px', height: '40px', padding: 0 }}
                        onClick={() => navigate(`/admin/games/${game._id}`)}
                      >
                        <MdOutlineArrowOutward />
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-3">
              <GamePlaceholder />
            </Col>
          )}
        </Row>
      </div>

      {/* Outdoor Games Section */}
      <h5 className="text-dark fw-bold" style={{ fontSize: 'clamp(20px, 5vw, 25px)', margin: 0 }}>
        Outdoor Games
      </h5>

      <div className="horizontal-scroll">
        <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
          {outdoorGames.length > 0 ? (
            outdoorGames.map((game) => (
              <Col key={game._id} lg={2.4} xs={8} md={3} style={{ padding: '0 0.5rem' }}>
                <Card
                  className="shadow-sm game-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/games/${game._id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={`${import.meta.env.VITE_API_URL}/${game.gameImage}`}
                    alt={game.name}
                    style={{ height: '120px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{game.name}</Card.Title>
                    <Card.Text>
                      <small className="text-success">
                        ● {game.type} ({game.size} players)
                      </small>
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className="text-primary fw-bold px-3 py-2 rounded-pill"
                        style={{ backgroundColor: '#f2f2f2' }}
                      >
                        ₹{game.price}/Person
                      </span>
                      <button
                        className="btn btn-primary rounded-circle"
                        style={{ width: '40px', height: '40px', padding: 0 }}
                        onClick={() => navigate(`/admin/games/${game._id}`)}
                      >
                        <MdOutlineArrowOutward />
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-3">
              <GamePlaceholder />
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default BookGames;

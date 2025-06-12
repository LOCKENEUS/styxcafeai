import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getGames } from '../../../store/slices/gameSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';
import Nogame from "/assets/Admin/Game/No Game.png";
import gsap from 'gsap';
import GamePlaceholder from './components/GamePlaceholder';

const RecommendedGames = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { games, status } = useSelector((state) => state.games);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) {
      dispatch(getGames(user._id));
    }
  }, [dispatch]);

  // Separate animation useEffect
  useEffect(() => {
    if (status === 'succeeded' && games.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from('.game-card', {
          y: 50,
          opacity: 0,
          duration: 0.3,
          stagger: {
            each: 0.1,
            from: "start"
          },
          ease: "power2.out"
        });
      });

      return () => ctx.revert(); // Cleanup
    }
  }, [status, games]);

  // Filter games by zone
  const indoorGames = games.filter(game => game.zone === 'Indoor');
  const outdoorGames = games.filter(game => game.zone === 'Outdoor');

  const handleCardClick = (gameId) => {
    navigate(`/admin/games/game-details/${gameId}`);
  };

  return (
    <Container fluid className="p-4">
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

      {/* Indoor Games Section */}
      <h5>
        <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>
          {"Recommended Games"}
        </span>

      </h5>
      <div
        className="d-flex justify-content-between align-items-center mt-4 mb-2"
        style={{ flexDirection: 'row', gap: '1rem' }}
      >
        <h5
          className="text-dark fw-bold"
          style={{ fontSize: 'clamp(20px, 5vw, 25px)', margin: 0 }}
        >
          Indoor Games
        </h5>
        <Link to="/admin/games/create-new-game">
          <IoAdd
            style={{
              fontSize: 'clamp(30px, 8vw, 40px)',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'blue',
              border: '2px solid blue',
              borderRadius: '50%',
              padding: '0.2rem',
            }}
          />
        </Link>
      </div>
      <div className="horizontal-scroll mb-5">
        <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
          {indoorGames.length > 0 ? (
            indoorGames.map((game, index) => (
              <Col key={game._id} lg={2.4} xs={8} md={3} style={{ padding: '0 0.5rem' }}>
                <Card
                  className="shadow-sm game-card"
                  style={{
                    cursor: 'pointer',
                    opacity: 1, // Ensure initial visibility
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={`${import.meta.env.VITE_API_URL}/${game.gameImage}`}
                    alt={game.name}
                    style={{
                      height: '120px',
                      objectFit: 'cover'
                    }}
                    onClick={() => handleCardClick(game._id)}
                  />
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >{game.name}</Card.Title>
                    <Card.Text style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <small className="text-success">
                        ● {game.type} ({game.players} players) {game?.payLater && <span className="text-warning">Pay Later</span>}
                      </small>
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-primary fw-bold px-3 py-2 rounded-pill" style={{ backgroundColor: '#F2F2F2' }}>₹{game.price}/Person</span>
                      <button
                        className="btn btn-primary rounded-circle"
                        style={{ width: '40px', height: '40px', padding: 0 }}
                        onClick={() => {
                          setIsLoading(true);
                          navigate(`/admin/games/${game._id}`);
                          setIsLoading(false);
                        }}
                      >
                        {isLoading ? <Spinner animation="border" size="sm" /> : <MdOutlineArrowOutward />}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <GamePlaceholder />
            </Col>
          )}
        </Row>
      </div>

      {/* Outdoor Games Section */}
      <h5
        className="text-dark fw-bold"
        style={{ fontSize: 'clamp(20px, 5vw, 25px)', margin: 0 }}
      >
        Outdoor Games
      </h5>
      <div className="horizontal-scroll">
        <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
          {outdoorGames.length > 0 ? (
            outdoorGames.map((game, index) => (
              <Col key={game._id} lg={2.4} xs={8} md={3} style={{ padding: '0 0.5rem' }}>
                <Card
                  className="shadow-sm game-card"
                  style={{
                    opacity: 1, // Ensure initial visibility
                    transform: 'none' // Reset any transforms
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={`${import.meta.env.VITE_API_URL}/${game.gameImage}`}
                    alt={game.name}
                    style={{
                      height: '120px',
                      objectFit: 'cover'
                    }}
                    onClick={() => handleCardClick(game._id)}
                  />
                  <Card.Body>
                    <Card.Title>{game.name}</Card.Title>
                    <Card.Text style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <small className="text-success">
                        ● {game.type} ({game.players} players) {game?.payLater && <span className="text-warning">Pay Later</span>}
                      </small>
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-primary fw-bold px-3 py-2 rounded-pill" style={{ backgroundColor: '#FAFAFA' }}>₹{game.price}/Person </span>
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
            <Col className="text-center py-2">
              <GamePlaceholder />
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default RecommendedGames;

import React, { useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getGames } from '../../../store/slices/gameSlice';
import { useNavigate } from 'react-router-dom';
const RecommendedGames = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { games, status } = useSelector((state) => state.games);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user?._id) {
      dispatch(getGames(user._id));
    }
  }, [dispatch]);

  // Filter games by zone
  const indoorGames = games.filter(game => game.zone === 'Indoor');
  const outdoorGames = games.filter(game => game.zone === 'Outdoor');

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
      <h4 className="mb-4">Indoor Games</h4>
      <div className="horizontal-scroll mb-5">
        <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
          {indoorGames.map((game, index) => (
            <Col key={game._id} lg={2.4} xs={8} md={3} style={{ padding: '0 0.5rem' }}>
              <Card className="shadow-sm">
                <Card.Img
                  variant="top"
                  src={`${import.meta.env.VITE_API_URL}/${game.gameImage}`}
                  alt={game.name}
                  style={{
                    height: '120px',
                    objectFit: 'cover'
                  }}
                />
                <Card.Body>
                  <Card.Title>{game.name}</Card.Title>
                  <Card.Text>
                    <small className="text-success">
                      ● {game.type} ({game.size} players)
                    </small>
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-primary fw-bold px-3 py-2 rounded-pill" style={{ backgroundColor: '#FAFAF4' }}>₹{game.price}/Person</span>
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
          ))}
        </Row>
      </div>

      {/* Outdoor Games Section */}
      <h4 className="mb-4">Outdoor Games</h4>
      <div className="horizontal-scroll">
        <Row className="flex-nowrap" style={{ margin: '0 -0.5rem' }}>
          {outdoorGames.map((game, index) => (
            <Col key={game._id} lg={2.4} xs={8} md={3} style={{ padding: '0 0.5rem' }}>
              <Card className="shadow-sm">
                <Card.Img
                  variant="top"
                  src={`${import.meta.env.VITE_API_URL}/${game.gameImage}`}
                  alt={game.name}
                  style={{
                    height: '120px',
                    objectFit: 'cover'
                  }}
                />
                <Card.Body>
                  <Card.Title>{game.name}</Card.Title>
                  <Card.Text>
                    <small className="text-success">
                      ● {game.type} ({game.size} players)
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
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default RecommendedGames;

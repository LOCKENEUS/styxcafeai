import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import SnokerTable from "/assets/Admin/Table/SnokerTable.svg";
import { MdOutlineArrowOutward } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getGames } from "../../../store/slices/gameSlice";
import { useNavigate } from "react-router-dom";

const tables = [
  { wing: "A", size: "(6/12) Feet", slots: 30 },
  { wing: "A", size: "(6/12) Feet", slots: 0 },
  { wing: "A", size: "(6/12) Feet", slots: 30 },
  { wing: "B", size: "(6/12) Feet", slots: 30 },
  { wing: "B", size: "(6/12) Feet", slots: 0 },
  { wing: "B", size: "(6/12) Feet", slots: 30 },
];

const SnookerTableList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { games, status } = useSelector((state) => state.games);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) {
      dispatch(getGames(user._id));
    }
  }, [dispatch]);

  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Snooker Table List</Breadcrumb.Item>
      </Breadcrumb>

      {['A', 'B'].map((wing) => (
        <div key={wing} className="mb-5">
          <h2 className="fw-bold mb-4">
            Wing {wing}
            <div className="border-bottom border-primary w-25 mt-2" style={{ height: '4px' }}></div>
          </h2>
          <Row className="g-4">
            {games?.length > 0 && games
              .map((game, index) => (
                <Col key={game?._id} xs={12} md={6} lg={4}>
                  <Card className="h-100 shadow-sm hover-shadow transition-all">
                    <Card.Body className="d-flex flex-column">
                      <div className="text-center mb-3">
                        <img
                          src={SnokerTable}
                          alt="Snooker Table"
                          className="img-fluid mb-3"
                          style={{ maxWidth: '200px' }}
                        />
                        {/* <h5 className="fw-semibold mb-2">Table {index + 1}</h5> */}
                        <h5 className="fw-semibold mb-2">{game?.name}</h5>
                      </div>

                      <div className="position-relative">
                        <div className="text-center">
                          <p className="text-muted mb-2">{game.size}</p>
                          <div className={`badge ${game?.availableSlots > 0 ? 'bg-success' : 'bg-danger'} p-2 mb-3`}>
                            {game?.availableSlots > 0
                              ? `${game?.availableSlots} Slots Available`
                              : "No Available Slots"}
                          </div>
                        </div>
                        <Button
                          variant={game?.availableSlots > 0 ? "primary" : "secondary"}
                          className="rounded-circle position-absolute d-flex align-items-center justify-content-center"
                          disabled={game?.availableSlots === 0}
                          style={{
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '40px',
                            height: '40px',
                            padding: '0'
                          }}
                          onClick={() => navigate(`/admin/games/${game?._id}`)}
                        >
                          <MdOutlineArrowOutward />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default SnookerTableList;
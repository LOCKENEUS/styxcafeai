import React, { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, Card, CardGroup, Col, Container, Image, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getGames,
  setSelectedGame,
  addGame,
  updateGame,
  deleteGame,
  getGameById,
} from "../../../../store/slices/gameSlice";
import GameDetails from "./GameDetails";
import GameForm from "./GameForm";
import { Link, useLocation, useParams } from "react-router-dom";
import Add from "/assets/superAdmin/cafe/formkit_addWhite.png";

const CafeGames = () => {

  const location = useLocation();
    const { cafeId } = location.state || {}; 

  console.log("your cafe id game ",cafeId);
  const baseURL = import.meta.env.VITE_API_URL;

  console.log("your cafe id game ",cafeId);


  const dispatch = useDispatch();
  const { games, selectedGame } = useSelector((state) => state.games);
  const [showCanvas, setShowCanvas] = useState(false);
  const [formData, setFormData] = useState(null);
  // const [idCafe, setIdCafe] = useState(cafeId);

  // useEffect(() => {
  //   const fetchGames = async () => {
  //     try {
  //       await dispatch(getGames(cafeId));
  //     } catch (error) {
  //       console.error("Error fetching games:", error);
  //     }
  //   };

  //   fetchGames();
  // }, [dispatch]);
  useEffect(() => {
    if (cafeId) {
      dispatch(getGames(cafeId));
    }
  }, [cafeId, dispatch]);
  const gamesDetails = useSelector(state => state.games);
  console.log("Fetched games:", gamesDetails);

  const handleEdit = async () => {
    setShowCanvas(true);
    await dispatch(getGameById(selectedGame.data._id));
    setFormData(selectedGame.data);
  };

  const handleGameAction = async (actionType, gameData) => {
    try {
      if (actionType === "add") {
        await dispatch(addGame(gameData));
      } else if (actionType === "update") {
        await dispatch(updateGame(gameData));
        dispatch(setSelectedGame(null));
      } else if (actionType === "delete") {
        await dispatch(deleteGame(gameData._id));
      }
      await dispatch(getGames(cafeId));
    } catch (error) {
      console.error("Error handling game action:", error);
    }
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    dispatch(setSelectedGame(null));
    dispatch(getGames(cafeId));
  };
  
  return (
    <Container fluid>
      <Row className="my-5">
        <Card.Header className="fw-bold">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Breadcrumb>
              <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>Home</Breadcrumb.Item>
              <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>
                {/* <Link to="/superadmin/cafe/viewdetails/" > Games Details</Link> */}
                <Link to={`/superadmin/cafe/viewdetails/${cafeId}`}>Games Details</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > All Games </Breadcrumb.Item>
            </Breadcrumb>

            {!selectedGame && (
              <Button variant="primary" className="rounded-3" onClick={() => {
                dispatch(setSelectedGame(null));
                setFormData(null);
                setShowCanvas(true);
              }}>
                <Image src={Add} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                Create  Game
              </Button>
            )}
          </div>
        </Card.Header>

        {!selectedGame ? (
          <Col sm={12} className="my-3">
            <Row className="g-3"> {/* Use Row for grid layout */}
              {gamesDetails?.games.length > 0 ? (
                gamesDetails?.games.map((game, index) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={index}> {/* 4 cards per row on large screens */}
                    <Card
                      className="game-card mx-2 rounded-4 shadow-sm shadow-lg p-2 flex-grow-1 h-100"
                      onClick={() => dispatch(getGameById(game._id))}
                      style={{ cursor: "pointer"}}

                    >
                      {/* Image with Correct Fallback */}
                      <div className="d-flex justify-content-center mt-2">
                        <Card.Img
                          src={`${baseURL}/${game.gameImage || Rectangle389}`}
                          onError={(e) => (e.target.src = Rectangle389)}
                          className="img-fluid rounded-4"
                          style={{
                            width: "90%",
                            // maxHeight: "20rem",
                            height: "10rem",
                            objectFit: "cover",

                          }}
                          alt={game.name || "Game Image"}
                        />
                      </div>

                      <Card.Body >
                        <Card.Title className=" " style={{ fontSize: "18.07px", fontWeight: "600" }}>{game.name || "Game Title"}</Card.Title>
                        <Card.Text>
                          <Row className="gap-2 mt-3">
                            {/* Buttons Section */}
                            <Col xs={12} className="d-flex gap-2 justify-content-start mb-2">
                              <Button className="border-0 rounded-3" size="sm" style={{ backgroundColor: "#2C99FF" }}>
                                Single
                              </Button>
                              <Button className="border-0 rounded-3" size="sm" style={{ backgroundColor: "#00C110" }}>
                                {game.cancellation === "Yes" ? "Non-refundable" : "Refundable"}
                              </Button>
                            </Col>

                            {/* Price */}
                            <Col xs={4}>
                              <h6 className="text-primary fw-semibold" style={{ fontSize: "16px", fontWeight: "500" }}>Price:</h6>
                            </Col>
                            <Col xs={6}>
                              <h6 className="fw-medium" style={{ fontSize: "15.81px", fontWeight: "500" }}>₹ {game.price || 1000}</h6>
                            </Col>

                            {/* Zone */}
                            <Col xs={4}>
                              <h6 className="text-primary fw-semibold" style={{ fontSize: "16px", fontWeight: "500" }}>Zone:</h6>
                            </Col>
                            <Col xs={6}>
                              <h6 className="fw-medium" style={{ fontSize: "15.81px", fontWeight: "500" }}>{game.zone || "A"}</h6>
                            </Col>

                            {/* Size */}
                            <Col xs={4}>
                              <h6 className="text-primary fw-semibold" style={{ fontSize: "16px", fontWeight: "500" }}>Size:</h6>
                            </Col>
                            <Col xs={6}>
                              <h6 className="fw-medium" style={{ fontSize: "15.81px", fontWeight: "500" }} >{game.players || 2}</h6>
                            </Col>
                          </Row>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <div className="col-12 text-center fw-bold py-3">
                  No Data Available
                </div>
              )}
            </Row>
          </Col>
        ) : (
          <GameDetails
            game={selectedGame.data}
            gameId={selectedGame.data?._id}
            onClose={() => dispatch(setSelectedGame(null))}
            onEdit={() => handleEdit()}
            cafeId={cafeId}
          />
        )}
        <GameForm
          showCanvas={showCanvas}
          handleCloseCanvas={handleCloseCanvas}
          isEditing={!!selectedGame}
          cafeId={cafeId}
          game={selectedGame}
          onGameAction={handleGameAction}
        />
      </Row>
    </Container>
  );
};

export default CafeGames;

import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Image, Table } from "react-bootstrap";
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

const CafeGames = ({ cafeId }) => {
  const baseURL = import.meta.env.VITE_API_URL;

  console.log(cafeId);
  const dispatch = useDispatch();
  const { games, selectedGame } = useSelector((state) => state.games);
  const [showCanvas, setShowCanvas] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        await dispatch(getGames(cafeId));
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [dispatch]);
  console.log("Fetched games:", games);

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
    <div className="">
      <Card.Header className="fw-bold">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Game Details</h1>
          {!selectedGame && (
            <Button variant="primary" onClick={() => {
              dispatch(setSelectedGame(null));
              setFormData(null);
              setShowCanvas(true);
            }}>
              Create New Game
            </Button>
          )}
        </div>
      </Card.Header>

      {!selectedGame ? (
        <div className="container mt-4">
          <div className="row g-4 justify-content-start">
            {games.length > 0 ? (
              games.map((game, index) => (
                <div
                  key={index}
                  className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-start"
                >
                  <Card
                    className="game-card shadow-sm shadow-lg border-1 flex-grow-1"
                    onClick={() => dispatch(getGameById(game._id))}
                    style={{ cursor: "pointer", maxWidth: "25rem" }}
                  >
                    <div className="d-flex justify-content-center mt-2">
                      <Image
                        src={`${baseURL}/${game.gameImage}`}
                        className="card-img-top"
                        style={{
                          width: "90%",
                          maxHeight: "20rem",
                          height: "auto",
                          objectFit: "cover",
                        }}
                        alt={game.name}
                      />
                    </div>

                    <Card.Body className="text-center d-flex justify-content-center align-content-center flex-column">
                      <Card.Title
                        style={{ fontSize: "1.4rem" }}
                        className="text-primary fw-bold"
                      >
                        {game.name}
                      </Card.Title>
                      <Card.Subtitle className="mb-1 text-muted">
                        <Badge bg="info" className="me-1">
                          {game.type}
                        </Badge>
                        <Badge
                          bg={
                            game.cancellation === "Yes" ? "danger" : "success"
                          }
                        >
                          {game.cancellation === "Yes"
                            ? "Non-refundable"
                            : "Refundable"}
                        </Badge>
                      </Card.Subtitle>
                      <Card.Text className="text-muted">
                        <div style={{ fontSize: "1rem" }}>
                          {" "}
                          <strong className="text-success">Price:</strong> $
                          {game.price}
                        </div>
                        <div style={{ fontSize: "1rem" }}>
                          {" "}
                          <strong className="text-black">Zone:</strong>{" "}
                          {game.zone}{" "}
                        </div>
                        <div style={{ fontSize: "1rem" }}>
                          {" "}
                          <strong className="text-black">Size:</strong>{" "}
                          {game.players}{" "}
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-12 text-center fw-bold py-3">
                No Data Available
              </div>
            )}
          </div>

          {/* Custom CSS for better design */}
          <style jsx>{`
            .game-card {
              transition: transform 0.3s ease-in-out,
                box-shadow 0.3s ease-in-out;
            }
            .game-card:hover {
              transform: scale(1.05);
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            .card-img-container {
              display: flex;
              justify-content: center;
              padding: 15px;
            }
            .card-img-top {
              width: 100px;
              height: 100px;
              border-radius: 10px;
              object-fit: cover;
            }
          `}</style>
        </div>
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
    </div>
  );
};

export default CafeGames;

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { getGames, setSelectedGame } from '../../../store/slices/gameSlice';
import GameDetails from "./GameDetails";
import GameForm from "./GameForm";

const CreateGames = () => {
  const dispatch = useDispatch();
  const { games, selectedGame } = useSelector((state) => state.games);
  const [showCanvas, setShowCanvas] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        await dispatch(getGames());
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [dispatch]);

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Game Details</h1>
        {!selectedGame && (
          <Button variant="primary" onClick={() => setShowCanvas(true)}>
            Create New Game
          </Button>
        )}
      </div>

      {!selectedGame ? (
     <div className="row">
     {games.length > 0 ? (
       games.map((game, index) => (
         <div key={index} className="col-md-4 mb-4">
           <Card 
             className="shadow-sm" 
             onClick={() => dispatch(setSelectedGame({ data: game, index }))}
             style={{ cursor: "pointer" }}
           >
             <Card.Body>
               <Card.Title>{game.name}</Card.Title>
               <Card.Subtitle className="mb-2 text-muted">{game.type}</Card.Subtitle>
               <Card.Text>
                 <strong>Prize:</strong> {game.prize} <br />
                 <strong>Zone:</strong> {game.zone} <br />
                 <strong>Size:</strong> {game.size} <br />
                 <strong>Cancellation:</strong> {game.cancellation}
               </Card.Text>
               <Button variant="primary">View Details</Button>
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
      ) : (
        <GameDetails
          game={selectedGame}
          onClose={() => dispatch(setSelectedGame(null))}
          onEdit={() => {
            setFormData(selectedGame);
            setShowCanvas(true);
          }}
        />
      )}

      <GameForm
        showCanvas={showCanvas}
        handleCloseCanvas={() => setShowCanvas(false)}
        isEditing={!!selectedGame}
      />
    </div>
  );
};

export default CreateGames;
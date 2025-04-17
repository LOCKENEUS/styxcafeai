import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";

// import { BiSplit } from 'react-icons/bi';
import { BsCurrencyRupee, BsFillPlusSquareFill, BsSquareHalf } from 'react-icons/bs';
import { LuBadgeCheck, LuSplit } from "react-icons/lu";
import { LiaCoinsSolid } from "react-icons/lia";

const CreditSplit = ({ show, handleClose, handleCollectOffline, handleOnlinePayment, totalAmount, players, customer }) => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(totalAmount);

  useEffect(() => {
    setAllPlayers([customer, ...players]);
  }, [])

  const handleShareChange = (index, value) => {
    const updatedPlayers = [...allPlayers];
    const parsed = parseFloat(value) || 0;

    updatedPlayers[index].share = parsed;
    setAllPlayers(updatedPlayers);

    // const newTotal = updatedPlayers.reduce((sum, p) => sum + (p.share || 0), 0);
    // setCurrentTotal(newTotal);
  };

  const handleSplitAmount = () => {
    console.log("reached-here")
    // Calculate the split amount based on the selected split type
    const totalPlayers = allPlayers.length;
    const splitAmount = totalAmount / totalPlayers;

    // Update the split amount for each player
    const updatedPlayers = allPlayers.map((player) => ({
      ...player,
      share: Math.round(splitAmount),
      credit: 0,
      creditAssigned: false
    }))
    setAllPlayers(updatedPlayers);
  };

  const handleAssignCredit = (index) => {
    const updatedPlayers = [...allPlayers];
    const player = updatedPlayers[index];
    const shareAmount = parseFloat(player.share) || 0;

    const availableCredit = player.creditLimit - player.creditAmount;

    if (shareAmount > availableCredit) {
      alert(`Insufficient credit for ${player.name}. Available: ₹${availableCredit}`);
      return;
    }

    player.credit = shareAmount;
    player.creditAssigned = true;

    setCurrentTotal((prevTotal) => prevTotal - shareAmount);
    setAllPlayers(updatedPlayers);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <div className="modal-content rounded-2">
        <Modal.Header style={{ backgroundColor: "", padding: "20px" }} className="d-flex align-items-center">
          <Modal.Title>
            <Button variant="primary" className="fw-bold" onClick={handleSplitAmount}>
              <LuSplit size={16} className="" /> Split Expenses
            </Button>

            <Button
              variant="primary"
              className="mx-3"
              onClick={handleSplitAmount}
            >
              <BsSquareHalf /> 50-50
            </Button>
            <span style={{ background: "#FF00000D", color: "#FF0000", padding: "12px" }} className="rounded-2"> <BsCurrencyRupee /> <span className="fw-bold ms-1">{currentTotal}</span></span>

          </Modal.Title>
          <Button variant="close" onClick={handleClose} className="ms-auto"></Button>
        </Modal.Header>
        <Modal.Body className="p-3 text-dark fs-4">
          <Container className="bg-white rounded-4 shadow" style={{ maxWidth: '600px' }}>
            {allPlayers?.map((player, index) => (
              <Row key={index} className="align-items-center my-5">
                <Col xs={4}>
                  <div className="text-color">{player.name}</div>
                  {player.credit ? (
                    <div className="text-success mt-1" style={{ fontSize: "12px" }}>
                      Assigned: ₹{player.credit}
                    </div>
                  ) : null}
                </Col>
                <Col xs={2} className="text-center">
                  <input
                    type="number"
                    className="form-control text-center"
                    placeholder="Share"
                    value={player.share}
                    onChange={(e) => handleShareChange(index, e.target.value)}
                    style={{
                      borderWidth: "2px",
                      borderStyle: "dashed",
                      borderColor: "#ccc",
                      outline: "none"
                    }}
                  />

                </Col>
                <Col xs={4}>
                  <span
                    style={{ background: "#03D41414", color: "#00AF0F", width: "80%", textAlign: "center" }}
                    className="float-end rounded-pill px-2 py-1 "
                  >
                    <LiaCoinsSolid size={25} /> {player.creditLimit - player.creditAmount}/{player.creditLimit}
                  </span>
                </Col>
                <Col xs={2} className="text-end">
                  {!player.creditAssigned ? <Button variant="light" className="rounded-circle p-1 border" onClick={() => handleAssignCredit(index)}
                  >
                    <BsFillPlusSquareFill className="rounded-1" size={20} />
                  </Button> : <Button variant="light" className="rounded-circle p-1 border" onClick={() => handleAssignCredit(index)}
                  >
                    <LuBadgeCheck className="rounded-1" size={20} />
                  </Button>}
                </Col>
              </Row>
            ))}

            <Button size="sm" className="w-25" onClick={() => handleOnlinePayment(allPlayers, currentTotal)}>Online</Button>
            <Button size="sm" className="mx-4 w-25" onClick={() => handleCollectOffline(allPlayers, currentTotal)}>Offline</Button>
          </Container>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default CreditSplit;



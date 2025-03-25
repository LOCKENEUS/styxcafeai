import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Table, Badge, Stack, Overlay, Popover, Form, InputGroup } from "react-bootstrap";
import { FaPhone, FaVideo, FaComment, FaClock, FaRegClock, FaPause, FaTrophy, FaThumbsDown } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import userProfile from "/assets/profile/user_avatar.jpg";
import { BsArrowUpRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12Hour, formatDate } from "../../../components/utils/utils";
import { startTimer, stopTimer, updateTimer } from "../../../store/AdminSlice/TimerSlice";
import { getBookingDetails, processOnlinePayment } from "../../../store/AdminSlice/BookingSlice";
import { VscDebugContinue } from "react-icons/vsc";

const BookingCheckout = () => {

  const { id } = useParams();
  const dispatch = useDispatch();

  const booking = useSelector((state) => state.bookings.booking);
  const { isRunning, startTime, elapsedTime } = useSelector((state) => state.timer);
  const [currentTime, setCurrentTime] = useState(elapsedTime || 0);

  const backend_url = import.meta.env.VITE_API_URL;

  const maxVisiblePlayers = 3;
  const [priceToPay, setPriceToPay] = useState(0);
  const [startingTime, setStartingTime] = useState(null);
  const [playerCredits, setPlayerCredits] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [adjustment, setAdjustment] = useState("");
  const [payableAmount, setPayableAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [showPlayerOverlay, setShowPlayerOverlay] = useState(false);
  const [runningStatus, setRunningStatus] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [looserPlayer, setLooserPlayer] = useState(null);
  const [slot, setSlot] = useState(null);
  const [players, setPlayers] = useState([]);
  const [paused, setPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getBookingDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (booking) {
      setSelectedGame(booking?.game_id);
      setSelectedCustomer(booking?.customer_id);
      setSlot(booking?.slot_id);
      setPlayers(booking?.players);
    }
  }, [booking])

  useEffect(() => {
    if (creditAmount > 0 && players.length > 0) {
      const totalPlayers = players.length + 1; // Including the customer
      const splitAmount = Math.floor(creditAmount / totalPlayers); // Rounded value

      const updatedCredits = players.map((player) => ({
        id: player._id,
        credit: splitAmount, // Initial distribution
      }));

      // Also include the customer
      updatedCredits.push({
        id: selectedCustomer._id,
        credit: splitAmount,
      });

      setPlayerCredits(updatedCredits);
    }
  }, [creditAmount, players, selectedCustomer]);

  useEffect(() => {
    const adjustedAmount = Math.round(parseFloat(priceToPay) + parseFloat(adjustment || 0));
    setPayableAmount(adjustedAmount);
  }, [priceToPay, adjustment]);

  const handleAdjustmentChange = (e) => {
    const value = Math.round(parseFloat(e.target.value) || 0);
    setAdjustment(value);
  };

  const handlePayableAmountChange = (e) => {
    const newPayableAmount = Math.round(parseFloat(e.target.value) || 0);
    const difference = Math.round(priceToPay - newPayableAmount + adjustment);
    setPayableAmount(newPayableAmount);
    setCreditAmount(difference);
  };

  const handleCreditChange = (id, newCredit) => {
    setPlayerCredits((prevCredits) =>
      prevCredits.map((player) =>
        player.id === id ? { ...player, credit: Math.round(newCredit) } : player
      )
    );
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (startTime) {
          const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          setCurrentTime(elapsedTime);
          dispatch(updateTimer(elapsedTime));

          // Calculate the price in real-time
          const pricePerHour = 100; // Example price
          const pricePerMinute = pricePerHour / 60;
          const totalPrice = Math.round((elapsedTime / 60) * pricePerMinute);
          setPriceToPay(totalPrice.toFixed(2));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, startTime, dispatch]);

  const handleStartTimer = () => {
    if (!isRunning) {
      const now = Date.now();
      localStorage.setItem("gameTimerStart", now);
      setStartingTime(now);
      dispatch(startTimer(now));
      setPaused(false);
      setPausedTime(0);
      setRunningStatus(true)
    }
  };

  const handlePauseTimer = () => {
    if (isRunning) {
      setPaused(true);
      setPausedTime(currentTime);
      dispatch(stopTimer());

      // Calculate the price when paused
      const pricePerHour = 100; // Example price
      const pricePerMinute = pricePerHour / 60;
      const totalPrice = Math.round((currentTime / 60) * pricePerMinute);
      setPriceToPay(totalPrice.toFixed(2));
    }
  };

  const handleContinueTimer = () => {
    if (paused) {
      const now = Date.now();
      const resumeStartTime = now - pausedTime * 1000;
      localStorage.setItem("gameTimerStart", resumeStartTime);
      dispatch(startTimer(resumeStartTime));
      setPaused(false);
    }
  };

  const handleStopTimer = () => {
    localStorage.removeItem("gameTimerStart");
    dispatch(stopTimer());
    const endTime = Date.now();
    const pricePerHour = 100; // Example price
    const pricePerMinute = pricePerHour / 60;
    const totalPrice = Math.round((currentTime / 60) * pricePerMinute);
    setPriceToPay(totalPrice.toFixed(2));
    setEndTime(endTime);
    setRunningStatus(false);
  };

  const handleOnlinePayment = async () => {
    const response = await dispatch(
      processOnlinePayment({
        selectedGame,
        selectedCustomer,
        slot,
        payableAmount,
        bookingId: booking?._id,
      })
    );
  };

  const handleSelectLooserPlayer = (player) => {
    setLooserPlayer(player);
    setShowPlayerOverlay(false);
  }

  console.log("booking", booking)

  return (
    <Container className="mt-4">
      <Row>
        <h5>
          <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>
            {"Bookings/Checkout"}
          </span>
        </h5>
      </Row>

      <Row>
        <Col md={4} className="border-0">
          <Card className="p-3">
            <Card.Img
              variant="top"
              src={`${backend_url}/${selectedGame?.gameImage}`}
              className="rounded"
            />
            <Row className="align-items-center mt-3">
              <Col xs={3}>
                <Image
                  src={userProfile}
                  roundedCircle
                  fluid
                />
              </Col>
              <Col className="p-0">
                <h5 className="mb-0">{selectedCustomer?.name}</h5>
                <small className="text-muted">Booking ID : {booking?.booking_id}</small>
              </Col>
            </Row>
            <hr />
            <div>
              <p className="d-flex justify-content-between">
                <strong className="text-dark">Full Name:</strong> <span>{selectedCustomer?.name}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-dark">Email Id:</strong> <span>{selectedCustomer?.email}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-dark">Phone Number:</strong> <span>{selectedCustomer?.contact_no}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-dark">Payment Status:</strong>
                <span className="text-success">{booking?.status}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-dark">Credit:</strong> <span>₹ {selectedCustomer?.creditLimit - selectedCustomer?.creditAmount} Balance</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-dark">Location:</strong> <span>{selectedCustomer?.address || "-"}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-dark">Played Games:</strong> <span>14</span>
              </p>
            </div>

            <hr />
            <Row className="text-center">
              <Col>
                <FaPhone size={20} />
              </Col>
              <Col>
                <FaComment size={20} />
              </Col>
              <Col>
                <FaVideo size={20} />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={8} className="d-flex flex-column gap-1 justify-content-between">
          <Card className="p-3">
            <h5 className="mb-3 font-inter fs-3">Booking Details</h5>
            <Row className="mb-1">
              <Col xs={6}>
                <p className="text-muted">Selected Game</p>
              </Col>
              <Col xs={6}>
                <p className="text-muted"><span className="fw-bold text-dark">{selectedGame?.name}({selectedGame?.size})</span></p>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col xs={6}>
                <p className="text-muted">No. of Candidates</p>
              </Col>
              <Col xs={6}>
                <p className="text-muted"><span className="fw-bold text-dark">2</span></p>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col xs={6}>
                <p className="text-muted">Slot Details</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">{selectedGame?.name} {slot?.name}</span>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col xs={6}>
                <p className="text-muted">Time Slot</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">{slot?.start_time && convertTo12Hour(slot?.start_time)} - {slot?.end_time && convertTo12Hour(slot.end_time)}</span>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col xs={6}>
                <p className="text-muted">Day/Date</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">{formatDate(booking?.slot_date)}</span>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col xs={6}>
                <p className="text-muted">Booking ID</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">{booking?.booking_id}</span>
              </Col>
            </Row>
          </Card>

          {selectedGame?.payLater && <div className="p-2 bg-white rounded shadow-sm w-100">
            <Row>
              <Col md={12} >
                <Button variant="outline-success " className="d-flex align-items-center gap-2" style={{ border: "none" }}
                  onClick={handleStopTimer}>
                  <FaRegClock size={30} />
                  <span className="fw-bold fs-1">{Math.floor(currentTime / 60)} m</span>:
                  <span className="text-secondary fs-1">{currentTime % 60} s</span>
                </Button>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={4}>
                {paused ? (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    style={{ border: "2px dashed rgb(255, 68, 0)", width: "80%" }}
                    onClick={handleStopTimer}
                  >
                    Stop Timer
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    style={{ border: "2px dashed", width: "80%" }}
                    onClick={handleStartTimer}
                  >
                    <FaClock size={16} className="mx-2" />
                    <span>Start Game Time</span>
                  </Button>
                )}
              </Col>

              <Col md={1} className="p-0">
                {paused ? (
                  (runningStatus &&
                    <VscDebugContinue
                      size={25}
                      className="text-success mt-2"
                      style={{ marginLeft: "5%", cursor: "pointer" }}
                      onClick={handleContinueTimer}
                    />)
                ) : (runningStatus &&
                  <FaPause
                    size={25}
                    className="text-danger mt-2"
                    style={{ marginLeft: "5%", cursor: "pointer" }}
                    onClick={handlePauseTimer}
                  />
                )}
              </Col>

              <Col md={3} className="p-0">
                <div className="ms-3">
                  <p className="mb-0 text-muted">
                    <strong>Start Time:</strong> {new Date(startingTime).toLocaleTimeString()}
                  </p>
                  <p className="mb-0 text-muted">
                    <strong>End Time:</strong> {endTime ? new Date(endTime).toLocaleTimeString() : "-"}
                  </p>
                </div>
              </Col>

              <Col md={2} className="p-0">
                <h3 className="fw-bold mx-6"> ₹ {priceToPay}</h3>
              </Col>

              <Col md={2}>
                {looserPlayer ? (
                  <div style={{ width: "100%" }}>
                    <span className="fw-bold">Looser : </span>
                    {looserPlayer.name}
                  </div>
                ) : (
                  <Stack direction="horizontal" gap={2} className="align-items-center">
                    <div className="d-flex">
                      <Image src={userProfile} roundedCircle width={35} height={35} className="border" />

                      {players && players.slice(0, maxVisiblePlayers).map((player, index) => (
                        <Image
                          src={player.customerProfile || userProfile}
                          roundedCircle
                          width={35}
                          height={35}
                          className="border ms-n3"
                          key={index}
                        />
                      ))}

                      {players?.length > maxVisiblePlayers && (
                        <span className="fw-bold text-muted ms-2">
                          +{players.length - maxVisiblePlayers}
                        </span>
                      )}
                    </div>

                    <BsArrowUpRight
                      size={16}
                      className="text-primary"
                      onClick={() => setShowPlayerOverlay(!showPlayerOverlay)}
                    />
                    {showPlayerOverlay && (
                      <div className="flex">
                        <div
                          className="bg-white p-3 rounded-2xl shadow-lg"
                          style={{
                            position: "absolute",
                            width: "17rem",
                            top: "50%",
                            left: "80%",
                            zIndex: "9999",
                          }}
                        >
                          <h4>Select looser player</h4>
                          <div className="flex items-center space-x-3 mb-2">
                            <span
                              className="text-black font-medium"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleSelectLooserPlayer(selectedCustomer)}
                            >
                              {selectedCustomer.name}
                            </span>
                          </div>
                          {players.map((player, index) => (
                            <div key={index} className="flex items-center space-x-3 mb-2">
                              <span
                                className="text-black font-medium"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSelectLooserPlayer(player)}
                              >
                                {player.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Stack>
                )}
              </Col>
            </Row>
          </div>}

          {booking?.status === "Pending" ?
            <Card className="p-3 rounded-3">
              <h5 className="fs-3">Payment Details</h5>

              <Row className="mt-1">
                <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size})</Col>
                <Col xs={3} className="text-muted">2 Candidates</Col>
                <Col xs={3} className="text-end text-muted">₹ {priceToPay} Balance</Col>
              </Row>
              <hr className="m-1" />

              <Row className="mt-1">
                <Col xs={6} className="d-flex align-items-center">
                  <p className="text-muted">Total Amount</p>
                </Col>
                <Col xs={6} className="mb-2">
                  <span className="fw-bold text-dark">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Disabled readonly input"
                      aria-label="Disabled input example"
                      readOnly
                      value={priceToPay}
                    />
                  </span>
                </Col>
              </Row>

              <Row>
                <Col xs={6} className="d-flex align-items-center">
                  <p className="text-muted">Adjustment</p>
                </Col>
                <Col xs={6} className="mb-2">
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter adjustment value"
                    value={adjustment}
                    onChange={handleAdjustmentChange}
                  />
                </Col>
              </Row>

              <Row className="mb-2">
                <Col xs={6}>
                  <p className="text-muted">Payable Amount</p>
                </Col>
                <Col xs={6}>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={payableAmount}
                    onChange={handlePayableAmountChange}
                  />
                </Col>
              </Row>

              <Row className="mb-2">
                <Col xs={6}>
                  <p className="text-muted">Credit Amount</p>
                </Col>
                <Col xs={6}>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Input Credit Amount"
                    readOnly
                    value={creditAmount}
                  />
                </Col>
              </Row>

              {creditAmount > 0 &&
                <Row className="mt-2">
                  <Col md={12} xs={12}>

                    <h4> Credit Collection</h4>
                    <InputGroup className="mb-3" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                      {/* <InputGroup.Checkbox style={{ border: '1px solid #ccc', borderRadius: '5px' }} aria-label="Checkbox for following text input" /> */}
                      <Form.Control aria-label="Text input with checkbox" value={selectedCustomer.name} readOnly />
                      <Form.Control aria-label="Text input with checkbox" placeholder="Rs 0" value={playerCredits.find((p) => p.id === selectedCustomer._id)?.credit || 0}
                        onChange={(e) => handleCreditChange(selectedCustomer._id, e.target.value)} />
                    </InputGroup>
                    {players.length > 0 && players.map((player, index) => (
                      <InputGroup className="mb-3" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                        {/* <InputGroup.Checkbox style={{ border: '1px solid #ccc', borderRadius: '5px' }} aria-label="Checkbox for following text input" /> */}
                        <Form.Control aria-label="Text input with checkbox" value={player.name} readOnly />
                        <Form.Control aria-label="Text input with checkbox" placeholder="Rs 0" value={playerCredits.find((p) => p.id === player._id)?.credit || 0}
                          onChange={(e) => handleCreditChange(player._id, e.target.value)} />
                      </InputGroup>
                    ))}
                  </Col>
                </Row>}

              <Row>
                <Col md={3} xs={6}>
                  <Button variant="primary btn btn-sm"
                    xs={12}
                    className="w-100 mt-3"
                    onClick={handleOnlinePayment}
                  >
                    Online
                  </Button>
                </Col>
                <Col md={3} xs={6}>
                  <Button variant="primary btn btn-sm"
                    xs={12}
                    className="w-100 mt-3"
                  >
                    Offline
                  </Button>

                </Col>
              </Row>

            </Card>
            :
            <Card className="p-3 rounded-3 h-100">
              <h5 className="fs-3">Payment Details</h5>
              <Row className="mt-1">
                <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size})</Col>
                <Col xs={3} className="text-muted">2 Candidates</Col>
                <Col xs={3} className="text-end text-muted">₹ {priceToPay} Balance</Col>
              </Row>
              <hr className="m-1" />
            </Card>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default BookingCheckout;
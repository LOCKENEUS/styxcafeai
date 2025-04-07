import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Stack, Form, InputGroup, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { FaPhone, FaVideo, FaComment, FaClock, FaRegClock, FaPause } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import userProfile from "/assets/profile/user_avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12Hour, formatDate, formatDateAndTime } from "../../../components/utils/utils";
import { getBookingDetails, processOnlinePayment, updateBooking } from "../../../store/AdminSlice/BookingSlice";
import { VscDebugContinue } from "react-icons/vsc";
import { initializeTimer, pauseBookingTimer, resumeBookingTimer, startBookingTimer, stopBookingTimer } from "../../../store/AdminSlice/TimerSlice";

const BookingCheckout = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const booking = useSelector((state) => state.bookings.booking);
  const { isRunning, isPaused, startTime, elapsedTime, pausedTime } = useSelector((state) => state.timer.timer);
  const [currentTime, setCurrentTime] = useState(elapsedTime || 0);

  const backend_url = import.meta.env.VITE_API_URL;

  const maxVisiblePlayers = 2;
  const [priceToPay, setPriceToPay] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmOffline, setShowConfirmOffline] = useState(false);
  const [playerCredits, setPlayerCredits] = useState([]);
  const [adjustment, setAdjustment] = useState("");
  const [payableAmount, setPayableAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [looserPlayer, setLooserPlayer] = useState(null);
  const [slot, setSlot] = useState(null);
  const [players, setPlayers] = useState([]);
  const [paused, setPaused] = useState(false);

  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getBookingDetails(id));
    }
  }, [dispatch, id, isStopped]);

  useEffect(() => {
    if (booking) {
      setSelectedGame(booking?.game_id);
      setSelectedCustomer(booking?.customer_id);
      setSlot(booking?.slot_id);
      setPlayers(booking?.players);

      dispatch(initializeTimer(booking))

      if (booking.timer_status === "Running") {
        if (booking.start_time) {
          const elapsed = Math.floor((Date.now() - new Date(booking.start_time)) / 1000);
          const adjustedTime = booking.paused_time > 0 ? elapsed - booking.paused_time : elapsed;
          setCurrentTime(adjustedTime);
        }
      } else if (booking.timer_status === "Paused") {
        setCurrentTime(booking.paused_time || 0);
        setPaused(true);
      } else {
        setCurrentTime(booking.total_time || 0);
      }
    }
  }, [booking]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const pricePerSecond = slot?.slot_price > 0 ? slot?.slot_price / 3600 : selectedGame?.price / 3600 

  console.log("Price per second:", pricePerSecond);

  useEffect(() => {
    const secondsElapsed = currentTime;
    setPriceToPay(Math.round(secondsElapsed * pricePerSecond));
  }, [currentTime, pricePerSecond]);

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
    const adjValue = adjustment === "-" ? 0 : Number(adjustment) || 0;
    const adjustedAmount = Math.round((Number(priceToPay) || 0) + adjValue);
    setPayableAmount(adjustedAmount);
  }, [priceToPay, adjustment]);

  const handleAdjustmentChange = (e) => {
    let value = e.target.value;

    if (value === "" || value === "-") {
      setAdjustment(value);
      return;
    }

    if (/^-?\d*$/.test(value)) {
      setAdjustment(value);
    }
  };

  const handlePayableAmountChange = (e) => {
    console.log("e.target.value: ", e.target.value);

    const newPayableAmount = Math.round(parseFloat(e.target.value) || 0);
    const adjustmentValue = adjustment === "-" ? 0 : parseFloat(adjustment) || 0; // Fix NaN issue

    const difference = Math.round(priceToPay - newPayableAmount + adjustmentValue);

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
    if (booking && booking.timer_status !== "Stopped") {
      setPaused(booking.timer_status === "Paused");

      if (booking.start_time) {
        const elapsed = Math.floor((Date.now() - new Date(booking.start_time)) / 1000);
        setCurrentTime(booking.paused_time || elapsed);
      }
    }
  }, [booking]);

  const handleStartTimer = () => {
    dispatch(startBookingTimer(booking._id));
  };

  const handlePauseTimer = () => {
    dispatch(pauseBookingTimer(booking._id));
  };

  const handleResumeTimer = () => {
    dispatch(resumeBookingTimer(booking._id));
  };

  const handleStopTimer = () => {
    dispatch(stopBookingTimer(booking._id));
    setIsStopped(true)
  };

  const handleOnlinePayment = async () => {
    const response = await dispatch(
      processOnlinePayment({
        selectedGame,
        selectedCustomer,
        slot,
        payableAmount,
        paid_amount: payableAmount,
        total: priceToPay,
        looserPlayer: looserPlayer,
        bookingId: booking?._id,
        playerCredits
      })
    );
  };

  const handleCollectOffline = async () => {
    try {
      const bookingData = {
        mode: "Offline",
        status: "Paid",
        total: priceToPay,
        paid_amount: payableAmount,
        playerCredits: playerCredits,
        looserPlayer: looserPlayer
      };
      await dispatch(updateBooking({ id: booking?._id, updatedData: bookingData })).unwrap()
    } catch (error) { }
  };

  const handleSelectLooserPlayer = (player) => {
    setLooserPlayer(player);
  };

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
              style={{ height: "200px", width: "auto", objectFit: "cover" }}
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
                <strong className="text-dark">Played Games:</strong> <span>{booking?.totalGamesPlayed}</span>
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
          <Button
            variant="success"
            className="w-100 mt-3"
            style={{ backgroundColor: "#03D41414", color: "#00AF0F" }}
            onClick={() => navigate(`/admin/booking/edit/${booking?._id}`)}
          >
            Edit Booking
          </Button>
        </Col>

        <Col md={8} className="d-flex flex-column gap-1 justify-content-between">
          <Card className="p-3">
            <h5 className="mb-3 font-inter fs-3">Booking Details
              {selectedGame?.payLater ?
                <span className="fw-bold text-info float-end">Amount : ₹ {slot?.slot_price ? slot?.slot_price : selectedGame?.price}/Hour</span>
                :
                <span className="fw-bold text-info float-end">Amount : ₹ {booking?.total}</span>
              }
            </h5>
            <Row>
              <Col xs={6}>
                <p className="text-muted m-0">Selected Game</p>
              </Col>
              <Col xs={6}>
                <p className="text-muted m-0">
                  <span className="fw-bold text-dark">{selectedGame?.name}({selectedGame?.size})</span>
                  <span>
                    <Button
                      variant="success"
                      className="mx-2 mb-0 rounded-pill"
                      style={{
                        backgroundColor: "#03D41414",
                        color: "#00AF0F",
                        border: "none",
                      }}
                    >
                      {selectedGame?.type}
                    </Button>
                  </span>
                </p>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col xs={6}>
                <p className="text-muted">No. of Candidates</p>
              </Col>
              <Col xs={6}>
                <p className="text-muted"><span className="fw-bold text-dark">{booking?.players?.length + 1}</span></p>
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

          {selectedGame?.type === "Multiplayer" && selectedGame?.payLater || selectedGame?.type === "Single" && selectedGame?.payLater ?
            booking?.status === "Paid" ?
              <div className="p-2 bg-white rounded shadow-sm w-100">
                <Row className="mt-3">
                  <Col md={4}>
                    <Button variant="outline-success " className="d-flex align-items-center gap-2" style={{ border: "none" }}
                      onClick={handleStopTimer}>
                      <FaRegClock size={30} />
                      <span className="fw-bold fs-1">{Math.floor(booking?.total_time / 60)} m</span>:
                      <span className="text-secondary fs-1">{booking?.total_time % 60} s</span>
                    </Button>
                  </Col>

                  <Col md={3} className="p-0">
                    <div className="">
                      <p className="mb-0 text-muted">
                        <strong>Start Time:</strong>
                        <span className="ms-2">{new Date(booking?.start_time).toLocaleTimeString()}</span>
                      </p>
                      <p className="mb-0 text-muted">
                        <strong>End Time:</strong>
                        <span className="ms-2"> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}</span>
                      </p>
                    </div>
                  </Col>

                  <Col md={2} className="p-0">
                    <h3 className="fw-bold pt-2"> ₹ {priceToPay}</h3>
                  </Col>

                  <Col md={3} className="p-0">
                    Player Lost : {booking?.looserPlayer?.name}
                  </Col>

                </Row>
              </div>
              : (
                selectedGame?.payLater &&
                <div className="p-2 bg-white rounded shadow-sm w-100">
                  <Row>
                    <Col md={10} >
                      <Button variant="outline-success " className="d-flex align-items-center gap-2" style={{ border: "none" }}
                        onClick={handleStopTimer}>
                        <FaRegClock size={30} />
                        <span className="fw-bold fs-1">{Math.floor(currentTime / 60)} m</span>:
                        <span className="text-secondary fs-1">{currentTime % 60} s</span>
                      </Button>
                    </Col>
                    <Col md={2} className="p-0 mt-3">
                      <h3 className="fw-bold mx-6"> ₹ {priceToPay}</h3>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      {isRunning || isPaused ? (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          style={{ border: "2px dashed rgb(255, 68, 0)", width: "80%", marginLeft: "10px" }}
                          onClick={() => setShowConfirm(true)} // Show confirmation modal
                        >
                          Stop Timer
                        </Button>
                      ) : (
                        !isPaused &&
                        <Button
                          size="sm"
                          variant="outline-primary"
                          disabled={booking?.total_time > 0 && booking?.timer_status === "Stopped"}
                          style={{ border: "2px dashed", width: "70%", padding: "8px", marginLeft: "10px" }}
                          onClick={handleStartTimer}
                        >
                          <FaClock size={16} className="mx-2" />
                          <span>Start Game Time</span>
                        </Button>
                      )}
                    </Col>

                    <Col md={1} className="p-0">
                      {
                        !isRunning ? (
                          <VscDebugContinue
                            size={25}
                            className="text-success mt-2"
                            style={{ marginLeft: "5%", cursor: "pointer" }}
                            onClick={handleResumeTimer}
                          />
                        ) : (
                          <FaPause
                            size={25}
                            className="text-danger mt-2"
                            style={{ marginLeft: "5%", cursor: "pointer" }}
                            onClick={handlePauseTimer}
                          />
                        )
                      }

                      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Confirm Stop Timer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to stop the timer?</Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                            No
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleStopTimer();
                              setShowConfirm(false);
                            }}
                          >
                            Yes
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={showConfirmOffline} onHide={() => setShowConfirmOffline(false)} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Confirm Offline Payment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to collect offline payment?</Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowConfirmOffline(false)}>
                            No
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleCollectOffline();
                              setShowConfirmOffline(false);
                            }}
                          >
                            Yes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Col>

                    <Col md={4} className="p-0">
                      <div className="ms-3">
                        <p className="mb-0 text-muted">
                          <strong>Start Time:</strong> {new Date(booking?.start_time).toLocaleTimeString()}
                        </p>
                        <p className="mb-0 text-muted">
                          <strong>End Time:</strong> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}
                        </p>
                      </div>
                    </Col>

                    <Col md={3}>

                      {looserPlayer && (
                        <div style={{ width: "100%" }}>
                          <span className="fw-bold">Looser: </span>
                          {looserPlayer.name}
                        </div>
                      )}
                      <OverlayTrigger
                        placement="left"
                        show={showTooltip}
                        onToggle={(isVisible) => setShowTooltip(isVisible)}
                        overlay={
                          <Tooltip
                            id="player-list-tooltip"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            <h6 className="m-2 p-2 text-light border-bottom">Select Looser Player</h6>
                            <ul className="m-2 p-2 list-unstyled">
                              {selectedCustomer && (
                                <li
                                  className="fw-bold p-1"
                                  onClick={() => {
                                    setLooserPlayer(selectedCustomer);
                                    setShowTooltip(false);
                                  }}
                                  // style={{ cursor: "pointer" }}
                                  style={{
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa", e.currentTarget.style.color = "black")}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "white")}
                                >
                                  {selectedCustomer?.name} (Customer)
                                </li>
                              )}

                              {players?.length > 0 ? (
                                players.map((player, index) => (
                                  <li
                                    key={index}
                                    className="p-1"
                                    onClick={() => handleSelectLooserPlayer(player)}
                                    style={{
                                      cursor: "pointer",
                                      transition: "all 0.2s ease-in-out",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa", e.currentTarget.style.color = "black")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "white")}
                                  >
                                    {player.name}
                                  </li>
                                ))
                              ) : (
                                <li className="text-muted">No Players</li>
                              )}
                            </ul>
                          </Tooltip>
                        }
                      >
                        <Stack
                          direction="horizontal"
                          gap={2}
                          className="align-items-center mt-2 float-end px-6"
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          <div className="d-flex">
                            <Image src={userProfile} roundedCircle width={35} height={35} className="border" />
                            {players &&
                              players.slice(0, maxVisiblePlayers).map((player, index) => (
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
                              <span className="fw-bold text-muted ms-2">+{players.length - maxVisiblePlayers}</span>
                            )}
                          </div>
                        </Stack>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </div>
              )
            :
            <></>
          }

          {booking?.status === "Pending" ?
            <Card className="p-3 rounded-3">
              <h5 className="fs-3">Payment Details</h5>
              <Row className="mt-1">
                <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size})</Col>
                <Col xs={3} className="text-muted">{booking?.players?.length + 1} Candidates</Col>
                <Col xs={3} className="text-end text-muted">₹ {booking?.total - booking?.paid_amount} Balance</Col>
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
                    disabled={!booking?.timer_status === "Stopped"}
                    onClick={handleOnlinePayment}
                  >
                    Online
                  </Button>
                </Col>
                <Col md={3} xs={6}>
                  <Button variant="primary btn btn-sm"
                    xs={12}
                    className="w-100 mt-3"
                    disabled={!booking?.timer_status === "Stopped"}
                    onClick={() => setShowConfirmOffline(true)}
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
                <Col xs={3} className="text-dark">
                  {/* {booking?.players?.length + 1} <span>Candidates</span> */}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="player-list-tooltip">
                        <ul className="m-2 p-2">
                          {/* Selected Customer */}
                          {selectedCustomer && (
                            <li className="fw-bold p-1">{selectedCustomer?.name} (Main Customer)</li>
                          )}

                          {/* Players List */}
                          {booking?.players?.length > 0 ? (
                            players.map((player, index) => (
                              <li key={index} className="p-1">{player.name}</li>
                            ))
                          ) : (
                            <li className="text-muted">No Players</li>
                          )}
                        </ul>
                      </Tooltip>
                    }
                  >
                    <span className="cursor-pointer">
                      {booking?.players?.length + 1} <span>Players</span>
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs={3} className="text-end text-muted">₹ {booking?.total - booking?.paid_amount} Balance</Col>
              </Row>
              <hr className="m-1" />

              <Row className="mt-4">
                <Col xs={6} className="text-dark fw-semibold">Payment Mode</Col>
                <Col xs={6} className="text-muted">
                  <span
                    className="d-flex align-items-center w-25"
                    style={{
                      backgroundColor:
                        booking?.mode === "Online"
                          ? "#03D41414"
                          : "#FF00000D",
                      borderRadius: "20px",
                      padding: "5px 10px",
                      marginLeft: "-10px",
                      color:
                        booking?.mode === "Online" ? "#00AF0F" : "orange",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor:
                          booking?.mode === "Online"
                            ? "#03D414"
                            : "orange",
                        marginRight: "5px",
                      }}
                    />
                    {booking?.mode}
                  </span>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xs={6} className="text-dark fw-semibold">Amount Paid</Col>
                <Col xs={6} className="text-muted">₹ {booking?.paid_amount}</Col>
              </Row>

              <Row className="mt-4">
                <Col xs={6} className="text-dark fw-semibold">Transaction ID</Col>
                <Col xs={6} className="text-muted">{booking?.transaction?.razorpay_payment_id || "-"}</Col>
              </Row>

              <Row className="mt-4">
                <Col xs={6} className="text-dark fw-semibold">Date/Time</Col>
                <Col xs={6} className="text-muted">
                  {booking?.mode === "Online" ? formatDateAndTime(booking?.transaction?.createdAt) : formatDateAndTime(booking?.createdAt)}
                </Col>
              </Row>
            </Card>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default BookingCheckout;
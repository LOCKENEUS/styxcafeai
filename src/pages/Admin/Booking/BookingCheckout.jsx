import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Table, Badge, Stack, Overlay, Popover } from "react-bootstrap";
import { FaPhone, FaVideo, FaComment, FaClock, FaRegClock, FaTrophy, FaThumbsDown } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import userProfile from "/assets/profile/user_avatar.jpg";
import { BsArrowUpRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12Hour, formatDate } from "../../../components/utils/utils";
import { startTimer, stopTimer, updateTimer } from "../../../store/AdminSlice/TimerSlice";
import { getBookingDetails } from "../../../store/AdminSlice/BookingSlice";

const BookingCheckout = () => {

  const { id } = useParams();
  const target = useRef(null);
  const dispatch = useDispatch();

  const maxVisiblePlayers = 3;
  const [priceToPay, setPriceToPay] = useState(0);
  const [startingTime, setStartingTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPlayerOverlay, setShowPlayerOverlay] = useState(false);
  const [timeCalculated, setTimeCalculated] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [looserPlayer, setLooserPlayer] = useState(null);
  const [slot, setSlot] = useState(null);
  const [players, setPlayers] = useState([]);

  const backend_url = import.meta.env.VITE_API_URL;

  const booking = useSelector((state) => state.bookings.booking);
  const { isRunning, startTime, elapsedTime } = useSelector((state) => state.timer);
  const [currentTime, setCurrentTime] = useState(elapsedTime || 0);

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
    if (isRunning) {
      const interval = setInterval(() => {
        if (startTime) {
          setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
          dispatch(updateTimer(Math.floor((Date.now() - startTime) / 1000)));
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
    }
  };

  const handleStopTimer = () => {
    localStorage.removeItem("gameTimerStart");
    dispatch(stopTimer());

    const endTime = Date.now(); // Capture end time
    const pricePerHour = slot?.slot_price || selectedGame?.price || 0;
    const pricePerMinute = pricePerHour / 60;
    const totalPrice = (currentTime / 60) * pricePerMinute;
    const finalPrice = totalPrice.toFixed(2);

    setPriceToPay(finalPrice);
    setTimeCalculated(true); 
    setEndTime(endTime);
  };

  const handleOnlinePayment = async () => {
    try {
      const response = await fetch(`${backend_url}/admin/booking/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          amount: selectedGame?.price * 100,
          currency: "INR",
          customerId: selectedCustomer?._id,
          gameId: selectedGame?._id,
          slotId: slot?._id,
          date: new Date().toISOString(),
          teamMembers: [],
        }),
      });

      const data = await response.json();
      if (data.success && data.order) {
        const options = {
          key: import.meta.env.VITE_RAZOR_LIVE_KEY,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Lockene Inc",
          description: "Game Booking",
          order_id: data.order.id,
          handler: async function (response) {
            // Send transaction details to backend
            const verifyResponse = await fetch(`${backend_url}/admin/booking/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: booking?._id, // Pass the booking ID
                amount: data.order.amount,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              alert("Payment Successful and Saved!");
            } else {
              alert("Payment Verification Failed");
            }
          },
          prefill: {
            name: selectedCustomer?.name,
            email: selectedCustomer?.email,
            contact: selectedCustomer?.contact_no,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error("Failed to create Razorpay order");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleSelectLooserPlayer = (player) => {
    setLooserPlayer(player);
    setShowPlayerOverlay(false);
  }

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

        <Col md={8} className="d-flex flex-column justify-content-between">
          <Card className="p-3">
            <h5 className="mb-3 font-inter fs-3">Booking Details</h5>
            <Row className="mb-2">
              <Col xs={6}>
                <p className="text-muted">Selected Game</p>
              </Col>
              <Col xs={6}>
                <p className="text-muted"><span className="fw-bold text-dark">{selectedGame?.name}({selectedGame?.size})</span></p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>
                <p className="text-muted">No. of Candidates</p>
              </Col>
              <Col xs={6}>
                <p className="text-muted"><span className="fw-bold text-dark">2</span></p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>
                <p className="text-muted">Slot Details</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">{selectedGame?.name} {slot?.name}</span>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>
                <p className="text-muted">Time Slot</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">{slot?.start_time && convertTo12Hour(slot?.start_time)} - {slot?.end_time && convertTo12Hour(slot.end_time)}</span>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>
                <p className="text-muted">Day/Date</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">{formatDate(booking?.slot_date)}</span>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>
                <p className="text-muted">Booking ID</p>
              </Col>
              <Col xs={6}>
                <span className="fw-bold text-dark">B-0245715</span>
              </Col>
            </Row>
          </Card>

          <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded shadow-sm w-100">
            <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm w-100">
              {!isRunning && !timeCalculated ?
                <Button
                  variant="outline-primary"
                  style={{ border: "2px dashed" }}
                  className="d-flex align-items-center gap-2"
                  onClick={handleStartTimer}
                >
                  <FaClock size={16} />
                  <span>Start Game Time</span>
                </Button> :
                <Button variant="outline-success" className="d-flex align-items-center gap-2" style={{ border: "2px dashed" }}
                  onClick={handleStopTimer}>
                  <FaRegClock size={20} className="text-success" />
                  <span className="fw-bold">{Math.floor(currentTime / 60)} m</span>:
                  <span className="text-secondary">{currentTime % 60} s</span>
                </Button>
              }

              {timeCalculated && (
                <div className="ms-3">
                  <p className="mb-0 text-muted">
                    <strong>Start Time:</strong> {new Date(startingTime).toLocaleTimeString()}
                  </p>
                  <p className="mb-0 text-muted">
                    <strong>End Time:</strong> {endTime ? new Date(endTime).toLocaleTimeString() : "-"}
                  </p>
                </div>
              )}

              {isRunning ? <Button variant="outline-danger" style={{ border: "2px dashed rgb(255, 68, 0)", marginLeft: "5%" }}
                onClick={handleStopTimer}>Stop Timer</Button> : <h3 className="fw-bold mx-6"> ₹ {priceToPay}</h3>}
            </div>

            {looserPlayer ?
              <div
                style={{ width: "100%" }}
              >
                <span className="fw-bold" >Looser : </span>
                {looserPlayer.name}
              </div>
              :
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
                {showPlayerOverlay && <div className="flex">
                  <div className="bg-white p-3 rounded-2xl shadow-lg"
                    style={{
                      position: "absolute",
                      width: "17rem",
                      top: "50%",
                      left: "80%",
                      zIndex: "9999",
                    }}
                  >
                    <h4>Select looser player</h4>
                    {players.map((player, index) => (
                      <div key={index} className="flex items-center space-x-3 mb-2">
                        <span className="text-black font-medium" onClick={() => handleSelectLooserPlayer(player)}>{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>}
              </Stack>
            }

          </div>

          <Card className="p-3 rounded-3">
            <h5 className="fs-3">Payment Details</h5>

            <Row className="mt-3">
              <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size})</Col>
              <Col xs={3} className="text-muted">2 Candidates</Col>
              <Col xs={3} className="text-end text-muted">₹ {priceToPay} Balance</Col>
            </Row>
            <hr />

            <Button variant="primary"
              className="w-25 mt-3"
              ref={target}
              onClick={() => setShowPopup(!showPopup)}
            >
              Collect Amount
            </Button>
            <Overlay
              show={showPopup}
              target={target.current}
              placement="right"
              container={target}
              containerPadding={20}
            >
              <Popover id="popover-contained">
                <Popover.Body>
                  <Button variant="light" block onClick={handleOnlinePayment}  >
                    Online
                  </Button>
                  <Button variant="light" block >
                    Offline
                  </Button>
                </Popover.Body>
              </Popover>
            </Overlay>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingCheckout;

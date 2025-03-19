import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Table, Badge, Stack, Overlay, Popover } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaUsers, FaVideo, FaComment, FaClock, FaRegClock } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import userProfile from "/assets/profile/user_avatar.jpg";
import { BsArrowUpRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerById } from "../../../store/AdminSlice/CustomerSlice";
import { getGameById } from "../../../store/slices/gameSlice";
import { getSlotDetails } from "../../../store/slices/slotsSlice";
import { convertTo12Hour } from "../../../components/utils/utils";
import { startTimer, stopTimer, updateTimer } from "../../../store/AdminSlice/TimerSlice";

const BookingCheckout = () => {

  const { clientId, gameId, slotId } = useParams();
  const target = useRef(null);
  const dispatch = useDispatch();

  const [priceToPay, setPriceToPay] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const backend_url = import.meta.env.VITE_API_URL;

  const { selectedGame, status: gameStatus, error: gameError } = useSelector((state) => state.games);
  const selectedCustomer = useSelector((state) => state.customers.selectedCustomer);
  const { isRunning, startTime, elapsedTime } = useSelector((state) => state.timer);
  const [currentTime, setCurrentTime] = useState(elapsedTime || 0);
  const slot = useSelector((state) => state.slots.slot);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  useEffect(() => {
    if (clientId) {
      dispatch(getCustomerById(clientId));
    }
  }, [dispatch, clientId]);

  useEffect(() => {
    if (gameId) {
      dispatch(getGameById(gameId));
    }
    if (slotId) {
      dispatch(getSlotDetails({ id: slotId }));
    }
  }, [dispatch, gameId, slotId]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
        dispatch(updateTimer(Math.floor((Date.now() - startTime) / 1000)));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, startTime, dispatch]);

  const handleStartTimer = () => {
    if (!isRunning) {
      const now = Date.now();
      localStorage.setItem("gameTimerStart", now);
      dispatch(startTimer(now));
    }
  };

  const handleStopTimer = () => {
    localStorage.removeItem("gameTimerStart");
    dispatch(stopTimer());

    const pricePerHour = slot?.price || selectedGame?.data?.price || 0;
    const pricePerMinute = pricePerHour / 60;
    const totalPrice = (currentTime / 60) * pricePerMinute;
    const finalPrice = totalPrice.toFixed(2);

    setPriceToPay(finalPrice);
    setCurrentTime(0);
  };

  // const handleOnlinePayment = async () => {
  //   try {
  //     const response = await fetch(`${backend_url}/admin/booking/payment`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  //       },
  //       body: JSON.stringify({
  //         amount: selectedGame?.data?.price * 100,
  //         currency: "INR",
  //         token: "dummy_token",
  //         customerId: selectedCustomer?._id,
  //         gameId: selectedGame?.data?._id,
  //         slotId: slot?._id,
  //         date: new Date().toISOString(),
  //         teamMembers: [],
  //       }),
  //     });
  
  //     const data = await response.json();
  //     console.log("Response JSON:", data);
  
  //     if (data.success && data.order) {
  //       const options = {
  //         key: import.meta.env.VITE_RAZOR_LIVE_KEY,
  //         amount: data.order.amount,
  //         currency: data.order.currency,
  //         name: "Lockene Inc",
  //         description: "Game Booking",
  //         order_id: data.order.id,
  //         handler: function (response) {
  //           console.log("Payment successful:", response);
  //           alert("Payment successful!");
  //         },
  //         prefill: {
  //           name: selectedCustomer?.name,
  //           email: selectedCustomer?.email,
  //           contact: selectedCustomer?.contact_no,
  //         },
  //         theme: {
  //           color: "#3399cc",
  //         },
  //       };
  
  //       const razorpay = new window.Razorpay(options);
  //       razorpay.open();
  //     } else {
  //       console.error("Failed to create Razorpay order");
  //     }
  //   } catch (error) {
  //     console.error("Payment error:", error);
  //   }
  // };
  
  const handleOnlinePayment = async () => {
    try {
      const response = await fetch(`${backend_url}/admin/booking/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          amount: selectedGame?.data?.price * 100,
          currency: "INR",
          customerId: selectedCustomer?._id,
          gameId: selectedGame?.data?._id,
          slotId: slot?._id,
          date: new Date().toISOString(),
          teamMembers: [],
        }),
      });
  
      const data = await response.json();
      console.log("Response JSON:", data);
      if (data.success && data.order) {
        const options = {
          key: import.meta.env.VITE_RAZOR_LIVE_KEY,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Lockene Inc",
          description: "Game Booking",
          order_id: data.order.id,
          handler: async function (response) {
            console.log("Payment successful:", response);
  
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
                booking_id: data.booking_id, // Pass the booking ID
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
  
  return (
    <Container className="mt-4">

      <Row>
        <h5>
          <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>
            {"Bookings/Checkout"}
          </span>
        </h5>
      </Row>

      {isRunning && (
        <div className="text-center bg-success text-white py-2">
          <h4>Game Timer: {Math.floor(currentTime / 60)}m {currentTime % 60}s</h4>
        </div>
      )}

      <Row>
        {/* Left Profile Section */}
        <Col md={4} className="border-0">
          <Card className="p-3">
            <Card.Img
              variant="top"
              src="https://s3-alpha-sig.figma.com/img/be70/1502/d32ed7bfbdc0fdd0dfbd60ecf3f4b9d1?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qdHwFI6Hmz1tKs5KpOtq8IqzdiJFMek3k5yhoYgLHTjZJyOzwHvPdpzv1LgNCJQDmpCksE4Dll4rCSg0tUS7c5EMJ7DUx90teVpIzz8mQh8HZIc8yaX9WHQr8wxm8aaSJYiphMNKvMX-tsJLDyKzRkriyhovQg3maxqEbHar66g3WvslQ~-cp48ZzvjMjGdULE14lRIIX0c7Hgmkvce-97V1FLe8ezhAUFexHxdE2qZ2F1rVbTaVrwz46UQPQO4K-e2vU8CgwNT-VNYwRlCbM1Xdj7XI2I9ufQDHA0HsS1Fxst2Yq2O~deJYg33Jl8f9K7PNpRwRB4sVe0r94U2gJQ__"
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
                <small className="text-muted">Booking ID : 147GA4786</small>
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
                <span className="text-success">Pending</span>
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

        {/* Right Booking Details Section */}
        <Col md={8} className="d-flex flex-column justify-content-between">
          <Card className="p-3">
            <h5 className="mb-3 font-inter fs-3">Booking Details</h5>
            <Row className="mb-2">
              <Col xs={6}>
                <p className="text-muted">Selected Game</p>
              </Col>
              <Col xs={6}>
                <p className="text-muted"><span className="fw-bold text-dark">{selectedGame?.data?.name}({selectedGame?.data?.size})</span></p>
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
                <span className="fw-bold text-dark">{selectedGame?.data?.name} {slot?.name}</span>
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
                <span className="fw-bold text-dark">04/06/2023 Tuesday</span>
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
            {/* Start Game Button */}
            <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm w-100">
              {!isRunning ? <Button
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
                  <span className="fw-bold">{Math.floor(currentTime / 60)}m</span>:
                  <span className="text-secondary">{currentTime % 60}s</span>
                </Button>
              }
              {isRunning ? <Button variant="outline-danger" style={{ border: "2px dashed rgb(255, 68, 0)", marginLeft: "5%" }}
                onClick={handleStopTimer}>Stop Timer</Button> : <h3 className="fw-bold mx-6"> ₹ {priceToPay}</h3>}
            </div>

            {/* Players Section */}
            <Stack direction="horizontal" gap={2} className="align-items-center">
              <div className="d-flex">
                <Image src={userProfile} roundedCircle width={35} height={35} className="border" />
                <Image src={userProfile} roundedCircle width={35} height={35} className="border ms-n3" />
                <Image src={userProfile} roundedCircle width={35} height={35} className="border ms-n3" />
              </div>
              <span className="fw-bold text-muted">+2</span>
              <BsArrowUpRight size={16} className="text-primary" />
            </Stack>
          </div>

          <Card className="p-3 rounded-3">
            <h5 className="fs-3">Payment Details</h5>

            {/* Payment Items */}
            <Row className="mt-3">
              <Col xs={6} className="text-primary fw-semibold">{selectedGame?.data?.name} ({selectedGame?.data?.size})</Col>
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

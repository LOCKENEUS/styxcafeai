import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Tab,
  Nav,
  Button,
  Overlay,
  Popover,
} from "react-bootstrap";
import { getCustomers, searchCustomers } from "../../../store/AdminSlice/CustomerSlice";
import profile_pic from "/assets/profile/user_avatar.jpg";
import { BsSearch, BsPlus } from "react-icons/bs";
import googleicon from '/assets/Admin/PaymentIcon/google.svg'
import phonepeicon from '/assets/Admin/PaymentIcon/phonepe.svg'
import paytmicon from '/assets/Admin/PaymentIcon/paytm.svg'
import cashicon from '/assets/Admin/PaymentIcon/money.svg'
import qrcode from '/assets/Admin/PaymentIcon/QrCodeIcon.svg'
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGameById } from "../../../store/slices/gameSlice";
import { getSlotDetails } from "../../../store/slices/slotsSlice";
import { addBooking } from "../../../store/AdminSlice/BookingSlice";

const BookingDetails = () => {
  const { customers, loading, error } = useSelector((state) => state.customers);
  const { selectedGame, status: gameStatus, error: gameError } = useSelector((state) => state.games);
  const { slot, loading: slotLoading, error: slotError } = useSelector((state) => state.slots);

  const [searchedCustomers, setSearchedCustomers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCustTerm, setSearchCustTerm] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: "", contact_no: "" });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("checkout");
  const target = useRef(null);

  const backend_url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));
  const cafeId = user?._id;

  const { gameId, slotId, date } = useParams();

  const dateString = date;
  const newdate = new Date(dateString);

  const formattedDate = newdate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).replace(",", "");

  useEffect(() => {
    if (cafeId) {
      dispatch(getCustomers(cafeId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (gameId) {
      dispatch(getGameById(gameId));
    }
    if (slotId) {
      dispatch(getSlotDetails({ id: slotId }));
    }
  }, [dispatch, gameId, slotId]);

  const handleAddPlayer = () => {
    if (newPlayer.name.trim() && newPlayer.contact_no.trim()) {
      setTeamMembers([...teamMembers, newPlayer]);
      setNewPlayer({ name: "", contact_no: "" });
      setShowInput(false);
      setSearchCustTerm("");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function convertTo12Hour(time) {
    const [hour, minute] = time.split(":");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  }

  const handlePayment = async (token) => {
    try {
      const response = await fetch(`${backend_url}/admin/booking/payment`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          amount: selectedGame?.data?.price * 100,
          currency: "INR",
          token: token.id,
          customerId: selectedCustomer._id,
          gameId: selectedGame?.data?._id,
          slotId: slot._id,
          date: formattedDate,
          teamMembers: teamMembers,
        }),
      });

      if (response.ok) {
        const transactionDetails = await response.json();
        dispatch(saveTransactionDetails(transactionDetails));
        alert("Payment successful!");
      } else {
        console.error('Payment failed:', response.statusText);
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCollectOffline = async () => {
    try {
      const bookingData = {
        cafe: cafeId,
        customer_id: selectedCustomer?._id,
        game_id: selectedGame?.data?._id,
        slot_id: slot?._id,
        mode: "Offline",
        status: "Pending",
        total: selectedGame?.data?.price,
        slot_date: newdate,
        players: teamMembers
      };
      await dispatch(addBooking(bookingData)).unwrap()
      navigate("/admin/bookings")
    } catch (error) { }
  };

  const handlePayLater = async () => {
    const limit = selectedCustomer?.creditLimit - selectedCustomer?.creditAmount
    if(limit < selectedGame?.data?.price){
      alert("Credit limit exceeded");
      return
    }
    try {
      const bookingData = {
        cafe: cafeId,
        customer_id: selectedCustomer?._id,
        game_id: selectedGame?.data?._id,
        slot_id: slot?._id,
        mode: "Offline",
        status: "Pending",
        total: selectedGame?.data?.price,
        slot_date: newdate,
        players: teamMembers
      };
      const response =await dispatch(addBooking(bookingData)).unwrap()

      navigate(`/admin/booking/checkout/${response?.data?._id}`)
    } catch (error) { }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchCustTerm.length > 2) {
        setSearchLoading(true);
        dispatch(searchCustomers({ cafeId, searchTerm: searchCustTerm }))
          .unwrap()
          .then((data) => setSearchedCustomers(data))
          .catch((error) => console.error("Error fetching customers:", error))
          .finally(() => setSearchLoading(false));
      } else {
        setSearchedCustomers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCustTerm, dispatch, cafeId]);

  const handleSelectCustomer = (customer) => {
    setSearchCustTerm("");
    setSearchedCustomers([]);
    setTeamMembers([...teamMembers, { name: customer.name, contact_no: customer.contact_no }]);
  };

  const handleOnlinePayment = async () => {
    try {
      setShowPopup(false);

      const limit = selectedCustomer?.creditLimit - selectedCustomer?.creditAmount
      if(limit < selectedGame?.data?.price){
        alert("Credit limit exceeded");
        return
      }

        const bookingData = {
          cafe: cafeId,
          customer_id: selectedCustomer?._id,
          game_id: selectedGame?.data?._id,
          slot_id: slot?._id,
          mode: "Online",
          status: "Pending",
          total: selectedGame?.data?.price,
          slot_date: newdate,
          players: teamMembers
        };

        const result =await dispatch(addBooking(bookingData)).unwrap()
  
      const response = await fetch(`${backend_url}/admin/booking/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          amount: slot?.slot_price * 100 || selectedGame?.price * 100,
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
                booking_id: result?.data?._id, // Pass the booking ID
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
    <Container fluid className="p-4 ">
      <h6 className="mb-3 text-muted">
        Home / Purchase / Vendor List/{" "}
        <span className="text-primary">Purchase Order</span>
      </h6>
      <Row>
        <Col style={{ height: "100%" }} md={4}>
          <div className="d-flex  gap-3">
            <InputGroup className="mb-3 ">
              <InputGroup.Text className="bg-white p-3 rounded-start">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search for Customers"
                className="border-end-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Button
              variant="white"
              className="mb-3 rounded border d-flex align-items-center gap-2"
            >
              <BsPlus size={20} />
            </Button>
          </div>

          <div className="bg-white rounded-3 p-3">
            <div className="customer-list">
              {!selectedCustomer ? (
                filteredCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className={`d-flex align-items-center p-2 mb-2 cursor-pointer hover-bg-light rounded ${selectedCustomer === customer ? "bg-light" : ""
                      }`}
                    onClick={() => setSelectedCustomer(customer)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={customer.customerProfile ? `${backend_url}/${customer.customerProfile}` : profile_pic}
                      alt=""
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div>
                      <h6 className="mb-0">{customer.name}</h6>
                      <small className="text-muted">
                        {customer.email || customer.phone}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="d-flex align-items-center p-2 mb-2 rounded bg-light">
                    <img
                      src={
                        selectedCustomer.customerProfile
                          ? `${backend_url}/${selectedCustomer.customerProfile}`
                          : profile_pic
                      }
                      alt=""
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div>
                      <h6 className="mb-0">{selectedCustomer.name}</h6>
                      <small className="text-muted">
                        {selectedCustomer.email || selectedCustomer.phone}
                      </small>
                    </div>
                  </div>

                  {showInput ? (
                    <div className="mb-2 d-flex flex-column gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Enter player name"
                        value={searchCustTerm}
                        onChange={(e) => {
                          setNewPlayer({ ...newPlayer, name: e.target.value });
                          setSearchCustTerm(e.target.value);
                        }}
                      />

                      {searchedCustomers.length > 0 && (
                        <ul className="absolute top-full w-full bg-white border rounded shadow-md max-h-40 overflow-y-auto z-10">
                          {searchedCustomers.map((customer, index) => (
                            <li
                              key={index}
                              onClick={() => handleSelectCustomer(customer)}
                              className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                            >
                              {customer?.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Form.Control
                        type="text"
                        placeholder="Enter contact number"
                        value={newPlayer.contact_no}
                        onChange={(e) => setNewPlayer({ ...newPlayer, contact_no: e.target.value })}
                      />
                      <Button variant="primary" onClick={handleAddPlayer}>
                        Add
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline-primary"
                      className="d-flex w-100 align-items-center justify-content-center p-3 border-dashed"
                      style={{
                        border: "2px dashed #007bff",
                        borderRadius: "10px",
                        color: "#007bff",
                        fontWeight: "bold",
                        backgroundColor: "transparent",
                        transition: "background-color 0.3s, color 0.3s"
                      }}
                      onClick={() => setShowInput(true)}
                    >
                      <BsPlus className="me-2" size={30} />
                      Add Players
                    </Button>
                  )}

                  {teamMembers.length > 0 && (
                    <div className="mt-3">
                      <h5 className="fw-bold">No of Candidates</h5>
                      {teamMembers.map((player, index) => (
                        <p key={index} className="mt-4">
                          {player.name} - {player.contact_no}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Col>

        <Col md={8}>
          <div
            style={{ height: "315px" }}
            className="bg-white rounded-3 p-4 mb-4 position-relative"
          >
            <div className=" p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>              
                  <h3>Customer Details</h3>
                </div>
                <div>
                  <div className="text-success"><span className="fw-bold float-end">Credit Limit: {selectedCustomer?.creditLimit || 0}</span></div>
                  <div className="text-danger"><span className="fw-bold float-end">Remaining: {selectedCustomer?.creditLimit - selectedCustomer?.creditAmount || 0}</span></div>
                </div>
              </div>
              {selectedCustomer ? (
                <div className="d-flex justify-content-between align-items-center">
                  <div className="mt-4">
                    <div className="mb-4">
                      <h5 className="text-muted">Customer Name</h5>
                      <p className="text-black">{selectedCustomer.name}</p>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-muted">Booked Game</h5>
                      <p style={{ fontWeight: "bold" }} className="text-primary">
                        {selectedGame?.data?.name} ({selectedGame?.data?.size})
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-muted">Day & Time</h5>
                      <p className="">{formattedDate} - {convertTo12Hour(slot.start_time)}</p>
                    </div>
                  </div>
                  <div className="top-4 end-4">
                    <div className="bg-light d-flex flex-column justify-content-between align-items-center rounded-3 p-3">
                      <h5 className=" text-black mb-1">No of Candidates</h5>
                      <p className="text-primary  mb-0">{selectedGame?.data?.type === "Multiplayer" ? teamMembers.length + 1 : 1}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted d-flex justify-content-center align-items-center h-100 w-100 mb-0">
                  Select Customers
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3">
            <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
              <Nav variant="tabs" className="border-0">
                <Nav.Item>
                  <Nav.Link eventKey="checkout" className="border-0">
                    Checkout Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="payment" className="border-0">
                    Payment Methods
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="p-4 h-100">
                <Tab.Pane eventKey="checkout">
                  {selectedCustomer ? (
                    <div className="p-4">
                      <h5>Checkout Details</h5>
                      <div className="mb-4">
                        <h5 className="text-muted">Total Amount</h5>
                        <p className="text-black">₹ {slot.slot_price ? slot.slot_price : selectedGame?.data?.price}</p>
                      </div>
                      <div className="mb-4">
                        <h5 className="text-muted">Extra Charge</h5>
                        <p className="text-black">₹ 00.00</p>
                      </div>
                      <div className="mb-4">
                        <h5 className="text-muted">GST</h5>
                        <p className="text-black">₹ 00.00</p>
                      </div>
                      <div className="mb-4">
                        <h5 className="text-muted">TOTAL</h5>
                        <p className="text-primary" style={{ fontWeight: "bold" }}>₹ {slot.slot_price ? slot.slot_price : selectedGame?.data.price}</p>
                      </div>
                      <div className="mb-4">
                        <Button ref={target} onClick={() => setShowPopup(!showPopup)}>
                          Proceed
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
                              <Button variant="light" block onClick={handleOnlinePayment}>
                                Online
                              </Button>
                              <Button variant="light" block onClick={handleCollectOffline}>
                                Offline
                              </Button>
                              <Button variant="light" block onClick={handlePayLater}>
                                Pay Later
                              </Button>
                            </Popover.Body>
                          </Popover>
                        </Overlay>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted d-flex justify-content-center align-items-center h-100 w-100 mb-0">
                      Select Customers
                    </p>
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="payment">
                  {selectedCustomer ? (
                    <div className="p-4">
                      <div className="d-flex justify-content-around align-items-center">
                        <div>
                          <h5>Total Amount to be</h5>
                          <p className="text-primary" style={{ fontWeight: "bold" }}>₹ {selectedGame?.data?.price}</p>
                        </div>
                        <img src={qrcode} alt="QR Code" />
                      </div>
                      <div className="d-flex mt-4 justify-content-around">
                          <img src={googleicon} alt="Google Pay" style={{ cursor: "pointer" }} />
                        <img src={phonepeicon} alt="PhonePe" />
                        <img src={paytmicon} alt="Paytm" />
                        <img src={cashicon} alt="Cash" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted d-flex justify-content-center align-items-center h-100 w-100 mb-0">
                      Select Customers
                    </p>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingDetails;
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Tab,
  Nav,
  Button,
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
import { useNavigate, useParams } from "react-router-dom";
import { getGameById } from "../../../store/slices/gameSlice";
import { getSlotDetails } from "../../../store/slices/slotsSlice";
import StripeCheckout from "react-stripe-checkout";
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
  const backend_url = import.meta.env.VITE_API_URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));
  const cafeId = user?._id;

  const { gameId, slotId, date } = useParams();

  const dateString = date
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
      setNewPlayer({ name: "", contact_no: "" }); // Clear inputs
      setShowInput(false); // Hide form after submission
      setSearchTerm("");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function convertTo12Hour(time) {
    const [hour, minute] = time.split(":");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 -> 12 for 12 AM
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
          amount: selectedGame?.data?.price * 100, // Amount in cents
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
        dispatch(saveTransactionDetails(transactionDetails)); // Save transaction details to Redux store
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
        players: teamMembers
      };
      await dispatch(addBooking(bookingData)).unwrap()
      navigate("/admin/bookings")
    } catch (error) { }
  };

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

  console.log("searchedCustomers", searchedCustomers);

  const handleSelectCustomer = (customer) => {
    // setSelectedCustomer(customer);
    setSearchCustTerm(""); // Clear search term
    setSearchedCustomers([]); // Clear the result list
    setTeamMembers([...teamMembers, { name: customer.name, contact_no: customer.contact_no }]);
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
              <h5>Customer Details</h5>
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

          <div style={{}} className="bg-white rounded-3">
            <Tab.Container defaultActiveKey="checkout">
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
                        <h5 className="text-muted">SGST</h5>
                        <p className="text-black">₹ 00.00</p>
                      </div>
                      <div className="mb-4">
                        <h5 className="text-muted">TOTAL</h5>
                        <p className="text-primary" style={{ fontWeight: "bold" }}>₹ {slot.slot_price ? slot.slot_price : selectedGame?.data.price}</p>
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

                        <StripeCheckout
                          stripeKey={import.meta.env.VITE_STRIPE_KEY}
                          token={handlePayment}
                          amount={selectedGame?.data?.price * 100} // Amount in cents
                          name="Your Company Name"
                          description="Payment for Booking"
                          image="https://your-logo-url.com/logo.png"
                          currency="INR"
                          email={selectedCustomer.email}
                        >
                          <img src={googleicon} alt="Google Pay" style={{ cursor: "pointer" }} />
                        </StripeCheckout>
                        <img src={phonepeicon} alt="PhonePe" />
                        <img src={paytmicon} alt="Paytm" />
                        <img src={cashicon} alt="Cash" />
                      </div>
                      <Button className="mt-4" onClick={handleCollectOffline}>Collect Offline</Button>
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
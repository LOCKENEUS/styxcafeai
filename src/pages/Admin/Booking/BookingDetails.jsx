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
  Dropdown,
  ListGroup,
} from "react-bootstrap";
import { addCustomer, getCustomers, searchCustomers } from "../../../store/AdminSlice/CustomerSlice";
import profile_pic from "/assets/profile/user_avatar.jpg";
import { BsSearch, BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getGameById } from "../../../store/slices/gameSlice";
import { getSlotDetails } from "../../../store/slices/slotsSlice";
import { addBooking } from "../../../store/AdminSlice/BookingSlice";
import ClientModel from "./Model/ClientModel";
import { IoAdd } from "react-icons/io5";

const BookingDetails = () => {
  const { customers, loading, error } = useSelector((state) => state.customers);
  const { selectedGame, status: gameStatus, error: gameError } = useSelector((state) => state.games);
  const { slot, loading: slotLoading, error: slotError } = useSelector((state) => state.slots);

  const [searchedCustomers, setSearchedCustomers] = useState([]);
  const [priceToPay, setPriceToPay] = useState(0);
  const [adjustment, setAdjustment] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCustTerm, setSearchCustTerm] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: "", contact_no: "" });
  const [payableAmount, setPayableAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState("");
  const [playerCredits, setPlayerCredits] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showOnCredit, setShowOnCredit] = useState(false);
  const [activeTab, setActiveTab] = useState("checkout");
  const target = useRef(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Payment Options");

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
    if (gameId && slotId) {
      if (slot?.price) {
        setPayableAmount(slot?.price)
        setPriceToPay(slot?.price)
      } else {
        setPayableAmount(selectedGame?.data?.price)
        setPriceToPay(selectedGame?.data?.price)
      }
    }
  }, [dispatch, gameId, slotId]);

  const handleAddPlayer = async () => {
    const submittedData = new FormData();
    submittedData.append("cafe", cafeId);
    submittedData.append("name", newPlayer.name);
    submittedData.append("contact_no", newPlayer.contact_no);
    submittedData.append("creditEligibility", "Yes");
    submittedData.append("creditLimit", payableAmount);

    const response = await dispatch(addCustomer(submittedData))

    let createdNewPlayer = {
      ...newPlayer,
      id: response?.payload?._id
    }

    if (newPlayer.name.trim() && newPlayer.contact_no.trim()) {
      setTeamMembers([...teamMembers, createdNewPlayer]);
      setNewPlayer({ id: "", name: "", contact_no: "" });
      setShowInput(false);
      setSearchCustTerm("");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
    if (eventKey === "Pay Later") {
      handlePayLater()
    }

    if (eventKey === "Online") {
      handleOnlinePayment()
    } else if (eventKey === "Offline") {
      handleCollectOffline()
    } else if (eventKey === "On Credit") {
      setShowOnCredit(true);
      setCreditAmount(priceToPay);
    }
  };

  useEffect(() => {
    if (creditAmount) {
      setPayableAmount(priceToPay - creditAmount)
    }
  })

  useEffect(() => {
    if (creditAmount > 0 && selectedCustomer) {
      if (teamMembers.length > 0) {
        // Case with team members
        const totalPlayers = teamMembers.length + 1; // Including the customer
        const splitAmount = Math.floor(creditAmount / totalPlayers); // Rounded value

        const updatedCredits = teamMembers.map((player) => ({
          id: player.id,
          credit: splitAmount,
        }));

        // Include the customer
        updatedCredits.push({
          id: selectedCustomer._id,
          credit: splitAmount,
        });

        setPlayerCredits(updatedCredits);
      } else {
        // Case with only selected customer (no team members)
        setPlayerCredits([{
          id: selectedCustomer._id,
          credit: creditAmount // Full amount to customer
        }]);
      }
    }
  }, [creditAmount, teamMembers, selectedCustomer]);

  function convertTo12Hour(time) {
    const [hour, minute] = time.split(":");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  }

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
        players: teamMembers,
        playerCredits: playerCredits
      };
      await dispatch(addBooking(bookingData)).unwrap()
      navigate("/admin/bookings")
    } catch (error) { }
  };

  const handlePayLater = async () => {
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
      const response = await dispatch(addBooking(bookingData)).unwrap()

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

    let isAlreadyAdded = teamMembers.some(
      (member) => member.contact_no === customer.contact_no
    );

    isAlreadyAdded = selectedCustomer.contact_no === customer.contact_no

    if (!isAlreadyAdded) {
      setTeamMembers([...teamMembers, { id: customer._id, name: customer.name, contact_no: customer.contact_no }]);
    } else {
      alert("Customer is already added!");
    }
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

  console.log("playerCredits", playerCredits)

  const handleOnlinePayment = async () => {
    try {
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

      const result = await dispatch(addBooking(bookingData)).unwrap()

      const response = await fetch(`${backend_url}/admin/booking/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          amount: payableAmount,
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
              onClick={() => setShowClientModal(true)}
            >
              <BsPlus size={20} />
            </Button>
          </div>

          {searchTerm.length > 2 && filteredCustomers.length > 0 && (
            <ListGroup className="position-absolute w-25 shadow bg-white z-index-100">
              {filteredCustomers.map((customer) => (
                <ListGroup.Item
                  key={customer.id}
                  action
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setSearchTerm('')
                  }}
                >
                  {customer.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <ClientModel
            show={showClientModal}
            handleClose={() => setShowClientModal(false)}
          />

          <div className="bg-white rounded-3 p-3" style={{ height: "100vh" }}>
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
                    selectedGame?.data?.type === "Multiplayer" ? <Button
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
                    </Button> : null
                  )}

                  {teamMembers.length > 0 && (
                    <div className="mt-3 mx-2">
                      <h5 className="fw-bold">No of Candidates  ({teamMembers.length+1})</h5>
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
            <div className="px-4">
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
              <Nav variant="tabs" className="border-0 px-4">
                <Nav.Item>
                  <Nav.Link eventKey="checkout" className="border-0 px-4 fs-2 text-dark">
                    Checkout Details
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="p-4 py-2 h-100">
                <Tab.Pane eventKey="checkout">
                  {selectedCustomer ? (
                    <div className="px-4">
                      <div className="mb-4">
                        <h5 className="text-muted">Total Amount</h5>
                        <p className="text-black">₹ {priceToPay}</p>
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

                        <Dropdown onSelect={handleSelect}>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedOption}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="w-25">
                            <Dropdown.Item eventKey="Online">Online</Dropdown.Item>
                            <Dropdown.Item eventKey="Offline">Offline</Dropdown.Item>
                            {selectedGame?.data?.payLater && <Dropdown.Item eventKey="Pay Later">Pay Later</Dropdown.Item>}
                            {!selectedGame?.data?.payLater && <Dropdown.Item eventKey="On Credit">On Credit</Dropdown.Item>}
                          </Dropdown.Menu>
                        </Dropdown>
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

            {showOnCredit && (
              <>
                <Row className="p-4 py-2">
                  <Col xs={6} className="d-flex align-items-center px-6">
                    <p className="text-dark">Total Amount</p>
                  </Col>
                  <Col xs={6} className="">
                    <span className="fw-bold text-dark">
                      <Form.Control
                        className="border border-1 border-dark"
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

                <Row className="px-4">
                  <Col xs={6} className="d-flex align-items-center px-6">
                    <p className="text-dark">Payable Amount</p>
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      className="border border-1 border-dark"
                      size="sm"
                      type="text"
                      value={payableAmount}
                      onChange={handlePayableAmountChange}
                    />
                  </Col>
                </Row>

                <Row className="p-4 py-2">
                  <Col xs={6} className="d-flex align-items-center px-6 py-2">
                    <p className="text-dark">Credit Amount</p>
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      className="border border-1 border-dark"
                      size="sm"
                      type="text"
                      placeholder="Input Credit Amount"
                      readOnly
                      value={creditAmount}
                    />
                  </Col>
                </Row>

                {creditAmount > 0 &&
                  <Row className="p-4 pt-0">
                    <h3 className="mb-3 px-4"> Credit Collection</h3>
                    <Col md={12} xs={12} className="p-4 pt-0">
                      <Row>
                        <Col md={12} className="d-flex">
                        <InputGroup className="mb-3 w-75" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                        <Form.Control aria-label="Text input with checkbox" value={selectedCustomer.name} readOnly />
                        <Form.Control aria-label="Text input with checkbox" placeholder="Rs 0" value={playerCredits.find((p) => p.id === selectedCustomer._id)?.credit || 0}
                          onChange={(e) => handleCreditChange(selectedCustomer._id, e.target.value)} />
                      </InputGroup>
                      <IoAdd
                        style={{
                          fontSize: 'clamp(30px, 8vw, 40px)',
                          cursor: 'pointer',
                          backgroundColor: 'white',
                          color: 'blue',
                          border: '2px solid blue',
                          borderRadius: '50%',
                          padding: '0.2rem',
                        }}
                      />
                        </Col>
                      </Row>
                      {teamMembers.length > 0 && teamMembers.map((player, index) => (
                          <InputGroup className="mb-3 w-75" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                          <Form.Control aria-label="Text input with checkbox" value={player.name} readOnly />
                          <Form.Control aria-label="Text input with checkbox" placeholder="Rs 0" value={playerCredits.find((p) => p.id === player.id)?.credit || 0}
                            onChange={(e) => handleCreditChange(player.id, e.target.value)} />
                        </InputGroup>
                      ))}
                    </Col>
                    <Col md={12} xs={12} className=" d-flex gap-4 p-4 pt-0">
                      <Button className="w-25" onClick={handleOnlinePayment}>Online</Button>
                      <Button className="w-25" onClick={handleCollectOffline}>Offline</Button>
                    </Col>
                  </Row>}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingDetails;
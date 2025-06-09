import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Dropdown,
  ListGroup,
  Card,
} from "react-bootstrap";
import { addCustomer, getCustomers, searchCustomers } from "../../../store/AdminSlice/CustomerSlice";
import profile_pic from "/assets/profile/user_avatar.jpg";
import { BsSearch, BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getGameById } from "../../../store/slices/gameSlice";
import { getSlotDetails } from "../../../store/slices/slotsSlice";
import { addBooking, deleteBooking } from "../../../store/AdminSlice/BookingSlice";
import ClientModel from "./Model/ClientModel";
import { getItems } from "../../../store/AdminSlice/Inventory/ItemsSlice";
import { getTaxFields } from "../../../store/AdminSlice/TextFieldSlice";
import Select from "react-select";
import { LiaCoinsSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import { TbTrash } from "react-icons/tb";

const BookingDetails = () => {
  const { customers, loading, error } = useSelector((state) => state.customers);
  const { selectedGame, status: gameStatus, error: gameError } = useSelector((state) => state.games);

  const { slot, loading: slotLoading, error: slotError } = useSelector((state) => state.slots);
  const { items } = useSelector((state) => state.items);

  const [selectedIds, setSelectedIds] = useState([]);
  const [searchedCustomers, setSearchedCustomers] = useState([]);
  const [addOnTotal, setAddOnTotal] = useState(0);
  const [priceToPay, setPriceToPay] = useState(0);
  const [adjustment, setAdjustment] = useState("");
  const [options, setOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
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
  const [showClientModal, setShowClientModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Payment Options");
  const [selectedMethod, setSelectedMethod] = useState("Payment Options");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const isMobile = window.innerWidth <= 768;

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
    if (items.length > 0) {
      setOptions(items.map((item) => ({ value: item._id, label: `${item.name} (₹ ${item.sellingPrice})` })));
    }
  }, [items]);

  useEffect(() => {
    dispatch(getItems(cafeId));
    dispatch(getTaxFields(cafeId));
  }, [dispatch]);

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
    if (gameId || slotId) {
      if (slot?.slot_price) {
        if (addOnTotal > 0) {
          setPayableAmount(slot?.slot_price + addOnTotal)
          setPriceToPay(slot?.slot_price + addOnTotal)
        } else {
          setPayableAmount(slot?.slot_price)
          setPriceToPay(slot?.slot_price)
        }
      } else {
        if (addOnTotal > 0) {
          setPayableAmount(selectedGame?.data?.price + addOnTotal)
          setPriceToPay(selectedGame?.data?.price + addOnTotal)
        } else {
          setPayableAmount(selectedGame?.data?.price)
          setPriceToPay(selectedGame?.data?.price)
        }
      }
    }
  }, [dispatch, gameId, slotId, addOnTotal]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      let total = 0;
      selectedItems.map((item) => {
        total += item.total;
      })
      setAddOnTotal(total)
    }
  }, [selectedItems]);

  const handleChange = (selectedOption) => {
    let id = selectedOption.value;
    if (!id || selectedIds.includes(id)) return;

    setSelectedValue("");

    const selected = items.find(item => item._id === id);
    if (selected) {
      const totalTax = Math.round((selected.tax?.tax_rate * selected.sellingPrice) / 100) || 0;
      const total = selected.sellingPrice + totalTax || 0;
      setSelectedItems([...selectedItems, {
        id: selected._id,
        item: selected.name,
        price: selected.sellingPrice,
        quantity: 1,
        tax: selected.tax || null,
        total: total,
        totalTax: totalTax
      }]);
      setSelectedIds([...selectedIds, selected._id]);
      setSelectedOption(null)
    }
  };

  const updateProduct = (id, field, value) => {
    const updatedItems = selectedItems.map((product) => {
      if (product.id === id) {
        // const updatedQuantity = field === "quantity" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : product.quantity; // Ensure only numeric input
        const updatedQuantity = field === "quantity"
          ? parseInt(String(value).replace(/\D/g, ""), 10) || 0
          : product.quantity;

        const taxRate = product.tax?.tax_rate || 0;
        const totalTax = Math.round((taxRate * product.price * updatedQuantity) / 100);
        const total = product.price * updatedQuantity + totalTax;

        return {
          ...product,
          [field]: updatedQuantity,
          total,
          totalTax,
        };
      }
      return product;
    });

    setSelectedItems(updatedItems);
  };

  const handleAddPlayer = async () => {

    if (teamMembers.length >= selectedGame?.data?.players - 1) return alert(`You can add only ${selectedGame?.data?.players} players at a time`)
    const submittedData = new FormData();
    submittedData.append("cafe", cafeId);
    submittedData.append("name", newPlayer.name);
    submittedData.append("contact_no", newPlayer.contact_no);
    submittedData.append("creditEligibility", "No");
    submittedData.append("creditLimit", 0);

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

  const handleRemovePlayer = (playerId) => {
    const updatedTeamMembers = teamMembers.filter(player => player.id !== playerId);
    setTeamMembers(updatedTeamMembers);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (eventKey) => {
    setShowCreditModal(true)
    setSelectedOption(eventKey);
    if (eventKey === "Pay Later") {
      handlePayLater()
    }

    if (eventKey === "Online") {
      handleOnlinePayment()
    } else if (eventKey === "Offline") {
      handleCollectOffline()
    } else if (eventKey === "On Credit") {
      if (selectedGame?.data?.type === "Single") {
        if (selectedCustomer?.creditEligibility === "No") {
          alert("Customer is not eligible for credit")
          return
        } else if (selectedCustomer?.creditLimit - selectedCustomer?.creditAmount < priceToPay) {
          alert("Credit Limit Exceeded")
          return
        }
      }
      setShowOnCredit(true);
      setCreditAmount(priceToPay);
    }
  };

  useEffect(() => {
    if (creditAmount > 0 && selectedCustomer) {
      const allParticipants = [
        ...teamMembers,
        {
          ...selectedCustomer,
          id: selectedCustomer._id,
          isCustomer: true,
        },
      ];

      const customerRemainingLimit =
        selectedCustomer.creditLimit - (selectedCustomer.creditAmount || 0);

      let customerCredit = 0;
      if (
        selectedCustomer.creditEligibility === "Yes" &&
        customerRemainingLimit > 0
      ) {
        customerCredit = Math.min(creditAmount, customerRemainingLimit);
      }

      let remainingCredit = creditAmount - customerCredit;

      // Filter eligible team members (excluding customer)
      const eligibleTeamMembers = teamMembers.filter((member) => {
        const remainingLimit = member.creditLimit - (member.creditAmount || 0);
        return member.creditEligibility === "Yes" && remainingLimit > 0;
      });

      let totalAssignedToTeam = 0;
      const teamCredits = eligibleTeamMembers.map((member) => {
        const remainingLimit = member.creditLimit - (member.creditAmount || 0);
        const splitAmount = Math.floor(remainingCredit / eligibleTeamMembers.length);
        const creditToAssign = Math.min(splitAmount, remainingLimit);
        totalAssignedToTeam += creditToAssign;
        return {
          id: member.id,
          credit: creditToAssign,
        };
      });

      const allCredits = [];

      // Assign credit to selected customer first
      if (customerCredit > 0) {
        allCredits.push({
          id: selectedCustomer._id,
          credit: customerCredit,
        });
      }

      // Add team credits
      allCredits.push(...teamCredits);

      setPlayerCredits(allCredits);

      const totalAssignedCredit = customerCredit + totalAssignedToTeam;
      const remainingPayable = priceToPay - totalAssignedCredit;
      setPayableAmount(remainingPayable);
    }
  }, [creditAmount, teamMembers, selectedCustomer]);

  function convertTo12Hour(time) {
    const [hour, minute] = time.split(":");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  }

  const handleCollectOffline = async () => {
    if (!selectedCustomer) {
      window.alert("Please select a customer")
      return
    }
    if (selectedGame?.data?.type === "Multiplayer" && selectedCustomer && teamMembers.length < 1) {
      window.alert("Please add at least 2 players")
      return
    }

    const mappedItems = selectedItems.map((item) => ({
      ...item,
      tax_amt: item.totalTax
    }))

    let booking_type = "Regular"
    if (!slot._id) {
      booking_type = "Custom"
    }

    try {
      const bookingData = {
        cafe: cafeId,
        customer_id: selectedCustomer?._id,
        game_id: selectedGame?.data?._id,
        slot_id: slot?._id,
        mode: "Offline",
        status: "Paid",
        total: priceToPay,
        paid_amount: payableAmount,
        slot_date: newdate,
        players: teamMembers,
        playerCredits: playerCredits,
        items: mappedItems,
        custom_slot: slot,
        booking_type: booking_type,
      };
      if (showOnCredit) {
        let limit = selectedCustomer?.creditLimit - selectedCustomer?.creditAmount

        if (payableAmount > limit) {
          alert("Credit Limit Exceeded")
          return
        }
      }
      const response = await dispatch(addBooking(bookingData)).unwrap()
      navigate(`/admin/booking/checkout/${response?.data?._id}`)
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayLater = async () => {
    if (!selectedCustomer) {
      window.alert("Please select a customer")
      return
    }
    try {
      if (selectedGame?.data?.type === "Multiplayer" && selectedCustomer && teamMembers.length < 1) {
        window.alert("Please add at least 2 players")
        return
      }

      const mappedItems = selectedItems.map((item) => ({
        ...item,
        tax_amt: item.totalTax
      }))

      let booking_type = "Regular"
      if (!slot._id) {
        booking_type = "Custom"
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
        players: teamMembers,
        items: mappedItems,
        custom_slot: slot,
        booking_type: booking_type
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
    if (teamMembers.length >= selectedGame?.data?.players - 1) {
      alert(`You can add only ${selectedGame?.data?.players} players at a time`);
      return
    }
    setSearchCustTerm("");
    setSearchedCustomers([]);

    let isAlreadyAdded = teamMembers.some(
      (member) => member.id === customer._id
    ) || selectedCustomer?._id === customer._id;

    // isAlreadyAdded = selectedCustomer._id === customer._id

    if (!isAlreadyAdded) {
      setTeamMembers([...teamMembers,
      {
        id: customer._id,
        name: customer.name,
        contact_no: customer.contact_no,
        creditEligibility: customer.creditEligibility,
        creditLimit: customer.creditLimit,
        creditAmount: customer.creditAmount,
      }]);
    } else {
      alert("Customer is already added!");
    }
  };

  const handlePayableAmountChange = (e) => {
    const inputValue = parseFloat(e.target.value);

    const newPayableAmount = Math.max(0, Math.min(priceToPay, inputValue || 0));
    const newCreditAmount = priceToPay - newPayableAmount;

    setPayableAmount(newPayableAmount);
    setCreditAmount(newCreditAmount);
  };

  const handleCreditChange = (id, newCredit) => {
    const updatedCredit = Math.max(0, Math.round(parseFloat(newCredit) || 0));
    setPlayerCredits((prevCredits) => {
      // Combine all participants
      const allParticipants = [
        ...teamMembers,
        {
          ...selectedCustomer,
          id: selectedCustomer._id,
          isCustomer: true,
        },
      ];

      // Find the matching participant
      const member = allParticipants.find((m) => m.id === id);
      if (!member) return prevCredits;

      // Clamp the credit to their remaining credit limit
      const remainingLimit = member.creditLimit - (member.creditAmount || 0);
      const clampedCredit = Math.min(updatedCredit, remainingLimit);

      // Update only this player's credit in the array
      return prevCredits.map((player) =>
        player.id === id ? { ...player, credit: clampedCredit } : player
      );
    });
  };

  const handleOnlinePayment = async () => {
    if (!selectedCustomer) {
      window.alert("Please select customer")
      return
    }
    try {
      if (selectedGame?.data?.type === "Multiplayer" && selectedCustomer && teamMembers.length < 1) {
        window.alert("Please add at least 2 players")
        return
      }

      const mappedItems = selectedItems.map((item) => ({
        ...item,
        tax_amt: item.totalTax
      }))

      let booking_type = "Regular"
      if (!slot._id) {
        booking_type = "Custom"
      }

      // Step 1: Create Razorpay Order FIRST (before creating booking)
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
      if (!data.success || !data.order) {
        console.error("Failed to create Razorpay order");
        return;
      }

      // Step 2: Set up Razorpay Payment Options
      const options = {
        key: import.meta.env.VITE_RAZOR_LIVE_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Lockene Inc",
        description: "Game Booking",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Step 3: Create Booking ONLY if Payment is Successful
            const bookingData = {
              cafe: cafeId,
              customer_id: selectedCustomer?._id,
              game_id: selectedGame?.data?._id,
              slot_id: slot?._id,
              mode: "Online",
              status: "Paid",
              total: priceToPay,
              paid_amount: payableAmount,
              playerCredits: playerCredits,
              slot_date: newdate,
              players: teamMembers,
              items: mappedItems,
              custom_slot: slot,
              booking_type: booking_type,
            };

            const result = await dispatch(addBooking(bookingData)).unwrap();

            // Step 4: Verify Payment
            const verifyResponse = await fetch(`${backend_url}/admin/booking/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({
                customer_id: selectedCustomer?._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: result?.data?._id,
                amount: data.order.amount,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              navigate(`/admin/booking/checkout/${result?.data?._id}`);
            } else {
              await dispatch(deleteBooking(result?.data?._id)); // Remove booking if verification fails
              alert("Payment Verification Failed");
            }
          } catch (error) {
            console.error("Booking creation error:", error);
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
        modal: {
          escape: true, // Allow closing on ESC
          ondismiss: function () {
            // No booking should be created if payment was closed
          },
        },
      };

      // Step 5: Open Razorpay Payment Modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid grey',
      borderRadius: '8px',
      cursor: 'pointer',
      padding: '2px',
      boxShadow: 'none',
      '&:hover': {
        border: 'none'
      }
    }),
    // Optional: adjust dropdown indicator and other parts if needed
  };

  return (
    <Container fluid className="p-4">
      <h6 className="mb-3 muted-text">
        Home / Bookings/{" "}
        <span className="text-primary">Booking Details</span>
      </h6>
      <Row>
        <Col style={{ height: "100%" }} className="px-0 px-md-2" md={4} lg={3}>
          <div className="d-flex gap-3 zero-gap">
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

            {searchTerm.length > 2 && filteredCustomers.length > 0 && (<>
              {/* Mobile View */}
              <ul className="list-group position-absolute d-block d-md-none shadow bg-white mt-7 ms-7" style={{ width: "65%" }}>
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    className="py-2 px-2 list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIsExpanded(true);
                      setSelectedCustomer(customer);
                      setSearchTerm('');
                    }}
                  >
                    {customer.name} - {customer.contact_no}
                  </li>
                ))}
              </ul>
            </>)}

            <Button
              variant="white"
              className="mb-3 rounded border d-flex align-items-center gap-2"
              onClick={() => setShowClientModal(true)}
            >
              <BsPlus size={20} />
            </Button>
          </div>

          {searchTerm.length > 2 && filteredCustomers.length > 0 && (<>
            <ListGroup className="position-absolute d-none d-md-block shadow bg-white z-index-100" style={{ width: "18%" }}>

              {filteredCustomers.map((customer) => (
                <ListGroup.Item
                  key={customer.id}
                  style={{ cursor: "pointer" }}
                  action
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setSearchTerm('')
                  }}
                >
                  {customer.name} - {customer.contact_no}
                </ListGroup.Item>
              ))}
            </ListGroup>

            {/* Mobile View */}
            <ListGroup className="position-absolute shadow bg-white" style={{ width: "80%" }}>
              {/* 
              {filteredCustomers.map((customer) => (
                <ListGroup.Item
                  key={customer.id}
                  style={{ cursor: "pointer" }}
                  action
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setSearchTerm('')
                  }}
                >
                  {customer.name} - {customer.contact_no}
                </ListGroup.Item>
              ))} */}
            </ListGroup>
          </>)}

          <ClientModel
            show={showClientModal}
            handleClose={() => setShowClientModal(false)}
          />

          <div className="bg-white d-none d-md-block rounded-3 p-3 responsive-height mt-1">
            <div className="customer-list">
              <small>Recent Customers </small>
              {!selectedCustomer ? (
                filteredCustomers.length > 0 ?
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
                        <small className="muted-text">
                          {customer.email || customer.phone}
                        </small>
                      </div>
                    </div>
                  )) : <div className="text-center mt-4">No customers available</div>
              ) : (
                <>
                  <div className="d-flex align-items-center p-2 mb-2 rounded" style={{ background: "#F4F4F4" }}>
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
                      <small className="muted-text">
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
                          const name = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
                          setNewPlayer({ ...newPlayer, name });
                          setSearchCustTerm(name);
                        }}
                      />

                      {searchedCustomers.length > 0 && (
                        <ul className="absolute top-full w-full bg-white border rounded shadow-md max-h-40 overflow-y-auto z-10">
                          {searchedCustomers.map((customer, index) => (
                            <li
                              key={index}
                              onClick={() => handleSelectCustomer(customer)}
                              className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                              style={{ cursor: "pointer" }}
                            >
                              {customer?.name} - {customer?.contact_no}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Form.Control
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter contact number"
                        maxLength={10}
                        value={newPlayer.contact_no}
                        onChange={(e) => {
                          const contact_no = e.target.value.replace(/\D/g, ""); // Allow only numeric input
                          setNewPlayer({ ...newPlayer, contact_no });
                        }}
                      />
                      <Button variant="primary" onClick={handleAddPlayer}>
                        Add
                      </Button>
                    </div>
                  ) : (
                    selectedGame?.data?.type === "Multiplayer" ? <Button
                      variant="outline-primary"
                      className="d-flex w-100 align-items-center justify-content-center p-1 border-dashed"
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
                      <h5 className="text-color">No of Candidates  ({teamMembers.length + 1})</h5>
                      {teamMembers.map((player, index) => (
                        <p key={index} className="mt-4">
                          {player.name} - {player.contact_no}
                          <span
                            className="float-end"
                          >
                            <RxCross2 size={20} className="text-danger pointer" onClick={() => handleRemovePlayer(player.id)} />
                          </span>
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-white d-block d-md-none rounded-3 p-3">
            {!isExpanded ? (
              <div className="d-flex justify-content-between align-items-center">
                <small>Select Customer</small>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                >
                  <BsPlus size={20} />
                </Button>
              </div>
            ) : (
              <div className="customer-list" style={{ maxHeight: selectedCustomer ? 'auto' : '200px', overflowY: 'auto' }}>
                {/* Sticky header when no customer is selected */}
                {!selectedCustomer && (
                  <div
                    className="sticky-top bg-white pt-2 pb-1 mb-1"
                    style={{
                      zIndex: 1,
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="fw-bold">Recent Customers</small>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0"
                        onClick={() => {
                          setIsExpanded(false);
                          setSelectedCustomer(null);
                        }}
                      >
                        <RxCross2 size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Customer list content */}
                {!selectedCustomer ? (
                  filteredCustomers.length > 0 ? (
                    <div style={{ marginTop: '0.5rem' }}>
                      {filteredCustomers.map((customer, index) => (
                        <div
                          key={index}
                          className={`d-flex align-items-center p-2 mb-2 cursor-pointer hover-bg-light rounded ${selectedCustomer === customer ? "bg-light" : ""
                            }`}
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsExpanded(true);
                          }}
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
                            <small className="muted-text">
                              {customer.email || customer.phone}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center mt-4">No customers available</div>
                  )
                ) : (
                  <>
                    {/* Selected customer view */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small>{selectedCustomer ? "Selected Customer" : "Recent Customers"}</small>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setIsExpanded(false);
                          setSelectedCustomer(null);
                        }}
                      >
                        <RxCross2 size={16} />
                      </Button>
                    </div>

                    <div className="d-flex align-items-center p-2 mb-2 rounded" style={{ background: "#F4F4F4" }}>
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
                        <small className="muted-text">
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
                            const name = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                            setNewPlayer({ ...newPlayer, name });
                            setSearchCustTerm(name);
                          }}
                        />

                        {searchedCustomers.length > 0 && (
                          <ul className="list-unstyled bg-white border rounded shadow-sm max-h-40 overflow-y-auto">
                            {searchedCustomers.map((customer, index) => (
                              <li
                                key={index}
                                onClick={() => handleSelectCustomer(customer)}
                                className="p-2 hover-bg-primary hover-text-white cursor-pointer"
                                style={{ cursor: "pointer" }}
                              >
                                {customer?.name} - {customer?.contact_no}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Form.Control
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Enter contact number"
                          maxLength={10}
                          value={newPlayer.contact_no}
                          onChange={(e) => {
                            const contact_no = e.target.value.replace(/\D/g, "");
                            setNewPlayer({ ...newPlayer, contact_no });
                          }}
                        />
                        <Button variant="primary" onClick={handleAddPlayer}>
                          Add
                        </Button>
                      </div>
                    ) : (
                      selectedGame?.data?.type === "Multiplayer" && (
                        <Button
                          variant="outline-primary"
                          className="d-flex w-100 align-items-center justify-content-center p-1 border-dashed"
                          style={{
                            border: "2px dashed #007bff",
                            borderRadius: "10px",
                            color: "#007bff",
                            fontWeight: "bold",
                            backgroundColor: "transparent",
                          }}
                          onClick={() => setShowInput(true)}
                        >
                          <BsPlus className="me-2" size={20} />
                          Add Players
                        </Button>
                      )
                    )}

                    {teamMembers.length > 0 && (
                      <div className="mt-3 mx-2">
                        <h5 className="text-color">No of Candidates ({teamMembers.length + 1})</h5>
                        {teamMembers.map((player, index) => (
                          <div key={index} className="mt-2 d-flex justify-content-between align-items-center">
                            <span>
                              {player.name} - {player.contact_no}
                            </span>
                            <RxCross2
                              size={16}
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRemovePlayer(player.id)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Col>

        <Col md={4} lg={4} className="p-1" style={{ height: "90vh" }}>
          <Row>
            <Col md={12} className="d-none d-md-block" style={{ height: "9vh" }}></Col>
            <Col md={12}>
              <div
                style={{ minHeight: selectedCustomer ? "60%" : "50%" }}
                className="bg-white rounded-3 p-1 mb-2 position-relative"
              >
                <div className="px-3">
                  <div className="py-2">
                    <span className="text-color">Credit Limit</span>
                    <span
                      style={{ background: "#03D41414", color: "#00AF0F" }}
                      className="float-end rounded-pill px-2 py-1"
                    >
                      <LiaCoinsSolid size={25} />
                      {selectedCustomer?.creditLimit - selectedCustomer?.creditAmount || 0}/{selectedCustomer?.creditLimit || 0}
                    </span>
                  </div>

                  <>
                    <Row className="mb-2">
                      <Col xs={6} className="muted-text"></Col>
                      <Col xs={6} className="text-color"></Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={6} className="text-color">Customer Name:</Col>
                      <Col xs={6} className="muted-text">{selectedCustomer?.name || ""}</Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={6} className="text-color">Booked Game:</Col>
                      <Col xs={6}>
                        <span className="text-primary fw-bold">
                          {selectedGame?.data?.name} ({selectedGame?.data?.size})
                        </span>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={6} className="text-color">Day & Time:</Col>
                      <Col xs={6} className="muted-text">
                        {formattedDate} - {slot?.start_time && convertTo12Hour(slot?.start_time)}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={6} className="text-color">Contact:</Col>
                      <Col xs={6} className="muted-text">
                        {selectedCustomer?.contact_no || ""}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={6} className="text-color">No of Candidates:</Col>
                      <Col xs={6} className="muted-text">
                        {selectedGame?.data?.type === "Multiplayer" ? teamMembers.length + 1 : 1}            </Col>
                    </Row>
                  </>
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className="d-none d-md-flex gap-0 rounded-2" style={{ minHeight: "54vh" }}>
                <div className="bg-white p-4 w-100 border-end border-2 rounded-3" style={{ minHeight: "65%" }}>
                  <>
                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">Game Price:</span>
                      <span className="muted-text">₹ {slot?.slot_price ? slot.slot_price : selectedGame?.data?.price}</span>
                    </div>

                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">Items Total:</span>
                      <span className="muted-text">₹ {addOnTotal}</span>
                    </div>

                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">Extra Charge:</span>
                      <span className="muted-text">₹ 00.00</span>
                    </div>

                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">TOTAL:</span>
                      <span className="text-primary fw-bold">₹ {priceToPay}</span>
                    </div>

                    <div className="mb-4">
                      <Dropdown onSelect={handleSelect} className="w-100">
                        <Dropdown.Toggle style={{ background: "#00B72BCC", color: "white", border: "none" }} id="dropdown-basic" className="w-100 text-center">
                          {selectedMethod}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100" style={{ background: "e6e3e7", color: "white", border: "none" }}>
                          {!selectedGame?.data?.payLater && (<Dropdown.Item eventKey="Online">Online</Dropdown.Item>)}
                          {!selectedGame?.data?.payLater && (<Dropdown.Item eventKey="Offline">Cash</Dropdown.Item>)}
                          {selectedGame?.data?.payLater && (
                            <Dropdown.Item eventKey="Pay Later">Pay Later</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </>
                </div>
              </div>

              {/* mobile view */}
              <div className="d-flex d-md-none gap-0 rounded-2">
                <div className="bg-white p-4 w-100 border-end border-2 rounded-3" style={{ minHeight: "57%" }}>
                  <>
                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">Game Price:</span>
                      <span className="muted-text">₹ {slot?.slot_price ? slot.slot_price : selectedGame?.data?.price}</span>
                    </div>

                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">Items Total:</span>
                      <span className="muted-text">₹ {addOnTotal}</span>
                    </div>

                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">Extra Charge:</span>
                      <span className="muted-text">₹ 00.00</span>
                    </div>

                    <div className="mb-5 d-flex justify-content-between">
                      <span className="text-color">TOTAL:</span>
                      <span className="text-primary fw-bold">₹ {priceToPay}</span>
                    </div>

                    <div className="mb-4">
                      <Dropdown onSelect={handleSelect} className="w-100">
                        <Dropdown.Toggle style={{ background: "#00B72BCC", color: "white", border: "none" }} id="dropdown-basic" className="w-100 text-center">
                          {selectedMethod}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100" style={{ background: "e6e3e7", color: "white", border: "none" }}>
                          {!selectedGame?.data?.payLater && (<Dropdown.Item eventKey="Online">Online</Dropdown.Item>)}
                          {!selectedGame?.data?.payLater && (<Dropdown.Item eventKey="Offline">Cash</Dropdown.Item>)}
                          {selectedGame?.data?.payLater && (
                            <Dropdown.Item eventKey="Pay Later">Pay Later</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </>
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Add On's */}
        <Col md={4} lg={5} className="p-1">
          <Row>
            <Col md={12}>
              <Card className="mb-2 p-1">
                <Select
                  options={options}
                  onChange={handleChange}
                  isSearchable
                  value={selectedOption}
                  placeholder="Select for add on's..."
                  styles={customStyles}
                />
              </Card>
            </Col>

            <Col md={12} style={{ marginTop: "8px" }}>
              <div className="bg-white rounded-3 p-0 d-flex flex-column" style={{ height: isMobile ? "auto" : "90vh" }}>
                {/* Scrollable Content */}
                <div
                  style={{
                    overflowY: "auto",
                    flex: "1",
                    padding: "12px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  className="hide-scrollbar"
                >
                  <div className="fs-4 text-color mx-2">Items ({selectedItems?.length})</div>
                  <div>
                    {selectedItems.map((product, index) => (
                      <>
                        <div
                          key={index}
                          className="position-relative d-none d-md-flex mb-2 border-bottom border-2"
                          style={{ width: "100%", background: '#F9F9F9' }}
                        >
                          {/* Product Card */}
                          <div
                            className="fs-6"
                            style={{ background: "#F9F9F9", width: "100%", padding: "12px", height: "10%" }}
                          >
                            <div className="d-flex justify-content-between align-items-center p-2">
                              {/* Product Info */}
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    maxHeight: "20px",
                                    overflowY: "auto",
                                    scrollbarWidth: "none", // Firefox
                                    msOverflowStyle: "none", // IE
                                    color: "#333333",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                  }}
                                  onWheel={(e) => e.stopPropagation()}
                                >
                                  {product.item}
                                </div>
                                <div className="muted-text small mb-1">₹{product.price} each</div>
                              </div>

                              {/* Quantity Controls */}
                              <div style={{ flex: 1 }}>
                                <div className="d-flex align-items-center gap-1">
                                  <Button
                                    variant="light"
                                    size="sm"
                                    onClick={() =>
                                      updateProduct(
                                        product.id,
                                        "quantity",
                                        Math.max(0, Number(product.quantity) - 1)
                                      )
                                    }
                                  >
                                    −
                                  </Button>

                                  <input
                                    type="number"
                                    min="0"
                                    value={product.quantity}
                                    style={{
                                      width: "50px",
                                      height: "28px",
                                      fontSize: "12px",
                                      textAlign: "center",
                                      padding: "2px 4px",
                                      border: "1px solid #ccc",
                                    }}
                                    onChange={(e) =>
                                      updateProduct(product.id, "quantity", Number(e.target.value))
                                    }
                                  />

                                  <Button
                                    variant="light"
                                    size="sm"
                                    onClick={() =>
                                      updateProduct(
                                        product.id,
                                        "quantity",
                                        Number(product.quantity) + 1
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>

                              {/* Tax & Total */}
                              <div className="text-end ms-3" style={{ minWidth: "120px" }}>
                                <div className="">
                                  Tax ({product?.tax?.tax_rate || 0}%):{" "}
                                  <span className="fw-semibold">₹{product.totalTax}</span>
                                </div>
                                <div className="fw-semibold">Total: ₹{product.total}</div>
                              </div>
                            </div>
                            <div className="text-end">
                              {/* Trash Icon */}
                              <span
                                className=""
                                style={{
                                  top: "20px",
                                  right: "10px",
                                  color: "red",
                                }}
                                onClick={() => {
                                  const updatedProducts = selectedItems.filter((_, i) => i !== index);
                                  setSelectedItems(updatedProducts);

                                  const updatedSelectedIds = selectedIds.filter((id) => id !== product.id);
                                  setSelectedIds(updatedSelectedIds);

                                  // Recalculate the addOnTotal
                                  const newTotal = updatedProducts.reduce((sum, item) => sum + item.total, 0);
                                  setAddOnTotal(newTotal);

                                  // Update the payable amount if needed
                                  setPayableAmount((prevPayable) => prevPayable - product.total);
                                }}
                              >
                                <TbTrash
                                  style={{
                                    top: "15px",
                                    right: "-30px",
                                    zIndex: 2,
                                    cursor: "pointer"
                                  }}
                                  size={20}
                                />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Product Card */}
                        <div
                          className="fs-6 d-bock d-md-none"
                          style={{ background: "#F9F9F9", width: "100%", padding: "8px", height: "8%", borderBottom: "1px solid #ddd" }}
                        >
                          <div className="d-flex justify-content-between align-items-center px-2 py-0">
                            {/* Product Info */}
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  maxHeight: "20px",
                                  overflowY: "auto",
                                  scrollbarWidth: "none", // Firefox
                                  msOverflowStyle: "none", // IE
                                  color: "#333333",
                                  fontWeight: "500",
                                  fontSize: "14px",
                                }}
                                onWheel={(e) => e.stopPropagation()}
                              >
                                {product.item}
                              </div>
                              <div className="muted-text small mb-1">₹{product.price} each</div>
                            </div>

                            {/* Quantity Controls */}
                            <div style={{ flex: 1 }}>
                              <div className="d-flex align-items-center gap-1 ms-2">
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() =>
                                    updateProduct(
                                      product.id,
                                      "quantity",
                                      Math.max(0, Number(product.quantity) - 1)
                                    )
                                  }
                                >
                                  −
                                </Button>

                                <input
                                  type="number"
                                  min="0"
                                  value={product.quantity}
                                  style={{
                                    width: "50px",
                                    height: "28px",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "2px 4px",
                                    border: "1px solid #ccc",
                                  }}
                                  onChange={(e) =>
                                    updateProduct(product.id, "quantity", Number(e.target.value))
                                  }
                                />

                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() =>
                                    updateProduct(
                                      product.id,
                                      "quantity",
                                      Number(product.quantity) + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            {/* Tax & Total */}
                            <div className="text-center" style={{ minWidth: "120px" }}>
                              <div className="">
                                Tax ({product?.tax?.tax_rate || 0}%):{" "}
                                <span className="fw-semibold">₹{product.totalTax}</span>
                              </div>
                              <div className="fw-semibold">Total: ₹{product.total}</div>
                            </div>
                               <span
                              className="mx-2"
                              style={{
                                top: "20px",
                                right: "10px",
                                color: "red",
                              }}
                              onClick={() => {
                                const updatedProducts = selectedItems.filter((_, i) => i !== index);
                                setSelectedItems(updatedProducts);

                                const updatedSelectedIds = selectedIds.filter((id) => id !== product.id);
                                setSelectedIds(updatedSelectedIds);

                                // Recalculate the addOnTotal
                                const newTotal = updatedProducts.reduce((sum, item) => sum + item.total, 0);
                                setAddOnTotal(newTotal);

                                // Update the payable amount if needed
                                setPayableAmount((prevPayable) => prevPayable - product.total);
                              }}
                            >
                              <TbTrash
                                style={{
                                  top: "15px",
                                  right: "-30px",
                                  zIndex: 2,
                                  cursor: "pointer"
                                }}
                                size={20}
                              />
                            </span>
                          </div>
                          {/* <div className="text-end"> */}
                            {/* Trash Icon */}
                         
                         
                          {/* </div> */}
                        </div>
                      </>
                    ))}
                  </div>
                </div>

                {/* Sticky Bottom */}
                <div
                  style={{
                    padding: "8px 12px",
                    borderTop: "1px solid #ddd",
                    fontWeight: "600",
                    textAlign: "right",
                    background: "#fff",
                    borderRadius: "0 0 10px 10px",
                  }}
                >
                  <span>Total: ₹ {addOnTotal}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingDetails;
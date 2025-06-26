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
    Dropdown,
    ListGroup,
    Card,
    Spinner,
} from "react-bootstrap";
import { addCustomer, getCustomers, searchCustomers } from "../../../store/AdminSlice/CustomerSlice";
import profile_pic from "/assets/profile/user_avatar.jpg";
import { BsSearch, BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getGameById, getGames } from "../../../store/slices/gameSlice";
import { getSlotDetails, getslots } from "../../../store/slices/slotsSlice";
import { addBooking, deleteBooking, getBookingDetails, getBookingsByDate, updateBooking } from "../../../store/AdminSlice/BookingSlice";
import ClientModel from "./Model/ClientModel";
import { IoAdd } from "react-icons/io5";
import { FaDeleteLeft } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { BiLoaderCircle } from "react-icons/bi";

const BookingEdit = () => {

    const { id } = useParams();
    const { customers, loading, error } = useSelector((state) => state.customers);
    const booking = useSelector((state) => state.bookings.booking);
    const { bookings } = useSelector((state) => state.bookings);
    const { slots } = useSelector((state) => state.slots);

    const [selectedGame, setSelectedGame] = useState({});
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const [searchedCustomers, setSearchedCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [priceToPay, setPriceToPay] = useState(0);
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
    const [showClientModal, setShowClientModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Payment Options");
    const [filteredSlots, setFilteredSlots] = useState([]);

    const backend_url = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const cafeId = user?._id;

    const { gameId, slotId } = useParams();
    const { games, status } = useSelector((state) => state.games);

    const dateString = date;
    const newdate = new Date(dateString);

    const formattedDate = newdate.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).replace(",", "");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?._id) {
            dispatch(getGames(user?._id));
        }
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(getBookingDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (date) {
            dispatch(getBookingsByDate({ cafeId, date }));
        }
    }, [dispatch, date]);

    useEffect(() => {
        if (selectedGame) {
            dispatch(getslots(selectedGame?._id));
        }
    }, [dispatch, selectedGame]);

    useEffect(() => {
        if (date && slots.length > 0) {
            const selectedDay = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
            const availableSlots = slots.filter(slot => slot.day === selectedDay)
                .sort((a, b) => {
                    const [aH, aM] = a.start_time.split(":").map(Number);
                    const [bH, bM] = b.start_time.split(":").map(Number);
                    return aH !== bH ? aH - bH : aM - bM;
                })
            setFilteredSlots(availableSlots)
        }
    }, [date, slots]);

    useEffect(() => {
        if (booking) {
            const mappedPlayers = booking?.players?.map((player) => ({
                id: player?._id,
                name: player?.name,
                contact_no: player?.contact_no,
                creditEligibility: player?.creditEligibility,
                creditLimit: player.creditLimit,
                creditAmount: player.creditAmount,
            }));
            const isoDate = booking?.slot_date;
            const dateOnly = new Date(isoDate).toISOString().split("T")[0];
            setSelectedGame(booking?.game_id);
            setDate(dateOnly);
            setSelectedCustomer(booking?.customer_id);
            setSlot(booking?.slot_id);
            setTeamMembers(mappedPlayers);

        }
    }, [booking]);

    useEffect(() => {
        if (cafeId) {
            dispatch(getCustomers(cafeId));
        }
    }, [dispatch]);

    useEffect(() => {
        if (gameId) {
            dispatch(getGameById(gameId));
            dispatch(getslots(gameId));
        }
        if (slotId) {
            dispatch(getSlotDetails({ id: slotId }));
        }
        if (gameId || slotId) {
            if (slot?.slot_price) {
                setPayableAmount(slot?.slot_price)
                setPriceToPay(slot?.slot_price)
            } else {
                setPayableAmount(selectedGame?.price)
                setPriceToPay(selectedGame?.price)
            }
        }
    }, [dispatch, gameId, slotId]);


    useEffect(() => {
        if (slot) {
            if (slot?.slot_price) {
                setPayableAmount(slot?.slot_price)
                setPriceToPay(slot?.slot_price)
            } else {
                setPayableAmount(selectedGame?.price)
                setPriceToPay(selectedGame?.price)
            }
        }
    }, [dispatch, slot]);

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

    const handleRemovePlayer = (playerId) => {
        const updatedTeamMembers = teamMembers.filter(player => player.id !== playerId);
        setTeamMembers(updatedTeamMembers);
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

        let isAlreadyAdded = teamMembers?.some(
            (member) => member?.contact_no === customer?.contact_no
        );

        isAlreadyAdded = selectedCustomer?.contact_no === customer?.contact_no

        if (!isAlreadyAdded) {
            setTeamMembers([...teamMembers, { id: customer?._id, name: customer?.name, contact_no: customer?.contact_no }]);
        } else {
            alert("Customer is already added!");
        }
    };

    const handleUpdateSlot = async () => {
        try {
            setIsLoading(true);
            const updatedData = {
                game_id: selectedGame?._id,
                slot_date: date,
                players: teamMembers,
                total: payableAmount,
                customer_id: selectedCustomer?._id,
                slot_id: slot?._id,
            };

            await dispatch(updateBooking({ id: booking?._id, updatedData: updatedData })).unwrap();
            setIsLoading(false);
            // navigate("/admin/bookings");

        } catch (error) {
            setIsLoading(false);
            console.error("Error updating booking:", error);
        }
    }

    const sortSlotsByTime = (slots) => {
        const convertTo24HourMinutes = (timeStr) => {
            let [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "PM" && hours !== 12) {
                hours += 12;
            }
            if (modifier === "AM" && hours === 12) {
                hours = 0;
            }
            return hours * 60 + minutes;
        };

        return slots.sort((a, b) => {
            const aStart = convertTo24HourMinutes(a.start_time);
            const bStart = convertTo24HourMinutes(b.start_time);
            return aStart - bStart;
        });
    };

    return (
        <Container fluid className="p-4 ">
            <h6 className="mb-3 muted-text">
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
                                            <small className="muted-text">
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
                                        selectedGame?.type === "Multiplayer" ? <Button
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
                                                    {player.name} - {player.contact_no} <span className="float-end"><RxCross2 size={20} className="text-danger" onClick={() => handleRemovePlayer(player.id)} /></span>
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
                        style={{ height: "auto" }}
                        className="bg-white rounded-3 p-4 mb-4 position-relative"
                    >
                        <div className="px-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="text-color">Customer Details</h3>
                                </div>
                                <div>
                                    <div><span className="text-color float-end">Credit Limit: {selectedCustomer?.creditLimit || 0}</span></div>
                                    <div><span className="text-color float-end">Remaining: {selectedCustomer?.creditLimit - selectedCustomer?.creditAmount || 0}</span></div>
                                </div>
                            </div>
                            {selectedCustomer ? (

                                <Card className="p-2 shadow-sm border-0">
                                    <Row className="g-4">
                                        <Col md={6}>
                                            <Card className="p-3 bg-light">
                                                <h6 className="muted-text">Customer Name</h6>
                                                <p className="text-color mb-0">{selectedCustomer.name}</p>
                                            </Card>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-color">Select Game</Form.Label>
                                                <Form.Select
                                                    size="sm"
                                                    className="border-2"
                                                    value={selectedGame ? JSON.stringify(selectedGame) : ""}
                                                    onChange={(e) => setSelectedGame(JSON.parse(e.target.value))}
                                                >
                                                    <option value="">Select Game</option>
                                                    {games.map((game, index) => (
                                                        <option key={index} value={JSON.stringify(game)}>
                                                            {game.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        {/* Booked Game */}
                                        <Col md={6}>
                                            <Card className="p-3 bg-light">
                                                <h6 className="muted-text">Booked Game</h6>
                                                <p className="text-primary text-color mb-0">
                                                    {selectedGame?.name} ({selectedGame?.size})
                                                </p>
                                            </Card>
                                        </Col>

                                        {/* Date & Time */}
                                        <Col md={6}>
                                            <Card className="p-3 bg-light">
                                                <h6 className="muted-text">Day & Time</h6>
                                                <p className="text-color mb-0">
                                                    {formattedDate} - {convertTo12Hour(slot.start_time)}
                                                </p>
                                            </Card>
                                        </Col>

                                        {/* Date Picker */}
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-color">Select Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={date}
                                                    min={new Date().toISOString().split("T")[0]} // Prevent backdates
                                                    onChange={(e) => setDate(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>

                                            <Form.Group>
                                                <Form.Label className="text-color">Select Slot</Form.Label>
                                                <Form.Select
                                                    size="sm"
                                                    className="border-2"
                                                    value={slot ? slot?._id : ""}
                                                    onChange={(e) => {
                                                        const selectedSlot = filteredSlots.find(s => s?._id === e.target.value);

                                                        if (selectedSlot) {
                                                            const convertTo24Hour = (time12h) => {
                                                                const [time, modifier] = time12h.split(' ');
                                                                let [hours, minutes] = time.split(':');
                                                                hours = parseInt(hours, 10);

                                                                if (modifier === 'PM' && hours !== 12) {
                                                                    hours += 12;
                                                                }
                                                                if (modifier === 'AM' && hours === 12) {
                                                                    hours = 0;
                                                                }

                                                                return `${hours.toString().padStart(2, '0')}:${minutes}`;
                                                            };

                                                            const updatedSlot = {
                                                                ...selectedSlot,
                                                                start_time: convertTo24Hour(selectedSlot.start_time),
                                                                end_time: convertTo24Hour(selectedSlot.end_time)
                                                            };

                                                            setSlot(updatedSlot);
                                                        }
                                                    }}

                                                >
                                                    {filteredSlots.length > 0 ? <option value="">Select Slot</option> : <option>No slots available</option>}
                                                    {filteredSlots.map((slot, index) => {
                                                        const isBooked = bookings.some(
                                                            (booking) =>
                                                                booking?.slot_id?._id === slot?._id &&
                                                                booking?.slot_date.startsWith(date)
                                                        );
                                                        return (
                                                            <option key={index} value={slot?._id} disabled={isBooked}>
                                                                {slot?.start_time} - {slot?.end_time} {isBooked ? "(Booked)" : ""}
                                                            </option>
                                                        );
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card>
                            ) : (
                                <p className="muted-text d-flex justify-content-center align-items-center h-100 w-100 mb-0">
                                    Select Customers
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3">
                        <div className="p-3 text-color fs-1 ">
                            Checkout Details
                        </div>

                        <div>
                            {selectedCustomer ? (
                                <div className="px-4">
                                    <div className="mb-4">
                                        <h5 className="muted-text">Total Amount</h5>
                                        <p className="text-black">₹ {priceToPay}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h5 className="muted-text">Extra Charge</h5>
                                        <p className="text-black">₹ 00.00</p>
                                    </div>
                                    <div className="mb-4">
                                        <h5 className="muted-text">GST</h5>
                                        <p className="text-black">₹ 00.00</p>
                                    </div>
                                    <div className="mb-4">
                                        <h5 className="muted-text">TOTAL</h5>
                                        <p className="text-primary" style={{ fontWeight: "bold" }}>₹ {slot.slot_price ? slot.slot_price : selectedGame?.price}</p>
                                    </div>
                                    <div className="mb-4">
                                        <Button
                                            variant="success"
                                            className="w-25 mb-4"
                                            onClick={handleUpdateSlot}
                                        >
                                            Save
                                            {isLoading && <Spinner className="ms-2" animation="border" size="sm" />}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="muted-text d-flex justify-content-center align-items-center h-100 w-100 mb-0">
                                    Select Customers
                                </p>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container >
    );
};

export default BookingEdit;
import React, { useState, useEffect, useRef } from "react";
import {
    Row,
    Col,
    Table,
    Button,
    InputGroup,
    FormControl,
} from "react-bootstrap";
import {
    FaEdit,
    FaSearch,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGameById } from "../../../store/slices/gameSlice";
import { getBookings } from "../../../store/AdminSlice/BookingSlice";
import profile from "/assets/profile/user_avatar.jpg";

const BookingList = () => {
    const { gameId } = useParams();
    const dispatch = useDispatch();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const { bookings } = useSelector((state) => state.bookings);

    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const filterDropdownRef = useRef(null);
    const bookingDropdownRef = useRef(null);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const editDropdownRef = useRef(null);


    useEffect(() => {
        if (cafeId) {
            dispatch(getBookings(cafeId));
        }
    }, [dispatch, cafeId]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleFilterDropdown = () => {
        setFilterDropdownOpen(!filterDropdownOpen);
    };

    // Effect to close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(event.target)
            ) {
                setFilterDropdownOpen(false);
            }
            if (
                bookingDropdownRef.current &&
                !bookingDropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
            if (
                editDropdownRef.current &&
                !editDropdownRef.current.contains(event.target)
            ) {
                setActiveDropdownId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterDropdownRef, bookingDropdownRef, editDropdownRef]);

    useEffect(() => {
        if (gameId) {
            dispatch(getGameById(gameId));
        }
    }, [dispatch, gameId]);

    const bookingOptions = [
        "Tomorrow Booking",
        "Yesterday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
    ];

    const filteredBookings = bookings?.filter((booking) =>
        booking?.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid min-vh-100">

            <Row>
                <Col>
                    <p>
                        <Link to="/admin/games/Bookings">Home/Games/Bookings</Link> /{" "}
                    </p>
                </Col>
            </Row>
            <Row
                className="mb-3 d-flex justify-content-between"
                style={{ backgroundColor: "transparent" }}
            >
                <Col xs={12} md={6}>
                    <div
                        onClick={toggleDropdown}
                        style={{
                            cursor: "pointer",
                            width: "fit-content",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "15px",
                        }}
                        ref={bookingDropdownRef}
                    >
                        <div>
                            <h4>Today's Bookings</h4>
                            <p>17 Bookings</p>
                        </div>
                        <div>{dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
                    </div>
                    {dropdownOpen && (
                        <ul className="dropdown-menu" style={{ display: "block" }}>
                            {bookingOptions.map((option, index) => (
                                <li
                                    key={index}
                                    style={{ cursor: "pointer", padding: "10px" }}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    )}
                </Col>
                <Col
                    xs={12}
                    md={6}
                    className="text-md-end d-flex flex-md-row justify-content-between align-items-center gap-3"
                    style={{ backgroundColor: "transparent" }}
                >
                    <InputGroup className="mb-2 mb-md-0">
                        <Button variant="outline-secondary">
                            <FaSearch
                                style={{
                                    fontSize: "20px",
                                    color: "#0062FF",
                                    marginRight: "10px",
                                }}
                            />
                        </Button>
                        <FormControl
                            placeholder="Search for Booking"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <div className="d-flex gap-3">
                        <FiFilter
                            onClick={toggleFilterDropdown}
                            style={{ fontSize: "20px", color: "#0062FF" }}
                        />
                        <IoAdd style={{ fontSize: "20px", color: "#0062FF" }} />
                    </div>
                    {filterDropdownOpen && (
                        <ul
                            ref={filterDropdownRef}
                            className="dropdown-menu"
                            style={{
                                top: "5rem",
                                right: "5rem",
                                display: "block",
                                position: "absolute",
                                zIndex: 1000,
                            }}
                        >
                            {[
                                "Snooker & Pool",
                                "Pickle Ball",
                                "Paddle Tennis",
                                "Play Station",
                                "Turf Cricket",
                                "Cafe",
                            ].map((sport, index) => (
                                <li
                                    key={index}
                                    style={{ cursor: "pointer", padding: "10px" }}
                                >
                                    {sport}
                                </li>
                            ))}
                        </ul>
                    )}
                </Col>
            </Row>

            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead
                        className="text-lowercase"
                        style={{ backgroundColor: "#0062FF0D" }}
                    >
                        <tr>
                            <th
                                style={{ border: "none", fontSize: "1rem", color: "black" }}
                            >
                                <small>Booking Id</small>
                            </th>
                            <th
                                style={{ border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Name
                            </th>
                            <th
                                style={{ border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Sports
                            </th>
                            <th
                                style={{ border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Persons
                            </th>
                            <th
                                style={{ border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Mode
                            </th>
                            <th
                                style={{ border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Time / Date
                            </th>
                            <th
                                style={{ border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings?.map((booking, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                                <td style={{ border: "none", minWidth: "100px" }}>
                                    {booking.booking_id}
                                </td>
                                <td style={{ border: "none", minWidth: "150px" }}>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={profile}
                                            alt={booking?.customerName}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "100%",
                                                marginRight: "10px",
                                            }}
                                        />
                                        <span>{booking?.customerName}</span>
                                    </div>
                                </td>
                                <td
                                    className="align-middle"
                                    style={{ border: "none", minWidth: "120px" }}
                                >
                                    {booking?.gameTitle}
                                </td>
                                <td
                                    className="align-middle"
                                    style={{ border: "none", minWidth: "80px" }}
                                >
                                    {booking.players.length + 1}
                                </td>
                                <td
                                    className="align-middle"
                                    style={{ border: "none", minWidth: "120px" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <span
                                            className="d-flex align-items-center"
                                            style={{
                                                backgroundColor:
                                                    booking.mode === "Online"
                                                        ? "#03D41414"
                                                        : "#FF00000D",
                                                borderRadius: "20px",
                                                padding: "5px 10px",
                                                color:
                                                    booking.mode === "Online" ? "#00AF0F" : "#FF0000",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        booking.mode === "Online"
                                                            ? "#03D414"
                                                            : "#FF0000",
                                                    marginRight: "5px",
                                                }}
                                            />
                                            {booking.mode}
                                        </span>
                                    </div>
                                </td>
                                <td
                                    className="align-middle"
                                    style={{ border: "none", minWidth: "120px" }}
                                >
                                    {booking.createdAt}
                                </td>
                                <td
                                    className="align-middle"
                                    style={{
                                        border: "none",
                                        position: "relative",
                                        minWidth: "100px",
                                    }}
                                >
                                    <Button
                                        variant="link"
                                        className="text-primary"
                                        onClick={() =>
                                            setActiveDropdownId(
                                                activeDropdownId === booking.id ? null : booking.id
                                            )
                                        }
                                    >
                                        <FaEdit
                                            style={{ color: "#0062FF", fontSize: "1.2rem" }}
                                        />
                                    </Button>

                                    {activeDropdownId === booking.id && (
                                        <div
                                            ref={editDropdownRef}
                                            style={{
                                                position: "absolute",
                                                right: "0",
                                                top: "100%",
                                                backgroundColor: "white",
                                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                                borderRadius: "4px",
                                                zIndex: 1000,
                                                minWidth: "150px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: "10px",
                                                    cursor: "pointer",
                                                    color: "#0062FF",
                                                    borderBottom: "1px solid #eee",
                                                }}
                                                onClick={() => {
                                                    setActiveDropdownId(null);
                                                }}
                                            >
                                                Edit Booking
                                            </div>
                                            <div
                                                style={{
                                                    padding: "10px",
                                                    cursor: "pointer",
                                                    color: "#FF0000",
                                                }}
                                                onClick={() => {
                                                    console.log("Cancel Booking");
                                                    setActiveDropdownId(null);
                                                }}
                                            >
                                                Cancel Booking
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

        </div>
    );
};

export default BookingList;

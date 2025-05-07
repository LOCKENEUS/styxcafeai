import React, { useState, useEffect, useRef } from "react";
// import moment from 'moment';
import {
    Row,
    Col,
    Table,
    Button,
    InputGroup,
    FormControl,
    Pagination,
} from "react-bootstrap";
import {
    FaEdit,
    FaSearch,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import nobookings from "/assets/Admin/Game/nobookings.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGameById, getGames } from "../../../store/slices/gameSlice";
import { getBookings } from "../../../store/AdminSlice/BookingSlice";
import profile from "/assets/profile/user_avatar.jpg";
import { convertTo12Hour, formatDate } from "../../../components/utils/utils";
import { MdOutlineDoNotDisturb } from "react-icons/md";

const BookingList = () => {
    const { gameId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const { bookings } = useSelector((state) => state.bookings);
    const { games, status } = useSelector((state) => state.games);

    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [gameFilter, setGameFilter] = useState("All");
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [collection, setCollection] = useState(0);
    const filterDropdownRef = useRef(null);
    const bookingDropdownRef = useRef(null);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const editDropdownRef = useRef(null);
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user?._id) {
            dispatch(getGames(user._id));
        }
    }, [dispatch]);

    // const filterBookingsByDate = (filter) => {
    //     const today = moment().startOf("day");

    //     switch (filter) {
    //         case "Today":
    //             return bookings?.filter((booking) =>
    //                 moment(booking.slot_date).isSame(today, "day")
    //             );
    //         case "Tomorrow":
    //             return bookings?.filter((booking) =>
    //                 moment(booking.slot_date).isSame(today.clone().add(1, "days"), "day")
    //             );
    //         case "Yesterday":
    //             return bookings?.filter((booking) =>
    //                 moment(booking.slot_date).isSame(today.clone().subtract(1, "days"), "day")
    //             );
    //         case "Monday":
    //         case "Tuesday":
    //         case "Wednesday":
    //         case "Thursday":
    //             return bookings?.filter((booking) =>
    //                 moment(booking.slot_date).format("dddd") === filter
    //             );
    //         case "All Bookings":

    //         default:
    //             return bookings
    //     }
    // };

    const filterBookingsByDate = (filter) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date

        const normalizeDate = (dateStr) => {
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);
            return date;
        };

        const getDayName = (dateStr) => {
            return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
        };

        switch (filter) {
            case "Today":
                return bookings?.filter((booking) =>
                    normalizeDate(booking.slot_date).getTime() === today.getTime()
                );

            case "Tomorrow":
                return bookings?.filter((booking) =>
                    normalizeDate(booking.slot_date).getTime() === new Date(today.getTime() + 86400000).getTime()
                );

            case "Yesterday":
                return bookings?.filter((booking) =>
                    normalizeDate(booking.slot_date).getTime() === new Date(today.getTime() - 86400000).getTime()
                );

            case "Monday":
            case "Tuesday":
            case "Wednesday":
            case "Thursday":
                return bookings?.filter((booking) =>
                    getDayName(booking.slot_date) === filter
                );

            case "All Bookings":
            default:
                return bookings;
        }
    };

    const filteredBookings = filterBookingsByDate(selectedFilter)
        .filter((booking) => booking?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((booking) => gameFilter === "All" || booking?.gameTitle === gameFilter);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        if (cafeId) {
            dispatch(getBookings(cafeId));
        }
    }, [dispatch, cafeId]);

    useEffect(() => {
        setCollection(0);
        let collectionAmount = 0;
        if (filteredBookings.length > 0) {
            filteredBookings.map((booking) => {
                collectionAmount += booking?.paid_amount;
            });
            setCollection(collectionAmount);
        }
    }, [dispatch, dropdownOpen]);

    const toggleFilterDropdown = () => {
        setFilterDropdownOpen(!filterDropdownOpen);
    };

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
        "All Bookings",
        "Tomorrow",
        "Today",
        "Yesterday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
    ];

    const handleFilterChange = (option, e) => {
        e.stopPropagation();
        setSelectedFilter(option);
        setDropdownOpen(false);
    };

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const currentBookings = filteredBookings.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setActivePage(page);
        }
    };

    console.log("filteredBookings", currentBookings);

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
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown();
                        }}
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
                            <h4>{selectedFilter}'s Bookings</h4>
                            <p>{filteredBookings.length} Bookings</p>
                        </div>
                        <div>{dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}</div>

                        {dropdownOpen && (
                            <ul className="dropdown-menu" style={{ display: "block" }}>
                                {bookingOptions.map((option, index) => (
                                    <li
                                        key={index}
                                        value={option}
                                        style={{
                                            cursor: "pointer",
                                            padding: "10px",
                                            backgroundColor: selectedFilter === option ? "#0062FF" : "transparent",
                                            color: selectedFilter === option ? "white" : "black",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFilterChange(option, e);
                                        }}
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

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
                            style={{ fontSize: "20px", color: "#0062FF", cursor: "pointer" }}
                        />
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
                            {games.length > 0 && games.map((sport, index) => (
                                <li
                                    key={index}
                                    style={{
                                        cursor: "pointer",
                                        padding: "10px",
                                        backgroundColor: gameFilter === sport?.name ? "#0062FF" : "transparent", // Highlight selected game filter
                                        color: gameFilter === sport?.name ? "white" : "black", // Change text color for the selected game filter
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setGameFilter(sport?.name);
                                        setFilterDropdownOpen(false)
                                    }}
                                >
                                    {sport?.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </Col>
            </Row>

            <div className="table-responsive bg-white rounded-3 shadow-sm p-4">
                <div className="fs-1"><strong>Collection: ₹ </strong>{collection}</div>
                <Table striped bordered hover>
                    <thead
                        className=""
                        style={{ backgroundColor: "#0062FF0D" }}
                    >
                        <tr>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                <small>Sr. No</small>
                            </th>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                <small>Booking Id</small>
                            </th>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Name
                            </th>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Sports
                            </th>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Persons
                            </th>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Mode
                            </th>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Time / Date
                            </th>
                            <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Total
                            </th>
                            {/* <th
                                style={{ textTransform: "none", border: "none", fontSize: "1rem", color: "black" }}
                            >
                                Actions
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings.length > 0 ?
                            currentBookings?.map((booking, index) => (
                                <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                                    <td style={{ border: "none", minWidth: "100px", alignContent: "center", paddingLeft: "3%" }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ border: "none", minWidth: "100px", alignContent: "center" }}>
                                        <Link to={`/admin/booking/checkout/${booking._id}`}>
                                            {booking.booking_id}
                                        </Link>
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
                                        style={{ border: "none", minWidth: "140px" }}
                                    >

                                        <div style={{ display: "flex", alignItems: "center" }}>

                                            <span
                                                className="d-flex align-items-center w-75 justify-content-center"
                                                style={{
                                                    backgroundColor:
                                                        booking.status === "Pending" ? "#FFF3CD"
                                                            :
                                                            booking.mode === "Online"
                                                                ? "#03D41414"
                                                                : "#FF00000D",
                                                    borderRadius: "20px",
                                                    padding: "5px 10px",
                                                    color:
                                                        booking.status === "Pending" ? "#856404"
                                                            :
                                                            booking.mode === "Online" ? "#00AF0F" : "orange",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "10px",
                                                        height: "10px",
                                                        borderRadius: "50%",
                                                        backgroundColor:
                                                            booking.status === "Pending" ? "#856404"
                                                                : booking.mode === "Online"
                                                                    ? "#03D414"
                                                                    : "orange",
                                                        marginRight: "5px",
                                                    }}
                                                />
                                                {booking?.status === "Pending" ? "Pending" : booking?.mode}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: "0.6rem", color: "green", paddingLeft: "5px" }}>
                                            {
                                            (booking?.game_id?.payLater && booking?.start_time && !booking?.end_time) 
                                            || 
                                            (() => {
                                                const now = new Date();
                                                const slotDate = new Date(booking?.slot_date);
                                                console.log("slot-start-time", booking?.slot_id?.start_time);
                                                console.log("cistom-slot-start-time", booking?.custom_slot?.start_time);
                                                const [startHour, startMinute] = (booking?.slot_id?.start_time ? booking?.slot_id?.start_time : booking?.custom_slot?.start_time).split(":").map(Number);
                                                const [endHour, endMinute] = (booking?.slot_id?.end_time ? booking?.slot_id?.end_time : booking?.custom_slot?.end_time).split(":").map(Number);
                                            
                                                const startDateTime = new Date(slotDate);
                                                startDateTime.setHours(startHour, startMinute, 0, 0);
                                            
                                                const endDateTime = new Date(slotDate);
                                                endDateTime.setHours(endHour, endMinute, 0, 0);
                                            
                                                return ( !booking?.game_id?.payLater && now >= startDateTime && now <= endDateTime);
                                              })() ? "Game Running" : ""
                                            }
                                        </span>
                                    </td>
                                    <td
                                        className="align-middle"
                                        style={{ border: "none", minWidth: "120px" }}
                                    >
                                        {formatDate(booking?.slot_date)}<br />
                                        {/* {booking?.booking_type === "Regular" ? (convertTo12Hour(booking?.slot_id?.start_time)-convertTo12Hour(booking?.slot_id?.end_time))
                                          :
                                          (convertTo12Hour(booking?.custom_slot?.start_time)-convertTo12Hour(booking?.custom_slot?.end_time))
                                        } */}

                                        {convertTo12Hour(booking?.slot_id?.start_time || booking?.custom_slot?.start_time)}-{convertTo12Hour(booking?.slot_id?.end_time || booking?.custom_slot?.end_time)}

                                    </td>
                                    <td
                                        className="align-middle"
                                        style={{ border: "none", minWidth: "120px" }}
                                    >
                                        ₹  {booking?.total}
                                    </td>
                                    {/* <td
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
                                                navigate(`/admin/booking/edit/${booking._id}`)
                                            }
                                        >
                                            <FaEdit
                                                style={{ color: "#0062FF", fontSize: "1.2rem" }}
                                            />
                                        </Button>
                                    </td> */}
                                </tr>
                            )) :
                            <tr>
                                <td colSpan={8} className="text-center " style={{ height: "40vh", border: "none" }}>
                                    <h1>  <span>  <MdOutlineDoNotDisturb /> </span> No booking Available</h1>
                                </td>
                            </tr>}
                    </tbody>
                </Table>
            </div>

            <div className="d-flex justify-content-center mt-3 mb-3">
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(activePage - 1)} disabled={activePage === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === activePage} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(activePage + 1)} disabled={activePage === totalPages} />
                </Pagination>
            </div>
        </div>
    );
};

export default BookingList;


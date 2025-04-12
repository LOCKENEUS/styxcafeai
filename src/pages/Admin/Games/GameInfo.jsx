import React, { useState, useEffect, useRef } from "react";
import {
  Card,
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
import { Link, useNavigate, useParams } from "react-router-dom";
import Calendar from "./Calendar";
import gm2 from "/assets/Admin/Dashboard/GamesImage/gm2.png";
import nobookings from "/assets/Admin/Game/nobookings.png";
import profile from "/assets/profile/user_avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getGameById } from "../../../store/slices/gameSlice";
import { getBookingsByGame } from "../../../store/AdminSlice/BookingSlice";
import { convertTo12Hour, formatDate } from "../../../components/utils/utils";
import { BiPencil } from "react-icons/bi";

const GameInfo = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedGame, status, error } = useSelector((state) => state.games);
  const { bookings } = useSelector((state) => state.bookings);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [gameFilter, setGameFilter] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [collection, setCollection] = useState(0);
  const filterDropdownRef = useRef(null);
  const bookingDropdownRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const editDropdownRef = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (gameId) {
      dispatch(getBookingsByGame(gameId));
    }
  }, [dispatch, gameId]);

  useEffect(() => {
    setCollection(0);
    if (filteredBookings.length > 0) {
      filteredBookings.map((booking) => {
        setCollection(collection + booking?.total);
      });
    }
  }, [dispatch, dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  const handleFilterChange = (option, e) => {
    e.stopPropagation();
    setSelectedFilter(option);
    setDropdownOpen(false);
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
    "Tomorrow",
    "Today",
    "Yesterday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  const filterBookingsByDate = (filter) => {
    const today = moment().startOf("day");

    switch (filter) {
      case "Today":
        return bookings?.filter((booking) =>
          moment(booking.slot_date).isSame(today, "day")
        );
      case "Tomorrow":
        return bookings?.filter((booking) =>
          moment(booking.slot_date).isSame(today.clone().add(1, "days"), "day")
        );
      case "Yesterday":
        return bookings?.filter((booking) =>
          moment(booking.slot_date).isSame(today.clone().subtract(1, "days"), "day")
        );
      case "Monday":
      case "Tuesday":
      case "Wednesday":
      case "Thursday":
        return bookings?.filter((booking) =>
          moment(booking.slot_date).format("dddd") === filter
        );
      default:
        return bookings
    }
  };

  const filteredBookings = filterBookingsByDate(selectedFilter)
    .filter((booking) => booking?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((booking) => gameFilter === "All" || booking?.gameTitle === gameFilter);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handleBookSlotClick = () => {
    setShowCalendar(true);
  };

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <Row>
        <Col>
          <p>
            <Link to="/admin/dashboard">Home</Link> /{" "}
            <Link to="#" className="fw-bold">
              {selectedGame?.data?.name || "Loading..."}
            </Link>
          </p>
        </Col>
      </Row>

      {/* Booking Overview */}
      <Card className="p-3 mb-2" style={{ backgroundColor: "transparent" }}>
        <Row className="gap-3" style={{ backgroundColor: "transparent" }}>
          <Col md={2} className="position-relative" style={{ backgroundColor: "transparent" }}>
            <img
              src={
                `${import.meta.env.VITE_API_URL}/${selectedGame?.data?.gameImage}` ||
                gm2
              }
              alt={selectedGame?.data?.name}
              className="img-fluid rounded"
              style={{
                width: "100%",
                height: "164px",
                borderRadius: "19px",
                objectFit: "cover",
              }}
            />
             <div
                            onClick={() => navigate(`/admin/games/edit-game/${gameId}`)}
                            className="rounded-circle"
                            style={{
                                position: "absolute",
                                bottom: "35px",
                                right: "15px",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "white",
                                border: "none",
                                boxShadow: "none",
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                          <BiPencil  color="blue" />
               </div>
          </Col>
          <Col
            md={5}
            className="d-flex flex-column justify-content-around"
            style={{ backgroundColor: "transparent" }}
          >
            <h5>{selectedGame?.data?.name}

              <Button
                variant="success"
                className="mx-2 rounded-pill"
                style={{
                  backgroundColor: "#03D41414",
                  color: "#00AF0F",
                  border: "none",
                }}
              >
                {selectedGame?.data?.type}
              </Button>
              <Button
                variant="primary"
                className="rounded-pill"
                style={{
                  backgroundColor: "#0062FF14",
                  color: "#0062FF",
                  border: "none",
                }}
              >
                {selectedGame?.data?.zone}
              </Button>
              {selectedGame?.data?.payLater &&
                <Button
                  variant="primary"
                  className="rounded-pill mx-2"
                  style={{
                    backgroundColor: "#efd8f2",
                    color: "#ce0de7",
                    border: "none",
                  }}
                >
                  Pay Later
                </Button>
              }
            </h5>
            <p className="text-muted">{selectedGame?.data?.details}</p>
            <div >
              <p>
                <b>Cancellation:</b> <span>{selectedGame?.data?.cancellation ? "Yes" : "No"}</span>
              </p>
              <p>
                <b>Created At:</b> <span>{new Date(selectedGame?.data?.createdAt).toLocaleString()}</span>
              </p>
              <p>
                <b>Updated At:</b> <span>{new Date(selectedGame?.data?.updatedAt).toLocaleString()}</span>
              </p>
            </div>
          </Col>
          <Col
            md={3}
            className="text-end d-flex flex-column justify-content-around align-items-end"
            style={{ backgroundColor: "transparent" }}
          >
            <h4
              style={{ fontSize: "24px", color: "#0062FF", fontWeight: "bold" }}
            >
              ₹ {selectedGame?.data?.price}
            </h4>
            <Button
              variant="primary"
              style={{ width: "128px", height: "37px" }}
              onClick={handleBookSlotClick}
            >
              Book Slot Now
            </Button>
          </Col>
        </Row>
      </Card>
      {/* Bookings Table */}
      {showCalendar ? (
        <Calendar selectedGame={selectedGame} />
      ) : (
        <Card className="p-3" style={{ backgroundColor: "transparent" }}>
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
                        style={{ cursor: "pointer", padding: "10px" }}
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
                      style={{ cursor: "pointer", padding: "10px" }}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop propagation for the item click
                        console.log("selected sport", sport);
                        setGameFilter(sport?.name); // Call the handler
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

          <div className="table-responsive">
            <div>Collection: Rs. {collection}</div>
            <Table striped bordered hover>
              <thead
                className="text-lowercase"
                style={{ backgroundColor: "#0062FF0D" }}
              >
                <tr>
                  <th
                    style={{ border: "none", fontSize: "1rem", color: "black" }}
                  >
                    <small>Sr. No</small>
                  </th>
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
              <tbody style={{ minHeight: "200px", display: "table-row-group" }}>
                {currentBookings.length > 0 ? 
                  currentBookings?.map((booking, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                      <td style={{ border: "none", minWidth: "100px", alignContent: "center" }}>
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
                        style={{ border: "none", minWidth: "120px" }}
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
                      </td>
                      <td
                        className="align-middle"
                        style={{ border: "none", minWidth: "120px" }}
                      >
                        {formatDate(booking.slot_date)}<br />
                        {convertTo12Hour(booking?.slot_id?.start_time)}-{convertTo12Hour(booking?.slot_id?.end_time)}
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
                            navigate(`/admin/booking/edit/${booking._id}`)
                          }
                        >
                          <FaEdit
                            style={{ color: "#0062FF", fontSize: "1.2rem" }}
                          />
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        <img src={nobookings} className="w-50"/>
                      </td>
                    </tr>
                  )}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-center mt-3 mb-3">
            <Pagination>
              <Pagination.Prev onClick={() => setActivePage(activePage - 1)} disabled={activePage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === activePage} onClick={() => setActivePage(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setActivePage(activePage + 1)} disabled={activePage === totalPages} />
            </Pagination>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GameInfo;

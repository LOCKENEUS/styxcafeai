import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Badge,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import {
  FaEdit,
  FaSearch,
  FaFilter,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import Calendar from "./Calendar"; // Import the Calendar component
import gm2 from "/assets/Admin/Dashboard/GamesImage/gm2.png";
import gm1 from "/assets/Admin/Dashboard/GamesImage/gm1.png";
import { useDispatch, useSelector } from "react-redux";
import { getGameById } from "../../../store/slices/gameSlice";
import CreateClientModal from "../Customer/Modal/ClientList";

const GameInfo = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const [showClientModal, setShowClientModal] = useState(false);
  const { selectedGame, status, error } = useSelector((state) => state.games);

  // Sample booking data
  const [bookings, setBookings] = useState([
    {
      id: "#201456",
      image: gm2,
      name: "Shardul Thakur",
      sports: "Snooker & Pool",
      persons: "2 Persons",
      mode: "Online",
      time: "04:00 PM | Sun, 6 March, 25",
    },
    {
      id: "#201457",
      image: gm1,
      name: "Rajat Saxena",
      sports: "Pickle Ball",
      persons: "8 Persons",
      mode: "Offline",
      time: "04:00 PM | Sun, 6 March, 25",
    },
    {
      id: "#201458",
      image: gm2,
      name: "Shreya Mahajan",
      sports: "Play Stations",
      persons: "1 Person",
      mode: "Online",
      time: "04:00 PM | Sun, 6 March, 25",
    },
    // ... add more bookings as needed
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  const bookingDropdownRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false); // State to manage Calendar visibility
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const editDropdownRef = useRef(null);

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

  const filteredBookings = bookings.filter((booking) =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookSlotClick = () => {
    setShowCalendar(true); // Show the Calendar when the button is clicked
  };

  const handleClose = () => {
    setShowClientModal(false); // Hide the Calendar when the close button is clicked
  };

  const handleOpenClientModal = () => {
    setShowClientModal(true); // Open the client modal
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
          <Col md={2} style={{ backgroundColor: "transparent" }}>
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
          </Col>
          <Col
            md={5}
            className="d-flex flex-column justify-content-around"
            style={{ backgroundColor: "transparent" }}
          >
            <h5>{selectedGame?.data?.name}</h5>
            <p className="text-muted">{selectedGame?.data?.details}</p>
            <div className="d-flex">
              <Button
                variant="success"
                className="me-2 rounded-pill"
                style={{
                  backgroundColor: "#03D41414",
                  color: "#00AF0F",
                  border: "none",
                }}
              >
                Type: {selectedGame?.data?.type}
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
                Zone: {selectedGame?.data?.zone}
              </Button>
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
        <Calendar openClientModal={handleOpenClientModal} />
      ) : (
        <Card className="p-3" style={{ backgroundColor: "transparent" }}>
          {/* Today's Bookings Header and Search Bar */}
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
                {filteredBookings.map((booking, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ border: "none", minWidth: "100px" }}>
                      {booking.id}
                    </td>
                    <td style={{ border: "none", minWidth: "150px" }}>
                      <div className="d-flex align-items-center">
                        <img
                          src={booking.image}
                          alt={booking.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "100%",
                            marginRight: "10px",
                          }}
                        />
                        <span>{booking.name}</span>
                      </div>
                    </td>
                    <td
                      className="align-middle"
                      style={{ border: "none", minWidth: "120px" }}
                    >
                      {booking.sports}
                    </td>
                    <td
                      className="align-middle"
                      style={{ border: "none", minWidth: "80px" }}
                    >
                      {booking.persons}
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
                      {booking.time}
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
        </Card>
      )}
      <CreateClientModal
        show={showClientModal}
        handleClose={handleClose}
      />
    </div>
  );
};

export default GameInfo;

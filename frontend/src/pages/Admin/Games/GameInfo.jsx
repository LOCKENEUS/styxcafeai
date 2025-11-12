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
  Container,
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
import profile from "/assets/profile/user_avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { getGameById } from "../../../store/slices/gameSlice";
import { getBookingsByGame } from "../../../store/AdminSlice/BookingSlice";
import { convertTo12Hour, formatDate } from "../../../components/utils/utils";
import { BiPencil } from "react-icons/bi";
import CustomSlotModal from "./Modal/CustomSlot";
import { Breadcrumbs } from "../../../components/common/Breadcrumbs/Breadcrumbs";

const GameInfo = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedGame, status, error } = useSelector((state) => state.games);
  const { bookings } = useSelector((state) => state.bookings);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomSlot, setShowCustomSlot] = useState(false);
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
    "All Bookings",
    "Tomorrow",
    "Today",
    "Yesterday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  const filterBookingsByDate = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize

    const normalizeDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    return bookings?.filter((booking) => {
      const bookingDate = normalizeDate(booking.slot_date);

      switch (filter) {
        case "Today":
          return bookingDate.getTime() === today.getTime();
        case "Tomorrow":
          return bookingDate.getTime() === new Date(today.getTime() + 86400000).getTime();
        case "Yesterday":
          return bookingDate.getTime() === new Date(today.getTime() - 86400000).getTime();
        case "Monday":
        case "Tuesday":
        case "Wednesday":
        case "Thursday":
          return bookingDate.toLocaleDateString('en-US', { weekday: 'long' }) === filter;
        case "All Bookings":
        default:
          return true;
      }
    });
  };

  const filteredBookings = filterBookingsByDate(selectedFilter)
    .filter((booking) => booking?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((booking) => gameFilter === "All" || booking?.gameTitle === gameFilter);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handleBookSlotClick = () => {
    setIsLoading(true);
    setShowCalendar(true);
    setIsLoading(false);
  };

  return (
    <Container fluid>
      <Breadcrumbs
        items={[
          { label: "Home", path: "/admin/dashboard" },
          { label: "Book Games", path: "/admin/booking/games" },
          { label: `${selectedGame?.data?.name || "Loading..."}`, active: true }
        ]}
      />

      {/* Booking Overview */}
      <Card className="p-2" style={{ backgroundColor: "white", marginBottom: "20px" }}>
        <Row className="" style={{ backgroundColor: "transparent" }}>
          <Col md={3} className="position-relative my-auto" style={{ backgroundColor: "transparent" }}>
            <img
              src={
                `${import.meta.env.VITE_API_URL}/${selectedGame?.data?.gameImage}` ||
                gm2
              }
              alt={selectedGame?.data?.name}
              className="ps-2 pe-2 mt-2 mt-md-0 img-fluid responsive-img-width"
              style={{
                height: "230px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          </Col>

          <Col
            md={6}
            className="d-none d-md-flex flex-column justify-content-around p-3 px-1"
            style={{ backgroundColor: "transparent" }}
          >
            <h5 className="fw-600 fs-3" style={{ fontWeight: "600" }}>{selectedGame?.data?.name}</h5>
            <p className="text-muted">{selectedGame?.data?.details}</p>
            <div className="d-flex justify-content-between">
              <div><img src="/assets/Admin/Game/paylater.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />{selectedGame?.data?.payLater ? "Pay Later" : "Pay Now"}</div>
              <div><img src="/assets/Admin/Game/singleplayer.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />{selectedGame?.data?.type}</div>
              <div><img src="/assets/Admin/Game/indoor.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />{selectedGame?.data?.zone}</div>
              <div><img src="/assets/Admin/Game/crosssign.svg" className="me-1 mb-1 p-1" alt="paylater" /><br />{selectedGame?.data?.cancellation ? "Cancellation Yes" : "Cancellation No"}</div>
            </div>

            <div>
              <img src="/assets/Admin/Game/price.svg" className="mb-2" alt="paylater" />
              <span style={{ color: "#0062FF", fontSize: "24px" }} className="fw-bold text-primary">{selectedGame?.data?.price}</span>
            </div>
          </Col>

          <Col
            md={3}
            className="text-end d-none d-md-flex flex-column justify-content-around align-items-end px-0"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="mb-10 p-2 mx-2 text-end">
              <span className="text-color">Created At - </span>{new Date(selectedGame?.data?.createdAt).toLocaleDateString('en-GB')}
            </div>
            <span className="align-bottom p-2 px-0 mt-3">
              <div className="d-flex justify-content-around gap-2 p-2">
                <Button
                  size="sm"
                  variant="success"
                  className="px-2 m-2"
                  disabled={isLoading}
                  style={{ width: "80%", height: "37px", marginRight: "30px" }}
                  onClick={handleBookSlotClick}
                >
                  Book Slot
                </Button>
              </div>

              <div>
                <Button
                  size="sm"
                  variant="success"
                  className="px-0"
                  style={{ width: "80%", height: "37px", marginLeft: "10px", marginRight: "50px" }}
                  onClick={() => setShowCustomSlot(true)}
                >
                  Custom Booking
                </Button>
              </div>
            </span>
          </Col>
        </Row>

        <Col
          xs={12}
          md={6}
          className="d-flex d-md-none flex-column justify-content-around p-2 p-md-3"
          style={{ backgroundColor: "transparent" }}
        >
          <h5 className="fw-600 fs-4 fs-md-3" style={{ fontWeight: "600" }}>
            {selectedGame?.data?.name}
          </h5>

          <p className="text-muted small">{selectedGame?.data?.details}</p>

          <div className="d-flex flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <img
                src="/assets/Admin/Game/paylater.svg"
                className="me-1 p-1"
                alt="paylater"
                style={{ width: "20px", height: "20px" }}
              />
              <small>{selectedGame?.data?.payLater ? "Pay Later" : "Pay Now"}</small>
            </div>
            <div className="d-flex align-items-center">
              <img
                src="/assets/Admin/Game/singleplayer.svg"
                className="me-1 p-1"
                alt="type"
                style={{ width: "20px", height: "20px" }}
              />
              <small>{selectedGame?.data?.type}</small>
            </div>
            <div className="d-flex align-items-center">
              <img
                src="/assets/Admin/Game/indoor.svg"
                className="me-1 p-1"
                alt="zone"
                style={{ width: "20px", height: "20px" }}
              />
              <small>{selectedGame?.data?.zone}</small>
            </div>
            <div className="d-flex align-items-center">
              <img
                src="/assets/Admin/Game/crosssign.svg"
                className="me-1 p-1"
                alt="cancel"
                style={{ width: "20px", height: "20px" }}
              />
              <small>{selectedGame?.data?.cancellation ? "Cancellation Yes" : "Cancellation No"}</small>
            </div>
          </div>

          <div className="mt-3">
            {/* <img
              src="/assets/Admin/Game/price.svg"
              className="mb-2"
              alt="price"
              style={{ width: "24px", height: "24px" }}
            /> */}
            <span
              className="fw-bold text-primary"
              style={{ fontSize: "20px" }}
            >
              ₹ {selectedGame?.data?.price}
            </span>
          </div>
        </Col>

        <Col
          md={3}
          className="d-block d-md-none "
          style={{ backgroundColor: "transparent" }}
        >
          <Row className="px-2">
            <Col xs={6}>
              <p className="text-color">Created At</p>
            </Col>
            <Col xs={6}>
              <span className="muted-text">{new Date(selectedGame?.data?.createdAt).toLocaleString()}</span>
            </Col>
          </Row>

          <Row className="mb-2 p-2">
            <Col xs={6} className="">
              <Button
                size="sm"
                variant="primary"
                className=""
                disabled={isLoading}
                style={{ width: "80%", height: "37px" }}
                onClick={handleBookSlotClick}
              >
                Book Slot
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              <Button
                size="sm"
                variant="primary"
                className=""
                style={{ width: "80%", height: "37px" }}
                onClick={() => setShowCustomSlot(true)}
              >
                Custom Booking
              </Button>
            </Col>
          </Row>
        </Col>

      </Card>
      {/* Bookings Table */}
      {showCalendar ? (
        <Calendar selectedGame={selectedGame} />
      ) : (
        <Card className="p-3" style={{ backgroundColor: "white" }}>
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
                      <td className="p-0 p-md-2 text-center" style={{ border: "none", minWidth: "100px", alignContent: "center" }}>
                        {index + 1}
                      </td>
                      <td
                        className="p-0 p-md-2"
                        style={{
                          border: "none",
                          minWidth: "100px",
                          alignContent: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        <Link to={`/admin/booking/checkout/${booking._id}`}
                          style={{
                            display: "inline-block",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "blue",
                            textDecoration: "none"
                          }}
                        >
                          {booking.booking_id}
                        </Link>
                      </td>
                      <td className="p-0 p-md-2" style={{ border: "none", minWidth: "150px", alignContent: "center" }}>
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
                        className="align-middle p-0 p-md-2"
                        style={{ border: "none", minWidth: "120px" }}
                      >
                        {booking?.gameTitle}
                      </td>
                      <td
                        className="align-middle p-0 text-center"
                        style={{ border: "none", minWidth: "80px" }}
                      >
                        {booking.players.length + 1}
                      </td>
                      <td
                        className="align-middle p-0 p-md-2"
                        style={{ border: "none", minWidth: "130px" }}
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
                        className="align-middle p-0 p-md-2"
                        style={{ border: "none", minWidth: "120px" }}
                      >
                        {formatDate(booking.slot_date)}<br />
                        {convertTo12Hour(booking?.slot_id?.start_time || booking?.custom_slot?.start_time)}-{convertTo12Hour(booking?.slot_id?.end_time || booking?.custom_slot?.end_time)}
                      </td>
                      <td
                        className="align-middle p-0 p-md-2"
                        style={{
                          border: "none",
                          position: "relative",
                          minWidth: "100px",
                        }}
                      >
                        <Button
                          variant="link"
                          className="text-primary"
                          disabled={booking?.status !== "Pending"}
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
                      <td colSpan="9" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <img src={nobookings} style={{ width: "120px", height: "120px", objectFit: "contain" }} className="mb-3" />
                          <h6 className="text-muted mb-1">No Bookings Available</h6>
                          <p className="text-muted small mb-0">There are no bookings for this game yet</p>
                        </div>
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

      {showCustomSlot &&
        <CustomSlotModal
          show={showCustomSlot}
          handleClose={() => setShowCustomSlot(false)}
          gameId={gameId}
          date={new Date()}
        />}

    </Container>
  );
};

export default GameInfo;

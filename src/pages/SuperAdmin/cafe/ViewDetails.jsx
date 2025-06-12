import { Row, Col, Button, Card, Image, Modal, Container, CardGroup, Badge, Pagination, Table, Nav, DropdownButton, Dropdown, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { deleteCafe, fetchCafes, selectCafes } from "../../../store/slices/cafeSlice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getGames, getGamesCommission, setSelectedGame } from '../../../store/slices/gameSlice';
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png'
import edit from "/assets/superAdmin/cafe/edit.png";
import Add from "/assets/superAdmin/cafe/formkit_add.png";
import FrameKing from '/assets/superAdmin/cafe/FrameKing.png';
import { getMembershipsByCafeId, setSelectedMembership } from "../../../store/slices/MembershipSlice";
import AddGamesOffcanvas from "./offcanvasCafe/addGames";
import AddMembershipOffcanvas from "./offcanvasCafe/addMembership";
import EditCafeOffcanvas from "./offcanvasCafe/editCafe";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";
import ForwordPassword from "./modal/forwordPassword";
import Loader from "../../../components/common/Loader/Loader";
import gsap from "gsap";
import { getCustomers } from "../../../store/AdminSlice/CustomerSlice";
import { fetchEarning, getBookings } from "../../../store/AdminSlice/BookingSlice";
import { convertTo12Hour, formatDate } from "../../../components/utils/utils";
import { setsEqual } from "chart.js/helpers";

const ViewDetails = () => {
  const [loadingMain, setLoadingMain] = useState(true);
  const { games, selectedGame } = useSelector((state) => state.games);
  const cafes = useSelector(selectCafes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cafeId = location.state?.cafeId;

  
  const [currentPageCommission, setCurrentPageCommission] = useState(1);
  const itemsPerPageCommission = 5;

  const [showModal, setShowModal] = useState(false);
  const [cafe, setCafe] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showCanvasEditCafe, setShowCanvasEditCafe] = useState(false);
  const [showModalForwordPassword, setShowModalForwordPassword] = useState(false);
  const [formDataState, setFormDataState] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = React.useRef(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showMembershipAdd, setShowMembershipAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeKey, setActiveKey] = useState('gallary');
  const [lodergames, setLodergames] = useState(true);
  const [lodermembership, setLodermembership] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryBooking, setSearchQueryBooking] = useState("");
  const [currentPagebooking, setCurrentPagebooking] = useState(1);
  const [selectedItem, setSelectedItem] = useState("Today");
  const [startDate, setStartDate] = useState(null);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalEarning, setTotalEarning] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allEarningData, setAllEarningData] = useState([]);
  const [filteredBookingsset, setFilteredBookingsset] = useState([]);
  const [filteredEarningData, setFilteredEarningData] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('All');
  const [earningData, setEarningData] = useState([]);
  const [commissionSelectedItem, setCommissionSelectedItem] = useState("Today");
  const [commissionSelectedGameId, setCommissionSelectedGameId] = useState("All");
  const [today, setToday] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const year = lastDay.getFullYear();
    const month = ("0" + (lastDay.getMonth() + 1)).slice(-2);
    const day = ("0" + lastDay.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  });
  // Week start (Monday) and week end (Sunday)
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)

    const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diffToMonday));

    const year = monday.getFullYear();
    const month = ("0" + (monday.getMonth() + 1)).slice(-2);
    const day = ("0" + monday.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // Example: 2025-04-21 (Monday)
  });

  const [weekEndDate, setWeekEndDate] = useState(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)

    const diffToSunday = now.getDate() + (7 - dayOfWeek) % 7;
    const sunday = new Date(now.setDate(diffToSunday));

    const year = sunday.getFullYear();
    const month = ("0" + (sunday.getMonth() + 1)).slice(-2);
    const day = ("0" + sunday.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // Example: 2025-04-27 (Sunday)
  });
  const monthStartDate = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2); // months are 0-indexed
    return `${year}-${month}-01`; // Always 01 for start of month
  })();

  const monthEndDate = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 (Jan) to 11 (Dec)

    const lastDayOfMonth = new Date(year, month + 1, 0); // 0th day of next month is last day of current month
    const endYear = lastDayOfMonth.getFullYear();
    const endMonth = ("0" + (lastDayOfMonth.getMonth() + 1)).slice(-2);
    const endDate = ("0" + lastDayOfMonth.getDate()).slice(-2);

    return `${endYear}-${endMonth}-${endDate}`; // Example: 2025-04-30
  })();

  const [requestData, setRequestData] = useState({
    cafeId: cafeId,
    startDate: today,
    endDate: today,
    gameId: "",
  });

  const [commissionFilter, setCommissionFilter] = useState({
    filter: cafeId,
    startDate: today,
    endDate: today,
    game: "",
  });

  const [currentPageEarning, setCurrentPageEarning] = useState(1);
  const itemsPerPageEarning = 5;

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredEarningData(earningData); // If search empty, show full data
    } else {
      const filtered = earningData.filter(item => {
        const gameNames = Object.keys(item.games || {});

        // Check match in games name
        const matchGameName = gameNames.some(gameName =>
          gameName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Check match in amountPaid
        const matchAmountPaid = Object.values(item.games || {}).some(game =>
          game.amountPaid !== undefined &&
          game.amountPaid.toString().includes(searchTerm)
        );

        // Check match in count
        const matchCount = Object.values(item.games || {}).some(game =>
          game.count !== undefined &&
          game.count.toString().includes(searchTerm)
        );

        return matchGameName || matchAmountPaid || matchCount;
      });

      setFilteredEarningData(filtered);
    }
  }, [searchTerm, earningData]);
  const dataEarning = useSelector(state => state.bookings.earningData);
  useEffect(() => {
    dispatch(getBookings(cafeId));
  }, [dispatch, cafeId]);
  const bookings = useSelector((state) => state.bookings.bookings);

  useEffect(() => {
    setLoadingMain(true);

    dispatch(fetchCafes()).finally(() => setLoadingMain(false));

  }, [dispatch]);

  useEffect(() => {
    if (cafes.length > 0) {
      const selectedCafe = cafes.find(cafe => cafe._id === cafeId);
      if (selectedCafe) {
        setCafe(selectedCafe);
      }
    }
  }, [cafes, cafeId]);

  useEffect(() => {
    dispatch(setSelectedGame(null));
  }, [dispatch]);

  // -------------- Games --------------
  const gamesDetails = useSelector(state => state.games);
  const { selectedGameDetails, commission } = useSelector((state) => state.games);
  useEffect(() => {
    if (cafeId) {
      setLodergames(true);
      dispatch(getGames(cafeId)).finally(() => setLodergames(false));
    }
  }, [cafeId, dispatch]);
  //   games  const POIdGet = useSelector(state => state.purchaseReceiveSlice);

  useEffect(() => {
    if (cafeId) {
      dispatch(getCustomers(cafeId));
    }
  }, [dispatch, cafeId]);
  // const clientList= useSelector(state => state.        state.customers = action.payload;
  const clientList = useSelector((state) => state.customers.customers);

  const filteredData = clientList.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name?.toLowerCase().includes(query) ||
      client.contact_no?.toString().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.membership?.toLowerCase().includes(query) ||
      client.creditLimit?.toString().includes(query)
    );
  });

  // --------------------- gallery ---------------------
  const [currentIndexGallery, setCurrentIndexGallery] = useState(0);
  const cardsPerPageGallery = 3;

  // Set selected cafe
  useEffect(() => {
    if (cafes.length > 0) {
      const selected = cafes.find((c) => c._id === cafeId);
      if (selected) {
        setCafe(selected);
      }
    }
  }, [cafes, cafeId]);

  // Handle Prev button
  const handlePrevGallery = () => {
    if (currentIndexGallery > 0) {
      setCurrentIndexGallery((prev) => prev - 1);
    }
  };

  // Handle Next button
  const handleNextGallery = () => {
    if (
      cafe &&
      currentIndexGallery + cardsPerPageGallery < cafe.cafeImage.length
    ) {
      setCurrentIndexGallery((prev) => prev + 1);
    }
  };
  // --------------------- Game ---------------------

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;
  const maxIndex = Math.max(games.length - cardsPerPage, 0);
  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + cardsPerPage);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - cardsPerPage);
    }
  };

  const handleOpenGameDetails = (gameId) => {
    navigate("/superadmin/Games/cafeGames", { state: { gameId: gameId } });
  };

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1 }); // Optional delay before all starts

    tl.from(".gsap-card", {
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.7,
      ease: "power3.out",
    });


    const cards = document.querySelectorAll(".gsap-card-move");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.03,
          borderColor: "#000",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          borderColor: "#E4E4E4",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Optional cleanup if needed
    return () => {
      cards.forEach((card) => {
        card.replaceWith(card.cloneNode(true));
      });
    };
  }, []);

  // -------------- Membership --------------
  const { memberships, loading, error, selectedMembership } = useSelector((state) => state.memberships);
  const membershipCardsPerPage = 2;
  const membershipMaxIndex = Math.max(memberships.length - membershipCardsPerPage, 0);
  const [currentIndexMembership, setCurrentIndexMembership] = useState(0);
  useEffect(() => {
    setLoadingMain(true);
    if (cafeId) {
      dispatch(getMembershipsByCafeId(cafeId)).finally(() => setLodermembership(false));
    }
  }, [cafeId, dispatch]);

  const handleCreateNewMembership = () => {
    dispatch(setSelectedMembership(null));
    setShowCanvas(true);
  };


  const handleMembershipNext = () => {
    if (currentIndexMembership < membershipMaxIndex) {
      setCurrentIndexMembership(prev => prev + membershipCardsPerPage);
    }
  };

  const handleMembershipPrev = () => {
    if (currentIndexMembership > 0) {
      setCurrentIndexMembership(prev => prev - membershipCardsPerPage);
    }
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCafe(cafeId));
    setShowModal(false);
    navigate('/superadmin/create-cafe');
  };

  const handleEdit = () => {
    const editData = {
      ...cafe,
      editId: cafe._id,
      cafeImage: cafe.cafeImage ? cafe.cafeImage.map(path => path.trim()) : [],
      location: cafe.location ? cafe.location._id : null
    };

    setFormDataState(editData);

    const baseURL = import.meta.env.VITE_API_URL;
    const previews = editData.cafeImage.map(path => `${baseURL}/${path}`);
    setImagePreview(previews);

    setShowCanvas(true);
  };

  if (loadingMain || !cafe) {
    return (
      <div className="text-center " style={{ marginTop: "200px" }}>
        <Loader />
      </div>
    );
  }
  const baseURL = import.meta.env.VITE_API_URL;
  const imagePaths = cafe.cafeImage ? cafe.cafeImage.map(path => baseURL + "/" + path.trim()) : [];

  // -----------------------    client Details -----------------------
  const itemsPerPage = 10;
  const totalPages = Math.ceil(clientList.length / itemsPerPage);

  const handleNextclient = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevclient = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const statusBadge = (status) => (
    <Badge bg={status === "Yes" ? "success" : "warning"} text={status === "Yes" ? "light" : "dark"}>
      {status}
    </Badge>
  );

  // -----------------------    client Details -----------------------

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // -------------------  Booking -------------------
  const totalPagesboking = Math.ceil(bookings.length / itemsPerPage);

  const filteredBookings = bookings.filter((booking) => {
    const searchValue = searchQueryBooking.toLowerCase();
    return (
      booking.booking_id?.toString().toLowerCase().includes(searchValue) ||
      booking.customerName?.toLowerCase().includes(searchValue) ||
      booking.game_id?.name?.toLowerCase().includes(searchValue) ||
      booking.players?.length?.toString().toLowerCase().includes(searchValue) ||
      booking?.gamePrice?.toString().toLowerCase().includes(searchValue) ||
      booking.status?.toLowerCase().includes(searchValue) ||
      booking.mode?.toLowerCase().includes(searchValue) ||
      booking.slot_date?.toString().toLowerCase().includes(searchValue) ||
      (booking?.slot_id?.start_time && convertTo12Hour(booking.slot_id.start_time)?.toLowerCase().includes(searchValue)) ||
      (booking?.slot_id?.end_time && convertTo12Hour(booking.slot_id.end_time)?.toLowerCase().includes(searchValue))
      // booking.slot_id?.duration?.toString().toLowerCase().includes(searchValue)
    );
  });

  const paginatedDataBooking = filteredBookings.slice(
    (currentPagebooking - 1) * itemsPerPage,
    currentPagebooking * itemsPerPage
  );

  const handlePrevclientBooking = () => {
    if (currentPagebooking > 1) {
      setCurrentPagebooking(currentPagebooking - 1);
    }
  };

  const handleNextclientBooking = () => {
    if (currentPagebooking < totalPagesboking) {
      setCurrentPagebooking(currentPagebooking + 1);
    }
  };

  const handleBookingClick = (bookingID) => {
    navigate(`/superadmin/Bookings/BookingDetails`, { state: { bookingID: bookingID } });
  }
  const handleClientClick = (clientID) => {
    navigate(`/superadmin/Clients/ClientDetails`, { state: { clientID: clientID } });
  }
  // -------------------  Earning -------------------



  const normalizeDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const filterBookings = (eventKey) => {
    setSelectedItem(eventKey);
    const today = new Date();
    let filtered = [];
    let earnings = 0;

    if (eventKey === "Select") {
      filtered = bookings;
      bookings.forEach((booking) => {
        earnings += booking?.gamePrice || 0;
      });
    }

    switch (eventKey) {
      case "Day":
        filtered = bookings.filter((booking) => {
          const slotDate = normalizeDate(booking.slot_date);
          const isToday = slotDate.getTime() === normalizeDate(today).getTime();
          if (isToday) earnings += booking?.gamePrice || 0;
          return isToday;
        });
        break;

      case "Week":
        const startOfWeek = new Date(today);
        const endOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

        filtered = bookings.filter((booking) => {
          const slotDate = new Date(booking.slot_date);
          const inWeek = slotDate >= startOfWeek && slotDate <= endOfWeek;
          if (inWeek) earnings += booking?.gamePrice || 0;
          return inWeek;
        });
        break;

      case "Month":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        filtered = bookings.filter((booking) => {
          const slotDate = new Date(booking.slot_date);
          const inMonth = slotDate >= startOfMonth && slotDate <= endOfMonth;
          if (inMonth) earnings += booking?.gamePrice || 0;
          return inMonth;
        });
        break;


      default:
        filtered = bookings.map((booking) => {
          earnings += booking?.gamePrice || 0;
          const slotDate = new Date(booking.slot_date);
          return slotDate;
        });
        break;
    }

    setFilteredBookingsset(filtered);
    setTotalEarning(earnings);
  };

  const filteredBookingsEarning = (filteredBookingsset?.length > 0 ? filteredBookingsset : bookings).filter((booking) => {
    const searchValue = searchQuery.toLowerCase();
    const slotDate = new Date(booking.slot_date);

    // Custom date range filter
    const isWithinDateRange =
      (!startDate || new Date(startDate) <= slotDate) &&
      (!endDate || slotDate <= new Date(endDate));

    return (
      // isWithinDateRange &&
      // (
      booking.booking_id?.toString().toLowerCase().includes(searchValue) ||
      booking.customerName?.toLowerCase().includes(searchValue) ||
      booking.game_id?.name?.toLowerCase().includes(searchValue) ||
      booking.players?.length?.toString().toLowerCase().includes(searchValue) ||
      booking.status?.toLowerCase().includes(searchValue) ||
      booking.slot_date?.toString().toLowerCase().includes(searchValue) ||
      booking.slot_id?.start_time?.toString().toLowerCase().includes(searchValue) ||
      booking.slot_id?.end_time?.toString().toLowerCase().includes(searchValue) ||
      booking.slot_id?.duration?.toString().toLowerCase().includes(searchValue)
      // )
    );
  });

  // Paginate the filtered data
  const paginatedDataBookingEarning = filteredBookingsEarning.slice(
    (currentPagebooking - 1) * itemsPerPage,
    currentPagebooking * itemsPerPage
  );

  const gameCollection = [
    { gameName: "PUBG", gamePlay: 5, price: 10, date: "01/01/2023" },
    { gameName: "Call of Duty", gamePlay: 3, price: 20, date: "01/01/2023" },
    { gameName: "Free Fire", gamePlay: 2, price: 15, date: "02/01/2023" },
    { gameName: "PUBG", gamePlay: 3, price: 20, date: "02/01/2023" },
  ];

  const groupedByDate = gameCollection?.reduce((acc, game) => {
    if (!acc[game.date]) {
      acc[game.date] = [];
    }
    acc[game.date].push(game);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate);

  const handleFetchEarning = async () => {
    try {
      const response = await dispatch(fetchEarning({ id: null, updatedData: requestData })).unwrap();
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };

  const handleFetchCommission = async () => {
    try {
      const response = await dispatch(getGamesCommission({ updatedData: requestData })).unwrap();
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };

  const handleFetchEarningDay = async () => {
    try {
      const response = await dispatch(fetchEarning({ cafeId: cafeId, updatedData: requestData })).unwrap();
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };

  const filterBookingsEarning = async (eventKey = selectedItem, id = selectedGameId) => {
    setSelectedItem(eventKey);
    setSelectedGameId(id);

    let updatedData = {
      cafeId: cafeId,
      startDate: today,
      endDate: today,
      gameId: id === 'All' ? null : id, // If All, no filter on game
    };

    if (eventKey === "Current Month") {
      updatedData.startDate = monthStartDate;
      updatedData.endDate = monthEndDate;
    } else if (eventKey === "This Week") {
      updatedData.startDate = weekStartDate;
      updatedData.endDate = weekEndDate;
    } else if (eventKey === "Today") {
      updatedData.startDate = today;
      updatedData.endDate = today;
    } else if (eventKey === "Custom Date") {
      updatedData.startDate = customStartDate;
      updatedData.endDate = customEndDate;
    }

    setRequestData(updatedData);

    try {
      const response = await dispatch(fetchEarning({ id: null, updatedData })).unwrap();
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };

  const dataToDisplay = filteredEarningData?.length > 0 ? filteredEarningData : earningData;
  const indexOfLastItem = currentPageEarning * itemsPerPageEarning;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageEarning;
  const currentItems = dataToDisplay?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPagesEarning = Math.ceil(dataToDisplay?.length / itemsPerPageEarning);

  const handlePageChange = (pageNumber) => {
    setCurrentPageEarning(pageNumber);
  };

  const handleGameIDPass = async (id) => {
    let updatedData = {
      cafeId: cafeId,
      startDate: today,
      endDate: today,
      gameId: id,
    };

    try {
      const response = await dispatch(fetchEarning({ id: null, updatedData })).unwrap();
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }

  };


  const commissionDataArray = commission?.data || [];
  const totalPagesCommission = Math.ceil(commissionDataArray.length / itemsPerPageCommission);
  const indexOfLastCommission = currentPageCommission * itemsPerPageCommission;
  const indexOfFirstCommission = indexOfLastCommission - itemsPerPageCommission;
  const currentCommissionItems = commissionDataArray.slice(indexOfFirstCommission, indexOfLastCommission);








  const commissionData = async (eventKey = selectedItem, id = selectedGameId) => {

    console.log("eventKey", eventKey);
    setSelectedItem(eventKey);
    setSelectedGameId(id);

    let updatedData = {
      cafeId: cafeId,
      startDate: today,
      endDate: today,
      game: id === 'All' ? null : id, // If All, no filter on game
    };

    if (eventKey === "Current Month") {
      updatedData.filter = "this_month",
        updatedData.startDate = monthStartDate;
      updatedData.endDate = monthEndDate;
    } else if (eventKey === "This Week") {
      updatedData.filter = "this_week";
      updatedData.startDate = weekStartDate;
      updatedData.endDate = weekEndDate;
    } else if (eventKey === "Today") {
      updatedData.filter = "today";
      updatedData.startDate = today;
      updatedData.endDate = today;
    } else if (eventKey === "Custom Date") {
      updatedData.filter = "custom_date";
      updatedData.startDate = customStartDate;
      updatedData.endDate = customEndDate;
    }

    setCommissionFilter(updatedData);

    try {
      const response = await dispatch(getGamesCommission({ cafeId, updatedData })).unwrap();
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };





  console.log("commission data", commission)


  return (
    <Container fluid>
      <Row className="my-5">
        <Col sm={4} className="pe-1 mb-4">
          <Card className="py-3 mx-2 rounded-4 my-3 " style={{ backgroundColor: "white" }}>
            <div className="d-flex flex-column align-items-start mx-3">
              <h5 className="text-start " style={{ fontSize: "18px", fontWeight: "600" }}>Cafe Details</h5>

            </div>
            <div className="d-flex flex-column align-items-start mx-3 my-3">

              <Image src={Rectangle389} alt="Cafe Image" className="mb-3" style={{ width: "100%", objectFit: "cover" }} />
            </div>
            <div className="d-flex justify-content-between align-items-center mx-3 " style={{ marginBottom: '10px' }} >
              <h5
                className="text-start"
                style={{
                  fontWeight: 500,
                  fontSize: "21px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#333333"
                }}
              >
                {cafe.cafe_name}
              </h5>

              <div className="d-flex flex-column align-items-end" onClick={() => setShowCanvasEditCafe(true)} style={{ objectFit: "cover", cursor: "pointer" }} >
                <Image src={edit} alt="edit" className="mb-3" />
              </div>


            </div>


            <Row className="mx-2 d-flex justify-content-between flex-wrap">

              {/* name */}
              <Col sm={4} xs={4} className="my-2 ">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Name :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2 ">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.name || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="my-2">
                <h1 className="text-start " style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Owner  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2">
                {/* <div className="d-flex align-items-center"> */}
                {/* <Image
                    src={profile}
                    alt="Cafe Image"
                    className="me-1 "
                    style={{ width: "21%", objectFit: "cover", borderRadius: "50%" }}
                  /> */}
                <p
                  className=" text-start"
                  style={{ fontWeight: 700, fontSize: "16px", lineHeight: "100%", letterSpacing: "100%", color: "#0062FF" }}
                >
                  {cafe?.name || '---'}
                </p>
                {/* </div> */}
              </Col>
              <Col sm={4} xs={4} className="my-2 ">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Address :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2  ">
                <p className="text-start " style={{ fontWeight: 400, fontSize: "16px", lineHeight: "20px" }}>
                  {cafe?.address || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="my-2">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Contact :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.contact_no || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="my-2">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Office Contact  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.officeContactNo || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="my-2">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  GST No :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.gstNo || '---'}
                </p>
              </Col>

              {/* panNo */}
              <Col sm={4} xs={4} className="my-2">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  PAN No :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.panNo || '---'}
                </p>
              </Col>

              <Col sm={4} xs={4} className="my-2">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  EMAIL  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.email || '---'}
                </p>
              </Col>

              <Col sm={4} xs={4} className="my-2">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  WEBSITE  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="my-2">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "20px", letterSpacing: "0%" }}>
                  {cafe?.website_url || '---'}
                </p>
              </Col>

            </Row>




            <Row className="justify-content-center align-items-center text-center " style={{ marginTop: "110px", marginBottom: "20px" }}>
              <Col xs="2" sm={4} className="my-1">
                {/* <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                  <Image src={call} alt="CafeCall" className="mx-1 my-2 " style={{ objectFit: "cover", width: "19.65px", height: "19.65px" }} />
                </Button> */}

              </Col>
              <Col xs="2" sm={4} className="my-1">
                {/* <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                  <Image src={Notification} alt="CafeCall" className="mx-1 my-2 " style={{ objectFit: "cover", width: "19.65px", height: "19.65px" }} />
                </Button> */}

              </Col>
              <Col xs="2" sm={4} className="my-1">
                {/* <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                  <Image src={Message} alt="CafeCall" className="mx-0 my-2 " style={{ objectFit: "cover", width: "23.63px", height: "18.38px" }} />
                </Button> */}

              </Col>
              {/* <Col sm={12} className="d-flex justify-content-center my-5">  </Col> */}

              <Col sm={12} className="d-flex justify-content-center mt-3 ">
                <h4 className="text-center " style={{ fontSize: "16px", fontWeight: "500", color: "#0062FF", cursor: "pointer" }}
                  onClick={() => setShowModalForwordPassword(true)}
                >Reset Password ?
                </h4>
              </Col >


            </Row>


          </Card>
        </Col>

        <Col sm={8} className="mb-4">


          <Card className="my-2 mx-0 rounded-4 my-3 " style={{ backgroundColor: "white" }}>

            <Nav
              variant="tabs"
              activeKey={activeKey}
              onSelect={(selectedKey) => setActiveKey(selectedKey)}
              className="mx-3 border-0"
              style={{ borderBottom: 'none' }}
            >
              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="gallary"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'gallary' ? '600' : '400',
                      fontSize: '16px',
                      color: activeKey === 'gallary' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',

                    }}
                  >
                    Image
                  </div>
                </Nav.Link>
                {activeKey === 'gallary' && (
                  <div

                    style={{
                      margin: '0 15px ',
                      width: '40%',
                      height: '2px',
                      backgroundColor: '#0d6efd',
                      borderRadius: '3px',

                    }}
                  />
                )}
              </Nav.Item>

              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="Game"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'Game' ? '600' : '400',
                      fontSize: '16px',
                      color: activeKey === 'Game' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',
                    }}
                  >
                    Games
                  </div>
                </Nav.Link>
                {activeKey === 'Game' && (
                  <div
                    style={{
                      margin: '0 15px ',
                      width: '40%',
                      height: '2px',
                      backgroundColor: '#0d6efd',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Nav.Item>

              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="Membership"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'Membership' ? '600' : '400',
                      fontSize: '16px',
                      color: activeKey === 'Membership' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',
                    }}
                  >
                    Membership
                  </div>
                </Nav.Link>
                {activeKey === 'Membership' && (
                  <div

                    style={{
                      margin: '0 15px ',
                      width: '30%',
                      height: '2px',
                      backgroundColor: '#0d6efd',
                      borderRadius: '2px',

                    }}
                  />
                )}
              </Nav.Item>

              {/* Client List */}
              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="Client"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'Client' ? '600' : '400',
                      fontSize: '16px',
                      color: activeKey === 'Client' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',
                    }}
                  >
                    Clients
                  </div>
                </Nav.Link>
                {activeKey === 'Client' && (
                  <div

                    style={{
                      margin: '0 18px ',
                      width: '40%',
                      height: '2px',
                      backgroundColor: '#0d6efd',
                      borderRadius: '2px',

                    }}
                  />
                )}
              </Nav.Item>
              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="Booking"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'Booking' ? '600' : '400',
                      fontSize: '16px',
                      color: activeKey === 'Booking' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',
                    }}
                  >
                    Bookings
                  </div>
                </Nav.Link>
                {activeKey === 'Booking' && (
                  <div

                    style={{
                      margin: '0 18px ',
                      width: '40%',
                      height: '2px',
                      backgroundColor: '#0d6efd',
                      borderRadius: '2px',

                    }}
                  />
                )}
              </Nav.Item>
              {/* earning  */}
              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="earning"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                  onClick={handleFetchEarning}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'earning' ? '600' : '400',
                      fontSize: '16px',
                      color: activeKey === 'earning' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',
                    }}
                  >
                    Earning
                  </div>
                </Nav.Link>
                {activeKey === 'earning' && (
                  <div

                    style={{
                      margin: '0 18px ',
                      width: '40%',
                      height: '2px',
                      backgroundColor: '#0d6efd',
                      borderRadius: '2px',

                    }}
                  />
                )}
              </Nav.Item>

              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="commission"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                  onClick={handleFetchCommission}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'commission' ? '600' : '400',
                      fontSize: '16px',
                      color: activeKey === 'commission' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',
                    }}
                  >
                    Commission
                  </div>
                </Nav.Link>
                {activeKey === 'commission' && (
                  <div
                    style={{
                      margin: '0 18px ',
                      width: '40%',
                      height: '2px',
                      backgroundColor: '#0d6efd',
                      borderRadius: '2px',

                    }}
                  />
                )}
              </Nav.Item>
            </Nav>

          </Card>


          <Card className="my-2 rounded-4 my-3 h-100 " style={{ backgroundColor: "white", maxHeight: '910px', overflowY: 'auto' }} >


            {/* gallary Image  */}

            <div className="mx-2">
              {activeKey === 'gallary' && (
                <Col sm={12} className="my-3 mx-1">

                  {
                    loadingMain || !cafe ? (
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    ) : (

                      <Row className="align-items-center ">


                        <Col sm={6} className="my-2"></Col>
                        <Col sm={6} className="d-flex justify-content-sm-end justify-content-end my-2 ">
                          {/* <h5
                            className="d-flex align-items-center fw-semibold mx-3"
                            style={{
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#00AF0F",
                            }}
                        
                          >
                            <Image
                              src={Add}
                              alt="CafeCall"
                              className="me-2"
                              style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }}
                            />
                            ADD
                          </h5> */}
                          <span className="mx-2"></span>
                        </Col>
                        {/* Gallery */}
                        <Col sm={12} className="mx-0">
                          <Row className="g-3 mx-1 ">
                            {cafe?.cafeImage?.length > 0 ? (
                              [...cafe.cafeImage].reverse().map((img, index) => (
                                <Col key={index} xs={6} sm={4} md={3} lg={3}>
                                  <div className="w-100 h-100 d-flex justify-content-center "
                                  // style={{ borderRadius: "10px", border: "2px solid #00AF0F" }}
                                  >
                                    <Image
                                      src={`${baseURL}/${img}`}
                                      onError={(e) => (e.target.src = Rectangle389)}
                                      className=" img-fluid"
                                      style={{
                                        objectFit: "cover",
                                        height: "10rem",
                                        width: "100%",
                                        borderRadius: "10px",
                                        // border: "2px solid rgb(19, 39, 21)"
                                      }}
                                      alt={`Gallery ${index + 1}`}
                                    />
                                  </div>
                                </Col>
                              ))
                            ) : (
                              <Col xs={12}>
                                <p className="text-center">No gallery images found.</p>
                              </Col>
                            )}

                            {/* Dotted Add Image Box */}
                            {/* <Col xs={6} sm={2} md={3} lg={2} className="">
                          <div
                            className="h-100 d-flex justify-content-center align-items-center"
                            style={{
                              border: "2px dotted #00AF0F",
                              borderRadius: "8px",
                              minHeight: "10rem",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <Image
                              src={Add}
                              alt="Add"
                              className="img-fluid"
                              style={{ maxWidth: "50%", height: "auto" }}
                            />
                          </div>
                        </Col> */}
                          </Row>
                        </Col>
                      </Row>


                    )}

                </Col>
              )}
              {/* Game  */}
              {activeKey === 'Game' && (
                <Row className=" justify-content-start w-100 my-3 mx-1">
                  <Col sm={12} className="d-flex justify-content-sm-end justify-content-end  ">

                    <h5
                      className="d-flex align-items-end fw-semibold mx-3 "
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#00AF0F",

                      }}
                      onClick={() => setShowModalAdd(true)}
                    >
                      <Image
                        src={Add}
                        alt="CafeCall"
                        className="me-1"
                        style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }}
                      />
                      <span className="align-self-end mb-1">ADD</span>
                    </h5>
                    <AddGamesOffcanvas show={showModalAdd} handleClose={() => setShowModalAdd(false)} cafeId={cafeId} selectedGameDetails={selectedGameDetails} />


                  </Col>
                  {
                    lodergames || !games ? (
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    ) : (

                      <>

                        {games?.length > 0 ? (
                          [...games].reverse().map((game, index) => (
                            <Col className="my-2 " key={index} xs={12} sm={6} md={6} lg={6} >
                              <Card className="rounded-4 h-100  gsap-card-move " style={{
                                borderColor: "#E4E4E4", borderWidth: "2px",
                                cursor: "pointer",

                              }} onClick={() => handleOpenGameDetails(game?._id)}

                              >

                                <Card.Img
                                  src={`${baseURL}/${game.gameImage || Rectangle389}`}
                                  onError={(e) => (e.target.src = Rectangle389)}
                                  className="img-fluid rounded-4 my-2 mx-auto d-block"
                                  style={{
                                    width: "90%",
                                    height: "250px",
                                    maxHeight: "250px",

                                  }}
                                  alt="Game Image"
                                />

                                <Card.Body>
                                  <Card.Title style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>{game.name || "Game Title"}</Card.Title>
                                  <Card.Text>
                                    <Row className="my-2">
                                      {/* <Col xs={12} className="d-flex gap-2 justify-content-center mb-3">
                                            <Button className="border-0 rounded-3" size="sm" style={{ backgroundColor: "#2C99FF" }}>Single</Button>
                                            <Button className="border-0 rounded-3" size="sm" style={{ backgroundColor: "#00C110" }}>Refundable</Button>
                                          </Col> */}
                                      <Col sm={6} className="my-1"><h6 className="text-primary fw-semibold" style={{ fontSize: "14px", fontWeight: "600" }}>Price:</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="fw-medium text-start" style={{ fontSize: "14px", fontWeight: "500" }}>₹ {game?.price || 1000}</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="text-primary fw-semibold" style={{ fontSize: "14px", fontWeight: "600" }}>Zone:</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="fw-medium text-start" style={{ fontSize: "14px", fontWeight: "500" }}>{game?.zone || "A"}</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="text-primary fw-semibold" style={{ fontSize: "14px", fontWeight: "600" }}>Size:</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="fw-medium text-start" style={{ fontSize: "14px", fontWeight: "500" }}>{game?.size || 2}</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="text-primary fw-semibold" style={{ fontSize: "14px", fontWeight: "600" }}>Players:</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="fw-medium text-start" style={{ fontSize: "14px", fontWeight: "500" }}>{game?.players || 2}</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="text-primary fw-semibold" style={{ fontSize: "14px", fontWeight: "600" }}>Playlater:</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="fw-medium text-start" style={{ fontSize: "14px", fontWeight: "500" }}>{game?.payLater ? "Yes" : "No"}</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="text-primary fw-semibold" style={{ fontSize: "14px", fontWeight: "600" }}>Cancellation:</h6></Col>
                                      <Col sm={6} className="my-1"><h6 className="fw-medium text-start" style={{ fontSize: "14px", fontWeight: "500" }}>{game?.cancellation ? "Yes" : "No"}</h6></Col>
                                    </Row>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <p className="text-center">No games available</p>
                        )}

                      </>


                    )}
                </Row>
              )}
              {/* Membership Cards */}
              {activeKey === "Membership" && (
                <Row className=" d-flex flex-wrap justify-content-center p-2">

                  <Col sm={6} className=" alingn-items-start">

                  </Col>
                  <Col sm={6} className=" alingn-items-end my-2 ">
                    <div className="d-flex justify-content-end">
                      <h5 className="text-end mx-3" style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#00AF0F" }}
                        onClick={() => setShowMembershipAdd(true)}
                      >
                        <Image src={Add} alt="CafeCall" className="mx-1  " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                        ADD</h5>

                      <AddMembershipOffcanvas show={showMembershipAdd} handleClose={() => setShowMembershipAdd(false)} cafeId={cafeId} selectedMembership={selectedMembership} />





                    </div>
                  </Col>
                  {
                    lodermembership || !memberships ? (

                      <div className="text-center py-5">
                        <Loader />
                      </div>

                    ) : (
                      <>
                        {memberships && memberships?.length > 0 ? (
                          <Row className="d-flex flex-wrap justify-content-start mx-2 ">
                            {[...memberships].reverse().map((membership, index, arr) => (
                              <Col
                                sm={6}
                                xs={12}
                                key={index}
                              >

                                <Card className="py-3 px-2 w-100 my-3">
                                  <Row>
                                    {/* Image Section */}
                                    <Col xs={6} sm={5} className="text-center mb-3 mb-sm-0">
                                      <Image
                                        src={FrameKing}
                                        alt="CafeCall"
                                        className="rounded-circle"
                                        style={{ objectFit: "cover", width: "68px", height: "68px" }}
                                      />
                                    </Col>

                                    {/* Membership Name & Button */}
                                    <Col xs={6} sm={7} className="text-sm-start text-center mb-3 mb-sm-0">
                                      <h5 className="mb-2" style={{ fontSize: "16px", fontWeight: "500" }}>
                                        {membership?.name || "Gold Membership"}
                                      </h5>
                                      <Button
                                        className="border-0 rounded-3 text-white"
                                        size="sm"
                                        style={{ backgroundColor: "#2C99FF" }}
                                      >
                                        Expire in {membership?.validity || "1 Month"}
                                      </Button>
                                    </Col>

                                    {/* Membership Details */}
                                    <Col xs={12}>
                                      <h6 className="mt-4" style={{ fontSize: "16px", fontWeight: "500" }}>
                                        Membership Details
                                      </h6>
                                      <ul className="text-muted mb-2 ps-3" style={{ fontSize: "14px", fontWeight: "400" }}>
                                        {membership?.details?.map((detail, i) => (
                                          <li key={i}>{detail}</li>
                                        ))}
                                      </ul>

                                      <h6 className="mt-4" style={{ fontSize: "16px", color: "#00C843", fontWeight: "600" }}>
                                        Price: ₹ {membership?.price || 1000}
                                      </h6>
                                    </Col>
                                  </Row>
                                </Card>


                              </Col>
                            ))}
                          </Row>
                        ) : (
                          <p className="text-center"> No members available</p>
                        )}
                      </>
                    )
                  }





                </Row>
              )}
              {activeKey === "Client" && (
                <Row className="d-flex flex-wrap justify-content-center p-2 mx-1">
                  <Col sm={6} className=" alingn-items-start">
                    {/* <h5 className="text-start " style={{ fontSize: "18px", fontWeight: "600" }}>Client List</h5> */}
                  </Col>
                  <Col sm={6} className=" alingn-items-end ">
                    <div className="d-flex justify-content-end">
                      <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                      />

                    </div>
                  </Col>
                  <Col sm={12} className="my-3 alingn-items-end">

                    <Table hover responsive >
                      <thead className="table-light ">
                        <tr>
                          <th className="fw-bold">S/N</th>
                          <th className="fw-bold"> Name </th>
                          <th className="fw-bold">Contact Number</th>
                          <th className="fw-bold">Email</th>
                          <th className="fw-bold">Creadit Limit</th>
                          <th className="fw-bold">Membership</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(paginatedData?.length > 0 ? paginatedData : clientList).map((client, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td><span className="text-primary fw-bold " style={{ cursor: "pointer" }} onClick={() => handleClientClick(client._id)}>{client.name}</span></td>
                            <td>{client.contact_no}</td>
                            <td>{client.email || "---"}</td>
                            <td> ₹ {client.creditLimit}</td>
                            <td>{client.membership || "---"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>




                    <div className="d-flex justify-content-end align-items-center my-4">
                      {/* Previous Button */}
                      <Button
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #dee2e6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                        }}
                        onClick={handlePrevclient}
                        disabled={currentPage === 1}
                      >
                        <GrFormPrevious style={{ color: "black", fontSize: "20px" }} />
                      </Button>

                      {/* Page Numbers */}
                      <span className="d-flex align-items-center mx-2 gap-2">
                        <Button
                          style={{
                            backgroundColor: currentPage === 1 ? "#0062ff" : "white",
                            color: currentPage === 1 ? "white" : "black",
                            border: "1px solid #dee2e6",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.6rem",
                          }}
                        >
                          1
                        </Button>

                        <Button
                          style={{
                            backgroundColor: currentPage === 2 ? "#0062ff" : "white",
                            color: currentPage === 2 ? "white" : "black",
                            border: "1px solid #dee2e6",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.6rem",
                          }}
                        >
                          2
                        </Button>

                        <span style={{ fontSize: "16px", fontWeight: "500" }}>...</span>

                        <Button
                          style={{
                            backgroundColor: currentPage === totalPages ? "#0062ff" : "white",
                            color: currentPage === totalPages ? "white" : "black",
                            border: "1px solid #dee2e6",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.6rem",
                          }}
                        >
                          {totalPages}
                        </Button>
                      </span>

                      {/* Next Button */}
                      <Button
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #dee2e6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                        }}
                        onClick={handleNextclient}
                        disabled={currentPage === totalPages}
                      >
                        <MdOutlineNavigateNext style={{ color: "black", fontSize: "20px" }} />
                      </Button>
                    </div>

                  </Col>
                </Row>
              )}
              {activeKey === "Booking" && (
                <Row className="d-flex flex-wrap justify-content-center p-2 mx-1">
                  <Col sm={6} className=" alingn-items-start">

                  </Col>
                  <Col sm={6} className=" alingn-items-end ">
                    <div className="d-flex justify-content-end">
                      <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQueryBooking}
                        onChange={(e) => setSearchQueryBooking(e.target.value)}

                      />

                    </div>
                  </Col>
                  <Col sm={12} className="my-3 alingn-items-end">
                    <Table hover responsive >
                      <thead className="table-light ">
                        <tr>
                          <th className="fw-bold">S/N</th>
                          <th className="fw-bold"> Booking Id </th>
                          <th className="fw-bold">Name 77</th>
                          <th className="fw-bold">Sports</th>
                          <th className="fw-bold">Players</th>
                          <th className="fw-bold">Mode</th>
                          <th className="fw-bold">Time/Date</th>
                          <th className="fw-bold"> Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(paginatedDataBooking?.length > 0 ? paginatedDataBooking : filteredBookings)?.map((booking, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td><span className="text-primary fw-bold" style={{ cursor: "pointer" }}
                              onClick={() => handleBookingClick(booking._id)}
                            >{booking.booking_id}</span></td>
                            <td>{booking.customerName}</td>
                            <td>{booking.game_id?.name}</td>
                            <td>{booking.players?.length || "---"}</td>

                            {/* <td>{booking.status || "---"}</td> */}
                            <td>
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
                            </td>
                            <td>
                              {formatDate(booking.slot_date)}<br />

                              {/* {
                                booking?.booking_type === "Regular"
                                  ? `${convertTo12Hour(booking?.slot_id?.start_time)} - ${convertTo12Hour(booking?.slot_id?.end_time)}`
                                  : `${convertTo12Hour(booking?.custom_slot?.start_time)} - ${convertTo12Hour(booking?.custom_slot?.end_time)}`
                              } */}

                              {convertTo12Hour(booking?.slot_id?.start_time || booking?.custom_slot?.start_time)}
                              - {convertTo12Hour(booking?.slot_id?.end_time || booking?.custom_slot?.end_time)}

                            </td>
                            <td>
                              ₹ {booking.gamePrice}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-end align-items-center my-4">
                      {/* Previous Button */}
                      <Button
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #dee2e6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                        }}
                        onClick={handlePrevclientBooking}
                        disabled={currentPagebooking === 1}
                      >
                        <GrFormPrevious style={{ color: "black", fontSize: "20px" }} />
                      </Button>
                      {/* Page Numbers */}
                      <span className="d-flex align-items-center mx-2 gap-2">
                        <Button
                          style={{
                            backgroundColor: currentPagebooking === 1 ? "#0062ff" : "white",
                            color: currentPagebooking === 1 ? "white" : "black",
                            border: "1px solid #dee2e6",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.6rem",
                          }}
                        >
                          1
                        </Button>
                        <Button
                          style={{
                            backgroundColor: currentPagebooking === 2 ? "#0062ff" : "white",
                            color: currentPagebooking === 2 ? "white" : "black",
                            border: "1px solid #dee2e6",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.6rem",
                          }}
                        >
                          2
                        </Button>
                        <span style={{ fontSize: "16px", fontWeight: "500" }}>...</span>
                        <Button
                          style={{
                            backgroundColor: currentPagebooking === totalPagesboking ? "#0062ff" : "white",
                            color: currentPagebooking === totalPagesboking ? "white" : "black",
                            border: "1px solid #dee2e6",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.6rem",
                          }}
                        >
                          {totalPagesboking}
                        </Button>
                      </span>

                      {/* Next Button */}
                      <Button
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #dee2e6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                        }}
                        onClick={handleNextclientBooking}
                        disabled={currentPagebooking === totalPagesboking}
                      >
                        <MdOutlineNavigateNext style={{ color: "black", fontSize: "20px" }} />
                      </Button>
                    </div>

                  </Col>
                </Row>
              )}
              {/* earning */}

              {activeKey === "earning" && (
                <Row className="d-flex flex-wrap justify-content-between p-2 mx-1 my-3" >
                  <Col sm={5} className=" justify-content-start align-items-start">
                    <Row className="align-items-center">
                      <Col sm={6} className="mb-2 mb-sm-0">
                        <DropdownButton
                          id="dropdown-item-button"
                          title={selectedItem || "Select"}
                          variant="outline-dark"
                          onSelect={(eventKey) => filterBookingsEarning(eventKey, selectedGameId)}
                          style={{ width: '100%' }}
                        >
                          <Dropdown.Item as="button" eventKey="" disabled>Select</Dropdown.Item>
                          <Dropdown.Item eventKey="Today" as="button">Today</Dropdown.Item>
                          <Dropdown.Item eventKey="This Week" as="button">This Week</Dropdown.Item>
                          <Dropdown.Item eventKey="Current Month" as="button">Current Month</Dropdown.Item>
                          <Dropdown.Item eventKey="Custom Date" as="button">Custom Date</Dropdown.Item>
                        </DropdownButton>
                      </Col>

                      <Col sm={6}>
                        <Form.Select
                          aria-label="Default select example"
                          value={selectedGameId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            setSelectedGameId(selectedId);
                            filterBookingsEarning(selectedItem, selectedId); // Pass current selectedItem (Today/This Week) + new Game ID
                          }}
                        >
                          <option value="All">All</option>
                          {games?.map((game) => (
                            <option key={game._id} value={game._id}>
                              {game.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={6} className="d-flex justify-content-end my-2">
                    <h4 className="my-3" style={{ fontWeight: "600", fontSize: "16px", color: "#0062FF" }}>
                      Total Earning : ₹ {totalEarning || earningData?.reduce((sum, booking) => sum + (booking?.totalAmountPaid || 0), 0)}
                    </h4>
                  </Col>
                  <Col sm={5} className=" alingn-items-end my-2">
                    <div className="d-flex justify-content-end">
                      <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </Col>

                  {selectedItem === "Custom Date" && (
                    <Col sm={7} className="d-flex justify-content-end my-2">
                      <Form.Control
                        type={customStartDate ? "date" : "text"}
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        className="me-2"
                        placeholder="Start Date"
                      />
                      <Form.Control
                        type={customEndDate ? "date" : "text"}
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        placeholder="End Date"
                        min={customStartDate}
                      />
                      {customStartDate && customEndDate && (
                        <Button className="ms-2" onClick={() => filterBookingsEarning("Custom Date")}>
                          Filter
                        </Button>
                      )}
                    </Col>
                  )}
                  <Col sm={12} className="my-3 alingn-items-end">
                    <Table hover responsive>
                      <thead className="table-light">
                        <tr>
                          <th className="fw-bold">S.No</th>
                          <th className="fw-bold">Date</th>
                          <th className="fw-bold">Game Collection</th>
                          <th className="fw-bold">Total </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(currentItems?.length > 0 ? currentItems : (filteredEarningData?.length > 0 ? filteredEarningData : earningData)).length > 0 ? (
                          (currentItems?.length > 0 ? currentItems : (filteredEarningData?.length > 0 ? filteredEarningData : earningData)).map((date, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="me-3 my-2" style={{ width: "100px", display: "inline-block" }}>
                                  {date.date}
                                </span>
                              </td>
                              <td>
                                {/* {Object.entries(date?.games).map(([gameName, gameDetails], idx) => ( */}
                                {Object.entries(date?.games || {}).map(([gameName, gameDetails], idx) => (
                                  <div key={idx} className="my-2">
                                    <span className="me-3" style={{ width: "190px", display: "inline-block" }}>
                                      {gameName}
                                    </span>
                                    <span className="me-3" style={{ width: "80px", display: "inline-block" }}>
                                      {gameDetails.count} play
                                    </span>
                                    <span style={{ width: "80px", display: "inline-block" }}>
                                      ₹ {gameDetails.amountPaid}
                                    </span>
                                  </div>
                                ))}
                              </td>
                              <td>₹ {date.totalAmountPaid}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-3">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>

                    </Table>
                    {totalPagesEarning > 1 && (
                      <Pagination className="justify-content-end my-5">
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPageEarning - 1)}
                          disabled={currentPageEarning === 1}
                        />

                        {/* Show the first page */}
                        {currentPageEarning > 3 && (
                          <Pagination.Item onClick={() => handlePageChange(1)}>
                            1
                          </Pagination.Item>
                        )}

                        {/* Show "..." if the pages are more than 3 and the current page isn't too close to the beginning */}
                        {currentPageEarning > 3 && <Pagination.Ellipsis />}

                        {/* Show the current page and a range of surrounding pages */}
                        {[...Array(totalPagesEarning)].map((_, idx) => {
                          const pageNum = idx + 1;

                          if (
                            (pageNum >= currentPageEarning - 1 && pageNum <= currentPageEarning + 1) ||
                            pageNum === 1 ||
                            pageNum === totalPagesEarning
                          ) {
                            return (
                              <Pagination.Item
                                key={pageNum}
                                active={pageNum === currentPageEarning}
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </Pagination.Item>
                            );
                          }

                          return null;
                        })}

                        {/* Show "..." if the pages are more than 3 and the current page isn't too close to the end */}
                        {currentPageEarning < totalPagesEarning - 2 && <Pagination.Ellipsis />}

                        {/* Show the last page */}
                        {currentPageEarning < totalPagesEarning - 2 && (
                          <Pagination.Item onClick={() => handlePageChange(totalPagesEarning)}>
                            {totalPagesEarning}
                          </Pagination.Item>
                        )}

                        <Pagination.Next
                          onClick={() => handlePageChange(currentPageEarning + 1)}
                          disabled={currentPageEarning === totalPagesEarning}
                        />
                      </Pagination>
                    )}
                  </Col>
                </Row>
              )}

              {/* Commission */}
              {activeKey === "commission" && (
                <Row className="d-flex flex-wrap justify-content-between p-2 mx-1 my-3" >
                  <Col sm={5} className=" justify-content-start align-items-start">
                    <Row className="align-items-center">
                      <Col sm={6} className="mb-2 mb-sm-0">
                        <DropdownButton
                          id="dropdown-item-button"
                          title={commissionSelectedItem || "Select"}
                          variant="outline-dark"
                          onSelect={(eventKey) => {
                            setCommissionSelectedItem(eventKey);
                            commissionData(eventKey, commissionSelectedGameId);
                          }}
                          style={{ width: '100%' }}
                        >
                          <Dropdown.Item as="button" eventKey="" disabled>Select</Dropdown.Item>
                          <Dropdown.Item eventKey="Today" as="button">Today</Dropdown.Item>
                          <Dropdown.Item eventKey="This Week" as="button">This Week</Dropdown.Item>
                          <Dropdown.Item eventKey="Current Month" as="button">Current Month</Dropdown.Item>
                          <Dropdown.Item eventKey="Custom Date" as="button">Custom Date</Dropdown.Item>
                        </DropdownButton>
                      </Col>

                      <Col sm={6}>
                        {/* <Form.Select
                          aria-label="Default select example"
                          value={selectedGameId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            setSelectedGameId(selectedId);
                            commissionData(selectedItem, selectedId); // Pass current selectedItem (Today/This Week) + new Game ID
                          }}
                        >
                          <option value="All">All</option>
                          {games?.map((game) => (
                            <option key={game._id} value={game._id}>
                              {game.name}
                            </option>
                          ))}
                        </Form.Select> */}

                        <Form.Select
                          aria-label="Default select example"
                          value={commissionSelectedGameId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            setCommissionSelectedGameId(selectedId);
                            commissionData(commissionSelectedItem, selectedId);
                          }}
                        >
                          <option value="All">All</option>
                          {games?.map((game) => (
                            <option key={game._id} value={game._id}>
                              {game.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={6} className="d-flex justify-content-end my-2">
                    <h4 className="my-3" style={{ fontWeight: "600", fontSize: "16px", color: "#0062FF" }}>
                      Total Commission : ₹ {Math.round(commission?.totalCommission) || 0}
                    </h4>
                  </Col>
                  <Col sm={5} className=" alingn-items-end my-2">
                    <div className="d-flex justify-content-end">
                      <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </Col>

                  {selectedItem === "Custom Date" && (
                    <Col sm={7} className="d-flex justify-content-end my-2">
                      <Form.Control
                        type={customStartDate ? "date" : "text"}
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        className="me-2"
                        placeholder="Start Date"
                      />
                      <Form.Control
                        type={customEndDate ? "date" : "text"}
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        placeholder="End Date"
                        min={customStartDate}
                      />
                      {customStartDate && customEndDate && (
                        <Button className="ms-2" onClick={() => commissionData("Custom Date")}>
                          Filter
                        </Button>
                      )}
                    </Col>
                  )}
                  <Col sm={12} className="my-3 alingn-items-end">
                    <Table hover responsive>
                      <thead className="table-light">
                        <tr>
                          <th className="fw-bold">S.No</th>
                          <th className="fw-bold">Game</th>
                          <th className="fw-bold">Commission</th>
                          {/* <th className="fw-bold">Total </th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {/* {commission?.data?.length > 0 ? (
                          (commission?.data).map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="me-3 my-2" style={{ width: "100px", display: "inline-block" }}>
                                  {data?.game_id?.name}
                                </span>
                              </td>
                              <td>
                                <span className="me-3 my-2" style={{ width: "100px", display: "inline-block" }}>
                                  ₹ {Math.round(data?.commission)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-3">
                              No Data Found
                            </td>
                          </tr>
                        )} */}

                        {currentCommissionItems.length > 0 ? (
                          currentCommissionItems.map((data, index) => (
                            <tr key={indexOfFirstCommission + index}>
                              <td>{indexOfFirstCommission + index + 1}</td>
                              <td>
                                <span className="me-3 my-2" style={{ width: "100px", display: "inline-block" }}>
                                  {data?.game_id?.name}
                                </span>
                              </td>
                              <td>
                                <span className="me-3 my-2" style={{ width: "100px", display: "inline-block" }}>
                                  ₹ {Math.round(data?.commission)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-3">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>

                    </Table>
                    {totalPagesCommission > 1 && (
                      <Pagination className="justify-content-end my-5">
                        <Pagination.Prev
                          onClick={() => setCurrentPageCommission(currentPageCommission - 1)}
                          disabled={currentPageCommission === 1}
                        />
                        {[...Array(totalPagesCommission)].map((_, idx) => (
                          <Pagination.Item
                            key={idx + 1}
                            active={idx + 1 === currentPageCommission}
                            onClick={() => setCurrentPageCommission(idx + 1)}
                          >
                            {idx + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next
                          onClick={() => setCurrentPageCommission(currentPageCommission + 1)}
                          disabled={currentPageCommission === totalPagesCommission}
                        />
                      </Pagination>
                    )}
                  </Col>
                </Row>
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <EditCafeOffcanvas
        show={showCanvasEditCafe}
        handleClose={() => setShowCanvasEditCafe(false)}
        cafeId={cafeId}
      />

      <ForwordPassword
        show={showModalForwordPassword}
        handleClose={() => setShowModalForwordPassword(false)}
        cafeId={cafeId}
      />
    </Container>
  );
};

export default ViewDetails;
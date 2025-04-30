import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  Card,
  Image,
  Modal,
  Container,
  Breadcrumb,
  ButtonGroup,
  Nav,
  Pagination,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGame,
  deleteGame,
  getGameById,
  getGames,
} from "../../../../store/slices/gameSlice";
import CreateSlot from "../Slots/CreateSlot";
import { deleteslot, getslots } from "../../../../store/slices/slotsSlice";
import { IoMdAdd } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import deleteIcon from '/assets/superAdmin/cafe/delete.png';
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png';
import MultiPlayers from '/assets/superAdmin/cafe/Multi-Players.png';
import RsHour from '/assets/superAdmin/cafe/RsHour.png';
import Cancellation from '/assets/superAdmin/cafe/Cancellation.png';
import discount from '/assets/superAdmin/cafe/discount.png';
import Players from '/assets/superAdmin/cafe/Players.png';
import Add from "/assets/superAdmin/cafe/formkit_addWhite.png";
import AddGreen from "/assets/superAdmin/cafe/formkit_add.png";
import mdiEdit from "/assets/superAdmin/cafe/mdi_edit.png";
import AddSlotOffcanvas from "../offcanvasCafe/addSlot";
import EditGameOffcanvas from "../offcanvasCafe/editGame";
import Loader from "../../../../components/common/Loader/Loader";
import gsap from "gsap";
import GameDeleteModal from "../modal/gameDelete";
import areaSize from '/assets/superAdmin/cafe/areaSize.png';
import payLater from '/assets/superAdmin/cafe/payLater.png';
import commission from '/assets/superAdmin/cafe/commission.png';
import { fetchCafes, fetchCafesID } from "../../../../store/slices/cafeSlice";
import { FaPlus } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import EditSlotOffcanvas from "../offcanvasCafe/editSlot";
import { fetchEarning, getBookings } from "../../../../store/AdminSlice/BookingSlice";

const GameDetailsCafe = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [showDameDetailsLoder, setShowDameDetailsLoder] = useState(<Loader />);
  const [showSlotLoder, setShowSlotLoder] = useState(true);
  const location = useLocation();
  const { gameId } = location.state || {};

  console.log("your game id here === 99", gameId);
  const [earningData, setEarningData] = useState([]);
  const [showAddSlotOffcanvas, setShowAddSlotOffcanvas] = useState(false);
  const [showEditGameOffcanvas, setShowEditGameOffcanvas] = useState(false);
  const [showGameDeleteModal, setShowGameDeleteModal] = useState(false);
  const [showEditSlotOffcanvas, setShowEditSlotOffcanvas] = useState(false);
  const [activeDay, setActiveDay] = useState("Sunday");
  const [activeKey, setActiveKey] = useState('slotTime');
  const [slotID, setSlotID] = useState(false);
  const [totalEarning, setTotalEarning] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Today");
  const [filteredEarningData, setFilteredEarningData] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState('All');
  const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
  const [today, setToday] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  });
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const bookings = useSelector((state) => state.bookings.bookings);
  console.log("booking details -- ", bookings);

const { games } = useSelector((state) => state.games);

  // const { game } = useSelector((state) => state.game);
  // useEffect(() => {
  //   dispatch(getGames(gameId));
  // })
  // console.log("your game here 0==", game);

  const { selectedGame } = useSelector((state) => state.games);
  const game = selectedGame?.data;
  const isSameGame = gameId === game?._id;
  const cafeId = selectedGame?.data?.cafe;
  const [requestData, setRequestData] = useState({
    cafeId: cafeId,
    startDate: today,
    endDate: today,
    gameId: gameId,
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
  console.log("earning -- ", dataEarning);
  useEffect(() => {
    dispatch(getBookings(cafeId));
  }, [dispatch, cafeId])


  useEffect(() => {
    if (gameId) {
      setShowDameDetailsLoder(true);
      dispatch(getGameById(gameId)).finally(() => setShowDameDetailsLoder(false));
      // dispatch(getGames()).finally(() => setShowDameDetailsLoder(false));

    }
  }, [isSameGame, dispatch]);


  console.log("selected game here 99", selectedGame?.data);
  const cafe_id = selectedGame?.data?.cafe;
  console.log("your cafeid here", cafe_id);

  // compare game id with selected game id

  console.log("your game here 1==", isSameGame);


  console.log("your game id here game getGameById ",);
  console.log("your cafe id game 99", gameId);








  // ------------------------- Time Slots -----------------------------

  const { slots } = useSelector((state) => state.slots);
  useEffect(() => {
    setShowSlotLoder(true);
    // dispatch(getslots(gameId));
    dispatch(getslots(gameId)).finally(() => setShowSlotLoder(false));
  }, [dispatch, gameId]);


  console.log("Form State slots Game Details 00:", slots);



  // const getDuration = 



  // ---------------------------  gsap  -----------------------------
  // useEffect(() => {
  //   // if (selectedGame?.data) {
  //   gsap.from(".game-detail-animate", {
  //     y: 50,
  //     delay: 3,
  //     duration: 1,

  //   }
  //   );
  //   // }
  // }, [selectedGame]);




  useEffect(() => {
    dispatch(fetchCafes(cafe_id));
  }, [cafe_id, dispatch]);

  const cafeDetails = useSelector((state) => state.cafes);
  console.log("cafe details game 11 00 ==", cafeDetails);

  // compare cafeId with cafeDetails.cafeId
  const isCafeIdMatch = cafeDetails.cafes?.find(cafe => cafe._id === cafe_id);
  console.log("isCafeIdMatch membership ==", isCafeIdMatch);



  const generateWeekdays = () => {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  };

  const weekdays = generateWeekdays();

  const handleEditClick = (slot_id) => {
    setShowEditSlotOffcanvas(true);
    setSlotID(slot_id);
  };


  const [isActive, setIsActive] = useState(true); // Default: active

  const handleToggleActive = async (slot_id) => {
    // if (!isActive) return; 
    try {
      await dispatch(deleteslot(slot_id)).unwrap();
      // slots();
      dispatch(getslots(gameId));
    } catch (err) {
      console.error("Delete failed", err);
    }

  };

  // --------------------------- Earning -----------------------------


 


  const filterBookingsEarning = async (eventKey = selectedItem, id = selectedGameId) => {
    console.log("eventKey == ", eventKey, "gameId == ", id);

    setSelectedItem(eventKey);
    setSelectedGameId(id);

    let updatedData = {
      cafeId: cafeId,
      startDate: today,
      endDate: today,
      // gameId: id === 'All' ? null : id, 
      gameId: gameId,
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
      console.log("Fetched Data:", response.data);
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };

  const dataToDisplay = filteredEarningData.length > 0 ? filteredEarningData : earningData;
  const indexOfLastItem = currentPageEarning * itemsPerPageEarning;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageEarning;
  const currentItems = dataToDisplay.slice(indexOfFirstItem, indexOfLastItem);

  const totalPagesEarning = Math.ceil(dataToDisplay.length / itemsPerPageEarning);

  const handlePageChange = (pageNumber) => {
    setCurrentPageEarning(pageNumber);
  };

  console.log("games 99 == 00", games);

  const handleGameIDPass = async (id) => {
    console.log('Selected Game ID:', id);
    let updatedData = {
      cafeId: cafeId,
      startDate: today,
      endDate: today,
      gameId: id,
    };

    try {
      const response = await dispatch(fetchEarning({ id: gameId, updatedData })).unwrap();
      console.log("Fetched Data:", response.data);
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }

  };

  const handleFetchEarning = async () => {

    let updatedData = {
      cafeId: cafeId,
      startDate: today,
      endDate: today,
      // gameId: id === 'All' ? null : id, 
      gameId: gameId,
    };

    try {
      const response = await dispatch(fetchEarning({ id: null, updatedData: updatedData })).unwrap();
      console.log("Fetched Data:", response.data);
      setEarningData(response.data);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };


  return (
    <Container fluid style={{ marginTop: "0px" }}>
      <Row className=" game-detail-animate " >
        <Card.Header className="fw-bold">
          <Row className="d-flex justify-content-between align-items-center  ">
            <Col sm={8} xs={12}>
              <Breadcrumb>
                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>Home</Breadcrumb.Item>
                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                  <Link to="/superadmin/cafe/viewdetails"
                    state={{ cafeId: cafeId }}>
                    Games Details
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Game</Breadcrumb.Item>

              </Breadcrumb>

            </Col>

            <Col sm={4} xs={12} className="mb-3">
              <Card className="game-card mx-2 my-1 rounded-4  text-center text-sm-start">
                <div className="d-flex flex-column flex-sm-row align-items-center">
                  <Image
                    src={Rectangle389}
                    alt="CafeCall"
                    className="rounded-circle img-fluid mb-2 mb-sm-0"
                    style={{ objectFit: "cover", width: "50px", height: "50px" }}
                  />
                  <div className="ms-sm-3 ">
                    <h5 className="text-primary " style={{ fontSize: "16px", fontWeight: "500" }}>
                      {isCafeIdMatch?.cafe_name}
                    </h5>
                  </div>
                </div>
              </Card>
            </Col>

            {/* <Button variant="primary" className="rounded-3" onClick={() => {
                dispatch(setSelectedGame(null));
                setFormData(null);
                setShowCanvas(true);
              }}>
                <Image src={Add} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                Create  Game
              </Button> */}

          </Row>
        </Card.Header>


        <Col sm={12} className="my-2">
          {
            showDameDetailsLoder || !selectedGame?.data ? (
              <div className="text-center py-5">
                <Loader />
              </div>
            ) : (

              <>



                <Card className=" ">

                  <Row className="my-3 mx-1">
                    <Col sm={4} my-3>
                      {/* gameImage */}
                      <Image src={`${baseURL}/${selectedGame?.data?.gameImage || Rectangle389}`}
                        alt="CafeCall" className="mx-1  rounded-2 "
                        style={{ objectFit: "cover", width: "297px", height: "312px" }}
                        onError={(e) => {
                          e.target.src = Rectangle389;
                        }}
                      />
                    </Col>
                    <Col sm={8}>
                      <Row className="my-3">
                        <Col sm={9}  >

                          <h5 style={{ fontSize: "24px", fontWeight: "700", color: "#0062FF" }}> {selectedGame?.data?.name || 'Game Name'}    </h5>

                        </Col>
                        <Col sm={3} className="d-flex justify-content-end">


                          <Button
                            onClick={() => setShowEditGameOffcanvas(true)}
                            className="px-3  me-2"
                            style={{
                              border: "2px solid #00AF0F",
                              color: "#00AF0F",
                              backgroundColor: "transparent",
                              fontWeight: "500",
                              borderRadius: "8px",

                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            className="px-3 py-2 me-2"
                            style={{
                              border: "2px solid #F12727",
                              color: "#00AF0F",
                              backgroundColor: "transparent",
                              fontWeight: "500",
                              borderRadius: "8px",
                            }}
                            onClick={() => setShowGameDeleteModal(true)}
                          >
                            <Image
                              src={deleteIcon}
                              alt="Delete"
                              style={{ objectFit: "cover", width: "12px", height: "13px" }}
                            />
                          </Button>

                        </Col>


                        <Col sm={12} className="my-5 " >

                          <Card className="border-2 rounded-2 ">

                            <p style={{ fontSize: "14px", fontWeight: "400", margin: "22px  22px  21px  15px" }}>
                              {selectedGame?.data?.details || `Pickleball is a fast-growing paddle sport that blends the best of tennis, badminton,
                        and table tennis. Played on a smaller court with a perforated plastic ball and solid paddles,
                        it's easy to learn, incredibly fun, and suitable for all ages and skill levels. Whether you're a
                        beginner or a seasoned athlete, pickleball offers a perfect mix of strategy, agility, and social interaction.
                        Ideal for doubles or singles, the game is both competitive and friendly — making it a favorite in sports cafés,
                        clubs, and community centers around the world.`}


                            </p>

                          </Card>
                        </Col>

                        <Col sm={12} className="my-3 mx-2" >

                          <div className="d-flex flex-wrap align-items-start">
                            <span className="d-flex align-items-center mb-4 me-4 " style={{ fontSize: "14px", fontWeight: "500" }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image
                                  src={MultiPlayers}
                                  alt="MultiPlayers"
                                  style={{
                                    objectFit: "cover",
                                    width: "20px",
                                    height: "16px",
                                  }}
                                />
                              </div>

                              {selectedGame?.data?.type === "Multiplayer" ? "Multi Player" : "Single Player"}
                            </span>

                            <span className="d-flex align-items-center mb-4 me-4 " style={{ fontSize: "14px", fontWeight: "500", }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image src={RsHour} alt="RsHour" className="" style={{ objectFit: "cover", width: "19px", height: "20px" }} />
                              </div>
                              {/* 600 / Hour */}
                              {selectedGame?.data?.price > 0 ? selectedGame?.data?.price + ' / Hour' : '---'}
                            </span>

                            <span className="d-flex align-items-center mb-4 me-4 " style={{ fontSize: "14px", fontWeight: "500" }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image src={Cancellation} alt="Cancellation" className="" style={{ objectFit: "cover", width: "20px", height: "20px" }} />
                              </div>
                              {/* Cancellation if true Yes  else No */}
                              {selectedGame?.data?.cancellation === true ? 'Cancellation Yes' : 'Cancellation No'}
                            </span>

                            <span className="d-flex align-items-center mb-4 me-4 " style={{ fontSize: "14px", fontWeight: "500" }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image src={discount} alt="discount" className="" style={{ objectFit: "cover", width: "22px", height: "22px" }} />
                              </div>
                              Discount Yes
                            </span>

                            <span className="d-flex align-items-center mb-4 me-4 " style={{ fontSize: "14px", fontWeight: "500" }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image src={Players} alt="Players" className="" style={{ objectFit: "cover", width: "23px", height: "16px" }} />

                              </div>
                              {selectedGame?.data?.players + ' Player' || '---'}
                            </span>

                            {/* areaSize */}

                            <span className="d-flex align-items-center mb-4 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image src={areaSize} alt="Players" className="" style={{ objectFit: "cover", width: "15px", height: "11px" }} />

                              </div>
                              {selectedGame?.data?.size || '---'}
                            </span>


                            {/* payLater.png */}
                            <span className="d-flex align-items-center mb-4 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image src={payLater} alt="Players" className="" style={{ objectFit: "cover", width: "15px", height: "11px" }} />

                              </div>
                              {selectedGame?.data?.payLater === true ? 'Pay Later Yes' : 'Pay Later No'}
                            </span>

                            {/* commission.png */}
                            <span className="d-flex align-items-center mb-4 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                              <div
                                className="d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  border: "2px solid #C9C9C9",
                                }}
                              >
                                <Image src={commission} alt="Players" className="" style={{ objectFit: "cover", width: "17px", height: "20px" }} />

                              </div>
                              {selectedGame?.data?.commission + ' Commission' || '---'}
                            </span>

                          </div>



                        </Col>
                      </Row>
                    </Col>
                  </Row>

                </Card>
              </>

            )}

        </Col>

        <Col sm={12}  >

          <Card className="my-4 " style={{ maxHeight: "600px" }}>
            <Nav
              variant="tabs"
              activeKey={activeKey}
              onSelect={(selectedKey) => setActiveKey(selectedKey)}
              className="mx-3 border-0"
              style={{ borderBottom: 'none' }}
            >
              <Nav.Item style={{ textAlign: 'center' }}>
                <Nav.Link
                  eventKey="slotTime"
                  style={{
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div
                    style={{
                      fontWeight: activeKey === 'slotTime' ? '600' : '400',
                      fontSize: '18px',
                      color: activeKey === 'slotTime' ? '#0d6efd' : '#6c757d',
                      padding: '1rem 1rem',

                    }}
                  >
                    Time Slot
                  </div>
                </Nav.Link>
                {activeKey === 'slotTime' && (
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
              <Nav.Item style={{ textAlign: 'center', marginLeft: '30px' }}>
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
                      fontSize: '18px',
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
                      margin: '0 15px ',
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


          <Card className="my-4 h-100" style={{ maxHeight: "600px", overflow:"auto" }}>

            {activeKey === 'slotTime' && (
              <Row className="my-3 mx-1 align-items-center">


                <Col xs={6} sm={8} className="my-2">
                  {/* <h4 className="mx-2 my-1" style={{ fontSize: "20px", fontWeight: "600" }}>TIME SLOTS</h4> */}
                </Col>
                <Col xs={6} sm={4} className="text-sm-end">

                  <h5 className="text-end mx-3" style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#00AF0F" }}
                    onClick={() => setShowAddSlotOffcanvas(true)}
                  >
                    <Image src={AddGreen} alt="CafeCall" className="mx-1  " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                    ADD</h5>

                </Col>

                <Col sm={12} className="my-3 ">

                  {
                    showSlotLoder || !slots ? (
                      <div className="d-flex justify-content-center">
                        <Loader />
                      </div>
                    ) : (

                      <>

                        <ButtonGroup className="d-flex flex-wrap justify-content-center gap-2">
                          {weekdays.map((day) => (
                            <Button
                              key={day}
                              variant={activeDay === day ? "primary" : "outline-secondary"}
                              className="rounded-pill px-4 fw-semibold"
                              onClick={() => setActiveDay(day)}
                            >
                              {day}
                            </Button>
                          ))}
                        </ButtonGroup>

                        {activeDay === "Sunday" && (
                          <Row className="my-1">
                            <Col sm={12} className="my-2 ">
                              {slots.filter((slot) => slot.day === "Sunday").map((slot) => (
                                <Card className=" mx-1  my-3">
                                  <Table responsive className="my-0">
                                    <tbody>

                                      <tr key={slot._id}>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.start_time} - {slot.end_time}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.slot_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center my-2 ">
                                            {slot.players}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            <span className={slot.is_deleted === false ? "text-success fw-semibold" : "text-danger"}>
                                              {slot.is_deleted === false ? "Available" : "Not Available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: '110px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            ₹ {slot.slot_price}
                                          </div>
                                        </td>

                                        <td style={{ width: '45px' }}>
                                          <div className="d-flex align-items-center "
                                            style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "41px", height: "40px", borderRadius: "50%", cursor: 'pointer' }}
                                            onClick={() => handleEditClick(slot?._id)}
                                          >
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "12px", height: "14px" }}
                                              className="mx-3"

                                            />
                                          </div>
                                          <EditSlotOffcanvas show={showEditSlotOffcanvas} handleClose={() => setShowEditSlotOffcanvas(false)} slotID={slotID} />

                                        </td>

                                        <td style={{ width: '145px' }}>
                                          <Button className="d-flex align-items-center border-0 p-1 px-4 rounded-pill my-2"
                                            style={{
                                              backgroundColor: slot?.is_active
                                                ? "rgba(15, 111, 8, 0.88)"
                                                : "rgba(255, 0, 0, 0.75)",
                                            }}
                                            onClick={() => handleToggleActive(slot?._id)}
                                          >
                                            {slot?.is_active ? "Active" : "Deactivate"}
                                          </Button>
                                        </td>
                                      </tr>

                                    </tbody>
                                  </Table>
                                </Card>
                              ))}

                            </Col>
                          </Row>

                        )}

                        {activeDay === "Monday" && (
                          <Row className="my-1">
                            <Col sm={12} className="my-2 ">
                              {slots.filter((slot) => slot.day === "Monday").map((slot) => (
                                <Card className=" mx-1  my-3">
                                  <Table responsive className="my-0">
                                    <tbody>

                                      <tr key={slot._id}>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.start_time} - {slot.end_time}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.slot_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center my-2 ">
                                            {slot.players}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            <span className={slot.is_deleted === false ? "text-success fw-semibold" : "text-danger"}>
                                              {slot.is_deleted === false ? "Available" : "Not Available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: '110px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            ₹ {slot.slot_price}
                                          </div>
                                        </td>

                                        <td style={{ width: '45px' }}>
                                          <div className="d-flex align-items-center "
                                            style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "41px", height: "40px", borderRadius: "50%", cursor: 'pointer' }}
                                            onClick={() => handleEditClick(slot?._id)}
                                          >
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "12px", height: "14px" }}
                                              className="mx-3"

                                            />
                                          </div>
                                          <EditSlotOffcanvas show={showEditSlotOffcanvas} handleClose={() => setShowEditSlotOffcanvas(false)} slotID={slotID} />

                                        </td>

                                        <td style={{ width: '145px' }}>
                                          <Button className="d-flex align-items-center border-0 p-1 px-4 rounded-pill my-2"
                                            style={{
                                              backgroundColor: slot?.is_active
                                                ? "rgba(15, 111, 8, 0.88)"
                                                : "rgba(255, 0, 0, 0.75)",
                                            }}
                                            onClick={() => handleToggleActive(slot?._id)}
                                          >
                                            {slot?.is_active ? "Active" : "Deactivate"}
                                          </Button>
                                        </td>
                                      </tr>

                                    </tbody>
                                  </Table>
                                </Card>
                              ))}

                            </Col>
                          </Row>

                        )}


                        {activeDay === "Tuesday" && (
                          <Row className="my-1">
                            <Col sm={12} className="my-2 ">
                              {slots.filter((slot) => slot.day === "Tuesday").map((slot) => (
                                <Card className=" mx-1  my-3">
                                  <Table responsive className="my-0">
                                    <tbody>

                                      <tr key={slot._id}>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2" >
                                            {slot.start_time} - {slot.end_time}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.slot_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center my-2 ">
                                            {slot.players}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            <span className={slot.is_deleted === false ? "text-success fw-semibold" : "text-danger"}>
                                              {slot.is_deleted === false ? "Available" : "Not Available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: '110px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            ₹ {slot.slot_price}
                                          </div>
                                        </td>

                                        <td style={{ width: '45px' }}>
                                          <div className="d-flex align-items-center "
                                            style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "41px", height: "40px", borderRadius: "50%", cursor: 'pointer' }}
                                            onClick={() => handleEditClick(slot?._id)}
                                          >
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "12px", height: "14px" }}
                                              className="mx-3"

                                            />
                                          </div>
                                          <EditSlotOffcanvas show={showEditSlotOffcanvas} handleClose={() => setShowEditSlotOffcanvas(false)} slotID={slotID} />

                                        </td>

                                        <td style={{ width: '145px' }}>
                                          <Button className="d-flex align-items-center border-0 p-1 px-4 rounded-pill my-2"
                                            style={{
                                              backgroundColor: slot?.is_active
                                                ? "rgba(15, 111, 8, 0.88)"
                                                : "rgba(255, 0, 0, 0.75)",
                                            }}
                                            onClick={() => handleToggleActive(slot?._id)}
                                          >
                                            {slot?.is_active ? "Active" : "Deactivate"}
                                          </Button>
                                        </td>
                                      </tr>

                                    </tbody>
                                  </Table>
                                </Card>
                              ))}

                            </Col>
                          </Row>

                        )}

                        {activeDay === "Wednesday" && (
                          <Row className="my-1">
                            <Col sm={12} className="my-2 ">
                              {slots.filter((slot) => slot.day === "Wednesday").map((slot) => (
                                <Card className=" mx-1  my-3">
                                  <Table responsive className="my-0">
                                    <tbody>

                                      <tr key={slot._id}>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.start_time} - {slot.end_time}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.slot_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center my-2 ">
                                            {slot.players}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            <span className={slot.is_deleted === false ? "text-success fw-semibold" : "text-danger"}>
                                              {slot.is_deleted === false ? "Available" : "Not Available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: '110px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            ₹ {slot.slot_price}
                                          </div>
                                        </td>

                                        <td style={{ width: '45px' }}>
                                          <div className="d-flex align-items-center "
                                            style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "41px", height: "40px", borderRadius: "50%", cursor: 'pointer' }}
                                            onClick={() => handleEditClick(slot?._id)}
                                          >
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "12px", height: "14px" }}
                                              className="mx-3"

                                            />
                                          </div>
                                          <EditSlotOffcanvas show={showEditSlotOffcanvas} handleClose={() => setShowEditSlotOffcanvas(false)} slotID={slotID} />

                                        </td>

                                        <td style={{ width: '145px' }}>
                                          <Button className="d-flex align-items-center border-0 p-1 px-4 rounded-pill my-2"
                                            style={{
                                              backgroundColor: slot?.is_active
                                                ? "rgba(15, 111, 8, 0.88)"
                                                : "rgba(255, 0, 0, 0.75)",
                                            }}
                                            onClick={() => handleToggleActive(slot?._id)}
                                          >
                                            {slot?.is_active ? "Active" : "Deactivate"}
                                          </Button>
                                        </td>
                                      </tr>

                                    </tbody>
                                  </Table>
                                </Card>
                              ))}

                            </Col>
                          </Row>

                        )}

                        {activeDay === "Thursday" && (
                          <Row className="my-1">
                            <Col sm={12} className="my-2 ">
                              {slots.filter((slot) => slot.day === "Thursday").map((slot) => (
                                <Card className=" mx-1  my-3">
                                  <Table responsive className="my-0">
                                    <tbody>

                                      <tr key={slot._id}>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.start_time} - {slot.end_time}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.slot_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center my-2 ">
                                            {slot.players}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            <span className={slot.is_deleted === false ? "text-success fw-semibold" : "text-danger"}>
                                              {slot.is_deleted === false ? "Available" : "Not Available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: '110px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            ₹ {slot.slot_price}
                                          </div>
                                        </td>

                                        <td style={{ width: '45px' }}>
                                          <div className="d-flex align-items-center "
                                            style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "41px", height: "40px", borderRadius: "50%", cursor: 'pointer' }}
                                            onClick={() => handleEditClick(slot?._id)}
                                          >
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "12px", height: "14px" }}
                                              className="mx-3"

                                            />
                                          </div>
                                          <EditSlotOffcanvas show={showEditSlotOffcanvas} handleClose={() => setShowEditSlotOffcanvas(false)} slotID={slotID} />

                                        </td>

                                        <td style={{ width: '145px' }}>
                                          <Button className="d-flex align-items-center border-0 p-1 px-4 rounded-pill my-2"
                                            style={{
                                              backgroundColor: slot?.is_active
                                                ? "rgba(15, 111, 8, 0.88)"
                                                : "rgba(255, 0, 0, 0.75)",
                                            }}
                                            onClick={() => handleToggleActive(slot?._id)}
                                          >
                                            {slot?.is_active === true ? "Active" : "Deactivate"}
                                          </Button>
                                        </td>
                                      </tr>

                                    </tbody>
                                  </Table>
                                </Card>
                              ))}

                            </Col>
                          </Row>

                        )}

                        {activeDay === "Friday" && (
                          <Row className="my-1">
                            <Col sm={12} className="my-2 ">
                              {slots.filter((slot) => slot.day === "Friday").map((slot) => (
                                <Card className=" mx-1  my-3">
                                  <Table responsive className="my-0">
                                    <tbody>

                                      <tr key={slot._id}>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.start_time} - {slot.end_time}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.slot_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center my-2 ">
                                            {slot.players}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            <span className={slot.is_deleted === false ? "text-success fw-semibold" : "text-danger"}>
                                              {slot.is_deleted === false ? "Available" : "Not Available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: '110px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            ₹ {slot.slot_price}
                                          </div>
                                        </td>

                                        <td style={{ width: '45px' }}>
                                          <div className="d-flex align-items-center "
                                            style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "41px", height: "40px", borderRadius: "50%", cursor: 'pointer' }}
                                            onClick={() => handleEditClick(slot?._id)}
                                          >
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "12px", height: "14px" }}
                                              className="mx-3"

                                            />
                                          </div>
                                          <EditSlotOffcanvas show={showEditSlotOffcanvas} handleClose={() => setShowEditSlotOffcanvas(false)} slotID={slotID} />

                                        </td>

                                        <td style={{ width: '145px' }}>
                                          <Button
                                            className="d-flex align-items-center border-0 p-1 px-4 rounded-pill my-2"
                                            style={{
                                              backgroundColor: slot?.is_active
                                                ? "rgba(15, 111, 8, 0.88)"
                                                : "rgba(255, 0, 0, 0.75)",
                                            }}
                                            onClick={() => handleToggleActive(slot?._id)}
                                          >
                                            {slot?.is_active ? "Active" : "Deactivate"}
                                          </Button>

                                        </td>
                                      </tr>

                                    </tbody>
                                  </Table>
                                </Card>
                              ))}

                            </Col>
                          </Row>

                        )}
                        {activeDay === "Saturday" && (
                          <Row className="my-1">
                            <Col sm={12} className="my-2 ">
                              {slots.filter((slot) => slot.day === "Saturday").map((slot) => (
                                <Card className=" mx-1  my-3">
                                  <Table responsive className="my-0">
                                    <tbody>

                                      <tr key={slot._id}>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.start_time} - {slot.end_time}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="my-2">
                                            {slot.slot_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center my-2 ">
                                            {slot.players}
                                          </div>
                                        </td>
                                        <td style={{ width: '160px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            <span className={slot.is_deleted === false ? "text-success fw-semibold" : "text-danger"}>
                                              {slot.is_deleted === false ? "Available" : "Not Available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: '110px' }}>
                                          <div className="d-flex align-items-center my-2 ">
                                            ₹ {slot.slot_price}
                                          </div>
                                        </td>

                                        <td style={{ width: '45px' }}>
                                          <div className="d-flex align-items-center "
                                            style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "41px", height: "40px", borderRadius: "50%", cursor: 'pointer' }}
                                            onClick={() => handleEditClick(slot?._id)}
                                          >
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "12px", height: "14px" }}
                                              className="mx-3"

                                            />
                                          </div>
                                          <EditSlotOffcanvas show={showEditSlotOffcanvas} handleClose={() => setShowEditSlotOffcanvas(false)} slotID={slotID} />

                                        </td>

                                        <td style={{ width: '145px' }}>
                                          <Button className="d-flex align-items-center border-0 p-1 px-4 rounded-pill my-2"
                                            style={{
                                              backgroundColor: slot?.is_active
                                                ? "rgba(15, 111, 8, 0.88)"
                                                : "rgba(255, 0, 0, 0.75)",
                                            }}
                                            onClick={() => handleToggleActive(slot?._id)}
                                          >
                                            {slot?.is_active ? "Active" : "Deactivate"}
                                          </Button>
                                        </td>
                                      </tr>

                                    </tbody>
                                  </Table>
                                </Card>
                              ))}

                            </Col>
                          </Row>

                        )}
                      </>

                    )
                  }







                </Col>



              </Row>
            )}

            {activeKey === 'earning' && (
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
                                     Total Earning : ₹ {totalEarning || earningData.reduce((sum, booking) => sum + (booking?.totalAmountPaid || 0), 0)}
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
               
                                 {/* <Col sm={6} className="my-3 alingn-items-end">
                                   <Table hover responsive>
                                     <thead className="table-light">
                                       <tr>
                                         <th className="fw-bold">S/N</th>
                                         <th className="fw-bold">Booking Id</th>
                                         <th className="fw-bold">Name</th>
                                         <th className="fw-bold">Sports</th>
                                         <th className="fw-bold">Players</th>
                                         <th className="fw-bold">Mode</th>
                                         <th className="fw-bold">Time/Date</th>
                                         <th className="fw-bold">Price</th>
                                       </tr>
                                     </thead>
                                     <tbody>
                                       {filteredBookingsEarning?.length > 0 ? (
                                         filteredBookingsEarning.map((booking, idx) => (
                                           <tr key={idx}>
                                             <td>{idx + 1}</td>
                                             <td>
                                               <span
                                                 className="text-primary fw-bold"
                                                 style={{ cursor: "pointer" }}
                                                 onClick={() => handleBookingClick(booking._id)}
                                               >
                                                 {booking.booking_id}
                                               </span>
                                             </td>
                                             <td>{booking.customerName}</td>
                                             <td>{booking.game_id?.name}</td>
                                             <td>{booking.players?.length || "---"}</td>
                                             <td>
                                               <span
                                                 className="d-flex align-items-center w-75 justify-content-center"
                                                 style={{
                                                   backgroundColor:
                                                     booking.status === "Pending"
                                                       ? "#FFF3CD"
                                                       : booking.mode === "Online"
                                                         ? "#03D41414"
                                                         : "#FF00000D",
                                                   borderRadius: "20px",
                                                   padding: "5px 10px",
                                                   color:
                                                     booking.status === "Pending"
                                                       ? "#856404"
                                                       : booking.mode === "Online"
                                                         ? "#00AF0F"
                                                         : "orange",
                                                 }}
                                               >
                                                 <div
                                                   style={{
                                                     width: "10px",
                                                     height: "10px",
                                                     borderRadius: "50%",
                                                     backgroundColor:
                                                       booking.status === "Pending"
                                                         ? "#856404"
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
                                               {formatDate(booking.slot_date)}
                                               <br />
                                               ₹{" "}
                                               {booking?.booking_type === "Regular"
                                                 ? `${convertTo12Hour(booking?.slot_id?.start_time)} - ${convertTo12Hour(booking?.slot_id?.end_time)}`
                                                 : `${convertTo12Hour(booking?.custom_slot?.start_time)} - ${convertTo12Hour(booking?.custom_slot?.end_time)}`}
                                             </td>
                                             <td>₹ {booking.gamePrice}</td>
                                           </tr>
                                         ))
                                       ) : (
                                         <tr>
                                           <td colSpan="8" className="text-center">
                                             No data found
                                           </td>
                                         </tr>
                                       )}
                                     </tbody>
                                   </Table>
                                   <div className="d-flex justify-content-end align-items-center my-4">
               
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
                                 </Col> */}
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
                                       {(currentItems.length > 0 ? currentItems : (filteredEarningData.length > 0 ? filteredEarningData : earningData)).length > 0 ? (
                                         (currentItems.length > 0 ? currentItems : (filteredEarningData.length > 0 ? filteredEarningData : earningData)).map((date, index) => (
                                           <tr key={index}>
                                             <td>{index + 1}</td>
                                             <td>
                                               <span className="me-3 my-2" style={{ width: "100px", display: "inline-block" }}>
                                                 {date.date}
                                               </span>
                                             </td>
                                             <td>
                                               {Object.entries(date.games).map(([gameName, gameDetails], idx) => (
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

          </Card>
        </Col>



      </Row>

      <AddSlotOffcanvas
        show={showAddSlotOffcanvas}
        handleClose={() => setShowAddSlotOffcanvas(false)}
        gameId={gameId}
      />

      <EditGameOffcanvas
        show={showEditGameOffcanvas}
        handleClose={() => setShowEditGameOffcanvas(false)}
        gameId={gameId}
      />

      <GameDeleteModal
        show={showGameDeleteModal}
        handleClose={() => setShowGameDeleteModal(false)}
        gameId={gameId}
        cafeId={cafeId}
      />
    </Container>
  );
};

export default GameDetailsCafe;

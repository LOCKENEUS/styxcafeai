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
import { fetchCafesID } from "../../../../store/slices/cafeSlice";
import { FaPlus } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import EditSlotOffcanvas from "../offcanvasCafe/editSlot";

const GameDetailsCafe = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [showDameDetailsLoder, setShowDameDetailsLoder] = useState(<Loader />);
  const [showSlotLoder, setShowSlotLoder] = useState(true);
  const location = useLocation();
  const { gameId } = location.state || {};

  console.log("your game id here === 99", gameId);
  const [showAddSlotOffcanvas, setShowAddSlotOffcanvas] = useState(false);
  const [showEditGameOffcanvas, setShowEditGameOffcanvas] = useState(false);
  const [showGameDeleteModal, setShowGameDeleteModal] = useState(false);
  const [showEditSlotOffcanvas, setShowEditSlotOffcanvas] = useState(false);
  const [activeDay, setActiveDay] = useState("Sunday");
  const [slotID, setSlotID] = useState(false);
  const dispatch = useDispatch();


  // const { game } = useSelector((state) => state.game);
  // useEffect(() => {
  //   dispatch(getGames(gameId));
  // })
  // console.log("your game here 0==", game);

  const { selectedGame } = useSelector((state) => state.games);
  const game = selectedGame?.data;
  const isSameGame = gameId === game?._id;
  const cafeId = selectedGame?.data?.cafe;


  useEffect(() => {
    if (gameId) {
      setShowDameDetailsLoder(true);
      dispatch(getGameById(gameId)).finally(() => setShowDameDetailsLoder(false));
      // dispatch(getGames()).finally(() => setShowDameDetailsLoder(false));

    }
  }, [isSameGame, dispatch]);


  console.log("selected game here 99", selectedGame?.data);

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
    dispatch(fetchCafesID(cafeId));
  }, [cafeId, dispatch]);

  const cafeDetails = useSelector((state) => state.cafes);
  console.log("cafe details membership ==", cafeDetails);

  // compare cafeId with cafeDetails.cafeId
  const isCafeIdMatch = cafeDetails.cafes?.find(cafe => cafe._id === cafeId);
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
                {/* <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }} >
                <Link to="/superadmin/CafeGames"
                  state={{ cafeId: cafeId }}>
                  All Games
                </Link>
              </Breadcrumb.Item> */}
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
                    <h5 className="text-primary " style={{ fontSize: "16px", fontWeight: "500" }}>{isCafeIdMatch?.cafe_name}</h5>
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

          <Card className="my-4 h-100" style={{ maxHeight: "600px" }}>

            <Row className="my-3 mx-1 align-items-center">
              <Col xs={6} sm={8} className="my-2">
                <h4 className="mx-2 my-1" style={{ fontSize: "20px", fontWeight: "600" }}>TIME SLOTS</h4>
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
                                          {slot?.is_active  ? "Active" : "Deactivate"}
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
                                      <td style={{ width: '160px' }}>
                                        <div className="d-flex align-items-center my-2 ">
                                          <span className={slot.is_deleted  === false ? "text-success fw-semibold" : "text-danger"}>
                                            {slot.is_deleted  === false ? "Available" : "Not Available"}
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

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
} from "react-bootstrap";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGame,
  deleteGame,
  getGameById,
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
import mdiEdit from "/assets/superAdmin/cafe/mdi_edit.png";
import AddSlotOffcanvas from "../offcanvasCafe/addSlot";
import EditGameOffcanvas from "../offcanvasCafe/editGame";
import Loader from "../../../../components/common/Loader/Loader";
import gsap from "gsap";
import GameDeleteModal from "../modal/gameDelete";

const GameDetailsCafe = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [showDameDetailsLoder, setShowDameDetailsLoder] = useState(<Loader />);
  const location = useLocation();
  const { gameId } = location.state || {};
  const [showAddSlotOffcanvas,setShowAddSlotOffcanvas]=useState(false);
  const [showEditGameOffcanvas, setShowEditGameOffcanvas] = useState(false);
  const [showGameDeleteModal, setShowGameDeleteModal] = useState(false);


  console.log("your cafe id game 99", gameId);

  const dispatch = useDispatch();
  const { selectedGame } = useSelector((state) => state.games);
  


  useEffect(() => {
    if (gameId) {
      setShowDameDetailsLoder(true);
      dispatch(getGameById(gameId)).finally(() => setShowDameDetailsLoder(false));
    }
  }, [gameId, dispatch]);

  console.log("selected game here", selectedGame);
  const cafeId = selectedGame?.data?.cafe;
  console.log("your game id here ", cafeId);



  // ------------------------- Time Slots -----------------------------
  
    const { slots  } = useSelector((state) => state.slots);
    useEffect(() => {
      dispatch(getslots(gameId));
    }, [dispatch, gameId]);


    console.log("Form State slots Game Details:", slots);

    // const getDuration = (start, end) => {
    //   if (!start || !end) return '';
    
    //   const startTime = new Date(start);
    //   const endTime = new Date(end);
    
    //   const diffMs = endTime - startTime;
    //   const diffMins = Math.floor(diffMs / 60000);
    //   const hours = Math.floor(diffMins / 60);
    //   const minutes = diffMins % 60;
    
    //   return `${hours}h ${minutes}m`;
    // };
    

    // const getDuration = 
     


// ---------------------------  gsap  -----------------------------
useEffect(() => {
  // if (selectedGame?.data) {
    gsap.from(".game-detail-animate", {
      y: 50,
      delay: 3,
      duration: 1,
     
    }
  );
  // }
}, [selectedGame]);



  return (
    <Container fluid>
      <Row className="my-5 game-detail-animate">


        <Card.Header className="fw-bold">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Breadcrumb>
              <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>Home</Breadcrumb.Item>
              <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>
                {/* <Link to="/superadmin/cafe/viewdetails/" > Games Details</Link> */}
                <Link to={`/superadmin/cafe/viewdetails/${cafeId}`}>Games Details</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }} >
                <Link to={`/superadmin/CafeGames`}>
                  All Games
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Game</Breadcrumb.Item>

            </Breadcrumb>


            {/* <Button variant="primary" className="rounded-3" onClick={() => {
                dispatch(setSelectedGame(null));
                setFormData(null);
                setShowCanvas(true);
              }}>
                <Image src={Add} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                Create  Game
              </Button> */}

          </div>
        </Card.Header>


        <Col sm={12} className="my-2">
        {
          showDameDetailsLoder || !selectedGame?.data ? (
            <div className="text-center py-5">
              <Loader />
            </div>
          ) : (
       

          <Card className=" ">

            <Row className="my-3 mx-1">
              <Col sm={4} my-3>
              {/* gameImage */}
                <Image src={`${baseURL}/${selectedGame?.data?.gameImage || Rectangle389}`} alt="CafeCall" className="mx-1  rounded-2 " style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </Col>
              <Col sm={8}>
                <Row className="my-3">
                  <Col sm={9}  >

                    <h5 style={{ fontSize: "24px", fontWeight: "700", color: "#0062FF" }}> {selectedGame?.data?.name || 'Game Name'}    </h5>

                  </Col>
                  <Col sm={3} className="d-flex justify-content-end">


                    <Button
                      onClick={()=> setShowEditGameOffcanvas(true)}
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
                        {selectedGame?.message || `Pickleball is a fast-growing paddle sport that blends the best of tennis, badminton,
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
                      <span className="d-flex align-items-center mb-2 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                        <Image src={MultiPlayers} alt="MultiPlayers" className="me-2" style={{ objectFit: "cover", width: "25px", height: "20px" }} />

                        {/* payLater are greater than 1 if single player else multi player */}

                        {selectedGame?.data?.type == 'Multiplayer' ? 'Multi Player' : 'Single Player'}

                      </span>

                      <span className="d-flex align-items-center mb-2 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                        <Image src={RsHour} alt="RsHour" className="me-2" style={{ objectFit: "cover", width: "19px", height: "20px" }} />

                        {/* 600 / Hour */}
                        {selectedGame?.data?.price > 0 ? selectedGame?.data?.price + ' / Hour' : '---'}
                      </span>

                      <span className="d-flex align-items-center mb-2 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                        <Image src={Cancellation} alt="Cancellation" className="me-2" style={{ objectFit: "cover", width: "20px", height: "20px" }} />
                        {/* Cancellation if true Yes  else No */}
                        {selectedGame?.data?.cancellation === true ? 'Cancellation Yes' : 'Cancellation No'}
                      </span>

                      <span className="d-flex align-items-center mb-2 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                        <Image src={discount} alt="discount" className="me-2" style={{ objectFit: "cover", width: "22px", height: "22px" }} />
                        Discount Yes
                      </span>

                      <span className="d-flex align-items-center mb-2 me-4" style={{ fontSize: "14px", fontWeight: "500" }}>
                        <Image src={Players} alt="Players" className="me-2" style={{ objectFit: "cover", width: "23px", height: "16px" }} />
                        {selectedGame?.data?.players + ' Player' || '---'}
                      </span>
                    </div>



                  </Col>
                </Row>
              </Col>
            </Row>

          </Card>

                        )}

        </Col>

        <Col sm={12} className="my-2">

          <Card className="my-3">

            <Row className="my-3 mx-1 align-items-center">
              <Col xs={6} sm={8} className="my-2">
                <h4 className="mx-2 my-1" style={{ fontSize: "20px", fontWeight: "600" }}>TIME SLOTS</h4>
              </Col>
              <Col xs={6} sm={4} className="text-sm-end">
                <Button variant="primary"
                onClick={() => setShowAddSlotOffcanvas(true)}
                className=" w-sm-auto py-2" style={{ fontSize: "14px", fontWeight: "500" }}>
                  <Image src={Add} alt="+" className="me-2" style={{ objectFit: "cover", width: "20px", height: "20px" }} />
                  ADD TIME SLOT
                </Button>
              </Col>


              <Col sm={12} className="my-3 ">
                <Table hover responsive className="my-3">
                  <thead style={{ backgroundColor: "#e9f5f8" }}>
                    <tr className="rounded-4">

                      <th style={{
                        fontWeight: "500",
                        fontSize: "clamp(14px, 3vw, 16px)",
                        padding: "clamp(10px, 2vw, 15px)",
                        border: "none",
                        color: "black",
                        borderTopLeftRadius: "10px",
                        borderBottomLeftRadius: "10px",
                      }}>Start Time</th>
                      <th style={{
                        fontWeight: "500",
                        fontSize: "clamp(14px, 3vw, 16px)",
                        padding: "clamp(10px, 2vw, 15px)",
                        border: "none",
                        color: "black",
                      }}>End Time</th>
                      <th style={{
                        fontWeight: "500",
                        fontSize: "clamp(14px, 3vw, 16px)",
                        padding: "clamp(10px, 2vw, 15px)",
                        border: "none",
                        color: "black",
                      }}>Duration</th>
                      <th style={{
                        fontWeight: "500",
                        fontSize: "clamp(14px, 3vw, 16px)",
                        padding: "clamp(10px, 2vw, 15px)",
                        border: "none",
                        color: "black",
                      }}>Actin</th>
                      <th style={{
                        fontWeight: "500",
                        fontSize: "clamp(14px, 3vw, 16px)",
                        padding: "clamp(10px, 2vw, 15px)",
                        border: "none",
                        color: "black",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px"
                      }}>Edit Time </th>
                    </tr>
                  </thead>
                  {/* map slots */}
                  {slots?.map((slot, index) => (
                                      <tbody>
                                      <tr>
                                        <td className="py-4" style={{ fontWeight: '500', fontSize: '16px' }}>{slot?.start_time} </td>
                                        <td className="py-4" style={{ fontWeight: '500', fontSize: '16px' }}>{slot?.end_time} </td>
                                        <td className="py-4" style={{ color: "#0062FF", fontWeight: '700', fontSize: '16px' }}>2:45:00 MIN</td>
                                        <td className="py-4">
                                          <div className="d-flex align-items-center " style={{ backgroundColor: "rgba(255, 0, 0, 0.06)", width: "46px", height: "46px", borderRadius: "50%" }}>
                                            <Image
                                              src={deleteIcon}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "14px", height: "16px" }}
                                              className="mx-3"
                                            />
                                          </div>
                                        </td>
                                        <td className="py-4">
                                          {/* mdiEdit */}
                                          <div className="d-flex align-items-center " style={{ backgroundColor: "rgba(21, 255, 0, 0.16)", width: "46px", height: "46px", borderRadius: "50%" }}>
                                            <Image
                                              src={mdiEdit}
                                              alt="Delete"
                                              style={{ objectFit: "cover", width: "18px", height: "18px" }}
                                              className="mx-3"
                                            />
                                          </div>
                  
                                        </td>
                                      </tr>
                                    </tbody>
                    
                  ))}

                </Table>

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
      />
    </Container>
  );
};

export default GameDetailsCafe;

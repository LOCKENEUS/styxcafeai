import { Row, Col, Button, Card, Image, Modal, Container, CardGroup, Badge } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { deleteCafe, fetchCafes, selectCafes } from "../../../store/slices/cafeSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import CafeGames from "./Games/CafeGames";
import CreateOffers from "./Offers/CreateOffers";
import { getGames, setSelectedGame } from '../../../store/slices/gameSlice';
import CafeForm from './CafeForm';
import CreateMembership from "./membership/CreateMembership";
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png'
import edit from "/assets/superAdmin/cafe/edit.png";
import profile from "/assets/profile/user_avatar.jpg";
import call from "/assets/superAdmin/cafe/call (2).png";
import Notification from "/assets/superAdmin/cafe/notification.png";
import Message from "/assets/superAdmin/cafe/message.png";
import Add from "/assets/superAdmin/cafe/formkit_add.png";
import FrameKing from '/assets/superAdmin/cafe/FrameKing.png';
import { getMembershipsByCafeId, setSelectedMembership } from "../../../store/slices/MembershipSlice";
import GameForm from "./Games/GameForm";
import { FaCrown } from "react-icons/fa";
import AddGamesOffcanvas from "./offcanvasCafe/addGames";
import AddMembershipOffcanvas from "./offcanvasCafe/addMembership";
import EditCafeOffcanvas from "./offcanvasCafe/editCafe";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";
import ForwordPassword from "./modal/forwordPassword";




const ViewDetails = () => {




  const { games, selectedGame } = useSelector((state) => state.games);
  const cafes = useSelector(selectCafes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cafeId } = useParams();
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


  useEffect(() => {
    dispatch(fetchCafes());

  }, [dispatch]);

  useEffect(() => {
    if (cafes.length > 0) {
      // console.log("cafes of kreet ", cafes)
      const selectedCafe = cafes.find(cafe => cafe._id === cafeId);
      if (selectedCafe) {
        setCafe(selectedCafe);
      }
    }
  }, [cafes, cafeId]);

  // console.log("cafe -- ", cafe)

  useEffect(() => {
    dispatch(setSelectedGame(null));
  }, [dispatch]);
  console.log("selected game -- ", selectedGame)

  // -------------- Games --------------
  const gamesDetails = useSelector(state => state.games);
  const { selectedGameDetails } = useSelector((state) => state.games);
  useEffect(() => {
    if (cafeId) {
      dispatch(getGames(cafeId));
    }
  }, [cafeId, dispatch]);
  //   games  const POIdGet = useSelector(state => state.purchaseReceiveSlice);



  console.log("games -- ", gamesDetails);




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

  // Number of cards to display per view
  const cardsPerPage = 3;
  
  // Pagination boundaries
  const maxIndex = Math.max(games.length - cardsPerPage, 0);
  
  
  // Go to next page
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + cardsPerPage, maxIndex));
  };
  
  // Go to previous page
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - cardsPerPage, 0));
  };
  




  // -------------- Membership --------------
  const { memberships, loading, error, selectedMembership } = useSelector((state) => state.memberships);
  const membershipCardsPerPage = 2;
  const membershipMaxIndex = Math.max(memberships.length - membershipCardsPerPage, 0);
  const [currentIndexMembership, setCurrentIndexMembership] = useState(0);
  useEffect(() => {
    if (cafeId) {
      dispatch(getMembershipsByCafeId(cafeId));
    }
  }, [cafeId, dispatch]);

  // const membershipDetails = useSelector(state => state.memberships);
  //  const { memberships, loading, error, selectedMembership } = useSelector((state) => state.memberships);
  console.log("membershipDetails -- ", memberships);
  const handleCreateNewMembership = () => {
    dispatch(setSelectedMembership(null));
    setShowCanvas(true);
  };


  const handleMembershipNext = () => {
    setCurrentIndexMembership((prev) => Math.min(prev + membershipCardsPerPage, membershipMaxIndex));
  };

  const handleMembershipPrev = () => {
    setCurrentIndexMembership((prev) => Math.max(prev - membershipCardsPerPage, 0));
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

  if (!cafe) {
    return <div>Loading...</div>;
  }

  const baseURL = import.meta.env.VITE_API_URL;
  const imagePaths = cafe.cafeImage ? cafe.cafeImage.map(path => baseURL + "/" + path.trim()) : [];

  return (
    <Container fluid>
      <Row className="my-5">
        <Col sm={4} className="pe-1">
          <Card className="py-3 mx-2 rounded-4 my-3" style={{ backgroundColor: "white" }}>
            <div className="d-flex flex-column align-items-start mx-3">
              <h5 className="text-start " style={{ fontSize: "18px", fontWeight: "600" }}>Cafe Details</h5>

            </div>
            <div className="d-flex flex-column align-items-start mx-3 my-3">

              <Image src={Rectangle389} alt="Cafe Image" className="mb-3" style={{ width: "100%", objectFit: "cover" }} />
            </div>
            <div className="d-flex justify-content-between align-items-center mx-3 my-1">
              <h5
                className="text-start"
                style={{
                  fontWeight: 700,
                  fontSize: "21px",
                  lineHeight: "100%",
                  letterSpacing: "0%"
                }}
              >
                {cafe.cafe_name}
              </h5>

              <div className="d-flex flex-column align-items-end" onClick={() => setShowCanvasEditCafe(true)} style={{ objectFit: "cover" }} >
                <Image src={edit} alt="edit" className="mb-3" />
              </div>


            </div>


            <Row className="mx-2 d-flex justify-content-between flex-wrap">

              {/* name */}
              <Col sm={4} xs={4} className="mb-1 ">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Name :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-1 ">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.name || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="mb-3">
                <h1 className="text-start mt-3" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Owner  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-3">
                <div className="d-flex align-items-center">
                  <Image
                    src={profile}
                    alt="Cafe Image"
                    className="me-1 "
                    style={{ width: "21%", objectFit: "cover", borderRadius: "50%" }}
                  />
                  <p
                    className="mb-0 text-start"
                    style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#0062FF" }}
                  >
                    {cafe?.name || '---'}
                  </p>
                </div>
              </Col>
              <Col sm={4} xs={4} className="mb-1 ">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Address :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-1 ">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.address || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="mb-3">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Contact :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-3">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.contact_no || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="mb-3">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  Office Contact  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-3">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.officeContactNo || '---'}
                </p>
              </Col>
              <Col sm={4} xs={4} className="mb-3">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  GST No :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-3">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.gstNo || '---'}
                </p>
              </Col>

              {/* panNo */}
              <Col sm={4} xs={4} className="mb-3">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  PAN No :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-3">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.panNo || '---'}
                </p>
              </Col>

              <Col sm={4} xs={4} className="mb-3">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  EMAIL  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-3">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.email || '---'}
                </p>
              </Col>
              
              <Col sm={4} xs={4} className="mb-3">
                <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  WEBSITE  :
                </h1>
              </Col>
              <Col sm={8} xs={8} className="mb-3">
                <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                  {cafe?.website_url || '---'}
                </p>
              </Col>

            </Row>




            <Row className="mx-2 d-flex  justify-content-between flex-wrap" style={{ marginTop: "110px", marginBottom: "20px" }}>
              <Col xs="auto" sm={4} className="my-1">
                <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                  <Image src={call} alt="CafeCall" className="mx-1 my-2 " style={{ objectFit: "cover", width: "19.65px", height: "19.65px" }} />
                </Button>

              </Col>
              <Col xs="auto" sm={4} className="my-1">
                <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                  <Image src={Notification} alt="CafeCall" className="mx-1 my-2 " style={{ objectFit: "cover", width: "19.65px", height: "19.65px" }} />
                </Button>

              </Col>
              <Col xs="auto" sm={4} className="my-1">
                <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                  <Image src={Message} alt="CafeCall" className="mx-0 my-2 " style={{ objectFit: "cover", width: "23.63px", height: "18.38px" }} />
                </Button>

              </Col>

              <div className="d-flex justify-content-center mt-3">
                <h4 className="text-center " style={{ fontSize: "16px", fontWeight: "500" ,color: "#0062FF", cursor:"pointer" }}
                onClick={() => setShowModalForwordPassword(true)}
                >Forword Password ?
                </h4>
              </div>
            </Row>


          </Card>
        </Col>



        <Col sm={8}>



          {/* -------------    Gallery details ------------- */}
          <Card className="py-3 mx-2 rounded-4 my-3" style={{ backgroundColor: "white" }}>
            <Row className="justify-content-between mx-3">
              <Col sm={6} className=" alingn-items-start">
                <h5 className="text-start " style={{ fontSize: "18px", fontWeight: "600" }}>Gallery Details</h5>

              </Col>
              <Col sm={6} className=" alingn-items-end ">
                <div className="d-flex justify-content-end">
                  <h5 className="text-end mx-3" style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#00AF0F" }}
                  // onClick={() => setShowModalAdd(true)}
                  >
                    <Image src={Add} alt="CafeCall" className="mx-1  " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                    ADD</h5>


                  {/* <AddGamesOffcanvas show={showModalAdd} handleClose={() => setShowModalAdd(false)} cafeId={cafeId} selectedGameDetails={selectedGameDetails} /> */}



                  <h5 className="text-end mx-3 " style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#0065FF", marginTop: "3.5px" }} >
                    {/* pass cafeid */}
                    {/* <Link to={`/superadmin/CafeGames/${cafeId}`}> */}

                    {/* <Link to={{ pathname: '/superadmin/CafeGames', state: { cafeId } }}> */}

                    View All
                    {/* </Link> */}

                  </h5>




                </div>
              </Col>
              <Col sm={12} className="my-3">
                <Row className="align-items-center">
                  {/* Prev Button */}
                  {cafe?.cafeImage?.length > cardsPerPageGallery && (
                    <Col xs="auto">
                      <div
                        className="mx-0"
                        onClick={currentIndexGallery === 0 ? null : handlePrevGallery}
                        style={{
                          cursor: currentIndexGallery === 0 ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          fontSize: "30px",
                          opacity: currentIndexGallery === 0 ? 0.3 : 1,
                        }}
                      >
                        <GrFormPrevious />
                      </div>
                    </Col>
                  )}

                  {/* Gallery Images */}
                  <Col className="px-0">
                    <Row className="g-3 justify-content-center">
                      {cafe?.cafeImage?.length > 0 ? (
                        cafe.cafeImage
                          .slice(currentIndexGallery, currentIndexGallery + cardsPerPageGallery).
                          reverse().map((img, index) => (
                            <Col key={index} md={3} sm={6} xs={12}>
                              <Card className="rounded-4" style={{ borderColor: "#E4E4E4", borderWidth: "2px" }}>
                                <Card.Img
                                  src={`${baseURL}/${img}`}
                                  onError={(e) => (e.target.src = Rectangle389)}
                                  className="img-fluid rounded-4 my-2 mx-auto d-block"
                                  style={{
                                    width: "90%",
                                    height: "8rem",
                                    objectFit: "cover",
                                  }}
                                  alt={`Gallery ${index + 1}`}
                                />
                              </Card>
                            </Col>
                          ))
                      ) : (
                        <p className="text-center">No gallery images found.</p>
                      )}
                    </Row>
                  </Col>

                  {/* Next Button */}
                  {cafe?.cafeImage?.length > cardsPerPageGallery && (
                    <Col xs="auto">
                      <div
                        className="mx-0"
                        onClick={
                          currentIndexGallery + cardsPerPageGallery >= cafe.cafeImage.length
                            ? null
                            : handleNextGallery
                        }
                        style={{
                          cursor:
                            currentIndexGallery + cardsPerPageGallery >= cafe.cafeImage.length
                              ? "not-allowed"
                              : "pointer",
                          fontWeight: "600",
                          fontSize: "30px",
                          opacity:
                            currentIndexGallery + cardsPerPageGallery >= cafe.cafeImage.length
                              ? 0.3
                              : 1,
                        }}
                      >
                        <GrFormNext />
                      </div>
                    </Col>
                  )}
                </Row>

              </Col>

            </Row>
          </Card>

          {/* -------------    game details ------------- */}
          <Card className="py-3 mx-2 rounded-4 my-3" style={{ backgroundColor: "white" }}>
            <Row className="justify-content-between mx-3">
              <Col sm={6} className=" alingn-items-start">
                <h5 className="text-start " style={{ fontSize: "18px", fontWeight: "600" }}>Game Details</h5>

              </Col>
              <Col sm={6} className=" alingn-items-end ">
                <div className="d-flex justify-content-end">
                  <h5 className="text-end mx-3" style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#00AF0F" }}
                    onClick={() => setShowModalAdd(true)}
                  >
                    <Image src={Add} alt="CafeCall" className="mx-1  " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                    ADD</h5>


                  <AddGamesOffcanvas show={showModalAdd} handleClose={() => setShowModalAdd(false)} cafeId={cafeId} selectedGameDetails={selectedGameDetails} />



                  <h5 className="text-end mx-3 " style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#0065FF", marginTop: "3.5px" }} >
                    {/* pass cafeid */}
                    {/* <Link to={`/superadmin/CafeGames/${cafeId}`}> */}

                    <Link
                      to={{
                        pathname: '/superadmin/CafeGames',
                      }}
                      state={{ cafeId }}
                    >
                      View All
                    </Link>
{/* 
                    <Link
                      to="/superadmin/CafeGames"
                      state={{ cafeId }}
                    >
                      View All
                    </Link> */}

                  </h5>




                </div>
              </Col>
              <Col sm={12} className="my-3">
                <Row className="align-items-center ">
                  {/* Prev Button - Left Side */}
                  {games.length > cardsPerPage && (
                    <Col xs="auto">
                      <div
                        className="mx-0"
                        onClick={currentIndex === 0 ? null : handlePrev}
                        style={{
                          cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          fontSize: "30px",
                          opacity: currentIndex === 0 ? 0.3 : 1,
                        }}
                      >
                        <GrFormPrevious />
                      </div>
                    </Col>
                  )}

                  {/* Cards in the Center */}
                  <Col className={`d-flex mx-0 ${games.length === 1 ? '' : ' justify-content-start '}`}>
                    <CardGroup className="w-100">
                      <Row className="gx-3 gy-4 justify-content-center w-100">
                        {games.length > 0 ? (
                          [...games].reverse().slice(currentIndex, currentIndex + cardsPerPage).map((game, index) => (
                            <Col key={index} xs={12} sm={12} md={4} lg={4}>
                              <Card className="rounded-4 h-100" style={{ borderColor: "#E4E4E4", borderWidth: "2px" }}>
                                <Card.Img
                                  src={`${baseURL}/${game.gameImage || Rectangle389}`}
                                  onError={(e) => (e.target.src = Rectangle389)}
                                  className="img-fluid rounded-4 my-2 mx-auto d-block"
                                  style={{ width: "90%", height: "8rem", objectFit: "cover" }}
                                  alt="Game Image"
                                />
                                <Card.Body>
                                  <Card.Title className="fs-6 fw-semibold">{game.name || "Game Title"}</Card.Title>
                                  <Card.Text>
                                    <Row className="gap-2 mt-3">
                                      <Col xs={12} className="d-flex gap-2 justify-content-center mb-3">
                                        <Button className="border-0 rounded-3" size="sm" style={{ backgroundColor: "#2C99FF" }}>Single</Button>
                                        <Button className="border-0 rounded-3" size="sm" style={{ backgroundColor: "#00C110" }}>Refundable</Button>
                                      </Col>
                                      <Col xs={5}><h6 className="text-primary fw-semibold">Price:</h6></Col>
                                      <Col xs={6}><h6 className="fw-medium text-end">₹ {game?.price || 1000}</h6></Col>
                                      <Col xs={5}><h6 className="text-primary fw-semibold">Zone:</h6></Col>
                                      <Col xs={6}><h6 className="fw-medium text-end">{game?.zone || "A"}</h6></Col>
                                      <Col xs={5}><h6 className="text-primary fw-semibold">Size:</h6></Col>
                                      <Col xs={6}><h6 className="fw-medium text-end">{game?.size || 2}</h6></Col>
                                      <Col xs={6}><h6 className="text-primary fw-semibold">Players:</h6></Col>
                                      <Col xs={4}><h6 className="fw-medium text-end">{game?.players || 2}</h6></Col>
                                      <Col xs={7}><h6 className="text-primary fw-semibold">Playlater:</h6></Col>
                                      <Col xs={4}><h6 className="fw-medium text-start">{game?.payLater ? "Yes" : "No"}</h6></Col>
                                      <Col xs={7}><h6 className="text-primary fw-semibold">Cancellation:</h6></Col>
                                      <Col xs={4}><h6 className="fw-medium text-start">{game?.cancellation ? "Yes" : "No"}</h6></Col>
                                    </Row>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <p className="text-center">No games available</p>
                        )}
                      </Row>
                    </CardGroup>

                  </Col>

                  {/* Next Button - Right Side */}
                  {games.length > cardsPerPage && (
                    <Col xs="auto">
                      <div
                        className="mx-0"
                        onClick={currentIndex >= maxIndex ? null : handleNext}
                        style={{
                          cursor: currentIndex >= maxIndex ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          fontSize: "30px",
                          opacity: currentIndex >= maxIndex ? 0.3 : 1,
                        }}
                      >
                        <MdOutlineNavigateNext />
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>

            </Row>
          </Card>



          {/* -------------    members ------------- */}


          <Card className="py-3 mx-2 rounded-4 my-3" style={{ backgroundColor: "white" }}>
            <Row className="justify-content-between mx-3">
              <Col sm={6} className=" alingn-items-start">
                <h5 className="text-start " style={{ fontSize: "18px", fontWeight: "600" }}>Membership Details</h5>

              </Col>
              <Col sm={6} className=" alingn-items-end ">
                <div className="d-flex justify-content-end">
                  <h5 className="text-end mx-3" style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#00AF0F" }}
                    onClick={() => setShowMembershipAdd(true)}
                  >
                    <Image src={Add} alt="CafeCall" className="mx-1  " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                    ADD</h5>

                  <AddMembershipOffcanvas show={showMembershipAdd} handleClose={() => setShowMembershipAdd(false)} cafeId={cafeId} selectedMembership={selectedMembership} />


                  <h5 className="text-end mx-3 " style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#0065FF", marginTop: "3.5px" }} >
                    {/* pass cafeid */}
                    <Link
                      to="/superadmin/CreateMembership/"
                      state={{ cafeId }}
                    >
                      View All
                    </Link>
                  </h5>

                </div>
              </Col>

              <Col sm={12} className="my-3">
                <Row className="align-items-center">
                  {/* Prev Button - Left Side */}
                  {memberships.length > membershipCardsPerPage && (
                    <Col xs="auto">
                      <div
                        className="mx-0"
                        onClick={currentIndexMembership === 0 ? null : handleMembershipPrev}
                        style={{
                          cursor: currentIndexMembership === 0 ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          fontSize: "30px",
                          opacity: currentIndexMembership === 0 ? 0.3 : 1,
                        }}
                      >
                        <GrFormPrevious />
                      </div>
                    </Col>
                  )}

                  {/* Membership Cards */}
                  <Col className="px-0 ">
                    {memberships && memberships.length > 0 ? (
                      <Row className="d-flex flex-wrap justify-content-center">
                        {[...memberships].reverse().slice(currentIndex, currentIndex + membershipCardsPerPage).map((membership, index, arr) => (
                          <Col
                            sm={6}
                            xs={12}
                            key={index}
                            // className={`d-flex mx-0 ${games.length === 1 ? 'col-4' : ' justify-content-start'}`}
                            className={`d-flex my-3 ${index !== arr.length - 1 ? 'border-end border-3' : 'justify-content-end'} ${arr.length === 1 ? 'col-12' : 'col-6'}`}
                          >
                            <Row className="align-items-center w-100">
                              {/* Image Section */}
                              <Col xs={4} className="text-center">
                                <Image
                                  src={FrameKing}
                                  alt="CafeCall"
                                  className="rounded-circle"
                                  style={{ objectFit: "cover", width: "68px", height: "68px" }}
                                />
                              </Col>

                              {/* Membership Name & Button */}
                              <Col xs={8}>
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
                              <Col xs={12} className="mx-4">
                                <h6 className="mt-3" style={{ fontSize: "16px", fontWeight: "500" }}>
                                  Membership Details
                                </h6>
                                <p className="text-muted mb-2" style={{ fontSize: "14px", fontWeight: "400" }}>
                                  {membership?.details?.map((detail, i) => (
                                    <span key={i}>
                                      {detail}
                                      {i !== membership.details.length - 1 && ", "}
                                    </span>
                                  ))}
                                </p>

                                <h6 className="mt-4" style={{ fontSize: "16px", color: "#00C843", fontWeight: "600" }}>
                                  Price: ₹ {membership?.price || 1000}
                                </h6>
                              </Col>
                            </Row>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <p className="text-center"> No members available</p>
                    )}
                  </Col>

                  {/* Next Button - Right Side */}
                  {memberships.length > membershipCardsPerPage && (
                    <Col xs="auto">
                      <div
                        className="mx-0"
                        onClick={currentIndexMembership >= membershipMaxIndex ? null : handleMembershipNext}
                        style={{
                          cursor: currentIndexMembership >= membershipMaxIndex ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          fontSize: "30px",
                          opacity: currentIndexMembership >= membershipMaxIndex ? 0.3 : 1,
                        }}
                      >
                        <MdOutlineNavigateNext />
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>










            </Row>
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

export default ViewDetails
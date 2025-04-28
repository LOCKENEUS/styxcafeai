import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Row,
    Col,
    Button
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import gm2 from "/assets/Admin/Dashboard/GamesImage/gm2.png";
import { useDispatch, useSelector } from "react-redux";
import { getGameById } from "../../../store/slices/gameSlice";
import CreateSlotModal from "./Modal/CreateSlotModal";
import { TbMoodSad } from "react-icons/tb";
import { copySlots, deleteslot, getslots } from "../../../store/slices/slotsSlice";
import { FaEdit } from "react-icons/fa";
import { BiPen, BiPencil } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

const GameDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedGame, status, error } = useSelector((state) => state.games);
    const [showSlotModal, setShowSlotModal] = useState(false);
    // const [slotStatus, setSlotStatus] = useState({});
    const [activeDate, setActiveDate] = useState(new Date());
    const slots = useSelector((state) => state.slots?.slots || []);
    const [slotToEdit, setSlotToEdit] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    let gameId = id;


    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1200;
            setIsMobile(mobile);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (id) {
            dispatch(getGameById(id));
        }
    }, [dispatch, id]);

    const handleSlotCreate = () => {
        setShowSlotModal(true);
        setSlotToEdit(null);
    };

    useEffect(() => {
        if (gameId) {
            dispatch(getslots(gameId));
        }
    }, [gameId, dispatch]);

    useEffect(() => {
        if (slots.length) {
            const initialStatus = {};
            slots.forEach(slot => {
                initialStatus[slot._id] = slot.is_active;
            });
        }
    }, [slots]);

    const refetchSlots = () => {
        if (gameId) {
            dispatch(getslots(gameId));
        }
    };

    const handleToggleStatus = async (slot) => {
        // dispatch(deleteslot(slot._id))
        // refetchSlots();

        // Dispatch the action to toggle the slot status
        await dispatch(deleteslot(slot._id));

        // Update the local state for real-time UI changes
        const updatedSlots = slots.map((s) =>
            s._id === slot._id ? { ...s, is_active: !slot.is_active } : s
        );
        refetchSlots();
    };

    const generateWeekdays = () => {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    };

    const weekdays = generateWeekdays();

    const convertTo24HourFormat = (time12h) => {
        if (!time12h) return ""; // Handle empty case
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":");
        if (modifier === "PM" && hours !== "12") {
            hours = String(parseInt(hours, 10) + 12);
        }
        if (modifier === "AM" && hours === "12") {
            hours = "00";
        }
        return `${hours}:${minutes}`;
    };

    const handleEditSlot = (slot) => {
        const formattedSlot = {
            ...slot,
            start_time: convertTo24HourFormat(slot.start_time),
            end_time: convertTo24HourFormat(slot.end_time),
        };

        setSlotToEdit(formattedSlot);
        setShowSlotModal(true);
    };

    const handleCopySlots = async (day) => {
        console.log("Copying slots for day:", day);
        await dispatch(copySlots({ game_id: gameId, day }));
        refetchSlots();
    };

    const sortSlotsByTime = (slots) => {
        const convertTo24HourMinutes = (timeStr) => {
          let [time, modifier] = timeStr.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
      
          if (modifier === "PM" && hours !== 12) {
            hours += 12;
          }
          if (modifier === "AM" && hours === 12) {
            hours = 0;
          }
          return hours * 60 + minutes;
        };
      
        return slots.sort((a, b) => {
          const aStart = convertTo24HourMinutes(a.start_time);
          const bStart = convertTo24HourMinutes(b.start_time);
          return aStart - bStart;
        });
      };    

    let filteredSlots = slots.filter(slot => slot.day === weekdays[activeDate.getDay()]);
    filteredSlots = sortSlotsByTime(filteredSlots);

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
            <Card className="p-3 mb-2" style={{ backgroundColor: "white" }}>
                <Row className="" style={{ backgroundColor: "transparent" }}>
                    <Col md={3} style={{ backgroundColor: "transparent", position: "relative", paddingRight: "0px" }}>
                        <img
                            src={
                                `${import.meta.env.VITE_API_URL}/${selectedGame?.data?.gameImage}` ||
                                gm2
                            }
                            alt={selectedGame?.data?.name}
                            className="img-fluid rounded"
                            style={{
                                width: "90%",
                                height: "230px",
                                borderRadius: "19px",
                                objectFit: "cover",
                                // paddingRight: "0px",
                            }}
                        />
                        <div
                            onClick={() => navigate(`/admin/games/edit-game/${id}`)}
                            className="rounded-circle"
                            style={{
                                position: "absolute",
                                bottom: "5px",
                                right: "30px",
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
                            <BiPencil color="blue" />
                        </div>
                    </Col>
                    <Col
                        md={6}
                        className="d-flex flex-column justify-content-around"
                        style={{ backgroundColor: "transparent" }}
                    >
                        <h5>{selectedGame?.data?.name}({selectedGame?.data?.size})
                        </h5>
                        <p className="text-muted">{selectedGame?.data?.details}</p>

                        {/* Buttons Container */}
                        {/* <div className="d-flex gap-2">
                            Cancellation : {selectedGame?.data?.cancellation ? "Yes" : "No"}
                        </div> */}
                        <div className="d-flex gap-2">
                            <div><img src="/assets/Admin/Game/paylater.svg" className="me-1 mb-1 p-1" alt="paylater" /> {selectedGame?.data?.payLater ? "Pay Later" : "Pay Now"}</div>
                            <div><img src="/assets/Admin/Game/singleplayer.svg" className="me-1 mb-1 p-1" alt="paylater" />{selectedGame?.data?.type}</div>
                            <div><img src="/assets/Admin/Game/indoor.svg" className="me-1 mb-1 p-1" alt="paylater" />{selectedGame?.data?.zone}</div>
                            <div><img src="/assets/Admin/Game/crosssign.svg" className="me-1 mb-1 p-1" alt="paylater" />{selectedGame?.data?.cancellation ? "Cancellation Yes" : "Cancellation No"}</div>
                        </div>

                        {/* Timestamps Container */}
                        {/* <div className="mt-3">
                            <p>
                                <b>Created At:</b> <span>{new Date(selectedGame?.data?.createdAt).toLocaleString()}</span>
                            </p>
                            <p>
                                <b>Updated At:</b> <span>{new Date(selectedGame?.data?.updatedAt).toLocaleString()}</span>
                            </p>
                        </div> */}

                        <div>
                            <img src="/assets/Admin/Game/price.svg" className="mb-2" alt="paylater" />
                            <span style={{ color: "#0062FF", fontSize: "24px" }} className="fw-bold text-primary">{selectedGame?.data?.price}</span>
                        </div>
                    </Col>

                    <Col
                        md={3}
                        className="d-flex flex-column justify-content-between align-items-end"
                        style={{ backgroundColor: "transparent" }}
                    >
                        <div>
                            <span className="text-color">Created At - </span><span>{new Date(selectedGame?.data?.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                            <Button
                                variant="primary"
                                style={{ width: "128px", height: "37px" }}
                                onClick={handleSlotCreate}
                            >
                                Add Slots
                            </Button>
                        </div>


                    </Col>
                </Row>
            </Card>

            {/* Calendar Section */}

            <div className="calendar-slider mt-5">
                <div className="date-container">
                    {weekdays.map((day, index) => (
                        <div
                            key={index}
                            className={`date-box ${day === weekdays[activeDate.getDay()] ? "active" : ""}`}
                            onClick={() => {
                                const today = new Date();
                                const selectedDay = weekdays.indexOf(day);
                                const diff = selectedDay - today.getDay();
                                const newDate = new Date(today);
                                newDate.setDate(today.getDate() + diff);
                                setActiveDate(newDate);
                            }}                        >
                            <small style={{ fontSize: "1rem", fontWeight: "bold" }}>
                                {day}
                            </small>
                        </div>
                    ))}
                </div>

                <style jsx>{`
            .date-container {
                display: flex;
                justify-content: space-between;
                width: 100%;
                flex-wrap: nowrap;
            }

            .date-box {
                cursor: pointer;
                padding: 10px;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 10px;
                min-width: 100px;
                background: #fff;
                flex: 1;
                margin: 5px;
            }

            .date-box.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }

            @media (max-width: 768px) {
                .date-container {
                    flex-wrap: wrap;
                }

                .date-box {
                    flex: 1 1 45%;
                    min-width: 0;
                }
            }
        `}</style>

                {/* {activeDate.getDay() === 0 ? ( */}
                {filteredSlots.length === 0 ? (
                    <div className="no-slots-message d-flex flex-column align-items-center border border-3 rounded-4 justify-content-center" style={{ height: "40vh", textAlign: "center", marginTop: "20px" }}>
                        <TbMoodSad style={{ fontSize: "4rem", color: "gray" }} />
                        <p style={{ fontSize: "1rem", color: "gray", fontWeight: "bold" }}>
                            Sorry! No Slots Available for Today
                        </p>
                    </div>
                ) : (
                    <div className="booking-slots mt-5 p-3">
                        <Button
                            variant="primary"
                            style={{ width: "128px", height: "37px" }}
                            onClick={() => handleCopySlots(weekdays[activeDate.getDay()])} // Pass the active day
                            className="mb-3"
                        >
                            Copy Slots
                        </Button>

                        <div className={`${isMobile ? 'list-view' : ''} `}>
                            {/* {slots.map((slot, index) => ( */}
                            {filteredSlots.map((slot, index) => (
                                <Card key={index} className={`slot-row mb-2 ${isMobile ? 'list-item p-2' : 'border border-2 px-4 py-2'}`}>
                                    <div className={`d-flex flex-column ${isMobile ? '' : 'flex-md-row justify-content-between align-items-center'}`}>
                                        <span className="mb-2 mb-md-0">{slot.start_time} - {slot.end_time}</span>
                                        <div className={`d-flex ${isMobile ? '' : 'flex-md-row'} align-items-center gap-3`}>
                                            <span className={slot.is_active ? "text-success" : "text-danger"}>
                                                {slot.is_active ? "Available" : "Booked"}
                                            </span>
                                            <span>₹{slot.slot_price ? slot.slot_price : selectedGame?.data.price}</span>
                                            <Button
                                                disabled={slot.status === "Booked"}
                                                className="w-100 w-md-auto"
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                    boxShadow: "none",
                                                    outline: "none",
                                                }}
                                                onClick={() => handleEditSlot(slot)}
                                            >
                                                <FaEdit style={{ color: "blue", fontSize: "1.2rem" }} />
                                            </Button>

                                            <Button
                                                onClick={() => handleToggleStatus(slot)}
                                                size="sm"
                                                className="rounded-2"
                                                style={{
                                                    backgroundColor: slot?.is_active ? "green" : "red", // slotStatus[slot._id] ? "green" : "red",
                                                    borderColor: slot?.is_active ? "green" : "red",
                                                    color: "white",
                                                    padding: "5px 15px",
                                                    fontSize: "14px",
                                                    width: "100px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {slot?.is_active ? "Active" : "Deactive"}
                                            </Button>

                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showSlotModal && (
                <CreateSlotModal
                    show={showSlotModal}
                    handleClose={() => setShowSlotModal(false)}
                    selectedGame={selectedGame}
                    slot={slotToEdit}
                    refetchSlots={refetchSlots} // pass this down
                />
            )}
        </div>
    );
};

export default GameDetails;

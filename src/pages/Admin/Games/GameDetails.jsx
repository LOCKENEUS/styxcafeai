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
import { deleteslot, getslots } from "../../../store/slices/slotsSlice";
import { FaEdit } from "react-icons/fa";

const GameDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedGame, status, error } = useSelector((state) => state.games);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [slotStatus, setSlotStatus] = useState({});
    const [activeDate, setActiveDate] = useState(new Date());
    const slots = useSelector((state) => state.slots?.slots || []);
    const [slotToEdit, setSlotToEdit] = useState(null);

    let gameId = id;

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
            setSlotStatus(initialStatus);
        }
    }, [slots]);

    const handleToggleStatus = (slot) => {
        const newStatus = !slotStatus[slot._id];

        setSlotStatus(prev => ({
            ...prev,
            [slot._id]: newStatus
        }));

        dispatch(deleteslot(slot._id)).then(() => {
            dispatch(getslots(gameId));
        });
    };

    const generateWeekdays = () => {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    };

    const weekdays = generateWeekdays();

    const handleEditSlot = (slot) => {
        setSlotToEdit(slot);
        setShowSlotModal(true);
    };

    const filteredSlots = slots.filter(slot => slot.day === weekdays[activeDate.getDay()]);

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
                        <h5>{selectedGame?.data?.name}({selectedGame?.data?.size})
                            <Button
                                variant="success"
                                className="rounded-pill"
                                style={{
                                    backgroundColor: "#03D41414",
                                    color: "#00AF0F",
                                    border: "none",
                                    marginLeft: "10px",
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
                                    marginLeft: "10px",
                                }}
                            >
                                Zone: {selectedGame?.data?.zone}
                            </Button>
                        </h5>
                        <p className="text-muted">{selectedGame?.data?.details}</p>

                        {/* Buttons Container */}
                        <div className="d-flex gap-2">
                            Cancellation : {selectedGame?.data?.cancellation ? "Yes" : "No"}
                        </div>

                        {/* Timestamps Container */}
                        <div className="mt-3">
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
                            onClick={handleSlotCreate}
                        >
                            Add Slots
                        </Button>
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
                justify-content: space-around;
                width: 100%;
            }

            .date-box {
                cursor: pointer;
                padding: 10px;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 20px;
                min-width: 100px;
                background: #fff;
            }

            .date-box.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
        `}</style>

                {/* {activeDate.getDay() === 0 ? ( */}
                {filteredSlots.length === 0 ? (
                    <div className="no-slots-message d-flex flex-column align-items-center border border-3 rounded-4 justify-content-center" style={{ height: "40vh", textAlign: "center", marginTop: "20px" }}>
                        <TbMoodSad style={{ fontSize: "4rem", color: "gray" }} />
                        <p style={{ fontSize: "1rem", color: "gray", fontWeight: "bold" }}>
                            Sorry! No Slots Available for Today
                        </p>
                        <button onClick={() => setActiveDate(new Date(2025, 1, 17))} style={{ backgroundColor: "white", padding: "10px 20px", borderRadius: "10px", border: "2px solid blue", color: "blue" }}>
                            Book For 17 Mon
                        </button>
                    </div>
                ) : (
                    <div className="booking-slots mt-5 p-3">
                        {/* {slots.map((slot, index) => ( */}
                        {filteredSlots.map((slot, index) => (
                            <div key={index} className="slot-row mb-2 border border-2 px-4 py-2">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                                    <span className="mb-2 mb-md-0">{slot.start_time} - {slot.end_time}</span>
                                    <div className="d-flex flex-column flex-md-row align-items-center gap-3">
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
                                            className="rounded-pill"
                                            style={{
                                                backgroundColor: slotStatus[slot._id] ? "green" : "red",
                                                borderColor: slotStatus[slot._id] ? "green" : "red",
                                                color: "white",
                                                padding: "5px 15px",
                                                fontSize: "14px",
                                                width: "80px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {slotStatus[slot._id] ? "Active" : "Deactive"}
                                        </Button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showSlotModal && (
                <CreateSlotModal
                    show={showSlotModal}
                    handleClose={() => setShowSlotModal(false)}
                    selectedGame={selectedGame}
                    slot={slotToEdit}
                />
            )}
        </div>
    );
};

export default GameDetails;

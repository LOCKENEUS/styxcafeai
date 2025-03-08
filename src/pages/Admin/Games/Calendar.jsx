  import React, { use, useEffect, useState } from "react";
  import { Button } from "react-bootstrap";
  import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
  import { TbMoodSad } from "react-icons/tb";
  import { useNavigate, useParams } from "react-router-dom";
  import { getslots } from "../../../store/slices/slotsSlice";
  import { useDispatch, useSelector } from "react-redux";

  const Calendar = ({ selectedGame }) => {

    const {id} = useParams();
    const [activeDate, setActiveDate] = useState(new Date());
    const [currentIndex, setCurrentIndex] = useState(0);

  let gameId = id;


    const generateDates = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 22; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        dates.push({
          day: date.getDate(),
          month: date.toLocaleString("default", { month: "short" }),
          status:
            i === 0
              ? "Today"
              : date.toLocaleString("default", { weekday: "short" }),
        });
      }
      return dates;
    };

    const dates = generateDates();

    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 9) % dates.length);
    };

    const handlePrev = () => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 9 + dates.length) % dates.length
      );
    };

    const visibleDates = dates.slice(currentIndex, currentIndex + 9);

    console.log(activeDate.getDay());

    return (
      <div className="calendar-slider mt-5">
        <style jsx>{`
          .calendar-slider {
            position: relative;
            max-width: 100%;
            margin: 0 auto;
            padding: 0 15px;
          }

          .date-container {
            display: flex;
            justify-content: space-between;
            margin: 0 40px;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .date-container::-webkit-scrollbar {
            display: none;
          }

          .date-box {
            cursor: pointer;
            padding: 10px;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 20px;
            min-width: 100px;
            background: #fff;
            margin: 0 5px;
            flex-shrink: 0;
          }

          .date-box.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .date-box.today {
            border-color: #28a745;
            background: #f8f9fa;
          }

          .nav-button {
            position: absolute;
            top: 5%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 24px;
            color: #007bff;
            cursor: pointer;
          }

          .prev-button {
            left: 0;
          }

          .next-button {
            right: 0;
          }

          /* Tablet Styles */
          @media (max-width: 768px) {
            .date-container {
              margin: 0 30px;
            }

            .date-box {
              min-width: 90px;
              padding: 8px;
            }

            .nav-button {
              font-size: 20px;
            }
          }

          /* Mobile Styles */
          @media (max-width: 576px) {
            .date-container {
              margin: 0 20px;
            }

            .date-box {
              min-width: 80px;
              padding: 6px;
              border-radius: 15px;
            }

            .nav-button {
              font-size: 18px;
            }
          }
        `}</style>

        <button className="nav-button prev-button" onClick={handlePrev}>
          <RiArrowLeftSLine />
        </button>

        <div className="date-container">
          {visibleDates.map((date, index) => (
            <div
              key={index}
              style={{
                backgroundColor:
                  date.day === activeDate.getDate() &&
                  date.month ===
                    activeDate.toLocaleString("default", { month: "short" })
                    ? "#007bff"
                    : "#0062FF0D",
                border: "none",
              }}
              className={`date-box ${
                date.day === activeDate.getDate() &&
                date.month ===
                  activeDate.toLocaleString("default", { month: "short" })
                  ? "active"
                  : ""
              } ${date.status === "Today" ? "today" : ""}`}
              onClick={() => {
                const newDate = new Date(activeDate);
                newDate.setDate(date.day);
                newDate.setMonth(
                  new Date().getMonth() +
                    (date.month !==
                    new Date().toLocaleString("default", { month: "short" })
                      ? 1
                      : 0)
                );
                setActiveDate(newDate);
              }}
            >
              <small style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {date.status}
              </small>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div>{date.day}</div>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: date.status.startsWith("Sun")
                      ? "red"
                      : "green",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="nav-button next-button" onClick={handleNext}>
          <RiArrowRightSLine />
        </button>

        {activeDate.getDay() === 0 ? (
          <div
            className="no-slots-message d-flex flex-column align-items-center border border-3 rounded-4  justify-content-center"
            style={{ height: "40vh", textAlign: "center", marginTop: "20px" }}
          >
            <TbMoodSad style={{ fontSize: "4rem", color: "gray" }} />
            <p style={{ fontSize: "1rem", color: "gray", fontWeight: "bold" }}>
              Sorry! No Slots Available for Today
            </p>
            <button
              onClick={() => setActiveDate(new Date(2025, 1, 17))}
              style={{
                backgroundColor: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "2px solid blue",
                color: "blue",
              }}
            >
              Book For 17 Mon
            </button>
          </div>
        ) : (
          <BookingSlots date={activeDate} selectedGame={selectedGame} gameId={gameId}/>
        )}
      </div>
    );
  };

  const BookingSlots = ({ date, selectedGame, gameId }) => {
    // console.log("selected game",selectedGame);
    // const { gameId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const slots = useSelector((state) => state.slots?.slots || []);

    console.log("game id from calendar...", gameId);
    useEffect(() => {
      if(gameId){
        dispatch(getslots(gameId));
      }
    }, [gameId, dispatch]);
    
    const handleBookSlot = async (gameId, slotId, date) => {
      // setShowClientModal(true);
      navigate(`/admin/bookings/booking-details/${gameId}/${slotId}/${date}`);
    };

    return (
      <div className="booking-slots mt-5">
        {slots.map((slot, index) => (
          <div key={index} className="slot-row mb-2 border border-2 p-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <span className="mb-2 mb-md-0">
                {slot.start_time} - {slot.end_time}
              </span>
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <span className={slot.is_active ? "text-success" : "text-danger"}>
                  {slot.is_active ? "Available" : "Booked"}
                </span>
                <span>₹{slot.slot_price ? slot.slot_price : selectedGame?.data.price}</span>
                <Button
                  variant="primary"
                  disabled={slot.status === "Booked"}
                  className="w-100 w-md-auto"
                  style={{
                    backgroundColor: "white",
                    border: "2px solid blue",
                    color: "blue",
                    minWidth: "120px",
                  }}
                  onClick={() => handleBookSlot(gameId, slot._id, date)}
                >
                  Book Slot
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  export default Calendar;

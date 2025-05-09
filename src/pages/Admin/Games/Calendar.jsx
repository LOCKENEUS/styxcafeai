import React, { use, useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { TbMoodSad } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { getslots, getslots24 } from "../../../store/slices/slotsSlice";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12Hour } from "../../../components/utils/utils";
import { getBookingsByGame } from "../../../store/AdminSlice/BookingSlice";
import CreateSlotModal from "./Modal/CreateSlotModal";

const Calendar = ({ selectedGame }) => {
  const [isMobile, setIsMobile] = useState(false);
  const id = selectedGame?.data?._id;
  const [activeDate, setActiveDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1200;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
  
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
  
      dates.push({
        fullDate: date,
        day: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        status: i === 0 ? "Today" : date.toLocaleString("default", { weekday: "short" }),
      });
    }
  
    return dates;
  };
  
  const dates = generateDates();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 7) % dates.length);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 7, 0));
    }
  };
  

  const visibleDates = dates.slice(currentIndex, currentIndex + 7);

  return (<>
 <div className="m-4">
  {activeDate.toLocaleString("default", { month: "long" })} {activeDate.getFullYear()}
</div>

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

      <button
  className="nav-button prev-button mt-3"
  onClick={handlePrev}
  disabled={currentIndex === 0}
  style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}
>
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
            className={`date-box ${date.day === activeDate.getDate() &&
              date.month ===
              activeDate.toLocaleString("default", { month: "short" })
              ? "active"
              : ""
              } ${date.status === "Today" ? "today" : ""}`}
            onClick={() => {
              setActiveDate(date.fullDate);
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
                    ? "orange"
                    : "green",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="nav-button next-button mt-3" onClick={handleNext}>
        <RiArrowRightSLine />
      </button>
      <BookingSlots date={activeDate} selectedGame={selectedGame} gameId={id} />
    </div>
    </>
  );
};

const BookingSlots = ({ date, selectedGame, gameId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  const slots = useSelector((state) => state.slots?.slots || []);
  const bookings = useSelector((state) => state.bookings?.bookings || []);

  useEffect(() => {
    if (gameId) {
      dispatch(getslots24(gameId));
      dispatch(getBookingsByGame(gameId)); // Fetch bookings for the selected game
    }
  }, [gameId, dispatch]);

  // Function to extract the day name from a given date
  const getDayName = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
  };

  const selectedDay = getDayName(date); // Get the selected day's name

  const isSlotBooked = (slotId, date) => {
    return bookings.some(
      (booking) =>
        booking.slot_id?._id === slotId && booking.status !== "Paid" &&
        new Date(booking.slot_date).toDateString() === new Date(date).toDateString()
    );
  };

  const handleBookSlot = async (gameId, slotId, date) => {
    setIsLoading(true);
    navigate(`/admin/bookings/booking-details/${gameId}/${slotId}/${date}`);
    setIsLoading(false);
  };

  const handleSlotCreate = () => {
    setShowSlotModal(true) // Navigate to the game details page to create slots
  };

  return (
    <div className="booking-slots mt-5">
      {slots.filter((slot) => slot.day === selectedDay).length === 0 ? (
        // <div className="text-center text-muted mt-3">No slots available</div>
        <div className="no-slots-message d-flex flex-column align-items-center border border-3 rounded-4 justify-content-center" style={{ height: "40vh", textAlign: "center", marginTop: "20px" }}>
          <TbMoodSad style={{ fontSize: "4rem", color: "gray" }} />
          <p style={{ fontSize: "1rem", color: "gray", fontWeight: "bold" }}>
            Sorry! No Slots Available for Today
          </p>
          <button onClick={handleSlotCreate} style={{ backgroundColor: "white", padding: "10px 20px", borderRadius: "10px", border: "2px solid blue", color: "blue" }}>
            Click to create new slots
          </button>
        </div>
      ) : (
        slots
          .filter((slot) => slot.day === selectedDay)
          .sort((a, b) => {
            const [aH, aM] = a.start_time.split(":").map(Number);
            const [bH, bM] = b.start_time.split(":").map(Number);
            return aH !== bH ? aH - bH : aM - bM;
          })
          .map((slot, index) => {
            const currentTime = new Date();
            const slotDateTime = new Date(date);

            const slotHours = parseInt(slot.start_time.split(":")[0], 10);
            const slotMinutes = parseInt(slot.start_time.split(":")[1], 10);
            slotDateTime.setHours(slotHours, slotMinutes, 0, 0);

            const isPast = slotDateTime < currentTime;
            const booked = isSlotBooked(slot._id, date);

            return (
              <Card key={index} className="slot-row mb-2 border border-2 p-2">
                <div className="d-flex  flex-md-row justify-content-between align-items-center">
                  <span className="mb-2 mx-2 text-medium mb-md-0">
                    {convertTo12Hour(slot.start_time)} - {convertTo12Hour(slot.end_time)}
                  </span>
                  <div className="d-flex  flex-md-row align-items-center gap-3">
                    <span className={booked ? "text-danger" : slot.is_active ? "text-success" : "text-danger"}>
                      {booked ? "Booked" : slot.is_active ? "Available" : "Unavailable"}
                    </span>
                    <span className="text-medium">₹{slot.slot_price ? slot.slot_price : selectedGame?.data.price}</span>
                    <Button
                      variant="primary"
                      disabled={booked || isPast || !slot.is_active}
                      className="w-100 w-md-auto"
                      style={{
                        backgroundColor: booked || isPast ? "#ccc" : "white",
                        border: booked || isPast || !slot.is_active ? "2px solid gray" : "2px solid blue",
                        color: booked || isPast || !slot.is_active ? "gray" : "blue",
                        minWidth: "120px",
                      }}
                      onClick={() => handleBookSlot(gameId, slot._id, date)}
                    >
                      {booked ? "Booked" : isPast ? "Time Passed" : !slot.is_active ? "Unavailable" : "Book Slot"}{isLoading && <Spinner animation="border" size="sm" />}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
      )}

      {showSlotModal && (
        <CreateSlotModal
          show={showSlotModal}
          handleClose={() => setShowSlotModal(false)}
          selectedGame={selectedGame}
        />
      )}
    </div>
  );

};

export default Calendar;

// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Button, Image, Stack, Form, OverlayTrigger, Tooltip, Modal, Table, Dropdown, Popover } from "react-bootstrap";
// import { FaPhone, FaVideo, FaComment, FaClock, FaRegClock, FaPause } from "react-icons/fa";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import userProfile from "/assets/profile/user_avatar.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import { convertTo12Hour, formatDate, formatDateAndTime } from "../../../components/utils/utils";
// import { addToCart, getBookingDetails, processOnlinePayment, updateBooking } from "../../../store/AdminSlice/BookingSlice";
// import { VscDebugContinue } from "react-icons/vsc";
// import { initializeTimer, pauseBookingTimer, resumeBookingTimer, startBookingTimer, stopBookingTimer } from "../../../store/AdminSlice/TimerSlice";
// import "./BookingCheckout.css";
// import Select from "react-select";
// import { getItems } from "../../../store/AdminSlice/Inventory/ItemsSlice";
// import { getTaxFields } from "../../../store/AdminSlice/TextFieldSlice";
// import CreditSplit from "./Model/CreditSplit";
// import { TbTrash } from "react-icons/tb";
// import ItemsSave from "./Model/itemsSave";

// const BookingCheckout = () => {

//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const booking = useSelector((state) => state.bookings.booking);
//   const { isRunning, isPaused, startTime, elapsedTime, pausedTime } = useSelector((state) => state.timer.timer);
//   const [currentTime, setCurrentTime] = useState(elapsedTime || 0);

//   const backend_url = import.meta.env.VITE_API_URL;

//   const maxVisiblePlayers = 2;
//   const [priceToPay, setPriceToPay] = useState(0);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [selectedValue, setSelectedValue] = useState("");

//   const [options, setOptions] = useState([]);
//   const [showConfirmOffline, setShowConfirmOffline] = useState(false);
//   const [isItemsSaved, setIsItemsSaved] = useState(true);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [showCreditModal, setShowCreditModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [showInventory, setShowInventory] = useState(false);
//   const [addOnTotal, setAddOnTotal] = useState(0);
//   const [playerCredits, setPlayerCredits] = useState([]);
//   const [adjustment, setAdjustment] = useState("");
//   const [payableAmount, setPayableAmount] = useState("");
//   const [creditAmount, setCreditAmount] = useState("");
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [looserPlayer, setLooserPlayer] = useState(null);
//   const [slot, setSlot] = useState(null);
//   const [players, setPlayers] = useState([]);
//   const [paused, setPaused] = useState(false);
//   const [isStopped, setIsStopped] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [totals, setTotals] = useState({
//     subtotal: 0,
//     discount: 0,
//     discountType: 'Percentage',
//     taxAmount: 0,
//     selectedTaxes: [],
//     total: 0,
//     adjustmentNote: '',
//     adjustmentAmount: 0
//   });

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const cafeId = user?._id;

//   const items = useSelector((state) => state.items.items);
//   const { taxFields } = useSelector((state) => state.taxFieldSlice);

//   useEffect(() => {
//     if (items.length > 0) {
//       setOptions(items.map((item) => ({ value: item._id, label: `${item.name} (₹ ${item.sellingPrice})` })));
//     }
//   }, [items]);

//   useEffect(() => {
//     if (id) {
//       dispatch(getItems(cafeId));
//       dispatch(getTaxFields(cafeId));
//       dispatch(getBookingDetails(id));
//     }
//   }, [dispatch, id, isStopped]);

//   useEffect(() => {
//     if (booking) {
//       setSelectedGame(booking?.game_id);
//       setSelectedCustomer(booking?.customer_id);
//       setSlot(booking?.slot_id);
//       setPlayers(booking?.players);

//       // if (booking?.so_id) {
//       //   setShowInventory(true)
//       //   const mappedItems = booking.so_id.items.map((item) => ({ id: item.item_id._id, item: item.item, price: item.price, quantity: item.quantity, tax: item.tax, total: item.total, totalTax: item.tax_amt }));
//       //   setSelectedItems(mappedItems)
//       //   setSelectedIds(mappedItems.map((item) => item?.id));
//       // }

//       if (booking?.so_id) {
//         const mappedItems = booking.so_id.items.map((item) => ({
//           id: item.item_id._id,
//           item: item.item,
//           price: item.price,
//           quantity: item.quantity,
//           tax: item.tax,
//           total: item.total,
//           totalTax: item.tax_amt,
//         }));
//         setSelectedItems(mappedItems);
//         setSelectedIds(mappedItems.map((item) => item.id));
//       } else {
//         setSelectedItems([]);
//         setSelectedIds([]);
//       }

//       dispatch(initializeTimer(booking))

//       if (booking.timer_status === "Running") {
//         if (booking.start_time) {
//           const elapsed = Math.floor((Date.now() - new Date(booking.start_time)) / 1000);
//           const adjustedTime = booking.paused_time > 0 ? elapsed - booking.paused_time : elapsed;
//           setCurrentTime(adjustedTime);
//         }
//       } else if (booking.timer_status === "Paused") {
//         setCurrentTime(booking.paused_time || 0);
//         setPaused(true);
//       } else {
//         setCurrentTime(booking.total_time || 0);
//       }
//     }
//   }, [booking]);

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setCurrentTime((prev) => prev + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   const pricePerSecond = slot?.slot_price > 0 ? slot?.slot_price / 3600 : selectedGame?.price / 3600

//   useEffect(() => {
//     const secondsElapsed = currentTime;
//     setPriceToPay(Math.round(secondsElapsed * pricePerSecond));
//     setTotal(Math.round(secondsElapsed * pricePerSecond) + addOnTotal - adjustment);
//     // if (addOnTotal > 0) {
//     //   setPriceToPay(Math.round((secondsElapsed * pricePerSecond) + addOnTotal));
//     // }
//     // if (adjustment > 0) {
//     //   setPriceToPay(Math.round((secondsElapsed * pricePerSecond) + addOnTotal - adjustment));
//     // }
//   }, [currentTime, pricePerSecond, addOnTotal, adjustment]);

//   useEffect(() => {
//     if (selectedItems.length > 0) {
//       let total = 0;
//       selectedItems.map((item) => {
//         total += item.total;
//       })
//       setAddOnTotal(total)

//     } else {
//       setAddOnTotal(0)
//     }
//   }, [selectedItems, selectedIds]);

//   const handleChange = (selectedOption) => {
//     let id = selectedOption.value;
//     if (!id || selectedIds.includes(id)) return;

//     setSelectedValue("");

//     setIsItemsSaved(false);

//     const selected = items.find(item => item._id === id);

//     if (selected) {
//       const totalTax = Math.round((selected.tax?.tax_rate * selected.sellingPrice) / 100) || 0;
//       const total = selected.sellingPrice + totalTax || 0;
//       setSelectedItems([...selectedItems, {
//         id: selected._id,
//         item: selected.name,
//         price: selected.sellingPrice,
//         quantity: 1,
//         tax: selected.tax || null,
//         total: total,
//         totalTax: totalTax
//       }]);
//       setSelectedIds([...selectedIds, selected._id]);
//       setSelectedOption(null)
//     }
//   };

//   const updateProduct = (id, field, value) => {
//     const updatedItems = selectedItems.map((product) => {
//       if (product.id === id) {
//         setIsItemsSaved(false);
//         // const updatedQuantity = field === "quantity" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : product.quantity; // Ensure only numeric input
//         const updatedQuantity = field === "quantity"
//           ? parseInt(String(value).replace(/\D/g, ""), 10) || 0
//           : product.quantity;

//         const taxRate = product.tax?.tax_rate || 0;
//         const totalTax = Math.round((taxRate * product.price * updatedQuantity) / 100);
//         const total = product.price * updatedQuantity + totalTax;

//         return {
//           ...product,
//           [field]: updatedQuantity,
//           total,
//           totalTax,
//         };
//       }
//       return product;
//     });

//     setSelectedItems(updatedItems);
//   };

//   useEffect(() => {
//     if (booking && booking.timer_status !== "Stopped") {
//       setPaused(booking.timer_status === "Paused");

//       if (booking.start_time) {
//         const elapsed = Math.floor((Date.now() - new Date(booking.start_time)) / 1000);
//         setCurrentTime(booking.paused_time || elapsed);
//       }
//     }
//   }, [booking]);

//   const handleStartTimer = () => {
//     const today = new Date().toISOString().slice(0, 10); // e.g., "2025-04-22"
//     const bookingDate = booking?.slot_date?.slice(0, 10); // "2025-04-24"

//     if (today === bookingDate) {
//       dispatch(startBookingTimer(booking._id));
//     } else {
//       alert("Timer can only be started on the booking date.");
//       // Optional: alert("You can only start the timer on the booking day.");
//     }
//     // dispatch(startBookingTimer(booking._id));
//   };

//   const handlePauseTimer = () => {
//     dispatch(pauseBookingTimer(booking._id));
//   };

//   const handleResumeTimer = () => {
//     dispatch(resumeBookingTimer(booking._id));
//   };

//   const handleStopTimer = async () => {
//     try {
//       // Stop the timer in the backend
//       await dispatch(stopBookingTimer(booking._id));

//       // Stop the timer in the frontend immediately
//       setIsStopped(true);
//       setPaused(true); // Mark the timer as paused
//       clearInterval(); // Clear the interval to stop the timer updates

//       // Fetch the updated booking details to get the stopped time
//       const updatedBooking = await dispatch(getBookingDetails(booking._id)).unwrap();
//       setCurrentTime(updatedBooking.total_time || 0); // Update the timer with the stopped time
//     } catch (error) {
//       console.error("Error stopping the timer:", error);
//     }
//   };

//   const handleSaveItems = async () => {
//     try {
//       const itemsData = {
//         items: selectedItems,
//         customer_id: selectedCustomer?._id,
//         cafe: cafeId
//       };
//       await dispatch(addToCart({ id: booking?._id, updatedData: itemsData })).unwrap()
//       setIsItemsSaved(true); // Mark items as saved
//     } catch (error) {
//       console.error("Error saving items:", error);
//     }
//   }

//   const handleOnlinePayment = async (finalPlayers, payableAmount) => {

//     try {
//       const payer = looserPlayer || selectedCustomer; // Use looser player if selected, otherwise main customer

//       const formattedPlayers = finalPlayers.map(({ _id, ...rest }) => ({
//         id: _id,
//         ...rest,
//       }));

//       if (payableAmount <= 0) {
//         alert("Amount must be greater than 0")
//         return
//       }

//       const response = await dispatch(
//         processOnlinePayment({
//           selectedGame,
//           selectedCustomer: payer, // Set the payer
//           slot,
//           payableAmount,
//           paid_amount: payableAmount,
//           total: total,
//           looserPlayer: looserPlayer,
//           bookingId: booking?._id,
//           playerCredits: formattedPlayers,
//           adjustment
//         })
//       );
//     } catch (error) {
//       console.error("Error processing online payment:", error);
//     }
//   };

//   const handleCollectOffline = async (finalPlayers, currentTotal) => {

//     const formattedPlayers = finalPlayers
//       .filter(player => player.credit !== undefined && player.credit !== null)  // Filter out players without 'credit'
//       .map(({ _id, ...rest }) => ({
//         id: _id,
//         ...rest,
//       }));

//     try {
//       const bookingData = {
//         mode: "Offline",
//         status: "Paid",
//         total: total,
//         paid_amount: currentTotal,
//         playerCredits: formattedPlayers,
//         looserPlayer: looserPlayer,
//         adjustment
//       };
//       const response = await dispatch(updateBooking({ id: booking?._id, updatedData: bookingData })).unwrap()

//       // if (response.data) {
//       //   navigate(`admin/booking/checkout/${id}`)
//       // }
//     } catch (error) {
//       console.error("Error processing offline payment:", error);
//     }
//   };

//   const handleSelectLooserPlayer = (player) => {
//     setLooserPlayer(player);
//   };

//   const renderCreditsPopover = (
//     <Popover id="player-credits-popover">
//       <Popover.Header as="h3">Player Credits</Popover.Header>
//       <Popover.Body>
//         {booking?.playerCredits?.length > 0 ? (
//           <ul className="mb-0 ps-3">
//             {booking.playerCredits.map((player, index) => (
//               <li key={index}>
//                 {player.name || player.id}: ₹ {player.credit || 0}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div>No credits data</div>
//         )}
//       </Popover.Body>
//     </Popover>
//   );

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       border: 'none',
//       borderRadius: '16px',
//       cursor: 'pointer',
//       // padding: '2%',
//       boxShadow: 'none',
//       '&:hover': {
//         border: 'none'
//       }
//     }),
//     // Optional: adjust dropdown indicator and other parts if needed
//   };

//   return (
//     <Container className="mt-4 pb-3">
//       <Row>
//         <h5>
//           <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>
//             {"Bookings/Checkout"}
//           </span>
//         </h5>

//       </Row>

//       <Row>
//         <Col md={3} className="border-0 p-0 bg-light">
//           <Card className="p-3">
//             <Card.Img
//               variant="top"
//               src={`${backend_url}/${selectedGame?.gameImage}`}
//               className="rounded"
//               style={{ height: "200px", width: "auto", objectFit: "cover" }}
//             />
//             <Row className="align-items-center mt-3">
//               <Col xs={3}>
//                 <Image
//                   src={userProfile}
//                   roundedCircle
//                   fluid
//                 />
//               </Col>
//               <Col className="p-0">
//                 <h5 className="mb-0">{selectedCustomer?.name}</h5>
//                 <small className="muted-text">Booking ID : {booking?.booking_id}</small>
//               </Col>
//             </Row>
//             <hr />
//             <div className="w-100">
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Full Name:</strong> <span>{selectedCustomer?.name}</span>
//               </p>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Email:</strong> <span>{selectedCustomer?.email}</span>
//               </p>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Phone Number:</strong> <span>{selectedCustomer?.contact_no}</span>
//               </p>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Payment Status:</strong>
//                 <span className="text-success">{booking?.status}</span>
//               </p>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Credit:</strong> <span className="text-warning">₹ {selectedCustomer?.creditLimit - selectedCustomer?.creditAmount} Remaining</span>
//               </p>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Location:</strong> <span>{selectedCustomer?.address || "-"}</span>
//               </p>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Played Games:</strong> <span>{booking?.totalGamesPlayed}</span>
//               </p>
//             </div>

//             <hr />
//             <Row className="text-center">
//               <Col>
//                 <FaPhone size={20} />
//               </Col>
//               <Col>
//                 <FaComment size={20} />
//               </Col>
//               <Col>
//                 <FaVideo size={20} />
//               </Col>
//             </Row>
//           </Card>
//           {(booking?.booking_type === "Regular" && selectedGame?.cancellation && booking?.status === "Pending") || (booking?.booking_type === "Regular" && selectedGame?.cancellation && !selectedGame?.payLater) ?
//             <Button
//               variant="success"
//               className="w-100 mt-3"
//               style={{ backgroundColor: "#03D41414", color: "#00AF0F" }}
//               onClick={() => navigate(`/admin/booking/edit/${booking?._id}`)}
//             >
//               Edit Booking
//             </Button>
//             :
//             <></>}
//         </Col>

//         <Col md={9} className="d-flex flex-column gap-1 justify-content-between">
//           <Row>
//             <Col
//               md={6}
//               className={`d-flex flex-column p-0 justify-content-between transition-col`}
//             >
//               <Card className="p-3 h-100" style={{ marginLeft: "10px" }}>
//                 <h5 className="font-inter mb-3 pb-3 fs-4 text-color" style={{ borderBottom: "1px solid #ccc" }}>Booking Details
//                   {selectedGame?.payLater ?
//                     <span className="fw-bold text-info float-end">Amount : ₹ {slot?.slot_price ? slot?.slot_price : selectedGame?.price}/Hr</span>
//                     :
//                     <span className="fw-bold text-info float-end">Amount : ₹ {booking?.total}</span>
//                   }
//                 </h5>
//                 <Row>
//                   <Col xs={6}>
//                     <p className="text-color m-0">Selected Game</p>
//                   </Col>
//                   <Col xs={6}>
//                     <p className="muted-text mb-3">
//                       <span className="muted-text">{selectedGame?.name}({selectedGame?.size})</span>
//                       <span
//                         style={{
//                           backgroundColor: "#03D41414",
//                           color: "#00AF0F",
//                           border: "none",
//                           fontSize: "12px",
//                           marginLeft: "5px",
//                         }}
//                       >
//                         {selectedGame?.type}
//                       </span>
//                     </p>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col xs={6}>
//                     <p className="text-color m-0">Pay Later</p>
//                   </Col>
//                   <Col xs={6}>
//                     <p className="muted-text mb-3">
//                       <span className="muted-text">{!selectedGame?.paylater ? "Yes" : "No"}</span>
//                     </p>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="text-color">No. of Candidates</p>
//                   </Col>
//                   <Col xs={6}>
//                     <p className="muted-text"><span className="muted-text">{booking?.players?.length + 1}</span></p>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="text-color">Time Slot</p>
//                   </Col>
//                   <Col xs={6}>{
//                     booking?.booking_type === "Regular" ?
//                       <span className="muted-text">{slot?.start_time && convertTo12Hour(slot?.start_time)} - {slot?.end_time && convertTo12Hour(slot.end_time)}</span>
//                       :
//                       <span className="muted-text">{booking?.custom_slot?.start_time && convertTo12Hour(booking?.custom_slot?.start_time)} - {booking?.custom_slot?.start_time && convertTo12Hour(booking?.custom_slot.end_time)}</span>
//                   }
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="text-color">Day/Date</p>
//                   </Col>
//                   <Col xs={6}>
//                     <span className="muted-text">{formatDate(booking?.slot_date)}</span>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="text-color">Booking ID</p>
//                   </Col>
//                   <Col xs={6}>
//                     <span className="muted-text">{booking?.booking_id}</span>
//                   </Col>
//                 </Row>
//               </Card>
//             </Col>

//             <Col
//               md={6}
//             >
//               <Card className="">
//                 <div className="bg-white rounded-3 p-0 d-flex flex-column" style={{ height: "350px" }}>

//                   {/* Sticky Top Input */}
//                   <div
//                     style={{
//                       padding: "7px 16px",
//                       borderBottom: "1px solid #ddd",
//                       background: "#fff",
//                       zIndex: 10,
//                       position: "sticky",
//                       borderTopLeftRadius: "16px",
//                       borderTopRightRadius: "16px",
//                       top: 0,
//                     }}
//                   >
//                     {booking?.status !== "Pending" ? <div className="text-color fs-4 p-2">
//                       Selected Items
//                       <Link
//                         to={`/admin/Inventory/SaleOrderDetails/${booking?.so_id?._id}`}
//                       >
//                         <span
//                           style={{ cursor: "pointer" }}
//                           className="float-end text-primary"
//                         >
//                           {booking?.so_id?.so_no}
//                         </span>
//                       </Link>
//                     </div>
//                       :
//                       <Select
//                         options={options}
//                         onChange={handleChange}
//                         value={selectedOption}
//                         isSearchable
//                         placeholder="Select for add on's..."
//                         className="mb-0"
//                         styles={customStyles}
//                       />
//                     }

//                   </div>

//                   {/* Scrollable Content */}
//                   <div
//                     style={{
//                       overflowY: "auto",
//                       flex: 1,
//                       padding: "12px 16px",
//                       scrollbarWidth: "none",
//                       msOverflowStyle: "none",
//                     }}
//                     className="hide-scrollbar"
//                   >
//                     {selectedItems.map((product, index) => (
//                       <div
//                         key={index}
//                         className="position-relative d-flex mb-3"
//                         style={{ width: "100%" }}
//                       >
//                         {/* Trash Icon */}
//                         <span
//                           className="position-absolute bg-transparent border-0 color-red"
//                           style={{
//                             top: "20px",
//                             right: "10px",
//                             color: "red",
//                             zIndex: 2,
//                           }}
//                           onClick={() => {
//                             const updatedProducts = selectedItems.filter((_, i) => i !== index);
//                             setSelectedItems(updatedProducts);
//                             const updatedSelectedIds = selectedIds.filter((id) => id !== product.id);
//                             setSelectedIds(updatedSelectedIds);
//                             setIsItemsSaved(false); // Mark items as unsaved
//                           }}
//                         >
//                           {booking?.status === "Pending" && <TbTrash style={{
//                             top: "15px",
//                             right: "-30px",
//                             zIndex: 2,
//                           }} size={12} />}
//                         </span>

//                         {/* Product Card */}
//                         <div
//                           className="fs-6"
//                           style={{ background: "#F9F9F9", width: "90%", height: "10%" }}
//                         >
//                           <div className="d-flex justify-content-between align-items-center p-2">
//                             <div style={{ flex: 1 }}>
//                               <div
//                                 className="fs-6 text-color"
//                                 style={{
//                                   maxHeight: "20px",
//                                   overflowY: "auto",
//                                   scrollbarWidth: "none", // Firefox
//                                   msOverflowStyle: "none", // IE
//                                 }}
//                                 onWheel={(e) => e.stopPropagation()}
//                               >
//                                 {product.item}
//                               </div>
//                               <div className="muted-text small mb-1">₹{product.price} /each</div>
//                             </div>

//                             <div style={{ flex: 2 }}>
//                               {booking?.status === "Pending" ? <div className="d-flex align-items-center gap-1">
//                                 <Button
//                                   variant="light"
//                                   disabled={product.quantity <= 1}
//                                   size="sm"
//                                   onClick={() =>
//                                     updateProduct(
//                                       product.id,
//                                       "quantity",
//                                       Math.max(0, Number(product.quantity) - 1)
//                                     )
//                                   }
//                                 >
//                                   −
//                                 </Button>

//                                 <input
//                                   type="number"
//                                   min="0"
//                                   value={product.quantity}
//                                   style={{
//                                     width: "50px",
//                                     height: "28px",
//                                     fontSize: "12px",
//                                     textAlign: "center",
//                                     padding: "2px 4px",
//                                     border: "1px solid #ccc",
//                                   }}
//                                   onChange={(e) =>
//                                     updateProduct(product.id, "quantity", Number(e.target.value))
//                                   }
//                                 />

//                                 <Button
//                                   variant="light"
//                                   size="sm"
//                                   onClick={() =>
//                                     updateProduct(
//                                       product.id,
//                                       "quantity",
//                                       Number(product.quantity) + 1
//                                     )
//                                   }
//                                 >
//                                   +
//                                 </Button>
//                               </div> : <div className="text-color">Qty: {product.quantity}</div>}
//                             </div>

//                             <div className="text-end ms-3" style={{ minWidth: "120px" }}>
//                               <div className="small">
//                                 <span className="text-color">Tax</span> (<span className="muted-text">{product?.tax?.tax_rate || 0}% {product?.tax?.tax_name}</span>):{" "}
//                                 <span className="text-color">₹{product.totalTax}</span>
//                               </div>
//                               <div className="text-color">Total: ₹{product.total}</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Sticky Bottom Total */}
//                   <div
//                     style={{
//                       padding: "8px 12px",
//                       borderTop: "1px solid #ddd",
//                       // fontWeight: "600",
//                       // textAlign: "right",
//                       background: "#fff",
//                       borderRadius: "0 0 10px 10px",
//                     }}
//                   >
//                     <span className="text-color">Total: ₹ {addOnTotal}</span>
//                     {
//                       booking?.status === "Pending"
//                       &&
//                       <span
//                         className="float-end text-white px-2 py-1 rounded"
//                         style={{ cursor: "pointer", background: `${isItemsSaved ? "grey" : "green"}` }}
//                         onClick={handleSaveItems}
//                       >
//                         {isItemsSaved ? "Saved" : "Save"}
//                       </span>
//                     }
//                   </div>
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//           {selectedGame?.type === "Multiplayer" && selectedGame?.payLater || selectedGame?.type === "Single" && selectedGame?.payLater ?
//             booking?.status === "Paid" ?
//               <div className="bg-white rounded shadow-sm w-100">
//                 <Row className="mt-3">
//                   <Col md={4}>
//                     <Button variant="outline-success " className="d-flex align-items-center gap-2" style={{ border: "none" }}
//                       onClick={handleStopTimer}>
//                       <FaRegClock size={30} />
//                       <span className="fw-bold fs-1">{Math.floor(booking?.total_time / 60)} m</span>:
//                       <span className="text-secondary fs-1">{booking?.total_time % 60} s</span>
//                     </Button>
//                   </Col>

//                   <Col md={3} className="p-0">
//                     <div className="">
//                       <p className="mb-0 text-color">
//                         Start Time:
//                         <span className="ms-2 muted-text">{booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : "-"}</span>
//                       </p>
//                       <p className="mb-0 text-color">
//                         End Time:
//                         <span className="ms-2 muted-text"> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}</span>
//                       </p>
//                     </div>
//                   </Col>

//                   <Col md={2} className="p-0">
//                     <h3 className="text-color pt-2"> ₹ {priceToPay}</h3>
//                   </Col>

//                   <Col md={3} className="p-0">
//                     Player Lost : {booking?.looserPlayer?.name || "-"}
//                   </Col>

//                 </Row>
//               </div>
//               : (
//                 selectedGame?.payLater &&
//                 <div className="p-2 bg-white rounded shadow-sm w-100">
//                   <Row>
//                     <Col md={10} >
//                       <span variant="outline-success" className="d-flex align-items-center gap-2" style={{ border: "none" }}
//                         onClick={handleStopTimer}>
//                         <FaRegClock size={30} />
//                         <span className="fw-bold fs-1">{Math.floor(currentTime / 60)} m</span>:
//                         <span className="text-secondary fs-1">{currentTime % 60} s</span>
//                       </span>
//                     </Col>
//                     <Col md={2} className="p-0 mt-3">
//                       <h3 className="fw-bold mx-6"> ₹ {priceToPay}</h3>
//                     </Col>
//                   </Row>

//                   <Row className="mt-3">
//                     <Col md={4}>
//                       {isRunning || isPaused ? (
//                         <Button
//                           size="sm"
//                           variant="outline-danger"
//                           style={{ border: "2px dashed rgb(255, 68, 0)", width: "80%", marginLeft: "10px" }}
//                           onClick={() => setShowConfirm(true)} // Show confirmation modal
//                         >
//                           Stop Timer
//                         </Button>
//                       ) : (
//                         !isPaused &&
//                         <Button
//                           size="sm"
//                           variant="outline-primary"
//                           disabled={booking?.total_time > 0 && booking?.timer_status === "Stopped"}
//                           style={{ border: "2px dashed", width: "70%", padding: "8px", marginLeft: "10px" }}
//                           onClick={handleStartTimer}
//                         >
//                           <FaClock size={16} className="mx-2" />
//                           <span>Start Game Time</span>
//                         </Button>
//                       )}
//                     </Col>

//                     <Col md={1} className="p-0">
//                       {
//                         !isRunning ? (
//                           <VscDebugContinue
//                             size={25}
//                             className="text-success mt-2"
//                             style={{ marginLeft: "5%", cursor: "pointer" }}
//                             onClick={handleResumeTimer}
//                           />
//                         ) : (
//                           <FaPause
//                             size={25}
//                             className="text-danger mt-2"
//                             style={{ marginLeft: "5%", cursor: "pointer" }}
//                             onClick={handlePauseTimer}
//                           />
//                         )
//                       }

//                       <Modal size="sm" show={showConfirm} onHide={() => setShowConfirm(false)} centered>
//                         <Modal.Header className="p-3" closeButton>
//                           <Modal.Title>Confirm Stop Timer</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body className="p-3">Are you sure you want to stop the timer?</Modal.Body>
//                         <Modal.Footer className="p-3">
//                           <Button variant="secondary" onClick={() => setShowConfirm(false)}>
//                             No
//                           </Button>
//                           <Button
//                             variant="danger"
//                             onClick={() => {
//                               handleStopTimer();
//                               setShowConfirm(false);
//                             }}
//                           >
//                             Yes
//                           </Button>
//                         </Modal.Footer>
//                       </Modal>

//                       <Modal show={showConfirmOffline} onHide={() => setShowConfirmOffline(false)} centered>
//                         <Modal.Header closeButton>
//                           <Modal.Title>Confirm Offline Payment</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>Are you sure you want to collect offline payment?</Modal.Body>
//                         <Modal.Footer>
//                           <Button variant="secondary" onClick={() => setShowConfirmOffline(false)}>
//                             No
//                           </Button>
//                           <Button
//                             variant="danger"
//                             onClick={() => {
//                               handleCollectOffline();
//                               setShowConfirmOffline(false);
//                             }}
//                           >
//                             Yes
//                           </Button>
//                         </Modal.Footer>
//                       </Modal>
//                     </Col>

//                     <Col md={4} className="p-0">
//                       <div className="ms-3">
//                         <p className="mb-0 muted-text">
//                           <strong>Start Time:</strong> {booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : "-"}
//                         </p>
//                         <p className="mb-0 muted-text">
//                           <strong>End Time:</strong> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}
//                         </p>
//                       </div>
//                     </Col>

//                     <Col md={3}>

//                       {looserPlayer && (
//                         <div style={{ width: "100%" }}>
//                           <span className="fw-bold">Looser: </span>
//                           {looserPlayer.name}
//                         </div>
//                       )}
//                       <OverlayTrigger
//                         placement="left"
//                         show={showTooltip}
//                         onToggle={(isVisible) => setShowTooltip(isVisible)}
//                         overlay={
//                           <Tooltip
//                             id="player-list-tooltip"
//                             onMouseEnter={() => setShowTooltip(true)}
//                             onMouseLeave={() => setShowTooltip(false)}
//                           >
//                             <h6 className="m-2 p-2 text-light border-bottom">Select Looser Player</h6>
//                             <ul className="m-2 p-2 list-unstyled">
//                               {selectedCustomer && (
//                                 <li
//                                   className="fw-bold p-1"
//                                   onClick={() => {
//                                     setLooserPlayer(selectedCustomer);
//                                     setShowTooltip(false);
//                                   }}
//                                   // style={{ cursor: "pointer" }}
//                                   style={{
//                                     cursor: "pointer",
//                                     transition: "all 0.2s ease-in-out",
//                                     backgroundColor: "transparent",
//                                     color: "white",
//                                   }}
//                                   onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa", e.currentTarget.style.color = "black")}
//                                   onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "white")}
//                                 >
//                                   {selectedCustomer?.name} (Customer)
//                                 </li>
//                               )}

//                               {players?.length > 0 ? (
//                                 players.map((player, index) => (
//                                   <li
//                                     key={index}
//                                     className="p-1"
//                                     onClick={() => handleSelectLooserPlayer(player)}
//                                     style={{
//                                       cursor: "pointer",
//                                       transition: "all 0.2s ease-in-out",
//                                       backgroundColor: "transparent",
//                                       color: "white",
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa", e.currentTarget.style.color = "black")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "white")}
//                                   >
//                                     {player.name}
//                                   </li>
//                                 ))
//                               ) : (
//                                 <li className="muted-text">No Players</li>
//                               )}
//                             </ul>
//                           </Tooltip>
//                         }
//                       >
//                         <Stack
//                           direction="horizontal"
//                           gap={2}
//                           className="align-items-center mt-2 float-end px-6"
//                           onMouseEnter={() => setShowTooltip(true)}
//                           onMouseLeave={() => setShowTooltip(false)}
//                         >
//                           <div className="d-flex">
//                             <Image src={userProfile} roundedCircle width={35} height={35} className="border" />
//                             {players &&
//                               players.slice(0, maxVisiblePlayers).map((player, index) => (
//                                 <Image
//                                   src={player.customerProfile || userProfile}
//                                   roundedCircle
//                                   width={35}
//                                   height={35}
//                                   className="border ms-n3"
//                                   key={index}
//                                 />
//                               ))}
//                             {players?.length > maxVisiblePlayers && (
//                               <span className="fw-bold muted-text ms-2">+{players.length - maxVisiblePlayers}</span>
//                             )}
//                           </div>
//                         </Stack>
//                       </OverlayTrigger>
//                     </Col>
//                   </Row>
//                 </div>
//               )
//             :
//             <></>
//           }

//           {booking?.status === "Pending" ?
//             <Card className="p-3 rounded-3">
//               <h5 className="fs-3 text-color">Payment Details</h5>
//               <Row className="mt-1">
//                 <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size}) </Col>
//                 <Col xs={3} className="muted-text">{booking?.players?.length + 1} Candidates</Col>
//                 <Col xs={3} className="text-end">{selectedGame?.type === "Single" && !selectedGame?.payLater && (booking?.total - booking?.paid_amount) > 0 && <span className="text-danger">₹ {booking?.total - booking?.paid_amount} Pending</span>} </Col>
//               </Row>
//               <hr className="m-1" />

//               <Row className="mt-1">
//                 <Col xs={6} className="d-flex align-items-center">
//                   <p className="text-color">Total Amount</p>
//                 </Col>
//                 <Col xs={6} className="mb-2">
//                   <span className="fw-bold text-color">
//                     <Form.Control
//                       size="sm"
//                       type="text"
//                       placeholder="Disabled readonly input"
//                       aria-label="Disabled input example"
//                       readOnly
//                       value={total}
//                     />
//                   </span>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col xs={6} className="d-flex align-items-center">
//                   <p className="text-color">Adjustment / Discount </p>
//                 </Col>
//                 <Col xs={6} className="mb-2">
//                   <Form.Control
//                     size="sm"
//                     type="number"
//                     placeholder="Enter adjustment value"
//                     value={adjustment}
//                     onChange={(e) => {
//                       if (e.target.value > total) {
//                         return
//                       }
//                       setAdjustment(e.target.value);
//                     }}
//                   />
//                 </Col>

//               </Row>

//               {creditAmount > 0 && <div className="mt-4">
//                 <h4>Credit Collection
//                   {/* <Button size="sm" className="btn btn-primary bg-body text-color" onClick={handleSplitCredit}>Split Credit</Button> */}
//                 </h4>
//                 <Table bordered hover responsive size="sm" className="mt-2">
//                   <thead className="bg-light">
//                     <tr>
//                       <th>Name</th>
//                       <th>Limit</th>
//                       <th>Balance</th>
//                       <th>Credit</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {/* Selected Customer Row */}
//                     <tr>
//                       <td>{selectedCustomer.name}</td>
//                       <td>{selectedCustomer?.creditLimit}</td>
//                       <td>{selectedCustomer.creditLimit - selectedCustomer.creditAmount}</td>
//                       <td>
//                         <Form.Control
//                           size="sm"
//                           type="number"
//                           placeholder="Rs 0"
//                           value={playerCredits.find(p => p._id === selectedCustomer._id)?.credit || 0}
//                           onChange={(e) => handleCreditChange(selectedCustomer._id, e.target.value)}
//                         />
//                       </td>
//                     </tr>

//                     {/* Other Players Rows */}
//                     {players.length > 0 && players.map((player, index) => (
//                       <tr key={player._id}>
//                         <td>{player.name}</td>
//                         <td>{player.creditLimit}</td>
//                         <td>{player.creditLimit - player.creditAmount}</td>
//                         <td>
//                           <Form.Control
//                             size="sm"
//                             type="number"
//                             placeholder="Rs 0"
//                             value={playerCredits.find(p => p._id === player._id)?.credit || 0}
//                             onChange={(e) => handleCreditChange(player._id, e.target.value)}
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>}

//               <Row>
//                 <Col md={3} xs={6}>
//                   <Button variant="primary btn btn-sm"
//                     xs={12}
//                     className="w-100 mt-3"
//                     disabled={!booking?.timer_status === "Stopped"}
//                     onClick={() => {
//                       if (!isItemsSaved) {
//                         alert("Please save the added items before proceeding with payment.");
//                         setShowConfirmModal(true)
//                         return;
//                       }
//                       setShowCreditModal(true)
//                     }}
//                   >Payment Options</Button>
//                 </Col>

//                 {showCreditModal &&
//                   <CreditSplit
//                     show={showCreditModal}
//                     handleClose={() => setShowCreditModal(false)}
//                     handleCollectOffline={handleCollectOffline}
//                     handleOnlinePayment={handleOnlinePayment}
//                     totalAmount={total}
//                     players={players}
//                     customer={selectedCustomer}
//                   />}
//               </Row>
//             </Card>
//             :
//             <Card className="p-3 rounded-3 h-100">
//               <h5 className="fs-3">Payment Details</h5>
//               <Row className="mt-1">
//                 <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size}) </Col>
//                 <Col xs={3} className="text-color">
//                   {/* {booking?.players?.length + 1} <span>Candidates</span> */}
//                   <OverlayTrigger
//                     placement="right"
//                     overlay={
//                       <Tooltip id="player-list-tooltip">
//                         <ul className="m-2 p-2">
//                           {/* Selected Customer */}
//                           {selectedCustomer && (
//                             <li className="fw-bold p-1">{selectedCustomer?.name} (Main Customer)</li>
//                           )}

//                           {/* Players List */}
//                           {booking?.players?.length > 0 ? (
//                             players.map((player, index) => (
//                               <li key={index} className="p-1">{player.name}</li>
//                             ))
//                           ) : (
//                             <li className="muted-text">No Players</li>
//                           )}
//                         </ul>
//                       </Tooltip>
//                     }
//                   >
//                     <span className="cursor-pointer">
//                       {booking?.players?.length + 1} <span>Players</span>
//                     </span>
//                   </OverlayTrigger>
//                 </Col>
//                 <Col xs={3} className="text-end text-color">₹ {booking?.total + booking?.adjustment} Total</Col>
//                 {/* <Col xs={3} className="text-end muted-text">₹ {booking?.total - booking?.paid_amount} Balance</Col> */}
//                 {/* <Col xs={3} className="text-end">{(booking?.total - booking?.paid_amount) > 0 && <span className="fs-3 text-danger">₹ { booking?.total - booking?.paid_amount} Pending</span>} </Col> */}
//               </Row>
//               <hr className="m-1" />

//               <Row className="mt-2">
//                 <Col xs={6} className="text-color fw-semibold">Payment Mode</Col>
//                 <Col xs={6} className="muted-text">
//                   <span
//                     className="d-flex align-items-center w-25"
//                     style={{
//                       backgroundColor:
//                         booking?.mode === "Online"
//                           ? "#03D41414"
//                           : "#FF00000D",
//                       borderRadius: "20px",
//                       fontSize: "12px",
//                       padding: "5px 10px",
//                       marginLeft: "-10px",
//                       color:
//                         booking?.mode === "Online" ? "#00AF0F" : "orange",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "8px",
//                         height: "8px",
//                         borderRadius: "50%",
//                         backgroundColor:
//                           booking?.mode === "Online"
//                             ? "#03D414"
//                             : "orange",
//                         marginRight: "5px",
//                       }}
//                     />
//                     {booking?.mode}
//                   </span>
//                 </Col>
//               </Row>

//               <Row className="mt-1">
//                 <Col xs={6} className="text-color fw-semibold">Amount Paid</Col>
//                 <Col xs={6} className="muted-text">₹ {booking?.paid_amount > 0 ? booking?.paid_amount : 0}</Col>
//               </Row>

//               <Row className="mt-1">
//                 <Col xs={6} className="text-color fw-semibold">Adjustment</Col>
//                 <Col xs={6} className="muted-text">₹ {booking?.adjustment || 0}</Col>
//               </Row>

//               <Row className="mt-2">
//                 <Col xs={6} className="text-color fw-semibold">Credit Amount</Col>
//                 <Col xs={6} className="muted-text">
//                   <OverlayTrigger
//                     trigger={['hover', 'focus']}
//                     placement="right"
//                     overlay={renderCreditsPopover}
//                   >
//                     <span style={{ cursor: 'pointer' }}>
//                       ₹ {booking?.total - booking?.paid_amount}
//                     </span>
//                   </OverlayTrigger>
//                 </Col>
//               </Row>


//               <Row className="mt-2">
//                 <Col xs={6} className="text-color fw-semibold">Transaction ID</Col>
//                 <Col xs={6} className="muted-text">{booking?.transaction?.razorpay_payment_id || "Cash"}</Col>
//               </Row>

//               <Row className="mt-2">
//                 <Col xs={6} className="text-color fw-semibold">Date/Time</Col>
//                 <Col xs={6} className="muted-text">
//                   {booking?.mode === "Online" ? formatDateAndTime(booking?.transaction?.createdAt) : formatDateAndTime(booking?.createdAt)}
//                 </Col>
//               </Row>
//             </Card>
//           }
//         </Col>
//       </Row>

//       {showConfirmModal && (
//         <ItemsSave
//           show={showConfirmModal}
//           handleClose={() => setShowConfirmModal(false)}
//           handleConfirm={handleSaveItems}
//         />
//       )}
//     </Container>
//   );
// };

// export default BookingCheckout;







































































































import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Stack, Form, OverlayTrigger, Tooltip, Modal, Table, Dropdown, Popover } from "react-bootstrap";
import { FaPhone, FaVideo, FaComment, FaClock, FaRegClock, FaPause, FaRupeeSign } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import userProfile from "/assets/profile/user_avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12Hour, formatDate, formatDateAndTime } from "../../../components/utils/utils";
import { addToCart, getBookingDetails, processOnlinePayment, updateBooking } from "../../../store/AdminSlice/BookingSlice";
import { VscDebugContinue } from "react-icons/vsc";
import { initializeTimer, pauseBookingTimer, resumeBookingTimer, startBookingTimer, stopBookingTimer } from "../../../store/AdminSlice/TimerSlice";
import "./BookingCheckout.css";
import Select from "react-select";
import { getItems } from "../../../store/AdminSlice/Inventory/ItemsSlice";
import { getTaxFields } from "../../../store/AdminSlice/TextFieldSlice";
import CreditSplit from "./Model/CreditSplit";
import { TbTrash } from "react-icons/tb";
import ItemsSave from "./Model/itemsSave";
import { MdCancel } from "react-icons/md";

const BookingCheckout = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const booking = useSelector((state) => state.bookings.booking);
  const { isRunning, isPaused, startTime, elapsedTime, pausedTime } = useSelector((state) => state.timer.timer);
  const [currentTime, setCurrentTime] = useState(elapsedTime || 0);

  const backend_url = import.meta.env.VITE_API_URL;

  const maxVisiblePlayers = 2;
  const [priceToPay, setPriceToPay] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const [options, setOptions] = useState([]);
  const [showConfirmOffline, setShowConfirmOffline] = useState(false);
  const [isItemsSaved, setIsItemsSaved] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tempStartTime, setTempStartTime] = useState(new Date().toISOString());
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [addOnTotal, setAddOnTotal] = useState(0);
  const [playerCredits, setPlayerCredits] = useState([]);
  const [adjustment, setAdjustment] = useState("");
  const [payableAmount, setPayableAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [looserPlayer, setLooserPlayer] = useState(null);
  const [slot, setSlot] = useState(null);
  const [players, setPlayers] = useState([]);
  const [paused, setPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    discountType: 'Percentage',
    taxAmount: 0,
    selectedTaxes: [],
    total: 0,
    adjustmentNote: '',
    adjustmentAmount: 0
  });

  const user = JSON.parse(sessionStorage.getItem('user'));
  const cafeId = user?._id;

  const items = useSelector((state) => state.items.items);
  const { taxFields } = useSelector((state) => state.taxFieldSlice);

  useEffect(() => {
    if (items.length > 0) {
      setOptions(items.map((item) => ({ value: item._id, label: `${item.name} (₹ ${item.sellingPrice})` })));
    }
  }, [items]);

  useEffect(() => {
    if (id) {
      dispatch(getItems(cafeId));
      dispatch(getTaxFields(cafeId));
      dispatch(getBookingDetails(id));
    }
  }, [dispatch, id, isStopped]);

  useEffect(() => {
    if (booking) {
      setSelectedGame(booking?.game_id);
      setSelectedCustomer(booking?.customer_id);
      setSlot(booking?.slot_id);
      setPlayers(booking?.players);

      // if (booking?.so_id) {
      //   setShowInventory(true)
      //   const mappedItems = booking.so_id.items.map((item) => ({ id: item.item_id._id, item: item.item, price: item.price, quantity: item.quantity, tax: item.tax, total: item.total, totalTax: item.tax_amt }));
      //   setSelectedItems(mappedItems)
      //   setSelectedIds(mappedItems.map((item) => item?.id));
      // }

      if (booking?.so_id) {
        const mappedItems = booking.so_id.items.map((item) => ({
          id: item.item_id._id,
          item: item.item,
          price: item.price,
          quantity: item.quantity,
          tax: item.tax,
          total: item.total,
          totalTax: item.tax_amt,
        }));
        setSelectedItems(mappedItems);
        setSelectedIds(mappedItems.map((item) => item.id));
      } else {
        setSelectedItems([]);
        setSelectedIds([]);
      }

      dispatch(initializeTimer(booking))

      if (booking.timer_status === "Running") {
        if (booking.start_time) {
          const elapsed = Math.floor((Date.now() - new Date(booking.start_time)) / 1000);
          const adjustedTime = booking.paused_time > 0 ? elapsed - booking.paused_time : elapsed;
          setCurrentTime(adjustedTime);
        }
      } else if (booking.timer_status === "Paused") {
        setCurrentTime(booking.paused_time || 0);
        setPaused(true);
      } else {
        setCurrentTime(booking.total_time || 0);
      }
    }
  }, [booking]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const pricePerSecond = slot?.slot_price > 0 ? slot?.slot_price / 3600 : selectedGame?.price / 3600

  useEffect(() => {
    const secondsElapsed = currentTime;
    setPriceToPay(Math.round(secondsElapsed * pricePerSecond));
    setTotal(Math.round(secondsElapsed * pricePerSecond) + addOnTotal - adjustment);
    // if (addOnTotal > 0) {
    //   setPriceToPay(Math.round((secondsElapsed * pricePerSecond) + addOnTotal));
    // }
    // if (adjustment > 0) {
    //   setPriceToPay(Math.round((secondsElapsed * pricePerSecond) + addOnTotal - adjustment));
    // }
  }, [currentTime, pricePerSecond, addOnTotal, adjustment]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      let total = 0;
      selectedItems.map((item) => {
        total += item.total;
      })
      setAddOnTotal(total)

    } else {
      setAddOnTotal(0)
    }
  }, [selectedItems, selectedIds]);

  const handleChange = (selectedOption) => {
    let id = selectedOption.value;
    if (!id || selectedIds.includes(id)) return;

    setSelectedValue("");

    setIsItemsSaved(false);

    const selected = items.find(item => item._id === id);

    if (selected) {
      const totalTax = Math.round((selected.tax?.tax_rate * selected.sellingPrice) / 100) || 0;
      const total = selected.sellingPrice + totalTax || 0;
      setSelectedItems([...selectedItems, {
        id: selected._id,
        item: selected.name,
        price: selected.sellingPrice,
        quantity: 1,
        tax: selected.tax || null,
        total: total,
        totalTax: totalTax
      }]);
      setSelectedIds([...selectedIds, selected._id]);
      setSelectedOption(null)
    }
  };

  const updateProduct = (id, field, value) => {
    const updatedItems = selectedItems.map((product) => {
      if (product.id === id) {
        setIsItemsSaved(false);
        // const updatedQuantity = field === "quantity" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : product.quantity; // Ensure only numeric input
        const updatedQuantity = field === "quantity"
          ? parseInt(String(value).replace(/\D/g, ""), 10) || 0
          : product.quantity;

        const taxRate = product.tax?.tax_rate || 0;
        const totalTax = Math.round((taxRate * product.price * updatedQuantity) / 100);
        const total = product.price * updatedQuantity + totalTax;

        return {
          ...product,
          [field]: updatedQuantity,
          total,
          totalTax,
        };
      }
      return product;
    });

    setSelectedItems(updatedItems);
  };

  useEffect(() => {
    if (booking && booking.timer_status !== "Stopped") {
      setPaused(booking.timer_status === "Paused");

      if (booking.start_time) {
        const elapsed = Math.floor((Date.now() - new Date(booking.start_time)) / 1000);
        setCurrentTime(booking.paused_time || elapsed);
      }
    }
  }, [booking]);

  const handleStartTimer = () => {
    const today = new Date().toISOString().slice(0, 10); // e.g., "2025-04-22"
    const bookingDate = booking?.slot_date?.slice(0, 10); // "2025-04-24"

    if (today === bookingDate) {

      const currentTime = new Date().toISOString();

      // Set tempStartTime before dispatch
      setTempStartTime(currentTime);

      dispatch(startBookingTimer(booking._id));
    } else {
      alert("Timer can only be started on the booking date.");
      // Optional: alert("You can only start the timer on the booking day.");
    }
    // dispatch(startBookingTimer(booking._id));
  };

  const handlePauseTimer = () => {
    dispatch(pauseBookingTimer(booking._id));
  };

  const handleResumeTimer = () => {
    dispatch(resumeBookingTimer(booking._id));
  };

  const handleStopTimer = async () => {
    try {
      // Stop the timer in the backend
      await dispatch(stopBookingTimer(booking._id));

      // Stop the timer in the frontend immediately
      setIsStopped(true);
      setPaused(true); // Mark the timer as paused
      clearInterval(); // Clear the interval to stop the timer updates

      // Fetch the updated booking details to get the stopped time
      const updatedBooking = await dispatch(getBookingDetails(booking._id)).unwrap();
      setCurrentTime(updatedBooking.total_time || 0); // Update the timer with the stopped time
    } catch (error) {
      console.error("Error stopping the timer:", error);
    }
  };

  const handleSaveItems = async () => {
    try {
      const itemsData = {
        items: selectedItems,
        customer_id: selectedCustomer?._id,
        cafe: cafeId
      };
      await dispatch(addToCart({ id: booking?._id, updatedData: itemsData })).unwrap()
      setIsItemsSaved(true); // Mark items as saved
    } catch (error) {
      console.error("Error saving items:", error);
    }
  }

  const handleOnlinePayment = async (finalPlayers, payableAmount) => {

    try {
      const payer = looserPlayer || selectedCustomer; // Use looser player if selected, otherwise main customer

      const formattedPlayers = finalPlayers.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }));

      if (payableAmount <= 0) {
        alert("Amount must be greater than 0")
        return
      }

      const response = await dispatch(
        processOnlinePayment({
          selectedGame,
          selectedCustomer: payer, // Set the payer
          slot,
          payableAmount,
          paid_amount: payableAmount,
          total: total,
          looserPlayer: looserPlayer,
          bookingId: booking?._id,
          playerCredits: formattedPlayers,
          adjustment
        })
      );
    } catch (error) {
      console.error("Error processing online payment:", error);
    }
  };

  const handleCollectOffline = async (finalPlayers, currentTotal) => {

    const formattedPlayers = finalPlayers
      .filter(player => player.credit !== undefined && player.credit !== null)  // Filter out players without 'credit'
      .map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }));

    try {
      const bookingData = {
        mode: "Offline",
        status: "Paid",
        total: total,
        paid_amount: currentTotal,
        playerCredits: formattedPlayers,
        looserPlayer: looserPlayer,
        adjustment
      };
      const response = await dispatch(updateBooking({ id: booking?._id, updatedData: bookingData })).unwrap()

      // if (response.data) {
      //   navigate(`admin/booking/checkout/${id}`)
      // }
    } catch (error) {
      console.error("Error processing offline payment:", error);
    }
  };

  const handleSelectLooserPlayer = (player) => {
    setLooserPlayer(player);
  };

  const renderCreditsPopover = (
    <Popover id="player-credits-popover">
      <Popover.Header as="h3">Player Credits</Popover.Header>
      <Popover.Body>
        {booking?.playerCredits?.length > 0 ? (
          <ul className="mb-0 ps-3">
            {booking.playerCredits.map((player, index) => (
              <li key={index}>
                {player.name || player.id}: ₹ {player.credit || 0}
              </li>
            ))}
          </ul>
        ) : (
          <div>No credits data</div>
        )}
      </Popover.Body>
    </Popover>
  );

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid grey',
      borderRadius: '8px',
      cursor: 'pointer',
      // padding: '2%',
      boxShadow: 'none',
      '&:hover': {
        border: 'none'
      }
    }),
    // Optional: adjust dropdown indicator and other parts if needed
  };

  return (
    <Container className="mt-4 pb-3">
      <Row>
        <h5>
          <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>
            {"Bookings/Checkout"}
          </span>
        </h5>

      </Row>

      <Row>
        <Col md={4} className="border-0 p-0">
          <Card className="p-3 mx-2" style={{ height: "100vh" }}>
            <Card.Img
              variant="top"
              src={`${backend_url}/${selectedGame?.gameImage}`}
              className="rounded"
              style={{ height: "200px", width: "auto", objectFit: "cover" }}
            />
            <Row className="align-items-center mt-3">
              <Col xs={3}>
                <Image
                  src={userProfile}
                  roundedCircle
                  fluid
                />
              </Col>
              <Col className="p-0">
                <h5 className="mb-0">{selectedCustomer?.name}</h5>
                <small className="muted-text">Booking ID : {booking?.booking_id}</small>
              </Col>
            </Row>
            <hr />
            <div className="w-100">
              <p className="d-flex justify-content-between">
                <strong className="text-color">Full Name:</strong> <span>{selectedCustomer?.name}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-color">Email:</strong> <span>{selectedCustomer?.email}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-color">Phone Number:</strong> <span>{selectedCustomer?.contact_no}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-color">Payment Status:</strong>
                <span className="text-success">{booking?.status}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-color">Credit:</strong> <span className="text-warning">₹ {selectedCustomer?.creditLimit - selectedCustomer?.creditAmount} Remaining</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-color">Location:</strong> <span>{selectedCustomer?.address || "-"}</span>
              </p>
              <p className="d-flex justify-content-between">
                <strong className="text-color">Played Games:</strong> <span>{booking?.totalGamesPlayed}</span>
              </p>
            </div>

            <hr />
            <Row className="text-center">
              {/* <Col>
                <FaPhone size={20} />
              </Col>
              <Col>
                <FaComment size={20} />
              </Col>
              <Col>
                <FaVideo size={20} />
              </Col> */}
              <Col className="m-auto">
                {(booking?.booking_type === "Regular" && selectedGame?.cancellation && booking?.status === "Pending") || (booking?.booking_type === "Regular" && selectedGame?.cancellation && !selectedGame?.payLater) ?
                  <Button
                    variant="success"
                    className="w-100 border-0"
                    style={{ backgroundColor: "#03D41414", color: "#00AF0F" }}
                    onClick={() => navigate(`/admin/booking/edit/${booking?._id}`)}
                  >
                    Edit Booking
                  </Button>
                  :
                  <></>}
              </Col>
            </Row>
          </Card>

        </Col>

        <Col md={8} className="d-flex flex-column gap-1 justify-content-between hide-scrollbar" style={{ overflowY: "auto", maxHeight: "100vh" }}>
          <Row>
            <Col
              md={12}
              className={`d-flex flex-column px-2 justify-content-between transition-col`}
            >
              <Card className="p-3 h-100">
                <h5 className="font-inter mb-3 pb-3 fs-4 text-color" style={{ borderBottom: "1px solid #ccc" }}>Booking Details
                  {selectedGame?.payLater ?
                    <span className="fw-bold text-info float-end">Amount : ₹ {slot?.slot_price ? slot?.slot_price : selectedGame?.price}/Hr</span>
                    :
                    <span className="fw-bold text-info float-end">Amount : ₹ {booking?.total}</span>
                  }
                </h5>
                <Row>
                  <Col xs={6}>
                    <p className="text-color m-0">Selected Game</p>
                  </Col>
                  <Col xs={6}>
                    <p className="muted-text mb-3">
                      <span className="muted-text">{selectedGame?.name}({selectedGame?.size})</span>
                      <span
                        style={{
                          backgroundColor: "#03D41414",
                          color: "#00AF0F",
                          border: "none",
                          fontSize: "12px",
                          marginLeft: "5px",
                        }}
                      >
                        {selectedGame?.type}
                      </span>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <p className="text-color m-0">Pay Later</p>
                  </Col>
                  <Col xs={6}>
                    <p className="muted-text mb-3">
                      <span className="muted-text">{!selectedGame?.paylater ? "Yes" : "No"}</span>
                    </p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6}>
                    <p className="text-color">No. of Candidates</p>
                  </Col>
                  <Col xs={6}>
                    <p className="muted-text"><span className="muted-text">{booking?.players?.length + 1}</span></p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6}>
                    <p className="text-color">Time Slot</p>
                  </Col>
                  <Col xs={6}>{
                    booking?.booking_type === "Regular" ?
                      <span className="muted-text">{slot?.start_time && convertTo12Hour(slot?.start_time)} - {slot?.end_time && convertTo12Hour(slot.end_time)}</span>
                      :
                      <span className="muted-text">{booking?.custom_slot?.start_time && convertTo12Hour(booking?.custom_slot?.start_time)} - {booking?.custom_slot?.start_time && convertTo12Hour(booking?.custom_slot.end_time)}</span>
                  }
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6}>
                    <p className="text-color">Day/Date</p>
                  </Col>
                  <Col xs={6}>
                    <span className="muted-text">{formatDate(booking?.slot_date)}</span>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6}>
                    <p className="text-color">Booking ID</p>
                  </Col>
                  <Col xs={6}>
                    <span className="muted-text">{booking?.booking_id}</span>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col
              md={12} className="px-2 mt-2"
            >
              <Card className="">
                <div className="bg-white rounded-3 p-0 d-flex flex-column" style={{ height: "350px" }}>

                  {/* Sticky Top Input */}
                  <div
                    style={{
                      padding: "7px 16px",
                      borderBottom: "1px solid #ddd",
                      background: "#fff",
                      zIndex: 10,
                      position: "sticky",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                      top: 0,
                    }}
                  >
                    {booking?.status !== "Pending" ? <div className="text-color fs-4 p-2">
                      Selected Items ({selectedItems?.length || 0})
                      <Link
                        to={`/admin/Inventory/SaleOrderDetails/${booking?.so_id?._id}`}
                      >
                        <span
                          style={{ cursor: "pointer" }}
                          className="float-end text-primary"
                        >
                          {booking?.so_id?.so_no}
                        </span>
                      </Link>
                    </div>
                      :
                      <Select
                        options={options}
                        onChange={handleChange}
                        value={selectedOption}
                        isSearchable
                        placeholder="Select for add on's..."
                        className="mb-0"
                        styles={customStyles}
                      />
                    }
                  </div>

                  {/* Scrollable Content */}
                  <div
                    style={{
                      overflowY: "auto",
                      flex: 1,
                      padding: "12px 16px",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                    className="hide-scrollbar"
                  >
                    {selectedItems.map((product, index) => (
                      <div
                        key={index}
                        className="d-flex mb-3"
                        style={{ width: "100%" }}
                      >
                        {/* Trash Icon */}
                        {/* <span
                          className="position-absolute bg-transparent border-0 color-red"
                          style={{
                            top: "20px",
                            right: "10px",
                            color: "red",
                            zIndex: 2,
                          }}
                          onClick={() => {
                            const updatedProducts = selectedItems.filter((_, i) => i !== index);
                            setSelectedItems(updatedProducts);
                            const updatedSelectedIds = selectedIds.filter((id) => id !== product.id);
                            setSelectedIds(updatedSelectedIds);
                            setIsItemsSaved(false); // Mark items as unsaved
                          }}
                        >
                          {booking?.status === "Pending" && <TbTrash style={{
                            top: "15px",
                            right: "-30px",
                            zIndex: 2,
                          }} size={12} />}
                        </span> */}

                        {/* Product Card */}
                        <div
                          className="fs-6"
                          style={{ background: "#F9F9F9", width: "100%", height: "10%", borderBottom: "1px solid #ddd" }}
                        >
                          <div className="d-flex justify-content-around align-items-center p-2">
                            <div style={{ flex: 1 }}>
                              <div
                                className="fs-6 text-color"
                                style={{
                                  maxHeight: "20px",
                                  overflowY: "auto",
                                  scrollbarWidth: "none", // Firefox
                                  msOverflowStyle: "none", // IE
                                }}
                                onWheel={(e) => e.stopPropagation()}
                              >
                                {product.item}
                              </div>
                              <div className="muted-text small mb-1">₹{product.price} /each</div>
                            </div>

                            <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
                              {booking?.status === "Pending" ? <div className="d-flex align-items-center gap-1">
                                <Button
                                  variant="light"
                                  disabled={product.quantity <= 1}
                                  size="sm"
                                  onClick={() =>
                                    updateProduct(
                                      product.id,
                                      "quantity",
                                      Math.max(0, Number(product.quantity) - 1)
                                    )
                                  }
                                >
                                  −
                                </Button>

                                <input
                                  type="number"
                                  min="0"
                                  value={product.quantity}
                                  style={{
                                    width: "50px",
                                    height: "28px",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "2px 4px",
                                    border: "1px solid #ccc",
                                  }}
                                  onChange={(e) =>
                                    updateProduct(product.id, "quantity", Number(e.target.value))
                                  }
                                />

                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() =>
                                    updateProduct(
                                      product.id,
                                      "quantity",
                                      Number(product.quantity) + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div> : <div className="text-color">Qty: {product.quantity}</div>}
                            </div>

                            <div className="text-end ms-3" style={{ minWidth: "120px" }}>
                              <div className="small">
                                <span className="text-color">Tax</span> (<span className="muted-text">{product?.tax?.tax_rate || 0}% {product?.tax?.tax_name}</span>):{" "}
                                <span className="text-color">₹{product.totalTax}</span>
                              </div>
                              <div className="text-color">Total: ₹{product.total}</div>
                            </div>

                            <div>
                              <span
                                className="border-0 color-red"
                                style={{ marginTop: "20px", marginLeft: "30px", color: "red", zIndex: 2, cursor: "pointer" }}
                                onClick={() => {
                                  const updatedProducts = selectedItems.filter((_, i) => i !== index);
                                  setSelectedItems(updatedProducts);
                                  const updatedSelectedIds = selectedIds.filter((id) => id !== product.id);
                                  setSelectedIds(updatedSelectedIds);
                                  setIsItemsSaved(false); // Mark items as unsaved
                                }}
                              >
                                {booking?.status === "Pending" && <TbTrash style={{
                                }} size={12} />}
                              </span>
                            </div>

                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Sticky Bottom Total */}
                  <div
                    style={{
                      padding: "8px 12px",
                      borderTop: "1px solid #ddd",
                      // fontWeight: "600",
                      // textAlign: "right",
                      background: "#fff",
                      borderRadius: "0 0 10px 10px",
                    }}
                  >
                    <span className="text-color">Total: ₹ {addOnTotal}</span>
                    {
                      booking?.status === "Pending"
                      &&
                      <button
                        className="float-end text-white px-2 py-1 rounded"
                        disabled={isItemsSaved}
                        style={{ cursor: "pointer", background: `${isItemsSaved ? "grey" : "green"}` }}
                        onClick={handleSaveItems}
                      >
                        {isItemsSaved ? "Saved" : "Save"}
                      </button>
                    }
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          {selectedGame?.type === "Multiplayer" && selectedGame?.payLater || selectedGame?.type === "Single" && selectedGame?.payLater ?
            booking?.status === "Paid" ?
              <div className="rounded shadow-sm w-100" style={{ marginLeft: "10px" }}>
                <Row className="mt-3 gap-3">
                  <Col md={6} className="bg-white d-flex p-3 gap-3" style={{ borderRadius: "10px", width: "48%" }}>
                    <div>
                      <img src="/assets/Admin/Game/Notification.svg" alt="Game Timer" />
                    </div>
                    <div className="gap-2 my-auto" style={{ border: "none" }}>
                      <div>Total Time</div>
                      <span className="text-color fs-4">
                        <span>{Math.floor(booking?.total_time / 60)} s</span> : {" "}
                        <span>{booking?.total_time % 60} s</span>
                      </span>
                    </div>
                  </Col>

                  {/* <Col md={6} className="p-0 bg-white" style={{ borderRadius: "10px", width: "48%" }}>
                    <div className="d-flex p-3" style={{ border: "none" }}>
                      
                      <div className="mb-0 text-color">
                        Start
                        <div className="ms-2 muted-text">{booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : "-"}</div>
                      </div>
                      <div className="mb-0 text-color">
                        End
                        <div className="ms-2 muted-text"> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}</div>
                      </div>
                      
                    </div>
                  </Col> */}

                  <Col md={6} className="p-0 bg-white" style={{ borderRadius: "10px", width: "48%" }}>
                    <div className="d-flex p-3" style={{ border: "none" }}>
                      <div>
                        <img src="/assets/Admin/Game/Notification2.svg" alt="Game Timer" />
                      </div>
                      <div className="d-flex gap-2" style={{ width: "100%" }}>
                        <div className="mb-0 muted-text w-50">
                          <div className="px-2" style={{ borderRight: "1px solid grey" }}>Start</div>
                          <div className="text-color px-2" style={{ borderRight: "1px solid grey" }}>{booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : new Date(tempStartTime).toLocaleTimeString()}</div>
                        </div>
                        <div className="mb-0 mx-5 muted-text w-50">
                          <div>End</div>
                          <div className="text-color">{booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : ""}</div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* <Col md={6} className="p-3 bg-white d-flex gap-4" style={{ borderRadius: "10px", width: "48%" }}>
                    <h3 className="text-color pt-2"> ₹ 512</h3>
                  </Col> */}

                  <Col md={6} sm={12} className="p-3 bg-white d-flex gap-4" style={{ borderRadius: "10px", width: "48%" }}>
                    <div>
                      <img src="/assets/Admin/Game/Notification3.svg" alt="Game Timer" />
                    </div>
                    <div className="d-flex flex-column m-auto" style={{ width: "100%" }}>
                      <div>
                        Charges
                      </div>
                      <div className="text-color fs-4">
                        ₹ {priceToPay}
                      </div>
                    </div>
                  </Col>

                  <Col md={6} className="bg-white d-flex p-3" style={{ borderRadius: "10px", width: "48%" }}>
                    <div>
                      <img src="/assets/Admin/Game/Notification4.svg" alt="Game Timer" />
                    </div>
                    <div className="mx-4 my-auto" style={{ width: "100%" }}>
                      Player Lost <div className="text-color">{booking?.looserPlayer?.name || "-"}</div>
                    </div>
                  </Col>
                </Row>
              </div>
              : (
                selectedGame?.payLater && 
                <div className="rounded shadow-sm w-100 right-padding-responsive left-margin-responsive" style={{ marginLeft: "10px", paddingRight: "8px" }}>
                  <Row className="mt-2 gap-0">
                    <Col md={6} className="p-0">
                      <div className="bg-white d-flex p-3 gap-1" style={{ borderRadius: "10px", width: "100%" }}>
                        <div className="d-flex gap-4 custom-gap-responsive" style={{ border: "none" }}>
                          <div>
                            <img src="/assets/Admin/Game/Notification.svg" alt="Game Timer" />
                          </div>
                          <div className="text-color my-auto">
                            <div>Total Time</div>
                            <div className="text-color fs-4">
                              <span className="">{Math.floor(currentTime / 60)} m</span> :
                              <span className="">{currentTime % 60} s</span>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-around align-items-center gap-4 custom-gap-responsive">
                          {isRunning || isPaused ? (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="px-2"
                              style={{ border: "2px dashed rgb(255, 68, 0)", width: "50%", paddingRight: "10px", marginLeft: "30px" }}
                              onClick={() => setShowConfirm(true)} // Show confirmation modal
                            >
                              Stop
                            </Button>
                          ) : (
                            !isPaused &&
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="start-btn-responsive mt-2"
                              disabled={booking?.total_time > 0 && booking?.timer_status === "Stopped"}
                              style={{ border: "2px dashed", width: "100%", height: "40px", padding: "2px", marginLeft: "30px" }}
                              onClick={handleStartTimer}
                            >
                              <FaClock size={16} style={{ marginRight: "5px" }} />
                              <span>Start</span>
                            </Button>
                          )}

                          {
                            !isRunning ? (
                              <VscDebugContinue
                                size={48}
                                className="text-success mt-2"
                                style={{ marginLeft: "5%", cursor: "pointer" }}
                                onClick={handleResumeTimer}
                              />
                            ) : (
                              <FaPause
                                size={32}
                                className="text-danger mt-2"
                                style={{ marginLeft: "5%", cursor: "pointer" }}
                                onClick={handlePauseTimer}
                              />
                            )
                          }
                        </div>
                      </div>
                    </Col>

                    <Col md={6} >
                      <div className="bg-white d-flex p-3" style={{ borderRadius: "10px", width: "100%" }}>
                        <div className="d-flex" style={{ border: "none",width: "100%" }}>
                          <div>
                            <img src="/assets/Admin/Game/Notification2.svg" alt="Game Timer" />
                          </div>
                          <div className="d-flex gap-2" style={{ width: "100%" }}>
                            <div className="mb-0 muted-text w-50">
                              <div className="px-2" style={{ borderRight: "1px solid grey" }}>Start</div> <div className="text-color px-2" style={{ borderRight: "1px solid grey" }}>{booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : new Date(tempStartTime).toLocaleTimeString()}</div>
                            </div>
                            <div className="mb-0 muted-text w-50 text-center">
                              <div>End</div> <div className="text-color">{booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : ""}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6} className="p-0 mt-2">
                      <div className="bg-white d-flex p-3 gap-2" style={{ borderRadius: "10px", width: "100%" }}>
                      <div>
                        <img src="/assets/Admin/Game/Notification3.svg" alt="Game Timer" />
                      </div>
                      <div className="d-flex flex-column m-auto" style={{ width: "100%" }}>
                        <div>
                          Charges
                        </div>
                        <div className="text-color fs-4">
                          ₹ {priceToPay}
                        </div>
                      </div>
                      </div>
                    </Col>

                    <Col md={6} className="mt-2">
                      <div className="bg-white d-flex p-3" style={{ borderRadius: "10px", width: "100%" }}>
                      <div>
                        <img src="/assets/Admin/Game/Notification4.svg" alt="Game Timer" />
                      </div>

                      {looserPlayer && (
                        <div className="mx-4 my-auto" style={{ width: "100%" }}>
                          <div className="fw-bold">Looser </div>
                          <div className="text-color fs-5">
                            {looserPlayer.name}
                          </div>
                        </div>
                      )}
                      <OverlayTrigger
                        placement="left"
                        show={showTooltip}
                        onToggle={(isVisible) => setShowTooltip(isVisible)}
                        overlay={
                          <Tooltip
                            id="player-list-tooltip"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            <h6 className="m-2 p-2 text-light border-bottom">Select Looser Player</h6>
                            <ul className="m-2 p-2 list-unstyled">
                              {selectedCustomer && (
                                <li
                                  className="fw-bold p-1"
                                  onClick={() => {
                                    setLooserPlayer(selectedCustomer);
                                    setShowTooltip(false);
                                  }}
                                  // style={{ cursor: "pointer" }}
                                  style={{
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa", e.currentTarget.style.color = "black")}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "white")}
                                >
                                  {selectedCustomer?.name} (Customer)
                                </li>
                              )}

                              {players?.length > 0 ? (
                                players.map((player, index) => (
                                  <li
                                    key={index}
                                    className="p-1"
                                    onClick={() => handleSelectLooserPlayer(player)}
                                    style={{
                                      cursor: "pointer",
                                      transition: "all 0.2s ease-in-out",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa", e.currentTarget.style.color = "black")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "white")}
                                  >
                                    {player.name}
                                  </li>
                                ))
                              ) : (
                                <li className="muted-text">No Players</li>
                              )}
                            </ul>
                          </Tooltip>
                        }
                      >
                        <Stack
                          direction="horizontal"
                          gap={2}
                          className="align-items-center mt-2 float-end px-6"
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          <div className="d-flex">
                            <Image src={userProfile} roundedCircle width={35} height={35} className="border" />
                            {players &&
                              players.slice(0, maxVisiblePlayers).map((player, index) => (
                                <Image
                                  src={player.customerProfile || userProfile}
                                  roundedCircle
                                  width={35}
                                  height={35}
                                  className="border ms-n3"
                                  key={index}
                                />
                              ))}
                            {players?.length > maxVisiblePlayers && (
                              <span className="fw-bold muted-text ms-2">+{players.length - maxVisiblePlayers}</span>
                            )}
                          </div>
                        </Stack>
                      </OverlayTrigger>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
            :
            <></>
          }

          {booking?.status === "Pending" ?
            <div className="rounded shadow-sm w-100">
              <Row className="p-2">
                <Col md={12} className="bg-white p-3 rounded-2">
                  {/* <Card className="p-3 mt-2 rounded-3" style={{ marginLeft: "10px", marginRight: "10px" }}> */}
                    <h5 className="fs-3 text-color">Payment Details</h5>
                    <Row className="mt-1">
                      <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size}) </Col>
                      <Col xs={3} className="muted-text">{booking?.players?.length + 1} Candidates</Col>
                      <Col xs={3} className="text-end">{selectedGame?.type === "Single" && !selectedGame?.payLater && (booking?.total - booking?.paid_amount) > 0 && <span className="text-danger">₹ {booking?.total - booking?.paid_amount} Pending</span>} </Col>
                    </Row>
                    <hr className="m-1" />

                    <Row className="mt-1">
                      <Col xs={6} className="d-flex align-items-center">
                        <p className="text-color">Total Amount</p>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <span className="fw-bold text-color">
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Disabled readonly input"
                            aria-label="Disabled input example"
                            readOnly
                            value={total}
                          />
                        </span>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={6} className="d-flex align-items-center">
                        <p className="text-color">Adjustment / Discount </p>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <Form.Control
                          size="sm"
                          type="number"
                          placeholder="Enter adjustment value"
                          value={adjustment}
                          onChange={(e) => {
                            if (e.target.value > total) {
                              return
                            }
                            setAdjustment(e.target.value);
                          }}
                        />
                      </Col>

                    </Row>

                    {creditAmount > 0 && <div className="mt-4">
                      <h4>Credit Collection
                        {/* <Button size="sm" className="btn btn-primary bg-body text-color" onClick={handleSplitCredit}>Split Credit</Button> */}
                      </h4>
                      <Table bordered hover responsive size="sm" className="mt-2">
                        <thead className="bg-light">
                          <tr>
                            <th>Name</th>
                            <th>Limit</th>
                            <th>Balance</th>
                            <th>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Selected Customer Row */}
                          <tr>
                            <td>{selectedCustomer.name}</td>
                            <td>{selectedCustomer?.creditLimit}</td>
                            <td>{selectedCustomer.creditLimit - selectedCustomer.creditAmount}</td>
                            <td>
                              <Form.Control
                                size="sm"
                                type="number"
                                placeholder="Rs 0"
                                value={playerCredits.find(p => p._id === selectedCustomer._id)?.credit || 0}
                                onChange={(e) => handleCreditChange(selectedCustomer._id, e.target.value)}
                              />
                            </td>
                          </tr>

                          {/* Other Players Rows */}
                          {players.length > 0 && players.map((player, index) => (
                            <tr key={player._id}>
                              <td>{player.name}</td>
                              <td>{player.creditLimit}</td>
                              <td>{player.creditLimit - player.creditAmount}</td>
                              <td>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  placeholder="Rs 0"
                                  value={playerCredits.find(p => p._id === player._id)?.credit || 0}
                                  onChange={(e) => handleCreditChange(player._id, e.target.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>}

                    <Row>
                      <Col md={3} xs={12}>
                        <Button variant="primary btn btn-sm"
                          xs={12}
                          className="w-100 mt-3 tab-button-responsive"
                          disabled={!booking?.timer_status === "Stopped"}
                          onClick={() => {
                            if (!isItemsSaved) {
                              alert("Please save the added items before proceeding with payment.");
                              setShowConfirmModal(true)
                              return;
                            }
                            setShowCreditModal(true)
                          }}
                        >Payment Options</Button>
                      </Col>

                      {showCreditModal &&
                        <CreditSplit
                          show={showCreditModal}
                          handleClose={() => setShowCreditModal(false)}
                          handleCollectOffline={handleCollectOffline}
                          handleOnlinePayment={handleOnlinePayment}
                          totalAmount={total}
                          players={players}
                          customer={selectedCustomer}
                        />}
                    </Row>
                  {/* </Card> */}
                </Col>
              </Row>
            </div>
            :
            <Card className="p-3 mt-2 rounded-3 h-100">
              <h5 className="fs-3">Payment Details</h5>
              <Row className="mt-1">
                <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size}) </Col>
                <Col xs={3} className="text-color">
                  {/* {booking?.players?.length + 1} <span>Candidates</span> */}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="player-list-tooltip">
                        <ul className="m-2 p-2">
                          {/* Selected Customer */}
                          {selectedCustomer && (
                            <li className="fw-bold p-1">{selectedCustomer?.name} (Main Customer)</li>
                          )}

                          {/* Players List */}
                          {booking?.players?.length > 0 ? (
                            players.map((player, index) => (
                              <li key={index} className="p-1">{player.name}</li>
                            ))
                          ) : (
                            <li className="muted-text">No Players</li>
                          )}
                        </ul>
                      </Tooltip>
                    }
                  >
                    <span className="cursor-pointer">
                      {booking?.players?.length + 1} <span>Players</span>
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs={3} className="text-end text-color">₹ {booking?.total + booking?.adjustment} Total</Col>
                {/* <Col xs={3} className="text-end muted-text">₹ {booking?.total - booking?.paid_amount} Balance</Col> */}
                {/* <Col xs={3} className="text-end">{(booking?.total - booking?.paid_amount) > 0 && <span className="fs-3 text-danger">₹ { booking?.total - booking?.paid_amount} Pending</span>} </Col> */}
              </Row>
              <hr className="m-1" />

              <Row className="mt-2">
                <Col xs={6} className="text-color fw-semibold">Payment Mode</Col>
                <Col xs={6} className="muted-text">
                  <span
                    className="d-flex align-items-center w-25"
                    style={{
                      backgroundColor:
                        booking?.mode === "Online"
                          ? "#03D41414"
                          : "#FF00000D",
                      borderRadius: "20px",
                      fontSize: "12px",
                      padding: "5px 10px",
                      marginLeft: "-10px",
                      color:
                        booking?.mode === "Online" ? "#00AF0F" : "orange",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          booking?.mode === "Online"
                            ? "#03D414"
                            : "orange",
                        marginRight: "5px",
                      }}
                    />
                    {booking?.mode}
                  </span>
                </Col>
              </Row>

              <Row className="mt-1 py-2">
                <Col xs={6} className="text-color fw-semibold">Amount Paid</Col>
                <Col xs={6} className="muted-text">₹ {booking?.paid_amount > 0 ? booking?.paid_amount : 0}</Col>
              </Row>

              <Row className="mt-1 py-2">
                <Col xs={6} className="text-color fw-semibold">Adjustment</Col>
                <Col xs={6} className="muted-text">₹ {booking?.adjustment || 0}</Col>
              </Row>

              <Row className="mt-2 py-2">
                <Col xs={6} className="text-color fw-semibold">Credit Amount</Col>
                <Col xs={6} className="muted-text">
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    placement="right"
                    overlay={renderCreditsPopover}
                  >
                    <span style={{ cursor: 'pointer' }}>
                      ₹ {booking?.total - booking?.paid_amount}
                    </span>
                  </OverlayTrigger>
                </Col>
              </Row>


              <Row className="mt-2 py-2">
                <Col xs={6} className="text-color fw-semibold">Transaction ID</Col>
                <Col xs={6} className="muted-text">{booking?.transaction?.razorpay_payment_id || "Cash"}</Col>
              </Row>

              <Row className="mt-2 py-2">
                <Col xs={6} className="text-color fw-semibold">Date/Time</Col>
                <Col xs={6} className="muted-text">
                  {booking?.mode === "Online" ? formatDateAndTime(booking?.transaction?.createdAt) : formatDateAndTime(booking?.createdAt)}
                </Col>
              </Row>
            </Card>
          }
        </Col>
      </Row>

      {showConfirmModal && (
        <ItemsSave
          show={showConfirmModal}
          handleClose={() => setShowConfirmModal(false)}
          handleConfirm={handleSaveItems}
        />
      )}

      <Modal size="sm" show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Confirm Stop Timer</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">Are you sure you want to stop the timer?</Modal.Body>
        <Modal.Footer className="p-3">
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleStopTimer();
              setShowConfirm(false);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmOffline} onHide={() => setShowConfirmOffline(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cash Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to collect offline payment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmOffline(false)}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleCollectOffline();
              setShowConfirmOffline(false);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingCheckout;
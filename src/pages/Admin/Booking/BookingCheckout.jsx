
// Main Component for the Booking Checkout

// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Button, Image, Stack, Form, OverlayTrigger, Tooltip, Modal, Table } from "react-bootstrap";
// import { FaPhone, FaVideo, FaComment, FaClock, FaRegClock, FaPause } from "react-icons/fa";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import userProfile from "/assets/profile/user_avatar.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import { convertTo12Hour, formatDate, formatDateAndTime } from "../../../components/utils/utils";
// import { addToCart, getBookingDetails, processOnlinePayment, updateBooking } from "../../../store/AdminSlice/BookingSlice";
// import { VscDebugContinue } from "react-icons/vsc";
// import { initializeTimer, pauseBookingTimer, resumeBookingTimer, startBookingTimer, stopBookingTimer } from "../../../store/AdminSlice/TimerSlice";
// import "./BookingCheckout.css";
// import { IoFastFoodOutline } from "react-icons/io5";
// import Select from "react-select";
// import { getItems } from "../../../store/AdminSlice/Inventory/ItemsSlice";
// import { AiOutlineClose } from "react-icons/ai";

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

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const cafeId = user?._id;

//   const items = useSelector((state) => state.items.items);

//   useEffect(() => {
//     if (items.length > 0) {
//       setOptions(items.map((item) => ({ value: item._id, label: item.name })));
//     }
//   }, [items]);

//   useEffect(() => {
//     if (id) {
//       dispatch(getItems(cafeId));
//       dispatch(getBookingDetails(id));
//     }
//   }, [dispatch, id, isStopped]);

//   useEffect(() => {
//     if (booking) {
//       setSelectedGame(booking?.game_id);
//       setSelectedCustomer(booking?.customer_id);
//       setSlot(booking?.slot_id);
//       setPlayers(booking?.players);

//       if(booking?.so_id){
//         setShowInventory(true)
//         const mappedItems = booking.so_id.items.map((item) => ({ id: item.item_id, item: item.item, price: item.price, quantity: item.quantity, tax: item.tax, total: item.total, totalTax: item.totalTax }));
//         setSelectedItems(mappedItems)
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

//   console.log("showInventory", showInventory);

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
//     if (addOnTotal > 0) {
//       setPriceToPay(Math.round((secondsElapsed * pricePerSecond) + addOnTotal));
//     }
//   }, [currentTime, pricePerSecond, addOnTotal]);

//   useEffect(() => {
//     if (selectedItems.length > 0) {
//       let total = 0;
//       selectedItems.map((item) => {
//         total += item.total;
//       })
//       setAddOnTotal(total)
//     }
//   }, [selectedItems]);

//   const handleChange = (selectedOption) => {
//     let id = selectedOption.value;
//     if (!id || selectedIds.includes(id)) return;

//     setSelectedValue("");

//     const selected = items.find(item => item._id === id);
//     if (selected) {
//       let totalTax = selected.tax ? Math.round((selected.tax.tax_rate * selected.sellingPrice) / 100) : 0;
//       setSelectedItems([...selectedItems, {
//         id: selected._id,
//         item: selected.name,
//         price: selected.sellingPrice,
//         quantity: 1,
//         tax: selected.tax || null,
//         total: selected.sellingPrice,
//         totalTax: totalTax
//       }]);
//       setSelectedIds([...selectedIds, selected._id]);
//     }
//   };

//   useEffect(() => {
//     if (creditAmount > 0 && selectedCustomer) {
//       let remainingAmount = creditAmount;
//       const updatedCredits = [];

//       // Check if customer can take full credit
//       const customerAvailable = selectedCustomer.creditLimit - selectedCustomer.creditAmount;

//       if (customerAvailable >= creditAmount) {
//         updatedCredits.push({
//           _id: selectedCustomer._id,
//           credit: creditAmount,
//         });
//         setPlayerCredits(updatedCredits);
//         setPayableAmount(0);
//         return;
//       }

//       // Distribute credit among eligible players and customer
//       const eligiblePlayers = players.filter(
//         (player) =>
//           player.creditEligibility === "Yes" &&
//           player.creditLimit - player.creditAmount > 0
//       );

//       // Include customer if they have some available credit
//       if (customerAvailable > 0) {
//         eligiblePlayers.unshift({
//           _id: selectedCustomer._id,
//           creditEligibility: "Yes",
//           creditLimit: selectedCustomer.creditLimit,
//           creditAmount: selectedCustomer.creditAmount,
//         });
//       }

//       for (const player of eligiblePlayers) {
//         const availableCredit = player.creditLimit - player.creditAmount;

//         if (availableCredit > 0 && remainingAmount > 0) {
//           const assignAmount = Math.min(availableCredit, remainingAmount);
//           updatedCredits.push({
//             _id: player._id,
//             credit: assignAmount,
//           });
//           remainingAmount -= assignAmount;
//         }

//         if (remainingAmount <= 0) break;
//       }


//       let totalPayableAmount = payableAmount + remainingAmount;

//       setPlayerCredits(updatedCredits);
//       setPayableAmount(totalPayableAmount); // Any leftover goes to payable
//     }
//   }, [creditAmount, players, selectedCustomer]);

//   useEffect(() => {
//     const adjValue = adjustment === "-" ? 0 : Number(adjustment) || 0;
//     const adjustedAmount = Math.round((Number(priceToPay) || 0) + adjValue);
//     setPayableAmount(adjustedAmount);
//   }, [priceToPay, adjustment]);

//   const handleAdjustmentChange = (e) => {
//     let value = e.target.value;

//     if (value === "" || value === "-") {
//       setAdjustment(value);
//       return;
//     }

//     if (/^-?\d*$/.test(value)) {
//       setAdjustment(value);
//     }
//   };

//   const updateProduct = (id, field, value) => {
//     const updatedItems = selectedItems.map((product) => {
//       if (product.id === id) {
//         const updatedQuantity = field === "quantity" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : product.quantity; // Ensure only numeric input
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

//   const handlePayableAmountChange = (e) => {
//     console.log("e.target.value", e.target.value);
//     const newPayableAmount = Math.round(parseFloat(e.target.value) || 0);
//     const adjustmentValue = adjustment === "-" ? 0 : parseFloat(adjustment) || 0; // Fix NaN issue

//     const difference = Math.round(priceToPay - newPayableAmount + adjustmentValue);

//     setPayableAmount(newPayableAmount);
//     setCreditAmount(difference);
//     console.log("payableAmount", payableAmount);
//   };

//   console.log("playerCredits", playerCredits);

//   const handleCreditChange = (id, newCredit) => {
//     setPlayerCredits((prevCredits) =>
//       prevCredits.map((player) =>
//         player._id === id ? { ...player, credit: Math.round(newCredit) } : player
//       )
//     );
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
//     dispatch(startBookingTimer(booking._id));
//   };

//   const handlePauseTimer = () => {
//     dispatch(pauseBookingTimer(booking._id));
//   };

//   const handleResumeTimer = () => {
//     dispatch(resumeBookingTimer(booking._id));
//   };

//   const handleStopTimer = () => {
//     dispatch(stopBookingTimer(booking._id));
//     setIsStopped(true)
//   };

//   const handleSaveItems = async () => {
//     try {
//       const itemsData = {
//         items: selectedItems,
//         customer_id: selectedCustomer?._id,
//         cafe: cafeId
//       };
//       await dispatch(addToCart({ id: booking?._id, updatedData: itemsData })).unwrap()
//     }catch(error){

//     }
//   }

//   const handleOnlinePayment = async () => {
//     try {
//       const payer = looserPlayer || selectedCustomer; // Use looser player if selected, otherwise main customer

//       const response = await dispatch(
//         processOnlinePayment({
//           selectedGame,
//           selectedCustomer: payer, // Set the payer
//           slot,
//           payableAmount,
//           paid_amount: payableAmount,
//           total: priceToPay,
//           looserPlayer: looserPlayer,
//           bookingId: booking?._id,
//           playerCredits,
//         })
//       );

//       if (response) {
//         alert(`Payment collected from ${payer.name}`);
//       }
//     } catch (error) {
//       console.error("Error processing online payment:", error);
//     }
//   };

//   const handleCollectOffline = async () => {
//     try {
//       const bookingData = {
//         mode: "Offline",
//         status: "Paid",
//         total: priceToPay,
//         paid_amount: payableAmount,
//         playerCredits: playerCredits,
//         looserPlayer: looserPlayer
//       };
//       await dispatch(updateBooking({ id: booking?._id, updatedData: bookingData })).unwrap()
//     } catch (error) { }
//   };

//   const handleSelectLooserPlayer = (player) => {
//     setLooserPlayer(player);
//   };

//   const handleSplitCredit = () => {

//   }

//   return (
//     <Container className="mt-4">
//       <Row>
//         <h5>
//           <Link to="/admin/dashboard">Home</Link> / <span style={{ color: "blue" }}>
//             {"Bookings/Checkout"}
//           </span>
//         </h5>
//         <div>
//           <IoFastFoodOutline className="me-2 float-end fs-1 m-2" onClick={() => setShowInventory(!showInventory)}
//           />
//         </div>

//       </Row>

//       <Row>
//         <Col md={4} className="border-0">
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
//             <div>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Full Name:</strong> <span>{selectedCustomer?.name}</span>
//               </p>
//               <p className="d-flex justify-content-between">
//                 <strong className="text-color">Email Id:</strong> <span>{selectedCustomer?.email}</span>
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
//           <Button
//             variant="success"
//             className="w-100 mt-3"
//             style={{ backgroundColor: "#03D41414", color: "#00AF0F" }}
//             onClick={() => navigate(`/admin/booking/edit/${booking?._id}`)}
//           >
//             Edit Booking
//           </Button>
//         </Col>

//         <Col md={8} className="d-flex flex-column gap-1 justify-content-between">
//           <Row>
//             <Col
//               md={showInventory ? 6 : 12}
//               className={`d-flex flex-column p-0 justify-content-between transition-col`}
//             >
//               <Card className="p-3 h-100" >
//                 <h5 className="mb-3 font-inter fs-3">Booking Details
//                   {selectedGame?.payLater ?
//                     <span className="fw-bold text-info float-end">Amount : ₹ {slot?.slot_price ? slot?.slot_price : selectedGame?.price}/Hour</span>
//                     :
//                     <span className="fw-bold text-info float-end">Amount : ₹ {booking?.total}</span>
//                   }
//                 </h5>
//                 <Row>
//                   <Col xs={6}>
//                     <p className="muted-text m-0">Selected Game</p>
//                   </Col>
//                   <Col xs={6}>
//                     <p className="muted-text m-0">
//                       <span className="fw-bold text-color">{selectedGame?.name}({selectedGame?.size})</span>
//                       <span>
//                         <Button
//                           variant="success"
//                           className="mx-2 mb-0 rounded-pill"
//                           style={{
//                             backgroundColor: "#03D41414",
//                             color: "#00AF0F",
//                             border: "none",
//                           }}
//                         >
//                           {selectedGame?.type}
//                         </Button>
//                       </span>
//                     </p>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="muted-text">No. of Candidates</p>
//                   </Col>
//                   <Col xs={6}>
//                     <p className="muted-text"><span className="fw-bold text-color">{booking?.players?.length + 1}</span></p>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="muted-text">Slot Details</p>
//                   </Col>
//                   <Col xs={6}>
//                     <span className="fw-bold text-color">{selectedGame?.name} {slot?.name}</span>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="muted-text">Time Slot</p>
//                   </Col>
//                   <Col xs={6}>
//                     <span className="fw-bold text-color">{slot?.start_time && convertTo12Hour(slot?.start_time)} - {slot?.end_time && convertTo12Hour(slot.end_time)}</span>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="muted-text">Day/Date</p>
//                   </Col>
//                   <Col xs={6}>
//                     <span className="fw-bold text-color">{formatDate(booking?.slot_date)}</span>
//                   </Col>
//                 </Row>
//                 <Row className="mb-1">
//                   <Col xs={6}>
//                     <p className="muted-text">Booking ID</p>
//                   </Col>
//                   <Col xs={6}>
//                     <span className="fw-bold text-color">{booking?.booking_id}</span>
//                   </Col>
//                 </Row>
//               </Card>
//             </Col>

//             {showInventory && (
//               <Col
//                 md={6}
//                 className={`transition-col ${showInventory ? "visible" : "hidden"} p-1`}
//                 style={{ display: showInventory ? "block" : "none" }}
//               >
//                 <Card className="p-1">
//                   <div className="bg-white rounded-3 p-0 d-flex flex-column" style={{ height: "350px" }}>

//                     {/* Sticky Top Input */}
//                     <div
//                       style={{
//                         padding: "12px 16px",
//                         borderBottom: "1px solid #ddd",
//                         background: "#fff",
//                         zIndex: 10,
//                         position: "sticky",
//                         top: 0,
//                       }}
//                     >
//                       <Select
//                         options={options}
//                         onChange={handleChange}
//                         isSearchable
//                         placeholder="Select for add on's..."
//                         className="mb-1"
//                       />
//                     </div>

//                     {/* Scrollable Content */}
//                     <div
//                       style={{
//                         overflowY: "auto",
//                         flex: 1,
//                         padding: "12px 16px",
//                         scrollbarWidth: "none",
//                         msOverflowStyle: "none",
//                       }}
//                       className="hide-scrollbar"
//                     >
//                       {selectedItems.map((product, index) => (
//                         <div className="d-flex justify-content-between align-items-center">
//                           <Card key={index} className="mb-2 shadow-sm fs-6" style={{ background: "#eeeaef", height: "20%", width:"100%" }}>
//                             <div
//                               style={{
//                                 position: "absolute",
//                                 bottom: "35px",
//                                 right: "-6px",
//                                 cursor: "pointer",
//                                 borderRadius: "80%",
//                                 padding: "3px",
//                                 zIndex: 2,
//                               }}
//                               onClick={() => {
//                                 const updatedProducts = selectedItems.filter((_, i) => i !== index);
//                                 setSelectedItems(updatedProducts);
//                                 const updatedSelectedIds = selectedIds.filter((id) => id !== product.id);
//                                 setSelectedIds(updatedSelectedIds);
//                               }}
//                             >
//                               <AiOutlineClose size={12} color="red" />
//                             </div>
//                             <Card.Body className="py-1 px-3">
//                               <div className="d-flex justify-content-between align-items-start">
//                                 <div style={{ flex: 1 }}>
//                                   <div
//                                     className="fw-semibold fs-6"
//                                     style={{
//                                       maxHeight: "20px",
//                                       overflowY: "auto",
//                                       scrollbarWidth: "none",
//                                       msOverflowStyle: "none",
//                                     }}
//                                     onWheel={(e) => e.stopPropagation()}
//                                   >
//                                     {product.item}
//                                   </div>
//                                   <div className="muted-text small mb-1">₹{product.price} each</div>
//                                 </div>

//                                 <div style={{ flex: 1 }}>
//                                   <Form.Control
//                                     type="number"
//                                     min="0"
//                                     max="999"
//                                     value={product.quantity}
//                                     size="sm"
//                                     style={{
//                                       width: "60px",
//                                       height: "28px",
//                                       fontSize: "12px",
//                                       marginLeft: "10px",
//                                       padding: "1px 3px",
//                                       border: "1px solid #ccc",
//                                     }}
//                                     placeholder="Qty"
//                                     onChange={(e) => {
//                                       let value = e.target.value;
//                                       if (value > 999) value = 999;
//                                       updateProduct(product.id, "quantity", value)
//                                     }}
//                                   />
//                                 </div>

//                                 <div className="text-end ms-3" style={{ minWidth: "120px" }}>
//                                   <div className="small">
//                                     Tax ({product?.tax?.tax_rate || 0}%):{" "}
//                                     <span className="fw-semibold">₹{product.totalTax}</span>
//                                   </div>
//                                   <div className="fw-semibold">Total: ₹{product.total}</div>
//                                 </div>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Sticky Bottom Total */}
//                     <div
//                       style={{
//                         padding: "8px 12px",
//                         borderTop: "1px solid #ddd",
//                         fontWeight: "600",
//                         // textAlign: "right",
//                         background: "#fff",
//                         borderRadius: "0 0 10px 10px",
//                       }}
//                     >
//                       <span>Total: ₹ {addOnTotal}</span>
//                       <span className="float-end bg-secondary text-white px-2 py-1 rounded" onClick={handleSaveItems}>Save</span>
//                     </div>
//                   </div>
//                 </Card>
//               </Col>
//             )}

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
//                       <p className="mb-0 muted-text">
//                         <strong>Start Time:</strong>
//                         <span className="ms-2">{booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
//                       </p>
//                       <p className="mb-0 muted-text">
//                         <strong>End Time:</strong>
//                         <span className="ms-2"> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}</span>
//                       </p>
//                     </div>
//                   </Col>

//                   <Col md={2} className="p-0">
//                     <h3 className="fw-bold pt-2"> ₹ {priceToPay}</h3>
//                   </Col>

//                   <Col md={3} className="p-0">
//                     Player Lost : {booking?.looserPlayer?.name}
//                   </Col>

//                 </Row>
//               </div>
//               : (
//                 selectedGame?.payLater &&
//                 <div className="p-2 bg-white rounded shadow-sm w-100">
//                   <Row>
//                     <Col md={10} >
//                       <Button variant="outline-success " className="d-flex align-items-center gap-2" style={{ border: "none" }}
//                         onClick={handleStopTimer}>
//                         <FaRegClock size={30} />
//                         <span className="fw-bold fs-1">{Math.floor(currentTime / 60)} m</span>:
//                         <span className="text-secondary fs-1">{currentTime % 60} s</span>
//                       </Button>
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

//                       <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
//                         <Modal.Header closeButton>
//                           <Modal.Title>Confirm Stop Timer</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>Are you sure you want to stop the timer?</Modal.Body>
//                         <Modal.Footer>
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
//                           <strong>Start Time:</strong> {new Date(booking?.start_time).toLocaleTimeString()}
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
//               <h5 className="fs-3">Payment Details</h5>
//               <Row className="mt-1">
//                 <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size})</Col>
//                 <Col xs={3} className="muted-text">{booking?.players?.length + 1} Candidates</Col>
//                 <Col xs={3} className="text-end">{(booking?.total - booking?.paid_amount) > 0 && <span className="text-danger">₹ {booking?.total - booking?.paid_amount} Pending</span>} </Col>
//               </Row>
//               <hr className="m-1" />

//               <Row className="mt-1">
//                 <Col xs={6} className="d-flex align-items-center">
//                   <p className="muted-text">Total Amount</p>
//                 </Col>
//                 <Col xs={6} className="mb-2">
//                   <span className="fw-bold text-color">
//                     <Form.Control
//                       size="sm"
//                       type="text"
//                       placeholder="Disabled readonly input"
//                       aria-label="Disabled input example"
//                       readOnly
//                       value={priceToPay}
//                     />
//                   </span>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col xs={6} className="d-flex align-items-center">
//                   <p className="muted-text">Adjustment</p>
//                 </Col>
//                 <Col xs={6} className="mb-2">
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     placeholder="Enter adjustment value"
//                     value={adjustment}
//                     onChange={handleAdjustmentChange}
//                   />
//                 </Col>
//               </Row>

//               <Row className="mb-2">
//                 <Col xs={6}>
//                   <p className="muted-text">Payable Amount</p>
//                 </Col>
//                 <Col xs={6}>
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     value={payableAmount}
//                     onChange={handlePayableAmountChange}
//                   />
//                 </Col>
//               </Row>

//               <Row className="mb-2">
//                 <Col xs={6}>
//                   <p className="muted-text">Credit Amount</p>
//                 </Col>
//                 <Col xs={6}>
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     placeholder="Input Credit Amount"
//                     readOnly
//                     value={creditAmount}
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
//                     onClick={handleOnlinePayment}
//                   >
//                     Online
//                   </Button>
//                 </Col>
//                 <Col md={3} xs={6}>
//                   <Button variant="primary btn btn-sm"
//                     xs={12}
//                     className="w-100 mt-3"
//                     disabled={!booking?.timer_status === "Stopped"}
//                     onClick={() => setShowConfirmOffline(true)}
//                   >
//                     Offline
//                   </Button>

//                 </Col>
//               </Row>
//             </Card>
//             :
//             <Card className="p-3 rounded-3 h-100">
//               <h5 className="fs-3">Payment Details</h5>
//               <Row className="mt-1">
//                 <Col xs={6} className="text-primary fw-semibold">{selectedGame?.name} ({selectedGame?.size})</Col>
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
//                 {/* <Col xs={3} className="text-end muted-text">₹ {booking?.total - booking?.paid_amount} Balance</Col> */}
//                 {/* <Col xs={3} className="text-end">{(booking?.total - booking?.paid_amount) > 0 && <span className="fs-3 text-danger">₹ { booking?.total - booking?.paid_amount} Pending</span>} </Col> */}

//               </Row>
//               <hr className="m-1" />

//               <Row className="mt-4">
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
//                       padding: "5px 10px",
//                       marginLeft: "-10px",
//                       color:
//                         booking?.mode === "Online" ? "#00AF0F" : "orange",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "10px",
//                         height: "10px",
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

//               <Row className="mt-4">
//                 <Col xs={6} className="text-color fw-semibold">Amount Paid</Col>
//                 <Col xs={6} className="muted-text">₹ {booking?.paid_amount}</Col>
//               </Row>

//               <Row className="mt-4">
//                 <Col xs={6} className="text-color fw-semibold">Credit Amount</Col>
//                 <Col xs={6} className="muted-text">₹ {booking?.paid_amount}</Col>
//               </Row>

//               <Row className="mt-4">
//                 <Col xs={6} className="text-color fw-semibold">Transaction ID</Col>
//                 <Col xs={6} className="muted-text">{booking?.transaction?.razorpay_payment_id || "-"}</Col>
//               </Row>

//               <Row className="mt-4">
//                 <Col xs={6} className="text-color fw-semibold">Date/Time</Col>
//                 <Col xs={6} className="muted-text">
//                   {booking?.mode === "Online" ? formatDateAndTime(booking?.transaction?.createdAt) : formatDateAndTime(booking?.createdAt)}
//                 </Col>
//               </Row>
//             </Card>
//           }
//         </Col>

//       </Row>
//     </Container>
//   );
// };

// export default BookingCheckout;

















































































//                       _/\_
// Main component above   ||

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Stack, Form, OverlayTrigger, Tooltip, Modal, Table, Dropdown, Popover } from "react-bootstrap";
import { FaPhone, FaVideo, FaComment, FaClock, FaRegClock, FaPause } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import userProfile from "/assets/profile/user_avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12Hour, formatDate, formatDateAndTime } from "../../../components/utils/utils";
import { addToCart, getBookingDetails, processOnlinePayment, updateBooking } from "../../../store/AdminSlice/BookingSlice";
import { VscDebugContinue } from "react-icons/vsc";
import { initializeTimer, pauseBookingTimer, resumeBookingTimer, startBookingTimer, stopBookingTimer } from "../../../store/AdminSlice/TimerSlice";
import "./BookingCheckout.css";
import { IoFastFoodOutline } from "react-icons/io5";
import Select from "react-select";
import { getItems } from "../../../store/AdminSlice/Inventory/ItemsSlice";
import { AiOutlineClose } from "react-icons/ai";
import { getTaxFields } from "../../../store/AdminSlice/TextFieldSlice";
import CreditSplit from "./Model/CreditSplit";
import { FaTrash } from "react-icons/fa6";
import { TbTrash } from "react-icons/tb";

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
  const [showCreditModal, setShowCreditModal] = useState(false);
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
      setOptions(items.map((item) => ({ value: item._id, label: item.name })));
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

      if (booking?.so_id) {
        setShowInventory(true)
        const mappedItems = booking.so_id.items.map((item) => ({ id: item.item_id._id, item: item.item, price: item.price, quantity: item.quantity, tax: item.tax, total: item.total, totalTax: item.tax_amt }));
        setSelectedItems(mappedItems)
        setSelectedIds(mappedItems.map((item) => item?.id));
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
    }
  }, [selectedItems]);

  // const handleChange = (selectedOption) => {
  //   let id = selectedOption.value;
  //   if (!id || selectedIds.includes(id)) return;
  //   // if (!id || selectedIds.includes(_id)) return;

  //   setSelectedValue("");

  //   const selected = items.find(item => item._id === id);
  //   if (selected) {
  //     let totalTax = selected.tax ? Math.round((selected.tax.tax_rate * selected.sellingPrice) / 100) : 0;
  //     setSelectedItems([...selectedItems, {
  //       id: selected._id,
  //       item: selected.name,
  //       price: selected.sellingPrice,
  //       quantity: 1,
  //       tax: selected.tax || null,
  //       total: selected.sellingPrice,
  //       totalTax: totalTax
  //     }]);
  //     setSelectedIds([...selectedIds, selected._id]);
  //     setSelectedOption(null);
  //     setIsItemsSaved(false);
  //   }
  // };

  const handleChange = (selectedOption) => {
    let id = selectedOption.value;
    if (!id || selectedIds.includes(id)) return;

    setSelectedValue("");

    const selected = items.find(item => item._id === id);

    console.log('selected', selected)
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

  const handleStopTimer = () => {
    dispatch(stopBookingTimer(booking._id));
    setIsStopped(true)
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

    // const formattedPlayers = finalPlayers.map(({ _id, ...rest }) => ({
    //   id: _id,
    //   ...rest,
    // }));

    const formattedPlayers = finalPlayers
  .filter(player => player.credit !== undefined && player.credit !== null)  // Filter out players without 'credit'
  .map(({ _id, ...rest }) => ({
    id: _id,
    ...rest,
  }));

  console.log("playerCredits", formattedPlayers);

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
      //   console.log("reached here after response...",)
      //   navigate(`admin/booking/checkout/${id}`)
      // }
    } catch (error) {
      console.error("Error processing offline payment:", error);
    }
  };

  const handleSelectLooserPlayer = (player) => {
    setLooserPlayer(player);
  };

  console.log("custom slot", booking?.custom_slot)

  const renderCreditsPopover = (
    <Popover id="player-credits-popover">
      <Popover.Header as="h3">Player Credits</Popover.Header>
      <Popover.Body>
        {booking?.playerCredits?.length > 0 ? (
          <ul className="mb-0 ps-3">
            {booking.playerCredits.map((player, index) => (
              <li key={index}>
                {player.name || player.id}: ₹ {player.credit || player.amount}
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
      border: 'none',
      borderRadius: '16px',
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
        {/* <div>
          <IoFastFoodOutline className="me-2 float-end fs-1 m-2" onClick={() => setShowInventory(!showInventory)}
          />
        </div> */}

      </Row>

      <Row>
        <Col md={3} className="border-0 p-0">
          <Card className="p-3">
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
              <Col>
                <FaPhone size={20} />
              </Col>
              <Col>
                <FaComment size={20} />
              </Col>
              <Col>
                <FaVideo size={20} />
              </Col>
            </Row>
          </Card>
          {booking?.booking_type === "Custom" || booking?.status !== "Pending" ? <></> : <Button
            variant="success"
            className="w-100 mt-3"
            style={{ backgroundColor: "#03D41414", color: "#00AF0F" }}
            onClick={() => navigate(`/admin/booking/edit/${booking?._id}`)}
          >
            Edit Booking
          </Button>}
        </Col>

        <Col md={9} className="d-flex flex-column gap-1 justify-content-between">
          <Row>
            <Col
              md={6}
              className={`d-flex flex-column p-0 justify-content-between transition-col`}
            >
              <Card className="p-3 h-100" style={{ marginLeft: "10px" }}>
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
              md={6}
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
                    {booking?.status !== "Pending" ? <div className="text-color fs-4">
                      Selected Items
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
                      // <div className="d-flex justify-content-between align-items-center">
                      //   <Card key={index} className="mb-2 shadow-sm fs-6" style={{ background: "#eeeaef", height: "20%", width: "100%" }}>
                      //     <div
                      //       style={{
                      //         position: "absolute",
                      //         bottom: "35px",
                      //         right: "-6px",
                      //         cursor: "pointer",
                      //         borderRadius: "80%",
                      //         padding: "3px",
                      //         zIndex: 2,
                      //       }}
                      //       onClick={() => {
                      //         const updatedProducts = selectedItems.filter((_, i) => i !== index);
                      //         setSelectedItems(updatedProducts);
                      //         const updatedSelectedIds = selectedIds.filter((id) => id !== product.id);
                      //         setSelectedIds(updatedSelectedIds);
                      //       }}
                      //     >
                      //       <AiOutlineClose size={12} color="red" />
                      //     </div>
                      //     <Card.Body className="py-1 px-3">
                      //       <div className="d-flex justify-content-between align-items-start">
                      //         <div style={{ flex: 1 }}>
                      //           <div
                      //             className="fw-semibold fs-6"
                      //             style={{
                      //               maxHeight: "20px",
                      //               overflowY: "auto",
                      //               scrollbarWidth: "none",
                      //               msOverflowStyle: "none",
                      //             }}
                      //             onWheel={(e) => e.stopPropagation()}
                      //           >
                      //             {product.item}
                      //           </div>
                      //           <div className="muted-text small mb-1">₹{product.price} each</div>
                      //         </div>

                      //         <div style={{ flex: 1 }}>
                      //           <Form.Control
                      //             type="number"
                      //             min="0"
                      //             max="999"
                      //             value={product.quantity}
                      //             size="sm"
                      //             style={{
                      //               width: "60px",
                      //               height: "28px",
                      //               fontSize: "12px",
                      //               marginLeft: "10px",
                      //               padding: "1px 3px",
                      //               border: "1px solid #ccc",
                      //             }}
                      //             placeholder="Qty"
                      //             onChange={(e) => {
                      //               let value = e.target.value;
                      //               if (value > 999) value = 999;
                      //               updateProduct(product.id, "quantity", value)
                      //             }}
                      //           />
                      //         </div>

                      //         <div className="text-end ms-3" style={{ minWidth: "120px" }}>
                      //           <div className="small">
                      //             Tax ({product?.tax?.tax_rate || 0}%):{" "}
                      //             <span className="fw-semibold">₹{product.totalTax}</span>
                      //           </div>
                      //           <div className="fw-semibold">Total: ₹{product.total}</div>
                      //         </div>
                      //       </div>
                      //     </Card.Body>
                      //   </Card>
                      // </div>
                      <div
                        key={index}
                        className="position-relative d-flex mb-3"
                        style={{ width: "100%" }}
                      >
                        {/* Trash Icon */}
                        <span
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
                        </span>

                        {/* Product Card */}
                        <div
                          className="fs-6"
                          style={{ background: "#F9F9F9", width: "90%", height: "10%" }}
                        >
                          <div className="d-flex justify-content-between align-items-center p-2">
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

                            <div style={{ flex: 2 }}>
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
                      <span
                        className="float-end text-white px-2 py-1 rounded"
                        style={{ cursor: "pointer", background: `${isItemsSaved ? "grey" : "green"}` }}
                        onClick={handleSaveItems}
                      >
                        {isItemsSaved ? "Saved" : "Save"}
                      </span>
                    }
                  </div>
                </div>
              </Card>
            </Col>

          </Row>
          {selectedGame?.type === "Multiplayer" && selectedGame?.payLater || selectedGame?.type === "Single" && selectedGame?.payLater ?
            booking?.status === "Paid" ?
              <div className="bg-white rounded shadow-sm w-100">
                <Row className="mt-3">
                  <Col md={4}>
                    <Button variant="outline-success " className="d-flex align-items-center gap-2" style={{ border: "none" }}
                      onClick={handleStopTimer}>
                      <FaRegClock size={30} />
                      <span className="fw-bold fs-1">{Math.floor(booking?.total_time / 60)} m</span>:
                      <span className="text-secondary fs-1">{booking?.total_time % 60} s</span>
                    </Button>
                  </Col>

                  <Col md={3} className="p-0">
                    <div className="">
                      <p className="mb-0 text-color">
                        Start Time:
                        <span className="ms-2 muted-text">{booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : "-"}</span>
                      </p>
                      <p className="mb-0 text-color">
                        End Time:
                        <span className="ms-2 muted-text"> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}</span>
                      </p>
                    </div>
                  </Col>

                  <Col md={2} className="p-0">
                    <h3 className="text-color pt-2"> ₹ {priceToPay}</h3>
                  </Col>

                  <Col md={3} className="p-0">
                    Player Lost : {booking?.looserPlayer?.name || "-"}
                  </Col>

                </Row>
              </div>
              : (
                selectedGame?.payLater &&
                <div className="p-2 bg-white rounded shadow-sm w-100">
                  <Row>
                    <Col md={10} >
                      <Button variant="outline-success " className="d-flex align-items-center gap-2" style={{ border: "none" }}
                        onClick={handleStopTimer}>
                        <FaRegClock size={30} />
                        <span className="fw-bold fs-1">{Math.floor(currentTime / 60)} m</span>:
                        <span className="text-secondary fs-1">{currentTime % 60} s</span>
                      </Button>
                    </Col>
                    <Col md={2} className="p-0 mt-3">
                      <h3 className="fw-bold mx-6"> ₹ {priceToPay}</h3>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      {isRunning || isPaused ? (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          style={{ border: "2px dashed rgb(255, 68, 0)", width: "80%", marginLeft: "10px" }}
                          onClick={() => setShowConfirm(true)} // Show confirmation modal
                        >
                          Stop Timer
                        </Button>
                      ) : (
                        !isPaused &&
                        <Button
                          size="sm"
                          variant="outline-primary"
                          disabled={booking?.total_time > 0 && booking?.timer_status === "Stopped"}
                          style={{ border: "2px dashed", width: "70%", padding: "8px", marginLeft: "10px" }}
                          onClick={handleStartTimer}
                        >
                          <FaClock size={16} className="mx-2" />
                          <span>Start Game Time</span>
                        </Button>
                      )}
                    </Col>

                    <Col md={1} className="p-0">
                      {
                        !isRunning ? (
                          <VscDebugContinue
                            size={25}
                            className="text-success mt-2"
                            style={{ marginLeft: "5%", cursor: "pointer" }}
                            onClick={handleResumeTimer}
                          />
                        ) : (
                          <FaPause
                            size={25}
                            className="text-danger mt-2"
                            style={{ marginLeft: "5%", cursor: "pointer" }}
                            onClick={handlePauseTimer}
                          />
                        )
                      }

                      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Confirm Stop Timer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to stop the timer?</Modal.Body>
                        <Modal.Footer>
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
                          <Modal.Title>Confirm Offline Payment</Modal.Title>
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
                    </Col>

                    <Col md={4} className="p-0">
                      <div className="ms-3">
                        <p className="mb-0 muted-text">
                          <strong>Start Time:</strong> {booking?.start_time ? new Date(booking?.start_time).toLocaleTimeString() : "-"}
                        </p>
                        <p className="mb-0 muted-text">
                          <strong>End Time:</strong> {booking?.end_time ? new Date(booking?.end_time).toLocaleTimeString() : "-"}
                        </p>
                      </div>
                    </Col>
                    <Col md={3}>

                      {looserPlayer && (
                        <div style={{ width: "100%" }}>
                          <span className="fw-bold">Looser: </span>
                          {looserPlayer.name}
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
                    </Col>
                  </Row>
                </div>
              )
            :
            <></>
          }

          {booking?.status === "Pending" ?
            <Card className="p-3 rounded-3">
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
                  <p className="text-color">Adjustment </p>
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

                {/* <Col md={6}>
                  <span>Tax ₹{totals.taxAmount.toFixed(2)}</span>
                  
                </Col>
                <Col md={6}>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-primary">
                      {totals.selectedTaxes.length ?
                        `${totals.selectedTaxes.reduce((sum, tax) => sum + tax.rate, 0)}%` :
                        '0.00% Tax'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {taxFields.map(tax => (
                        <Dropdown.Item key={tax._id} as="div">
                          <Form.Check
                            type="checkbox"
                            id={`tax-${tax._id}`}
                            label={`${tax.tax_name} (${tax.tax_rate}%)`}
                            checked={totals.selectedTaxes.some(t => t.id === tax._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTotals(prev => ({
                                  ...prev,
                                  selectedTaxes: [...prev.selectedTaxes, { id: tax._id, rate: tax.tax_rate }]
                                }));
                              } else {
                                setTotals(prev => ({
                                  ...prev,
                                  selectedTaxes: prev.selectedTaxes.filter(t => t.id !== tax._id)
                                }));
                              }
                            }}
                          />
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col> */}
              </Row>

              {/* <Row className="mb-2">
                <Col xs={6}>
                  <p className="muted-text">Payable Amount</p>
                </Col>
                <Col xs={6}>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={payableAmount}
                  // onChange={handlePayableAmountChange}
                  />
                </Col>
              </Row> */}

              {/* <Row className="mb-2">
                <Col xs={6}>
                  <p className="muted-text">Credit Amount</p>
                </Col>
                <Col xs={6}>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Input Credit Amount"
                    readOnly
                    value={creditAmount}
                  />
                </Col>
              </Row> */}

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
                <Col md={3} xs={6}>
                  <Button variant="primary btn btn-sm"
                    xs={12}
                    className="w-100 mt-3"
                    disabled={!booking?.timer_status === "Stopped"}
                    onClick={() => {
                      if (!isItemsSaved) {
                        alert("Please save the added items before proceeding with payment.");
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
            </Card>
            :
            <Card className="p-3 rounded-3 h-100">
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

              <Row className="mt-1">
                <Col xs={6} className="text-color fw-semibold">Amount Paid</Col>
                <Col xs={6} className="muted-text">₹ {booking?.paid_amount > 0 ? booking?.paid_amount : 0}</Col>
              </Row>

              <Row className="mt-1">
                <Col xs={6} className="text-color fw-semibold">Adjustment</Col>
                <Col xs={6} className="muted-text">₹ {booking?.adjustment || 0}</Col>
              </Row>

              <Row className="mt-2">
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


              <Row className="mt-2">
                <Col xs={6} className="text-color fw-semibold">Transaction ID</Col>
                <Col xs={6} className="muted-text">{booking?.transaction?.razorpay_payment_id || "Cash"}</Col>
              </Row>

              <Row className="mt-2">
                <Col xs={6} className="text-color fw-semibold">Date/Time</Col>
                <Col xs={6} className="muted-text">
                  {booking?.mode === "Online" ? formatDateAndTime(booking?.transaction?.createdAt) : formatDateAndTime(booking?.createdAt)}
                </Col>
              </Row>
            </Card>
          }
        </Col>

      </Row>
    </Container>
  );
};

export default BookingCheckout;
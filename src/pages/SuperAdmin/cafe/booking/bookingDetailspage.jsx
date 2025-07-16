import { Badge, Breadcrumb, Button, Card, Col, Container, Image, ListGroup, OverlayTrigger, Popover, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png'
import { useEffect, useState } from "react";
import { getBookingDetails } from "../../../../store/AdminSlice/BookingSlice";
import profile from "/assets/profile/user_avatar.png";
import amounImage from "/assets/superAdmin/booking/Amount.png";
import { convertTo12Hour, formatDate, formatDateAndTime } from "../../../../components/utils/utils";
import Loader from "../../../../components/common/Loader/Loader";
import { Tooltip } from "chart.js";
import call from "/assets/superAdmin/cafe/call (2).png";
import Notification from "/assets/superAdmin/cafe/notification.png";
import timedisply from "/assets/superAdmin/booking/timedisply.png";
import looserIcon from "/assets/superAdmin/booking/looserIcon.png"
import Message from "/assets/superAdmin/cafe/message.png";


const BookingDetailsPage = () => {
  const location = useLocation();
  const bookingID = location.state.bookingID;
  const baseURL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(<Loader />)
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    dispatch(getBookingDetails(bookingID)).finally(() => setLoading(false));
  }, []);

  const selectedBooking = useSelector((state) => state.bookings);

  const cafeId = selectedBooking.booking?.cafe;

  const items = selectedBooking.booking?.so_id?.items || [];

  const isoTime = selectedBooking.booking?.start_time;
  const date = new Date(isoTime);

  // Convert to local time and format it
  const StartTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const isoTime1 = selectedBooking.booking?.end_time;
  const date1 = new Date(isoTime1);

  // Convert to local time and format it
  const EndTime = date1.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const renderCreditsPopover = (
    <Popover id="player-credits-popover">
      <Popover.Header as="h3">Player Credits</Popover.Header>
      <Popover.Body>
        {selectedBooking?.booking?.playerCredits?.length > 0 ? (
          <ul className="mb-0 ps-3">
            {selectedBooking?.booking?.playerCredits.map((player, index) => (
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

  if (loading || !selectedBooking) {
    return (
      <div className="text-center " style={{ marginTop: "200px" }}>
        <Loader />
      </div>
    );
  }


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
                    state={{ cafeId: cafeId }}
                  >
                    Bookings
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Booking Details</Breadcrumb.Item>

              </Breadcrumb>

            </Col>
          </Row>

          <Row>

            {/* profile {/* profile picture and details */}
            <Col sm={4} xs={12}>
              <Card className="rounded-4 my-3 h-100">
                <Row>
                  <Col sm={12}>
                    <div className="d-flex flex-column align-items-start mx-3 my-3 "

                    >
                      <Image src={`${baseURL}/${selectedBooking.booking?.game_id?.gameImage}` || Rectangle389}
                        onError={(e) => (e.target.src = Rectangle389)}
                        alt="Cafe Image" className="mb-3 rounded-4" style={{ width: "100%", objectFit: "cover" }} />
                    </div>

                    <div className="mx-2 d-flex flex-row align-items-center" style={{ width: 'fit-content' }}>
                      <Image
                        src={profile}
                        roundedCircle
                        width="62"
                        height="62"
                        alt="Profile"
                      />
                      <div className="ms-3">
                        <h4 style={{ fontSize: '16px', color: '#333333', fontWeight: 600 }}>Rohan Rathore</h4>
                        <div style={{ fontSize: '14px', color: '#666666', fontWeight: 400 }}>
                          Booking ID : <span style={{ fontWeight: 500 }}>147GA4786</span>
                        </div>
                      </div>
                    </div>

                    <Row className="mx-2 my-3 d-flex justify-content-between flex-wrap border-top ">


                      <Col sm={6} xs={6} className="mb-2 mt-4">
                        <h1 className="text-start" style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                          Full Name :
                        </h1>
                      </Col>
                      <Col sm={6} xs={6} className="mb-2 mt-4">
                        <p className="text-end" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#666666" }}>
                          {selectedBooking?.booking?.customer_id?.name || '---'}
                        </p>
                      </Col>
                      <Col sm={6} xs={4} className="my-2 ">
                        <h1 className="text-start" style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                          Email :
                        </h1>
                      </Col>
                      <Col sm={6} xs={8} className="my-2 ">
                        <p className="text-end" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", color: "#666666", letterSpacing: "0%" }}>
                          {selectedBooking?.booking?.customer_id?.email || '---'}
                        </p>
                      </Col>
                      <Col sm={6} xs={4} className="my-2 ">
                        <h1 className="text-start" style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                          Phone Number :
                        </h1>
                      </Col>
                      <Col sm={6} xs={8} className="my-2 ">
                        <p className="text-end" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#666666" }}>
                          {selectedBooking?.booking?.customer_id?.contact_no || '---'}
                        </p>
                      </Col>
                      <Col sm={6} xs={4} className="my-2 ">
                        <h1 className="text-start" style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                          Payment Status :
                        </h1>
                      </Col>
                      <Col sm={6} xs={8} className="my-2 ">
                        <p className="text-end" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#666666" }}>
                          {selectedBooking?.booking?.customer_id?.contact_no || '---'}
                        </p>
                      </Col>
                      <Col sm={6} xs={4} className="my-2 ">
                        <h1 className="text-start" style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                          Credit :
                        </h1>
                      </Col>
                      <Col sm={6} xs={8} className="my-2 ">
                        <p className="text-end" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#666666" }}>
                          ₹ {selectedBooking?.booking?.customer_id?.creditLimit - selectedBooking?.booking?.customer_id?.creditAmount || '---'}
                        </p>
                      </Col>
                      <Col sm={6} xs={4} className="my-2 ">
                        <h1 className="text-start" style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                          Location :
                        </h1>
                      </Col>
                      <Col sm={6} xs={8} className="my-2 ">
                        <p className="text-end" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#666666" }}>
                          {selectedBooking?.booking?.customer_id?.address || '---'}
                        </p>
                      </Col>
                      {/* Played Games: */}
                      <Col sm={6} xs={4} className="my-2 ">
                        <h1 className="text-start" style={{ fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                          Played Games:
                        </h1>
                      </Col>
                      <Col sm={6} xs={8} className="my-2 ">
                        <p className="text-end" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#666666" }}>
                          {selectedBooking?.booking?.totalGamesPlayed || '---'}
                        </p>
                      </Col>

                      <Col sm={12} xs={12} className="my-4 "></Col>
                    </Row>

                  </Col>
                </Row>

              </Card>

              {/* <Card className="rounded-4 my-3">
                <Row className="justify-content-center align-items-center text-center my-3 " >
                  <Col xs="2" sm={4} className="my-1">
                    <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                      <Image src={call} alt="CafeCall" className="mx-1 my-2 " style={{ objectFit: "cover", width: "19.65px", height: "19.65px" }} />
                    </Button>

                  </Col>
                  <Col xs="2" sm={4} className="my-1">
                    <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                      <Image src={Notification} alt="CafeCall" className="mx-1 my-2 " style={{ objectFit: "cover", width: "19.65px", height: "19.65px" }} />
                    </Button>

                  </Col>
                  <Col xs="2" sm={4} className="my-1">
                    <Button className=" rounded-circle border-0" style={{ backgroundColor: "#F2F2F2" }} >
                      <Image src={Message} alt="CafeCall" className="mx-0 my-2 " style={{ objectFit: "cover", width: "23.63px", height: "18.38px" }} />
                    </Button>

                  </Col>


                </Row>
              </Card> */}



            </Col>

            <Col sm={8} xs={12}
            // className="my-2"
            >
              <Card className="rounded-4 my-3">
                {/* Booking Details */}
                <Row>
                  <Col sm={12} xs={12} className="my-2">
                    <div className="mx-3 my-2 d-flex justify-content-between align-items-center">
                      <h4 className="mb-0" style={{ fontWeight: 600, fontSize: "21px" }}>
                        Booking Details
                      </h4>
                      <h4
                        className="mb-0 px-3 py-2 rounded-1"
                        style={{
                          fontWeight: 500,
                          backgroundColor: "#F8F8F8",
                          color: "#0062FF",
                          fontSize: "16px",
                        }}
                      >
                        Amount : ₹{" "}
                        {selectedBooking?.booking?.slot_id?.slot_price
                          ? selectedBooking.booking.slot_id.slot_price
                          : selectedBooking.booking?.game_id?.price}
                      </h4>
                    </div>

                    <Row className="mx-1 " style={{ marginTop: "20px", marginBottom: "20px" }}>
                      <Col xs={4} sm={4} className=" my-2">
                        <h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333333" }}>Selected Game :</h4>
                      </Col>
                      <Col xs={8} sm={8} className="d-flex align-items-center gap-3 my-1 ">
                        {/* <div className="d-flex align-items-center gap-3 "> */}
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: "#0062FF", letterSpacing: '1px', marginBottom: 0 }}>
                          {selectedBooking?.booking?.game_id?.name}
                        </h4>
                        <h4 className="p-2 rounded-1" style={{ fontSize: '16px', fontWeight: '500', color: "#00Af0F", marginBottom: 0, backgroundColor: "rgba(21, 255, 0, 0.16)" }}>

                          {selectedBooking?.booking?.game_id?.type}
                        </h4>
                        {/* </div> */}
                      </Col>
                      <Col xs={4} sm={4} className="my-1">
                        <h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333333" }}>No. of Candidates :</h4>
                      </Col>
                      <Col xs={8} sm={8} className="my-1">
                        <h4 style={{ fontSize: '14px', fontWeight: '500', color: "#666", letterSpacing: '1px' }}>{selectedBooking?.booking?.players?.length + 1}</h4>
                      </Col>
                      <Col xs={4} sm={4} className="my-1">
                        <h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333333" }}>Time Slot :</h4>
                      </Col>
                      <Col xs={8} sm={8} className="my-1">
                        <h4 style={{ fontSize: '14px', fontWeight: '500', color: "#666", letterSpacing: '1px' }}>
                          {selectedBooking?.booking?.slot_id?.start_time && selectedBooking?.booking?.slot_id?.end_time ? (
                            <>
                              {convertTo12Hour(selectedBooking.booking.slot_id.start_time)} - {convertTo12Hour(selectedBooking.booking.slot_id.end_time)}
                            </>
                          ) : (
                            'Time not available'
                          )}
                        </h4>

                      </Col>
                      <Col xs={4} sm={4} className="my-1">
                        <h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333333" }}>Day/Date :</h4>
                      </Col>
                      <Col xs={8} sm={8} className="my-1">
                        <h4 style={{ fontSize: '14px', fontWeight: '500', color: "#666", letterSpacing: '1px' }}>{formatDate(selectedBooking?.booking?.slot_id?.createdAt)}</h4>
                      </Col>
                      <Col xs={4} sm={4} className="my-1">
                        <h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333333" }}>Booking ID :</h4>
                      </Col>
                      <Col xs={8} sm={8} className="my-1 ">
                        <h4 className="" style={{ fontSize: '14px', fontWeight: '500', letterSpacing: '1px', color: "#666" }}>{selectedBooking?.booking?.booking_id}</h4>
                      </Col>
                    </Row>

                  </Col>
                </Row>
              </Card>

              <Card className="rounded-4 my-3">
                {/* Booking Details */}
                <Row>
                  <Col sm={12} xs={12} className="my-2">
                    <div className="mx-3 my-2 d-flex justify-content-between align-items-center">
                      <h4 className="mb-0" style={{ fontWeight: 600, fontSize: "21px" }}>
                        Selected Items
                      </h4>
                      <h4
                        className="mb-0 px-3 py-2 rounded-1"
                        style={{
                          fontWeight: 500,
                          backgroundColor: "#F8F8F8",
                          color: "#0062FF",
                          fontSize: "16px",
                        }}
                      >
                        Total : ₹{" "}
                        {items?.reduce((acc, item) => acc + (item?.total || 0), 0)}
                      </h4>
                    </div>

                    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                      {items && items.length > 0 ? (
                        items.map((item, index) => (
                          <Row
                            key={index}
                            className="mx-3 my-2 align-items-center"
                            style={{
                              backgroundColor: '#F9F9F9',
                              color: '#333333',
                              padding: '10px',
                              borderRadius: '10px',
                            }}
                          >
                            <Col sm={4} xs={4} className="my-1">
                              <div>
                                <div className="mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#333333' }}>
                                  {item.item}
                                </div>
                                <div style={{ color: '#666', fontSize: '14px', fontWeight: '400' }}>
                                  ₹ <span>{item.price || '---'}</span> / Each
                                </div>
                              </div>
                            </Col>

                            <Col sm={4} xs={4} className="my-1 text-center">
                              <div style={{ fontSize: '16px', fontWeight: '600' }}>QTY: {item?.quantity || 0}</div>
                            </Col>

                            <Col sm={4} xs={4} className="my-1 text-end">
                              <div className="mb-1" style={{ fontSize: '14px', fontWeight: '500' }}>
                                Tax ({item?.tax?.tax_rate || 0}%):
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#0062FF' }}>
                                Total: ₹ {item.total || '0'}
                              </div>
                            </Col>
                          </Row>
                        ))
                      ) : (
                        <p className="text-center " style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                          No items available.
                        </p>
                      )}
                    </div>


                  </Col>
                </Row>
              </Card>


              <Row>
                <Col xs={12} sm={6} >
                  <Card className="rounded-4 ">
                    <Row className="mx-0 my-3 align-items-center">
                      {/* Clock icon */}
                      <Col xs={3} className="d-flex justify-content-center">
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{
                            backgroundColor: "rgba(211, 112, 226, 0.16)",
                            color: "#0062FF",
                            padding: "20px",
                            borderRadius: "23px",
                          }}
                        >
                          <Image src={timedisply} className="px-1" />
                        </div>
                      </Col>

                      {/* Time Info */}
                      <Col xs={9}>
                        <Row className="align-items-center">
                          {/* Start */}
                          <Col xs={5} className="text-start">
                            <div style={{ fontSize: '14px', color: '#666666', fontWeight: '400' }}>Start</div>
                            <div style={{ fontSize: '16px', color: '#333333', fontWeight: '600' }}>{StartTime}</div>
                          </Col>

                          {/* Divider */}
                          <Col xs={2} className="d-flex justify-content-center">
                            <div style={{ borderLeft: '1px solid #ccc', height: '40px' }}></div>
                          </Col>

                          {/* End */}
                          <Col xs={5} className="text-start">
                            <div style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>End</div>
                            <div style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>{EndTime}</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>


                  </Card>

                </Col>
                <Col xs={12} sm={6} >
                  <Card className="rounded-4 ">
                    <Row className="mx-0 my-3 align-items-center">
                      {/* Clock icon */}
                      <Col xs={3} className="d-flex justify-content-center">
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{
                            backgroundColor: "rgba(228, 90, 132, 0.16)",
                            color: "#0062FF",
                            padding: "20px",
                            borderRadius: "23px",
                          }}
                        >
                          <Image src={looserIcon} className="px-1" />
                        </div>
                      </Col>

                      {/* Time Info */}
                      <Col xs={9}>
                        <div style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>Looser</div>
                        <div style={{ fontSize: '16px', color: '#666', fontWeight: '600' }}>
                          {selectedPlayer ? (
                            <>
                              <h5>{selectedPlayer.fullName || '---'}</h5>
                              <p>{selectedPlayer.info || 'No additional information available'}</p>
                            </>
                          ) : (
                            '---'
                          )}
                        </div>
                      </Col>
                    </Row>


                  </Card>

                </Col>
              </Row>


              <Card className="rounded-4 my-3 ">

                <Col xs={12} sm={12} >
                  <div className="mx-4 my-4 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0" style={{ fontWeight: 600, fontSize: "21px" }}>
                      Payment Details
                    </h4>

                  </div>


                  <Row className="mb-3 mx-3 ">
                    <Col xs={5}>

                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: "#0062FF" }}>
                        {selectedBooking?.booking?.game_id?.name} ({selectedBooking?.booking?.game_id?.size})
                      </h4>
                    </Col>
                    <Col xs={7} >
                      <h4 style={{ fontSize: '16px', fontWeight: '400', color: "#666", letterSpacing: '1px' }}>
                        {selectedBooking?.booking?.playerCredits.length} Players
                      </h4>
                    </Col>
                    {/* <Col className="text-end fw-bold">₹ {selectedBooking?.booking?.total} Total</Col> */}
                  </Row>

                  <Row className="mb-3 mx-3 ">


                    <Col xs={5} ><h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333" }}>Booking Mode</h4></Col>
                    <Col xs={7}>
                      <span
                        className="d-flex align-items-center text-center "
                        style={{
                          backgroundColor:
                            selectedBooking?.booking?.mode === "Online"
                              ? "#03D41414"
                              : "#FF00000D",
                          borderRadius: "20px",
                          fontSize: "12px",
                          padding: "5px 10px",
                          marginLeft: "-10px",
                          width: "100px",

                          color:
                            selectedBooking?.booking?.mode === "Online" ? "#00AF0F" : "orange",
                        }}
                      >
                        <div className="text-center"
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor:
                              selectedBooking?.booking?.mode === "Online"
                                ? "#03D414"
                                : "orange",
                            marginRight: "5px",
                          }}
                        />
                        {selectedBooking?.booking?.mode}
                      </span>
                    </Col>
                  </Row>

                  <Row className="mb-3 mx-3 ">
                    <Col xs={5}><h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333" }}>Amount Paid</h4></Col>
                    <Col xs={7}>
                      <h4 style={{ fontSize: '16px', fontWeight: '400', color: "#666", letterSpacing: '1px' }}>₹ {selectedBooking?.booking?.paid_amount}</h4>
                    </Col>
                  </Row>

                  <Row className="mb-3 mx-3 ">
                    <Col xs={5}><h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333" }}>Adjustment</h4></Col>
                    <Col xs={7}>

                      <h4 style={{ fontSize: '16px', fontWeight: '400', color: "#666", letterSpacing: '1px' }}>₹ {selectedBooking?.booking?.adjustment || 0}</h4>
                    </Col>
                  </Row>

                  <Row className="mb-3 mx-3 ">
                    <Col xs={5}><h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333" }}>Credit Amount</h4></Col>
                    <Col xs={7}><h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>
                      {/* ₹ {selectedBooking?.booking?.total - selectedBooking?.booking?.paid_amount} */}
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="right"
                        overlay={renderCreditsPopover}
                        style={{ cursor: 'pointer' }}
                      >
                        <span style={{ cursor: 'pointer', fontSize: '16px', fontWeight: '400', color: "#666", letterSpacing: '1px' }}>
                          ₹ {selectedBooking?.booking?.total - selectedBooking?.booking?.paid_amount}
                        </span>
                      </OverlayTrigger>
                    </h4>
                    </Col>
                  </Row>

                  <Row className="mb-3 mx-3 ">
                    <Col xs={5}><h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333" }}>Transaction ID</h4></Col>
                    <Col xs={7}>
                      <h4 style={{ fontSize: '16px', fontWeight: '400', color: "#666", letterSpacing: '1px' }}>
                        {selectedBooking?.booking?.transaction?.razorpay_payment_id || "-"}
                      </h4></Col>
                  </Row>

                  <Row className="mb-3 mx-3 ">
                    <Col xs={5}><h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333" }}>Date/Time</h4></Col>
                    <Col xs={7}>
                      <h4 style={{ fontSize: '16px', fontWeight: '400', color: "#666", letterSpacing: '1px' }}>
                        {selectedBooking?.booking?.mode === "Online" ? formatDateAndTime(selectedBooking?.booking?.transaction?.createdAt) : formatDateAndTime(selectedBooking?.booking?.createdAt)}
                      </h4>
                    </Col>
                  </Row>

                  <Row className="mb-3 mx-3 align-items-center border-top">
                    <Col xs={4} className="mt-4">
                      <h4 style={{ fontSize: '16px', fontWeight: '500', color: "#333" }}>TOTAL</h4 >
                    </Col>
                    <Col xs={5} className="text-end mt-4">
                      <Badge
                        pill
                        bg=""
                        style={{
                          backgroundColor: '#e6f9ec', // Light green background
                          color: '#00AF0F',
                          padding: '10px 20px',
                          fontSize: '16px',
                          fontWeight: '500',
                        }}
                      >
                        Amount Paid
                      </Badge>
                    </Col>
                    <Col xs={3} className="text-start mt-4">
                      <h4 className="my-4" style={{ fontSize: '16px', fontWeight: '600', color: "#333333", letterSpacing: '1px' }}>₹ {selectedBooking?.booking?.total}</h4>
                    </Col>
                  </Row>



                </Col>

              </Card>



            </Col>



          </Row>



        </Card.Header>
      </Row>
    </Container>
  );
}

export default BookingDetailsPage;
import { Badge, Breadcrumb, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png'
import { useEffect, useState } from "react";
import { getBookingDetails } from "../../../../store/AdminSlice/BookingSlice";
import profile from "/assets/profile/user_avatar.jpg";
import amounImage from "/assets/superAdmin/booking/Amount.png";
import { convertTo12Hour, formatDate, formatDateAndTime } from "../../../../components/utils/utils";
import Loader from "../../../../components/common/Loader/Loader";

const BookingDetailsPage = () => {
  const location = useLocation();
  const bookingID = location.state.bookingID;
  const baseURL = import.meta.env.VITE_API_URL;
  const [loading ,setLoading] = useState(<Loader/>)
  console.log(bookingID);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    dispatch(getBookingDetails(bookingID)).finally(() => setLoading(false));
  }, []);

  const selectedBooking = useSelector((state) => state.bookings);

  console.log("selected booking detalis page ==00", selectedBooking);
   const cafeId = selectedBooking.booking?.cafe;

  const items = selectedBooking.booking?.so_id?.items || [];
  console.log("Item", items);

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
            <Col sm={4} className="pe-1 mb-4">
              <Card className="py-3 mx-2 rounded-4 my-3 h-100" style={{ backgroundColor: "white" }}>

                <div className="d-flex flex-column align-items-start mx-3 ">
                  {/* src={`${baseURL}/${img}`} */}
                  <Image src={`${baseURL}/${selectedBooking.booking?.game_id?.gameImage}` || Rectangle389}
                    onError={(e) => (e.target.src = Rectangle389)}
                    alt="Cafe Image" className="mb-3 rounded-3" style={{ width: "100%", objectFit: "cover" }} />
                </div>
                <div className="d-flex align-items-start mx-3 mb-2">
                  <Image
                    src={profile}
                    alt="Profile"
                    className="me-3"
                    style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "50%" }}
                  />

                  <div className="my-2">
                    <h5
                      className="mb-0"
                      style={{
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#333333"
                      }}
                    >
                      {selectedBooking?.booking?.customer_id?.name || '---'}
                    </h5>
                    <div className="text-start" style={{ fontSize: "14px", color: "#555", fontWeight: 300 }}>
                      Booking ID : {selectedBooking?.booking?.booking_id || '---'}
                    </div>
                  </div>
                </div>



                <Row className="mx-2 d-flex justify-content-between flex-wrap">


                  <Col sm={4} xs={4} className="my-2 ">
                    <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      Full Name :
                    </h1>
                  </Col>
                  <Col sm={8} xs={8} className="my-2 ">
                    <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      {selectedBooking?.booking?.customer_id?.name || '---'}
                    </p>
                  </Col>
                  <Col sm={4} xs={4} className="my-2 ">
                    <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      Email :
                    </h1>
                  </Col>
                  <Col sm={8} xs={8} className="my-2 ">
                    <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      {selectedBooking?.booking?.customer_id?.email || '---'}
                    </p>
                  </Col>
                  <Col sm={4} xs={4} className="my-2 ">
                    <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      Phone Number :
                    </h1>
                  </Col>
                  <Col sm={8} xs={8} className="my-2 ">
                    <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      {selectedBooking?.booking?.customer_id?.contact_no || '---'}
                    </p>
                  </Col>
                  <Col sm={4} xs={4} className="my-2 ">
                    <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      Payment Status :
                    </h1>
                  </Col>
                  <Col sm={8} xs={8} className="my-2 ">
                    <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      {selectedBooking?.booking?.customer_id?.contact_no || '---'}
                    </p>
                  </Col>
                  <Col sm={4} xs={4} className="my-2 ">
                    <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      Credit :
                    </h1>
                  </Col>
                  <Col sm={8} xs={8} className="my-2 ">
                    <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                    ₹ {selectedBooking?.booking?.customer_id?.creditLimit - selectedBooking?.booking?.customer_id?.creditAmount || '---'}
                    </p>
                  </Col>
                  <Col sm={4} xs={4} className="my-2 ">
                    <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      Location :
                    </h1>
                  </Col>
                  <Col sm={8} xs={8} className="my-2 ">
                    <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      {selectedBooking?.booking?.customer_id?.address || '---'}
                    </p>
                  </Col>
                  {/* Played Games: */}
                  <Col sm={4} xs={4} className="my-2 ">
                    <h1 className="text-start" style={{ fontWeight: 600, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      Played Games:
                    </h1>
                  </Col>
                  <Col sm={8} xs={8} className="my-2 ">
                    <p className="text-start" style={{ fontWeight: 400, fontSize: "16px", lineHeight: "100%", letterSpacing: "0%" }}>
                      {selectedBooking?.booking?.totalGamesPlayed || '---'}
                    </p>
                  </Col>







                </Row>






                {/* <Row className="justify-content-center align-items-center text-center " style={{ marginTop: "110px", marginBottom: "20px" }}>
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
                
                              <Col sm={12} className="d-flex justify-content-center mt-3 ">
                                <h4 className="text-center " style={{ fontSize: "16px", fontWeight: "500", color: "#0062FF", cursor: "pointer" }}
                                  onClick={() => setShowModalForwordPassword(true)}
                                >Reset Password ?
                                </h4>
                              </Col >
                            </Row> */}


              </Card>
            </Col>

            <Col sm={8}>
              <Row>
                <Col sm={6} >
                  <Card className="py-3 mx-2 rounded-4 my-3 " style={{ backgroundColor: "white", height: '400px', maxHeight: '900px', overflowY: 'auto' }}>
                    <div className="mx-3 d-flex justify-content-between">
                      <h4 className="text-start my-2" style={{ fontWeight: 600 }}>Booking Details</h4>
                      <h4 className="text-end p-2 rounded-pill" style={{ fontWeight: 400, backgroundColor: "rgba(21, 255, 0, 0.21)", color: "green", fontSize: "12px" }}>
                        <Image src={amounImage} /> ₹
                        {selectedBooking?.booking?.slot_id?.slot_price ? selectedBooking?.booking?.slot_id?.slot_price : selectedBooking?.booking?.game_id?.price}/Hr
                      </h4>
                    </div>

                    <Row className="mx-1 " style={{ marginTop: "20px", marginBottom: "20px" }}>
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px' }}>Selected Game :</h4>
                      </Col>
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>{selectedBooking?.booking?.game_id?.name}</h4>
                      </Col>
                      {/* No. of Candidates */}
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px' }}>No. of Candidates :</h4>
                      </Col>
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>{selectedBooking?.booking?.players?.length + 1}</h4>
                      </Col>
                      {/* Time Slot */}
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px' }}>Time Slot :</h4>
                      </Col>
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>
                          {selectedBooking?.booking?.slot_id?.start_time && selectedBooking?.booking?.slot_id?.end_time ? (
                            <>
                              {convertTo12Hour(selectedBooking.booking.slot_id.start_time)} - {convertTo12Hour(selectedBooking.booking.slot_id.end_time)}
                            </>
                          ) : (
                            'Time not available'
                          )}
                        </h4>

                      </Col>
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px' }}>Day/Date :</h4>
                      </Col>
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>{formatDate(selectedBooking?.booking?.slot_id?.createdAt)}</h4>
                      </Col>
                      <Col xs="6" sm="6" className="my-1">
                        <h4 style={{ fontSize: '14px' }}>Booking ID :</h4>
                      </Col>
                      <Col xs="6" sm="6" className="my-1 ">
                        <h4 className="text-primary" style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>{selectedBooking?.booking?.booking_id}</h4>
                      </Col>
                    </Row>

                  </Card>

                </Col>


                <Col sm={6} >
                  <Card className="py-3  rounded-4 my-3 " style={{ backgroundColor: "white", height: '400px', maxHeight: '900px', overflowY: 'auto' }}>
                    <div className="mx-3 d-flex justify-content-between mb-2">
                      <h4 className="text-start my-2" style={{ fontWeight: 600 }}>Selected Items</h4>
                      <h4 className="text-end p-2 rounded-pill" style={{ fontWeight: 400 }}>
                        Items ({items.length})
                      </h4>
                    </div>

                    {items?.map((item, index) => (
                      <Row
                        key={index}
                        className="mx-1 my-2 align-items-center"
                        style={{
                          backgroundColor: '#F9F9F9',
                          color: '#333333',
                          padding: '10px',
                          borderRadius: '10px',
                        }}
                      >
                        <Col sm={6} xs={6} className="my-1">
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                              {item.item}
                            </div>
                            <div style={{ fontSize: '13px', color: '#888' }}>
                              ₹ <span style={{ color: '#666' }}>{item.price || '---'}</span> / Each
                            </div>
                          </div>
                        </Col>



                        <Col sm={6} xs={6} className="my-1">
                          <div style={{ fontSize: '13px' }}>Tax ({item?.tax?.tax_rate || 0} %) :</div>
                          <div style={{ fontWeight: '500', color: '#0066cc' }}>
                            Total : ₹ {item.total || '0'}
                          </div>
                        </Col>


                      </Row>
                    ))}



                  </Card>
                </Col>

                <Col sm={12}>
                <Card className="py-3 rounded-4 my-3 mx-2" style={{ backgroundColor: "white" }}>
  <Row className=" mx-3">
    <Col sm={4} className="d-flex ">
      <h4 className="mb-0" style={{ fontWeight: 500, fontSize: '14px' }}>Start Time:</h4>
      <h4 className="mb-0 text-wrap" style={{ fontSize: '14px', fontWeight: 300, color: "#666666", letterSpacing: '1px' }}>
        {StartTime}
      </h4>
    </Col>
    <Col sm={4} className="d-flex ">
      <h4 className="mb-0" style={{ fontWeight: 500, fontSize: '14px' }}>End Time:</h4>
      <h4 className="mb-0 text-wrap" style={{ fontSize: '14px', fontWeight: 300, color: "#666666", letterSpacing: '1px' }}>
        {EndTime}
      </h4>
    </Col>
  </Row>
</Card>



                </Col>

                <Col sm={12}>
                  <Card className="py-3  rounded-4 my-3 mx-2" style={{ backgroundColor: "white", overflowY: 'auto' }}>
                    <div className="mx-3 d-flex justify-content-between mb-2">
                      <h4 className="text-start my-2" style={{ fontWeight: 600 }}>Payment Details</h4>

                    </div>
                    <Row className="mb-3 mx-3 ">
                      <Col>

                        <div className="text-primary" style={{ cursor: 'pointer', fontWeight: 500 }}>
                          {selectedBooking?.booking?.game_id?.name} ({selectedBooking?.booking?.game_id?.size})
                        </div>
                      </Col>
                      <Col className="text-center fw-bold">{selectedBooking?.booking?.playerCredits.length} Players</Col>
                      <Col className="text-end fw-bold">₹ {selectedBooking?.booking?.total} Total</Col>
                    </Row>

                 

                    <Row className="mb-2 mx-3 ">
                      <Col xs={5}><h4 style={{ fontSize: '14px' }}>Payment Mode</h4></Col>
                      <Col xs={7}>
                        <span
                          className="d-flex align-items-center " 
                          style={{
                            backgroundColor:
                              selectedBooking?.booking?.mode === "Online"
                                ? "#03D41414"
                                : "#FF00000D",
                            borderRadius: "20px",
                            fontSize: "12px",
                            padding: "5px 10px",
                            marginLeft: "-10px",
                            width:"100px",
                         
                            color:
                              selectedBooking?.booking?.mode === "Online" ? "#00AF0F" : "orange",
                          }}
                        >
                          <div
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

                    <Row className="mb-2 mx-3 ">
                      <Col xs={5}><h4 style={{ fontSize: '14px' }}>Amount Paid</h4></Col>
                      <Col xs={7}>
                            <h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>₹ {selectedBooking?.booking?.paid_amount}</h4>
                      </Col>
                    </Row>

                    <Row className="mb-2 mx-3 ">
                      <Col xs={5}><h4 style={{ fontSize: '14px' }}>Adjustment</h4></Col>
                      <Col xs={7}>
                     
                      <h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>₹ {selectedBooking?.booking?.adjustment || 0}</h4>
                      </Col>
                    </Row>

                    <Row className="mb-2 mx-3 ">
                      <Col xs={5}><h4 style={{ fontSize: '14px' }}>Credit Amount</h4></Col>
                      <Col xs={7}><h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>
                        ₹ {selectedBooking?.booking?.total - selectedBooking?.booking?.paid_amount}
                        </h4>
                        </Col>
                    </Row>

                    <Row className="mb-2 mx-3 ">
                      <Col xs={5}><h4 style={{ fontSize: '14px' }}>Transaction ID</h4></Col>
                      <Col xs={7}>
                      <h4 style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>
                      {selectedBooking?.booking?.transaction?.razorpay_payment_id || "-"}
                        </h4></Col>
                    </Row>

                    <Row className="mb-2 mx-3 ">
                      <Col xs={5}><h4 style={{ fontSize: '14px' }}>Date/Time</h4></Col>
                      <Col xs={7}>
                      <h4  style={{ fontSize: '14px', fontWeight: '300', color: "#666666", letterSpacing: '1px' }}>
                      {selectedBooking?.booking?.mode === "Online" ? formatDateAndTime(selectedBooking?.booking?.transaction?.createdAt) : formatDateAndTime(selectedBooking?.booking?.createdAt)}
                      </h4>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

            </Col>






          </Row>

        </Card.Header>
      </Row>
    </Container>
  );
}

export default BookingDetailsPage;
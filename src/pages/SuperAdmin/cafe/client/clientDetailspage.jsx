import { Breadcrumb, Button, Card, Col, Container, Image, Row, Table } from "react-bootstrap";
import { BiPencil } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bgprofileImage from "/assets/superAdmin/client/bgprofileImage.png"
import userImage from "/assets/superAdmin/client/userImage.png"
import { getCustomerById } from "../../../../store/AdminSlice/CustomerSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../../../../store/AdminSlice/BookingSlice";
import { convertTo12Hour, formatDate } from "../../../../components/utils/utils";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";
import Loader from "../../../../components/common/Loader/Loader";

const ClientDetailsPage = () => {

    const location = useLocation();
    const clientId = location.state.clientID;
    console.log("client id teri vali client id click 99", clientId);
    const baseURL = import.meta.env.VITE_API_URL;
    const [currentPagebooking, setCurrentPagebooking] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 8;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loadingMain, setLoadingMain] = useState(true);

    

    useEffect(() => {
        if (clientId) {
            setLoadingMain(true);
            dispatch(getCustomerById(clientId)).finally(() => setLoadingMain(false));
        }
    }, [dispatch, clientId]);

    const clientDetails = useSelector((state) => state.customers.selectedCustomer);

    console.log("details client : - ", clientDetails);

    const cafeId = clientDetails?.data?.cafe?._id;
    console.log("cafe id in client ", cafeId);

    useEffect(() => {
        dispatch(getBookings(cafeId));
    }, [dispatch, cafeId]);
    const bookings = useSelector((state) => state.bookings.bookings);
    console.log("booking details client-- ", bookings);


    const totalPagesboking = Math.ceil(bookings.length / itemsPerPage);

    // Calculate paginated data
    // const paginatedDataBooking = bookings.slice(
    //   (currentPagebooking - 1) * itemsPerPage,
    //   currentPagebooking * itemsPerPage
    // );

    // const clientList = useSelector((state) => state.customers.customers);
    const filteredBookings = bookings.filter((booking) => {
        const searchValue = searchQuery.toLowerCase();
        return (
            booking.booking_id?.toString().toLowerCase().includes(searchValue) ||
            booking.customerName?.toLowerCase().includes(searchValue) ||
            booking.game_id?.name?.toLowerCase().includes(searchValue) ||
            booking.players?.length?.toString().toLowerCase().includes(searchValue) ||
            booking.status?.toLowerCase().includes(searchValue) ||
            booking.slot_date?.toString().toLowerCase().includes(searchValue) ||
            booking.slot_id?.start_time?.toString().toLowerCase().includes(searchValue) ||
            booking.slot_id?.end_time?.toString().toLowerCase().includes(searchValue) ||
            booking.slot_id?.duration?.toString().toLowerCase().includes(searchValue)
        );
    });

    const paginatedDataBooking = filteredBookings.slice(
        (currentPagebooking - 1) * itemsPerPage,
        currentPagebooking * itemsPerPage
    );

    const handlePrevclientBooking = () => {
        if (currentPagebooking > 1) {
            setCurrentPagebooking(currentPagebooking - 1);
        }
    };

    const handleNextclientBooking = () => {
        if (currentPagebooking < totalPagesboking) {
            setCurrentPagebooking(currentPagebooking + 1);
        }
    };

    const handleBookingClick = (bookingID) => {
        navigate(`/superadmin/Bookings/BookingDetails`, { state: { bookingID: bookingID } });

    }

    const handleClientClick = (clientID) => {
        console.log("client id teri vali client id click ", clientID);
        navigate(`/superadmin/Clients/ClientDetails`, { state: { clientID: clientID } });
    }

    if (loadingMain || !clientDetails) {
        return (
          <div className="text-center " style={{ marginTop: "200px" }}>
            <Loader />
          </div>
        );
      }

    const labelStyle = {
        fontWeight: 600,
        fontSize: '16px',
        color: '#333',
    };

    const h4Style = {
        fontWeight: 400,
        fontSize: '16px',
        color: '#666',
    };

    const h4Stylecafe = {
        fontWeight: 600,
        fontSize: '16px',
        color: '#0062FF',
    };
    return (
        <Container fluid style={{ marginTop: "0px" }}>
            <Row className=" game-detail-animate " >
                <Card.Header >
                    <Row className=" d-flex justify-content-between align-items-center  ">
                        <Col sm={8} xs={12}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>Home</Breadcrumb.Item>
                                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                                    <Link to="/superadmin/cafe/viewdetails"
                                        state={{ cafeId: cafeId }}
                                    >
                                        Clients
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Client Details</Breadcrumb.Item>

                            </Breadcrumb>

                        </Col>
                    </Row>
                    <Row>


                        <Col sm={4} xs={12} className="mb-4">
                            <Card className="rounded-4 my-3 h-100 shadow">
                                {/* Header with Background Image */}
                                <div
                                    className="rounded-4 mx-3 my-3 "
                                    style={{
                                        height: '150px',
                                        backgroundImage: `url(${bgprofileImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Profile Picture */}
                                    <Image
                                        //   src={userImage}
                                        src={`${baseURL}/${clientDetails?.data?.customerProfile || userImage}`}
                                        onError={(e) => { e.target.src = userImage }}
                                        className="shadow rounded-4"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            objectFit: 'cover',
                                            position: 'absolute',
                                            bottom: '-50px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',

                                        }}
                                    />

                                    {/* Edit Button */}
                                    {/* <Button
          variant="primary"
          className="rounded-circle p-2"
          style={{
            position: 'absolute',
            right: '15px',
            bottom: '-20px',
            zIndex: 1,
          }}
        >
          <BiPencil />
        </Button> */}
                                </div>

                                {/* Card Body */}
                                <Card.Body className="mt-5 text-center">
                                    <h4 style={labelStyle}>{clientDetails?.data?.name || '---'}</h4>
                                    <h4 style={h4Style}>{clientDetails?.data?.email || '---'}</h4>

                                    <hr />
                                    <Row>
                                        <Col xs={4} className="text-start  my-2" style={labelStyle}>Email Id :</Col>
                                        <Col xs={8} className="text-end my-2" style={h4Style}>{clientDetails?.data?.email || '---'}</Col>

                                        <Col xs={4} className="text-start  my-2" style={labelStyle}>Credit Limit :</Col>
                                        <Col xs={8} className="text-end my-2" style={h4Style}>{clientDetails?.data?.creditLimit || '---'}</Col>


                                        {/* cafe */}

                                        <Col xs={4} className="text-start  my-2" style={labelStyle}>Cafe Name :</Col>
                                        <Col xs={8} className="text-end my-2" style={h4Stylecafe}>{clientDetails?.data?.cafe?.name || '---'}</Col>


                                        <Col xs={4} className="text-start  my-2" style={labelStyle}>Gender :</Col>
                                        <Col xs={8} className="text-end my-2" style={h4Style}>{clientDetails?.data?.gender || '---'}</Col>

                                        <Col xs={5} className="text-start  my-2" style={labelStyle}>Phone Number :</Col>
                                        <Col xs={7} className="text-end my-2" style={h4Style}>{clientDetails?.data?.contact_no || '---'}</Col>

                                        <Col xs={4} className="text-start  my-2" style={labelStyle}>Location :</Col>
                                        <Col xs={8} className="text-end my-2" style={h4Style}>{clientDetails?.data?.address || '---'}</Col>

                                        <Col xs={5} className="text-start  my-2" style={labelStyle}>Department :</Col>
                                        <Col xs={7} className="text-end my-2" style={h4Style}>{clientDetails?.data?.department || '---'}</Col>

                                        <Col xs={4} className="text-start  my-2" style={labelStyle}>Credit Amount :</Col>
                                        <Col xs={8} className="text-end my-2" style={h4Style}>{clientDetails?.data?.creditAmount || '---'}</Col>

                                        {/* creditEligibility */}
                                        <Col xs={6} className="text-start  my-2" style={labelStyle}>Credit Eligibility :</Col>
                                        <Col xs={6} className="text-end my-2" style={h4Style}>{clientDetails?.data?.creditEligibility || '---'}</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col sm={8} xs={12} className="mb-4"
                        // className="my-2"
                        >
                            <Card className="rounded-4 my-3">

                                <Row>
                                    <Col sm={12} xs={12} className="my-2">
                                        <div className="mx-3 my-2 d-flex justify-content-between align-items-center">
                                            <h4 className="mb-0" style={{ fontWeight: 600, fontSize: "21px" }}>
                                                Clients Details
                                            </h4>

                                        </div>


                                        <Row className="mx-1 " style={{ marginTop: "20px", marginBottom: "20px" }}>
                                            <Col xs={4} sm={4} className=" my-1">
                                                <h4 style={labelStyle}>Address :</h4>
                                            </Col>
                                            <Col xs={8} sm={8} className="d-flex align-items-center gap-3 my-1 ">

                                                <h4 style={h4Style}>
                                                    {clientDetails?.data?.address || '---'}
                                                </h4>


                                            </Col>
                                            <Col xs={4} sm={4} className="my-1">
                                                <h4 style={labelStyle}>City :</h4>
                                            </Col>
                                            <Col xs={8} sm={8} className="my-1">
                                                <h4 style={h4Style}>
                                                    {clientDetails?.data?.city || '---'}
                                                </h4>
                                            </Col>
                                            <Col xs={4} sm={4} className="my-1">
                                                <h4 style={labelStyle}>State :</h4>
                                            </Col>
                                            <Col xs={8} sm={8} className="my-1">
                                                <h4 style={h4Style}>
                                                    {clientDetails?.data?.state || '---'}
                                                </h4>

                                            </Col>
                                            <Col xs={4} sm={4} className="my-1">
                                                <h4 style={labelStyle}>Country :</h4>
                                            </Col>
                                            <Col xs={8} sm={8} className="my-1">
                                                <h4 style={h4Style}>
                                                    {clientDetails?.data?.country || '---'}
                                                </h4>
                                            </Col>

                                        </Row>

                                    </Col>
                                </Row>
                            </Card>


                            <Card className="rounded-4 my-3">

                                <Row className="mx-2">
                                    <Col sm={12} className="my-3  alingn-items-end">
                                        <div className="mx-1 my-1 d-flex justify-content-between align-items-center">
                                            <h4 className="mb-3" style={{ fontWeight: 600, fontSize: "21px" }}>
                                                Booking List
                                            </h4>
                                            <div className="mx-1 my-2 d-flex justify-content-end">
                                                <input
                                                    type="search"
                                                    className="form-control me-2"
                                                    placeholder="Search"
                                                    aria-label="Search"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}

                                                />

                                            </div>

                                        </div>
                                        <Table hover responsive >
                                            <thead className="table-light ">
                                                <tr>
                                                    <th className="fw-bold">S/N</th>
                                                    <th className="fw-bold"> Booking Id </th>
                                                    <th className="fw-bold">Name</th>
                                                    <th className="fw-bold">Sports</th>
                                                    <th className="fw-bold">Players</th>
                                                    <th className="fw-bold">Mode</th>
                                                    <th className="fw-bold">Time/Date</th>
                                                    <th className="fw-bold"> Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(paginatedDataBooking?.length > 0 ? paginatedDataBooking : bookings)?.map((booking, idx) => (
                                                    <tr key={idx}>
                                                        <td>{idx + 1}</td>
                                                        <td><span className="text-primary fw-bold" style={{ cursor: "pointer" }}
                                                            onClick={() => handleBookingClick(booking._id)}
                                                        >{booking.booking_id}</span></td>

                                                        <td>{booking.customerName}</td>
                                                        <td>{booking.game_id?.name}</td>

                                                        <td>{booking.players?.length || "---"}</td>

                                                        {/* <td>{booking.status || "---"}</td> */}
                                                        <td>
                                                            <span
                                                                className="d-flex align-items-center w-75 justify-content-center"
                                                                style={{
                                                                    backgroundColor:
                                                                        booking.status === "Pending" ? "#FFF3CD"
                                                                            :
                                                                            booking.mode === "Online"
                                                                                ? "#03D41414"
                                                                                : "#FF00000D",
                                                                    borderRadius: "20px",
                                                                    padding: "5px 10px",
                                                                    color:
                                                                        booking.status === "Pending" ? "#856404"
                                                                            :
                                                                            booking.mode === "Online" ? "#00AF0F" : "orange",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: "10px",
                                                                        height: "10px",
                                                                        borderRadius: "50%",
                                                                        backgroundColor:
                                                                            booking.status === "Pending" ? "#856404"
                                                                                : booking.mode === "Online"
                                                                                    ? "#03D414"
                                                                                    : "orange",
                                                                        marginRight: "5px",
                                                                    }}
                                                                />
                                                                {booking?.status === "Pending" ? "Pending" : booking?.mode}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {formatDate(booking.slot_date)}<br />
                                                            {/* {convertTo12Hour(booking?.slot_id?.start_time)}-{convertTo12Hour(booking?.slot_id?.end_time)} */}
                                                            ₹ {
                                                                booking?.booking_type === "Regular"
                                                                    ? `${convertTo12Hour(booking?.slot_id?.start_time)} - ${convertTo12Hour(booking?.slot_id?.end_time)}`
                                                                    : `${convertTo12Hour(booking?.custom_slot?.start_time)} - ${convertTo12Hour(booking?.custom_slot?.end_time)}`
                                                            }
                                                        </td>
                                                        <td>
                                                            ₹ {booking.gamePrice}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        <div className="d-flex justify-content-end align-items-center my-4">
                                            {/* Previous Button */}
                                            <Button
                                                style={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #dee2e6",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "0.375rem",
                                                }}
                                                onClick={handlePrevclientBooking}
                                                disabled={currentPagebooking === 1}
                                            >
                                                <GrFormPrevious style={{ color: "black", fontSize: "20px" }} />
                                            </Button>

                                            {/* Page Numbers */}
                                            <span className="d-flex align-items-center mx-2 gap-2">
                                                <Button
                                                    style={{
                                                        backgroundColor: currentPagebooking === 1 ? "#0062ff" : "white",
                                                        color: currentPagebooking === 1 ? "white" : "black",
                                                        border: "1px solid #dee2e6",
                                                        borderRadius: "0.375rem",
                                                        padding: "0.25rem 0.6rem",
                                                    }}
                                                >
                                                    1
                                                </Button>

                                                {/* <Button
                                                    style={{
                                                        backgroundColor: currentPagebooking === 2 ? "#0062ff" : "white",
                                                        color: currentPagebooking === 2 ? "white" : "black",
                                                        border: "1px solid #dee2e6",
                                                        borderRadius: "0.375rem",
                                                        padding: "0.25rem 0.6rem",
                                                    }}
                                                >
                                                    2
                                                </Button> */}

                                                <span style={{ fontSize: "16px", fontWeight: "500" }}>...</span>

                                                <Button
                                                    style={{
                                                        backgroundColor: currentPagebooking === totalPagesboking ? "#0062ff" : "white",
                                                        color: currentPagebooking === totalPagesboking ? "white" : "black",
                                                        border: "1px solid #dee2e6",
                                                        borderRadius: "0.375rem",
                                                        padding: "0.25rem 0.6rem",
                                                    }}
                                                >
                                                    {totalPagesboking}
                                                </Button>
                                            </span>

                                            {/* Next Button */}
                                            <Button
                                                style={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #dee2e6",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "0.375rem",
                                                }}
                                                onClick={handleNextclientBooking}
                                                disabled={currentPagebooking === totalPagesboking}
                                            >
                                                <MdOutlineNavigateNext style={{ color: "black", fontSize: "20px" }} />
                                            </Button>
                                        </div>

                                    </Col>

                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card.Header>
            </Row>
        </Container>

    );
}
export default ClientDetailsPage;
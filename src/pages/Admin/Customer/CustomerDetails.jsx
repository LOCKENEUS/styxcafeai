import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Spinner, Table, Pagination, Nav, Tab, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { collectAmount, collectAmountOnline, collectCustomCreditAmount, collectCustomCreditAmountOnline, getCustomerById } from "../../../store/AdminSlice/CustomerSlice";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import CreditCollectModal from "./Modal/CreditCollectModal";

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCustomer, loading } = useSelector((state) => state.customers);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageTransaction, setCurrentPageTransaction] = useState(1);
  const [collectMode, setCollectMode] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditTotal, setCreditTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [activeKey, setActiveKey] = useState("/home");
  const itemsPerPage = 10; // Number of items to display per page
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    dispatch(getCustomerById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCustomer) {
      let creditTotalAmount = 0
      selectedCustomer?.creditHistory.forEach((credit) => {
        creditTotalAmount += credit?.credit
      })
      setCreditTotal(creditTotalAmount)
    }
  }, [dispatch, selectedCustomer]);

  const handleCheckboxChange = (bookingId, isChecked, creditValue) => {
    if (isChecked) {
      // Add the booking ID to the state and update the credit amount
      setSelectedBookingIds((prev) => [...prev, bookingId]);
      setCreditAmount((prev) => prev + creditValue);
    } else {
      // Remove the booking ID from the state and update the credit amount
      setSelectedBookingIds((prev) => prev.filter((id) => id !== bookingId));
      setCreditAmount((prev) => prev - creditValue);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    if (selectAll) {
      // Select all rows and update the state
      const allBookingIds = selectedCustomer?.creditHistory.map((credit) => credit.booking_id) || [];
      const totalCredit = selectedCustomer?.creditHistory.reduce((sum, credit) => sum + credit.credit, 0) || 0;

      setSelectedBookingIds(allBookingIds);
      setCreditAmount(totalCredit);
    } else {
      // Deselect all rows and clear the state
      setSelectedBookingIds([]);
      setCreditAmount(0);
    }
  };

  // Add fallback image
  const defaultProfileImage = profileImg; // Your imported default image
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">

        </Spinner>
      </Container>
    );
  }

  // Calculate the current bookings to display
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = selectedCustomer?.bookings
    ? [...selectedCustomer.bookings]
      .sort((a, b) => new Date(a.slot_date) - new Date(b.slot_date))
      .filter(booking =>
        booking.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.game_id.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(indexOfFirstBooking, indexOfLastBooking)
    : [];

  const totalPages = Math.ceil((selectedCustomer?.bookings?.length || 0) / itemsPerPage);

  // Calculate current transactions to display
  const indexOfLastTransaction = currentPageTransaction * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = selectedCustomer?.creditTransaction
    ? [...selectedCustomer.creditTransaction]
      .filter(transaction =>
        transaction?.bookings?.map((booking) => booking?.booking_id?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(indexOfFirstTransaction, indexOfLastTransaction)
    : [];

  const totalPagesTransactions = Math.ceil((selectedCustomer?.creditTransaction?.length || 0) / itemsPerPage);

  const handleCollectOffline = async () => {
    await dispatch(
      collectAmount({
        id: id,
        updateData: { bookingIds: selectedBookingIds }
      })
    );

    await dispatch(getCustomerById(id));
  }


  const handleCollectOnline = async () => {
    await dispatch(
      collectAmountOnline({
        id: id,
        updateData: { bookingIds: selectedBookingIds, amount: creditAmount, customer: selectedCustomer?.data }
      })
    );

    setSelectedBookingIds([]);
    setCreditAmount(0);
    setSelectAll(false);
  }

  const handleCollectCustomCredit = async () => {
    await dispatch(
      collectCustomCreditAmount({ id, amount })
    );
    await dispatch(getCustomerById(id));
  };

  const handleCollectCustomCreditOnline = async () => {
    await dispatch(
      collectCustomCreditAmountOnline({ id, amount, customer: selectedCustomer?.data })
    );
  };

  return (
    <Container className="mt-4">
      <Row>
        {/* Sidebar with Profile */}
        <Col md={4}>
          <Card className="p-3" style={{ height: "100vh" }}>
            <div className="d-flex justify-content-center flex-column align-items-center">
              <div className="position-relative">
                <div
                  style={{
                    width: "100%",
                    height: "147px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    marginTop: "-16px",
                    marginRight: "-16px",
                  }}
                >
                  <img
                    src={profileBg}
                    alt="profileBg"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{ bottom: "4rem" }}
                  className="d-flex position-relative justify-content-center align-items-end"
                >
                  <Image
                    src={selectedCustomer?.data?.customerProfile ? `${import.meta.env.VITE_API_URL}/${selectedCustomer?.data.customerProfile}` : defaultProfileImage}
                    onError={(e) => {
                      e.target.src = defaultProfileImage;
                    }}
                    style={{ width: "137px", height: "137px", borderRadius: "8px" }}
                  />
                  <button
                    className="btn btn-primary position-absolute rounded-circle"
                    style={{
                      width: '40px', height: '40px', padding: 0,
                      right: "0px"
                    }}
                    onClick={() => {
                      navigate(`/admin/users/create-customer/${selectedCustomer?.data._id}`)
                    }}
                  >
                    <LuPencil />
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="d-flex flex-column gap-2 mt-1 scrollable" style={{
              overflowY: "auto",
              flex: 1, // takes remaining space in the Card
              paddingRight: "10px", // for scrollbar spacing
              scrollbarWidth: "none",         // For Firefox
              msOverflowStyle: "none"
            }}>
              <p><strong className="">Name:</strong> <span className="float-end">{selectedCustomer?.data?.name || "N/A"}</span></p>
              <p><strong className="">Credit Limit:</strong> <span className="float-end">₹ {selectedCustomer?.data?.creditLimit || "N/A"}</span></p>
              {/* <p><strong className="">Credit Left:</strong> <span className="float-end">₹ {selectedCustomer?.data?.creditLimit - selectedCustomer?.data?.creditAmount || "N/A"}</span></p> */}
              <p>
                <strong className="">Credit Left:</strong>
                <span className="float-end">
                  ₹ {
                    selectedCustomer?.data?.creditLimit != null &&
                      selectedCustomer?.data?.creditAmount != null
                      ? selectedCustomer.data.creditLimit - selectedCustomer.data.creditAmount
                      : "N/A"
                  }
                </span>
              </p>
              <p><strong className="">Gender:</strong> <span className="float-end">{selectedCustomer?.data?.gender || "N/A"}</span></p>
              <p><strong>Email Id:</strong> <span className="float-end">{selectedCustomer?.data?.email || "N/A"}</span></p>
              <p><strong>Phone Number:</strong> <span className="float-end">{selectedCustomer?.data?.contact_no || "N/A"}</span></p>
              <p><strong>Location:</strong> <span className="float-end">{selectedCustomer?.data?.city || "N/A"}</span></p>
              <p><strong>Department:</strong> <span className="float-end">{selectedCustomer?.data?.department || "N/A"}</span></p>
              <p><strong>Address:</strong> <span className="float-end">{selectedCustomer?.data?.address || "N/A"}</span></p>
              <p><strong>City:</strong> <span className="float-end">{selectedCustomer?.data?.city || "N/A"}</span></p>
              <p><strong>State:</strong> <span className="float-end">{selectedCustomer?.data?.state || "N/A"}</span></p>
              <p><strong>Country:</strong> <span className="float-end">{selectedCustomer?.data?.country || "N/A"}</span></p>
            </div>
          </Card>
        </Col>

        {/* Billing Details */}
        <Col md={8}>

          <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            <Row >
              <Col>
                <Nav justify variant="tabs" className="bg-white rounded-2">
                  <Nav.Item>
                    <Nav.Link className="text-start" eventKey="/home">Booking History</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="text-start" eventKey="link-1">Pending Credit</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="text-start" eventKey="link-2">Transaction History</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col className="mt-3">
                <Tab.Content>
                  <Tab.Pane eventKey="/home">
                    <Card className="p-3 d-flex flex-column" style={{ height: "88vh" }}>
                      <div className="flex-grow-1 overflow-auto">

                        <div className="d-flex align-items-center justify-content-between">
                          {/* <h5>Booking History</h5> */}
                          <input
                            type="text"
                            placeholder="Search by Booking ID or Game"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control shadow-lg w-50 mb-3"
                          />
                        </div>
                        <div className="table-responsive">
                          <Table className="table">
                            <thead style={{ backgroundColor: "#0062FF0D" }}>
                              <tr>
                                <th style={{ fontWeight: "600" }}  >S/N</th>
                                <th style={{ fontWeight: "600" }}  >Booking ID</th>
                                <th style={{ fontWeight: "600" }}  >Game</th>
                                <th style={{ fontWeight: "600" }}  >Slot Date</th>
                                <th style={{ fontWeight: "600" }}  >Status</th>
                                <th style={{ fontWeight: "600" }}  >Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentBookings.length > 0 ? (
                                currentBookings.map((booking, index) => (
                                  <tr key={booking._id}>
                                    <td>{index + 1 + indexOfFirstBooking}</td>
                                    <td style={{ fontWeight: "600", color: "blue" }} onClick={() => navigate(`/admin/booking/checkout/${booking._id}`)} >{booking.booking_id}</td>
                                    <td>{booking.game_id.name}</td>
                                    <td>{new Date(booking.slot_date).toLocaleDateString()}</td>
                                    <td>
                                      <span className={`badge ${booking.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                                        {booking.status}
                                      </span>
                                    </td>
                                    <td>₹ {booking.total}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">No bookings available</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <Pagination.Prev
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="btn rounded-2 d-flex justify-content-center align-items-center btn-primary btn-sm"
                          style={{ width: '40px', height: '40px' }}
                        />
                        <span>Page {currentPage} of {totalPages}</span>
                        <Pagination.Next
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="btn rounded-2 d-flex justify-content-center align-items-center btn-primary btn-sm"
                          style={{ width: '40px', height: '40px' }}
                        />
                      </div>
                    </Card>
                  </Tab.Pane>
                  <Tab.Pane eventKey="link-1">
                    <Card className="p-3" style={{ height: "88vh" }}>
                      <div className="d-flex justify-content-between">
                        {/* <h5>Booking History</h5> */}
                        <FormControl
                          size="sm"
                          type="text"
                          placeholder="Search by Booking ID or Game"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="form-control shadow-lg w-50 mb-3"
                        />
                        <Button size="sm" variant="primary" className="float-end m-2 mb-3" onClick={() => setShowCollectModal(true)}>Custom Credit Collection</Button>
                      </div>
                      <div><span className="float-end px-3 text-color fs-4">Credit: ₹{creditTotal}</span></div>
                      <div className="table-responsive">
                        <Table className="table">
                          <thead style={{ backgroundColor: "#0062FF0D" }}>
                            <tr>
                              <th style={{ fontWeight: "600" }}  >S/N</th>
                              <th style={{ fontWeight: "600" }}  >Booking ID</th>
                              <th style={{ fontWeight: "600" }}  >Game</th>
                              <th style={{ fontWeight: "600" }}  >Slot Date</th>

                              <th style={{ fontWeight: "600" }}  >Total</th>
                              <th style={{ fontWeight: "600" }}  >Credit</th>
                              {collectMode && <th style={{ fontWeight: "600" }}  >
                                Collect
                                <span
                                  size="sm"
                                  className="text-primary border-0 bg-transparent p-0"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleSelectAll()}
                                >
                                  (Select All)
                                </span>
                              </th
                              >}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCustomer?.creditHistory.length > 0 ? (
                              selectedCustomer?.creditHistory.map((credit, index) => (
                                <tr key={credit._id}>
                                  <td>{index + 1}</td>
                                  <td style={{ fontWeight: "600", color: "blue", cursor: "pointer" }} onClick={() => navigate(`/admin/booking/checkout/${credit.booking_id}`)} >{credit.booking_no}</td>
                                  <td>{credit.game_name}</td>
                                  <td>{new Date(credit.slot_date).toLocaleDateString()}</td>

                                  <td>₹ {credit.total}</td>
                                  <td>
                                    <span >
                                      ₹ {credit.credit}
                                    </span>
                                  </td>
                                  {collectMode && <td className="text-center">
                                    <input
                                      type="checkbox"
                                      className=""
                                      style={{ border: "2px solid black", width: "20px", height: "20px" }}
                                      onChange={(e) => handleCheckboxChange(credit.booking_id, e.target.checked, credit.credit)}
                                      checked={selectedBookingIds.includes(credit.booking_id)} // Ensure the checkbox reflects the state
                                    />
                                  </td>}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center">No pending payments</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      <div className="d-flex align-items-center justify-content-end">
                        {!collectMode && <Button
                          size="sm"
                          variant="success"
                          disabled={selectedCustomer?.creditHistory.length === 0}
                          onClick={() => setCollectMode(!collectMode)}
                        >
                          Collect Now
                        </Button>}
                        {collectMode &&
                          <Form.Select
                            size="sm"
                            disabled={selectedCustomer?.creditHistory.length === 0}
                            className="w-25 bg-success text-white text-center"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'offline') handleCollectOffline();
                              else if (value === 'online') handleCollectOnline(); // define this function if needed
                            }}
                            defaultValue=""
                          >
                            <option className="text-center bg-white text-dark" value="" disabled>
                              Collect Now ({<FaRupeeSign />} {creditAmount})
                            </option>
                            <option className="bg-white text-dark" value="offline">CASH</option>
                            <option className="bg-white text-dark" value="online">COLLECT ONLINE</option>
                          </Form.Select>
                        }
                      </div>

                      <div className="d-flex justify-content-center align-items-center gap-3 pt-3">
                        {/* <Pagination.Prev
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="btn rounded-2 d-flex justify-content-center align-items-center btn-primary btn-sm"
                          style={{ width: '40px', height: '40px' }}
                        />
                        <span>Page {currentPage} of {totalPages}</span>
                        <Pagination.Next
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="btn rounded-2 d-flex justify-content-center align-items-center btn-primary btn-sm"
                          style={{ width: '40px', height: '40px' }}
                        /> */}
                      </div>
                    </Card>
                  </Tab.Pane>
                  <Tab.Pane eventKey="link-2">
                    <Card className="p-3 d-flex flex-column" style={{ height: "88vh" }}>
                      <div className="flex-grow-1 overflow-auto">

                        <div className="d-flex align-items-center justify-content-between">
                          <input
                            type="text"
                            placeholder="Search by Booking ID or Game"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control shadow-lg w-50 mb-3"
                          />
                        </div>
                        <div className="table-responsive">
                          <Table className="table">
                            <thead style={{ backgroundColor: "#0062FF0D" }}>
                              <tr>
                                <th style={{ fontWeight: "600" }}  >S/N</th>
                                <th style={{ fontWeight: "600" }}  >Booking ID</th>
                                <th style={{ fontWeight: "600" }}  >Transaction ID</th>
                                <th style={{ fontWeight: "600" }}  >Amount</th>
                                <th style={{ fontWeight: "600" }}  >Date</th>
                              </tr>
                            </thead>
                            <tbody>

                              {currentTransactions.length > 0 ? (
                                currentTransactions?.map((transaction, index) => (
                                  <tr key={transaction._id}>
                                    <td>{index + 1}</td>
                                    {/* <td style={{ fontWeight: "600", color: "blue", cursor: "pointer" }} onClick={() => navigate(`/admin/booking/checkout/${transaction.booking_id}`)} >{transaction.bookings}</td> */}
                                    <td>
                                      {transaction.bookings && transaction.bookings.length > 0
                                        ? transaction.bookings.map((b, i) => (
                                          <span key={b._id}>
                                            <span
                                              style={{ fontWeight: "600", color: "blue", cursor: "pointer", marginRight: "5px" }}
                                              onClick={() => navigate(`/admin/booking/checkout/${b._id}`)}
                                            >
                                              {b.booking_id}
                                            </span>
                                            {i !== transaction.bookings.length - 1 && ", "}
                                          </span>
                                        ))
                                        : "—"}
                                    </td>
                                    <td>{transaction.mode === "Cash" ? "Cash" : transaction.txn_id}</td>
                                    <td>₹ {transaction.amount}</td>
                                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                  </tr>
                                ))
                              ) : (
                                <></>
                              )
                              }
                            </tbody>
                          </Table>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center align-items-center gap-3 pt-3">
                        <Pagination.Prev
                          onClick={() => setCurrentPageTransaction(currentPageTransaction - 1)}
                          disabled={currentPageTransaction === 1}
                          className="btn rounded-2 d-flex justify-content-center align-items-center btn-primary btn-sm"
                          style={{ width: '40px', height: '40px' }}
                        />
                        <span>Page {currentPageTransaction} of {totalPagesTransactions}</span>
                        <Pagination.Next
                          onClick={() => setCurrentPageTransaction(currentPageTransaction + 1)}
                          disabled={currentPageTransaction === totalPagesTransactions}
                          className="btn rounded-2 d-flex justify-content-center align-items-center btn-primary btn-sm"
                          style={{ width: '40px', height: '40px' }}
                        />
                      </div>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
      {showCollectModal &&
        <CreditCollectModal
          show={showCollectModal}
          amount={amount}
          onHide={() => setShowCollectModal(false)}
          onCollectCash={handleCollectCustomCredit}
          onCollectOnline={handleCollectCustomCreditOnline}
          handleChange={(value) => setAmount(value)}
          creditTotal={creditTotal}
        />}
    </Container>
  );
};

export default CustomerDetails;

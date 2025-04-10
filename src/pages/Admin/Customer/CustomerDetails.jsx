import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Spinner, Table, Pagination } from "react-bootstrap";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerById } from "../../../store/AdminSlice/CustomerSlice";
import { useNavigate } from "react-router-dom";

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCustomer, loading } = useSelector((state) => state.customers);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    dispatch(getCustomerById(id));
  }, [dispatch, id]);

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

  return (
    <Container className="mt-4">
  
        <Row>
          {/* Sidebar with Profile */}
          <Col md={4}>
            <Card className="p-3 text-center">
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
                  <div style={{ position: "relative", bottom: "1rem" }}>
                    <h5>{selectedCustomer?.data?.name || "N/A"}</h5>
                    <p>{selectedCustomer?.data?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="d-flex flex-column gap-2 mt-1">
                <div className="d-flex justify-content-center align-items-center">
                  <div
                    className="rounded-pill"
                    style={{
                      backgroundColor: "#28a745", // A slightly softer green
                      color: "white",
                      padding: "0.3rem 0.8rem", // Reduced padding for a smaller look
                      fontWeight: "bold",
                      marginRight: "0.5rem", // Reduced margin for a tighter layout
                      fontSize: "0.9rem" // Slightly smaller font size
                    }}
                  >
                    Credit Limit: {selectedCustomer?.data?.creditLimit || "N/A"}
                  </div>
                  <div
                    className="rounded-pill"
                    style={{
                      backgroundColor: "#ffc107", // A slightly softer orange
                      color: "white",
                      padding: "0.3rem 0.8rem", // Reduced padding for a smaller look
                      fontWeight: "bold",
                      marginRight: "0.5rem", // Reduced margin for a tighter layout
                      fontSize: "0.9rem" // Slightly smaller font size
                    }}
                  >
                    Remaining Credit: {selectedCustomer?.data?.creditLimit - selectedCustomer?.data?.creditAmount || "N/A"}
                  </div>
                </div>

                <p><strong>Gender:</strong> {selectedCustomer?.data?.gender || "N/A"}</p>
                <p><strong>Email Id:</strong> {selectedCustomer?.data?.email || "N/A"}</p>
                <p><strong>Phone Number:</strong> {selectedCustomer?.data?.contact_no || "N/A"}</p>
                <p><strong>Location:</strong> {selectedCustomer?.data?.city || "N/A"}</p>
                <p><strong>Department:</strong> {selectedCustomer?.data?.department || "N/A"}</p>
                {/* <p><strong>Company:</strong> {selectedCustomer?.data?.company || "N/A"}</p>
                <p><strong>Bank:</strong> {selectedCustomer?.data?.bank_name || "N/A"}</p>
                <p><strong>Account No.:</strong> {selectedCustomer?.data?.account_number || "N/A"}</p> */}
              </div>


            </Card>
          </Col>

          {/* Billing Details */}
          <Col md={8}>
            <Card className="p-3 mb-3">
              <h5>Details</h5>
              <div className="d-flex flex-column gap-2">
                <p><strong>Address:</strong> {selectedCustomer?.data?.address}</p>
                <p><strong>City:</strong> {selectedCustomer?.data?.city}</p>
                <p><strong>State:</strong> {selectedCustomer?.data?.state}</p>
                <p><strong>Country:</strong> {selectedCustomer?.data?.country}</p>
                {/* <p><strong>Pincode:</strong> 47811054</p>
                <p><strong>Latitude:</strong> 21.1475</p>
                <p><strong>Longitude:</strong> 79.1199</p> */}
              </div>
            </Card>

            {/* Other Documents */}
            <Card className="p-3 mb-3">
              <div className="d-flex align-items-center justify-content-between">
              <h5>Booking History</h5>

          
              <input
                type="text"
                placeholder="Search by Booking ID or Game"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control shadow-lg  w-50 mb-3"
              />
              </div>
              <Table className="table">
                <thead style={{ backgroundColor: "#0062FF0D" }}>
                <tr>
                    <th style={{ fontWeight:"600" }}  >S/N</th>
                    <th style={{ fontWeight:"600" }}  >Booking ID</th>
                    <th style={{ fontWeight:"600" }}  >Game</th>
                    <th style={{ fontWeight:"600" }}  >Slot Date</th>
                    <th style={{ fontWeight:"600" }}  >Status</th>
                    <th style={{ fontWeight:"600" }}  >Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.length > 0 ? (
                    currentBookings.map((booking, index) => (
                      <tr key={booking._id}>
                        <td>{index + 1 + indexOfFirstBooking}</td>
                        <td style={{fontWeight:"600" , color:"blue"}} onClick={()=> navigate(`/admin/booking/checkout/${booking._id}`)} >{booking.booking_id}</td>
                        <td>{booking.game_id.name}</td>
                        <td>{new Date(booking.slot_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${booking.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>{booking.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No bookings available</td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-center align-items-center gap-3">
                <Pagination.Prev 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="btn rounded-circle d-flex justify-content-center align-items-center btn-primary btn-sm"
                  style={{ width: '40px', height: '40px' }} 
                />
                <span>Page {currentPage} of {totalPages}</span>
                <Pagination.Next 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="btn rounded-circle d-flex justify-content-center align-items-center btn-primary btn-sm"
                  style={{ width: '40px', height: '40px' }} 
                />
              </div>
            </Card>

            {/* Bank Details */}
            {/* <Card className="p-3">
              <h5>Bank Details</h5>
              <div className="d-flex flex-wrap justify-content-around gap-2">
                <p><strong>Bank Name:</strong> State Bank of India</p>
                <p><strong>Account Number:</strong> 24578965230</p>
                <p><strong>IFSC/SWIFT/BIC:</strong> SBI0145720124</p>
                <p><strong>Account Type:</strong> Savings</p>
                <p><strong>Created At:</strong> 2025-02-07 10:54:16</p>
                <p><strong>Modified At:</strong> 2025-02-07</p>
              </div>
            </Card> */}
          </Col>
        </Row>
 
    </Container>
  );
};

export default CustomerDetails;

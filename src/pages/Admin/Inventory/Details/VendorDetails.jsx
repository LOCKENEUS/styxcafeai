import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Nav, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVendorById } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";

const VendorDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("billing");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selectedVendor, loading, error } = useSelector((state) => state.vendors);

  useEffect(() => {
    if (id) {
      dispatch(getVendorById(id));
    }
  }, [dispatch, id]);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center my-5 text-danger">{error}</div>;
  if (!selectedVendor) return <div className="text-center my-5">No vendor data found</div>;

  return (
    <Container data-aos="fade-down" data-aos-duration="700" className="mt-4">

      <Breadcrumb>
        <BreadcrumbItem ><Link to="/admin/dashboard">Home</Link></BreadcrumbItem>
        <BreadcrumbItem ><Link to="/admin/inventory/dashboard">Inventory</Link></BreadcrumbItem>
        <BreadcrumbItem ><Link to="/admin/inventory/vendors-list">Vendors List</Link></BreadcrumbItem>
        <BreadcrumbItem active>Vendor Details</BreadcrumbItem>
      </Breadcrumb>
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
                    marginTop: "",
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
                    src={profileImg}
                    style={{ width: "137px", height: "137px", borderRadius: "8px" }}
                  />
                  <button
                    className="btn btn-primary position-absolute rounded-circle"
                    style={{
                      width: '40px', height: '40px', padding: 0,
                      right: "0px"
                    }}
                    onClick={() => navigate(`/admin/inventory/vendors/edit/${id}`)}
                  >
                    <LuPencil />
                  </button>
                </div>
                <div style={{ position: "relative", bottom: "2rem" }}>
                  <h5>{selectedVendor.name}</h5>
                  <p>{selectedVendor.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="d-flex flex-column text-start gap-2 mt-3">
              <p><strong>Email Id:</strong> {selectedVendor.email}</p>
              <p><strong>Phone Number:</strong> {selectedVendor.phone}</p>
              <p><strong>Location:</strong> {selectedVendor.city1}</p>
              <p><strong>Company:</strong> {selectedVendor.company}</p>
              <p><strong>Bank:</strong> {selectedVendor.bank || "Not specified"}</p>
              <p><strong>Account No.:</strong> {selectedVendor.accountNo}</p>
            </div>
          </Card>
        </Col>

        {/* Address Details with Tabs */}
        <Col md={8}>
          <Card className="p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link 
                    className={activeTab === "billing" ? "active" : ""} 
                    onClick={() => setActiveTab("billing")}
                  >
                    Billing Address
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={activeTab === "shipping" ? "active" : ""} 
                    onClick={() => setActiveTab("shipping")}
                  >
                    Shipping Address
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            {activeTab === "billing" ? (
              <div className="d-flex flex-column gap-2">
                <p><strong>Address:</strong> {selectedVendor.billingAddress}</p>
                <p><strong>City:</strong> {selectedVendor.city1}</p>
                <p><strong>State:</strong> {selectedVendor.state1}</p>
                <p><strong>Country:</strong> {selectedVendor.country1}</p>
                <p><strong>Pincode:</strong> {selectedVendor.pincode1}</p>
                <p><strong>Latitude:</strong> {selectedVendor.latitude1}</p>
                <p><strong>Longitude:</strong> {selectedVendor.longitude1}</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <p><strong>Address:</strong> {selectedVendor.shippingAddress}</p>
                <p><strong>City:</strong> {selectedVendor.city2}</p>
                <p><strong>State:</strong> {selectedVendor.state2}</p>
                <p><strong>Country:</strong> {selectedVendor.country2}</p>
                <p><strong>Pincode:</strong> {selectedVendor.pincode2}</p>
                <p><strong>Latitude:</strong> {selectedVendor.latitude2}</p>
                <p><strong>Longitude:</strong> {selectedVendor.longitude2}</p>
              </div>
            )}
          </Card>

          {/* Other Documents */}
          <Card className="p-3 mb-3">
            <h5>Other Documents</h5>
            <div className="d-flex flex-wrap align-items-center justify-content-around gap-2">
              <p><strong>Government Id:</strong> {selectedVendor.govtId}</p>
              <p><strong>Document:</strong> 
                <img src={pdflogo} alt="pdflogo" /> 
                {selectedVendor.image && (
                  <a 
                    href={`${import.meta.env.VITE_API_URL}/${selectedVendor.image}`}
                    download
                    onClick={(e) => {
                      e.preventDefault();
                      fetch(`${import.meta.env.VITE_API_URL}/${selectedVendor.image}`)
                        .then(response => response.blob())
                        .then(blob => {
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          // Extract the original filename from the path
                          const fileName = selectedVendor.image.split('-').pop();
                          link.download = fileName;
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        });
                    }}
                    className="text-primary"
                  > 
                    Download PDF
                  </a>
                )}
              </p>
            </div>
          </Card>

          {/* Bank Details */}
          <Card className="p-3">
            <h5>Bank Details</h5>
            <div className="d-flex flex-wrap justify-content-around gap-2">
              <p><strong>Account Number:</strong> {selectedVendor.accountNo}</p>
              <p><strong>IFSC/SWIFT/BIC:</strong> {selectedVendor.ifsc}</p>
              <p><strong>Account Type:</strong> {selectedVendor.accountType}</p>
              <p><strong>Created At:</strong> {new Date(selectedVendor.createdAt).toLocaleString()}</p>
              <p><strong>Modified At:</strong> {new Date(selectedVendor.updatedAt).toLocaleDateString()}</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorDetails;

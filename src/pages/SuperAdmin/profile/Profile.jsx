import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Nav, Breadcrumb, BreadcrumbItem, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { LuPencil } from "react-icons/lu";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";

export const SuperProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("billing");

    const superadmin = JSON.parse(localStorage.getItem("user"));

    return (
        <Container className="mt-4">
            <div style={{ top: "186px", fontSize: "12px" }}>
                <Breadcrumb>
                    <BreadcrumbItem ><Link to="/superadmin/dashboard">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Profile</BreadcrumbItem>
                </Breadcrumb>
            </div>
            <Row data-aos="fade-up" data-aos-duration="500">
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
                                    <h5>{superadmin.name}</h5>
                                    <p>{superadmin.emailID}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="d-flex flex-column text-start gap-2 mt-3">
                            <p><strong>Email Id:</strong> {superadmin.email}</p>
                            <p><strong>Phone Number:</strong> {superadmin.contact}</p>
                            <p><strong>Location:</strong> {superadmin.city1}</p>
                            {/* <p><strong>Company:</strong> {superadmin.company}</p> */}
                            <p><strong>Bank:</strong> {superadmin?.bank_name || "Not specified"}</p>
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
                                <p><strong>Address:</strong> {superadmin.billingAddress}</p>
                                <p><strong>City:</strong> {superadmin.city1}</p>
                                <p><strong>State:</strong> {superadmin.state1}</p>
                                <p><strong>Country:</strong> {superadmin.country1}</p>
                                <p><strong>Pincode:</strong> {superadmin.pincode1}</p>
                                <p><strong>Latitude:</strong> {superadmin.latitude1}</p>
                                <p><strong>Longitude:</strong> {superadmin.longitude1}</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2">
                                <p><strong>Address:</strong> {superadmin.shippingAddress}</p>
                                <p><strong>City:</strong> {superadmin.city2}</p>
                                <p><strong>State:</strong> {superadmin.state2}</p>
                                <p><strong>Country:</strong> {superadmin.country2}</p>
                                <p><strong>Pincode:</strong> {superadmin.pincode2}</p>
                                <p><strong>Latitude:</strong> {superadmin.latitude2}</p>
                                <p><strong>Longitude:</strong> {superadmin.longitude2}</p>
                            </div>
                        )}
                    </Card>

                    {/* Bank Details */}
                    <Card className="p-3">
                        <h5>Other Details</h5>
                        <div className="d-flex flex-wrap justify-content-around gap-2">
                            <p><strong>Gst No:</strong> {superadmin.gstIn}</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
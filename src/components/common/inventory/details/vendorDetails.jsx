// import { useEffect, useState } from "react";
// import { Card, Form, Button, OverlayTrigger, Tooltip, Container, CardBody, FormControl, Row, Col, Table } from "react-bootstrap";
// import { FaPencilAlt } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import { IoIosCall, IoIosCamera } from "react-icons/io";
// import { IoArrowBackOutline } from "react-icons/io5";
// import { MdEmail, MdOutlineViewCompact } from "react-icons/md";
// import { Link, useLocation } from "react-router-dom";


// export const VendoreDetails = () => {
//     const [coverImage, setCoverImage] = useState("https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/1920x400/img1.jpg");
//     const [avatarImage, setAvatarImage] = useState("https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img9.jpg");


//     const location = useLocation();
//     const vendor = location.state?.vendor;
//     console.log("userDetails", vendor);


//     const handleFileChange = (event, setImage) => {
//         const file = event.target.files[0];
//         if (file) {
//             setImage(URL.createObjectURL(file));
//         }
//     };

//     useEffect(() => {

//         const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//         tooltipTriggerList.forEach((tooltipTriggerEl) => {
//             new window.bootstrap.Tooltip(tooltipTriggerEl);
//         });
//     }, []);

//     return (

//         <Container>
//             <div className="d-flex justify-content-center align-items-center">
//                 <h1>Vendor</h1>
//             </div>

//             <Card>

//                 <div className="profile-cover">
//                     <div className="profile-cover-img-wrapper">
//                     <img id="profileCoverImg" className="profile-cover-img" src={coverImage} alt="Cover" />
//                         <Link to="/Inventory/vendor">
//                            <IoArrowBackOutline />  Back to List
//                         </Link>


//                         <div className="profile-cover-content profile-cover-uploader p-3">
//                             <FormControl
//                                 type="file"
//                                 id="profileCoverUploader"
//                                 accept=".png, .jpeg, .jpg"
//                                 onChange={(e) => handleFileChange(e, setCoverImage)}
//                                 className="d-none"
//                             />
//                             <label className="profile-cover-uploader-label btn btn-sm btn-white" htmlFor="profileCoverUploader">

//                                 <IoIosCamera style={{ fontSize: '1.5rem' }} />
//                                 <span className="d-none d-sm-inline-block ms-1">Upload header</span>
//                             </label>
//                         </div>
//                     </div>
//                 </div>

//                 <label className="avatar avatar-xxl avatar-circle avatar-uploader profile-cover-avatar" htmlFor="editAvatarUploaderModal">
//                     <img id="editAvatarImgModal" className="avatar-img" src={avatarImage} alt="Avatar" />

//                     <FormControl
//                         type="file"
//                         id="editAvatarUploaderModal"
//                         accept=".png, .jpeg, .jpg"
//                         onChange={(e) => handleFileChange(e, setAvatarImage)}
//                         className=" d-none "
//                     />

//                     <span className="avatar-uploader-trigger py-1 px-2 bg-white">

//                         <FaPencilAlt className=" shadow-md" />
//                     </span>
//                 </label>
//                 <CardBody>
//                     <Row
//                     // className="justify-content-center align-item-center"
//                     >
//                         <Col sm={12} className="text-center mt-3" >
//                             <h4>{vendor.name}</h4>
//                         </Col>
//                         <Col sm={3} className="mt-3">
//                             <span className="mx-2" style={{ fontSize: "1rem" }}><MdEmail /></span>
//                             <span  >email@gmail.com</span >
//                         </Col>
//                         <Col sm={3} className="mt-3">
//                             <span className="mx-2" style={{ fontSize: "1rem" }}><MdOutlineViewCompact /></span>
//                             <span>{vendor.company}</span>
//                         </Col>

//                         <Col sm={3} className="mt-3" >
//                             <span className="mx-2" style={{ fontSize: "1rem" }} ><IoIosCall /></span>
//                             <span>123456789</span>
//                         </Col>
//                         <Col sm={3} className="mt-3" >
//                             <span className="mx-2" style={{ fontSize: "1rem" }}><FaLocationDot /></span>
//                             <span>{vendor.billingAddress}</span>
//                         </Col>


//                         <Col sm={12} className="my-4">

//                             <div  style={{overflowX: 'auto'}}>

//                             <Table bordered hover size="sm" >
//                                 <tbody>
//                                     {/* Vendor Personal Details */}
//                                     <tr className="table-active">
//                                         <th colSpan="4">Vendor Personal Details</th>
//                                     </tr>
//                                     <tr>
//                                         <th>Vendor Name</th>
//                                         <td>{vendor.name}</td>
//                                         <th>Company</th>
//                                         <td>{vendor.company}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Email</th>
//                                         <td>{vendor.email}</td>
//                                         <th>Phone</th>
//                                         <td>{vendor.phone || "N/A"}</td>
//                                     </tr>

//                                     {/* Billing & Shipping Address */}
//                                     <tr className="table-active">
//                                         <th colSpan="2">Billing Address</th>
//                                         <th colSpan="2">Shipping Address</th>
//                                     </tr>
//                                     <tr>
//                                         <th>Address</th>
//                                         <td>{vendor.billingAddress}</td>
//                                         <th>Address</th>
//                                         <td>{vendor.shippingAddress}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>City</th>
//                                         <td>{vendor.city}</td>
//                                         <th>City</th>
//                                         <td>{vendor.city}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>State</th>
//                                         <td>{vendor.state}</td>
//                                         <th>State</th>
//                                         <td>{vendor.state}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Country</th>
//                                         <td>{vendor.country}</td>
//                                         <th>Country</th>
//                                         <td>{vendor.country}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Pincode</th>
//                                         <td>{vendor.pincode}</td>
//                                         <th>Pincode</th>
//                                         <td>{vendor.pincode}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Latitude</th>
//                                         <td>{vendor.latitude}</td>
//                                         <th>Latitude</th>
//                                         <td>{vendor.latitude}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Longitude</th>
//                                         <td>{vendor.longitude}</td>
//                                         <th>Longitude</th>
//                                         <td>{vendor.longitude}</td>
//                                     </tr>

//                                     {/* Other Details */}
//                                     <tr className="table-active">
//                                         <th colSpan="4">Other Details</th>
//                                     </tr>
//                                     <tr>
//                                         <th>Govt Id</th>
//                                         <td>{vendor.govtId || "N/A"}</td>
//                                         <th>Documents</th>
//                                         <td>
//                                             <img
//                                                 src={vendor.document}
//                                                 alt="Document"
//                                                 style={{ width: "100px", aspectRatio: "1", objectFit: "cover" }}
//                                                 onError={(e) => (e.target.src = vendor.document)}
//                                             />
//                                         </td>
//                                     </tr>

//                                     {/* Bank Details */}
//                                     <tr className="table-active">
//                                         <th colSpan="4">Bank Details</th>
//                                     </tr>
//                                     <tr>
//                                         <th>Bank Name</th>
//                                         <td>{vendor.bankName || "N/A"}</td>
//                                         <th>Account No</th>
//                                         <td>{vendor.accountNo}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>IFSC/SWIFT/BIC</th>
//                                         <td>{vendor.ifsc || "N/A"}</td>
//                                         <th>Account Type</th>
//                                         <td>{vendor.accountType}</td>
//                                     </tr>

//                                     {/* Created & Modified At */}
//                                     <tr className="table-active">
//                                         <th>Created At</th>
//                                         <td>{vendor.createdAt}</td>
//                                         <th>Modified At</th>
//                                         <td>{vendor.modifiedAt}</td>
//                                     </tr>
//                                 </tbody>
//                             </Table>

//                             </div>
//                         </Col>
//                     </Row>




//                 </CardBody>


//             </Card>
//         </Container>

//     );
// };































































import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Nav, Breadcrumb, BreadcrumbItem, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVendorById } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import profileBg from "/assets/Admin/profileDetails/profileBg.png";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import profileImg from "/assets/Admin/profileDetails/ProfileImg.png";

export const VendoreDetails = () => {
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
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                </Spinner>
            </Container>
        );
    }
    if (error) return <div className="text-center my-5 text-danger">{error}</div>;
    if (!selectedVendor) return <div className="text-center my-5">No vendor data found</div>;

    return (
        <Container className="mt-4">
            <div style={{ top: "186px", fontSize: "12px" }}>
                <Breadcrumb>
                    <BreadcrumbItem ><Link to="/admin/dashboard">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem ><Link to="/admin/inventory/dashboard">Inventory</Link></BreadcrumbItem>
                    <BreadcrumbItem ><Link to="/admin/inventory/vendors-list">Vendors List</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Vendor Details</BreadcrumbItem>
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
                                        onClick={() => navigate(`/Inventory/Vendor/Edit/${id}`)}
                                    >
                                        <LuPencil />
                                    </button>
                                </div>
                                <div style={{ position: "relative", bottom: "2rem" }}>
                                    <h5>{selectedVendor.name}</h5>
                                    <p>{selectedVendor.emailID}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="d-flex flex-column text-start gap-2 mt-3">
                            <p><strong>Email Id:</strong> {selectedVendor.emailID}</p>
                            <p><strong>Phone Number:</strong> {selectedVendor.phone}</p>
                            <p><strong>Location:</strong> {selectedVendor.city1}</p>
                            <p><strong>Company:</strong> {selectedVendor.company}</p>
                            <p><strong>Bank:</strong> {selectedVendor.bank_name || "Not specified"}</p>
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
                            <p><strong>Bank Name:</strong> {selectedVendor.bank_name}</p>
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

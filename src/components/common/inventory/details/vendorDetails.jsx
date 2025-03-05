import { useEffect, useState } from "react";
import { Card, Form, Button, OverlayTrigger, Tooltip, Container, CardBody, FormControl, Row, Col, Table } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCall, IoIosCamera } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdEmail, MdOutlineViewCompact } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";


export const VendoreDetails = () => {
    const [coverImage, setCoverImage] = useState("https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/1920x400/img1.jpg");
    const [avatarImage, setAvatarImage] = useState("https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img9.jpg");


    const location = useLocation();
    const vendor = location.state?.vendor;
    console.log("userDetails", vendor);
    

    const handleFileChange = (event, setImage) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    return (

        <Container>
            <div className="d-flex justify-content-center align-items-center">
                <h1>Vendor</h1>
            </div>

            <Card>

                <div className="profile-cover">
                    <div className="profile-cover-img-wrapper">
                    <img id="profileCoverImg" className="profile-cover-img" src={coverImage} alt="Cover" />
                        <Link to="/Inventory/vendor">
                           <IoArrowBackOutline />  Back to List
                        </Link>


                        <div className="profile-cover-content profile-cover-uploader p-3">
                            <FormControl
                                type="file"
                                id="profileCoverUploader"
                                accept=".png, .jpeg, .jpg"
                                onChange={(e) => handleFileChange(e, setCoverImage)}
                                className="d-none"
                            />
                            <label className="profile-cover-uploader-label btn btn-sm btn-white" htmlFor="profileCoverUploader">

                                <IoIosCamera style={{ fontSize: '1.5rem' }} />
                                <span className="d-none d-sm-inline-block ms-1">Upload header</span>
                            </label>
                        </div>
                    </div>
                </div>

                <label className="avatar avatar-xxl avatar-circle avatar-uploader profile-cover-avatar" htmlFor="editAvatarUploaderModal">
                    <img id="editAvatarImgModal" className="avatar-img" src={avatarImage} alt="Avatar" />

                    <FormControl
                        type="file"
                        id="editAvatarUploaderModal"
                        accept=".png, .jpeg, .jpg"
                        onChange={(e) => handleFileChange(e, setAvatarImage)}
                        className=" d-none "
                    />

                    <span className="avatar-uploader-trigger py-1 px-2 bg-white">

                        <FaPencilAlt className=" shadow-md" />
                    </span>
                </label>
                <CardBody>
                    <Row
                    // className="justify-content-center align-item-center"
                    >
                        <Col sm={12} className="text-center mt-3" >
                            <h4>{vendor.name}</h4>
                        </Col>
                        <Col sm={3} className="mt-3">
                            <span className="mx-2" style={{ fontSize: "1rem" }}><MdEmail /></span>
                            <span  >email@gmail.com</span >
                        </Col>
                        <Col sm={3} className="mt-3">
                            <span className="mx-2" style={{ fontSize: "1rem" }}><MdOutlineViewCompact /></span>
                            <span>{vendor.company}</span>
                        </Col>

                        <Col sm={3} className="mt-3" >
                            <span className="mx-2" style={{ fontSize: "1rem" }} ><IoIosCall /></span>
                            <span>123456789</span>
                        </Col>
                        <Col sm={3} className="mt-3" >
                            <span className="mx-2" style={{ fontSize: "1rem" }}><FaLocationDot /></span>
                            <span>{vendor.billingAddress}</span>
                        </Col>


                        <Col sm={12} className="my-4">
                            
                            <div  style={{overflowX: 'auto'}}>

                            <Table bordered hover size="sm" >
                                <tbody>
                                    {/* Vendor Personal Details */}
                                    <tr className="table-active">
                                        <th colSpan="4">Vendor Personal Details</th>
                                    </tr>
                                    <tr>
                                        <th>Vendor Name</th>
                                        <td>{vendor.name}</td>
                                        <th>Company</th>
                                        <td>{vendor.company}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{vendor.email}</td>
                                        <th>Phone</th>
                                        <td>{vendor.phone || "N/A"}</td>
                                    </tr>

                                    {/* Billing & Shipping Address */}
                                    <tr className="table-active">
                                        <th colSpan="2">Billing Address</th>
                                        <th colSpan="2">Shipping Address</th>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{vendor.billingAddress}</td>
                                        <th>Address</th>
                                        <td>{vendor.shippingAddress}</td>
                                    </tr>
                                    <tr>
                                        <th>City</th>
                                        <td>{vendor.city}</td>
                                        <th>City</th>
                                        <td>{vendor.city}</td>
                                    </tr>
                                    <tr>
                                        <th>State</th>
                                        <td>{vendor.state}</td>
                                        <th>State</th>
                                        <td>{vendor.state}</td>
                                    </tr>
                                    <tr>
                                        <th>Country</th>
                                        <td>{vendor.country}</td>
                                        <th>Country</th>
                                        <td>{vendor.country}</td>
                                    </tr>
                                    <tr>
                                        <th>Pincode</th>
                                        <td>{vendor.pincode}</td>
                                        <th>Pincode</th>
                                        <td>{vendor.pincode}</td>
                                    </tr>
                                    <tr>
                                        <th>Latitude</th>
                                        <td>{vendor.latitude}</td>
                                        <th>Latitude</th>
                                        <td>{vendor.latitude}</td>
                                    </tr>
                                    <tr>
                                        <th>Longitude</th>
                                        <td>{vendor.longitude}</td>
                                        <th>Longitude</th>
                                        <td>{vendor.longitude}</td>
                                    </tr>

                                    {/* Other Details */}
                                    <tr className="table-active">
                                        <th colSpan="4">Other Details</th>
                                    </tr>
                                    <tr>
                                        <th>Govt Id</th>
                                        <td>{vendor.govtId || "N/A"}</td>
                                        <th>Documents</th>
                                        <td>
                                            <img
                                                src={vendor.document}
                                                alt="Document"
                                                style={{ width: "100px", aspectRatio: "1", objectFit: "cover" }}
                                                onError={(e) => (e.target.src = vendor.document)}
                                            />
                                        </td>
                                    </tr>

                                    {/* Bank Details */}
                                    <tr className="table-active">
                                        <th colSpan="4">Bank Details</th>
                                    </tr>
                                    <tr>
                                        <th>Bank Name</th>
                                        <td>{vendor.bankName || "N/A"}</td>
                                        <th>Account No</th>
                                        <td>{vendor.accountNo}</td>
                                    </tr>
                                    <tr>
                                        <th>IFSC/SWIFT/BIC</th>
                                        <td>{vendor.ifsc || "N/A"}</td>
                                        <th>Account Type</th>
                                        <td>{vendor.accountType}</td>
                                    </tr>

                                    {/* Created & Modified At */}
                                    <tr className="table-active">
                                        <th>Created At</th>
                                        <td>{vendor.createdAt}</td>
                                        <th>Modified At</th>
                                        <td>{vendor.modifiedAt}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            </div>
                        </Col>
                    </Row>



                    
                </CardBody>


            </Card>
        </Container>

    );
};
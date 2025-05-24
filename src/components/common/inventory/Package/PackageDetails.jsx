import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";;
import sendMail from "/assets/inventory/Group.png";
import companylog from "/assets/inventory/companylogo.png";
import print from "/assets/inventory/Vector.png";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPackageDetails } from "../../../../store/slices/Inventory/packSlice";
// import { getSaPurchaseReceive } from "../../../store/slices/Inventory/prSlice";
// import { sendMailToVendor } from "../../../store/AdminSlice/Inventory/purchaseOrder";

export const PackageDetails = () => {

    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;
    const location = useLocation();
    const pack_id = location.state;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPackageDetails(pack_id));
    }, [dispatch]);

    const packData = useSelector(state => state.saPackage.selectedPackage);
    const loading = useSelector(state => state.saPackage).loading;

    const handleSendMail = () => {
        dispatch(sendMailToVendor(packData))
    }

    const handlePoNavigation = () => {
        const poId = packData?.refer_id?._id;
        navigate(`/admin/inventory/purchase-order-details`);
    }

    // count items
    const countItems = packData?.items;

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                </Spinner>
            </Container>
        );
    }

    return (
        <Container >
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="my-3">
                    <div style={{ top: "186px", fontSize: "18px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem><Link to="Inventory/Package/List">Sales Package List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Sales Package Details</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3">
                        <Row>
                            <Col sm={6} xs={12}>
                                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                    <span>Package No: </span>
                                    <span>{packData?.po_no}</span>
                                </h5>
                            </Col>
                            <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}
                                    onClick={() => window.print()}
                                >
                                    <Image src={print} className="me-2" /> Print
                                </Button>
                                <Button className="d-flex align-items-center" onClick={handleSendMail} style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={sendMail} className="me-2" /> Send Email
                                </Button>
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    {/* <Image src={sendMail} className="me-2" />  */}
                                    <Link to={`/Inventory/Shipment/${pack_id}`} className="text-decoration-none text-dark"><b >+</b>  Create Shipment </Link>
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Customer & Order Details */}
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            {/* Customer Info */}
                            <Col sm={4}  >
                                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>{packData?.vendor_id?.name}</h5>
                                <Row>
                                    <Col sm={6} >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                        <div className="my-3">{packData?.vendor_id?.address}</div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={8} >
                                <Row>
                                    {/* Delivery Details */}
                                    <Col sm={6}  >
                                        <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                        <div className="my-3">
                                            <span style={{ fontSize: '16px' }}>Styx Cafe</span><br />
                                            <span>{user?.email} / {user?.contact}</span>
                                            <span>{user?.billingAddress}, {user?.city1}, {user?.state1}, {user?.country1} </span>
                                            <span>PAN:</span> {user?.pan}
                                        </div>
                                    </Col>

                                    {/* Order Info */}
                                    <Col sm={6} >
                                        <div className="my-5 mx-2 border-start border-3 p-2 d-flex flex-column gap-2">
                                            <div><span className="my-1 fw-bold">Package No:</span> <span className="float-end">{packData?.po_no}</span></div>
                                            <div><span className="my-1 fw-bold" >Packing Date:<b className="float-end">{new Date(packData?.delivery_date).toLocaleDateString()}</b></span></div>
                                            <div><span className="my-1 fw-bold">Package Status:</span> <span className="float-end">{packData?.status}</span></div>
                                            <div><span className="my-1 fw-bold" style={{ cursor: 'pointer' }} onClick={handlePoNavigation}>Order No:<b className="text-primary float-end">{packData?.refer_id?.po_no}</b></span></div>
                                            <div><span className="my-1 fw-bold">Payment Terms:</span> <span className="float-end">{packData?.payment_terms}</span></div>
                                            {/* {new Date(delivery_datedelivery_date).toLocaleDateString()} */}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            <Col sm={12}>
                                <div className="table-responsive">
                                    <Table className="text-center align-middle">
                                        <thead className="text-start" >
                                            <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                                                <th className="fw-bold"  >PRODUCT</th>
                                                <th className="fw-bold" ></th>
                                                <th className="fw-bold" >QUANTITY</th>
                                                <th className="fw-bold" ></th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-start" >
                                            {countItems && countItems.length > 0 ? (
                                                countItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {/* <b>{item?.item_id?.name}</b> */}
                                                            <b><Link to={`/admin/inventory/item-details/${item?.item_id?._id}`}>
                                                                {item?.item_id?.name}</Link>
                                                            </b>
                                                            <br />
                                                            HSN : {item?.item_id?.hsn}
                                                        </td>
                                                        <td>
                                                            SKU : {item.item_id?.sku}
                                                        </td>
                                                        <td>
                                                            Ordered Qty  : {item?.quantity} Nos
                                                        </td>
                                                        <td>  Packed Qty :  {item?.qty_packed}</td>
                                                        <td>  Shipped Qty :  {item?.qty_shipped}</td>
                                                    </tr>))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No Items Found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            <Col sm={6} className="p-2 position-relative">
                                <div><b>Description : </b></div>
                                <div className="d-none d-sm-block" style={{ height: "2rem" }}>
                                    {packData?.description}
                                </div>
                            </Col>
                            <Col sm={6} className="p-2">
                                {/* Add any content here if needed */}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";;
import sendMail from "/assets/inventory/Group.png";
import companylog from "/assets/inventory/companylogo.png";
import print from "/assets/inventory/Vector.png";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPurchaseReceive } from "../../../../store/AdminSlice/Inventory/purchaseReceive";
import { useEffect } from "react";
import { sendMailToVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder";

export const PurchaseReceivedDetails = () => {

    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getPurchaseReceive(purchaseReceive));
    }, [dispatch, cafeId]);

    const POIdGet = useSelector(state => state.purchaseReceiveSlice);
    const loading = POIdGet.loading;
    const location = useLocation();
    const purchaseReceive = location.state;

    const handleSendMail = () => {
        dispatch(sendMailToVendor(POIdGet?.selectedItem))
    }

    const handlePoNavigation = () => {
        const poId = POIdGet?.selectedItem?.refer_id?._id;
        navigate(`/admin/inventory/purchase-order-details`);
    }

    // count items
    const countItems = POIdGet?.selectedItem?.items;

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
                            <BreadcrumbItem><Link to="admin/inventory/purchaseReceived">Purchase Order  List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Purchase Order Details</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3">
                        <Row>
                            <Col sm={6} xs={12}>
                                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                    <span>Purchase Receive: </span>
                                    <span>{POIdGet?.selectedItem?.po_no}</span>
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
                                    <Link to={`/admin/inventory/GenerateBill/${POIdGet?.selectedItem?._id}`} className="text-decoration-none text-dark"><b >+</b>  Create Bill </Link>
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Company Info */}
                {/* <Col sm={12} className="my-2">
                    <Card className="p-3">
                        <Row className="align-items-center">
                            <Col sm={2}>
                                <img src={companylog} alt="Logo" className="img-fluid" />
                            </Col>
                            <Col sm={8}>
                                <h5>{userName}</h5>
                                <p className="mb-1">{userEmail}/ {UserContactN}</p>
                                <p className="mb-1">
                                    {UserAddress}
                                </p>
                                <strong>PAN: {UesrPAN}</strong>
                            </Col>
                            <Col sm={2} className=" d-flex  ">
                                <span className="p-2 float-right">PO:<b className="text-primary">Draft</b></span>
                            </Col>
                        </Row>
                    </Card>
                </Col> */}

                {/* Customer & Order Details */}
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            {/* Customer Info */}
                            <Col sm={4}  >
                                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>{POIdGet?.selectedItem?.vendor_id?.name}</h5>
                                <Row>
                                    <Col sm={6} >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                        <p className="my-3">{POIdGet?.selectedItem?.vendor_id?.billingAddress}</p>
                                    </Col>

                                    <Col sm={6} className="border-end border-3" >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                        <p className="my-3">{POIdGet?.selectedItem?.vendor_id?.shippingAddress}</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={8} >
                                <Row>
                                    {/* Delivery Details */}
                                    <Col sm={6}  >
                                        <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                        <p className="my-3">
                                            <span style={{ fontSize: '16px' }}>Linganwar</span><br />
                                            <span>yash123linganwar@gmail.com / 91562173745</span>
                                            <span>Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</span>
                                            <span>PAN:</span> ADNP5467B
                                        </p>
                                    </Col>

                                    {/* Order Info */}
                                    <Col sm={6} >
                                        <p className="my-5 mx-2 border-start border-3 p-2">
                                            <p><span className="my-1 fw-bold">Received No:</span> <span className="float-end">{POIdGet?.selectedItem?.po_no}</span></p>
                                            <p><span className="my-1 fw-bold" style={{ cursor: 'pointer' }} onClick={handlePoNavigation}>Order No:<b className="text-primary float-end">{POIdGet?.selectedItem?.refer_id?.po_no}</b></span></p>
                                            <p><span className="my-1 fw-bold">Received No:</span> <span className="float-end">{POIdGet?.selectedItem?.po_no}</span></p>
                                            {/* {new Date(delivery_datedelivery_date).toLocaleDateString()} */}
                                            <p>
                                                <span className="my-1 fw-bold">Received Date :</span>{' '}
                                                <span className="float-end">{new Date(POIdGet?.selectedItem?.delivery_date).toLocaleDateString()}</span>
                                            </p>
                                        </p>
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
                                                    <tr>
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
                                                        <td>  Received Qty :  {item?.qty_received}</td>
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
                                <p><b>Description : </b></p>
                                <div className="d-none d-sm-block" style={{ height: "2rem" }}>
                                    {POIdGet?.selectedItem?.description}
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
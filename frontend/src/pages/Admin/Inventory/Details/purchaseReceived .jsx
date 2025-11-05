import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";;
import sendMail from "/assets/inventory/Group.png";
import companylog from "/assets/inventory/companylogo.png";
import print from "/assets/inventory/Vector.png";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPurchaseReceive } from "../../../../store/AdminSlice/Inventory/purchaseReceive";
import { useEffect, useState } from "react";
import { getStyxData, sendMailToVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { Breadcrumbs } from "../../../../components/common/Breadcrumbs/Breadcrumbs";

export const PurchaseReceivedDetails = () => {
    const [vendor, setVendor] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const cafeId = user?._id;
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStyxData());
        dispatch(getPurchaseReceive(purchaseReceive));
    }, [dispatch, cafeId]);

    useEffect(() => {
        if (POIdGet?.selectedItem?.vendor_id) {
            setVendor(POIdGet?.selectedItem?.vendor_id)
        }
        POIdGet?.selectedItem?.vendor_id
    }, [])

    const POIdGet = useSelector(state => state.purchaseReceiveSlice);
    const { styxData } = useSelector(state => state.purchaseOrder);
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

    const handlePrint = () => {
        const printContent = document.getElementById('printableArea');
        const originalContents = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        // Add necessary styles for printing
        printWindow.document.write(`
            <html>
                <head>
                    <title>Purchase Receive: ${POIdGet?.selectedItem?.po_no}</title>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .print-header { text-align: center; margin-bottom: 20px; }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container mt-4">
                        <div class="print-header">
                            <h3>Purchase Receive: ${POIdGet?.selectedItem?.po_no}</h3>
                        </div>
                        ${printContent.innerHTML}
                        <div class="row mt-4 no-print">
                            <div class="col-12 text-center">
                                <button onclick="window.print()" class="btn btn-primary">Print</button>
                                <button onclick="window.close()" class="btn btn-secondary ms-2">Close</button>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
    };

    return (
        <Container fluid >
            <Breadcrumbs
                items={[
                    { label: "Home", path: "/admin/dashboard" },
                    { label: "Purchase Receive List", path: "/admin/inventory/purchase-receive-list" },
                    { label: "Details", active: true }
                ]}
            />
            <Row>
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
                                    onClick={handlePrint}
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
            </Row>
            <Row id="printableArea">
                {/* Breadcrumb Section */}

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
                                    {/* <Col sm={6} >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                        <p className="my-3">{POIdGet?.selectedItem?.vendor_id?.billingAddress}</p>
                                    </Col>

                                    <Col sm={6} className="border-end border-3" >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                        <p className="my-3">{POIdGet?.selectedItem?.vendor_id?.shippingAddress}</p>
                                    </Col> */}

                                    {vendor && <Col sm={6} >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                        <p className="my-1">{vendor?.billingAddress}</p>
                                        <p className="my-1">{vendor?.city1}</p>
                                        <p className="my-1">{vendor?.state1}</p>
                                        <p className="my-1">{vendor?.pincode1}</p>
                                        <p className="my-1">{vendor?.country1}</p>
                                    </Col>}

                                    {!vendor && <Col sm={6} >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                        <p className="my-1">{styxData?.billingAddress}</p>
                                        <p className="my-1">{styxData?.city1}</p>
                                        <p className="my-1">{styxData?.state1}</p>
                                        <p className="my-1">{styxData?.pincode1}</p>
                                        <p className="my-1">{styxData?.country1}</p>
                                    </Col>}

                                    {vendor && <Col sm={6} className="border-end border-3" >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                        <p className="my-1">{vendor?.shippingAddress}</p>
                                        <p className="my-1">{vendor?.city2}</p>
                                        <p className="my-1">{vendor?.state2}</p>
                                        <p className="my-1">{vendor?.pincode2}</p>
                                        <p className="my-1">{vendor?.country2}</p>
                                    </Col>}

                                    {!vendor && <Col sm={6} className="border-end border-3" >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                        <p className="my-1">{styxData?.shippingAddress}</p>
                                        <p className="my-1">{styxData?.city2}</p>
                                        <p className="my-1">{styxData?.state2}</p>
                                        <p className="my-1">{styxData?.pincode2}</p>
                                        <p className="my-1">{styxData?.country2}</p>
                                    </Col>}
                                </Row>
                            </Col>
                            <Col sm={8} >
                                <Row>
                                    {/* Delivery Details */}
                                    <Col sm={6}  >
                                        <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                        {/* <p className="my-3">
                                            <span style={{ fontSize: '16px' }}>Linganwar</span><br />
                                            <span>yash123linganwar@gmail.com / 91562173745</span>
                                            <span>Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</span>
                                            <span>PAN:</span> ADNP5467B
                                        </p> */}
                                        {POIdGet?.selectedItem?.refer_id?.delivery_type === 'Organization' ?
                                            <p className="my-3">{UserAddress}
                                                <span style={{ fontSize: '16px' }}>{userName}</span><br />
                                                <span>{userEmail} / {UserContactN}</span>
                                                <br />
                                                <span>{UserAddress}</span>
                                                <br />
                                                <span>PAN:</span> {UesrPAN}
                                            </p>
                                            :
                                            <p className="my-3">
                                                <span style={{ fontSize: '16px' }}>{POIdGet?.selectedItem?.customer_id?.name}</span><br />
                                                <span>{POIdGet?.selectedItem?.customer_id?.address} / {POIdGet?.selectedItem?.customer_id?.contact_no}</span>
                                            </p>
                                        }
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
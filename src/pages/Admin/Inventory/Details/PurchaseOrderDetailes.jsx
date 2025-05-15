import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";
import deleteplogo from "/assets/inventory/Vector (1).png";
import receive from "/assets/inventory/solar_card-send-linear.png";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import companylog from "/assets/inventory/companylogo.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPurchaseOrder, sendMailToVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder";

const PurchaseOrderDetails = () => {
    const [vendor, setVendor] = useState("");
    const [items, setItems] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [discount, setDiscount] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const purchaseOrder = location.state;
    const selectedPo = useSelector((state) => state.purchaseOrder.selectedPo);
    const loading = useSelector((state) => state.purchaseOrder.loading);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const POId = purchaseOrder?._id;

    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    useEffect(() => {
        dispatch(GetPurchaseOrder(POId));
    }, [dispatch]);

    useEffect(() => {
        if (selectedPo) {
            setVendor(selectedPo?.vendor_id);
            setItems(selectedPo?.items);
            setTaxes(selectedPo?.tax);

            const discountValue = selectedPo?.discount_type === "percentage" ? (selectedPo?.discount_value * selectedPo?.subtotal / 100) : selectedPo?.discount_value;
            setDiscount(Math.round(discountValue));
        }
    }, [selectedPo]);

    const handleSendMail = () => {
       dispatch(sendMailToVendor(selectedPo));
    }

    const handleReceive = () => {
        // Handle receive action here
        navigate("/admin/inventory/purchaseReceivedCreate", { state: selectedPo });
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
                    <title>Sales Order: ${selectedPo.po_no}</title>
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
                            <h3>Sales Order: ${selectedPo.po_no}</h3>
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

    if (loading) {
        return (
          <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinner animation="border" role="status">
            </Spinner>
          </Container>
        );
      }

    return (
        <Container id="printableArea">
            <Row  data-aos="fade-up" data-aos-duration="500" className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="my-3">
                    <div style={{ top: "186px", fontSize: "18px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem ><Link to="/admin/dashboard">Home</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/admin/inventory/purchase-order-list">Purchase Order List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Purchase Order Details</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col sm={12} className="my-2">
                    <Card  className="p-3">
                        <Row>
                            <Col sm={6} xs={12}>
                                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                    <span>Purchase Order  :  </span>
                                    <span> {selectedPo?.po_no}</span>
                                </h5>
                            </Col>
                            <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                                <Button className="d-flex align-items-center 	" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}
                                    //  onClick={handlePrint}
                                    onClick={handlePrint}
                                >
                                    <Image src={print} className="me-2" /> Print
                                </Button>
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }} onClick={handleSendMail}>
                                    <Image src={sendMail} className="me-2" /> Send Email
                                </Button>
                                {selectedPo?.status !== "Received" && <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }} onClick={handleReceive}>
                                    <Image src={receive} className="me-2" /> Receive
                                </Button>}
                                {selectedPo?.status !== "Received" && <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Link to={`/admin/inventory/PurchaseOrderUpdate/${POId}`} >
                                        <Image src={editlogo} className="me-2" /> Edit
                                    </Link>
                                </Button>}
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={deleteplogo} />
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
                                <p className="mb-1">{userEmail} / {UserContactN}</p>
                                <p className="mb-1">
                                    {UserAddress}
                                </p>
                                <strong>PAN: {UesrPAN}</strong>
                            </Col>
                            <Col sm={2} className=" d-flex  ">
                                <span className="p-2 float-right">PO : <b className="text-primary">{selectedPo?.status}</b></span>
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
                                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>{selectedPo?.vendor_id?.name}</h5>
                                <Row>
                                    <Col sm={6} >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                        <p className="my-1">{vendor?.billingAddress}</p>
                                        <p className="my-1">{vendor?.city1}</p>
                                        <p className="my-1">{vendor?.state1}</p>
                                        <p className="my-1">{vendor?.pincode1}</p>
                                        <p className="my-1">{vendor?.country1}</p>
                                    </Col>

                                    <Col sm={6} className="border-end border-3" >
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                        <p className="my-1">{vendor?.shippingAddress}</p>
                                        <p className="my-1">{vendor?.city2}</p>
                                        <p className="my-1">{vendor?.state2}</p>
                                        <p className="my-1">{vendor?.pincode2}</p>
                                        <p className="my-1">{vendor?.country2}</p>
                                    </Col>
                                </Row>
                            </Col>

                            <Col sm={8} >
                                <Row>
                                    {/* Delivery Details */}
                                    <Col sm={6} className="pt-6" >
                                        <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                        {selectedPo?.delivery_type === 'Organization' ?
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
                                                <span style={{ fontSize: '16px' }}>{selectedPo?.customer_id?.name}</span><br />
                                                <span>{selectedPo?.customer_id?.address} / {selectedPo?.customer_id?.contact_no}</span>
                                            </p>
                                        }
                                    </Col>
                                    {/* Order Info */}
                                    <Col sm={6} >
                                        <span className="mb-3 float-end" style={{ fontSize: '16px', fontWeight: '500' }}>Order No : <b className="text-primary"> {selectedPo?.po_no}</b></span>
                                        <p className="my-5 mx-2 border-start border-3 p-2">
                                            <p><span className="my-1 fw-bold">Expected Delivery:</span> {new Date(selectedPo?.delivery_date).toLocaleDateString()}</p>
                                            <p><span className="my-1 fw-bold">Payment Terms:</span> {selectedPo?.payment_terms}</p>
                                            <p><span className="my-1 fw-bold">Reference:</span> {selectedPo?.reference}</p>
                                            <p><span className="my-1 fw-bold">Shipment Preference:</span> {selectedPo?.shipment_preference}</p>
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
                                                <th className="fw-bold" >QUANTITY</th>
                                                <th className="fw-bold" >PRICE</th>
                                                <th className="fw-bold" >TAX</th>
                                                <th className="fw-bold" >TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-start" >
                                            {items.length > 0 && items.map((item, index) => (
                                                <tr>
                                                    <td>
                                                        <b><Link to={`/admin/inventory/item-details/${item?.item_id?._id}`}>{item?.item_id?.name}</Link></b>
                                                        <br />
                                                        HSN : {item?.hsn}
                                                    </td>
                                                    <td>
                                                        SKU : {item?.sku} <br />
                                                        Qty : {item?.quantity} Nos
                                                    </td>
                                                    <td>Price : &#8377; {item?.price}</td>
                                                    <td>{item?.tax?.tax_name}:{item?.tax?.tax_rate}%</td>
                                                    <td>Total : &#8377; {item?.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-4 border-top border-3 p-2">
                            <Col sm={6} className="border-end border-3">
                                <p>
                                    <b>Description:</b>  {selectedPo?.description}
                                </p>
                            </Col>
                            <Col sm={6} className="text-end">
                                <Table className="text-end">
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold text-start">Subtotal:</td>
                                            <td>&#8377; {selectedPo?.subtotal}</td>
                                        </tr>
                                        {selectedPo?.discount_value > 0 && <tr>
                                            <td className="fw-bold text-start">Discount{selectedPo?.discount_type === "Percentage" && <>({selectedPo?.discount_value})</>}:</td>
                                            <td>
                                                <span className="text-secondary" style={{ cursor: "pointer" }}>
                                                    {discount.toFixed(2)}
                                                </span>{" "}
                                            </td>
                                        </tr>}
                                        {taxes.length > 0 && taxes.map((tax, index) => (
                                            <tr>  <td className="fw-bold text-start" key={index}>{tax?.tax_name} ({tax?.tax_rate}%):</td>
                                                <td className="fw-bold text-end" key={index}>{Math.round((selectedPo?.subtotal - discount) * tax?.tax_rate / 100).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="fw-bold text-start">Total:</td>
                                            <td>&#8377; {purchaseOrder?.total.toFixed(2)}</td>
                                        </tr>
                                        {selectedPo?.adjustment_note && <tr>
                                            <td className="fw-bold text-start">{purchaseOrder?.adjustment_note}
                                            </td>
                                            <td> &#8377; {selectedPo?.adjustment_amount}</td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* <Col sm={12} className="my-2">
    <Card className=" p-3 shadow-sm">
        <h5 className=" mb-3" style={{ fontSize:'20px' }}>Receive & Payment Details</h5>
        <div className="table-responsive">

        <Table className="text-center align-middle">
        <thead >
          <tr  style={{ borderBottom: "2px solid #dee2e6",borderTop: "2px solid #dee2e6" }}>
            <th className="fw-bold">#</th>
            <th className="fw-bold">Date</th>
            <th className="fw-bold">Amount</th>
            <th className="fw-bold">Mode</th>
            <th className="fw-bold">Transaction</th>
           
            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
            1
            </td>
            
            <td>{delivery_datedelivery_date}</td>
            <td>5610</td>
            <td>
            online
            </td>
            <td>UPI</td>
            
          </tr>
        </tbody>
      </Table>

        </div>
    </Card>
</Col> */}

            </Row>

        </Container>
    )
};

export default PurchaseOrderDetails;

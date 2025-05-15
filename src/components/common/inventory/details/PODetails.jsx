// import { Button, Card, CardBody, CardHeader, Col, Container, Image, Row, Table } from "react-bootstrap"
// import { BsFillPrinterFill } from "react-icons/bs"
// import { FaBoxOpen } from "react-icons/fa"
// import { IoArrowBackOutline } from "react-icons/io5"
// import { MdDelete } from "react-icons/md"
// import { RiEditFill } from "react-icons/ri"

// export const PODetails = () => {
//     return (
//         <Container className="text-center">
//             <Row>
//                 <div className="d-flex justify-content-center align-items-center">
//                     <h1>Purchase Order Details</h1>
//                 </div>
//                 <Col md={12} className="my-4">
//                     <Card>
//                         <CardHeader as="h5">
//                             <Row >
//                                 <Col sm={6} className="d-flex justify-content-start">
//                                     <h3 className="fw-bold txt-start">Purchase Order : PO-009</h3>
//                                 </Col>
//                                 <Col sm={6} className="d-flex justify-content-end">
//                                     <div className="d-flex flex-wrap gap-2">
//                                         {/* <Button variant="outline-dark"><IoArrowBackOutline className="me-2"/>Back</Button> */}
//                                         <Button variant="success"><BsFillPrinterFill className="me-2" />Print</Button>
//                                         <Button variant="outline-dark">Send Mail</Button>
//                                         <Button variant="outline-dark"><FaBoxOpen className="me-2" />Receive</Button>
//                                         <Button variant="success"><RiEditFill className="me-2" />Edit</Button>
//                                         <Button variant="danger"><MdDelete /></Button>
//                                     </div>
//                                 </Col>


//                             </Row>
//                         </CardHeader>
//                         <CardBody>
//                             {/* style={{ backgroundColor: "#c3edf3" }} */}
//                             <Row >
//                                 <Col sm={2} className="d-flex justify-content-center" >
//                                     <Image src="https://fsm.lockene.net/uploads/logo/favicon.png" style={{ width: "65px", height: "65px ", objectFit: "cover", marginTop: "20px" }} />
//                                 </Col>
//                                 <Col sm={7} className="d-flex justify-content-start" >
//                                     <div className="d-flex flex-column justify-content-start text-start my-1">
//                                         <p className="fw-bold">Lockene</p>
//                                         <p className="my-1">yash123linganwar@gmail.com / 91562173745</p>
//                                         <p className="my-1">Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</p>
//                                         <p className="my-1">Pune Division, Maharashtra-411058, India</p>
//                                         <p className="my-1"><b>PAN </b>: ADNP5467B</p>
//                                     </div>
//                                 </Col>
//                                 <Col sm={3} className="d-flex justify-content-end py-0 my-0"  >
//                                     <p className="my-1"><b>Po :</b> "Draft"</p>
//                                 </Col>

//                                 <hr className=" bg-dark" />

//                                 <Col sm={5} className="d-flex flex-column text-start">
//                                     <h3 className="fw-bold">Rupesh Suryvanshi</h3>

//                                     <div className="mt-2 table-responsive">
//                                         <Table className="mb-0">
//                                             <thead className="border-top border-bottom  border-dark">
//                                                 <tr>
//                                                     <th className="fw-bold ">Billing Address</th>
//                                                     <th className="fw-bold">Shipping Address
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 <tr>

//                                                     <td>Nagpur Division	Nagpur Division
//                                                         Maharashtra	Maharashtra
//                                                         India
//                                                     </td>
//                                                     <td> Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</td>
//                                                 </tr>

//                                             </tbody>
//                                         </Table>
//                                     </div>
//                                 </Col>
//                                 <Col sm={7} className="d-flex flex-column text-start">

//                                     <Row className="bg-light">
//                                         <Col sm={5} className="d-flex flex-column text-start mt-3">

//                                             <h4 className="text-decoration-underline">Delivery Address</h4>
//                                             <div className="d-flex flex-column justify-content-start text-start">
//                                                 <p className="fw-bold">Lockene</p>
//                                                 <p className="my-1">yash123linganwar@gmail.com / 91562173745</p>
//                                                 <p className="my-1">Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</p>
//                                                 <p className="my-1">Pune Division, Maharashtra-411058, India</p>
//                                                 <p className="my-1"><b>PAN </b>: ADNP5467B</p>
//                                             </div>

//                                         </Col>
//                                         <Col sm={7} className="d-flex flex-column text-start mt-3">

//                                             <h4>Order No : PO-009</h4>
//                                             <hr className="my-3 bg-dark" />

//                                             <div>
//                                                 <Table>
//                                                     <tbody>
//                                                         <tr>
//                                                             <td className="fw-bold">Expected Delivery:</td>
//                                                             <td>
//                                                                 Feb 19, 2025
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td className="fw-bold">Payment Terms:</td>
//                                                             <td>
//                                                                 checque

//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td className="fw-bold">Reference:</td>
//                                                             <td>
//                                                                 Nagpur

//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td className="fw-bold">Shipment Preference:</td>
//                                                             <td>
//                                                                 Chandrapur

//                                                             </td>
//                                                         </tr>
//                                                     </tbody>
//                                                 </Table>
//                                             </div>
//                                         </Col>
//                                     </Row>

//                                 </Col>

//                             </Row>
//                             <Row className="bg-white fw-bold py-2 my-2 text-start" id="lineitem_title" style={{ borderBottom: "2px solid #c3edf3", borderTop: "2px solid #c3edf3" }}>
//                                 <Col sm={4} xs={12} className="py-2">PRODUCT</Col>
//                                 <Col sm={2} xs={6} className="py-2">QTY</Col>
//                                 <Col sm={2} xs={6} className="py-2">PRICE</Col>
//                                 <Col sm={2} xs={6} className="py-2">TAX</Col>
//                                 <Col sm={2} xs={6} className="py-2 ">TOTAL</Col>
//                             </Row>
//                             <Row className="bg-white py-1 tetxt-start" style={{ borderBottom: "1px solid #c3edf3" }}>
//                                 <Col sm={4} xs={12} className="text-start">
//                                     <b>Television</b>
//                                     <span className="float-end">SKU : 646546</span>
//                                     <br />
//                                     HSN : 54654
//                                 </Col>
//                                 <Col sm={2} xs={4}>Qty : 50 Nos</Col>
//                                 <Col sm={2} xs={4}>Price : ₹7000</Col>
//                                 <Col sm={2} xs={4}>GST (10%)</Col>
//                                 <Col sm={2} xs={12}>
//                                     <h6 className="text-end">Total : ₹385000</h6>
//                                 </Col>
//                             </Row>

//                             <Row className="bg-white">
//                                 {/* Description Section */}
//                                 <Col sm={6} className="p-2 position-relative">
//                                     <p><b>Description: </b>ccc</p>
//                                     <div className="d-none d-sm-block" style={{ height: "2rem" }}></div>
//                                 </Col>

//                                 {/* Pricing Summary Section */}
//                                 <Col sm={6} className="p-2">
//                                     <Row style={{ borderLeft: "1px solid #c3edf3" }}>
//                                         {/* Subtotal */}
//                                         <Col xs={6} className="py-2">Subtotal</Col>
//                                         <Col xs={6} className="py-2 text-end">₹ 385000</Col>
//                                         <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

//                                         {/* Discount */}
//                                         <Col xs={6} className="py-2 pb-3">Discount <b>5%</b></Col>
//                                         <Col xs={6} className="py-2 text-end">₹ 19250</Col>
//                                         <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

//                                         {/* Tax */}
//                                         <Col xs={6} className="py-2">Tax</Col>
//                                         <Col xs={6} className="py-2 text-end">
//                                             <ul className="m-0"><li>GST (10%)</li></ul>
//                                         </Col>
//                                         <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

//                                         {/* Total */}
//                                         <Col xs={6} className="py-2">Total</Col>
//                                         <Col xs={6} className="py-2 text-end">₹ 402000</Col>
//                                         <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

//                                         {/* Round Off */}
//                                         <Col xs={6} className="py-2">Round</Col>
//                                         <Col xs={6} className="py-2 text-end">₹ -325</Col>
//                                     </Row>
//                                 </Col>
//                             </Row>

//                             <Row style={{ border: "1px solid #c3edf3" }}>
//                                 {/* Header Section */}
//                                 <Col xs={12} className="bg-white p-2">
//                                     <h4>Terms and Condition &amp; Attachments</h4>
//                                 </Col>

//                                 {/* Terms Section */}
//                                 <Col sm={6} className="p-2 mb-2">
//                                     <h6 className="text-start">ccc</h6>
//                                 </Col>

//                                 {/* Attachments Section */}
//                                 <Col sm={6} className="p-2 mb-2">
//                                     <Row>
//                                         <Col xs={3} className="mb-2">
//                                             <img
//                                                 src="https://fsm.lockene.net/uploads/driver/d9c42d059c1a50c02e64a61538121a75_0.jpg"
//                                                 className="img-preview rounded-2"
//                                                 style={{ width: "100px", aspectRatio: "1", objectFit: "cover" }}
//                                                 alt="Attachment"
//                                             />
//                                         </Col>
//                                     </Row>
//                                 </Col>
//                             </Row>
//                         </CardBody>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     )
// }

























































import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";
import deleteplogo from "/assets/inventory/Vector (1).png";
import receive from "/assets/inventory/solar_card-send-linear.png";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPurchaseOrder, sendMailToVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder";

export const PODetails = () => {

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
        navigate("/Inventory/PurchaseReceivedCreate", { state: selectedPo });
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
                                    <Link to={`/Inventory/PurchaseOrder/Edit/${POId}`} >
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

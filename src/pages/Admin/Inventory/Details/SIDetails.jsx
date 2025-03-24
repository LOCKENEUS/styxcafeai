import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Table } from "react-bootstrap";
import deleteplogo from "/assets/inventory/Vector (1).png";
import receive from "/assets/inventory/solar_card-send-linear.png";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import companylog from "/assets/inventory/companylogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSOInvoiceById } from "../../../../store/AdminSlice/Inventory/SoInvoiceSlice";
import CollectPayment from "../modal/CollectPayment";


export const SIDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [openPaymentModel , setOpenPaymentModel] = useState(false)
    const { selectedInvoice: invoice, loading } = useSelector((state) => state.soInvoice);

    useEffect(() => {
        if (id) {
            dispatch(getSOInvoiceById(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!invoice) {
        return <div>No invoice found</div>;
    }

    return (
        <Container>
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="my-3">
                    <div style={{ top: "186px", fontSize: "18px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem href="#">Sales</BreadcrumbItem>
                            <BreadcrumbItem ><Link to="/admin/Inventory/SaleInvoice">Sales Invoice List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Sales Invoice</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3">
                        <Row>
                            <Col sm={6} xs={12}>
                                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                    <span>Sales Invoice : </span>
                                    <span>{invoice.so_no}</span>
                                </h5>
                            </Col>
                            <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={print} className="me-2" /> Print
                                </Button>
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={sendMail} className="me-2" /> Send Email
                                </Button>
                                {/* <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={receive} className="me-2" /> Receive
                                </Button> */}
                                <Button
                                onClick={()=> navigate( `/admin/Inventory/InvoiceCreate/${invoice._id}`) }
                                    className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={editlogo} className="me-2" /> Edit 
                                </Button>
                                {/* <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={deleteplogo} />
                                </Button> */}
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Company Info Card */}
                <Col sm={12} className="my-2">
                    <Card className="p-3">
                        <Row className="align-items-center">
                            <Col sm={2}>
                                <img src={companylog} alt="Logo" className="img-fluid" />
                            </Col>
                            <Col sm={8}>
                                <h5>Linganwar</h5>
                                <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
                                <p className="mb-1">
                                    Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India
                                </p>
                                <strong>PAN: ADNP5467B</strong>
                            </Col>
                            <Col sm={2} className="d-flex">
                                <span className="p-2 float-right">Status: <b className="text-primary">{invoice.status || 'Draft'}</b></span>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Customer Info and Invoice Details */}
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            <Col sm={6}>
                                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>
                                    {invoice.customer_id?.name || 'Customer Name'}
                                </h5>
                                <h5>Address</h5>
                                <p className="mb-1">  
                                  {invoice.customer_id?.address || "N/A"}
                                </p>
                                <div className="mt-3">
                                <p className="mb-1">
                                  <span style={{fontWeight:"700" }} className="me-2">City :</span> {
                                  invoice.customer_id?.city || "N/A"
      
                                  }
                                </p>
                                <p className="mb-1 mt-2">
                                <span style={{fontWeight:"700" }} className="me-2">State :</span>   {
                                
                                invoice.customer_id?.state || "N/A"
                                
                                }
                                </p>
                                <p className="mb-1 mt-2">
                                <span style={{fontWeight:"700" }} className="me-2">Country :</span>   {invoice.customer_id?.country || "N/A"}
                                </p>
                                </div>
                                
                            </Col>

                            <Col sm={6}>
                                <div className="p-3"></div>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <th>Sales Invoice No</th>
                                            <th>{invoice.so_no}</th>
                                        </tr>
                                        <tr>
                                            <th>Invoice Date</th>
                                            <th>{new Date(invoice.date).toLocaleDateString()}</th>
                                        </tr>
                                        <tr>
                                            <th>Payment Terms:</th>
                                            <th>{invoice.payment_terms || '--'}</th>
                                        </tr>
                                        <tr>
                                            <th>Reference:</th>
                                            <th>{invoice.reference || '--'}</th>
                                        </tr>
                                        <tr>
                                            <th>Sales Person:</th>
                                            <th>{invoice.sales_person || '- - - (Unknown)'}</th>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Items Table */}
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            <Col sm={12}>
                                <div className="table-responsive">
                                    <Table className="text-center align-middle">
                                        <thead className="text-start">
                                            <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                                                <th className="fw-bold">PRODUCT</th>
                                                <th className="fw-bold">QUANTITY</th>
                                                <th className="fw-bold">PRICE</th>
                                                <th className="fw-bold">TAX</th>
                                                <th className="fw-bold">TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-start">
                                            {invoice.items.map((item) => (
                                                <tr key={item._id}>
                                                    <td>
                                                        <b>{item?.item_id?.name}</b>
                                                        <br />
                                                        HSN: {item?.item_id?.hsn}
                                                    </td>
                                                    <td>
                                                        Qty: {item?.quantity} Nos
                                                    </td>
                                                    <td>Price: ₹{item?.price}</td>
                                                    <td>{item?.tax?.tax_rate}%</td>
                                                    <td>Total: ₹{item?.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>

                        {/* Totals Section */}
                        <Row className="mt-4 border-top border-3 p-2">
                            <Col sm={6} className="border-end border-3">
                                <p>
                                    <b>Description:</b> {invoice.description}
                                </p>
                            </Col>
                            <Col sm={6} className="text-end">
                                <Table>
                                    <tbody>
                                        <tr>
                                            <th className="text-start">Subtotal:</th>
                                            <th>₹{invoice.subtotal}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-start">Discount {invoice.discount_value}%:</th>
                                            <th>₹{(invoice.subtotal * invoice.discount_value / 100).toFixed(2)}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-start">Tax</th>
                                            <th>
                                                {invoice.tax.map(tax => 
                                                    `${tax.tax_name} (${tax.tax_rate}%)`
                                                ).join(' + ')}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="text-start">Total</th>
                                            <th>₹{invoice.total}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-start">Adjustment ({invoice.adjustment_note})</th>
                                            <th>₹{invoice.adjustment_amount}</th>
                                        </tr>
                                        <tr className="border-top border-3">
                                            <th className="text-start">Balance</th>
                                            <th>
                                                <Button
                                                onClick={()=> setOpenPaymentModel(true)}
                                                variant="outline-success">
                                                    Collect ₹{invoice.total}
                                                </Button>
                                                
                                                 <CollectPayment    show={ openPaymentModel}
                                                  handleClose={() => setOpenPaymentModel(false)}
                                                   maxAmount={invoice.total} />
   
                                               
                                            </th>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card>
                </Col>

              
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <h5 className="mb-3" style={{ fontSize: '20px' }}>Terms and Condition </h5>
                        <div className="table-responsive">
                          { <b>{invoice.internal_team_notes}</b>}
                        </div>
                    </Card>
                </Col>

{/* 
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <h5 className="mb-3" style={{ fontSize: '20px' }}>Package Details</h5>
                        <div className="table-responsive">
                            <Table className="text-center align-middle">
                                <thead>
                                    <tr style={{ borderBottom: "2px solid #dee2e6", borderTop: "2px solid #dee2e6" }}>
                                        <th className="fw-bold">#</th>
                                        <th className="fw-bold">Package No</th>
                                        <th className="fw-bold">Packing Date</th>
                                        <th className="fw-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            1
                                        </td>
                                        <td>
                                            PACK-005
                                        </td>
                                        <td>Feb 13, 2025</td>
                                        <td>Draft</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <h5 className="mb-3" style={{ fontSize: '20px' }}>Shipment Details</h5>
                        <div className="table-responsive">
                            <Table className="text-center align-middle">
                                <thead>
                                    <tr style={{ borderBottom: "2px solid #dee2e6", borderTop: "2px solid #dee2e6" }}>
                                        <th className="fw-bold">#</th>
                                        <th className="fw-bold">Shipping No</th>
                                        <th className="fw-bold">Shipping Date</th>
                                        <th className="fw-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            1
                                        </td>
                                        <td>
                                            PACK-005
                                        </td>
                                        <td>Feb 13, 2025</td>
                                        <td>Draft</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col> */}
            </Row>
        </Container>
    );
};
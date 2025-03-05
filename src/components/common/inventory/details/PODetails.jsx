import { Button, Card, CardBody, CardHeader, Col, Container, Image, Row, Table } from "react-bootstrap"
import { BsFillPrinterFill } from "react-icons/bs"
import { FaBoxOpen } from "react-icons/fa"
import { IoArrowBackOutline } from "react-icons/io5"
import { MdDelete } from "react-icons/md"
import { RiEditFill } from "react-icons/ri"

export const PODetails = () => {
    return (
        <Container className="text-center">

            <Row>
                <div className="d-flex justify-content-center align-items-center">
                    <h1>Purchase Order Details</h1>
                </div>
                <Col md={12} className="my-4">
                    <Card>
                        <CardHeader as="h5">
                            <Row >
                                <Col sm={6} className="d-flex justify-content-start">
                                    <h3 className="fw-bold txt-start">Purchase Order : PO-009</h3>
                                </Col>
                                <Col sm={6} className="d-flex justify-content-end">
                                    <div className="d-flex flex-wrap gap-2">
                                        {/* <Button variant="outline-dark"><IoArrowBackOutline className="me-2"/>Back</Button> */}
                                        <Button variant="success"><BsFillPrinterFill className="me-2" />Print</Button>
                                        <Button variant="outline-dark">Send Mail</Button>
                                        <Button variant="outline-dark"><FaBoxOpen className="me-2" />Receive</Button>
                                        <Button variant="success"><RiEditFill className="me-2" />Edit</Button>
                                        <Button variant="danger"><MdDelete /></Button>
                                    </div>
                                </Col>


                            </Row>
                        </CardHeader>
                        <CardBody>
                            {/* style={{ backgroundColor: "#c3edf3" }} */}
                            <Row >
                                <Col sm={2} className="d-flex justify-content-center" >
                                    <Image src="https://fsm.lockene.net/uploads/logo/favicon.png" style={{ width: "65px", height: "65px ", objectFit: "cover", marginTop: "20px" }} />
                                </Col>
                                <Col sm={7} className="d-flex justify-content-start" >
                                    <div className="d-flex flex-column justify-content-start text-start my-1">
                                        <p className="fw-bold">Lockene</p>
                                        <p className="my-1">yash123linganwar@gmail.com / 91562173745</p>
                                        <p className="my-1">Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</p>
                                        <p className="my-1">Pune Division, Maharashtra-411058, India</p>
                                        <p className="my-1"><b>PAN </b>: ADNP5467B</p>
                                    </div>
                                </Col>
                                <Col sm={3} className="d-flex justify-content-end py-0 my-0"  >
                                    <p className="my-1"><b>Po :</b> "Draft"</p>
                                </Col>

                                <hr className=" bg-dark" />

                                <Col sm={5} className="d-flex flex-column text-start">
                                    <h3 className="fw-bold">Rupesh Suryvanshi</h3>

                                    <div className="mt-2 table-responsive">
                                        <Table className="mb-0">
                                            <thead className="border-top border-bottom  border-dark">
                                                <tr>
                                                    <th className="fw-bold ">Billing Address</th>
                                                    <th className="fw-bold">Shipping Address
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>

                                                    <td>Nagpur Division	Nagpur Division
                                                        Maharashtra	Maharashtra
                                                        India
                                                    </td>
                                                    <td> Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</td>
                                                </tr>

                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col sm={7} className="d-flex flex-column text-start">

                                    <Row className="bg-light">
                                        <Col sm={5} className="d-flex flex-column text-start mt-3">

                                            <h4 className="text-decoration-underline">Delivery Address</h4>
                                            <div className="d-flex flex-column justify-content-start text-start">
                                                <p className="fw-bold">Lockene</p>
                                                <p className="my-1">yash123linganwar@gmail.com / 91562173745</p>
                                                <p className="my-1">Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</p>
                                                <p className="my-1">Pune Division, Maharashtra-411058, India</p>
                                                <p className="my-1"><b>PAN </b>: ADNP5467B</p>
                                            </div>

                                        </Col>
                                        <Col sm={7} className="d-flex flex-column text-start mt-3">

                                            <h4>Order No : PO-009</h4>
                                            <hr className="my-3 bg-dark" />

                                            <div>
                                                <Table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="fw-bold">Expected Delivery:</td>
                                                            <td>
                                                                Feb 19, 2025
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Payment Terms:</td>
                                                            <td>
                                                                checque

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Reference:</td>
                                                            <td>
                                                                Nagpur

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Shipment Preference:</td>
                                                            <td>
                                                                Chandrapur

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Col>
                                    </Row>

                                </Col>


                            </Row>
                            <Row className="bg-white fw-bold py-2 my-2 text-start" id="lineitem_title" style={{ borderBottom: "2px solid #c3edf3", borderTop: "2px solid #c3edf3" }}>
                                <Col sm={4} xs={12} className="py-2">PRODUCT</Col>
                                <Col sm={2} xs={6} className="py-2">QTY</Col>
                                <Col sm={2} xs={6} className="py-2">PRICE</Col>
                                <Col sm={2} xs={6} className="py-2">TAX</Col>
                                <Col sm={2} xs={6} className="py-2 ">TOTAL</Col>
                            </Row>
                            <Row className="bg-white py-1 tetxt-start" style={{ borderBottom: "1px solid #c3edf3" }}>
                                <Col sm={4} xs={12} className="text-start">
                                    <b>Television</b>
                                    <span className="float-end">SKU : 646546</span>
                                    <br />
                                    HSN : 54654
                                </Col>
                                <Col sm={2} xs={4}>Qty : 50 Nos</Col>
                                <Col sm={2} xs={4}>Price : ₹7000</Col>
                                <Col sm={2} xs={4}>GST (10%)</Col>
                                <Col sm={2} xs={12}>
                                    <h6 className="text-end">Total : ₹385000</h6>
                                </Col>
                            </Row>

                            <Row className="bg-white">
                                {/* Description Section */}
                                <Col sm={6} className="p-2 position-relative">
                                    <p><b>Description: </b>ccc</p>
                                    <div className="d-none d-sm-block" style={{ height: "2rem" }}></div>
                                </Col>

                                {/* Pricing Summary Section */}
                                <Col sm={6} className="p-2">
                                    <Row style={{ borderLeft: "1px solid #c3edf3" }}>
                                        {/* Subtotal */}
                                        <Col xs={6} className="py-2">Subtotal</Col>
                                        <Col xs={6} className="py-2 text-end">₹ 385000</Col>
                                        <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

                                        {/* Discount */}
                                        <Col xs={6} className="py-2 pb-3">Discount <b>5%</b></Col>
                                        <Col xs={6} className="py-2 text-end">₹ 19250</Col>
                                        <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

                                        {/* Tax */}
                                        <Col xs={6} className="py-2">Tax</Col>
                                        <Col xs={6} className="py-2 text-end">
                                            <ul className="m-0"><li>GST (10%)</li></ul>
                                        </Col>
                                        <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

                                        {/* Total */}
                                        <Col xs={6} className="py-2">Total</Col>
                                        <Col xs={6} className="py-2 text-end">₹ 402000</Col>
                                        <Col xs={12} style={{ borderBottom: "1px solid #c3edf3" }}></Col>

                                        {/* Round Off */}
                                        <Col xs={6} className="py-2">Round</Col>
                                        <Col xs={6} className="py-2 text-end">₹ -325</Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row style={{ border: "1px solid #c3edf3" }}>
                                {/* Header Section */}
                                <Col xs={12} className="bg-white p-2">
                                    <h4>Terms and Condition &amp; Attachments</h4>
                                </Col>

                                {/* Terms Section */}
                                <Col sm={6} className="p-2 mb-2">
                                    <h6 className="text-start">ccc</h6>
                                </Col>

                                {/* Attachments Section */}
                                <Col sm={6} className="p-2 mb-2">
                                    <Row>
                                        <Col xs={3} className="mb-2">
                                            <img
                                                src="https://fsm.lockene.net/uploads/driver/d9c42d059c1a50c02e64a61538121a75_0.jpg"
                                                className="img-preview rounded-2"
                                                style={{ width: "100px", aspectRatio: "1", objectFit: "cover" }}
                                                alt="Attachment"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
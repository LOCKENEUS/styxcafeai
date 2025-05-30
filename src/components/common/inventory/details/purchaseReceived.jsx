import { Button, Card, CardBody, CardHeader, Col, Container, Image, Row, Table } from "react-bootstrap"
import { BsFillPrinterFill } from "react-icons/bs"
import { FaPlus } from "react-icons/fa"

export const PurchaseReceivedDetails = () => {
    return (

        <Container className="text-center">
            <Row>
                <div className="d-flex justify-content-center align-items-center">
                    <h1>Purchase Received Details</h1>
                </div>
                <Col md={12} className="my-4">
                    <Card>
                        <CardHeader as="h5">
                            <Row >
                                <Col sm={6} className="d-flex justify-content-start">
                                    <h3 className="fw-bold txt-start">Purchase Received : PR-008</h3>
                                </Col>
                                <Col sm={6} className="d-flex justify-content-end">
                                    <div className="d-flex flex-wrap gap-2">
                                        <Button variant="outline-dark">Send Mail</Button>
                                        <Button variant="success"><BsFillPrinterFill className="me-2" />Print</Button>
                                        <Button variant="success"><FaPlus />   Create Bill   </Button>
                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
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
                                    <p className="my-1"><b>PR :</b> "Draft"</p>
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
                                            </div>
                                        </Col>
                                        <Col sm={7} className="d-flex flex-column text-start mt-3">

                                            <h4>Order No : PO-009</h4>
                                            <hr className="my-3 bg-dark" />

                                            <div>
                                                <Table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="fw-bold">Received No PR-008</td>
                                                            <td>
                                                                PR-008
                                                            </td>
                                                        </tr>
                                                        <tr >
                                                            <td className="fw-bold">Order No:</td>
                                                            <td>PO-009</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Expected Delivery:</td>
                                                            <td>
                                                                Feb 19, 2025
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Payment Terms:</td>
                                                            <td>
                                                                Received Date

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>


                            </Row>
                            <Row className="my-4">
                                <Col xs={6} className="d-flex flex-column text-start border-bottom border-dark ">
                                    <h4>PRODUCT NAME</h4>
                                </Col>
                                <Col xs={6} className="d-flex flex-column text-start border-bottom border-dark ">
                                    <h4>QUANTITY</h4>
                                </Col>
                                <Col sm={6} className="d-flex flex-column text-start">
                                    <Row className="my-2">
                                        <Col sm={6}>
                                            <div className="fw-bold">Wired Headphone</div >
                                            <div >HSN : 10</div>
                                        </Col>
                                        <Col sm={6}>
                                            <span>SKU : WH001</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={6} className="text-start">
                                    <Row className="my-2">
                                        <Col sm={6}>
                                            <div className="fw-bold">Ordered Qty : 20 Nos</div >
                                            {/* <div>HSN : 10</div> */}
                                        </Col>
                                        <Col sm={6}>
                                            <span className="text-end">Received Qty : 10 Nos </span>
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
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Table } from "react-bootstrap";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import deleteplogo from "/assets/inventory/Vector (1).png";
import receive from "/assets/inventory/solar_card-send-linear.png";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import companylog from "/assets/inventory/companylogo.png";

export const SODetails = () => {
    return (
        <Container >
           <Row className="mx-2">
    {/* Breadcrumb Section */}
    <Col sm={12} className="my-3">
    <div style={{ top: "186px", fontSize: "18px" }}>
        <Breadcrumb>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Sales</BreadcrumbItem>
            <BreadcrumbItem>Items List</BreadcrumbItem>
            <BreadcrumbItem active>Sales Order Details</BreadcrumbItem>
        </Breadcrumb>
        </div>
    </Col>

    
    <Col sm={12} className="my-2">
        <Card className="p-3">
            <Row>
                <Col sm={6} xs={12}>
                    <h5 className="text-dark p-2" style={{ fontSize:'18px' }}>
                        <span>Sales Order: </span>
                        <span>SO - 014</span>
                    </h5>
                </Col>
                <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                    <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                        <Image src={print} className="me-2" /> Print
                    </Button>
                    <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                        <Image src={sendMail} className="me-2" /> Send Email
                    </Button>
                    <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                        <Image src={receive} className="me-2" /> Receive
                    </Button>
                    <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                        <Image src={editlogo} className="me-2" /> Edit
                    </Button>
                    <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                        <Image src={deleteplogo} />
                    </Button>
                </Col>
            </Row>
        </Card>
    </Col>

    {/* Company Info */}
    <Col sm={12} className="my-2">
        <Card className="p-3">
            <Row className="align-items-center">
                <Col  sm={2}>
                    <img src={companylog} alt="Logo" className="img-fluid" />
                </Col>
                <Col  sm={8}>
                    <h5>Linganwar</h5>
                    <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
                    <p className="mb-1">
                        Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India
                    </p>
                    <strong>PAN: ADNP5467B</strong>
                </Col>
                <Col  sm={2} className=" d-flex  ">
                    <span className="p-2 float-right">PO:<b className="text-primary">Draft</b></span>
                    {/* <strong className="text-primary"> Draft</strong> */}
                </Col>
            </Row>
        </Card>
    </Col>

    {/* Customer & Order Details */}
    <Col sm={12} className="my-2">
        <Card className="p-3 shadow-sm">
            <Row>
                {/* Customer Info */}
                <Col sm={6}>
                    <div className="mb-4">
                        <h5 className="text-primary" style={{fontSize: '22px', fontWeight: '600'}}>
                            Rupesh Suryvanshi
                        </h5>
                    </div>
                    <Row>
                        <Col sm={6}>
                            <div className="mb-4">
                                <h6 className="text-dark mb-3" style={{fontSize: '16px', fontWeight: '600'}}>
                                    Billing Address
                                </h6>
                                <p className="text-muted mb-0" style={{fontSize: '14px', lineHeight: '1.6'}}>
                                    Nagpur Division,<br/>
                                    Maharashtra, India
                                </p>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="mb-4 ps-4 border-start">
                                <h6 className="text-dark mb-3" style={{fontSize: '16px', fontWeight: '600'}}>
                                    Shipping Address
                                </h6>
                                <p className="text-muted mb-0" style={{fontSize: '14px', lineHeight: '1.6'}}>
                                    Nagpur Division,<br/>
                                    Maharashtra, India
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col sm={6}>
                    <div className="text-end mb-4">
                        <h6 className="text-dark" style={{fontSize: '16px'}}>
                            Order No: <span className="text-primary fw-bold">PO-009</span>
                        </h6>
                    </div>

                    <div className="order-details ms-auto" style={{maxWidth: '400px'}}>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="text-muted" style={{width: '50%'}}>Sales Order No:</td>
                                    <td className="fw-medium">SO-007</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Order Date:</td>
                                    <td className="fw-medium">Mar 19, 2025</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Shipment Date:</td>
                                    <td className="fw-medium">Mar 19, 2025</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Payment Terms:</td>
                                    <td className="fw-medium">Cash</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Reference:</td>
                                    <td className="fw-medium">Kreet</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Delivery Preference:</td>
                                    <td className="fw-medium">Cash</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Sales Person:</td>
                                    <td className="fw-medium">Yash (Admin)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </Card>
    </Col>

    <Col sm={12} className="my-2">
    <Card className="p-3 shadow-sm">
        <Row>

        
        <Col sm={12}>
         <div className="table-responsive">

         <Table  className="text-center align-middle">
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
              <tr>
                <td>
                  <b>Television</b>
                  <br />
                  HSN : 54654
                </td>
                <td>
                  SKU : 646546 <br />
                  Qty : 50 Nos
                </td>
                <td>Price : ₹7000</td>
                <td>GST (10%)</td>
                <td>Total : ₹385000</td>
              </tr>
            </tbody>
          </Table>
         </div>
        </Col>
      </Row>
      <Row className="mt-4 border-top border-3 p-2">
        <Col sm={6} className="border-end border-3">
          <p>
            <b>Description:</b> CCC
          </p>
        </Col>
        <Col sm={6} className="text-end">
          <p className="border-bottom border-3 p-3">
            <b>Subtotal:</b> ₹385000
          </p>
          <p className="border-bottom border-3 p-3">
            <b>Discount:</b>{" "}
            <span className="text-primary" style={{ cursor: "pointer" }}>
              5%
            </span>{" "}
            ₹19250
          </p>
          <p className="border-bottom border-3 p-3">
            <b>Tax:</b> GST (10%)
          </p>
        </Col>

        </Row>

    </Card>
    </Col>

    <Col sm={12} className="my-2">
        <Card className=" p-3 shadow-sm">
            <h5 className=" mb-3" style={{ fontSize:'20px' }}>Package Details</h5>
            <div className="table-responsive">

            <Table className="text-center align-middle">
            <thead >
              <tr  style={{ borderBottom: "2px solid #dee2e6",borderTop: "2px solid #dee2e6" }}>
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
</Row>

        </Container>
    )
};
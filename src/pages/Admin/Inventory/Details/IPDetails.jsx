import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import companylog from "/assets/inventory/companylogo.png";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Table } from "react-bootstrap";

export const IPDetails = () => {
  return (
    <Container >
      <Row className="mx-2">
        {/* Breadcrumb Section */}
        <Col sm={12} className="my-3">
          <div style={{ top: "186px", fontSize: "10px" }}>
            <Breadcrumb>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Sales</BreadcrumbItem>
              <BreadcrumbItem ><Link to="/admin/Inventory/InvoicePayment">Invoice Payment List</Link></BreadcrumbItem>
              <BreadcrumbItem active> Invoice Payment Details</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        <Col sm={12} className="my-2">
          <Card className="p-3">
            <Row>
              <Col sm={6} xs={12}>
                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                  <span>Sales Invoice : </span>
                  <span> SINV-004</span>
                </h5>
              </Col>
              <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                  <Image src={print} className="me-2" /> Print
                </Button>
                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                  <Image src={sendMail} className="me-2" /> Send Email
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <Row>
              {/* Customer Info */}
              <Col sm={6}  >
                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>Rupesh Suryvanshi</h5>
                <p className="my-3">Yash123456@gmail.com / 915637864976</p>

                <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                <p>Classy Cuts Unisex Salon, Manewada Road, near vidharbh glass, Durga Nagar, Ambika Nagar, Ayodhya nagar, Nagpur, Maharashtra, India</p>
                <p className="my-3">Nagpur Division, Maharashtra, India</p>
              </Col>

              <Col sm={6} >

                <div className="p-3"></div>
                <Table>
                  <tr >
                    <th >Sales Invoice No</th>
                    <th>SINV-004</th>
                  </tr>
                  <tr >
                    <th>Order No</th>
                    <th>SO-003</th>
                  </tr>
                  <tr >
                    <th>Invoice Date</th>
                    <th>12-04-2023</th>
                  </tr>
                  <tr >
                    <th>Payment Terms:</th>
                    <th>--</th>
                  </tr>
                  <tr >
                    <th>Reference:</th>
                    <th>--</th>
                  </tr>
                  <tr>
                    <th>Delivery Preference:</th>
                  </tr>
                  <tr>
                    <th>Sales Person:</th>
                    <th>- - - (Unknown)</th>
                  </tr>
                </Table>


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
                      <tr>
                        <td>
                          <b>Wired Headphone</b>
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

                <Table>
                  <tr>
                    <th className="text-start">Subtotal:</th>
                    <th>₹385000</th>
                  </tr>
                  <tr>
                    <th className="text-start">Discount 2%:</th>
                    <th>₹ 179</th>
                  </tr>
                  <tr>
                    <th className="text-start">Tax</th>
                    <th>GST (SGST 9% +CGST 9%) (18 %)</th>
                  </tr>
                  <tr>
                    <th className="text-start">Total              </th>
                    <th>₹ 10386</th>
                  </tr>
                  <tr>
                    <th className="text-start">No Adjustment</th>
                    <th>₹ 0</th>
                  </tr>
                  <tr className="border-top border-3">
                    <th className="text-start">Balance</th>
                    <th><Button variant="outline-success" >Collect ₹ 10386</Button></th>
                  </tr>
                </Table>
              </Col>




            </Row>

          </Card>
        </Col>

        <Col sm={12} className="my-2">
          <Card className=" p-3 shadow-sm">
            <h5 className=" mb-3" style={{ fontSize: '20px' }}>Package Details</h5>
            <div className="table-responsive">

              <Table className="text-center align-middle">
                <thead >
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
          <Card className=" p-3 shadow-sm">
            <h5 className=" mb-3" style={{ fontSize: '20px' }}>Shipment Details</h5>
            <div className="table-responsive">

              <Table className="text-center align-middle">
                <thead >
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
        </Col>


        <Col sm={12} className="my-2">
          <Card className=" p-3 shadow-sm">
            <h5 className=" mb-3" style={{ fontSize: '20px' }}>Payment Collection Details</h5>
            <div className="table-responsive">

              <Table className="text-center align-middle">
                <thead >
                  <tr style={{ borderBottom: "2px solid #dee2e6", borderTop: "2px solid #dee2e6" }}>
                    <th className="fw-bold">#</th>
                    <th className="fw-bold">Date</th>
                    <th className="fw-bold">Amount </th>
                    <th className="fw-bold">Mode</th>
                    <th className="fw-bold">Transaction</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      1
                    </td>
                    <td>
                      Feb 07, 2025
                    </td>
                    <td>₹ 29441</td>
                    <td>Cash</td>
                    <td>1022</td>

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
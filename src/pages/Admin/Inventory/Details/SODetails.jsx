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
                <Col  sm={4}  >
                    <h5 className="text-primary mb-3" style={{ fontSize:'20px' }}>Rupesh Suryvanshi</h5>
                   <Row>
                   <Col sm={6} >
                    <span   style={{ fontSize:'16px',fontWeight:'500'}}>Billing Address</span>
                    <p className="my-3">Nagpur Division, Maharashtra, India</p>
                    </Col>

                    <Col sm={6} className="border-end border-3" >
                    <span style={{ fontSize:'16px',fontWeight:'500'}}>Shipping Address</span>
                    <p className="my-3">Nagpur Division, Maharashtra, India</p>
                    </Col>
                   </Row>
                </Col>



                <Col  sm={8} >
                <Row>
                    {/* Delivery Details */}
                <Col sm={6}  >
                    <span className="mb-3" style={{ fontSize:'16px',fontWeight:'500'}}>Delivery Address</span>
                    <p className="my-3">
                        <span style={{ fontSize:'16px'}}>Linganwar</span><br />
                        <span>yash123linganwar@gmail.com / 91562173745</span>
                       <span>Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India</span>
                        <span>PAN:</span> ADNP5467B
                    </p>
                </Col>

                {/* Order Info */}
                <Col sm={6} >
                <span className="mb-3 float-end" style={{ fontSize:'16px',fontWeight:'500'}}>Order No:<b className="text-primary">PO-009</b></span>
                    <p className="my-5 mx-2 border-start border-3 p-2">
                        
                        <p><span className="my-1 fw-bold">Payment Terms:</span> Cheaque</p>
                        <p><span className="my-1 fw-bold">Reference:</span> Nagpur</p>
                        <p><span className="my-1 fw-bold">Shipment Preference:</span> Amaravati</p>
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
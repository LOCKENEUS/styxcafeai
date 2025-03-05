import React from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Table } from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { FaRupeeSign, FaUpload } from "react-icons/fa";
const CreateVendorForm = () => {
  return (
    <Container fluid className="p-4">
      {/* Header Card */}
      <Card className="p-3 mb-3 shadow-sm">
        <Row className="align-items-center">
          <Col xs={2}>
            <img
              src={Lockenelogo}
              alt="Logo"
              className="img-fluid"
            />
          </Col>
          <Col>
            <h5>Linganwar</h5>
            <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
            <p className="mb-1">
              Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra,
              India
            </p>
            <strong>PAN: ADNP5467B</strong>
          </Col>
          <Col xs={2} className="text-end">
            <span className="text-muted">PO:</span>
            <strong className="text-primary"> Draft</strong>
          </Col>
        </Row>
      </Card>

      {/* Client & Delivery Details */}
      <Card className="p-3 shadow-sm">
        <Row>
          <Col md={4} className="d-flex border-end flex-column gap-2">
          <div className="border-bottom ">
          <div className="d-flex flex-row align-items-center justify-content-around mb-3 gap-2">
            <h5 className="text-muted">Client Name Here</h5>
            <Button style={{width: "144px", height:"44px",
    borderStyle: "dashed"
            }} variant="outline-primary" className=" d-flex  align-items-center justify-content-center gap-2">
              <span>+</span> Add Client
            </Button>
            </div>
            </div>
            <Row className="mt-3 ">
          <Col className="" md={5}>
            <h6 style={{fontSize:"1rem"}} >Billing Address</h6>
            <p style={{fontSize:"0.9rem"}} className="mb-1">Nagpur Division</p>
            <p style={{fontSize:"0.9rem"}} className="mb-1">Maharashtra</p>
            <p style={{fontSize:"0.9rem"}} className="mb-0">India</p>
          </Col>
          <Col md={5} className="">
            <h6 style={{fontSize:"1rem"}} >Shipping Address</h6>
            <p style={{fontSize:"0.9rem"}} className="mb-1">Nagpur Division</p>
            <p style={{fontSize:"0.9rem"}} className="mb-1">Maharashtra</p>
            <p style={{fontSize:"0.9rem"}} className="mb-0">India</p>
          </Col>
        </Row>
            
          </Col>

          <Col md={4}>
          <div className="d-flex my-3 flex-row align-items-center gap-2">
            <h5 className="text-muted">Delivery Address <span className="text-danger">*</span></h5>

            </div>
            <div  className="d-flex  gap-4 mb-2">
              <Form.Check  className="" style={{  fontWeight:"bold", color: "black"}} type="radio" name="delivery" label="Organization" defaultChecked />
              <Form.Check  className="" style={{  fontWeight:"bold", color: "black"}} type="radio" name="delivery" label="Customer" />
            </div>
            <p style={{  fontWeight:"bold", marginTop:"30px",  color: "black"}} className="mb-1">Linganwar</p>
            <div style={{marginTop:"15px"}} className="d-flex flex-column   gap-2">
            <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
            <p className="mb-1">Karve Statue, DP Road, Pune Maharashtra</p>
            <p className="mb-0">PAN: ADNP5467B</p>
            </div>
          </Col>

          <Col md={4} style={{marginTop:"2rem"}}>
            <div className="d-flex flex-column gap-2">
              <div  className=" d-flex flex-row align-items-center gap-2">
                <Form.Control style={{  border:"1px solid black", height:"44px" , borderStyle:"dashed"}} placeholder="Expected Delivery" />
                <Button style={{width:"50px" , border:"1px solid black", height:"30px" , borderStyle:"dashed"}} variant="outline-secondary" className=" end-0 top-0 h-100 px-2">+</Button>
              </div>
              
              <div className=" d-flex flex-row align-items-center gap-2">
                <Form.Select style={{  border:"1px solid black", height:"44px" , borderStyle:"dashed"}}>
                  <option>Select Payment Terms</option>
                </Form.Select>
                <Button style={{width:"50px" , border:"1px solid black", height:"30px" , borderStyle:"dashed"}} variant="outline-secondary" className=" end-0 top-0 h-100 px-2">+</Button>
              </div>
              <Form.Control  style={{  border:"1px solid black", height:"44px" }}  placeholder="Enter Reference" />
              <Form.Control style={{  border:"1px solid black", height:"44px" }}  placeholder="Enter Shipment Preference" />

            </div>
          </Col>
        </Row>

    
      </Card>

      {/* Product Details Card */}
      <Card className="p-3 mt-3 shadow-sm">
        <Table responsive>
          <thead>
            <tr>
              <th className="w-25">PRODUCT</th>
              <th className="w-15">QUANTITY</th>
              <th className="w-15">PRICE</th>
              <th className="w-15">TAX</th>
              <th className="w-30">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="d-flex gap-2">
                  <Form.Select className="flex-grow-1" style={{ border: "1px solid black", borderStyle: "dashed" }}>
                    <option>Select Item</option>
                  </Form.Select>
                  <Button className="flex-shrink-0" style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }} variant="outline-secondary">+</Button>
                </div>
              </td>
              <td>
                <Form.Control type="text" placeholder="QTY : 1" style={{ border: "1px solid black", width: "100%" }} />
              </td>
              <td>
                <div className="position-relative w-100">
                  <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                    <FaRupeeSign />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="0.00"
                    className="w-100"
                    style={{ paddingLeft: "25px", border: "1px solid black" }}
                  />
                </div>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Form.Control type="text" placeholder="0 % TAX" className="flex-grow-1" style={{ border: "1px solid black" }} />
                  <Button className="flex-shrink-0" style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }} variant="outline-secondary">+</Button>
                </div>
              </td>
              <td>
                <div className="position-relative w-100">
                  <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                    <FaRupeeSign />
                  </span>
                  <Form.Control type="text" placeholder="PRICE : 0.00" className="w-100" style={{ paddingLeft: "25px", border: "1px solid black" }} readOnly />
                </div>
              </td>
            </tr>
          </tbody>
        </Table>

        <Button variant="outline-primary" className="mb-4 w-100 w-sm-50 w-md-25" style={{ borderStyle: "dashed" }}>
          <span className="me-2">+</span> Add Product
        </Button>

        <Row>
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Form.Control
              as="textarea"
              rows={7}
              placeholder="Vendor Description & Instruction"
              style={{ border: "1px solid gray" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Subtotal</span>
                <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                  <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                    <FaRupeeSign />
                  </span>
                  <Form.Control type="text" placeholder="Sub - Total" style={{ paddingLeft: "25px", border: "1px solid black" }} readOnly />
                </div>
              </div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Discount</span>
                <Button variant="outline-primary" style={{ width: "100%", maxWidth: "200px", borderStyle: "dashed" }}>
                  <span className="me-2">+</span> Add Discount
                </Button>
              </div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Tax</span>
                <Button variant="outline-primary" style={{ width: "100%", maxWidth: "200px", borderStyle: "dashed" }}>
                  <span className="me-2">+</span> TAX
                </Button>
              </div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Total</span>
                <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                  <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                    <FaRupeeSign />
                  </span>
                  <Form.Control type="text" placeholder="Total" style={{ paddingLeft: "25px", border: "1px solid black" }} readOnly />
                </div>
              </div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                  <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                    <FaRupeeSign />
                  </span>
                  <Form.Control type="text" placeholder="Adjust Note" style={{ paddingLeft: "25px", border: "1px solid black" }} />
                </div>
                <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                  <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                    <FaRupeeSign />
                  </span>
                  <Form.Control type="text" placeholder="Adjust Amount" style={{ paddingLeft: "25px", border: "1px solid black" }} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Terms and Conditions Card */}
      <Card className="p-3 mt-3  shadow-sm">
        <h6>Terms And Condition & Attachments</h6>
        <Row className="mt-3">
          <Col md={6}>
            <Form.Control
              as="textarea"
              rows={9}
              placeholder="Terms & Condition Notes"
              style={{ border: "1px solid gray" }}
            />
          </Col>

          <Col className="" md={6}>
            <div  className="rounded d-flex flex-column align-items-center justify-content-center p-4" style={{ minHeight: "200px", border: "1px solid black" , borderStyle:"dashed" }}>
              <div className="text-center">
                <div className="mb-2">
                  <FaUpload />
                </div>
                <p className="mb-0">Click to upload, only accept .pdf, .jpg, .jpeg, .png</p>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      
    </Container>
  );
};

export default CreateVendorForm;

import React from "react";
import { Container, Row, Col, Table, Button, Breadcrumb, Card } from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { LuPrinter } from "react-icons/lu";
import { RiFolderReceivedLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { PiTrashLight } from "react-icons/pi";

const PurchaseOrderDetailes = () => {
  return (
    <Container className="p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
      {/* Header Section */}
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Purchase</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Vendor List</Breadcrumb.Item>
        <Breadcrumb.Item active>Purchase Order</Breadcrumb.Item>
      </Breadcrumb>

      {/* Purchase Order Header with Buttons */}
      <Card className="p-3 mb-3 shadow-sm">
        <Row className="p-3 bg-light rounded d-flex align-items-center justify-content-between">
          <Col>
            <h5>
              <strong>Purchase Order : </strong>
              <span style={{ color: "#000" }}>PO - 014</span>
            </h5>
          </Col>
          <Col className="text-end">
            <Button variant="outline-dark" className="me-2">
              <LuPrinter /> Print
            </Button>
            <Button variant="outline-dark" className="me-2">
              <RiFolderReceivedLine /> Send Email
            </Button>
            <Button variant="outline-dark" className="me-2">
              <RiFolderReceivedLine /> Receive
            </Button>
            <Button variant="outline-dark" className="me-2">
              <FiEdit /> Edit
            </Button>
            <Button variant="outline-danger">
              <PiTrashLight />
            </Button>
          </Col>
        </Row>
      </Card>


      {/* Vendor Details Card */}
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


      <Card className="p-3 shadow-sm">
        <Row>
          {/* Column 1: Customer and Address Info */}
          <Col md={4}>
            <h5 className="text-primary">Rupesh Suryvanshi</h5>
            <strong>Billing Address</strong>
            <p>Nagpur Division, Maharashtra, India</p>

            <strong>Shipping Address</strong>
            <p>Nagpur Division, Maharashtra, India</p>
          </Col>

          {/* Column 2: Delivery Details */}
          <Col md={4}>
            <strong>Delivery Address</strong>
            <p>
              <strong>Linganwar</strong>
              <br />
              yash123linganwar@gmail.com / 91562173745
              <br />
              Karve Statue, DP Road, Pune, Maharashtra
              <br />
              <strong>PAN:</strong> ADNP5467B
            </p>
          </Col>

          {/* Column 3: Order Info */}
          <Col md={4}>
            <p>
              <strong>Order No:</strong>{" "}
              <a href="#" className="text-primary">
                PO-009
              </a>
            </p>
            <p>
              <strong>Expected Delivery:</strong> Feb 19, 2025
            </p>
            <p>
              <strong>Payment Terms:</strong> Cheaque
            </p>
            <p>
              <strong>Reference:</strong> Nagpur
            </p>
            <p>
              <strong>Shipment Preference:</strong> Amaravati
            </p>
          </Col>
        </Row>
      </Card>



      {/* Product Table */}
      <Card className="p-3 shadow-sm">
        <Table striped bordered hover className="mt-4">
          <thead className="bg-light">
            <tr>
              <th>PRODUCT</th>
              <th>QUANTITY</th>
              <th>PRICE</th>
              <th>TAX</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Television</strong>
                <br />
                <small>HSN: 54654</small>
              </td>
              <td>SKU: 646546 Qty: 50 Nos</td>
              <td>₹7000</td>
              <td>GST (10%)</td>
              <td>₹385000</td>
            </tr>
          </tbody>
        </Table>

        {/* Description */}
        <Row className="mt-3">
          <Col>
            <p><strong>Description:</strong> CCC</p>
          </Col>
        </Row>

        {/* Pricing Summary */}
        <Row className="mt-3">
          <Col md={{ span: 4, offset: 8 }}>
            <Table bordered>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>₹385000</td>
                </tr>
                <tr>
                  <td>Discount <span className="text-primary">5%</span></td>
                  <td>₹19250</td>
                </tr>
                <tr>
                  <td>Tax</td>
                  <td>GST (10%)</td>
                </tr>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>₹402000</strong></td>
                </tr>
                <tr>
                  <td>Round</td>
                  <td>₹-325</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card>

    </Container>
  );
};

export default PurchaseOrderDetailes;

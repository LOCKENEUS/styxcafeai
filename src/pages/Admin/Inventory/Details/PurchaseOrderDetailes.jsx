import React from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Breadcrumb,
  Card,
  Image,
} from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { LuMailMinus, LuPrinter } from "react-icons/lu";
import { RiFolderReceivedLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { PiTrashLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";

const PurchaseOrderDetails = () => {
  return (
    <Container
      className="p-4"
      style={{ background: "#f8f9fa", borderRadius: "8px" }}
    >
      {/* Header Section */}
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Purchase</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Vendor List</Breadcrumb.Item>
        <Breadcrumb.Item active>Purchase Order</Breadcrumb.Item>
      </Breadcrumb>

      {/* Purchase Order Header with Buttons */}
      <Card className="p-3 mb-3 shadow-sm">
        <Row className="p-3 rounded d-flex align-items-center justify-content-between">
          <Col>
            <h5>
              <strong>Purchase Order : </strong>
              <span style={{ color: "#000" }}>PO - 014</span>
            </h5>
          </Col>
          <Col style={{fontSize:"1rem"}} className="text-end text-black">
            <span className="me-4">
              <LuPrinter  size={20}/> Print
            </span>
            <span className="me-4">
              <LuMailMinus   size={20} /> Send Email
            </span>
            <span className="me-4">
              <RiFolderReceivedLine  size={20}/> Receive
            </span>
            <span className="me-4">
              <FiEdit size={20} /> Edit
            </span>
            <Button variant="outline-danger">
              <PiTrashLight size={20} />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Vendor Details Card */}
      <Card className="p-3 mb-3 shadow-sm">
        <Row className="align-items-center">
          <Col xs={2}>
            <img src={Lockenelogo} alt="Logo" className="img-fluid" />
          </Col>
          <Col>
            <div style={{ fontSize: "1rem", color: "black" }}>Linganwar</div>
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
          <Col md={4}>
            <h3 className="text-primary mb-4">Rupesh Suryvanshi</h3>
            <div className="d-flex gap-2">
              <div className="d-flex flex-column gap-2">
                <div style={{ fontSize: "1rem", color: "black" }}>
                  Billing Address
                </div>
                <p>Nagpur Division, Maharashtra, India</p>
              </div>
              <div className="d-flex flex-column gap-2">
                <div style={{ fontSize: "1rem", color: "black" }}>
                  Shipping Address
                </div>
                <p>Nagpur Division, Maharashtra, India</p>
              </div>
            </div>
          </Col>

          {/* Column 2: Delivery Details */}
          <Col md={4}>
            <span
              style={{ fontSize: "1rem", marginBottom: "3rem", color: "black" }}
            >
              Delivery Address
            </span>
            <p
              style={{ marginTop: "1rem" }}
              className="d-flex flex-column gap-2"
            >
              <div style={{ fontSize: "1rem", color: "black" }}>Linganwar</div>

              <div className="d-flex flex-column gap-2">
                <div className="">yash123linganwar@gmail.com / 91562173745</div>
                <div className="">Karve Statue, DP Road, Pune, Maharashtra</div>
                <div className="">
                  <span style={{ color: "black" }}>PAN:</span> ADNP5467B
                </div>
              </div>
            </p>
          </Col>

          {/* Column 3: Order Info */}
          <Col md={4}>
            <p className="d-flex  gap-1 justify-content-end ">
              <strong>Order No:</strong>{" "}
              <a href="#" className="text-primary">
                PO-009
              </a>
            </p>

            <p className="d-flex justify-content-between">
              <strong>Expected Delivery:</strong> Feb 19, 2025
            </p>
            <p className="d-flex justify-content-between">
              <strong>Payment Terms:</strong> Cheaque
            </p>
            <p className="d-flex justify-content-between">
              <strong>Reference:</strong> Nagpur
            </p>
            <p className="d-flex justify-content-between">
              <strong>Shipment Preference:</strong> Amaravati
            </p>
          </Col>
        </Row>
      </Card>

      {/* Product Table */}
      <Card className="p-3 shadow-sm mt-3">
        <Table
          striped
          hover
          className="mt-4 bg-white"
          
          style={{ borderCollapse: "collapse" }}
        >
          <thead
            className="bg-light"
            style={{ borderBottom: "1px solid #dee2e6" }}
          >
            <tr>
              <th style={{ fontSize: "1rem", border: "none" }}>PRODUCT</th>
              <th style={{ fontSize: "1rem", border: "none" }}>QUANTITY</th>
              <th style={{ fontSize: "1rem", border: "none" }}>PRICE</th>
              <th style={{ fontSize: "1rem", border: "none" }}>TAX</th>
              <th style={{ fontSize: "1rem", border: "none" }}>TOTAL</th>
            </tr>
          </thead>
          <tbody
            style={{ fontSize: "1rem", borderBottom: "1px solid #dee2e6" }}
          >
            <tr>
              <td style={{ border: "none" }}>
                <strong>Television</strong>
                <br />
                <small>HSN: 54654</small>
              </td>
              <td style={{ border: "none" }}>SKU: 646546 Qty: 50 Nos</td>
              <td style={{ border: "none" }}>₹7000</td>
              <td style={{ border: "none" }}>GST (10%)</td>
              <td style={{ border: "none" }}>₹385000</td>
            </tr>
          </tbody>
        </Table>

        {/* Pricing Summary */}
        <Row className="mt-3">
          <Col md={6}>
            <p>
              <strong>Description:</strong> CCC
            </p>
          </Col>

          <Col
            md={6}
            style={{ borderLeft: "1px solid #dee2e6", paddingLeft: "10px" }}
          >
            <div className="p-3 shadow-sm d-flex flex-column gap-3">
              <div className="d-flex justify-content-between">
                {" "}
                <p>Subtotal</p> <h5>₹385000</h5>{" "}
              </div>
              <div className="d-flex justify-content-between">
                {" "}
                <p>Discount</p> <h5>₹19250</h5>{" "}
              </div>
              <div className="d-flex justify-content-between">
                {" "}
                <p>Tax</p> <h5>GST (10%)</h5>{" "}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="p-3 mt-3 shadow-sm">
        <Row className="align-items-center">
          {/* Left Side - Terms and Conditions */}
          <Col md={8}>
            <h5 className="fw-bold">Terms And Condition & Attachments</h5>
            <p className="text-muted">CCC</p>
          </Col>

          {/* Right Side - Attachments (Images) */}
          <Col md={4} className="d-flex justify-content-end gap-3">
            <Image
              src="https://via.placeholder.com/100" // Replace with actual image URL
              alt="Keyboard"
              rounded
              style={{ width: "80px", height: "80px", border: "1px solid #ddd", padding: "5px" }}
            />
            <Image
              src="https://via.placeholder.com/100" // Replace with actual image URL
              alt="Monitor"
              rounded
              style={{ width: "80px", height: "80px", border: "1px solid #ddd", padding: "5px" }}
            />
          </Col>
        </Row>
      </Card>

    </Container>
  );
};

export default PurchaseOrderDetails;

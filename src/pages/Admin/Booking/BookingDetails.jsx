import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  ListGroup,
  Tab,
  Nav,
  Button,
} from "react-bootstrap";
import { BsSearch, BsPlus } from "react-icons/bs";
import googleicon from '/assets/Admin/PaymentIcon/google.svg'
import phonepeicon from '/assets/Admin/PaymentIcon/phonepe.svg'
import paytmicon from '/assets/Admin/PaymentIcon/paytm.svg'
import cashicon from '/assets/Admin/PaymentIcon/money.svg'
import qrcode from '/assets/Admin/PaymentIcon/QrCodeIcon.svg'


const BookingDetails = () => {
  const customers = [
    {
      name: "Elvish Rathore",
      email: "elvishrathore12@gmail.com",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
    {
      name: "Riya Sharma",
      phone: "9632145870",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
    {
      name: "Rohan Verma",
      email: "rohanverma@gmail.com",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
    {
      name: "Elvish Rathore",
      email: "",
      phone: "9632145870",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
    {
      name: "Elvish Rathore",
      email: "",
      phone: "9652145870",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
    {
      name: "Vidisha Bhadang",
      email: "vidishabhadang12@gmail.com",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
    {
      name: "Elvish Rathore",
      email: "elvishrathore12@gmail.com",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
    {
      name: "Kanak Raut",
      email: "kanakraut4712@gmail.com",
      avatar:
        "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/160x160/img6.jpg",
    },
  ];

  // Add state for selected customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);



  return (
    <Container fluid className="p-4 ">
      <h6 className="mb-3 text-muted">
        Home / Purchase / Vendor List/{" "}
        <span className="text-primary">Purchase Order</span>
      </h6>

      <Row>
        <Col style={{ height: "100%" }} md={4}>
          <div className="d-flex  gap-3">
            <InputGroup className="mb-3 ">
              <InputGroup.Text className="bg-white p-3 rounded-start">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search for Customers"
                className="border-end-0"
              />
            </InputGroup>
            <Button
              variant="white"
              className="mb-3 rounded border d-flex align-items-center gap-2"
            >
              <BsPlus size={20} />
            </Button>
          </div>

          <div className="bg-white rounded-3 p-3">
            <div className="customer-list">
              {customers.map((customer, index) => (
                <div
                  key={index}
                  className={`d-flex align-items-center p-2 mb-2 cursor-pointer hover-bg-light rounded ${
                    selectedCustomer === customer ? "bg-light" : ""
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={customer.avatar}
                    alt=""
                    className="rounded-circle me-3"
                    width="40"
                    height="40"
                  />
                  <div>
                    <h6 className="mb-0">{customer.name}</h6>
                    <small className="text-muted">
                      {customer.email || customer.phone}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col md={8}>
          <div
            style={{ height: "315px" }}
            className="bg-white rounded-3 p-4 mb-4 position-relative"
          >
    <div className=" p-4">
      <h5>Customer Details</h5>
      {selectedCustomer ? (
        <div className="d-flex justify-content-between align-items-center">
          <div className="mt-4">
            <div className="mb-4">
              <h5 className="text-muted">Customer Name</h5>
              <p className="text-black">{selectedCustomer.name}</p>
            </div>

            <div className="mb-4">
              <h5 className="text-muted">Booked Game</h5>
              <p style={{ fontWeight: "bold" }} className="text-primary">
                Snooker & Pool (6×8 Size)
              </p>
            </div>

            <div className="mb-4">
              <h5 className="text-muted">Day & Time</h5>
              <p className="">22 Tue 2025 - 12:45:00 AM</p>
            </div>
          </div>
          <div className="top-4 end-4">
            <div className="bg-light d-flex flex-column justify-content-between align-items-center rounded-3 p-3">
              <h5 className=" text-black mb-1">No of Candidates</h5>
              <p className="text-primary  mb-0">04</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted d-flex justify-content-center align-items-center h-100 w-100 mb-0">
          Select Customers
        </p>
      )}
    </div>
          </div>

          <div style={{  }} className="bg-white rounded-3">
            <Tab.Container defaultActiveKey="checkout">
              <Nav variant="tabs" className="border-0">
                <Nav.Item>
                  <Nav.Link eventKey="checkout" className="border-0">
                    Checkout Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="payment" className="border-0">
                    Payment Methods
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="p-4 h-100">
                <Tab.Pane eventKey="checkout">
                    {selectedCustomer ? (
                      <div className="p-4">
                        <h5>Checkout Details</h5>
                        <div className="mb-4">
                          <h5 className="text-muted">Total Amount</h5>
                          <p className="text-black">₹ 4520.00</p>
                        </div>
                        <div className="mb-4">
                          <h5 className="text-muted">Extra Charge</h5>
                          <p className="text-black">₹ 401.00</p>
                        </div>
                        <div className="mb-4">
                          <h5 className="text-muted">GST</h5>
                          <p className="text-black">₹ 201.00</p>
                        </div>
                        <div className="mb-4">
                          <h5 className="text-muted">SGST</h5>
                          <p className="text-black">₹ 58.00</p>
                        </div>
                        <div className="mb-4">
                          <h5 className="text-muted">TOTAL</h5>
                          <p className="text-primary" style={{ fontWeight: "bold" }}>₹ 5012.12</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted d-flex justify-content-center align-items-center h-100 w-100 mb-0">
                        Select Customers
                      </p>
                    )}
                </Tab.Pane>
                <Tab.Pane eventKey="payment">
                  {selectedCustomer ? (
                    <div className="p-4">
                    
                      <div className="d-flex justify-content-around align-items-center">
                        <div>

                      <h5>Total Amount to be</h5>
                      <p className="text-primary" style={{ fontWeight: "bold" }}>₹ 5012.12</p>
                        </div>
                      <img src={qrcode} alt="QR Code" />
                      </div>
                      <div className="d-flex mt-4 justify-content-around">
                        <img src={googleicon} alt="Google Pay" />
                        <img src={phonepeicon} alt="PhonePe" />
                        <img src={paytmicon} alt="Paytm" />
                        <img src={cashicon} alt="Cash" />
                      </div>
              
                    </div>
                  ) : (
                    <p className="text-muted d-flex justify-content-center align-items-center h-100 w-100 mb-0">
                      Select Customers
                    </p>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingDetails;

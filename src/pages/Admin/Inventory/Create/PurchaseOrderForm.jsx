import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Table, Modal } from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { FaRupeeSign, FaTrash, FaUpload } from "react-icons/fa";
import { BiArrowToLeft, BiPlus } from "react-icons/bi";
import OffcanvesItems from "../Offcanvas/OffcanvesItems";

const PurchaseOrderForm = () => {
  const [show, setShow] = useState(false);
  const [showClientList, setShowClientList] = useState(true);
  const [newClient, setNewClient] = useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: ""
  });
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [paymentTermsList, setPaymentTermsList] = useState([]);
  const [newPaymentTerm, setNewPaymentTerm] = useState({
      name: '',
      days: ''
  });
  const [clients] = useState([
      { id: '84', name: 'Praful Patel', email: 'yashl+2@lockene.us', phone: '019876543', city: 'Jalandhar Division' },
      { id: '49', name: 'Amit', email: 'amit@gmail.com', phone: '4512789635', city: 'Calmar' },
      // Add more sample clients as needed
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([
      {
          id: 1,
          item: '',
          quantity: '',
          price: '',
          tax: '',
          total: ''
      }
  ]);
  const [showProductList, setShowProductList] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [newTax, setNewTax] = useState({
      name: '',
      value: '',
      description: ''
  });

  const handleShow = () => setShow(true);
  const handleClose = () => {
      setShow(false);
      setShowClientList(true);
  };


  const handleChange = (e) => {
      setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      // Handle client creation logic here
      handleClose();
  };

  const toggleView = () => {
      setShowClientList(!showClientList);
  };

  const selectClient = (clientId) => {
      // Handle client selection logic here
      console.log("Selected client:", clientId);
      handleClose();
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add this new function to handle adding products
  const addProduct = () => {
      setProducts([...products, {
          id: products.length + 1,
          item: '',
          quantity: '',
          price: '',
          tax: '',
          total: ''
      }]);
  };

  // Add this new function to handle tax creation
  const handleTaxSubmit = (e) => {
      e.preventDefault();
      setTaxList([...taxList, newTax]);
      setNewTax({ name: '', value: '', description: '' });
      setShowTaxModal(false);
  };

  // Updated Modal component
  const modalContent = (
      <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header className="bg-info bg-opacity-10">
              <Modal.Title>
                  <b>{showClientList ? "Choose a client" : "Create New Client"}</b>
              </Modal.Title>
              <div className="d-flex pb-2 gap-2">
                  <Button 
                      variant="info" 
                      size="sm" 
                      onClick={toggleView}
                  >
                      {showClientList ? <BiPlus size={20}/> : <BiArrowToLeft size={20}/>}
                  </Button>
                  <Button 
                      variant="close" 
                      onClick={handleClose}
                  />
              </div>
          </Modal.Header>
          <Modal.Body>
              {showClientList ? (
                  <div>
                      <h6>Choose a client for create quote?</h6>
                      <Card className="shadow">
                          <Card.Header className="p-2 bg-info bg-opacity-10">
                              <Form.Control
                                  size="sm"
                                  type="search"
                                  placeholder="Search by name..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                              />
                          </Card.Header>
                          <Card.Body className="p-2">
                              <Table responsive size="sm">
                                  <thead>
                                      <tr>
                                          <th>Name</th>
                                          <th>Email</th>
                                          <th>Contact</th>
                                          <th>City</th>
                                          <th>Select</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {filteredClients.map(client => (
                                          <tr key={client.id} style={{ cursor: 'pointer' }}>
                                              <td>{client.name}</td>
                                              <td>{client.email}</td>
                                              <td>{client.phone}</td>
                                              <td>{client.city}</td>
                                              <td>
                                                  <Button
                                                      variant="info"
                                                      size="sm"
                                                      onClick={() => selectClient(client.id)}
                                                  >
                                                      <BiPlus size={20}/>
                                                  </Button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </Table>
                          </Card.Body>
                      </Card>
                  </div>
              ) : (
                  <Form onSubmit={handleSubmit}>
                      <Row className="mb-3">
                          <Col md={6}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      Full Name
                                  </Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="name"
                                      placeholder="Enter Full Name"
                                      value={newClient.name}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      Contact Number
                                  </Form.Label>
                                  <Form.Control
                                      type="tel"
                                      name="phone"
                                      placeholder="Enter Contact Number"
                                      value={newClient.phone}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                      </Row>

                      <Row className="mb-3">
                          <Col md={4}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      Email
                                  </Form.Label>
                                  <Form.Control
                                      type="email"
                                      name="email"
                                      placeholder="Enter Email Address"
                                      value={newClient.email}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={4}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      Address
                                  </Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="address"
                                      placeholder="Enter Address"
                                      value={newClient.address}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={4}>
                          <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                  Gender
                              </Form.Label>
                              <Form.Select
                                  name="gender"
                                  value={newClient.gender}
                                  onChange={handleChange}
                                  className="rounded-2"
                                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                  required
                              >
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                              </Form.Select>
                          </Form.Group>
                          </Col>
                      </Row>

                      <Row className="mb-3">
                          <Col md={4}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      Country
                                  </Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="country"
                                      placeholder="Enter Country"
                                      value={newClient.country}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={4}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      State
                                  </Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="state"
                                      placeholder="Enter State"
                                      value={newClient.state}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={4}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      City
                                  </Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="city"
                                      placeholder="Enter City"
                                      value={newClient.city}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                      </Row>

                      {/* <Row className="mb-3">
                          <Col md={12}>
                              <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                                      Zip Code
                                  </Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="zipCode"
                                      placeholder="Enter Zip Code"
                                      value={newClient.zipCode}
                                      onChange={handleChange}
                                      className="rounded-2"
                                      style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                      </Row> */}

                      <div className="d-flex justify-content-end gap-2">
                          <Button
                              variant="outline-secondary"
                              className="rounded-2"
                              onClick={handleClose}
                              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                          >
                              Cancel
                          </Button>
                          <Button
                              variant="primary"
                              type="submit"
                              className="rounded-2"
                              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                          >
                              Create Client
                          </Button>
                      </div>
                  </Form>
              )}
          </Modal.Body>
      </Modal>
  );

  // Update the payment terms section in your existing JSX
  const paymentTermsSection = (
      <div className="d-flex flex-row align-items-center gap-2">
          <Form.Select 
              style={{border:"1px solid black", height:"44px", borderStyle:"dashed"}}
          >
              <option>Select Payment Terms</option>
              {paymentTermsList.map((term, index) => (
                  <option key={index} value={term.days}>
                      {term.name} ({term.days} days)
                  </option>
              ))}
          </Form.Select>
          <Button 
              style={{width:"50px", border:"1px solid black", height:"30px", borderStyle:"dashed"}} 
              variant="outline-secondary" 
              onClick={() => setShowPaymentTerms(true)}
              className="end-0 top-0 h-100 px-2"
          >
              +
          </Button>
      </div>
  );

  // Add the payment terms modal
  const paymentTermsModal = (
      <Modal show={showPaymentTerms} onHide={() => setShowPaymentTerms(false)}>
          <Modal.Header className="bg-light">
              <Modal.Title>Payment Terms</Modal.Title>
              <Button 
                  variant="link" 
                  className="btn-close" 
                  onClick={() => setShowPaymentTerms(false)}
              />
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={(e) => {
                  e.preventDefault();
                  setPaymentTermsList([...paymentTermsList, newPaymentTerm]);
                  setNewPaymentTerm({ name: '', days: '' });
                  setShowPaymentTerms(false);
              }}>
                  <Row>
                      <Col md={6} className="mb-3">
                          <Form.Group>
                              <Form.Label htmlFor="term_name">Term name</Form.Label>
                              <Form.Control
                                  id="term_name"
                                  name="name" 
                                  type="text"
                                  placeholder="Net 15"
                                  value={newPaymentTerm.name}
                                  onChange={(e) => setNewPaymentTerm({
                                      ...newPaymentTerm,
                                      name: e.target.value
                                  })}
                                  required
                              />
                          </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                          <Form.Group>
                              <Form.Label htmlFor="term_days">No of days</Form.Label>
                              <Form.Control
                                  id="term_days"
                                  name="days"
                                  type="number" 
                                  placeholder="15"
                                  value={newPaymentTerm.days}
                                  onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      setNewPaymentTerm({
                                          ...newPaymentTerm,
                                          days: value
                                      });
                                  }}
                                  required
                              />
                          </Form.Group>
                      </Col>
                      <Col xs={12}>
                          <Button 
                              variant="info"
                              className="text-white"
                              type="submit"
                          >
                              Submit
                          </Button>
                      </Col>
                  </Row>
              </Form>
          </Modal.Body>
      </Modal>
  );

  // Add the tax modal component
  const taxModal = (
      <Modal show={showTaxModal} onHide={() => setShowTaxModal(false)}>
          <Modal.Header className="bg-light">
              <Modal.Title>Create Custom Tax</Modal.Title>
              <Button 
                  variant="link" 
                  className="btn-close" 
                  onClick={() => setShowTaxModal(false)}
              />
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={handleTaxSubmit}>
                  <Row>
                      <Col sm={6} className="mb-3">
                          <Form.Group>
                              <Form.Label htmlFor="tax_name">Tax name</Form.Label>
                              <Form.Control
                                  id="tax_name"
                                  size="sm"
                                  type="text"
                                  placeholder="Tax name"
                                  value={newTax.name}
                                  onChange={(e) => setNewTax({
                                      ...newTax,
                                      name: e.target.value
                                  })}
                                  required
                              />
                          </Form.Group>
                      </Col>
                      <Col sm={6} className="mb-3">
                          <Form.Group>
                              <Form.Label htmlFor="tax_value">Tax Value</Form.Label>
                              <InputGroup size="sm">
                                  <Form.Control
                                      id="tax_value"
                                      type="tel"
                                      placeholder="0.00"
                                      value={newTax.value}
                                      onChange={(e) => {
                                          const value = e.target.value.replace(/[^0-9]/g, '');
                                          setNewTax({
                                              ...newTax,
                                              value: value
                                          });
                                      }}
                                      maxLength={2}
                                      required
                                  />
                                  <InputGroup.Text>%</InputGroup.Text>
                              </InputGroup>
                          </Form.Group>
                      </Col>
                      <Col sm={12} className="mb-3">
                          <Form.Group>
                              <Form.Label htmlFor="tax_description">Tax Description</Form.Label>
                              <Form.Control
                                  id="tax_description"
                                  size="sm"
                                  type="text"
                                  placeholder="Custom tax description"
                                  value={newTax.description}
                                  onChange={(e) => setNewTax({
                                      ...newTax,
                                      description: e.target.value
                                  })}
                                  required
                              />
                          </Form.Group>
                      </Col>
                      <Col xs={12}>
                          <Button 
                              variant="info"
                              size="sm"
                              className="text-white"
                              type="submit"
                          >
                              Create Tax
                          </Button>
                      </Col>
                  </Row>
              </Form>
          </Modal.Body>
      </Modal>
  );

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
              <Button 
                  style={{width: "144px", height:"44px", borderStyle: "dashed"}} 
                  variant="outline-primary" 
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={handleShow}
              >
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
                
                {paymentTermsSection}
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
              {products.map((product, index) => (
                  <tr key={product.id}>
                      <td>
                          <div className="d-flex gap-2">
                              <Form.Select 
                                  className="flex-grow-1" 
                                  style={{ border: "1px solid black", borderStyle: "dashed" }}
                                  value={product.item}
                                  onChange={(e) => {
                                      const updatedProducts = products.map(p => 
                                          p.id === product.id ? {...p, item: e.target.value} : p
                                      );
                                      setProducts(updatedProducts);
                                  }}
                              >
                                  <option>Select Item</option>
                              </Form.Select>
                              <Button 
                              onClick={() => setShowProductList(true)}
                              className="flex-shrink-0" 
                              style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }} 
                              variant="outline-secondary"
                              >
                              +
                              </Button>
                              
                          </div>
                      </td>
                      <td>
                          <Form.Control 
                              type="text" 
                              placeholder="QTY : 1" 
                              style={{ border: "1px solid black", width: "100%" }}
                              value={product.quantity}
                              onChange={(e) => {
                                  const updatedProducts = products.map(p => 
                                      p.id === product.id ? {...p, quantity: e.target.value} : p
                                  );
                                  setProducts(updatedProducts);
                              }}
                          />
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
                                  value={product.price}
                                  onChange={(e) => {
                                      const updatedProducts = products.map(p => 
                                          p.id === product.id ? {...p, price: e.target.value} : p
                                      );
                                      setProducts(updatedProducts);
                                  }}
                              />
                          </div>
                      </td>
                      <td>
                          <div className="d-flex gap-2">
                              <Form.Select 
                                  className="flex-grow-1" 
                                  style={{ border: "1px solid black" }}
                                  value={product.tax}
                                  onChange={(e) => {
                                      const updatedProducts = products.map(p => 
                                          p.id === product.id ? {...p, tax: e.target.value} : p
                                      );
                                      setProducts(updatedProducts);
                                  }}
                              >
                                  <option value="">0 % TAX</option>
                                  {taxList.map((tax, index) => (
                                      <option key={index} value={tax.value}>
                                          {tax.name} ({tax.value}%)
                                      </option>
                                  ))}
                              </Form.Select>
                              <Button 
                                  className="flex-shrink-0" 
                                  style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }} 
                                  variant="outline-secondary"
                                  onClick={() => setShowTaxModal(true)}
                              >
                                  +
                              </Button>
                          </div>
                      </td>
                      <td>
                          <div className="position-relative w-100">
                              <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                  <FaRupeeSign />
                              </span>
                              <Form.Control 
                                  type="text" 
                                  placeholder="PRICE : 0.00" 
                                  className="w-100" 
                                  style={{ paddingLeft: "25px", border: "1px solid black" }} 
                                  value={product.total}
                                  readOnly 
                              />
                          </div>
                      </td>
                      {index > 0 && (
                                  <td>
                                  <Button 
                                  onClick={() => {
                                      const updatedProducts = products.filter((_, i) => i !== index);
                                      setProducts(updatedProducts);
                                  }}
                                  className="flex-shrink-0  d-flex justify-content-center align-items-center" 
                                  style={{ width: "40px", padding: "0px", height: "40px", border: "1px solid black", borderStyle: "dashed" }} 
                                  variant="outline-danger"
                                  >
                                  <FaTrash style={{fontSize:"15px"}}/>
                                  </Button>
                                  </td>
                              )}
                  </tr>
              ))}
            </tbody>
          </Table>
  
          <Button 
              variant="outline-primary" 
              className="mb-4 w-100 w-sm-50 w-md-25" 
              style={{ borderStyle: "dashed" }}
              onClick={addProduct}
          >
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
        
        {modalContent}
        {showProductList && <OffcanvesItems show={showProductList} handleClose={() => setShowProductList(false)} />}
        {paymentTermsModal}
        {taxModal}
      </Container>
    );
};

export default PurchaseOrderForm;

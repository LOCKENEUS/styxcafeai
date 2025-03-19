import React, { useState } from 'react';
import { Modal, Button, Card, Form, Row, Col, Table, ModalHeader, ModalTitle, ModalBody, CardHeader, CardBody, FormGroup, FormLabel } from "react-bootstrap";
import { BiPlus, BiArrowToLeft } from "react-icons/bi";

const AddClint = ({ show, handleClose }) => {
  const [showClientList, setShowClientList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    gender: ""
  });
  const [clients] = useState([
    { id: '84', name: 'Praful Patel', email: 'yashl+2@lockene.us', phone: '019876543', city: 'Jalandhar Division' },
    { id: '49', name: 'Amit', email: 'amit@gmail.com', phone: '4512789635', city: 'Calmar' },
    // Add more sample clients as needed
  ]);

  const toggleView = () => {
    setShowClientList(!showClientList);
  };

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle client creation logic here
    handleClose();
  };

  const selectClient = (clientId) => {
    // Handle client selection logic here
    console.log("Selected client:", clientId);
    handleClose();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal data-aos="fade-up" data-aos-duration="700" show={show} onHide={handleClose} size="lg">
      <ModalHeader className="bg-info bg-opacity-10 py-2">
        <span style={{fontSize:"20px" , fontWeight:"500"}}>{showClientList ? "Choose a client" : "Create New Client"}</span>
        <div className="d-flex pb-2 gap-2">
          <Button 
            variant="info" 
            size="sm" 
            onClick={toggleView}
          >
            <BiArrowToLeft size={20}/>
          </Button>
        </div>
      </ModalHeader>
      <ModalBody>
        {showClientList ? (
          <div>
            <h4 style={{fontSize:"15px"}}>Choose a client for create quote?</h4>
            <Card className="shadow">
              <CardHeader className="p-2 bg-info bg-opacity-10">
              <Row className="mb-2">
  <Col xs={8} sm={6} md={4}>
    <Form.Control 
      type="text" 
      placeholder="Search..." 
      // onChange={handleSearch} 
    />
  </Col>
  <Col xs={4} sm={6} md={8} className="text-end">
    <Button 
      variant="info" 
      size="sm" 
      onClick={toggleView}
    >
      {showClientList ? <BiPlus size={20}/> : <BiArrowToLeft size={20}/>}
    </Button>
  </Col>
</Row>

              </CardHeader>
              <CardBody className="p-2">
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
              </CardBody>
            </Card>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Full Name
                  </FormLabel>
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
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Contact Number
                  </FormLabel>
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
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Email
                  </FormLabel>
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Address
                  </FormLabel>
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Gender
                  </FormLabel>
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
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Country
                  </FormLabel>
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    State
                  </FormLabel>
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    City
                  </FormLabel>
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
                </FormGroup>
              </Col>
            </Row>

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
      </ModalBody>
    </Modal>
  );
};

export default AddClint;

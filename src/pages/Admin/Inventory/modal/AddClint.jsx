import React, { useState } from 'react';
import { Modal, Button, Card, Form, Row, Col, Table } from "react-bootstrap";
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
};

export default AddClint;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form, Row, Col, Table } from "react-bootstrap";
import { BiPlus, BiArrowToLeft, BiCross } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { addCustomer, searchCustomers } from "../../../../store/AdminSlice/CustomerSlice";
import { CgCross } from 'react-icons/cg';
import { RxCross1 } from 'react-icons/rx';

const AddClint = ({ show, handleClose, onClientSelect }) => {
  const dispatch = useDispatch();
  const [showClientList, setShowClientList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const cafeId = JSON.parse(localStorage.getItem('user'))?._id;

  const [newClient, setNewClient] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    gender: "",
    cafe: cafeId,
    creditEligibility: "",
    creditLimit: ""
  });

  useEffect(() => {
    if (show) {
      handleSearch({ target: { value: '' } });
    }
  }, [show]);

  const toggleView = () => {
    setShowClientList(!showClientList);
  };

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    try {
      const result = await dispatch(searchCustomers({ cafeId, searchTerm })).unwrap();
      setFilteredClients(result || []);
    } catch (error) {
      console.error('Error searching customers:', error);
      setFilteredClients([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cafe", newClient.cafe);
    formData.append("name", newClient.fullName);
    formData.append("email", newClient.email);
    formData.append("contact_no", newClient.contactNumber);
    formData.append("address", newClient.address);
    formData.append("gender", newClient.gender);
    formData.append("country", newClient.country);
    formData.append("state", newClient.state);
    formData.append("city", newClient.city);

    try {
      const result = await dispatch(addCustomer(formData)).unwrap();
      if (onClientSelect) {
        onClientSelect(result);
      }
      setNewClient({
        fullName: "",
        email: "",
        contactNumber: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        gender: "",
        cafe: cafeId,
        creditEligibility: "",
        creditLimit: ""
      });
      handleClose();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const selectClient = (client) => {
    if (onClientSelect) {
      onClientSelect(client);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header className="bg-info bg-opacity-10 py-2">
        <span style={{ fontSize: "20px", fontWeight: "500" }}>
          {showClientList ? "Choose a client" : "Create New Client"}
        </span>
        {
          !showClientList ?
            <Button
              variant="info"
              size="sm"
              onClick={toggleView}
            >
              <BiArrowToLeft size={20} />
            </Button>
            :
            <Button
              variant="info"
              size="sm"
              onClick={handleClose}
            >
              <RxCross1 size={20} />
            </Button>
        }

      </Modal.Header>
      <Modal.Body>
        {showClientList ? (
          <div>
            <Card className="shadow">
              <Card.Header className="p-2 bg-info bg-opacity-10">
                <Row className="mb-2">
                  <Col xs={8} sm={6} md={4}>
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Col>
                  <Col xs={4} sm={6} md={8} className="text-end">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={toggleView}
                    >
                      <BiPlus size={20} />
                    </Button>
                  </Col>
                </Row>
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
                      <tr key={client._id}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.contact_no}</td>
                        <td>{client.city}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => selectClient(client)}
                          >
                            <BiPlus size={20} />
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
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={newClient.fullName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    required
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter contact number"
                    value={newClient.contactNumber}
                    onChange={handleChange}

                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={newClient.email}
                    onChange={handleChange}

                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={newClient.address}
                    onChange={handleChange}

                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    required
                    name="gender"
                    value={newClient.gender}
                    onChange={handleChange}

                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder="Enter country"
                    value={newClient.country}
                    onChange={handleChange}

                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={newClient.state}
                    onChange={handleChange}

                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={newClient.city}
                    onChange={handleChange}

                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Eligible for Credit <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="creditEligibility"
                    value={newClient.creditEligibility}
                    onChange={handleChange}
                    className="rounded-2"
                    style={{ padding: '10px', fontSize: '0.9rem' }}
                  >
                    <option value="">Select Options</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Credit Limit
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="creditLimit"
                    placeholder="Enter credit limit"
                    value={newClient.creditLimit}
                    onChange={handleChange}
                    className="rounded-2"
                    style={{ padding: '10px', fontSize: '0.9rem' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
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

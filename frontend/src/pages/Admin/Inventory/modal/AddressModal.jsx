import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { FaList, FaPlus } from "react-icons/fa";

const AddressModal = ({ show, handleClose }) => {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreate = () => {
    setIsCreating(!isCreating);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <div className="modal-content rounded-2">
        <Modal.Header style={{ backgroundColor: "#00a1ff1f", padding: "20px" }} className="d-flex align-items-center">
            <Button variant="info" className="text-white me-3" onClick={toggleCreate}>
                {isCreating ? <FaPlus /> : <FaList />}
            </Button>
            <Modal.Title>Choose / Create Client Address</Modal.Title>
            <Button variant="close" onClick={handleClose} className="ms-auto"></Button>
        </Modal.Header>
        <Modal.Body className="p-4">
          {!isCreating ? (
            <div id="add-list" style={{ overflowX: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Choose</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Country</th>
                    <th>Zip</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Check
                        type="radio"
                        name="addressRadio"
                        defaultChecked
                      />
                    </td>
                    <td>CVDVS Space, Jalan Tentara Genie Pelajar...</td>
                    <td>Kota Magelang</td>
                    <td>Jawa Tengah</td>
                    <td>Indonesia</td>
                    <td>56116</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ) : (
            <Form className="row g-4">
              <Form.Group controlId="address4" className="col-12">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Enter address" required />
              </Form.Group>
              <Form.Group controlId="country4" className="col-md-6">
                <Form.Label>Country</Form.Label>
                <Form.Select required>
                  <option>Select Country</option>
                  <option>India</option>
                  <option>Indonesia</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="state4" className="col-md-6">
                <Form.Label>State</Form.Label>
                <Form.Select required>
                  <option>Select State</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="city4" className="col-md-6">
                <Form.Label>City</Form.Label>
                <Form.Select required>
                  <option>Select City</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="pincode4" className="col-md-6">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="tel" placeholder="000-000" required maxLength="13" />
              </Form.Group>
              <div className="col-12">
                <Button variant="info" type="submit" className="text-white">Submit</Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default AddressModal;

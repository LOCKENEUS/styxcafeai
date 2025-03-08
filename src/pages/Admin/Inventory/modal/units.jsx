import { Button, Col, Form, FormGroup, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from "react-bootstrap";

export const Units = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
      <ModalHeader closeButton >
        <ModalTitle>Inventory Units</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Row>
            <Col md={6}>
            <FormGroup>
                <label className="my-2">Unit </label>
                <input type="text"  className="form-control" placeholder="Enter unit " />
            </FormGroup>
            </Col>

            <Col md={6}>
            <FormGroup>
                <label className="my-2">Unique Quantity Code </label>
                <input type="text"  className="form-control" placeholder=" 0 0 0 - 0 0 0 " />
            </FormGroup>
            </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>Save</Button>
      </ModalFooter>
    </Modal>
    );
};


export const CreateCustomTaxModal = ({ show, handleClose }) => {
  return (
      <Modal show={show} onHide={handleClose} centered>
          <Modal.Header className="bg-light text-dark" closeButton>
              <Modal.Title>Create Custom Tax</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form id="CreateTax" method="post" action="" autoComplete="off">
                  <div className="row">
                      <div className="col-sm-6 mb-3">
                          <Form.Group controlId="tax_name">
                              <Form.Label>Tax name</Form.Label>
                              <Form.Control 
                                  type="text" 
                                  placeholder="Tax name" 
                                  required 
                              />
                          </Form.Group>
                      </div>
                      <div className="col-sm-6 mb-3">
                          <Form.Group controlId="tax_value">
                              <Form.Label>Tax Value</Form.Label>
                              <div className="input-group input-group-sm">
                                  <Form.Control 
                                      type="tel" 
                                      placeholder="0.00" 
                                      required 
                                      maxLength="2" 
                                      onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} 
                                  />
                                  <span className="input-group-text">%</span>
                              </div>
                          </Form.Group>
                      </div>
                      <div className="col-sm-12 mb-3">
                          <Form.Group controlId="tax_description">
                              <Form.Label>Tax Description</Form.Label>
                              <Form.Control 
                                  type="text" 
                                  placeholder="Custom tax description" 
                                  required 
                              />
                          </Form.Group>
                      </div>
                      <div className="col-12">
                          <Button className="btn btn-sm btn-primary" type="submit" id="TaxSubmitBtn">
                              Create Tax
                          </Button>
                      </div>
                  </div>
              </Form>
          </Modal.Body>
      </Modal>
  );
};

export const ManufacturerModal = ({ show, handleClose }) => {
  return (
      <Modal show={show} onHide={handleClose} centered>
          <Modal.Header className="bg-light text-dark" closeButton>
              <Modal.Title>Manufacturer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form id="manufacturerForm" method="post" action="" autoComplete="off">
                  <div className="row">
                      <div className="col-sm-12 mb-3">
                          <Form.Group controlId="mrf_name">
                              <Form.Label>Manufacturer name</Form.Label>
                              <Form.Control 
                                  type="text" 
                                  placeholder="Manufacturer Name" 
                                  required 
                              />
                          </Form.Group>
                      </div>
                      <div className="col-12">
                          <Button type="submit" className="btn btn-primary" id="manufacturerSubmitBtn">
                              Submit
                          </Button>
                      </div>
                  </div>
              </Form>
          </Modal.Body>
      </Modal>
  );
};

export const BrandModal = ({ show, handleClose }) => {
  return (
      <Modal show={show} onHide={handleClose} centered>
          <Modal.Header className="bg-light text-dark" closeButton>
              <Modal.Title>Brand</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form id="brandForm" method="post" action="" autoComplete="off">
                  <div className="row">
                      <div className="col-sm-12 mb-3">
                          <Form.Group controlId="brand_name">
                              <Form.Label>Brand name</Form.Label>
                              <Form.Control 
                                  type="text" 
                                  placeholder="Brand Name" 
                                  required 
                              />
                          </Form.Group>
                      </div>
                      <div className="col-12">
                          <Button type="submit" className="btn btn-primary" id="brandSubmitBtn">
                              Submit
                          </Button>
                      </div>
                  </div>
              </Form>
          </Modal.Body>
      </Modal>
  );
};
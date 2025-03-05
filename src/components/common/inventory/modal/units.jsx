import { Button, Col, FormGroup, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from "react-bootstrap";

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
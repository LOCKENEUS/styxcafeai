import { Button, Col, FormGroup, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from "react-bootstrap";

export const Units = ({ show, handleClose }) => {
  const lableHeader = {
    fontSize: "16px",
    fontWeight: "500",
}
const inputStyle = {
    borderRadius: "8px",
    padding: "13px",
    fontSize: "16px",
    border: "1px solid rgb(222, 222, 222)",

};
    return (
      
        <Modal show={show} onHide={handleClose} centered backdrop="static">
      <ModalHeader closeButton style={{backgroundColor: "skyblue"}} >
       
          <h1 className="text-center  " >
          Inventory Units
            </h1>
      </ModalHeader>
      <ModalBody>
        <Row>
            <Col md={6}>
            <FormGroup>
                <label style={lableHeader} className="my-2">Unit Name </label>
                <input type="text"  className="form-control" placeholder="Enter Unit Name " style={inputStyle} />
            </FormGroup>
            </Col>

            <Col md={6}>
            <FormGroup>
                <label className="my-2">Unit Code </label>
                <input type="text"  className="form-control" placeholder="Enter Unit Code " />
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
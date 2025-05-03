import { Button, Col, FormGroup, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from "react-bootstrap";

export const TaxModal = ({ show, handleClose }) => {
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
        <Modal show={show} onHide={handleClose} centered backdrop="static" >
      <ModalHeader  closeButton  style={{backgroundColor: "skyblue"}}>    
            <h1 className="text-center  " >Create Custom Tax</h1>       
      </ModalHeader>
      <ModalBody>
        <Row className="my-0">
            <Col md={6}>
            <FormGroup>
                <label className="my-2 fw-bold" style={lableHeader}>Tax name </label>
                <input type="text"  className="form-control" placeholder="Tax name " style={inputStyle} />
            </FormGroup>
            </Col>

            <Col md={6}>
            <FormGroup>
            <label className="my-2 fw-bold" style={lableHeader}>Tax Value </label>
                <input type="number"  className="form-control" placeholder=" Tax Value " style={inputStyle} />
            </FormGroup>
            </Col>
            <Col>
            {/* Tax Description */}
            <FormGroup>
            <label className="my-2 fw-bold" style={lableHeader}>Tax Description </label>
                <input type="text"  className="form-control" placeholder="Custom Tax Description " style={inputStyle} />
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
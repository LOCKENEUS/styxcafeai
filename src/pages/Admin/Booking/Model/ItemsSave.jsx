import { Modal, Button, Container } from "react-bootstrap";

const ItemsSave = ({ show, handleClose, handleConfirm }) => {
  
  return (
    <Modal show={show} onHide={handleClose}>
      <div className="modal-content rounded-2">
        <Modal.Header style={{ backgroundColor: "", padding: "20px" }} className="d-flex ">
          <Modal.Title>
           
          </Modal.Title>
          <Button variant="close" onClick={handleClose} className="ms-auto"></Button>
        </Modal.Header>
        <Modal.Body className="p-3 text-dark fs-6">
          <Container className="bg-white rounded-4 shadow" style={{ maxWidth: '600px' }}>
            Are you sure you want to save items ?
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                No
              </Button>
              <Button variant="primary" onClick={() =>{
                handleConfirm();
                handleClose();
              }}>
                Yes
              </Button>
            </div>
          </Container>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ItemsSave;
import { Button, Offcanvas } from "react-bootstrap";

const AddMembershipOffcanvas = ({ show, handleClose }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Membership</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h1>Add Membership</h1>
        <p>Form or content goes here...</p>
        <Button variant="success" onClick={handleClose}>
          Save
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddMembershipOffcanvas;

import { Button, Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "react-bootstrap";
import { addCustomField } from "../../../../store/AdminSlice/CustomField";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const Manufacturer = ({ show, handleClose, superAdminId }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataSubmit = {
      name: formData.name,
      cafe: superAdminId,
      type: "Manufacturer",
    };

    try {
      await dispatch(addCustomField(formDataSubmit));
      console.log("Submitted:", formDataSubmit);
      // toast.success("Manufacturer added successfully!");
      handleClose();
      setFormData({
        name: "",
      })
    } catch (error) {
      console.error("Error submitting manufacturer field:", error);
     
    }
  };

  const labelHeader = {
    fontSize: "16px",
    fontWeight: "500",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "13px",
    fontSize: "16px",
    border: "1px solid rgb(222, 222, 222)",
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <ModalHeader closeButton style={{ backgroundColor: "skyblue" }}>
        <h1 className="text-center">Manufacturer</h1>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <Row className="my-0">
            <Col md={6}>
              <FormGroup>
                <label className="my-2 fw-bold" style={labelHeader}>
                  Manufacturer Name
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Manufacturer name"
                  style={inputStyle}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

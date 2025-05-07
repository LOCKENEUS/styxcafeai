import { useState } from "react";
import {
  Button,
  Col,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addCustomField } from "../../../../store/AdminSlice/CustomField";
import { toast } from "react-toastify";

export const Brand = ({ show, handleClose, superAdminId }) => {
  const dispatch = useDispatch();

  console.log("superAdminId brand", superAdminId);

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
      type: "Brand",

    };

    try {
      await dispatch(addCustomField(formDataSubmit));
      // toast.success("Brand added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error submitting brand:", error);
      // toast.error("Failed to add brand.");
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
        <h1 className="text-center">Brand</h1>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <Row className="my-0">
            <Col md={6}>
              <FormGroup>
                <label className="my-2 fw-bold" style={labelHeader}>
                  Brand
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter Brand Name"
                  style={inputStyle}
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

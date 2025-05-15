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
import { useState } from "react";
import { addTaxField } from "../../../../store/AdminSlice/TextFieldSlice";

export const TaxModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    tax_name: "",
    tax_rate: "",
    tax_description: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const superAdminId = user?._id;

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
      tax_name: formData.tax_name,
      tax_rate: formData.tax_rate,
      description: formData.tax_description,
      cafe: superAdminId
    }

    try {
      await dispatch(addTaxField(formDataSubmit));
      handleClose();
      setFormData({
        cafe: superAdminId,
        tax_name: "",
        tax_rate: "",
        tax_description: "",
      })
    } catch (error) {
      console.error("Error submitting tax field:", error);
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
        <h1 className="text-center">Create Custom Tax</h1>
      </ModalHeader>
      <ModalBody>
        <Row className="my-0">
          <Col md={6}>
            <FormGroup>
              <label className="my-2 fw-bold" style={labelHeader}>
                Tax Name
              </label>
              <input
                type="text"
                name="tax_name"
                value={formData.tax_name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Tax Name"
                style={inputStyle}
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <label className="my-2 fw-bold" style={labelHeader}>
                Tax Value
              </label>
              <input
                type="number"
                name="tax_rate"
                value={formData.tax_rate}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Tax Value"
                style={inputStyle}
              />
            </FormGroup>
          </Col>

          <Col md={12}>
            <FormGroup>
              <label className="my-2 fw-bold" style={labelHeader}>
                Tax Description
              </label>
              <input
                type="text"
                name="tax_description"
                value={formData.tax_description}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Custom Tax Description"
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
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

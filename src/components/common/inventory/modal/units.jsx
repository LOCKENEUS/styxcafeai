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

export const Units = ({ show, handleClose, superAdminId }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    unitName: "",
    unitCode: "",
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
      name: formData.unitName,
      code: formData.unitCode,
      cafe: superAdminId,
      type: 'Unit',
    };

    try {
      await dispatch(addCustomField(formDataSubmit));
      console.log("Submitted:", formDataSubmit);
      handleClose(); 
      setFormData({
        unitName: "",
        unitCode: "",
      })
    } catch (error) {
      console.error("Error submitting unit field:", error);
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
        <h1 className="text-center">Inventory Units</h1>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md={6}>
            <FormGroup>
              <label style={labelHeader} className="my-2">
                Unit Name
              </label>
              <input
                type="text"
                name="unitName"
                value={formData.unitName}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter Unit Name"
                style={inputStyle}
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <label className="my-2" style={labelHeader}>
                Unit Code
              </label>
              <input
                type="text"
                name="unitCode"
                value={formData.unitCode}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter Unit Code"
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

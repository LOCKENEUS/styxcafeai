import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addCustomer, updateCustomer } from "../../../../store/AdminSlice/CustomerSlice";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const ClientModel = ({ show, handleClose, clientId = null }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const cafeId = JSON.parse(sessionStorage.getItem('user'))?._id;

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    cafe: cafeId,
    creditEligibility: "",
    creditLimit: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client data if in edit mode
  useEffect(() => {
    const fetchClientData = async () => {
      if (clientId) {
        try {
          const user = JSON.parse(sessionStorage.getItem('user'));
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/customer/${clientId}?cafe=${user.cafe}`);
          const customerData = response.data.data;

          setFormData({
            fullName: customerData.name || '',
            contactNumber: customerData.contact_no || '',
            cafe: cafeId,
            creditEligibility: customerData.creditEligibility || '',
            creditLimit: customerData.creditLimit || 0,
          });
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      }
    };

    if (show) {
      fetchClientData();
    }
  }, [clientId, show]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setFormData({
        fullName: "",
        contactNumber: "",
        cafe: cafeId,
        creditEligibility: "",
        creditLimit: 0,
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submittedData = new FormData();
    submittedData.append("cafe", formData.cafe);
    submittedData.append("name", formData.fullName);
    submittedData.append("contact_no", formData.contactNumber);
    submittedData.append("creditEligibility", formData.creditEligibility || "No");
    submittedData.append("creditLimit", formData.creditLimit);

    try {
      if (clientId) {
        // Edit mode
        await dispatch(updateCustomer({ id: clientId, data: submittedData })).unwrap();
      } else {
        // Create mode
        await dispatch(addCustomer(submittedData)).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <div className="modal-content rounded-2">
        <Modal.Header style={{ backgroundColor: "#00a1ff1f", padding: "20px" }} className="d-flex align-items-center">
          <Modal.Title>{clientId ? "Edit Client" : "Create New Client"}</Modal.Title>
          <Button variant="close" onClick={handleClose} className="ms-auto"></Button>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Full Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="rounded-2"
                    style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Contact Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="rounded-2"
                    style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Eligible for Credit
                  </Form.Label>
                  <Form.Select
                    name="creditEligibility"
                    value={formData.creditEligibility}
                    onChange={handleChange}
                    className="rounded-2"
                    style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                  >
                    <option value="">Select Options</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                    Credit Limit
                  </Form.Label>
                  <Form.Control
                    type="Number"
                    name="creditLimit"
                    value={formData.creditLimit}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                    className="rounded-2"
                    style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                className="rounded-2"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="rounded-2"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                {isSubmitting ? "Saving..." : (clientId ? "Update Client" : "Create Client")}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ClientModel;
























// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import { useDispatch } from "react-redux";
// import { addCustomer, updateCustomer } from "../../../../store/AdminSlice/CustomerSlice";
// import DynamicForm from "../../../../components/common/form/dynamicForm/DynamicForm";
// import { formStructure } from "./clientModalData";

// const ClientModel = ({ show, handleClose, clientId = null }) => {
//   const dispatch = useDispatch();
//   const cafeId = JSON.parse(sessionStorage.getItem("user"))?._id;

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     console.log("Form Data:", "here");

//     const submittedData = new FormData();
//     submittedData.append("cafe", cafeId);
//     submittedData.append("name", data.fullName);
//     submittedData.append("contact_no", data.contactNumber);
//     submittedData.append("creditEligibility", data.creditEligibility || "No");
//     submittedData.append("creditLimit", data.creditLimit);

//     try {
//       await dispatch(addCustomer(submittedData)).unwrap();
//       handleClose();
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered size="lg">
//       <div className="modal-content rounded-2">
//         <Modal.Header style={{ backgroundColor: "#00a1ff1f", padding: "20px" }} className="d-flex align-items-center">
//           <Modal.Title>{clientId ? "Edit Client" : "Create New Client"}</Modal.Title>
//           <Button variant="close" onClick={handleClose} className="ms-auto"></Button>
//         </Modal.Header>
//         <Modal.Body className="p-4">
//           <Form onSubmit={handleSubmit}>
//             <DynamicForm formData={formStructure} />
//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="outline-secondary" className="rounded-2" disabled={isSubmitting}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit" className="rounded-2">
//                 {isSubmitting ? "Saving..." : "Submit"}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </div>
//     </Modal>
//   );
// };

// export default ClientModel;





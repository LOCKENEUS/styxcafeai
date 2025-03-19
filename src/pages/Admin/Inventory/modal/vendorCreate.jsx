import { Modal, ModalBody, ModalHeader, Button, Form, Row, Col, FormGroup, FormLabel } from "react-bootstrap";
import { useState } from "react";
import { CreateVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder"; 
import { useDispatch } from "react-redux";

export const VendorCreateModal = ({ showCreateVendor, handleCloseCreateVendor }) => {


  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  const [newClient, setNewClient] = useState({
    vendorname: "",
    companyName :"",
    phone: "",
    email: "",
    // address: "",
    billingAddress:"",
    billingCountry:"",
    billingState:"",
    billingCity:"",
    billingZip:"",
    shippingAddress:"", 
    shippingcountry: "",
    shippingState: "",
    shippingCity: "",
    shippingZip: "",
  });

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Client Created:", newClient);
  //   handleCloseCreateVendor(); // No need to pass false, just call the function
  // };
  console.log("id ----------------------------------",cafeId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Client Created:", newClient);
    
    const formDataToSend = new FormData(); // Corrected initialization
  
    formDataToSend.append("name", newClient.vendorname);
    formDataToSend.append("email", newClient.email);
    formDataToSend.append("company", newClient.companyName);
    formDataToSend.append("phone", newClient.phone);
    formDataToSend.append("billingAddress", newClient.billingAddress);
    formDataToSend.append("shippingAddress", newClient.shippingAddress);
    formDataToSend.append("country1", newClient.billingCountry);
    formDataToSend.append("country2", newClient.shippingcountry);
    formDataToSend.append("state1", newClient.billingState);
    formDataToSend.append("state2", newClient.shippingState);
    formDataToSend.append("city1", newClient.billingCity);
    formDataToSend.append("city2", newClient.shippingCity);
    formDataToSend.append("pincode1", newClient.billingZip || 0);
    formDataToSend.append("pincode2", newClient.shippingZip || 0);
    formDataToSend.append('cafe', cafeId);
  
    try {
      await dispatch(CreateVendor(formDataToSend));
      setNewClient({
        vendorname: "",
        email: "",
        companyName: "",
        phone: "",
        billingAddress: "",
        shippingAddress: "",
        billingCountry: "",
        shippingcountry: "",
        billingState: "",
        shippingState: "",
        billingCity: "",
        shippingCity: "",
        billingZip: "",
        shippingZip: ""
      });
  
      handleCloseCreateVendor();
    } catch (error) {
      console.error("Error creating vendor:", error);
    } finally {
      setLoading(false);
    }
  };
  

  

  return (
    <Modal show={showCreateVendor} onHide={handleCloseCreateVendor} backdrop="static"  keyboard={false} size="lg" centered >
      <Modal.Header closeButton className="bg-info bg-opacity-50">
      <h4 className="fs-2 mb-3"> Vendor Create</h4>
      </Modal.Header>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Vendor Name<span class="text-danger mx-1">*</span></FormLabel>
                <Form.Control
                  type="text"
                  name="vendorname"
                  placeholder="Vendor Name"
                  value={newClient.vendorname}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Company Name</FormLabel>
                <Form.Control
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={newClient.companyName}
                  onChange={handleChange}
                  className="rounded-2"
                  
                />
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Email<span class="text-danger mx-1">*</span></FormLabel>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  value={newClient.email}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Vendor Number</FormLabel>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Enter Contact Number"
                  value={newClient.phone}
                  onChange={handleChange}
                  className="rounded-2"
                  
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className="my-2 ">
            <h3>Billing Address <span class="text-danger mx-1">*</span></h3>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted"> Address</FormLabel>
                <Form.Control
                  type="type"
                  name="billingAddress"
                  placeholder="Enter  Address"
                  value={newClient.billingAddress}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                />
              </FormGroup>
            </Col>
            
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Country</FormLabel>
                <Form.Select
                  name="billingCountry"
                  value={newClient.billingCountry}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="China">China</option>
                  <option value="India">India</option>
                  <option value="Haiti">Haiti</option>

                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">State</FormLabel>
                <Form.Select
                  name="billingState"
                  value={newClient.billingState}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                >
                  <option value="">Select State</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Punjab">Punjab</option>

                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">City</FormLabel>
                <Form.Select
                  name="billingCity"
                  value={newClient.billingCity}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                >
                  <option value="">Select City</option>
                  <option value="Begowala">Begowala</option>
                  <option value="Wardha">Wardha</option>
                  <option value="Nagpur">Nagpur</option>

                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted"> Zip Code</FormLabel>
                <Form.Control
                  type="type"
                  name="billingZip"
                  placeholder="Enter Zip Code"
                  value={newClient.billingZip}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                />
              </FormGroup>
            </Col>
            
          </Row>

          <Row className="my-2 ">
            <h3>Shipping Address<span className="text-primary"> (Copy Biling Address)</span></h3>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted"> Address</FormLabel>
                <Form.Control
                  type="type"
                  name="shippingAddress"
                  placeholder="Enter  Address"
                  value={newClient.shippingAddress}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                />
              </FormGroup>
            </Col>
            
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Country</FormLabel>
                <Form.Select
                  name="shippingcountry"
                  value={newClient.shippingcountry}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="China">China</option>
                  <option value="India">India</option>
                  <option value="Haiti">Haiti</option>

                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">State</FormLabel>
                <Form.Select
                  name="shippingState"
                  value={newClient.shippingState}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                >
                  <option value="">Select State</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Punjab">Punjab</option>

                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">City</FormLabel>
                <Form.Select
                  name="shippingCity"
                  value={newClient.shippingCity}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                >
                  <option value="">Select City</option>
                  <option value="Begowala">Begowala</option>
                  <option value="Wardha">Wardha</option>
                  <option value="Nagpur">Nagpur</option>

                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted"> Zip Code</FormLabel>
                <Form.Control
                  type="type"
                  name="shippingZip"
                  placeholder="Enter Zip Code"
                  value={newClient.shippingZip}
                  onChange={handleChange}
                  className="rounded-2"
                  required
                />
              </FormGroup>
            </Col>
            
          </Row>


          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" className="rounded-2" onClick={handleCloseCreateVendor}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="rounded-2">
              Submit
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

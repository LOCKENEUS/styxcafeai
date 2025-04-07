import { Modal, ModalBody, ModalHeader, Button, Form, Row, Col, FormGroup, FormLabel } from "react-bootstrap";
import { useState, useEffect } from "react";
import { CreateVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder"; 
import { useDispatch } from "react-redux";
import axios from "axios";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export const VendorCreateModal = ({ showCreateVendor, handleCloseCreateVendor, }) => {


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
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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
    formDataToSend.append("emailID", newClient.email);
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
  
  const handleBillingAddressSelect = (place) => {
    const placeId = place.value.place_id;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
      )
      .then((res) => {
        if (!res.data.results || res.data.results.length === 0) {
          throw new Error('No address details found for this location');
        }
        
        const result = res.data.results[0];
        const addressComponents = result.address_components;
        
        let city = "";
        let state = "";
        let country = "";
        let zipCode = "";
        
        addressComponents.forEach((component) => {
          const types = component.types;
          
          if (types.includes("locality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (types.includes("country")) {
            country = component.long_name;
          } else if (types.includes("postal_code")) {
            zipCode = component.long_name;
          }
        });
        
        const formattedAddress = result.formatted_address || place.label;
        
        setNewClient(prev => ({
          ...prev,
          billingAddress: formattedAddress,
          billingCity: city || prev.billingCity,
          billingState: state || prev.billingState,
          billingCountry: country || prev.billingCountry,
          billingZip: zipCode || prev.billingZip
        }));
      })
      .catch((err) => {
        console.error("Error fetching place details:", err);
      });
  };

  const copyBillingToShipping = () => {
    setNewClient(prev => ({
      ...prev,
      shippingAddress: prev.billingAddress,
      shippingCity: prev.billingCity,
      shippingState: prev.billingState,
      shippingcountry: prev.billingCountry,
      shippingZip: prev.billingZip
    }));
  };

  const handleShippingAddressSelect = (place) => {
    const placeId = place.value.place_id;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
      )
      .then((res) => {
        if (!res.data.results || res.data.results.length === 0) {
          throw new Error('No address details found for this location');
        }
        
        const result = res.data.results[0];
        const addressComponents = result.address_components;
        
        let city = "";
        let state = "";
        let country = "";
        let zipCode = "";
        
        addressComponents.forEach((component) => {
          const types = component.types;
          
          if (types.includes("locality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (types.includes("country")) {
            country = component.long_name;
          } else if (types.includes("postal_code")) {
            zipCode = component.long_name;
          }
        });
        
        const formattedAddress = result.formatted_address || place.label;
        
        setNewClient(prev => ({
          ...prev,
          shippingAddress: formattedAddress,
          shippingCity: city || prev.shippingCity,
          shippingState: state || prev.shippingState,
          shippingcountry: country || prev.shippingcountry,
          shippingZip: zipCode || prev.shippingZip
        }));
      })
      .catch((err) => {
        console.error("Error fetching place details:", err);
      });
  };

  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((res) => setCountries(res.data.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  useEffect(() => {
    if (newClient.billingCountry) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/states", {
          country: newClient.billingCountry,
        })
        .then((res) => setStates(res.data.data.states))
        .catch((err) => console.error("Error fetching states:", err));
    }
  }, [newClient.billingCountry]);

  useEffect(() => {
    if (newClient.billingState) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
          country: newClient.billingCountry,
          state: newClient.billingState,
        })
        .then((res) => setCities(res.data.data))
        .catch((err) => console.error("Error fetching cities:", err));
    }
  }, [newClient.billingState]);

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
            <Col md={12} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Address</FormLabel>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                  selectProps={{
                    value: newClient.billingAddress 
                      ? { label: newClient.billingAddress, value: newClient.billingAddress }
                      : null,
                    onChange: (place) => {
                      if (place) {
                        handleBillingAddressSelect(place);
                      } else {
                        setNewClient(prev => ({
                          ...prev,
                          billingAddress: '',
                          billingCity: '',
                          billingState: '',
                          billingCountry: '',
                          billingZip: ''
                        }));
                      }
                    },
                    placeholder: "Enter Address",
                    required: true,
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: '5px',
                        fontSize: '0.9rem',
                        borderColor: '#ced4da',
                        borderRadius: '8px'
                      })
                    }
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Country</FormLabel>
                <Form.Select
                  name="billingCountry"
                  value={newClient.billingCountry}
                  onChange={(e) => {
                    handleChange(e);
                    setNewClient(prev => ({
                      ...prev,
                      billingState: '',
                      billingCity: ''
                    }));
                  }}
                  className="rounded-2"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">State</FormLabel>
                <Form.Select
                  name="billingState"
                  value={newClient.billingState}
                  onChange={(e) => {
                    handleChange(e);
                    setNewClient(prev => ({
                      ...prev,
                      billingCity: ''
                    }));
                  }}
                  className="rounded-2"
                  required
                  disabled={!newClient.billingCountry}
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state.name}>
                      {state.name}
                    </option>
                  ))}
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
                  
                  disabled={!newClient.billingState}
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Shipping Address</h3>
              <Button 
                variant="outline-primary" 
                className="d-flex align-items-center gap-2"
                onClick={copyBillingToShipping}
              >
                Copy from Billing
              </Button>
            </div>
            <Col md={12} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Address</FormLabel>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                  selectProps={{
                    value: newClient.shippingAddress 
                      ? { label: newClient.shippingAddress, value: newClient.shippingAddress }
                      : null,
                    onChange: (place) => {
                      if (place) {
                        handleShippingAddressSelect(place);
                      } else {
                        setNewClient(prev => ({
                          ...prev,
                          shippingAddress: '',
                          shippingCity: '',
                          shippingState: '',
                          shippingcountry: '',
                          shippingZip: ''
                        }));
                      }
                    },
                    placeholder: "Enter Address",
                    
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: '5px',
                        fontSize: '0.9rem',
                        borderColor: '#ced4da',
                        borderRadius: '8px'
                      })
                    }
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">Country</FormLabel>
                <Form.Select
                  name="shippingcountry"
                  value={newClient.shippingcountry}
                  onChange={(e) => {
                    handleChange(e);
                    setNewClient(prev => ({
                      ...prev,
                      shippingState: '',
                      shippingCity: ''
                    }));
                  }}
                  className="rounded-2"
                  
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </Form.Select>
              </FormGroup>
            </Col>
            <Col md={4} className="my-2">
              <FormGroup>
                <FormLabel className="fw-semibold text-muted">State</FormLabel>
                <Form.Select
                  name="shippingState"
                  value={newClient.shippingState}
                  onChange={(e) => {
                    handleChange(e);
                    setNewClient(prev => ({
                      ...prev,
                      shippingCity: ''
                    }));
                  }}
                  className="rounded-2"
                  
                  disabled={!newClient.shippingcountry}
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state.name}>
                      {state.name}
                    </option>
                  ))}
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
                  
                  disabled={!newClient.shippingState}
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
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

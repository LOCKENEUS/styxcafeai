import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useDispatch } from "react-redux";
import { addCustomer, updateCustomer } from "../../../store/AdminSlice/CustomerSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const CreateCustomerForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const fileInputRef = useRef(null);
  const cafeId = JSON.parse(sessionStorage.getItem('user'))?._id;

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    additionalNotes: "",
    customerProfile: null,
    existingImage: "",
    cafe: cafeId,
    creditEligibility : "",
    creditLimit : 0,
    creditAmount : 0
  });

  // Add new state for preview
  const [imagePreview, setImagePreview] = useState(null);

  // Add validation state
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    gender: '',
    creditEligibility: ''
  });

  // Add validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      contactNumber: '',
      gender: '',
      creditEligibility: ''
    };

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
      isValid = false;
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
      isValid = false;
    }

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email is required';
    //   isValid = false;
    // } else if (!emailRegex.test(formData.email)) {
    //   newErrors.email = 'Please enter a valid email address';
    //   isValid = false;
    // }

    // Contact number validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    // Credit Eligibility validation
    if (!formData.creditEligibility) {
      newErrors.creditEligibility = 'Credit eligibility is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSelect = (place) => {
    const placeId = place.value.place_id;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
      )
      .then((res) => {
        const addressComponents = res.data.results[0].address_components;
        let city = "";
        let state = "";
        let country = "";

        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        setFormData(prev => ({
          ...prev,
          address: res.data.results[0].formatted_address,
          city,
          state,
          country,
        }));
      })
      .catch((err) => console.error("Error fetching place details:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, customerProfile: file });
      // Create preview URL for the new image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add this effect to fetch customer data when in edit mode
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (id) {
        try {
          const user = JSON.parse(sessionStorage.getItem('user'));
          const authToken = sessionStorage.getItem('authToken');
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/customer/${id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const customerData = response.data.data;
          
          setFormData({
            fullName: customerData.name || '',
            contactNumber: customerData.contact_no || '',
            email: customerData.email || '',
            dob: customerData.age || '',
            gender: customerData.gender || '',
            address: customerData.address || '',
            city: customerData.city || '',
            state: customerData.state || '',
            country: customerData.country || '',
            additionalNotes: customerData.additional_notes || '',
            customerProfile: null,
            existingImage: customerData.customerProfile || '',
            creditEligibility: customerData.creditEligibility || '',
            creditAmount : customerData.creditAmount || 0,
            creditLimit : customerData.creditLimit || 0,
            
            cafe: cafeId,
          });
        } catch (error) {
          console.error('Error fetching customer data:', error);
          // Optionally show error toast
        }
      }
    };

    fetchCustomerData();
  }, [id]);

  // Modify handleRemoveImage to also clear preview
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      existingImage: '',
      customerProfile: null
    });
    setImagePreview(null);
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const submittedData = new FormData();
    submittedData.append("cafe", formData.cafe);
    submittedData.append("name", formData.fullName);
    submittedData.append("email", formData.email);
    submittedData.append("contact_no", formData.contactNumber);
    submittedData.append("age", formData.dob);
    submittedData.append("address", formData.address);
    submittedData.append("gender", formData.gender);
    submittedData.append("country", formData.country);
    submittedData.append("state", formData.state);
    submittedData.append("city", formData.city);
    submittedData.append("additional_notes", formData.additionalNotes);
    submittedData.append("creditEligibility", formData.creditEligibility);
    submittedData.append("creditLimit", parseInt(formData.creditLimit) || 0);
    submittedData.append("creditAmount", parseInt(formData.creditAmount) || 0);
    
    if (formData.customerProfile) {
      submittedData.append("customerProfile", formData.customerProfile);
    }

    try {
      if (id) {
        // Edit mode
        await dispatch(updateCustomer({ id, data: submittedData })).unwrap();
      } else {
        // Create mode
        await dispatch(addCustomer(submittedData)).unwrap();
      }
      navigate("/admin/users/customer-list");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate("/admin/users/customer-list");
  };

  return (
    <div className="container mt-2">
      <h5>
        <Link to="/admin/dashboard">Home</Link> / 
        <Link to="/admin/users/customer-list">Customer List</Link> / 
        <span style={{ color: "blue" }}>{id ? "Edit Customer" : "Create New Customer"}</span>
      </h5>
      <div className="p-5  rounded-3 shadow-sm" style={{  margin: '0 auto' }}>
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
            className={`rounded-2 ${errors.fullName ? 'is-invalid' : ''}`}
            style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.fullName ? '#dc3545' : '#ced4da' }}
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
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
            className={`rounded-2 ${errors.contactNumber ? 'is-invalid' : ''}`}
            style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.contactNumber ? '#dc3545' : '#ced4da' }}
          />
          {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
        </Form.Group>
      </Col>
    </Row>

    <Row className="mb-3">
      <Col md={6}>
        <Form.Group className="mb-3">
           <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
            Email <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`rounded-2 ${errors.email ? 'is-invalid' : ''}`}
            style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.email ? '#dc3545' : '#ced4da' }}
          />
          {/* {errors.email && <div className="invalid-feedback">{errors.email}</div>} */}
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3">
           <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
            Date of Birth
          </Form.Label>
          <Form.Control
            type="date"
            name="dob"
            value={formData.dob}
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
            Gender <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`rounded-2 ${errors.gender ? 'is-invalid' : ''}`}
            style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.gender ? '#dc3545' : '#ced4da' }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Select>
          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3">
           <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
            Address
          </Form.Label>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
            selectProps={{
              value: formData.address
                ? { label: formData.address, value: formData.address }
                : null,
              onChange: handleSelect,
              placeholder: "Enter Address",
              styles: {
                control: (provided) => ({
                  ...provided,
                  padding: '5px',
                  fontSize: '0.9rem',
                  borderColor: '#ced4da'
                })
              }
            }}
          />
        </Form.Group>
      </Col>
    </Row>

    <Row className="mb-3">
      <Col md={6}>
        <Form.Group className="mb-3">
           <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
            Eligible for Credit <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            
            name="creditEligibility"
            value={formData.creditEligibility}
            onChange={handleChange}
            className={`rounded-2 ${errors.creditEligibility ? 'is-invalid' : ''}`}
            style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.creditEligibility ? '#dc3545' : '#ced4da' }}
          >
            <option value="">Select Options</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
          {errors.creditEligibility && <div className="invalid-feedback">{errors.creditEligibility}</div>}
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
            className="rounded-2"
            style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
          />
        </Form.Group>
      </Col>
    </Row>

    <Form.Group className="mb-3">
       <Form.Label className="fw-semibold" style={{ marginRight: '10px', fontSize: '0.9rem', color: '#555' }}>
        Profile Image
      </Form.Label>
      {formData.existingImage && (
        <div className="mb-2">
          <img
            src={`${import.meta.env.VITE_API_URL}/${formData.existingImage}`}
            alt="Current profile"
            className="rounded-2"
            style={{ maxWidth: '150px', height: 'auto', border: '1px solid #ddd' }}
          />
          <div className="mt-2">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleRemoveImage}
              className="rounded-2"
              style={{ padding: '5px 10px', fontSize: '0.9rem' }}
            >
              Remove Image
            </Button>
          </div>
        </div>
      )}
      {imagePreview && !formData.existingImage && (
        <div className="mb-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-2"
            style={{ maxWidth: '150px', height: 'auto', border: '1px solid #ddd' }}
          />
          <div className="mt-2">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleRemoveImage}
              className="rounded-2"
              style={{ padding: '5px 10px', fontSize: '0.9rem' }}
            >
              Remove Image
            </Button>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        name="customerProfile"
      />
      <Button
        variant="outline-primary"
        onClick={() => fileInputRef.current.click()}
        className="rounded-2"
        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
      >
        Choose Image
      </Button>
    </Form.Group>

    <Form.Group className="mb-4">
       <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
        Additional Notes
      </Form.Label>
      <Form.Control
        as="textarea"
        name="additionalNotes"
        rows={3}
        placeholder="Enter any additional information"
        value={formData.additionalNotes}
        onChange={handleChange}
        className="rounded-2"
        style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
      />
    </Form.Group>

    <div className="d-flex justify-content-end gap-2">
      <Button
        variant="outline-secondary"
        className="rounded-2"
        onClick={handleCancel}
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
        {isSubmitting ? "Saving..." : (id ? "Update User" : "Create User")}
      </Button>
    </div>
  </Form>
</div>
    </div>
  );
};

export default CreateCustomerForm;
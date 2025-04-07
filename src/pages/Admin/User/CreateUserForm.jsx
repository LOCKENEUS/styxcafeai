import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { addUser, updateUser, getUserById } from "../../../store/AdminSlice/UserSlice";
import axios from "axios";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Add this line
  const cafeId = JSON.parse(sessionStorage.getItem('user'))?._id;

  const { id } = useParams(); // For edit mode

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_no: "",
    age: "",
    address: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    department: "",
    role: "",
    additionalNotes: "",
    userProfile: null,
    existingImage: "",
    cafe: cafeId,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add validation state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contact_no: ''
  });

  // Add validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      contact_no: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Contact number validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.contact_no.trim()) {
      newErrors.contact_no = 'Contact number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.contact_no)) {
      newErrors.contact_no = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Add effect to fetch user data when in edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const user = JSON.parse(sessionStorage.getItem('user'));
          // Use the getUserById action from the slice instead of direct axios call
          const response = await dispatch(getUserById(id)).unwrap();
          
          setFormData({
            name: response.name || '',
            email: response.email || '',
            contact_no: response.contact_no || '',
            age: response.age || '',
            gender: response.gender || '',
            address: response.address || '',
            city: response.city || '',
            state: response.state || '',
            country: response.country || '',
            department: response.department || '',
            role: response.role || '',
            additionalNotes: response.additional_notes || '',
            userProfile: null,
            existingImage: response.userProfile || '',
            cafe: cafeId,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [id, dispatch]);

  const handleSelect = (place) => {
    const placeId = place.value.place_id;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
      )
      .then((res) => {
        // Check if we have valid results
        if (!res.data.results || res.data.results.length === 0) {
          throw new Error('No address details found for this location');
        }
  
        const result = res.data.results[0];
        const addressComponents = result.address_components;
  
        // Initialize address parts
        let city = "";
        let state = "";
        let country = "";
        let street = "";
        let zipCode = "";
  
        // Parse address components
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
          if (component.types.includes("postal_code")) {
            zipCode = component.long_name;
          }
          if (component.types.includes("route")) {
            street = component.long_name;
          }
        });
  
        // Build formatted address if needed
        const formattedAddress = result.formatted_address || place.label;
  
        setFormData(prev => ({
          ...prev,
          address: formattedAddress,
          city: city || prev.city,  // Fallback to previous value if not found
          state: state || prev.state,
          country: country || prev.country,
        }));
      })
      .catch((err) => {
        console.error("Error fetching place details:", err);
        // Optionally set error state or show user feedback
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, userProfile: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      existingImage: '',
      userProfile: null
    });
    setImagePreview(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Update handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const submittedData = new FormData();
    submittedData.append("cafe", formData.cafe);
    submittedData.append("name", formData.name);
    submittedData.append("email", formData.email);
    submittedData.append("contact_no", formData.contact_no);
    submittedData.append("age", formData.age);
    submittedData.append("address", formData.address);
    submittedData.append("gender", formData.gender);
    submittedData.append("country", formData.country);
    submittedData.append("state", formData.state);
    submittedData.append("city", formData.city);
    submittedData.append("department", formData.department);
    submittedData.append("role", formData.role);
    submittedData.append("additional_notes", formData.additionalNotes);
    
    // Send null when userProfile is removed
    submittedData.append("userProfile", formData.userProfile || null);

    try {
      if (id) {
        // Edit mode
        await dispatch(updateUser({ id, data: submittedData })).unwrap();
      } else {
        // Create mode
        await dispatch(addUser(submittedData)).unwrap();
      }
      navigate("/admin/users/user-list");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add cancel handler
  const handleCancel = () => {
    navigate("/admin/users/user-list");
  };

  return (
    <div className="container mt-2">
      <h5>
        <Link to="/admin/dashboard">Home</Link> / 
        <Link to="/admin/users/user-list">User List</Link> / 
        <span style={{ color: "blue" }}>{id ? "Edit User" : "Create User"}</span>
      </h5>
      <div className="p-5 bg-white rounded-3 shadow-sm" style={{ margin: '0 auto' }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  value={formData.name}
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  onChange={handleChange}
                  className={`rounded-2 ${errors.name ? 'is-invalid' : ''}`}
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.name ? '#dc3545' : '#ced4da' }}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Contact Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="contact_no"
                  placeholder="Enter Contact Number"
                  onChange={handleChange}
                  value={formData.contact_no}
                  className={`rounded-2 ${errors.contact_no ? 'is-invalid' : ''}`}
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.contact_no ? '#dc3545' : '#ced4da' }}
                />
                {errors.contact_no && <div className="invalid-feedback">{errors.contact_no}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  name="email"
                  placeholder="Enter Email Address"
                  onChange={handleChange}
                  className={`rounded-2 ${errors.email ? 'is-invalid' : ''}`}
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: errors.email ? '#dc3545' : '#ced4da' }}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Age <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={formData.age}
                  name="age"
                  placeholder="Enter Age"
                  onChange={handleChange}
                  className="rounded-2"
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Gender <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.gender}
                  name="gender"
                  onChange={handleChange}
                  className="rounded-2"
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
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
    onChange: (place) => {
      if (place) {
        handleSelect(place);
      } else {
        // Handle clear action
        setFormData(prev => ({
          ...prev,
          address: '',
          city: '',
          state: '',
          country: ''
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
              </Form.Group>
            </Col>
          </Row>

          {/* Extracted City, State, and Country Fields */}
          <Row className="mb-2">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  City
                </Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="rounded-2"
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  State
                </Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="rounded-2"
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Country
                </Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="rounded-2"
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Department and Role Fields */}
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Department <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.department}
                  name="department"
                  onChange={handleChange}
                  className="rounded-2"
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                >
                  <option>Select Department</option>
                  <option>HR</option>
                  <option>Sales</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Role / Position <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={formData.role}
                  placeholder="Enter Role or Position"
                  onChange={handleChange}
                  className="rounded-2"
                  style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Additional Notes Field */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
              Additional Notes
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="additionalNotes"
              placeholder="Enter any additional information"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="rounded-2"
              style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
            />
          </Form.Group>

          {/* Update the Profile Image section */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555', marginRight: '10px' }}>
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
              name="userProfile"
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

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-2"
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

export default CreateUser;

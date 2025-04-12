import React, { useState, useEffect } from "react";
import { Button, Col, Form, Offcanvas, Row, Spinner } from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { addCafe, updateCafe } from "../../../store/slices/cafeSlice";
import { getLocations } from "../../../store/slices/locationSlice";
import { toast } from "react-toastify";
import { GiConsoleController } from "react-icons/gi";
import { useJsApiLoader } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";

const CafeForm = ({
  showCanvas,
  handleCloseCanvas,
  isEditing,
  cafeData,
  setFormDataState,
  setImagePreview,
  imagePreview = [],
  initialFormData,
  editingIndex,
  setShowCanvas,
  fileInputRef,
  formDataState,
}) => {


  console.log("isEditing", isEditing);
  console.log("cafeData", cafeData);

  const dispatch = useDispatch();
  const { locations = [] } = useSelector((state) => state.locations);
  console.log("Locations", locations);
  const [width, setWidth] = useState(window.innerWidth < 768 ? "80%" : "50%");

  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });
  const [autocomplete, setAutocomplete] = useState(null);

  // Add new state for document preview
  const [documentPreview, setDocumentPreview] = useState([]);

  // Add validation states
  const [errors, setErrors] = useState({
    name: '',
    password: '',
    confirm_password: ''
  });

  // Add these state declarations near the top of your component with other state declarations
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add this new state for tracking manual entry mode
  const [useManualAddress, setUseManualAddress] = useState(false);

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    dispatch(getLocations());
  }, [dispatch]);
  useEffect(() => {
    if (showCanvas && !isEditing) {
      setFormDataState((prev) =>
        prev === initialFormData ? prev : initialFormData
      );
      setImagePreview([]);
    }
  }, [showCanvas, isEditing]);

  // Add cleanup for autocomplete
  useEffect(() => {
    return () => {
      if (autocomplete) {
        setAutocomplete(null);
      }
    };
  }, []);

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      try {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setFormDataState(prev => ({
            ...prev,
            address: place.formatted_address
          }));
        }
      } catch (error) {
        console.error('Error getting place:', error);
      }
    }
  };

  // Modified handleChange function with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));

    // Validation logic
    switch (name) {
      case 'name':
        if (value.length < 3) {
          setErrors(prev => ({
            ...prev,
            name: 'Name must be at least 3 characters long'
          }));
        } else {
          setErrors(prev => ({ ...prev, name: '' }));
        }
        break;

        // adress are blank enter REQUIRED adress
      case 'address':
        if (value.length < 3) {
          setErrors(prev => ({
            ...prev,
            address: 'Address are Required'
          }));
        } else {
          setErrors(prev => ({ ...prev, address: '' }));
        }
        break;

      case 'password':
        if (!validatePassword(value)) {
          setErrors(prev => ({
            ...prev,
            password: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
          }));
        } else {
          setErrors(prev => ({ ...prev, password: '' }));
        }
        // Check confirm password match
        if (formDataState.confirm_password && value !== formDataState.confirm_password) {
          setErrors(prev => ({
            ...prev,
            confirm_password: 'Passwords do not match'
          }));
        } else if (formDataState.confirm_password) {
          setErrors(prev => ({ ...prev, confirm_password: '' }));
        }
        break;

      case 'confirm_password':
        if (value !== formDataState.password) {
          setErrors(prev => ({
            ...prev,
            confirm_password: 'Passwords do not match'
          }));
        } else {
          setErrors(prev => ({ ...prev, confirm_password: '' }));
        }
        break;
      
        case 'yearsOfContract':
          if (value < 1 ) {
            setErrors(prev => ({
              ...prev,
              yearsOfContract: 'Years of contract must be at least 1'
            }));
          } else {
            setErrors(prev => ({ ...prev, yearsOfContract: '' }));
          }
          break;

      default:
        break;
    }
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      isExisting: false
    }));

    setDocumentPreview((prev) => [...prev, ...newDocPreviews]);
    setFormDataState((prev) => ({
      ...prev,
      document: [...(prev.document || []), ...files],
    }));
  };

  const handleRemoveDocument = (index) => {
    setDocumentPreview((prev) => prev.filter((_, i) => i !== index));
    setFormDataState((prev) => ({
      ...prev,
      document: prev.document.filter((_, i) => i !== index),
    }));
  };

  // Modified handleSubmit function with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (errors.name || errors.password || errors.confirm_password) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    if (formDataState.password !== formDataState.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    // check user are pass adress are blank enter REQUIRED adress
    if (formDataState.address === '') {
      toast.warning('Address are Required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formDataState.name);
    formDataToSend.append("email", formDataState.email);
    formDataToSend.append("contact_no", formDataState.contact_no);
    formDataToSend.append("cafe_name", formDataState.cafe_name);
    formDataToSend.append("address", formDataState.address);
    formDataToSend.append("website_url", formDataState.website_url);
    formDataToSend.append("location", formDataState.location);
    formDataToSend.append("description", formDataState.description);
    formDataToSend.append("password", formDataState.password);
    formDataToSend.append("gstNo", formDataState.gstNo);
    formDataToSend.append("panNo", formDataState.panNo);
    formDataToSend.append("ownershipType", formDataState.ownershipType);
    formDataToSend.append("depositAmount", formDataState.depositAmount);
    formDataToSend.append("yearsOfContract", formDataState.yearsOfContract);
    formDataToSend.append("officeContactNo", formDataState.officeContactNo);

    if (Array.isArray(formDataState.cafeImage)) {
      formDataState.cafeImage.forEach((file) => {
        formDataToSend.append("cafeImage", file);
      });
    }

    if (Array.isArray(formDataState.document)) { // Changed from documents to document
      formDataState.document.forEach((file) => {
        formDataToSend.append("document", file); // Changed from documents to document
      });
    }

    try {
      setIsLoading(true);

      if (isEditing) {
        await dispatch(
          updateCafe({ id: formDataState.editId, updatedData: formDataToSend })
        );
      } else {
        await dispatch(addCafe(formDataToSend));
      }

      setFormDataState(initialFormData);
      setImagePreview([]);
      setShowCanvas(false);
    } catch (error) {
      console.error(`Failed to ${isEditing ? "update" : "save"} cafe:`, error);
      toast.error(
        `Failed to ${isEditing ? "update" : "save"} cafe: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // MObile Size
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? "80%" : "50%");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemoveImage = (index) => {
    const updatedImagePreviews = imagePreview.filter((_, i) => i !== index);
    setImagePreview(updatedImagePreviews);

    setFormDataState((prev) => ({
      ...prev,
      cafeImage: prev.cafeImage.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));

    setImagePreview((prev) => [...prev, ...newImagePreviews]);
    setFormDataState((prev) => ({
      ...prev,
      cafeImage: prev.cafeImage ? [...prev.cafeImage, ...files] : [...files],
    }));
  };

  // Modify useEffect to handle existing images and documents when editing
  useEffect(() => {
    if (showCanvas && isEditing && cafeData) {
      // Handle existing images
      if (cafeData.cafeImage) {
        const existingImagePreviews = Array.isArray(cafeData.cafeImage)
          ? cafeData.cafeImage.map(img => `${import.meta.env.VITE_API_URL}/${img}`)
          : [`${import.meta.env.VITE_API_URL}/${cafeData.cafeImage}`];

        setImagePreview(existingImagePreviews);

        // Also update formDataState with the existing images
        setFormDataState(prev => ({
          ...prev,
          cafeImage: Array.isArray(cafeData.cafeImage) ? cafeData.cafeImage : [cafeData.cafeImage]
        }));
      }

      // Handle existing documents
      if (Array.isArray(cafeData.document)) {
        const existingDocPreviews = cafeData.document.map(doc => ({
          name: doc.split('-').pop(), // Extract filename from path
          url: `${import.meta.env.VITE_API_URL}/${doc}`,
          isExisting: true
        }));
        setDocumentPreview(existingDocPreviews);
      }
    }
  }, [showCanvas, isEditing, cafeData]);

  // Add these handler functions
  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // Prevent form submission
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault(); // Prevent form submission
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Modify the handleSelect function
  const handleSelect = (place) => {
    const placeId = place.value.place_id;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
      )
      .then((res) => {
        setFormDataState(prev => ({
          ...prev,
          address: res.data.results[0].formatted_address
        }));
      })
      .catch((err) => {
        console.error("Error fetching place details:", err);
        toast.error("Error fetching address details");
      });
  };

  // Add handler for manual address input
  const handleManualAddressChange = (e) => {
    setFormDataState(prev => ({
      ...prev,
      address: e.target.value
    }));
  };

  console.log("editingIndex", editingIndex);

  return (
    <Offcanvas
      show={showCanvas}
      onHide={handleCloseCanvas}
      placement="end"
      style={{ width }}
      className="cafe-form-offcanvas"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <h2 className="text-primary fw-bold">
            {editingIndex === null ? "Add New Cafe  " : "Edit Cafe"}
          </h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="name" className="fw-bold text-secondary">
                  Name
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={formDataState.name}
                  onChange={handleChange}
                  required
                  className={`py-2 border-2 ${errors.name ? 'is-invalid' : ''}`}
                />
                {errors.name && (
                  <Form.Text className="text-danger">
                    {errors.name}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="cafeName"
                  className="fw-bold text-secondary"
                >
                  Cafe Name
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="cafeName"
                  type="text"
                  name="cafe_name"
                  placeholder="Enter Cafe Name"
                  value={formDataState.cafe_name}
                  onChange={handleChange}
                  required
                  className="py-2 border-2"
                  
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-1">
            <Form.Label htmlFor="address" className="fw-bold text-secondary">
              Address
              <span className="text-danger">*</span>
            </Form.Label>
            {!useManualAddress ? (
              <>
                <GooglePlacesAutocomplete
                 
                  apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                  selectProps={{
                    value: formDataState.address
                      ? { label: formDataState.address, value: formDataState.address }
                      : null,
                    onChange: handleSelect,
                    placeholder: "Enter address",
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: '5px',
                        fontSize: '0.9rem',
                        borderColor: '#ced4da'
                      }),
                      container: (provided) => ({
                        ...provided,
                        zIndex: 1000
                      })
                      
                    }
                  }}
                />
                <div className="mb-4 mt-2 text-center">
                  <Button
                    variant="link"
                    className="manual-address-link"
                    onClick={() => setUseManualAddress(true)}
                  >
                    <i className="fas fa-edit me-1"></i>
                    Can't find your address? Enter manually
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formDataState.address || ''}
                  onChange={handleManualAddressChange}
                  placeholder="Enter your address manually"
                  className="mb-1"
                  required
                />
                <div className="mt-1">
                  <Button
                    variant="link"
                    className="p-0 text-secondary"
                    onClick={() => setUseManualAddress(false)}
                  >
                    Use address lookup instead
                  </Button>
                </div>
              </>
            )}
          </Form.Group>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="contact"
                  className="fw-bold text-secondary"
                >
                  Contact Number
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="contact"
                  type="tel"
                  name="contact_no"
                  placeholder="Enter Contact Number"
                  value={formDataState.contact_no}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                  className="py-2 border-2"
                />
                <Form.Text className="text-muted">
                  10-digit phone number
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="officeContact" className="fw-bold text-secondary">
                  Office Contact Number
                </Form.Label>
                <Form.Control
                  id="officeContact"
                  type="tel"
                  name="officeContactNo"
                  placeholder="Enter Office Contact Number"
                  value={formDataState.officeContactNo || ''}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  className="py-2 border-2"
                />
                <Form.Text className="text-muted">
                  10-digit office phone number
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="email" className="fw-bold text-secondary">
                  Email Address
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="Enter Email Address"
                  value={formDataState.email}
                  onChange={handleChange}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="location"
                  className="fw-bold text-secondary"
                >
                  Location
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  id="location"
                  name="location"
                  value={formDataState.location || ""}
                  onChange={handleChange}
                  className="py-2 border-2"
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.city}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="website"
                  className="fw-bold text-secondary"
                >
                  Website URL
                  
                </Form.Label>
                <Form.Control
                  id="website"
                  type="url"
                  name="website_url"
                  placeholder="Enter Website URL"
                  value={formDataState.website_url}
                  onChange={handleChange}
                  pattern="https?://.+"
                  className="py-2 border-2"
                  
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-1">
            <Form.Label
              htmlFor="description"
              className="fw-bold text-secondary"
            >
              Description
            </Form.Label>
            <Form.Control
              id="description"
              as="textarea"
              rows={3}
              name="description"
              placeholder="Enter Description"
              value={formDataState.description}
              onChange={handleChange}
              className="py-2 border-2"
              multiple
            />
          </Form.Group>

          <Row className="mb-3">
          <Form.Label className="fw-bold text-secondary d-block my-3">
              Gallery Images
              <span className="text-muted fs-6 fw-light ms-2">(You can upload multiple images)</span>
            </Form.Label>

            <Col md={5} className="mt-3">
            
              <div className="border-2 rounded-3 p-3 bg-light ">
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  id="fileUploadLocation"
                  ref={fileInputRef}
                  multiple
                />
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <label
                      style={{ width: "10rem", height: "3rem" }}
                      htmlFor="fileUploadLocation"
                      className="btn btn-outline-primary d-flex justify-content-center align-items-center py-2"
                    >
                      Choose Files
                    </label>
                  </div>

                  
                </div>
              </div>
            </Col>

            <Col md={7} className="mt-3">

            {imagePreview.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="img-thumbnail"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            onClick={() => handleRemoveImage(index)}
                            className="position-absolute top-0 end-0 cursor-pointer"
                            style={{ transform: "translate(25%, -25%)" }}
                          >
                            <TiDeleteOutline color="red" size={25} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="password" className="fw-bold text-secondary">
                  Password
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    required
                    className={`py-2 border-2 ${errors.password ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y pe-3 border-0 bg-transparent"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ?
                      <AiOutlineEyeInvisible size={20} color="#6c757d" /> :
                      <AiOutlineEye size={20} color="#6c757d" />
                    }
                  </button>
                </div>
                {errors.password && (
                  <Form.Text className="text-danger">
                    {errors.password}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="confirmPassword" className="fw-bold text-secondary">
                  Confirm Password
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formDataState.confirm_password || ''}
                    onChange={handleChange}
                    required
                    className={`py-2 border-2 ${errors.confirm_password ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y pe-3 border-0 bg-transparent"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ?
                      <AiOutlineEyeInvisible size={20} color="#6c757d" /> :
                      <AiOutlineEye size={20} color="#6c757d" />
                    }
                  </button>
                </div>
                {errors.confirm_password && (
                  <Form.Text className="text-danger">
                    {errors.confirm_password}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="gstNo" className="fw-bold text-secondary">
                  GST Number
                </Form.Label>
                <Form.Control
                  id="gstNo"
                  type="text"
                  name="gstNo"
                  placeholder="Enter GST Number"
                  value={formDataState.gstNo || ''}
                  onChange={handleChange}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="panNo" className="fw-bold text-secondary">
                  PAN Number
                </Form.Label>
                <Form.Control
                  id="panNo"
                  type="text"
                  name="panNo"
                  placeholder="Enter PAN Number"
                  value={formDataState.panNo || ''}
                  onChange={handleChange}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="ownershipType" className="fw-bold text-secondary">
                  Ownership Type
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  id="ownershipType"
                  name="ownershipType"
                  value={formDataState.ownershipType || ''}
                  onChange={handleChange}
                  required
                  className="py-2 border-2"
                >
                  <option value="">Select ownership type</option>
                  <option value="FOFO">FoFo (Franchise owned, Franchise operator)</option>
                  <option value="FOCO">FoCo (Franchise owned, Company operator)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="depositAmount" className="fw-bold text-secondary">
                  Deposit Amount
                </Form.Label>
                <Form.Control
                  id="depositAmount"
                  type="number"
                  name="depositAmount"
                  placeholder="Enter Deposit Amount"
                  value={formDataState.depositAmount || ''}
                  onChange={handleChange}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="yearsOfContract" className="fw-bold text-secondary">
                  Years of Contract
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="yearsOfContract"
                  type="number"
                  name="yearsOfContract"
                  placeholder="Enter Years of Contract"
                  value={formDataState.yearsOfContract || ''}
                  onChange={handleChange}
                  className="py-2 border-2"
                  required
                />
              </Form.Group>
              {errors.yearsOfContract && (
                  <Form.Text className="text-danger">
                    {errors.yearsOfContract}
                  </Form.Text>
                )}
            </Col>
          </Row>

          {/* Document Upload Section */}
          <Row className="mb-3">
            <Col md={5}>
              <Form.Label className="fw-bold text-secondary d-block">
                Upload Documents  <span className="text-danger m">(pdf, doc, docx)*</span>
              </Form.Label>
              <div className="border-2 rounded-3 p-3 bg-light">
                <Form.Control
                  type="file"
                  onChange={handleDocumentChange}
                  accept=".pdf,.doc,.docx"
                  className="d-none"
                  id="documentUpload"
                  multiple
                />
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <label
                      htmlFor="documentUpload"
                      className="btn btn-outline-primary d-flex justify-content-center align-items-center py-2"
                      style={{ width: "10rem", height: "3rem" }}
                    >
                      Upload Documents
                    </label>
                  </div>

                  
                </div>
              </div>
            </Col>
            <Col md={7}>
  {documentPreview.length > 0 && (
    <div className="d-flex flex-wrap gap-2">
      {documentPreview.map((doc, index) => (
        <div
          key={index}
          className="p-2 border rounded bg-white d-flex justify-content-between align-items-center"
          style={{ width: '48%' }}
        >
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-dark text-truncate"
            style={{
              maxWidth: "150px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
            title={doc.name}
          >
            {doc.name}
          </a>
          <TiDeleteOutline
            color="red"
            size={20}
            onClick={() => handleRemoveDocument(index)}
            style={{ cursor: 'pointer', marginLeft: '8px' }}
          />
        </div>
      ))}
    </div>
  )}
</Col>

          </Row>

          <div className="mt-2 d-flex gap-2 justify-content-end">
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Cafe"
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowCanvas(false)}
              className="px-4 py-2 fw-bold"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

const styles = `
  .cafe-form-offcanvas {
    z-index: 1045;
  }

  .address-container {
    position: relative;
  }

  .pac-container {
    z-index: 1046 !important;
    position: fixed !important;
    margin-top: 2px;
  }

  /* Ensure suggestions appear inside Offcanvas */
  .cafe-form-offcanvas .pac-container {
    width: calc(100% - 40px) !important;
    left: auto !important;
  }

  /* Style the suggestions */
  .pac-item {
    padding: 8px;
    cursor: pointer;
  }

  .pac-item:hover {
    background-color: #f8f9fa;
  }

  .manual-address-link {
    color: #6366f1;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    background: rgba(99, 102, 241, 0.1);
    border: 1px dashed #6366f1;
  }

  .manual-address-link:hover {
    background: rgba(99, 102, 241, 0.15);
    color: #4f46e5;
    transform: translateY(-1px);
  }

  .manual-address-link:active {
    transform: translateY(0);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CafeForm;

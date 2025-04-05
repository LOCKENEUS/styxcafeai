import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCafesID } from '../../../../store/slices/cafeSlice';

function EditCafeOffcanvas({ show, handleClose ,cafeId}) {


    const [formDataState, setFormDataState] = useState({});
    const [useManualAddress, setUseManualAddress] = useState(false);
    const { locations = [] } = useSelector((state) => state.locations);
     const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

        const dispatch = useDispatch();
        const IDCafeFetch =useSelector((state) => state.cafes);
        
        useEffect(() => {
            if (cafeId) {
              dispatch(fetchCafesID(cafeId));
            }
        },[dispatch,cafeId]);
        console.log("selectedCafe offcanvas call 888-----------",IDCafeFetch);
        
        
        useEffect(() => {
            console.log("selectedCafe offcanvas call 888-----------", IDCafeFetch);
        
            if (IDCafeFetch && IDCafeFetch.length > 0) {
              const selectedCafe1 = IDCafeFetch.find((cafe) => cafe._id === cafeId);
              if (selectedCafe1) {
                setFormDataState(selectedCafe);
                console.log("selectedCafe offcanvas call 999-----------", selectedCafe1);
              }
            }
          }, [IDCafeFetch, cafeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataState((prev) => ({ ...prev, [name]: value }));
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
      const toggleConfirmPasswordVisibility = (e) => {
        e.preventDefault(); // Prevent form submission
        setShowConfirmPassword(!showConfirmPassword);
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

      const togglePasswordVisibility = (e) => {
        e.preventDefault(); // Prevent form submission
        setShowPassword(!showPassword);
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formDataState);
      };


  return (
    <Offcanvas show={show} onHide={handleClose}  placement="end"  style={{ width: "700px" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
        <h2 className="text-primary fw-bold">Edit Cafe</h2>
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
                        //   value={formDataState.name}
                          onChange={handleChange}
                          required
                        //   className={`py-2 border-2 ${errors.name ? 'is-invalid' : ''}`}
                        />
                        {/* {errors.name && (
                          <Form.Text className="text-danger">
                            {errors.name}
                          </Form.Text>
                        )} */}
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
                        //   value={formDataState.cafe_name}
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
                        //   selectProps={{
                        //     value: formDataState.address
                        //       ? { label: formDataState.address, value: formDataState.address }
                        //       : null,
                        //     onChange: handleSelect,
                        //     placeholder: "Enter address",
                        //     styles: {
                        //       control: (provided) => ({
                        //         ...provided,
                        //         padding: '5px',
                        //         fontSize: '0.9rem',
                        //         borderColor: '#ced4da'
                        //       }),
                        //       container: (provided) => ({
                        //         ...provided,
                        //         zIndex: 1000
                        //       })
                              
                        //     }
                        //   }}
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
                        //   value={formDataState.address || ''}
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
                        //   value={formDataState.contact_no}
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
                        //   value={formDataState.officeContactNo || ''}
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
                        //   value={formDataState.email}
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
                        </Form.Label>
                        <Form.Control
                          as="select"
                          id="location"
                          name="location"
                        //   value={formDataState.location || ""}
                          onChange={handleChange}
                          className="py-2 border-2"
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
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          id="website"
                          type="url"
                          name="website_url"
                          placeholder="Enter Website URL"
                        //   value={formDataState.website_url}
                          onChange={handleChange}
                          pattern="https?://.+"
                          className="py-2 border-2"
                          required
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
                    //   value={formDataState.description}
                      onChange={handleChange}
                      className="py-2 border-2"
                    />
                  </Form.Group>
        
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Label className="fw-bold text-secondary d-block">
                        Upload Images
                      </Form.Label>
                      <div className="border-2 rounded-3 p-3 bg-light">
                        <Form.Control
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="d-none"
                          id="fileUploadLocation"
                        //   ref={fileInputRef}
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
        
                          {/* {imagePreview.length > 0 && (
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
                          )} */}
                        </div>
                      </div>
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
                            // className={`py-2 border-2 ${errors.password ? 'is-invalid' : ''}`}
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
                        {/* {errors.password && (
                          <Form.Text className="text-danger">
                            {errors.password}
                          </Form.Text>
                        )} */}
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
                            // value={formDataState.confirm_password || ''}
                            onChange={handleChange}
                            required
                            // className={`py-2 border-2 ${errors.confirm_password ? 'is-invalid' : ''}`}
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
                        {/* {errors.confirm_password && (
                          <Form.Text className="text-danger">
                            {errors.confirm_password}
                          </Form.Text>
                        )} */}
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
                        //   value={formDataState.gstNo || ''}
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
                        //   value={formDataState.panNo || ''}
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
                        //   value={formDataState.ownershipType || ''}
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
                        //   value={formDataState.depositAmount || ''}
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
                        </Form.Label>
                        <Form.Control
                          id="yearsOfContract"
                          type="number"
                          name="yearsOfContract"
                          placeholder="Enter Years of Contract"
                        //   value={formDataState.yearsOfContract || ''}
                          onChange={handleChange}
                          className="py-2 border-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
        
                  {/* Document Upload Section */}
                  <Row className="mb-3">
                    <Col md={6}>
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
        
                          {/* {documentPreview.length > 0 && (
                            <div className="d-flex flex-column gap-2">
                              {documentPreview.map((doc, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center p-2 border rounded">
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none text-dark"
                                  >
                                    {doc.name}
                                  </a>
                                  <TiDeleteOutline
                                    color="red"
                                    size={20}
                                    onClick={() => handleRemoveDocument(index)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                              ))}
                            </div>
                          )} */}
                        </div>
                      </div>
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
}

export default EditCafeOffcanvas;

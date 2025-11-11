import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner, Alert } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCafes, fetchCafesID, updateCafe } from '../../../../store/slices/cafeSlice';
import { getLocations } from '../../../../store/slices/locationSlice';
import { toast } from "react-toastify";

function EditCafeOffcanvas({ show, handleClose, cafeId }) {

  const baseURL = import.meta.env.VITE_API_URL;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const [removedExistingDocs, setRemovedExistingDocs] = useState([]);
  const [removedDocuments, setRemovedDocuments] = useState([]);
  const [documentPreview, setDocumentPreview] = useState([]);
  const [formDataState, setFormDataState] = useState({
    cafeImage: [],
    document: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const dispatch = useDispatch();
  const IDCafeFetch = useSelector((state) => state.cafes);
  const { locations = [] } = useSelector((state) => state.locations);

  useEffect(() => {
    if (cafeId) {
      dispatch(fetchCafesID(cafeId));
    }
  }, [dispatch, cafeId]);

  useEffect(() => {
    dispatch(getLocations());
  }, [dispatch]);

  const filteredCafes = IDCafeFetch.cafes?.filter((cafe) => cafe._id === cafeId);

  useEffect(() => {
    const filteredCafes = IDCafeFetch.cafes?.filter((cafe) => cafe._id === cafeId);
    if (filteredCafes.length > 0) {
      const cafe = filteredCafes[0];

      setExistingImages(cafe.cafeImage || []);

      setFormDataState({
        name: cafe.name,
        cafe_name: cafe.cafe_name,
        email: cafe.email,
        contact_no: cafe.contact_no,
        address: cafe.address,
        website_url: cafe.website_url,
        location: cafe.location ? cafe.location._id : '',
        description: cafe.description,
        gstNo: cafe.gstNo,
        panNo: cafe.panNo,
        ownershipType: cafe.ownershipType,
        depositAmount: cafe.depositAmount,
        yearsOfContract: cafe.yearsOfContract,
        officeContactNo: cafe.officeContactNo,
        cafeImage: cafe.cafeImage || [],
        document: cafe.document || [],
      });
    }
  }, [IDCafeFetch, cafeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };
  const [imagePreview, setImagePreview] = useState([]);

  const [existingCafeImages, setExistingCafeImages] = useState([]);
  const [removedCafeImages, setRemovedCafeImages] = useState([]);

  useEffect(() => {
    if (filteredCafes?.[0]?.cafeImage) {
      setExistingCafeImages(filteredCafes[0].cafeImage);
    }
  }, [filteredCafes]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadError(''); // Clear previous errors
    
    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map(f => f.name).join(', ');
      const errorMsg = `File(s) exceed 10MB limit: ${fileNames}`;
      setUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreview((prev) => [...prev, ...previews]);
    setFormDataState((prev) => ({
      ...prev,
      cafeImage: [...(prev.cafeImage || []), ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setImagePreview((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });

    setFormDataState((prev) => {
      const updatedFiles = [...prev.cafeImage];
      updatedFiles.splice(index, 1);
      return { ...prev, cafeImage: updatedFiles };
    });
  };

  const handleRemoveExistingImage = (imgPath, index) => {
    setExistingCafeImages((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });

    setRemovedCafeImages((prev) => [...prev, imgPath]);

    setFormDataState((prev) => {
      if (!prev) return prev;
      const prevImgs = Array.isArray(prev.cafeImage) ? prev.cafeImage : [];
      const filename = imgPath.split('/').pop();
      const updatedFiles = prevImgs.filter((item) => {
        if (typeof item === 'string') {
          if (item === imgPath) return false;
          if (item.split('/').pop() === filename) return false;
        }
        return true;
      });
      return { ...prev, cafeImage: updatedFiles };
    });
  };

  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadError(''); // Clear previous errors

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map(f => f.name).join(', ');
      const errorMsg = `Document(s) exceed 10MB limit: ${fileNames}`;
      setUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setDocumentPreview((prev) => [...prev, ...files]);

    setFormDataState((prev) => ({
      ...prev,
      document: prev.document ? [...prev.document, ...files] : [...files],
    }));
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(''); // Clear previous errors

    const formDataToSend = new FormData();
    formDataToSend.append("_id", cafeId);
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
      formDataState.cafeImage.forEach((item) => {
        if (typeof item === "string") {
          if (!removedCafeImages.includes(item)) {
            formDataToSend.append("cafeImage", item);
          }
        } else if (item instanceof File) {
          formDataToSend.append("cafeImage", item);
        }
      });
    }

    if (Array.isArray(formDataState.document)) {
      formDataState.document.forEach((file) => {
        formDataToSend.append("document", file);
      });
    }

    try {
      setIsLoading(true);
      await dispatch(updateCafe({ id: cafeId, updatedData: formDataToSend })).unwrap();
      // Refresh the cafe data to get updated images
      await dispatch(fetchCafes());
      handleClose();
      // Force a page refresh to show updated images
      window.location.reload();
    } catch (error) {
      console.error('Update error:', error);
      // Handle different error types
      if (error.message && error.message.includes('File too large')) {
        setUploadError('One or more files exceed the 10MB size limit. Please choose smaller files.');
        toast.error('File size exceeds 10MB limit');
      } else if (error.message && error.message.includes('Only image')) {
        setUploadError('Only image files (JPEG, PNG, GIF, WEBP) and documents (PDF, DOC, DOCX) are allowed.');
        toast.error('Invalid file type');
      } else {
        const errorMsg = error.message || error.toString() || 'Failed to update cafe';
        setUploadError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      setFormDataState((prevState) => ({
        ...prevState,
        selectedOption: selectedOption.value,
        name: selectedOption.name || selectedOption.name,
        address: selectedOption.label || selectedOption.description,
      }));
    }
  };

  const handleManualAddressChange = (e) => {
    setFormDataState(prev => ({
      ...prev,
      address: e.target.value
    }));
  };

  const handleRemoveDocument = (index, type) => {
    if (type === "new") {
      setDocumentPreview((prev) => prev.filter((_, i) => i !== index));

      setFormDataState((prev) => ({
        ...prev,
        document: prev.document.filter((_, i) => i !== index),
      }));
    } else if (type === "existing") {
      const removedDoc = filteredCafes?.document[index];

      const updatedDocs = filteredCafes?.document.filter((doc) => doc !== removedDoc);

      setRemovedDocuments((prev) => [...prev, removedDoc]);

      setFormDataState((prev) => ({
        ...prev,
        document: updatedDocs,
      }));
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "700px" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <h2 className="text-primary fw-bold">Edit Cafe</h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {uploadError && (
          <Alert variant="danger" dismissible onClose={() => setUploadError('')}>
            <strong>Upload Error:</strong> {uploadError}
          </Alert>
        )}
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
                  value={formDataState.name || filteredCafes?.[0]?.name || ""}
                  onChange={handleChange}
                  required
                />
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
                  value={formDataState.cafe_name || filteredCafes?.[0]?.cafe_name}
                  onChange={handleChange}
                  required
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-1">
            <Form.Label htmlFor="address" className="fw-bold text-secondary">
              Address <span className="text-danger">*</span>
            </Form.Label>

            {!useManualAddress ? (
              <>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                  selectProps={{
                    value: formDataState.address
                      ? { label: formDataState.address, value: formDataState.address }
                      : null,
                    onChange: (selected) => {
                      handleSelect(selected?.value || "");
                    },
                    placeholder: "Enter address",
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: '5px',
                        fontSize: '0.9rem',
                        borderColor: '#ced4da',
                      }),
                      container: (provided) => ({
                        ...provided,
                        zIndex: 1000,
                      }),
                    },
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
                  value={formDataState.contact_no || filteredCafes?.[0]?.contact_no || ""}
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
                  type="number"
                  name="officeContactNo"
                  placeholder="Enter Office Contact Number"
                  value={formDataState.officeContactNo || filteredCafes?.[0]?.officeContactNo || ''}
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
              <Form.Group className="my-4">
                <Form.Label htmlFor="email" className="fw-bold text-secondary">
                  Email Address
                </Form.Label>
                <h4 className='text-secondary my-2 mx-3' style={{ fontSize: "14px" }}>{formDataState.email || filteredCafes?.[0]?.email || ""}</h4>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="location" className="fw-bold text-secondary">
                  Location
                  <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  id="location"
                  name="location"
                  value={
                    formDataState.location ||
                    filteredCafes?.[0]?.location?._id ||
                    ''
                  }
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
                </Form.Label>
                <Form.Control
                  id="website"
                  type="url"
                  name="website_url"
                  placeholder="Enter Website URL"
                  value={formDataState.website_url || filteredCafes?.[0]?.website_url || ''}
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
              value={formDataState.description || filteredCafes?.[0]?.description || ''}
              onChange={handleChange}
              className="py-2 border-2"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold text-secondary d-block">
                Upload Images
                <small className="text-muted d-block" style={{ fontSize: '0.8em' }}>
                  (Max 10MB per file)
                </small>
              </Form.Label>
              <div className="border-2 rounded-3 p-3 bg-light">
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  id="fileUploadLocation"
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

                  <div className="d-flex flex-wrap gap-2">
                    {imagePreview.map((img, index) => (
                      <div key={`new-${index}`} className="position-relative">
                        <img
                          src={img}
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

                  <div className="d-flex flex-wrap gap-2">
                    {existingCafeImages.map((img, index) => (
                      <div key={`existing-${index}`} className="position-relative">
                        <img
                          src={`${baseURL}/${img}`}
                          alt={`Existing ${index + 1}`}
                          className="img-thumbnail"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          onClick={() => handleRemoveExistingImage(img, index)}
                          className="position-absolute top-0 end-0 cursor-pointer"
                          style={{ transform: "translate(25%, -25%)" }}
                        >
                          <TiDeleteOutline color="red" size={25} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                  value={formDataState.gstNo || filteredCafes[0]?.gstNo || ''}
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
                  value={formDataState.panNo || filteredCafes[0]?.panNo || ''}
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
                  value={formDataState.ownershipType || filteredCafes[0]?.ownershipType || ''}
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
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="depositAmount"
                  type="number"
                  name="depositAmount"
                  placeholder="Enter Deposit Amount"
                  value={formDataState.depositAmount || filteredCafes[0]?.depositAmount || ''}
                  onChange={handleChange}
                  className="py-2 border-2"
                  required
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
                  value={formDataState.yearsOfContract || filteredCafes[0]?.yearsOfContract || ''}
                  onChange={handleChange}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold text-secondary d-block">
                Upload Documents <span className="text-danger m">(pdf, doc, docx)* Max 10MB</span>
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

            <Col sm={6}>
              {filteredCafes[0]?.document?.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {filteredCafes[0].document.map((doc, index) => (
                    <div
                      key={`existing-doc-${index}`}
                      className="p-2 border rounded bg-white d-flex justify-content-between align-items-center"
                      style={{ width: '48%' }}
                    >
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-dark text-truncate d-block"
                        style={{ maxWidth: '80%' }}
                        title={doc.split('/').pop()}
                      >
                        {doc.split('/').pop().length > 10
                          ? doc.split('/').pop().slice(0, 10) + '...'
                          : doc.split('/').pop()}
                      </a>
                      <TiDeleteOutline
                        size={22}
                        className="cursor-pointer text-danger"
                        onClick={() => handleRemoveDocument(index, "existing")}
                      />
                    </div>
                  ))}
                </div>
              )}

              {documentPreview.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {documentPreview.map((doc, index) => (
                    <div
                      key={`new-doc-${index}`}
                      className="p-2 border rounded bg-white d-flex justify-content-between align-items-center"
                      style={{ width: '48%' }}
                    >
                      <span
                        className="text-truncate d-block"
                        style={{ maxWidth: '80%' }}
                        title={doc.name}
                      >
                        {doc.name.length > 10 ? doc.name.slice(0, 10) + '...' : doc.name}
                      </span>
                      <TiDeleteOutline
                        size={22}
                        className="cursor-pointer text-danger"
                        onClick={() => handleRemoveDocument(index, "new")}
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
              onClick={handleClose}
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

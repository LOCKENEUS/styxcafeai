import { useRef, useState } from "react";
import { Button, Col, Form, Offcanvas, Row, Spinner, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addGame, updateGame } from "../../../../store/slices/gameSlice";
import { TiDeleteOutline } from "react-icons/ti";
import { FiUpload, FiInfo, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const AddGamesOffcanvas = ({ show, handleClose, cafeId, selectedGameDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [areaDimension, setAreaDimension] = useState({
    length: '',
    breadth: '',
    selectedArea: ''
  });
  const initialFormData = {
    name: "",
    type: "Single",
    price: "",
    zone: "Indoor",
    areaDimension: areaDimension,
    players: "1",
    cancellation: true,
    details: "",
    gameImage: null,
    cafe: cafeId,
    commission: 0,
    payLater: true,
    amenities: [""],
  };

  const [formData, setFormData] = useState(initialFormData);
  
  // Reset form when offcanvas closes
  const handleCloseAndReset = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setErrors({});
    setSubmitAttempted(false);
    handleClose();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Game name is required";
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    
    if (formData.type === "Multiplayer" && formData.players <= 1) {
      newErrors.players = "Multiplayer games must have more than 1 player";
    }
    
    if (!formData.areaDimension.length || !formData.areaDimension.breadth || !formData.areaDimension.selectedArea) {
      newErrors.areaDimension = "Please provide complete area dimensions";
    }
    
    if (!formData.gameImage) {
      newErrors.gameImage = "Game image is required";
    }
    
    if (!formData.details.trim()) {
      newErrors.details = "Game details are required";
    }
    
    const validAmenities = formData.amenities.filter(a => a.trim() !== "");
    if (validAmenities.length === 0) {
      newErrors.amenities = "At least one amenity is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();

    const { length, breadth, selectedArea } = formData.areaDimension;
    const sizeFormatted = `${length} * ${breadth} ${selectedArea}`;

    // Append fields directly instead of using a loop
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('zone', formData.zone);
    formDataToSend.append('size', sizeFormatted);
    formDataToSend.append('players', formData.players);
    formDataToSend.append('cancellation', formData.cancellation);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('cafe', formData.cafe);
    formDataToSend.append('commission', formData.commission);
    formDataToSend.append('payLater', formData.payLater);
    
    // Filter out empty amenities
    const validAmenities = formData.amenities.filter(a => a.trim() !== "");
    formDataToSend.append('amenities', JSON.stringify(validAmenities));

    // Append image file if exists
    if (formData.gameImage instanceof File) {
      formDataToSend.append('gameImage', formData.gameImage);
    }

    try {
      await dispatch(addGame(formDataToSend));
      toast.success("Game added successfully!");
      handleCloseAndReset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (['length', 'breadth', 'selectedArea'].includes(name)) {
      setFormData((prev) => {
        const updatedArea = {
          ...prev.areaDimension,
          [name]: value,
        };
        return {
          ...prev,
          areaDimension: updatedArea,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Validation for number of players
    if (name === 'players' && formData.type === 'Multiplayer') {
      const num = parseInt(value);
      if (num <= 1) {
        setErrors(prev => ({
          ...prev,
          players: 'Please enter more than 1 player for multiplayer games.'
        }));
      } else {
        setErrors(prev => ({ ...prev, players: '' }));
      }
    }

    // Optional: Reset players field if type is changed
    if (name === 'type' && value === 'Single') {
      setFormData(prev => ({
        ...prev,
        players: 1
      }));
      setErrors(prev => ({ ...prev, players: '' }));
    }

    // size validation l*b ft format
    if (name === 'size') {
      const regex = /^[0-9]+x[0-9]+ ft$/;
      if (!regex.test(value)) {
        setErrors(prev => ({
          ...prev,
          size: 'Please enter size in format l*b ft'
        }));
      } else {
        setErrors(prev => ({ ...prev, size: '' }));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, gameImage: file }));
        setErrors((prev) => ({ ...prev, gameImage: "" }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, gameImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, gameImage: file }));
        setErrors((prev) => ({ ...prev, gameImage: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities[index] = value;
    setFormData({ ...formData, amenities: updatedAmenities });
    setErrors((prev) => ({ ...prev, amenities: "" }));
  };

  const addAmenityField = () => {
    if (formData.amenities.length >= 10) {
      toast.warning("Maximum 10 amenities allowed");
      return;
    }
    setFormData({ ...formData, amenities: [...formData.amenities, ""] });
  };
  
  const removeAmenityField = (index) => {
    if (formData.amenities.length <= 1) {
      toast.warning("At least one amenity field is required");
      return;
    }
    const updatedAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: updatedAmenities });
  };
  
  const renderTooltip = (text) => (
    <Tooltip id="tooltip">{text}</Tooltip>
  );

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "600px" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title><h2 className="text-primary fw-bold">Add Game </h2></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ padding: "1.4rem" }}>
        <Form onSubmit={handleSubmit} className="rounded-3 bg-white">
          <Form.Group className="mb-2">
            <Form.Label htmlFor="gameName" className="fw-bold text-secondary">Name of Game
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              id="gameName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="py-2 border-2"
              placeholder="Enter game name"
            />
          </Form.Group>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label htmlFor="gameType" className="fw-bold text-secondary">Type of Game</Form.Label>
              <Form.Select
                id="gameType"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="form-select-lg border-2"
              >
                <option value='Single'>Single player</option>
                <option > Multiplayer</option>
              </Form.Select>
              {formData.type === "Multiplayer" && (
                <Form.Group className="mb-2 mt-2">
                  <Form.Label htmlFor="players" className="fw-bold text-secondary">Number of Players
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="players"
                    type="number"
                    name="players"
                    // value={formData.players}
                    onChange={handleInputChange}
                    required
                    className="py-2 border-2"
                    placeholder="Enter number of players"
                  />
                  {errors.players && (
                    <div className="invalid-feedback d-block">{errors.players}</div>
                  )}
                </Form.Group>
              )}
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gamePrice" className="fw-bold text-secondary">Price of Game
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="gamePrice"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                onWheel={(e) => e.target.blur()}
                required
                className="py-2 border-2"
                placeholder="Enter price amount"
              />
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gameSize" className="fw-bold text-secondary">Area of dimensions
                <span className="text-danger">*</span>
              </Form.Label>
              <Row className="g-1">
                <Col sm={4}>

                  <Form.Control
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    onWheel={(e) => e.target.blur()}
                    placeholder="length"
                    required
                  />
                </Col>

                <Col sm={4}>
                  <Form.Control
                    type="number"
                    name="breadth"
                    value={formData.breadth}
                    onChange={handleInputChange}
                    onWheel={(e) => e.target.blur()}
                    placeholder="breadth"
                    required
                  />
                </Col>

                <Col sm={4}>
                  <Form.Select
                    name="selectedArea"
                    value={formData.selectedArea}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Area</option>
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inches (in)</option>
                    <option value="yd">Yards (yd)</option>
                    <option value="m">Meters (m)</option>
                    <option value="cm">Centimeters (cm)</option>
                  </Form.Select>

                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label htmlFor="gameZone" className="fw-bold text-secondary">Zone of Game</Form.Label>
              <Form.Select
                id="gameZone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                required
                className="form-select-lg border-2"
              >
                <option>Indoor</option>
                <option>Outdoor</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="gameCommission" className="fw-bold text-secondary">Commission (%)</Form.Label>
                <Form.Control
                  id="gameCommission"
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                  required
                  className="py-2 border-2"
                  placeholder="Enter commission percentage"
                />
                {formData.price !== '' && formData.commission !== '' && !isNaN(formData.price) && !isNaN(formData.commission) && (
                  <div className="mt-2 text-secondary">
                    Calculated Commission: ${((Number(formData.price) * (Number(formData.commission) / 100)).toFixed(2))}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label htmlFor="gameCancellation" className="fw-bold text-secondary">Cancellation Option</Form.Label>
              <Form.Select
                id="gameCancellation"
                name="cancellation"
                value={formData.cancellation}
                onChange={handleInputChange}
                required
                className="form-select-lg border-2"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="payLater" className="fw-bold text-secondary">Pay Later Option</Form.Label>
              <Form.Select
                id="payLater"
                name="payLater"
                value={formData.payLater}
                onChange={handleInputChange}
                required
                className="form-select-lg border-2"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label htmlFor="amenities" className="fw-bold text-secondary">
              Amenities <span className="text-danger">*</span>
            </Form.Label>

            {formData.amenities.map((amenity, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={amenity}
                  onChange={(e) => handleAmenityChange(index, e.target.value)}
                  placeholder={`Amenity ${index + 1}`}
                  className="border-2 me-2"
                />
                {index === formData.amenities.length - 1 && (
                  <Button
                    variant="success"
                    onClick={addAmenityField}
                    className="px-2 py-1"
                  >
                    +
                  </Button>
                )}
              </div>
            ))}
          </Form.Group>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label className="fw-bold text-secondary d-block">Upload Image
                <span className="text-danger">*</span>
              </Form.Label>
              <div className="border-2 align-items-center rounded-3 p-3 bg-light">
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  id="fileUploadLocation"
                  // ref={fileInputRef}
                  required
                />
                <div className="d-flex justify-content-b gap-6 align-content-center">
                  <div className="d-flex justify-content-center align-items-center">
                    <label
                      style={{ width: "10rem", height: "3rem" }}
                      htmlFor="fileUploadLocation"
                      className="btn btn-outline-primary d-flex justify-content-center align-items-center py-2"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              {/* gameImage */}
              <div className="d-flex flex-wrap gap-2">
                {imagePreview && (
                  <div className="position-relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      onClick={handleRemoveImage}
                      className="position-absolute top-0 end-0 cursor-pointer"
                      style={{ transform: "translate(25%, -25%)" }}
                    >
                      <TiDeleteOutline color="red" size={25} />
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label htmlFor="gameDetails" className="fw-bold text-secondary">Game Details
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              id="gameDetails"
              as="textarea"
              rows={4}
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              required
              className="border-2"
              placeholder="Describe the game details..."
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Game"
              )}
            </Button>
            <Button variant="outline-secondary" onClick={handleClose} className="px-4 py-2 fw-bold">
              Cancel
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddGamesOffcanvas;

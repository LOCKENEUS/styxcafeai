import { useRef, useState } from "react";
import { Button, Col, Form, Offcanvas, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addGame, updateGame } from "../../../../store/slices/gameSlice";
import { TiDeleteOutline } from "react-icons/ti";

const AddGamesOffcanvas = ({ show, handleClose,cafeId,selectedGameDetails  }) => {



  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

      console.log("Cafe ID offcanvas:", cafeId);
      const dispatch = useDispatch();
      // const cafes = useSelector(selectCafes);
      const [imagePreview, setImagePreview] = useState(null);
      const fileInputRef = useRef(null);
      const [width, setWidth] = useState(window.innerWidth < 768 ? "90%" : "50%");
      const initialFormData = {
        name: "",
        type: "Single",
        price: "",
        zone: "Indoor",
        size: "",
        players: "1",
        cancellation: true,
        details: "",
        gameImage: null,
        cafe: cafeId,
        commission: 0,
        payLater: false,
      };

      const [formData, setFormData] = useState(initialFormData);

    


    const handleSubmit = async (e) => {
      
  
      console.log("submit form ", cafeId);
      e.preventDefault();
      setIsLoading(true);
  
      const formDataToSend = new FormData();
  
      // Append fields directly instead of using a loop
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('zone', formData.zone);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('players', formData.players);
      formDataToSend.append('cancellation', formData.cancellation === "Yes" ? true : false);
      formDataToSend.append('details', formData.details);
      formDataToSend.append('cafe', formData.cafe);
      formDataToSend.append('commission', formData.commission);
      formDataToSend.append('payLater', formData.payLater === "Yes" ? true : false);
  
      // Append image file if exists
      if (formData.gameImage instanceof File) {
        formDataToSend.append('gameImage', formData.gameImage);
        // console.log(`Appending image: ${formData.gameImage.name}`);
      }
      // Log the entire FormData object for debugging
      // for (let pair of formDataToSend.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }
      console.log(formData)
  
      try {
          await dispatch(addGame(formDataToSend));
          handleClose();
       
      } catch (error) {
        console.error("Error submitting form:", error);
        handleClose();
      } finally {
        setIsLoading(false);
      }
  
      // Reset form data and image preview after submission
      setFormData(initialFormData);
      setImagePreview(null);
     
    }; 

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

         // Validation for number of players
  if (name === 'players' && formData.type === 'Multiplayer') {
    const num = parseInt(value);
    if (num <= 1 ) {
      setErrors(prev => ({
        ...prev,
        players: 'Please enter more than 1 player for multiplayer games.'
      }));
    } else {
      setErrors(prev => ({ ...prev, players: '' }));
    }
  }

  // Optional: Reset players field if type is changed
  if (name === 'type' && value === 'Single player') {
    setFormData(prev => ({
      ...prev,
      players: ''
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
    }}

    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setFormData((prev) => ({ ...prev, gameImage: file }));
        };
        reader.readAsDataURL(file);
      }
    };
    const handleRemoveImage = (e) => {
      const updatedImagePreviews = imagePreview.filter((_, i) => i !== e);
      setImagePreview(updatedImagePreviews);
  
      setFormData((prev) => ({
        ...prev,
        cafeImage: prev.imagePreview.filter((_, i) => i !== e),
      }));
    };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end"  style={{ width: "600px" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title><h2 className="text-primary fw-bold">Add Game</h2></Offcanvas.Title>
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
                <option>Single player</option>
                <option>Multiplayer</option>
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
                required
                className="py-2 border-2"
                placeholder="Enter price amount"
              />
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gameSize" className="fw-bold text-secondary">Area of dimensions
              <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="gameSize"
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="py-2 border-2"
                placeholder="Enter game size (e.g., 10x10 ft)"
              />
               {errors.size && (
                <div className="invalid-feedback d-block">{errors.size}</div>
              )}
             
              
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
                  required
                  className="py-2 border-2"
                  placeholder="Enter commission percentage"
                />
                {/* Display calculated commission */}
                {formData.price && formData.commission && (
                  <div className="mt-2 text-secondary">
                    Calculated Commission: ${(formData.price * (formData.commission / 100)).toFixed(2)}
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
                <option>Yes</option>
                <option>No</option>
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
                <option>Yes</option>
                <option>No</option>
              </Form.Select>
            </Col>
          </Row>

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
                  {/* {imagePreview && (
                    <div className="d-flex position-relative align-items-center gap-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ width: "300px" }}
                      />
                      <div
                        onClick={handleRemoveImage}
                        className="py-1"
                        style={{
                          position: "absolute",
                          top: "-15px",
                          right: "-10px",
                        }}
                      >
                        <TiDeleteOutline color="red" size={35} />
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </Col>
            <Col md={6}>
            {/* gameImage */}
            <div className="d-flex flex-wrap gap-2">
             {imagePreview && (
                    <div className="position-relative">
                      <img
                        src={imagePreview }
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

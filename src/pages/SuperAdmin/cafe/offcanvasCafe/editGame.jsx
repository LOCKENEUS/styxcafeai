
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Offcanvas, Row, Spinner } from "react-bootstrap";
import { getGameById, updateGame } from "../../../../store/slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { TiDeleteOutline } from "react-icons/ti";
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png';

const EditGameOffcanvas = ({ show, handleClose, gameId }) => {



  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const baseURL = import.meta.env.VITE_API_URL;
  console.log("Offcanvas edit game id", gameId);
  const [formData, setFormData] = useState({
    name: "",
    type: "Single player",
    price: "",
    zone: "Indoor",
    size: "",
    players: "",
    commission: "",
    cancellation: "Yes",
    payLater: "Yes",
    details: "",
    image: ""

  })
  const [saveLoading, setSaveLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedGame } = useSelector((state) => state.games);
  useEffect(() => {
    dispatch(getGameById(gameId));
  }, [gameId, dispatch]);

  console.log("selected game 11", selectedGame);



  useEffect(() => {
    if (selectedGame) {
      setFormData({
        name: selectedGame?.data?.name,
        type: selectedGame?.data?.type,
        price: selectedGame?.data?.price,
        zone: selectedGame?.data?.zone,
        size: selectedGame?.data?.size,
        players: selectedGame?.data?.players,
        commission: selectedGame?.data?.commission,
        cancellation: selectedGame?.data?.cancellation ? "Yes" : "No",
        payLater: selectedGame?.data?.payLater ? "Yes" : "No",
        details: selectedGame?.data?.details,
        image: selectedGame?.data?.image
      });
    }
  }, [selectedGame]);



  const formRef = useRef(null);
  useEffect(() => {
    gsap.from(formRef.current, {

      y: 50,
      duration: 3,

    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));



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
    if (name === 'type' && value === 'Single player') {
      setFormData(prev => ({
        ...prev,
        players: ''
      }));
      setErrors(prev => ({ ...prev, players: '' }));
    }


  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData((prev) => ({
  //       ...prev,
  //       image: file,
  //     }));
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // For image preview
      setFormData((prev) => ({ ...prev, image: file })); // For backend submission
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    console.log("Updating Game:", formData);

    if (formData.type === "Single player") {
      // return 1 to the 'players' field if it's a single player game pass 1
      formData.players = '1';

    }

    const formDataToSend = new FormData();
    formDataToSend.append('_id', gameId);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('zone', formData.zone);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('players', formData.players);
    formDataToSend.append('commission', formData.commission);
    // formDataToSend.append('cancellation', formData.cancellation);
    formDataToSend.append('payLater', formData.payLater === "Yes" || formData.payLater === true);
    formDataToSend.append('cancellation', formData.cancellation === "Yes" || formData.cancellation === true);
    // formDataToSend.append('payLater', formData.payLater);
    formDataToSend.append('details', formData.details);

    if (formData.image && typeof formData.image !== 'string') {
      formDataToSend.append("image", formData.image);
    }


    try {
      await dispatch(updateGame({ id: gameId, updatedData: formDataToSend }));
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update game. Please try again.");
      handleClose();
      // getGames(gameId);
    }
    finally {
      setSaveLoading(false);
    }

    // setFormData({
    //   name: "",
    //   type: "Single player",
    //   price: "",
    //   zone: "Indoor",
    //   size: "",
    //   players: "",
    //   commission: "",
    //   cancellation: "Yes",
    //   payLater: "Yes",
    //   details: "",
    //   image: ""
    // });
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "700px" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title><h2 className="text-primary fw-bold">Edit Game</h2> </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>

        <Form onSubmit={handleSubmit} ref={formRef} className="rounded-3 bg-white">
          <Form.Group className="mb-2">
            <Form.Label htmlFor="gameName" className="fw-bold text-secondary">Name of Game
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              id="gameName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
                onChange={handleChange}
                required
                className="form-select-lg border-2"
              >
                <option value="Single player">Single player</option>
                <option value="Multiplayer">Multiplayer</option>
              </Form.Select>

              {formData.type === "Multiplayer" && (
                <Form.Group className="mb-2 mt-2">
                  <Form.Label htmlFor="players" className="fw-bold text-secondary">
                    Number of Players <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="players"
                    type="number"
                    name="players"
                    value={formData.players}
                    onChange={handleChange}
                    required
                    className={`py-2 border-2 ${errors.players ? 'is-invalid' : ''}`}
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
                onChange={handleChange}
                required
                className="py-2 border-2"
                placeholder="Enter price amount"
              />
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="gameSize" className="fw-bold text-secondary">Size of Game
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="gameSize"
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="py-2 border-2"
                placeholder="Enter game size (e.g., 10x10 ft)"
              />
            </Col>
          </Row>

          <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label htmlFor="gameZone" className="fw-bold text-secondary">Zone of Game</Form.Label>
              <Form.Select
                id="gameZone"
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                required
                className="form-select-lg border-2"
              >
                <option>Indoor</option>
                <option>Outdoor</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="gameCommission" className="fw-bold text-secondary">Commission (%)
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="gameCommission"
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  required
                  className="py-2 border-2"
                  placeholder="Enter commission percentage"
                />


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
                onChange={handleChange}
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
                onChange={handleChange}
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
              <Form.Label className="fw-bold text-secondary d-block">
                Upload Image <span className="text-danger">*</span>
              </Form.Label>
              <div className="border-2 align-items-center rounded-3 p-3 bg-light">
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="image"
                  className="d-none"
                  id="fileUploadLocation"
                  onChange={handleFileChange}

                />


                <div className="d-flex justify-content-center align-items-center">
                  <label
                    htmlFor="fileUploadLocation"
                    style={{ width: '10rem', height: '3rem' }}
                    className="btn btn-outline-primary d-flex justify-content-center align-items-center py-2"
                  >
                    Choose File
                  </label>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="mt-3 d-flex flex-wrap gap-3">
                {(previewImage || selectedGame?.data?.gameImage) && (
                  <div className="position-relative">
                    <img
                      src={previewImage || `${baseURL}/${selectedGame.data.gameImage}`}
                      alt="Selected"
                      className="img-thumbnail"
                      style={{ maxHeight: '100px', maxWidth: '100px' }}

                    />
                    <TiDeleteOutline
                      className="text-danger position-absolute top-0 end-0 bg-white rounded-circle"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: '',
                        }))
                      }
                      style={{ cursor: 'pointer' }}
                    />
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
              onChange={handleChange}
              required
              className="border-2"
              placeholder="Describe the game details..."
            />
          </Form.Group>



          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="success" type="submit" >
              {
                saveLoading ?(
                  <>
                  <Spinner
                    animation="border"
                    role="status"
                    size="sm"
                    className="me-2"
                  />
                  Saving...
                </>
            
              ) : (
              "Save Game"
              )
              }
            </Button>
            <Button variant="outline-secondary" onClick={handleClose} className="px-4 py-2 fw-bold">
              Cancel
            </Button>
          </div>
        </Form>

      </Offcanvas.Body>
    </Offcanvas>

  )
};
export default EditGameOffcanvas;
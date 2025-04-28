import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Offcanvas, Form, Row, Col, Spinner } from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { addLocation, updateLocation } from "../../../store/slices/locationSlice";

const LocationForm = ({
  showCanvas,
  handleCloseCanvas,
  width,
  isEditing,
  handleGetCurrentLocation,
  setShowCanvas,
  locationData,
}) => {

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
    state: "",
    lat: "",
    long: "",
    image: null,
    details: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (locationData) {
      setFormData({
        address: locationData.address || "",
        city: locationData.city || "",
        country: locationData.country || "",
        state: locationData.state || "",
        lat: locationData.lat || "",
        long: locationData?.long || locationData.lng || "",
        image: locationData.image || null,
        details: locationData.details || "",
      });

      if (isEditing && locationData.image) {
        setImagePreview(
          `${import.meta.env.VITE_API_URL}/${locationData.image}`
        );
      } else if (!isEditing) {
        setImagePreview(null);
      }
    }
  }, [locationData, isEditing]);

  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((res) => setCountries(res.data.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  useEffect(() => {
    if (formData.country) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/states", {
          country: formData.country,
        })
        .then((res) => setStates(res.data.data.states))
        .catch((err) => console.error("Error fetching states:", err));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
          country: formData.country,
          state: formData.state,
        })
        .then((res) => setCities(res.data.data))
        .catch((err) => console.error("Error fetching cities:", err));
    }
  }, [formData.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        const location = res.data.results[0].geometry.location;

        let address = "";
        let city = "";
        let state = "";
        let country = "";

        addressComponents.forEach((component) => {
          if (
            component.types.includes("street_address") ||
            component.types.includes("route")
          ) {
            address = component.long_name;
          }
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

        setFormData((prev) => ({
          ...prev,
          address: address || res.data.results[0].formatted_address,
          city,
          state,
          country,
          lat: location.lat,
          long: location.lng,
        }));
      })
      .catch((err) => console.error("Error fetching place details:", err));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Store the base64 string directly
        setFormData((prev) => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
    // Remove image from formData
    setFormData((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("address", formData.address);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("lat", formData.lat);
    formDataToSend.append("long", formData.long);
    formDataToSend.append("locationImage", formData.image);
    formDataToSend.append("details", formData.details);

    if (isEditing) {
      const result = await dispatch(
        updateLocation({ id: locationData?.editId, updatedData: formDataToSend })
      );
      if (updateLocation.fulfilled) {
        // navigate("/superadmin/dashboard");
        handleCloseCanvas();
      } else {
        console.error("Failed to update location:", result.payload);
      }
    } else {
      const result = await dispatch(addLocation(formDataToSend));

      if (addLocation.fulfilled) {
        // navigate("/superadmin/dashboard");
        handleCloseCanvas();
      } else {
        console.error("Failed to save location:", result.payload);
      }
    }

    setIsLoading(false);
  };

  return (
    <Offcanvas
      show={showCanvas}
      onHide={handleCloseCanvas}
      style={{ width }}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {" "}
          <h2 className="text-primary fw-bold">
            {isEditing ? "Update Location" : "Create Location"}
          </h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit} className="rounded-3 bg-white">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="address" className="fw-bold text-secondary">
              Address
              <span className="text-danger ms-1">*</span>
            </Form.Label>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
              selectProps={{
                value: formData.address
                  ? { label: formData.address, value: formData.address }
                  : null, 
                onChange: handleSelect,
                placeholder: "Search address...",
                required: true,
              }}
              
              
            />
          </Form.Group>

          <Row className="mb-2 g-4">
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary">
                  Country
                  <span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country: e.target.value,
                      state: "",
                      city: "",
                    })
                  }
                  required
                >
                  <option>Select Country</option>
                  {countries.map((c, idx) => (
                    <option key={idx} value={c.country}>
                      {c.country}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary">
                  State
                  <span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                      city: "",
                    })
                  }
                  required
                  disabled={!formData.country}
                >
                  <option>Select State</option>
                  {states.map((s, idx) => (
                    <option key={idx} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2 g-4">
         


            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary">City
                <span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  disabled={!formData.state}
                  required
                >
                  <option>Select City</option>
                  {cities.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold text-secondary">
                Coordinates
                <span className="text-danger ms-1">*</span>
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  id="latitude"
                  type="number"
                  step="any"
                  name="lat"
                  placeholder="Latitude"
                  value={formData.lat}
                  onChange={handleInputChange}
                  required
                  className="py-2 border-2"
                  aria-label="Latitude"
                />
                <Form.Control
                  id="longitude"
                  type="number"
                  step="any"
                  name="long"
                  placeholder="Longitude"
                  value={formData.long}
                  onChange={handleInputChange}
                  required
                  className="py-2 border-2"
                  aria-label="Longitude"
                />
                {/* <Button
                  variant="outline-primary"
                  onClick={handleGetCurrentLocation}
                  title="Get Current Location"
                >
                  📍
                </Button> */}
              </div>
            </Col>
          </Row>

          {/* <Row className="mb-2 g-4">
            <Col md={6}>
              <Form.Label className="fw-bold text-secondary d-block">
                Upload Image
              </Form.Label>
              <div className="border-2 align-items-center  rounded-3 p-3 bg-light">
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  id="fileUploadLocation"
                  ref={fileInputRef} // Add ref for file input
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
                  {imagePreview && (
                    <div className="d-flex position-relative align-items-center gap-2">
                      <img
                        src={imagePreview}
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
                  )}
                </div>
              </div>
            </Col>
          </Row> */}

          {/* <Form.Group className="mb-2">
            <Form.Label htmlFor="details" className="fw-bold text-secondary">
              Location Details
            </Form.Label>
            <Form.Control
              id="details"
              as="textarea"
              rows={4}
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              required
              className="border-2"
              placeholder="Describe the location details..."
            />
          </Form.Group> */}

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Location"
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

export default LocationForm;

import React, { useEffect, useRef, useState } from "react";
import { Button,  Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocation,
  updateLocation,
  deleteLocation,
  getLocations,
} from "../../../store/slices/locationSlice";
import ViewDetails from "./ViewDetails";
import LocationForm from "./LocationForm";

const CreateLocation = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations.locations);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [width, setWidth] = useState(window.innerWidth < 768 ? "80%" : "50%");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);


  const initialFormData = {
    address: "",
    city: "",
    country: "",
    state: "",
    lat: "",
    long: "",
    image: null,
    details: "",
    editId: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    dispatch(getLocations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLocation) {
      setFormData({
        address: selectedLocation.data.address || "",
        city: selectedLocation.data.city || "",
        country: selectedLocation.data.country || "",
        state: selectedLocation.data.state || "",
        lat: selectedLocation.data.lat || "",
        long: selectedLocation.data.long || "",
        image: selectedLocation.data.locationImage || null,
        details: selectedLocation.data.details || "",
        editId: selectedLocation.data._id,
      });
      setIsEditing(true);
      setEditIndex(selectedLocation.id);
    }
  }, [selectedLocation]); // ✅ No `formData` dependency!

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
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

  // Add this useEffect to handle edit mode
  useEffect(() => {
    if (editIndex !== null) {
      setImagePreview(formData.image);
    }
  }, [editIndex, formData.image]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          }));

          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results[0]) {
                const address = data.results[0].formatted_address;
                const components = data.results[0].address_components;

                setFormData((prev) => ({
                  ...prev,
                  address: address,
                  city:
                    components.find((c) => c.types.includes("locality"))
                      ?.long_name || "",
                  state:
                    components.find((c) =>
                      c.types.includes("administrative_area_level_1")
                    )?.short_name || "",
                  country:
                    components.find((c) => c.types.includes("country"))
                      ?.long_name || "",
                }));
              }
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("address", formData.address);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("lat", formData.lat);
    formDataToSend.append("long", formData.long);
    formDataToSend.append("details", formData.details);

    if (formData.image && formData.image instanceof File) {
      formDataToSend.append("locationImage", formData.image);
    }

    if (isEditing) {
      await dispatch(
        updateLocation({ index: selectedLocation.id, data: formDataToSend })
      );
    } else {
      await dispatch(addLocation(formDataToSend));
    }

    setFormData(initialFormData);
    setImagePreview(null);
    handleCloseCanvas();
  };

  const handleDelete = () => {
    dispatch(deleteLocation(selectedLocation.index));
    setSelectedLocation(null);
  };

  const handleEdit = () => {
    if (selectedLocation) {
      setSelectedLocation(null); // Reset selected location to prevent double setting
      setShowCanvas(true);
    }
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setFormData(initialFormData);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleCreateClick = () => {
    setFormData(initialFormData); // Ensure fresh form
    setIsEditing(false);
    setShowCanvas(true);
  };

  // MObile Size
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? "80%" : "50%");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="ms-3">
          <h1>Location Details</h1>
        </div>
        {!selectedLocation && (
          <Button variant="primary" onClick={handleCreateClick}>
            Create Location
          </Button>
        )}
      </div>

      {!selectedLocation ? (
        <Table striped bordered hover responsive>
          {/* Keep existing table structure the same */}
          <thead>
            <tr>
              <th>#</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedLocation({ data: location, index })}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{location.address}</td>
                  <td>{location.city}</td>
                  <td>{location.state}</td>
                  <td>{location.country}</td>
                  <td>
                    {location.lat}, {location.lng}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center fw-bold py-3">
                  No Location Added Yet
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        <ViewDetails
          location={selectedLocation.data}
          index={selectedLocation.index}
          onClose={() => setSelectedLocation(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      <LocationForm
        showCanvas={showCanvas}
        handleCloseCanvas={handleCloseCanvas}
        width={width}
        isEditing={isEditing}
        locationData={formData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        imagePreview={imagePreview}
        handleRemoveImage={handleRemoveImage}
        handleSubmit={handleSubmit}
        setShowCanvas={setShowCanvas}
        handleGetCurrentLocation={handleGetCurrentLocation}
        editIndex={editIndex}
      />
    </div>
  );
};

export default CreateLocation;

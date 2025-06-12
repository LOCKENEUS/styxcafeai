import React, { useEffect, useState, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, getCustomers, updateCustomer } from "../../../../store/AdminSlice/CustomerSlice";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const CreateClientModal = ({ show, handleClose }) => {
  let searchTimeout;
  const [clientListVisible, setClientListVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [selectedClient, setSelectedClient] = useState("");

  const dispatch = useDispatch();

  const recentClients = useSelector(
    (state) => state.customers.customers
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const cafeId = user?._id;

  useEffect(() => {
    if (cafeId) {
      dispatch(getCustomers(cafeId));
    }
  }, [dispatch]);

  const handleToggle = () => {
    setClientListVisible(!clientListVisible);
  };

  const searchClient = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      //   if (value.trim() !== "") {
      //     try {
      //       const response = await fetch(
      //         `${backend_url}/client/search?searchText=${value}`,
      //         {
      //           method: "GET",
      //           headers: {
      //             "Content-Type": "application/json",
      //             "x-api-key": "46gyioi6n5h87kygf2w68r4p",
      //             authorization: `Bearer ${token}`,
      //           },
      //         }
      //       );
      //       const data = await response.json();
      //       if (data && Array.isArray(data.data)) {
      //         setRecentClients(data.data);
      //       } else {
      //         setRecentClients([]);
      //         console.warn("No valid client data returned from server.");
      //       }
      //     } catch (error) {
      //       console.error("Error searching for clients:", error);
      //     }
      //   } else {
      //     const response = await fetch(`${backend_url}/client/recentclients`, {
      //       method: "GET",
      //       headers: {
      //         "Content-Type": "application/json",
      //         "x-api-key": "46gyioi6n5h87kygf2w68r4p",
      //         authorization: `Bearer ${token}`,
      //       },
      //     });
      //     const data = await response.json();
      //     setRecentClients(data.data || []);
      //   }
    }, 500);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    handleClose();
  };

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
  });

  // Add new state for preview
  const [imagePreview, setImagePreview] = useState(null);

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
          const user = JSON.parse(localStorage.getItem('user'));
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/customer/${id}?cafe=${user.cafe}`);
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
    setIsSubmitting(true);

    // const user = JSON.parse(localStorage.getItem('user'));
    const submittedData = new FormData();
    submittedData.append("cafe", user._id);
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

  return (
    <>
      <div
        className={`modal fade ${show ? "show" : ""}`}
        style={{ display: show ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-light text-primary d-flex justify-content-between align-items-center">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <b>Create New Customer</b>
                <button
                  className="btn bg-white"
                  id="addtogglebtn"
                  style={{ padding: "0.2rem 0.75rem" }}
                  onClick={handleToggle}
                >
                  {/* <i className={`icofont ${clientListVisible ? "icofont-reply" : "icofont-plus"}`}></i> */}
                  <CiCirclePlus />
                </button>
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-3">
              {clientListVisible ? (
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Enter Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="rounded-2"
                          style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
                          Contact Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="contactNumber"
                          placeholder="Enter Contact Number"
                          value={formData.contactNumber}
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
                          Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          className="rounded-2"
                          style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                        />
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
                          Gender
                        </Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="rounded-2"
                          style={{ padding: '10px', fontSize: '0.9rem', borderColor: '#ced4da' }}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
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
                      // onClick={handleCancel}
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
              ) : (
                <div id="client-list">
                  <div className="card shadow-sm">
                    <div className="card-header p-2 bg-light border-bottom">
                      <h6>Choose a customer</h6>
                      <input
                        type="text"
                        className="form-control border-secondary"
                        placeholder="Search for clients"
                        value={searchTerm}
                        onChange={searchClient}
                      />
                    </div>
                    <div className="card-body p-2">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="bg-light text-primary">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Contact</th>
                              <th>City</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentClients?.map((client, index) => (
                              <tr
                                key={index}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleClientSelect(client)}
                              >
                                <td>{client.name}</td>
                                <td>{client.email}</td>
                                <td>{client.contact_no}</td>
                                <td>{client.city}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {show && (
        <div
          className="modal-backdrop fade show"
          onClick={handleClose}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        ></div>
      )}
    </>
  );
};

export default CreateClientModal;

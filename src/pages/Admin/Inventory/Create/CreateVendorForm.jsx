import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormGroup, FormSelect, Image, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addVendor, getVendorById, updateVendor } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";
import { FaCopy } from "react-icons/fa";

export const CreateVendorForm = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, selectedVendor } = useSelector(state => state.vendors);
    const [formData, setFormData] = useState({
        vendorName: '',
        companyName: '',
        vendorEmail: '',
        vendorPhone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zipcode: '',
        shippingAddress: '',
        shippingcountry: '',
        shippingstate: '',
        shippingcity: '',
        shippingzipcode: '',
        governmentid: '',
        image: null,
        accounttype: '',
        bank_name: '',
        accountnumber: '',
        ifsccode: '',
        billingCoordinates: { latitude: '', longitude: '' },
        shippingCoordinates: { latitude: '', longitude: '' },
    })
    const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Add validation state
    const [errors, setErrors] = useState({
        vendorName: '',
        vendorEmail: '',
        vendorPhone: '',
        companyName: '',
        bank_name: '',
        accountnumber: '',
        ifsccode: '',
        accounttype: ''
    });

    useEffect(() => {
        if (id) {
            dispatch(getVendorById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedVendor) {
            setFormData({
                vendorName: selectedVendor.name,
                companyName: selectedVendor.company,
                vendorEmail: selectedVendor.email,
                vendorPhone: selectedVendor.phone,
                address: selectedVendor.billingAddress,
                country: selectedVendor.country1,
                state: selectedVendor.state1,
                city: selectedVendor.city1,
                zipcode: selectedVendor.pincode1,
                shippingAddress: selectedVendor.shippingAddress,
                shippingcountry: selectedVendor.country2,
                shippingstate: selectedVendor.state2,
                shippingcity: selectedVendor.city2,
                shippingzipcode: selectedVendor.pincode2,
                governmentid: selectedVendor.govtId,
                image: null,
                accounttype: selectedVendor.accountType,
                bank_name: selectedVendor.bank_name,
                accountnumber: selectedVendor.accountNo,
                ifsccode: selectedVendor.ifsc,
                billingCoordinates: {
                    latitude: selectedVendor.latitude1,
                    longitude: selectedVendor.longitude1
                },
                shippingCoordinates: {
                    latitude: selectedVendor.latitude2,
                    longitude: selectedVendor.longitude2
                },
            });
            if(selectedVendor.image){
                setImagePreview(`${import.meta.env.VITE_API_URL}/${selectedVendor.image}`);
            }
        }
        
    }, [selectedVendor]);

    useEffect(() => {
        if (!id) {
            // Reset form data when creating a new vendor
            setFormData({
                vendorName: '',
                companyName: '',
                vendorEmail: '',
                vendorPhone: '',
                address: '',
                country: '',
                state: '',
                city: '',
                zipcode: '',
                shippingAddress: '',
                shippingcountry: '',
                shippingstate: '',
                shippingcity: '',
                shippingzipcode: '',
                governmentid: '',
                image: null,
                accounttype: '',
                bank_name: '',
                accountnumber: '',
                ifsccode: '',
                billingCoordinates: { latitude: '', longitude: '' },
                shippingCoordinates: { latitude: '', longitude: '' },
            });
            setImagePreview(`${import.meta.env.VITE_API_URL}/${imagePreview}`);
        }
    }, [id]);

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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value, 
        }));
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData((prev) => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(`${import.meta.env.VITE_API_URL}/${imagePreview}`);
            setFormData((prev) => ({ ...prev, image: null }));
        }
    };

    const copyBillingToShipping = () => {
        setFormData(prev => ({
            ...prev,
            shippingAddress: prev.address,
            shippingcountry: prev.country,
            shippingstate: prev.state,
            shippingcity: prev.city,
            shippingzipcode: prev.zipcode
        }));
    };

    const handleBillingAddressSelect = (place) => {
        const placeId = place.value.place_id;
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        
        axios
            .get(
                `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
            )
            .then((res) => {
                if (!res.data.results || res.data.results.length === 0) {
                    throw new Error('No address details found for this location');
                }
                
                const result = res.data.results[0];
                const addressComponents = result.address_components;
                const location = result.geometry.location;
                
                let city = "";
                let state = "";
                let country = "";
                let zipCode = "";
                
                addressComponents.forEach((component) => {
                    const types = component.types;
                    
                    if (types.includes("locality")) {
                        city = component.long_name;
                    } else if (types.includes("administrative_area_level_1")) {
                        state = component.long_name;
                    } else if (types.includes("country")) {
                        country = component.long_name;
                    } else if (types.includes("postal_code")) {
                        zipCode = component.long_name;
                    }
                });
                
                const formattedAddress = result.formatted_address || place.label;
                
                setFormData(prev => ({
                    ...prev,
                    address: formattedAddress,
                    city: city || prev.city,
                    state: state || prev.state,
                    country: country || prev.country,
                    zipcode: zipCode || prev.zipcode,
                    billingCoordinates: { latitude: location.lat, longitude: location.lng }
                }));
            })
            .catch((err) => {
                console.error("Error fetching place details:", err);
            });
    };

    const handleShippingAddressSelect = (place) => {
        const placeId = place.value.place_id;
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        
        axios
            .get(
                `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
            )
            .then((res) => {
                if (!res.data.results || res.data.results.length === 0) {
                    throw new Error('No address details found for this location');
                }
                
                const result = res.data.results[0];
                const addressComponents = result.address_components;
                const location = result.geometry.location;
                
                let city = "";
                let state = "";
                let country = "";
                let zipCode = "";
                
                addressComponents.forEach((component) => {
                    const types = component.types;
                    
                    if (types.includes("locality")) {
                        city = component.long_name;
                    } else if (types.includes("administrative_area_level_1")) {
                        state = component.long_name;
                    } else if (types.includes("country")) {
                        country = component.long_name;
                    } else if (types.includes("postal_code")) {
                        zipCode = component.long_name;
                    }
                });
                
                const formattedAddress = result.formatted_address || place.label;
                
                setFormData(prev => ({
                    ...prev,
                    shippingAddress: formattedAddress,
                    shippingcity: city || prev.shippingcity,
                    shippingstate: state || prev.shippingstate,
                    shippingcountry: country || prev.shippingcountry,
                    shippingzipcode: zipCode || prev.shippingzipcode,
                    shippingCoordinates: { latitude: location.lat, longitude: location.lng }
                }));
            })
            .catch((err) => {
                console.error("Error fetching place details:", err);
            });
    };

    // Add validation function
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            vendorName: '',
            vendorEmail: '',
            vendorPhone: '',
            companyName: '',
            bank_name: '',
            accountnumber: '',
            ifsccode: '',
            accounttype: ''
        };

        // Vendor Name validation
        if (!formData.vendorName.trim()) {
            newErrors.vendorName = 'Vendor name is required';
            isValid = false;
        } else if (formData.vendorName.length < 3) {
            newErrors.vendorName = 'Vendor name must be at least 3 characters';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.vendorEmail.trim()) {
            newErrors.vendorEmail = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.vendorEmail)) {
            newErrors.vendorEmail = 'Please enter a valid email address';
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!formData.vendorPhone.trim()) {
            newErrors.vendorPhone = 'Phone number is required';
            isValid = false;
        } else if (!phoneRegex.test(formData.vendorPhone)) {
            newErrors.vendorPhone = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        // Company Name validation
        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
            isValid = false;
        }

        // Bank details validation - removed required validation since it's optional

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Create FormData object for file upload
        const formDataToSend = new FormData();
        
        // Add all the text fields
        formDataToSend.append('name', formData.vendorName);
        formDataToSend.append('email', formData.vendorEmail);
        formDataToSend.append('company', formData.companyName);
        formDataToSend.append('phone', formData.vendorPhone);
        formDataToSend.append('billingAddress', formData.address);
        formDataToSend.append('shippingAddress', formData.shippingAddress);
        formDataToSend.append('country1', formData.country);
        formDataToSend.append('country2', formData.shippingcountry);
        formDataToSend.append('state1', formData.state);
        formDataToSend.append('state2', formData.shippingstate);
        formDataToSend.append('city1', formData.city);
        formDataToSend.append('city2', formData.shippingcity);
        formDataToSend.append('pincode1', formData.zipcode || 0);
        formDataToSend.append('pincode2', formData.shippingzipcode || 0);
        formDataToSend.append('govtId', formData.governmentid);
        formDataToSend.append('accountNo', formData.accountnumber || 0);
        formDataToSend.append('bank_name', formData.bank_name || "Not Applicable");
        formDataToSend.append('ifsc', formData.ifsccode);
        formDataToSend.append('accountType', formData.accounttype);
        formDataToSend.append('cafe', cafeId);
        
        
        // Add the image file if it exists
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        
        // Add latitude and longitude only if they exist
        if (formData.billingCoordinates.latitude) {
            formDataToSend.append('latitude1', formData.billingCoordinates.latitude);
        }
        if (formData.billingCoordinates.longitude) {
            formDataToSend.append('longitude1', formData.billingCoordinates.longitude);
        }
        if (formData.shippingCoordinates.latitude) {
            formDataToSend.append('latitude2', formData.shippingCoordinates.latitude);
        }
        if (formData.shippingCoordinates.longitude) {
            formDataToSend.append('longitude2', formData.shippingCoordinates.longitude);
        }
        
        if (id) {
            dispatch(updateVendor({ id, vendorData: formDataToSend }))
                .unwrap()
                .then(() => {
                    // Navigate to vendor list on success
                    navigate(-1);
                })
                .catch((error) => {
                    console.error('Failed to update vendor:', error);
                });
        } else {
            dispatch(addVendor(formDataToSend))
                .unwrap()
                .then(() => {
                    // Navigate to vendor list on success
                    navigate(-1);
                })
                .catch((error) => {
                    console.error('Failed to create vendor:', error);
                });
        }
    }
    return (
        <Container data-aos="fade-up" data-aos-duration="700"> 
            <Row 
            style={{ marginTop: "50px", 
                // backgroundColor:"#F2F2F2",height:"100vh" 
                
                }}
            >


<Col sm={12} className="d-flex "  >
          {/* style={{top:"110px" , left:"700px"}} */}

          <div style={{ top: "186px" }}>
            <Breadcrumb  >
              <BreadcrumbItem ><Link to="/admin/dashboard">Home</Link></BreadcrumbItem>
              <BreadcrumbItem ><Link to="/admin/inventory/dashboard">Inventory</Link></BreadcrumbItem>
              <BreadcrumbItem ><Link to="/admin/inventory/vendor-list">Vendor List</Link></BreadcrumbItem>
              <BreadcrumbItem active>Vendor Create</BreadcrumbItem>
            </Breadcrumb>
          </div>

        </Col>



                <Form onSubmit={handleSubmit}>
                

                    {/* <Row> */}
                        <Card className="shadow p-4 my-4">
                        <Row>
                        <div className="d-flex justify-content-start align-items-start">
                        <h1>Vendor Create</h1>
                    </div>

                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Vendor Name
                                    <span className="text-danger ms-1 ">*</span>
                                </label>
                                <input
                                    
                                    type="text"
                                    className={`form-control ${errors.vendorName ? 'is-invalid' : ''}`}
                                    id="vendorName"
                                    placeholder="Enter item group name"
                                    value={formData.vendorName}
                                    onChange={handleChange}
                                />
                                {errors.vendorName && (
                                    <div className="invalid-feedback">{errors.vendorName}</div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Company Name
                                    
                                </label>
                                <input
                                    
                                    type="text"
                                    className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                    id="companyName"
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                                {errors.companyName && (
                                    <div className="invalid-feedback">{errors.companyName}</div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Vendor Email
                                    <span className="text-danger ms-1 ">*</span>
                                </label>
                                <input
                                    
                                    type="email"
                                    className={`form-control ${errors.vendorEmail ? 'is-invalid' : ''}`}
                                    id="vendorEmail"
                                    placeholder="Vendor Email"
                                    value={formData.vendorEmail}
                                    onChange={handleChange}
                                />
                                {errors.vendorEmail && (
                                    <div className="invalid-feedback">{errors.vendorEmail}</div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Vendor Phone
                                    
                                </label>
                                <input
                                    
                                    type="text"
                                    className={`form-control ${errors.vendorPhone ? 'is-invalid' : ''}`}
                                    id="vendorPhone"
                                    placeholder="Enter 10 digit phone number"
                                    value={formData.vendorPhone}
                                    onChange={(e) => {
                                        // Only allow numbers and limit to 10 digits
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData(prev => ({
                                            ...prev,
                                            vendorPhone: value
                                        }));
                                    }}
                                    pattern="[0-9]{10}"
                                    title="Please enter exactly 10 digits"
                                />
                                {errors.vendorPhone && (
                                    <div className="invalid-feedback">{errors.vendorPhone}</div>
                                )}
                            </FormGroup>
                        </Col>
                        </Row>
                        </Card>

                      

                        {/* Billing Address */}

                        <Card className="shadow p-4 my-4">
                        <Row>
                        <div className="d-flex justify-content-start align-items-start">
                        <h1>Billing Address</h1>
                    </div>

                       

                        <Col sm={12} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Address
                                </label>
                                <GooglePlacesAutocomplete
                                    apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                                    selectProps={{
                                        value: formData.address 
                                            ? { label: formData.address, value: formData.address }
                                            : null,
                                        onChange: (place) => {
                                            if (place) {
                                                handleBillingAddressSelect(place);
                                            } else {
                                                const updatedFormData = {
                                                    ...formData,
                                                    address: '',
                                                    city: '',
                                                    state: '',
                                                    country: '',
                                                    zipcode: ''
                                                };
                                                
                                                setFormData(updatedFormData);
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
                            </FormGroup>
                        </Col>

                        {/* select country */}
                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">Country</label>
                            <FormSelect
                                aria-label="select country"
                                id="country"
                                value={formData.country}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    country: e.target.value,
                                    state: '',
                                    city: ''
                                })}
                            >
                                <option>Select Country</option>
                                {countries.map((c, idx) => (
                                    <option key={idx} value={c.country}>
                                        {c.country}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">State</label>
                            <FormSelect
                                aria-label="select state"
                                id="state"
                                value={formData.state}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    state: e.target.value,
                                    city: ''
                                })}
                                disabled={!formData.country}
                            >
                                <option>Select State</option>
                                {states.map((s, idx) => (
                                    <option key={idx} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">City</label>
                            <FormSelect
                                aria-label="select city"
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    city: e.target.value
                                })}
                                disabled={!formData.state}
                            >
                                <option>Select City</option>
                                {cities.map((c, idx) => (
                                    <option key={idx} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>
                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   Zipcode
                                    
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.zipcode ? 'is-invalid' : ''}`}
                                    id="zipcode"
                                    placeholder="Enter Zipcode"
                                    value={formData.zipcode}
                                    onChange={handleChange}
                                />
                                {errors.zipcode && (
                                    <div className="invalid-feedback">{errors.zipcode}</div>
                                )}
                            </FormGroup>
                        </Col>
                        </Row>
                        </Card>




                       

                            {/* Shipping Address */}

                            <Card className="shadow p-4 my-4">
                        <Row>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1>Shipping Address</h1>
                        <Button 
                            variant="outline-primary" 
                            className="d-flex align-items-center gap-2"
                            onClick={copyBillingToShipping}
                        >
                            <FaCopy /> Copy from Billing
                        </Button>
                    </div>

                        

                        <Col sm={12} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Address
                                </label>
                                <GooglePlacesAutocomplete
                                    apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                                    selectProps={{
                                        value: formData.shippingAddress 
                                            ? { label: formData.shippingAddress, value: formData.shippingAddress }
                                            : null,
                                        onChange: (place) => {
                                            if (place) {
                                                handleShippingAddressSelect(place);
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    shippingAddress: '',
                                                    shippingcity: '',
                                                    shippingstate: '',
                                                    shippingcountry: '',
                                                    shippingzipcode: ''
                                                }));
                                            }
                                        },
                                        placeholder: "Enter Shipping Address",
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
                            </FormGroup>
                        </Col>

                        {/* select country */}
                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">Country</label>
                            <FormSelect
                                aria-label="select shipping country"
                                id="shippingcountry"
                                value={formData.shippingcountry}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    shippingcountry: e.target.value,
                                    shippingstate: '',
                                    shippingcity: ''
                                })}
                            >
                                <option>Select Country</option>
                                {countries.map((c, idx) => (
                                    <option key={idx} value={c.country}>
                                        {c.country}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">State</label>
                            <FormSelect
                                aria-label="select shipping state"
                                id="shippingstate"
                                value={formData.shippingstate}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    shippingstate: e.target.value,
                                    shippingcity: ''
                                })}
                                disabled={!formData.shippingcountry}
                            >
                                <option>Select State</option>
                                {states.map((s, idx) => (
                                    <option key={idx} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">City</label>
                            <FormSelect
                                aria-label="select shipping city"
                                id="shippingcity"
                                value={formData.shippingcity}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    shippingcity: e.target.value
                                })}
                                disabled={!formData.shippingstate}
                            >
                                <option>Select City</option>
                                {cities.map((c, idx) => (
                                    <option key={idx} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>
                        <Col sm={6} >
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   Zipcode
                                    
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.shippingzipcode ? 'is-invalid' : ''}`}
                                    id="shippingzipcode"
                                    placeholder="Enter Zipcode"
                                    value={formData.shippingzipcode}
                                    onChange={handleChange}
                                />
                                {errors.shippingzipcode && (
                                    <div className="invalid-feedback">{errors.shippingzipcode}</div>
                                )}
                            </FormGroup>
                        </Col>
                        </Row>
                        </Card>

                       

                        <Card className="shadow p-4 my-4">
                        <Row>
                        <div className="d-flex justify-content-start align-items-start">
                        <h1>Other Details</h1>
                    </div>

                        

                        <Col sm={6} >
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   Government ID
                                    
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.governmentid ? 'is-invalid' : ''}`}
                                    id="governmentid"
                                    placeholder="Enter Zipcode"
                                    value={formData.governmentid}
                                    onChange={handleChange}
                                />
                                {errors.governmentid && (
                                    <div className="invalid-feedback">{errors.governmentid}</div>
                                )}
                            </FormGroup>
                        </Col>

                        <Col sm={6} >
                        <label className="fw-bold my-2">Document </label>
                            <FormControl
                                type="file"
                                name="image"
                                accept=".jpg, .jpeg, .png, .pdf"
                                id="image"
                                onChange={handleImageChange}
                            />
                        </Col>
                        <Col sm={12} className="p-2 mb-2 text-end">
                            {formData.image?.type === 'application/pdf' ? (
                                <div className="pdf-preview">
                                    <embed 
                                        src={imagePreview} 
                                        type="application/pdf" 
                                        width="100px" 
                                        height="100px"
                                    />
                                </div>
                            ) : (
                                <Image
                                    src={imagePreview}
                                    alt="product image"
                                    fluid
                                    style={{ width: '100px', aspectRatio: '1', objectFit: 'cover' }}
                                    onError={(e) => e.target.src = 'https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg'}
                                />
                            )}
                        </Col>

                        </Row>
                        </Card>

                       
                        {/* Bank Details */}

                        <Card className="shadow p-4 my-4">
                        <Row>
                        <div className="d-flex justify-content-start align-items-start">
                        <h1>Bank Details</h1>
                    </div>


                       

                        <Col sm={6} className="my-2" >
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   Bank Name
                                    
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.bank_name ? 'is-invalid' : ''}`}
                                    id="bank_name"
                                    placeholder="Enter Bank Name"
                                    value={formData.bank_name}
                                    onChange={handleChange}
                                />
                                {errors.bank_name && (
                                    <div className="invalid-feedback">{errors.bank_name}</div>
                                )}
                            </FormGroup>
                        </Col>

                        <Col sm={6} className="my-2" >
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   Account Number
                                    
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.accountnumber ? 'is-invalid' : ''}`}
                                    id="accountnumber"
                                    placeholder="Enter Account Number"                                   
                                    value={formData.accountnumber}
                                    onChange={handleChange}
                                />
                                {errors.accountnumber && (
                                    <div className="invalid-feedback">{errors.accountnumber}</div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2" >
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   IFSC/SWIFT/BIC
                                    
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.ifsccode ? 'is-invalid' : ''}`}
                                    id="ifsccode"
                                    placeholder="Enter IFSC/SWIFT/BIC"                                   
                                    value={formData.ifsccode}
                                    onChange={handleChange}
                                />
                                {errors.ifsccode && (
                                    <div className="invalid-feedback">{errors.ifsccode}</div>
                                )}
                            </FormGroup>
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> Type Of Account </label>
                            <FormSelect aria-label="Select Account Type" id="accounttype" value={formData.accounttype} onChange={handleChange} className={`form-control ${errors.accounttype ? 'is-invalid' : ''}`}>
                                <option>Select</option>
                                <option value="Saving">Saving    </option>
                                <option value="current">Current</option>
                                <option value="Checking">Checking</option>
                            </FormSelect>
                            {errors.accounttype && (
                                <div className="invalid-feedback">{errors.accounttype}</div>
                            )}
                        </FormGroup>
                        
                        </Col>

                        <Col sm={12} className="d-flex justify-content-center">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="mt-4" 
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Col>

                    </Row>
                    </Card>

                    {/* </Row> */}

                    
                </Form>

            </Row>
        </Container>
    )
}
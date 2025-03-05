import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormGroup, FormSelect, Image, Row } from "react-bootstrap"
import { Link } from "react-router-dom";

export const VendorCreate = () => {
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
        documentimage: '',
        accounttype: '',
        bankname: '',
        accountnumber: '',
        ifsccode: '',
        
    })
    const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value, 
        }));
    };
    const handleImageChange = (event) => {
        if (event.target.files.length) {
            setImagePreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }
    return (
        <Container>
            <Row 
            style={{ marginTop: "50px", 
                // backgroundColor:"#F2F2F2",height:"100vh" 
                
                }}
            >


<Col sm={12} className="d-flex "  >
          {/* style={{top:"110px" , left:"700px"}} */}

          <div style={{ top: "186px" }}>
            <Breadcrumb  >
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">
                Purchase
              </BreadcrumbItem>
              <BreadcrumbItem ><Link to="/Inventory/vendor">Vendor List</Link></BreadcrumbItem>
              <BreadcrumbItem active>Vendor Create</BreadcrumbItem>
            </Breadcrumb>
          </div>

        </Col>



                <Form onClick={handleSubmit}>
                

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
                                    className="form-control"
                                    id="vendorName"
                                    placeholder="Enter item group name"
                                    value={formData.vendorName}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Company Name
                                    
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vendorName"
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Vendor Email
                                    <span className="text-danger ms-1 ">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vendorName"
                                    placeholder="Vendor Email"
                                    value={formData.vendorEmail}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Vendor Phone
                                    
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vendorName"
                                    placeholder="0 0 0 - 0 0 0 - 0 0 0 0"
                                    value={formData.vendorPhone}
                                    onChange={handleChange}
                                />
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

                       

                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Address
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vendorName"
                                    placeholder="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>

                        {/* select country */}
                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> Country </label>
                            <FormSelect aria-label="select country" id="country" value={formData.country} onChange={handleChange}>
                                <option>Select</option>
                                <option value="India">India</option>
                                <option value="Oman">Oman</option>
                                <option value="Yemen">Yemen</option>
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> State </label>
                            <FormSelect aria-label="select country" id="state" value={formData.state} onChange={handleChange}>
                                <option>Select</option>
                                <option value="Maharashtra">Maharashtra    </option>
                                <option value="Punjab">Punjab</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> City </label>
                            <FormSelect aria-label="select city" id="city" value={formData.city} onChange={handleChange}>
                                <option>Select</option>
                                <option value="Pune">Pune    </option>
                                <option value="Nashik">Nashik</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Nagpur">Nagpur</option>
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
                                    className="form-control"
                                    id="zipcode"
                                    placeholder="Enter Zipcode"
                                    value={formData.zipcode}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        </Row>
                        </Card>




                       

                            {/* Shipping Address */}

                            <Card className="shadow p-4 my-4">
                        <Row>
                        <div className="d-flex justify-content-start align-items-start">
                        <h1>Shipping Address
                         <span className="text-success ms-1 size-12"> (Copy Biling Address)</span>
                         </h1>
                    </div>

                        

                        <Col sm={6} className="my-2">
                            <FormGroup>
                                <label className="fw-bold my-2">
                                    
                                    Address
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vendorName2"
                                    placeholder="address"
                                    value={formData.shippingAddress}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>

                        {/* select country */}
                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> Country </label>
                            <FormSelect aria-label="select country" id="country2" value={formData.shippingcountry} onChange={handleChange}>
                                <option>Select</option>
                                <option value="India">India</option>
                                <option value="Oman">Oman</option>
                                <option value="Yemen">Yemen</option>
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> State </label>
                            <FormSelect aria-label="select country" id="state2" value={formData.shippingstate} onChange={handleChange}>
                                <option>Select</option>
                                <option value="Maharashtra">Maharashtra    </option>
                                <option value="Punjab">Punjab</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> City </label>
                            <FormSelect aria-label="select city" id="city2" value={formData.shippingcity} onChange={handleChange}>
                                <option>Select</option>
                                <option value="Pune">Pune    </option>
                                <option value="Nashik">Nashik</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Nagpur">Nagpur</option>
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
                                    className="form-control"
                                    id="zipcode2"
                                    placeholder="Enter Zipcode"
                                    value={formData.shippingzipcode}
                                    onChange={handleChange}
                                />
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
                                    className="form-control"
                                    id="governmentid"
                                    placeholder="Enter Zipcode"
                                    value={formData.governmentid}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={6} >
                        <label className="fw-bold my-2">Document </label>
                            <FormControl
                                type="file"
                                name="documentimage"
                                accept=".jpg, .jpeg, .png"
                                id="documentimage"
                                onChange={handleImageChange}
                            />
                        </Col>
                        <Col sm={12} className="p-2 mb-2 text-end">
                            <Image
                                src={imagePreview}
                                alt="product image"
                                fluid
                                style={{ width: '100px', aspectRatio: '1', objectFit: 'cover' }}
                                onError={(e) => e.target.src = 'https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg'}
                            />
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
                                    className="form-control"
                                    id="bankname"
                                    placeholder="Enter Bank Name"
                                    value={formData.bankname}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={6} className="my-2" >
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   Account Number
                                    
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="accountnumber"
                                    placeholder="Enter Account Number"                                   
                                    value={formData.accountnumber}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6} className="my-2" >
                            <FormGroup>
                                <label className="fw-bold my-2">
                                   IFSC/SWIFT/BIC
                                    
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ifsccode"
                                    placeholder="Enter IFSC/SWIFT/BIC"                                   
                                    value={formData.ifsccode}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2"> Type Of Account </label>
                            <FormSelect aria-label="Select Account Type" id="accounttype" value={formData.accounttype} onChange={handleChange}>
                                <option>Select</option>
                                <option value="Saving">Saving    </option>
                                <option value="current">Current</option>
                                <option value="Checking">Checking</option>
                            </FormSelect>
                        </FormGroup>
                        
                        </Col>

                        <Col sm={12} className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" className="mt-4" >Submit</Button>
                        </Col>

                    </Row>
                    </Card>

                    {/* </Row> */}

                    
                </Form>

            </Row>
        </Container>
    )
}
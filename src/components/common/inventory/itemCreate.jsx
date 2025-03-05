import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Image, InputGroup, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus, FaStarOfLife } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Units } from "./modal/units";
import { fetchItems } from "../../../store/adminslices/inventory";
import { useDispatch } from "react-redux";

export const ItemCreate = () => {
    const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
    const [showUnitModal, setShowUnitModal] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        unit: '',

    })

    const handleImageChange = (event) => {
        if (event.target.files.length) {
            setImagePreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value, // Updates corresponding field
        }));
    };

    const handleSelectChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            unit: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            dispatch(fetchItems(formData)); // Pass collected form data
            console.log("Submitted data:", formData);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Container>
            <Row
                style={{
                    marginTop: "50px",
                    // backgroundColor:"#F2F2F2",height:"100vh" 
                }}
            >

                <Col sm={12} className="d-flex "  >
                    {/* style={{top:"110px" , left:"700px"}} */}

                    <div style={{ top: "186px" }}>
                        <Breadcrumb  >
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem href="#">
                                Inventory
                            </BreadcrumbItem>
                            <BreadcrumbItem ><Link to="/Inventory/Items">Item List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Item Create</BreadcrumbItem>
                        </Breadcrumb>
                    </div>

                </Col>
                <Form onSubmit={handleSubmit}>
                    {/* <Row> */}
                    <Card className="shadow p-4 my-4">
                        <Row>
                            <div className="d-flex justify-content-start align-items-start">
                                <h1> Create New Item</h1>
                            </div>
                            <Col sm={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                        Name
                                        <span className="text-danger ms-1 ">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter item name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>

                            <Col sm={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        SKU
                                        <span className="text-danger ms-1 ">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="sku"
                                        placeholder="SKU"
                                        value={formData.sku}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>

                            <Col sm={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                        Unit
                                        <span className="text-danger ms-1 ">*</span>
                                    </label>
                                    <InputGroup>
                                        <FormSelect
                                            name="unit-type"
                                            aria-label="Select unit"
                                            defaultValue="Mobile"
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Fax">Fax</option>
                                            <option value="Direct">Direct</option>
                                            <option value="Mobile">Mobile</option>
                                        </FormSelect>
                                    </InputGroup>
                                    <div id="addUnitFieldContainer" />
                                    {/* Link to open the modal */}
                                    <Link to="#" className="js-create-field form-link" onClick={() => setShowUnitModal(true)}>
                                        <FaPlus /> Add Unit
                                    </Link>

                                    {/* Modal Component */}
                                    <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} />
                                </FormGroup>
                            </Col>
                        </Row>

                    </Card>


                    {/* ------------------------------------------------------------------------------------- */}

                    <Card className="shadow p-4 my-4">
                        <Row>
                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        HSN Code
                                        <span className="text-danger ms-1 ">*</span>
                                    </label>
                                    <input type="text" className="form-control" id="hsnCode" placeholder="HSN Code" />
                                </FormGroup>
                            </Col>

                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        Tax Preference
                                        <span className="text-danger ms-1 ">*</span>
                                    </label>
                                    <input type="text" className="form-control" placeholder="Tax Preference" />
                                </FormGroup>
                            </Col>

                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        Tax
                                        <span className="text-danger ms-1 ">*</span>
                                    </label>
                                    <InputGroup>
                                        <FormSelect aria-label="Select Tax">
                                            <option value="23%">23%</option>
                                            <option value="8%">8%</option>
                                            <option value="7%">7%</option>
                                        </FormSelect>
                                    </InputGroup>
                                    <div id="addTaxFieldContainer" />
                                    <a className="js-create-field form-link" href="javascript:;">
                                        <FaPlus /> Add Tax
                                    </a>
                                </FormGroup>
                            </Col>

                            <Col sm={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">Dimensions</label>
                                    <InputGroup>
                                        <FormControl type="tel" name="length" placeholder="Length" />
                                        <FormControl type="tel" name="width" placeholder="Width" />
                                        <FormControl type="tel" name="height" placeholder="Height" />
                                        <FormSelect name="dimension_unit">
                                            <option value="mm">mm</option>
                                            <option value="cm">cm</option>
                                            <option value="m">m</option>
                                            <option value="inch">inch</option>
                                            <option value="feet">feet</option>
                                        </FormSelect>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col sm={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2" htmlFor="weight">Weight</label>
                                    <InputGroup>
                                        <FormControl
                                            type="tel"
                                            name="weight"
                                            id="weight"
                                            placeholder="Enter weight"
                                        />

                                        <FormSelect name="weight_unit" id="weight_unit" >
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="t">t</option>
                                            <option value="lb">lb</option>
                                            <option value="oz">oz</option>
                                        </FormSelect>

                                    </InputGroup>
                                </FormGroup>
                            </Col>

                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        Manufacturer

                                    </label>
                                    <InputGroup>
                                        <FormSelect aria-label="Select Tax">
                                            <option value="MI">MI</option>
                                            <option value="HP">HP</option>
                                            <option value="Dell">Dell</option>
                                        </FormSelect>
                                    </InputGroup>
                                    <div id="addTaxFieldContainer" />
                                    <a className="js-create-field form-link" href="javascript:;">
                                        <FaPlus /> Add Manufacturer
                                    </a>
                                </FormGroup>
                            </Col>


                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                        Brand
                                    </label>
                                    <InputGroup>
                                        <FormSelect

                                            aria-label="Select Brand"

                                        >
                                            <option value="">Select Brand</option>
                                            <option value="Work">HP</option>
                                            <option value="Xiomi">Xiomi</option>

                                        </FormSelect>
                                    </InputGroup>
                                    <div />
                                    <a className="js-create-field form-link" href="javascript:;">
                                        <FaPlus /> Add Brand
                                    </a>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        MPN
                                        {/* <span className="text-danger ms-1 ">*</span> */}
                                    </label>
                                    <input type="text" className="form-control" placeholder="0 0 0 - 0 0 0" />
                                </FormGroup>
                            </Col>
                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        UPC
                                        {/* <span className="text-danger ms-1 ">*</span> */}
                                    </label>
                                    <input type="text" className="form-control" placeholder="0 0 0 - 0 0 0" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Card>


                    <Card className="shadow my-4 p-4">
                        <Row>
                            <Col sm={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2" >
                                        Cost Price <span className="text-danger">*</span>
                                    </label>
                                    <InputGroup>

                                        <InputGroupText>₹</InputGroupText>

                                        <FormControl
                                            type="tel"
                                            name="cost_price"
                                            placeholder="00.00"
                                        />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col sm={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2" >
                                        Selling Price <span className="text-danger">*</span>
                                    </label>
                                    <InputGroup>

                                        <InputGroupText>₹</InputGroupText>

                                        <FormControl
                                            type="tel"
                                            name="selling_price"
                                            placeholder="00.00"
                                        />
                                    </InputGroup>
                                </FormGroup>
                            </Col>

                            <Col md={6} className="my-2">
                                <FormGroup>
                                    <label className="fw-bold my-2">
                                        {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                        Preferrd Vendor
                                        <span className="text-danger ms-1 ">*</span>
                                    </label>
                                    <InputGroup>
                                        <FormSelect aria-label="Select Tax">
                                            <option value=" ">Select Vendor</option>
                                            <option value="Vendor1">Vendor1</option>
                                            <option value="Vendor2">Vendor2</option>


                                        </FormSelect>
                                    </InputGroup>

                                </FormGroup>
                            </Col>
                        </Row>
                    </Card>


                    <Card className="shadow my-4 p-4">
                        <Row>
                            <Col sm={12} className="my-2">
                                <FormCheck
                                    type="checkbox"
                                    id="checkbox3"
                                    label="Tracking Inventory For This Item"
                                    disabled
                                    checked
                                />
                                <span>You cannot enable/disable inventory tracking once you've created transactions for this item</span>
                            </Col>

                            <Col sm={6} className="my-2">
                                <FormGroup controlId="stock">
                                    <FormLabel>Opening Stock</FormLabel>
                                    <FormControl type="tel" name="stock" placeholder="100" />
                                </FormGroup>
                            </Col>

                            <Col sm={6} className="my-2">
                                <FormGroup controlId="stock_rate">
                                    <FormLabel>Opening Stock (Rate Per Unit)</FormLabel>
                                    <InputGroup>
                                        <InputGroupText>₹</InputGroupText>
                                        <FormControl type="tel" name="stock_rate" placeholder="00.00" />
                                    </InputGroup>
                                </FormGroup>
                            </Col>

                            <Col sm={6} className="my-2">
                                <FormGroup controlId="reorder_point">
                                    <FormLabel>Reorder Point</FormLabel>
                                    <FormControl type="tel" name="reorder_point" placeholder="000" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Card>





                    <Card className="shadow my-4 p-4">
                        <Row>
                            <Col sm={3} className="my-2">
                                <FormLabel htmlFor="linking">Link with Website</FormLabel>
                                <div className="form-group m-t-15 m-checkbox-inline mb-3 custom-radio-ml">
                                    <FormCheck
                                        type="radio"
                                        id="radioinline1"
                                        name="linking"
                                        value="Y"
                                        label="Yes"
                                        inline
                                    />
                                    <FormCheck
                                        type="radio"
                                        id="radioinline2"
                                        name="linking"
                                        value="N"
                                        label="No"
                                        inline
                                        defaultChecked
                                    />
                                </div>
                            </Col>

                            <Col sm={4} className="my-2">
                                <FormLabel htmlFor="imageLabel">Product Image</FormLabel>
                                <FormControl
                                    type="file"
                                    name="image"
                                    accept=".jpg, .jpeg, .png"
                                    id="imageLabel"
                                    onChange={handleImageChange}
                                />
                            </Col>

                            <Col sm={5} className=" my-2">
                                <Image
                                    src={imagePreview}
                                    alt="product image"
                                    fluid
                                    style={{ width: '100px', aspectRatio: '1', objectFit: 'cover' }}
                                    onError={(e) => e.target.src = 'https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg'}
                                />
                            </Col>

                            <Col sm={12} className="my-2 btn-lg">
                                <Button variant="primary" type="submit" className=" my-2">Submit</Button>
                            </Col>
                        </Row>
                    </Card>


                    {/* </Row> */}

                </Form>
            </Row>

        </Container>

    );
}

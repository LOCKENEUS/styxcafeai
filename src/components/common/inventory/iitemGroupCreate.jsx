import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormGroup, FormSelect, InputGroup, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

export const IitemGroupCreate = () => {
    const [formData, setFormData] = useState({
        itemGroupName: '',
        unitType: '',
        taxPreference: '',
        tax: '',
        manufacturer: '',
        brand: '',
        description: '',


    })
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value, // Updates corresponding field
        }));
    };
    return (
        <Container 
        style={{ backgroundColor: "#F2F2F2" }}
        >
    <Row style={{ fontFamily: 'inter', fontSize: "18px"}}>

                <Col sm={12} className=" "  >
                    {/* style={{top:"110px" , left:"700px"}} */}

                    <div 
                    style={{ top: "186px" , marginLeft:'49px' }}
                    >
                        <Breadcrumb  >
                            <BreadcrumbItem href="#" >Home</BreadcrumbItem>
                            <BreadcrumbItem href="#">
                                Inventory
                            </BreadcrumbItem>
                            <BreadcrumbItem ><Link to="/Inventory/ItemsGroup">Group Item List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Item Group Create</BreadcrumbItem>
                        </Breadcrumb>
                    </div>

                </Col>

                <Form>
                    
                  
                            <Card className="shadow p-4 my-4">

                                <div className="d-flex justify-content-start align-items-start">
                                    <h1> Create New Item</h1>
                                </div>
                                <Row>
                                <Col sm={6} className="my-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2">
                                            {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                            Item Group Name
                                            <span className="text-danger ms-1 ">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="itemGroupName"
                                            placeholder="Enter item group name"
                                            value={formData.itemGroupName}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={6} className="my-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2">
                                            {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                            Unit
                                            <span className="text-danger ms-1 ">*</span>
                                        </label>
                                        <InputGroup>
                                            <FormSelect
                                                name="unitType"
                                                aria-label="Select unit"

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
                                        {/* <Link to="#" className="js-create-field form-link" onClick={() => setShowUnitModal(true)}> */}
                                        <FaPlus /> Add Unit
                                        {/* </Link> */}

                                        {/* Modal Component */}
                                        {/* <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} /> */}
                                    </FormGroup>
                                </Col>
                                <Col md={6} className="my-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2">
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            Tax Preference
                                            <span className="text-danger ms-1 ">*</span>
                                        </label>
                                        <input type="text" className="form-control" placeholder="Tax Preference" name="taxPreference" />
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

                                <Col md={6} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2">
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            Manufacturer

                                        </label>
                                        <InputGroup>
                                            <FormSelect aria-label="Select Tax" name="manufacturer">
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
                                                name="brand"

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

                                {/* Description */}
                                <Col md={6} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2">
                                            {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                            Description
                                        </label>
                                        <textarea className="form-control" placeholder="Description" name="description" rows="3"></textarea>
                                    </FormGroup>

                                </Col>

                                <Col sm={12} className="my-4">
                                    <Row>

                                        <label className="fw-bold mb-2"> Multiple Items? Create Attributes and Options</label>
                                        <Col md={4} className="mb-2">
                                            <FormGroup>

                                                <FormControl type="text" placeholder="e.g: Color">

                                                </FormControl>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4} className="mb-2">
                                            <FormGroup>

                                                <FormControl type="text" placeholder="e.g: Red, Black">

                                                </FormControl>
                                            </FormGroup>
                                        </Col>
                                        <Col sm={4}>
                                            <InputGroup>
                                                <Button variant="outline-primary"
                                                //   onClick={addRow}
                                                >
                                                    <FaPlus />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                // onClick={() => removeRow(index)}
                                                // disabled={attributes.length === 1}
                                                >
                                                    <RiDeleteBin6Fill />
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>


                                </Col>


                                <Col md={12}>
                                    <Button variant="primary" type="submit" className="mt-4">Save</Button>
                                </Col>
                                </Row>
                      
                            </Card>
                        
                </Form>


            </Row>
        </Container>

    );
};
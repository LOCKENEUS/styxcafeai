import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormGroup, FormSelect, InputGroup, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Units } from "../modal/units";
import { TaxModal } from "../modal/tax";
import { Manufacturer } from "../modal/manufacturer";
import { Brand } from "../modal/brand";

export const IitemGroupCreate = () => {
    const [attributes, setAttributes] = useState([{ name: '', options: '' }]);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showManufacturerModal, setShowManufacturerModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [taxPreference, setTaxPreference] = useState('inclusive');
    const [formData, setFormData] = useState({
        itemGroupName: '',
        unitType: '',
        taxPreference: 'inclusive',
        tax: '',
        manufacturer: '',
        brand: '',
        description: '',


    })
    const handleChange = (e) => {
        // const { id, value } = e.target;
        // setFormData((prev) => ({
        //     ...prev,
        //     [id]: value, 
        // }));
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'taxPreference') {
            setTaxPreference(value);
        }
    };



    const addRow = () => {
        setAttributes([...attributes, { name: '', options: '' }]);
    };

    const removeRow = (index) => {
        if (attributes.length > 1) {
            const newAttributes = [...attributes];
            newAttributes.splice(index, 1);
            setAttributes(newAttributes);
        }
    };

    const handleChangeItem = (index, field, value) => {
        const updated = [...attributes];
        updated[index][field] = value;
        setAttributes(updated);
    };

    const handaleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }


    // -----    style -----

    const lableHeader = {
        fontSize: "16px",
        fontWeight: "500",
    }
    const inputStyle = {
        borderRadius: "8px",
        padding: "13px",
        fontSize: "16px",
        border: "1px solid rgb(222, 222, 222)",

    };

    return (
        <Container
            style={{ backgroundColor: "#F2F2F2" }}
        > <Card.Header className="fw-bold">
                <Row style={{ fontFamily: 'inter', fontSize: "18px" }}>

                    <Col sm={8} xs={12} >
                        <Breadcrumb  >
                            <BreadcrumbItem href="#" style={{ fontSize: "16px", fontWeight: "500" }} >Home</BreadcrumbItem>
                            <BreadcrumbItem href="#" style={{ fontSize: "16px", fontWeight: "500" }}>
                                Inventory
                            </BreadcrumbItem>
                            <BreadcrumbItem style={{ fontSize: "16px", fontWeight: "500" }}><Link to="/Inventory/ItemsGroup">Group Item List</Link></BreadcrumbItem>
                            <BreadcrumbItem active style={{ fontSize: "16px", fontWeight: "500" }}>Item Group Create</BreadcrumbItem>
                        </Breadcrumb>

                    </Col>

                    <Form onSubmit={handaleSubmit}>


                        <Card className="shadow p-4 my-4">

                            <div className="d-flex justify-content-start align-items-start">
                                <h1 className="text-center mx-2 mt-2">Create New Item </h1>
                            </div>
                            <Row>
                                <Col sm={4} className="my-2  px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
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
                                            style={inputStyle}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} className="my-2  px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                            Unit
                                            <span className="text-danger ms-1 ">*</span>
                                        </label>
                                        <InputGroup>
                                            <FormSelect
                                                name="unitType"
                                                aria-label="Select unit"
                                                style={inputStyle}

                                            >
                                                <option value="Home">Home</option>
                                                <option value="Work">Work</option>
                                                <option value="Fax">Fax</option>
                                                <option value="Direct">Direct</option>
                                                <option value="Mobile">Mobile</option>
                                            </FormSelect>
                                            <Button
                                                type="button"
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => setShowUnitModal(true)}
                                                style={{
                                                    marginLeft: "10px",
                                                    padding: "8px 12px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRadius: "8px",
                                                    border: "1px double #E5EFFF", // Fixed typo "boteder"
                                                }}
                                            >
                                                <FaPlus />
                                            </Button>
                                            <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col md={4} className="my-2  px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>

                                            Tax Preference
                                            <span className="text-danger ms-1 ">*</span>
                                        </label>
                                        <FormSelect
                                            aria-label="Select Tax Preference"
                                            name="taxPreference"
                                            value={formData.taxPreference}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="inclusive">Taxsaple</option>
                                            <option value="exclusive">Not Tax</option>
                                        </FormSelect>
                                    </FormGroup>
                                </Col>
                                {taxPreference !== 'inclusive' && (
                                    <Col sm={4} className="my-2  px-4">
                                        <FormGroup>
                                            <label className="fw-bold my-2" style={lableHeader}>
                                                Tax <span className="text-danger ms-1">*</span>
                                            </label>
                                            <InputGroup>
                                                <FormSelect
                                                    aria-label="Select Tax"
                                                    name="tax"
                                                    style={inputStyle}
                                                >
                                                    <option value="23%">23%</option>
                                                    <option value="8%">8%</option>
                                                    <option value="7%">7%</option>
                                                </FormSelect>
                                                <Button
                                                    type="button"
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => setShowTaxModal(true)}
                                                    style={{
                                                        marginLeft: "10px",
                                                        padding: "8px 12px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        borderRadius: "8px",
                                                        border: "1px double #E5EFFF",
                                                    }}
                                                >
                                                    <FaPlus />
                                                </Button>
                                                <TaxModal show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                )}
                                <Col md={4} className="my-2  px-4" style={lableHeader}>
                                    <FormGroup>
                                        <label className="fw-bold my-2">
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            Manufacturer
                                        </label>
                                        <InputGroup>
                                            <FormSelect aria-label="Select Tax" name="manufacturer" style={inputStyle}>
                                                <option value="MI">MI</option>
                                                <option value="HP">HP</option>
                                                <option value="Dell">Dell</option>
                                            </FormSelect>
                                            <Button
                                                type="button"
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => setShowManufacturerModal(true)}
                                                style={{
                                                    marginLeft: "10px",
                                                    padding: "8px 12px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRadius: "8px",
                                                    border: "1px double #E5EFFF", // Fixed typo "boteder"
                                                }}
                                            >
                                                <FaPlus />
                                            </Button>
                                            <Manufacturer show={showManufacturerModal} handleClose={() => setShowManufacturerModal(false)} />
                                        </InputGroup>
                                        <div id="addTaxFieldContainer" />

                                    </FormGroup>
                                </Col>
                                <Col md={4} className="my-2  px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>                                       
                                            Brand
                                        </label>
                                        <InputGroup>
                                            <FormSelect
                                                aria-label="Select Brand"
                                                name="brand"
                                                style={inputStyle}
                                            >
                                                <option value="">Select Brand</option>
                                                <option value="Work">HP</option>
                                               <option value="Xiomi">Xiomi</option>
                                            </FormSelect>
                                            <Button
                                                type="button"
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => setShowBrandModal(true)}
                                                style={{
                                                    marginLeft: "10px",
                                                    padding: "8px 12px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRadius: "8px",
                                                    border: "1px double #E5EFFF", 
                                                }}>
                                                <FaPlus />
                                            </Button>
                                            <Brand show={showBrandModal} handleClose={() => setShowBrandModal(false)} />
                                        </InputGroup>
                                        <div />

                                    </FormGroup>
                                </Col>
                                {/* Description */}
                                <Col md={4} className="my-2  px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                            Description
                                        </label>
                                        <textarea className="form-control" placeholder="Description" name="description" rows="3"
                                            style={inputStyle}
                                        ></textarea>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card>
                        <Card className="shadow p-4 my-4">
                            <Col sm={12} className="my-2 px-4">
                                <Row>
                                    <label className="fw-bold mb-2" style={lableHeader}>
                                        Multiple Items? Create Attributes and Options
                                    </label>
                                </Row>
                                {attributes.map((attr, index) => (
                                    <Row key={index} className="align-items-center mb-2">
                                        <Col md={4}>
                                            <FormGroup>
                                                <FormControl
                                                    type="text"
                                                    placeholder="e.g: Color"
                                                    value={attr.name}
                                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                                    style={inputStyle}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <FormControl
                                                    type="text"
                                                    placeholder="e.g: Red, Black"
                                                    value={attr.options}
                                                    onChange={(e) => handleChangeItem(index, 'options', e.target.value)}
                                                    style={inputStyle}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm={4}>
                                            <InputGroup>
                                                <Button variant="outline-primary" className="p-3 rounded-2" onClick={addRow}>
                                                    <FaPlus />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    className="p-3 ms-2 rounded-2"
                                                    onClick={() => removeRow(index)}
                                                    disabled={attributes.length === 1}
                                                >
                                                    {attributes.length === 1 ? null : <RiDeleteBin6Fill />}
                                                </Button>

                                            </InputGroup>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                            <Col sm={12} className="my-4 btn-lg justify-content-end align-items-end">
                                <Button variant="primary" type="submit" className="mt-4 btn-lg rounded-2 float-end">
                                    Submit
                                </Button>
                            </Col>
                        </Card>
                    </Form>
                </Row>
            </Card.Header>
        </Container>

    );
};
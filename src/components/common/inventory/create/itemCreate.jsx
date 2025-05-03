import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Image, InputGroup, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus, FaStarOfLife } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Units } from "../modal/units";
import { fetchItems } from "../../../../store/adminslices/inventory";
import { useDispatch } from "react-redux";
import { addItems } from "../../../../store/slices/inventory";
import add from '/assets/inventory/material-symbols_add-rounded.png'
import { Manufacturer } from "../modal/manufacturer";
import { Brand } from "../modal/brand";
import { TaxModal } from "../modal/tax";
export const ItemCreate = () => {
    const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showManufacturerModal, setShowManufacturerModal ] = useState(false);
    const [showBrandModal,setShowBrandModal]  = useState(false);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const dispatch = useDispatch();
    const [taxPreference, setTaxPreference] = useState('inclusive');
    const [galleryImages, setGalleryImages] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        // hsnCode: "",
        sku: "",
        unitType: "",
        hsnCode: "",
        taxPreference:"inclusive",
        length: "",
        width: "",
        height: "",
        dimension_unit: "",
        weight1: "",
        weight_unit: "",
        manufacturer: "",
        ean: "",
        brand: "",
        upc: "",
        mpn: "",
        cost_price: "",
        selling_price: "",
        vendor: "",
        stock: "",
        stock_rate: "",
        reorder_point: "",

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }


    const handleTaxPreferenceChange = (e) => {
        setTaxPreference(e.target.value);
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setGalleryImages(previews);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // try {
        //     dispatch(addItems(formData)); 
        //     console.log("Submitted data:", formData);

        // } catch (error) {
        //     console.error("Error submitting form:", error);
        // }
    };

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
        <Container fluid>
            <Row>
                <Card.Header className="fw-bold">
                    <Row className="d-flex justify-content-between align-items-center  "
                    // style={{
                    //     position: "sticky",
                    //     top: '70px',
                    //     zIndex: 1000,
                    // backgroundColor: "#fff",
                    // paddingTop: "10px",
                    // paddingBottom: "10px",
                    // borderBottom: "1px solid #dee2e6",
                    // }}
                    >
                        <Col sm={8} xs={12} className="mx-4">
                            <Breadcrumb>
                                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>

                                    <Link to="/superadmin/dashboard">Home
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                                    <Link to="/Inventory/Dashboard"
                                    // state={{ cafeId: cafeId }}
                                    >
                                        Inventory
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                                    <Link to="/Inventory/Items"
                                    // state={{ cafeId: cafeId }}
                                    >
                                        Items List
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Item Create  </Breadcrumb.Item>

                            </Breadcrumb>

                        </Col>
                    </Row>

                    <Row className="mx-3">
                        <Card className="my-2 mx-auto py-3 px-3 rounded-4" style={{ backgroundColor: "white" }}>
                            <Row className="d-flex ">
                                <Col sm={12} className="fluid d-flex justify-content-start">
                                    <h1 className="text-center mx-2 mt-2">Create Item </h1>
                                </Col>


                                <Col sm={4} className="my-2 px-4 ">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            Name <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            placeholder="Enter item name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2  px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            SKU <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="sku"
                                            name="sku"
                                            placeholder="SKU"
                                            value={formData.sku}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2 px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            Unit <span className="text-danger ms-1">*</span>
                                        </label>
                                        <InputGroup>
                                            <FormSelect
                                                name="unitType"
                                                onChange={handleChange}
                                                aria-label="Select unit"
                                                value={formData.unitType}
                                                defaultValue="Mobile"
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
                                        </InputGroup>

                                        <div id="addUnitFieldContainer" />
                                        <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card>


                        <Card className="my-2 mx-auto py-3 px-2 rounded-4" style={{ backgroundColor: "white" }}>
                            <Row className="mx-3">
                                <Col sm={4} className="my-2  ">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>

                                            HSN Code
                                            {/* <span className="text-danger ms-1 ">*</span> */}
                                        </label>
                                        <input style={inputStyle} type="text" name="hsnCode" 
                                        className="form-control" id="hsnCode"
                                         placeholder="HSN Code"
                                         value={formData.hsnCode}
                                         onChange={handleChange}
                                         />
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            Tax Preference
                                            {/* <span className="text-danger ms-1">*</span> */}
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
                                    <Col sm={4} className="my-2">
                                        <FormGroup>
                                            <label className="fw-bold my-2" style={lableHeader}>
                                                Tax <span className="text-danger ms-1">*</span>
                                            </label>
                                            <InputGroup >
                                                <FormSelect aria-label="Select Tax" name="tax" style={inputStyle} >
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
                                                        border: "1px double #E5EFFF", // Fixed typo "boteder"
                                                    }}
                                                >
                                                    <FaPlus />
                                                </Button>
                                                <TaxModal show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
                                            </InputGroup>


                                        </FormGroup>
                                    </Col>
                                )}

                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>Dimensions</label>
                                        <InputGroup className="gap-2">
                                            <FormControl type="tel" name="length" placeholder="Length" 
                                           
                                            value={formData.length}
                                            onChange={handleChange}
                                            style={inputStyle} />
                                            <FormControl type="tel" name="width" placeholder="Width" 
                                            value={formData.width}
                                            onChange={handleChange}
                                            style={inputStyle} />
                                            <FormControl type="tel" name="height" placeholder="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            style={inputStyle} />
                                            <FormSelect name="dimension_unit" style={inputStyle}
                                            value={formData.dimension_unit}
                                            onChange={handleChange}
                                            >
                                                <option value="mm">mm</option>
                                                <option value="cm">cm</option>
                                                <option value="m">m</option>
                                                <option value="inch">inch</option>
                                                <option value="feet">feet</option>
                                            </FormSelect>
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" htmlFor="weight" style={lableHeader}>Weight</label>
                                        <InputGroup className="gap-2">
                                            <FormControl
                                                type="number"
                                                name="weight1"
                                                value={formData.weight1}
                                                onChange={handleChange}
                                                id="weight"
                                                placeholder="Enter weight"
                                                style={inputStyle}
                                            />

                                            <FormSelect name="weight_unit" id="weight_unit"
                                            value={formData.weight_unit}
                                            onChange={handleChange}
                                            style={inputStyle} >
                                                <option value="kg">kg</option>
                                                <option value="g">g</option>
                                                <option value="t">t</option>
                                                <option value="lb">lb</option>
                                                <option value="oz">oz</option>
                                            </FormSelect>

                                        </InputGroup>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            Manufacturer

                                        </label>
                                        <InputGroup>
                                            <FormSelect aria-label="Select Tax" style={inputStyle}
                                            name="manufacturer"
                                            value={formData.manufacturer}
                                            onChange={handleChange}
                                            >
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
                                        {/* <div id="addTaxFieldContainer" />
                                        <a className="js-create-field form-link" href="javascript:;">
                                            <FaPlus /> Add Manufacturer
                                        </a> */}
                                    </FormGroup>
                                </Col>


                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                            Brand
                                        </label>
                                        <InputGroup>
                                            <FormSelect
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                aria-label="Select Brand"
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
                                                    border: "1px double #E5EFFF", // Fixed typo "boteder"
                                                }}
                                            >
                                                <FaPlus />
                                            </Button>

                                            <Brand show={showBrandModal} handleClose={() => setShowBrandModal(false)} />
                                        </InputGroup>
                                        {/* <div />
                                        <a className="js-create-field form-link" href="javascript:;">
                                            <FaPlus /> Add Brand
                                        </a> */}
                                    </FormGroup>
                                </Col>
                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            MPN
                                            {/* <span className="text-danger ms-1 ">*</span> */}
                                        </label>
                                        <input type="text" className="form-control" placeholder="0 0 0 - 0 0 0" style={inputStyle}
                                        name='mpn'
                                        value={formData.mpn}
                                        onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            UPC
                                            {/* <span className="text-danger ms-1 ">*</span> */}
                                        </label>
                                        <input type="text" className="form-control" placeholder="0 0 0 - 0 0 0" style={inputStyle} 
                                        name="upc"
                                        value={formData.upc}
                                        onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card>


                        <Card className="my-2 mx-auto py-3 px-2 rounded-4" style={{ backgroundColor: "white" }}>
                            <Row className="mx-3">
                                <Col sm={4} className="my-2">
                                    <FormGroup >
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            Cost Price <span className="text-danger">*</span>
                                        </label>
                                        <InputGroup className="gap-2">

                                            <InputGroupText style={inputStyle} >₹</InputGroupText>

                                            <FormControl
                                                type="tel"
                                                name="cost_price"
                                                value={formData.cost_price}
                                                placeholder="00.00"
                                                style={inputStyle}
                                                onChange={handleChange}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            Selling Price <span className="text-danger">*</span>
                                        </label>
                                        <InputGroup className="gap-2">

                                            <InputGroupText style={inputStyle}>₹</InputGroupText>

                                            <FormControl
                                                style={inputStyle}
                                                type="number"
                                                value={formData.selling_price}
                                                name="selling_price"
                                                placeholder="00.00"
                                                onChange={handleChange}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            Preferrd Vendor
                                            <span className="text-danger ms-1 ">*</span>
                                        </label>
                                        <InputGroup>
                                            <FormSelect aria-label="Select Tax" style={inputStyle}
                                            name="vendor"
                                            value={formData.vendor}
                                            onChange={handleChange}
                                            >
                                                <option value=" ">Select Vendor</option>
                                                <option value="Vendor1">Vendor1</option>
                                                <option value="Vendor2">Vendor2</option>


                                            </FormSelect>
                                        </InputGroup>

                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card>

                        <Card className="my-2 mx-auto py-3 px-2 rounded-4" style={{ backgroundColor: "white" }}>
                            <Row className="mx-3">
                                <Col sm={12} className="my-2">
                                    <FormCheck
                                        type="checkbox"
                                        id="checkbox3"
                                        style={lableHeader}
                                        label="Tracking Inventory For This Item"
                                        disabled
                                        checked

                                    />
                                    <span style={lableHeader}>You cannot enable/disable inventory tracking once you've created transactions for this item</span>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup  >
                                        <lable className="fw-bold my-2" style={lableHeader}    >Opening Stock</lable>
                                        <input className="form-control mt-2" type="tel" name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="100" style={inputStyle} />
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup >
                                        <lable className="fw-bold my-2" style={lableHeader}>Opening Stock (Rate Per Unit)</lable>
                                        <InputGroup className="gap-2">
                                            <InputGroupText className="mt-2" style={inputStyle}>₹</InputGroupText>
                                            <input className="form-control mt-2" type="tel" name="stock_rate" 
                                            value={formData.stock_rate}
                                            onChange={handleChange}
                                            placeholder="00.00" style={inputStyle} />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup >
                                        <lable className="fw-bold my-2" style={lableHeader}>Reorder Point</lable>
                                        <FormControl className="form-control mt-2" type="number"
                                         value={formData.reorder_point}
                                         onChange={handleChange}
                                         name="reorder_point" placeholder="000" style={inputStyle} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card>


                        <Card className="my-2 mx-auto py-3 px-2 rounded-4" style={{ backgroundColor: "white" }}>
                            <Row className="my-1 mx-3">
                                <Col sm={3} className="my-2 ">
                                    <lable className="fw-bold my-2" style={lableHeader}>Link with Website</lable>
                                    <div className="form-group mt-4 m-t-15 m-checkbox-inline mb-3 custom-radio-ml">
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



                                <Col sm={5} className=" my-2">
                                    <Row className="">
                                        <Col sm={12} className="my-2">
                                            <FormGroup>
                                                <lable className="fw-bold my-2" style={lableHeader}>
                                                    Gallery Images <span className="text-muted">(You can upload multiple images)</span>
                                                </lable>
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    multiple
                                                    onChange={handleGalleryChange}
                                                    style={{ display: 'none' }}
                                                    id="galleryUpload"
                                                />
                                                <label htmlFor="galleryUpload" style={{ cursor: 'pointer' }}>
                                                    <div
                                                        className="border border-primary p-3 text-center"
                                                        style={{
                                                            borderRadius: '12px',
                                                            background: '#f8f9fa',
                                                            width: 'fit-content',
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        <span className="text-primary fw-semibold">Choose Files</span>
                                                    </div>
                                                </label>
                                            </FormGroup>
                                        </Col>


                                    </Row>
                                </Col><Col sm={4} className="my-2">
                                    {galleryImages.length > 0 &&
                                        galleryImages.map((src, idx) => (
                                            <Col sm={3} key={idx} className="my-2">
                                                <Image
                                                    src={src}
                                                    alt={`gallery-preview-${idx}`}
                                                    fluid
                                                    style={{
                                                        width: '100px',
                                                        aspectRatio: '1',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '1px solid #dee2e6',
                                                    }}
                                                />
                                            </Col>
                                        ))}
                                </Col>

                                <Col sm={12} className="my-4 btn-lg justify-content-end align-items-end" >
                                    <Button variant="primary" type="submit" className=" my-2 float-end" onClick={handleSubmit}>Submit</Button>
                                </Col>
                            </Row>
                        </Card>

                    </Row>
                </Card.Header>
            </Row>

        </Container>

    );
}

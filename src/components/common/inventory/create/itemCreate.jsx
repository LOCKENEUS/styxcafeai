import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Image, InputGroup, Row, Spinner } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus, FaStarOfLife } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Units } from "../modal/units";
import { useDispatch, useSelector } from "react-redux";
import { addItems } from "../../../../store/slices/inventory";
import { Manufacturer } from "../modal/manufacturer";
import { Brand } from "../modal/brand";
import { TaxModal } from "../modal/tax";
import { getTaxFields } from "../../../../store/AdminSlice/TextFieldSlice";
import { getCustomFields } from "../../../../store/AdminSlice/CustomField";
import { getVendors } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import { toast } from "react-toastify";
export const ItemCreate = () => {
    const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showManufacturerModal, setShowManufacturerModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [taxPreference, setTaxPreference] = useState('Taxable');
    const [galleryImages, setGalleryImages] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [galleryFiles, setGalleryFiles] = useState([]); // actual files

    const [superAdminId, setSuperAdminId] = useState('');
    const customFields = useSelector(state => state.customFields.customFields);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // -----------------------   API CALLS ---------------------------
    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setSuperAdminId(parsedUser._id);
        }
    }, []);

    useEffect(() => {
        if (superAdminId) {
            dispatch(getCustomFields(superAdminId));
        }
    }, [dispatch, superAdminId]);

    useEffect(() => {
        if (superAdminId) {
            dispatch(getTaxFields(superAdminId));
        }
    }, [dispatch, superAdminId]);
    useEffect(() => {
        if (superAdminId) {
            dispatch(getVendors(superAdminId));
        }
    }, [dispatch, superAdminId]);

    const taxFieldsList = useSelector((state) => state.taxFieldSlice.taxFields);
    const unitOptions = customFields.filter(field => field.type === "Unit");
    const manufacturerOptions = customFields.filter(field => field.type === "Manufacturer");
    const brandOptions = customFields.filter(field => field.type === "Brand");
    const vendors = useSelector(state => state.vendors.vendors);

    const [formData, setFormData] = useState({
        name: "",
        // hsnCode: "",
        sku: "",
        unitType: "",
        hsnCode: "",
        taxPreference: "Taxable",
        length: "",
        width: "",
        height: "",
        dimension_unit: "",
        weight1: "",
        weight_unit: "",
        manufacturer: "",
        // ean: "",
        brand: "",
        // upc: "",
        // mpn: "",
        cost_price: "",
        selling_price: "",
        vendor: "",
        stock: "",
        stock_rate: "",
        reorder_point: "",
        selectedTax: "",
        cafeSellingPrice: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'taxPreference') {
            setTaxPreference(value);
        }
    }

    const handleTaxPreferenceChange = (e) => {
        setTaxPreference(e.target.value);
    };

    const handleGalleryChange = (e) => {
        const file = e.target.files[0]; // Only one file
        if (file) {
            const preview = URL.createObjectURL(file);
            setGalleryFiles([file]); // Save as array for consistency
            setGalleryImages([preview]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // loder 
        setSubmitLoading(true);
        if (
            formData.name === '' ||
            // formData.sku === '' ||
            formData.unitType === '' ||
            formData.cost_price === '' ||
            formData.selling_price === '' ||
            formData.cafeSellingPrice === ''
        ) {
            setSubmitLoading(false);
            return toast.error('Please fill all the required fields');
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("sku", formData.sku);
            formDataToSend.append("unit", formData.unitType);
            formDataToSend.append("hsn", formData.hsnCode);
            formDataToSend.append("taxable", formData.taxPreference === "Taxable");
            formDataToSend.append("tax", formData.selectedTax);
            formDataToSend.append("length", formData.length);
            formDataToSend.append("width", formData.width);
            formDataToSend.append("height", formData.height);
            formDataToSend.append("dimensionUnit", formData.dimension_unit);
            formDataToSend.append("weight", formData.weight1);
            formDataToSend.append("weightUnit", formData.weight_unit);
            formDataToSend.append("manufacturer", formData.manufacturer);
            formDataToSend.append("brand", formData.brand);
            formDataToSend.append("costPrice", formData.cost_price);
            formDataToSend.append("sellingPrice", formData.selling_price);
            formDataToSend.append("preferredVendor", formData.vendor);
            formDataToSend.append("stock", formData.stock);
            formDataToSend.append("stockRate", formData.stock_rate);
            formDataToSend.append("reorderPoint", formData.reorder_point);
            formDataToSend.append("cafeSellingPrice", formData.cafeSellingPrice);

            // Append images
            galleryFiles.forEach((file) => {
                formDataToSend.append("image", file);
            });

            const response =await dispatch(addItems(formDataToSend));
            navigate("/Inventory/itemDetails", {state:{ groupId: response.payload.data._id }});
            // setSubmitLoading(false);
            // Reset form after successful submission
            setFormData({
                name: "",
                // hsnCode: "",
                sku: "",
                unitType: "",
                hsnCode: "",
                taxPreference: "Taxable",
                length: "",
                width: "",
                height: "",
                dimension_unit: "",
                weight1: "",
                weight_unit: "",
                manufacturer: "",
                // ean: "",
                brand: "",
                // upc: "",
                // mpn: "",
                cost_price: "",
                selling_price: "",
                vendor: "",
                stock: "",
                stock_rate: "",
                reorder_point: "",
                selectedTax: "",
                cafeSellingPrice: "",
                file: null,
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit form.");

        } finally {
            setSubmitLoading(false);
        }
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
                    <Row className="d-flex justify-content-between align-items-center"
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
                                            SKU
                                            {/* <span className="text-danger ms-1">*</span> */}
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
                                                required
                                            >
                                                {/* map unitOptions */}
                                                <option value="" disabled>Select Unit</option>
                                                {unitOptions.map((option, index) => (
                                                    <option key={option._id || index} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}

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
                                        <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} superAdminId={superAdminId} />
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
                                            <option value="Taxable">Taxable</option>
                                            <option value="Non-Taxable">Non-Taxable</option>
                                        </FormSelect>
                                    </FormGroup>
                                </Col>

                                {taxPreference === 'Taxable' && (
                                    <Col sm={4} className="my-2">
                                        <FormGroup>
                                            <label className="fw-bold my-2" style={lableHeader}>
                                                Tax
                                                {/* <span className="text-danger ms-1">*</span> */}
                                            </label>
                                            <InputGroup >
                                                <FormSelect
                                                    aria-label="Select Tax"
                                                    name="selectedTax"
                                                    style={inputStyle}
                                                    defaultValue=""
                                                    value={formData.selectedTax}
                                                    onChange={handleChange}
                                                >
                                                    <option value="" disabled>Select Tax</option>
                                                    {taxFieldsList.map((tax, index) => (
                                                        <option key={tax._id || index} value={tax._id}>
                                                            {tax.tax_name}  ({tax.tax_rate}%)
                                                        </option>
                                                    ))}
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
                                                <TaxModal show={showTaxModal} handleClose={() => setShowTaxModal(false)} superAdminId={superAdminId} />
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                )}

                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>Dimensions</label>
                                        <InputGroup className="gap-2">
                                            <FormControl type="number" name="length" placeholder="Length"
                                                value={formData.length}
                                                onChange={handleChange}
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
                                                style={inputStyle} />
                                            <FormControl type="number" name="width" placeholder="Width"
                                                value={formData.width}
                                                onChange={handleChange}
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
                                                style={inputStyle} />
                                            <FormControl type="number" name="height" placeholder="height"
                                                value={formData.height}
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
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
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
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
                                                <option value="">Select Manufacturer</option>
                                                {/* map manufacturerOptions */}
                                                {manufacturerOptions.map((manufacturer, index) => (
                                                    <option key={manufacturer._id || index} value={manufacturer._id}>
                                                        {manufacturer.name}
                                                    </option>
                                                ))}
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
                                            <Manufacturer show={showManufacturerModal} handleClose={() => setShowManufacturerModal(false)} superAdminId={superAdminId} />
                                        </InputGroup>
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
                                                {brandOptions.map((brand, index) => (
                                                    <option key={brand._id || index} value={brand._id}>
                                                        {brand.name}
                                                    </option>
                                                ))}
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
                                            <Brand show={showBrandModal} handleClose={() => setShowBrandModal(false)} superAdminId={superAdminId} />
                                        </InputGroup>
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
                                                type="number"
                                                name="cost_price"
                                                value={formData.cost_price}
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
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
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
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
                                            Cafe Selling Price <span className="text-danger">*</span>
                                        </label>
                                        <InputGroup className="gap-2">
                                            <InputGroupText style={inputStyle}>₹</InputGroupText>
                                            <FormControl
                                                style={inputStyle}
                                                type="number"
                                                value={formData.cafeSellingPrice}
                                                name="cafeSellingPrice"
                                                placeholder="00.00"
                                                onChange={handleChange}
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>
                                            {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                            Preferrd Vendor
                                            {/* <span className="text-danger ms-1 ">*</span> */}
                                        </label>
                                        <InputGroup>
                                            <FormSelect aria-label="Select Tax" style={inputStyle}
                                                name="vendor"
                                                value={formData.vendor}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Vendor</option>
                                                {vendors.map(vendor => (
                                                    <option key={vendor._id} value={vendor._id}>
                                                        {vendor.name}
                                                    </option>
                                                ))}
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
                                        <input className="form-control mt-2" type="number" name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            onWheel={(e) => e.target.blur()} // Prevents scroll on number input
                                            placeholder="100" style={inputStyle} />
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="my-2">
                                    <FormGroup >
                                        <lable className="fw-bold my-2" style={lableHeader}>Opening Stock (Rate Per Unit)</lable>
                                        <InputGroup className="gap-2">
                                            <InputGroupText className="mt-2" style={inputStyle}>₹</InputGroupText>
                                            <input className="form-control mt-2" name="stock_rate"
                                                type="number"
                                                value={formData.stock_rate}
                                                onChange={handleChange}
                                                onWheel={(e) => e.target.blur()} // Prevents scroll on number input
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
                                            onWheel={(e) => e.target.blur()} // Prevents scroll on number input
                                            name="reorder_point" placeholder="000" style={inputStyle} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card>

                        <Card className="my-2 mx-auto py-3 px-2 rounded-4" style={{ backgroundColor: "white" }}>
                            <Row className="my-1 mx-3">
                                <Col sm={5} className=" my-2">
                                    <Row className="">
                                        <Col sm={12} className="my-2  ">
                                            <FormGroup>
                                                <lable className="fw-bold my-2" style={lableHeader}>
                                                    Gallery Images <span className="text-muted">(Only one image allowed)</span>
                                                </lable>
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleGalleryChange}
                                                    style={{ display: 'none' }}
                                                    id="galleryUpload"
                                                />
                                                <label className="form-control border-0 "
                                                    htmlFor="galleryUpload" style={{ cursor: 'pointer' }}>
                                                    <div
                                                        className="border border-primary p-3 text-center "
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
                                </Col><Col sm={4} className="my-2 d-flex flex-wrap">
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
                                    {/* lodaer setSubmitLoading */}
                                    <Button variant="primary" type="submit" className=" my-2 float-end" onClick={handleSubmit}>
                                        {submitLoading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" /> Saving...
                                            </>
                                        ) : ('Submit')}

                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Row>
                </Card.Header>
            </Row>
        </Container>
    );
}

import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Image, InputGroup, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus, FaStarOfLife, FaTrash } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import {  getItemById, addItem, updateItem } from "../../../../store/AdminSlice/Inventory/ItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import Tax from "../modal/Tax";
import Manufacturer from "../modal/Manufacturer";
import Brand from "../modal/Brand";
import Units from "../modal/Units";
import { getCustomFields, deleteCustomField } from "../../../../store/AdminSlice/CustomField";
import { getTaxFields } from "../../../../store/AdminSlice/TextFieldSlice";
import { getVendors } from "../../../../store/AdminSlice/Inventory/VendorSlice";

const CreateItemsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showManufacturerModal, setShowManufacturerModal] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        unit: '',
        hsnCode: '',
        taxPreference: 'Taxable',
        selectedTax: '',
        length: '',
        width: '',
        height: '',
        dimension_unit: 'cm',
        weight: '',
        weight_unit: 'kg',
        manufacturer: '',
        brand: '',
        mpn: '',
        upc: '',
        ean: '',
        isbn: '',
        costPrice: '',
        sellingPrice: '',
        preferredVendor: '',
        stock: '',
        stock_rate: '',
        reorder_point: '',
        linking: 'N',
        image: null,
    })
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showTaxFields, setShowTaxFields] = useState(true);
    const customFields = useSelector(state => state.customFields.customFields);
    const taxFields = useSelector(state => state.taxFieldSlice.taxFields);
    const cafeId = JSON.parse(sessionStorage.getItem("user"))?._id;
    const vendors = useSelector(state => state.vendors.vendors);
    
    // Organize custom fields by type
    const unitOptions = customFields.filter(field => field.type === "Unit");
    const manufacturerOptions = customFields.filter(field => field.type === "Manufacturer");
    const brandOptions = customFields.filter(field => field.type === "Brand");

    useEffect(() => {
        dispatch(getCustomFields(cafeId));
        dispatch(getTaxFields(cafeId));
        dispatch(getVendors(cafeId));
        
        // Fetch item data when in edit mode
        if (isEditMode) {
            dispatch(getItemById(id))
                .unwrap()
                .then((itemData) => {
                    setFormData({
                        name: itemData.name || '',
                        sku: itemData.sku || '',
                        unit: itemData.unit || '',
                        hsnCode: itemData.hsn || '',
                        taxPreference: itemData.taxable ? 'Taxable' : 'Non-Taxable',
                        selectedTax: itemData.tax || '',
                        length: itemData.length || '',
                        width: itemData.width || '',
                        height: itemData.height || '',
                        dimension_unit: itemData.dimensionUnit || 'cm',
                        weight: itemData.weight || '',
                        weight_unit: itemData.weightUnit || 'kg',
                        manufacturer: itemData.manufacturer || '',
                        brand: itemData.brand || '',
                        mpn: itemData.mpn || '',
                        upc: itemData.upc || '',
                        ean: itemData.ean || '',
                        isbn: itemData.isbn || '',
                        costPrice: itemData.costPrice || '',
                        sellingPrice: itemData.sellingPrice || '',
                        preferredVendor: itemData.preferredVendor || '',
                        stock: itemData.stock || '',
                        stock_rate: itemData.stockRate || '',
                        reorder_point: itemData.reorderPoint || '',
                        linking: itemData.linking || 'N',
                        image: itemData.image || null,
                    });
                    
                    if (itemData.image) {
                        setImagePreview(itemData.image);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching item:", error);
                });
        }
    }, [dispatch, cafeId, id, isEditMode]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData((prev) => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('cafe', cafeId);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('sku', formData.sku);
        formDataToSend.append('unit', formData.unit);
        formDataToSend.append('hsn', parseFloat(formData.hsnCode));
        formDataToSend.append('taxable', formData.taxPreference === 'Taxable');
        formDataToSend.append('tax', parseFloat(formData.selectedTax));
        formDataToSend.append('length', parseFloat(formData.length));
        formDataToSend.append('width', parseFloat(formData.width));
        formDataToSend.append('height', parseFloat(formData.height));
        formDataToSend.append('dimensionUnit', formData.dimension_unit);
        formDataToSend.append('weight', parseFloat(formData.weight));
        formDataToSend.append('weightUnit', formData.weight_unit);
        formDataToSend.append('manufacturer', formData.manufacturer);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('mpn', formData.mpn);
        formDataToSend.append('upc', formData.upc);
        formDataToSend.append('ean', formData.ean);
        formDataToSend.append('isbn', formData.isbn);
        formDataToSend.append('costPrice', parseFloat(formData.costPrice));
        formDataToSend.append('sellingPrice', parseFloat(formData.sellingPrice));
        formDataToSend.append('preferredVendor', formData.preferredVendor);
        formDataToSend.append('stock', parseInt(formData.stock, 10));
        formDataToSend.append('stockRate', parseFloat(formData.stock_rate));
        formDataToSend.append('reorderPoint', parseInt(formData.reorder_point, 10));
        formDataToSend.append('linking', formData.linking);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        formDataToSend.append('is_active', true);
        formDataToSend.append('is_deleted', false);

        try {
            if (isEditMode) {
                // Update existing item
                await dispatch(updateItem({ id, itemData: formDataToSend })).then(() => {
                    navigate(-1);
                });
            } else {
                // Create new item
                await dispatch(addItem(formDataToSend)).then(() => {
                    navigate(-1);
                });
            }
            // navigate('/Inventory/Items');
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'adding'} item:`, error);
            // alert(`Failed to ${isEditMode ? 'update' : 'add'} item. Please try again.`);
        }
    };

    const handleDeleteUnit = (unitId) => {
        dispatch(deleteCustomField(unitId));
    };

    const handleDeleteManufacturer = (manufacturerId) => {
        dispatch(deleteCustomField(manufacturerId));
    };

    const handleDeleteBrand = (brandId) => {
        dispatch(deleteCustomField(brandId));
    };

  return (
    <Container data-aos="fade-up" data-aos-duration="700">
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
                    <BreadcrumbItem active>{isEditMode ? 'Edit Item' : 'Create Item'}</BreadcrumbItem>
                </Breadcrumb>
            </div>

        </Col>
        <Form onSubmit={handleSubmit}>
            {/* <Row> */}
            <Card className="shadow p-4 my-4">
                <Row>
                    <div className="d-flex justify-content-start align-items-start">
                        <h1>{isEditMode ? 'Edit Item' : 'Create New Item'}</h1>
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
                    <label className="fw-bold my-2">
                                {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                Unit
                                <span className="text-danger ms-1 ">*</span>
                            </label>
                        <FormGroup className="d-flex justify-content-between gap-3 align-items-center">
                           
                            <InputGroup>
                                <FormSelect
                                    name="unit"
                                    aria-label="Select unit"
                                    value={formData.unit}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">Select Unit</option>
                                    {unitOptions.map(unit => (
                                        <option key={unit._id} value={unit.name}>
                                            {unit.name} 
                                            <div>
                                            <FaTrash 
                                                className="text-danger ms-2" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteUnit(unit._id);
                                                }}
                                            />

                                            </div>
                                          
                                        </option>
                                    ))}
                                </FormSelect>
                            </InputGroup>
                            <div id="addUnitFieldContainer" />
                            {/* Link to open the modal */}
                            <Button className="d-flex justify-content-end align-items-center"  style={{width:"40px", padding:'12px', border:"1px dashed blue", height:"40px", borderStyle:"dashed"}} variant="outline-secondary" onClick={() => setShowUnitModal(true)}>
                                <FaPlus className="text-primary" size={30} />
                            </Button>
                           

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
                            <input
                                type="number"
                                className="form-control"
                                id="hsnCode"
                                placeholder="HSN Code"
                                value={formData.hsnCode}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">
                                Tax Preference
                                <span className="text-danger ms-1 ">*</span>
                            </label>
                            <FormSelect
                                aria-label="Select Tax Preference"
                                value={formData.taxPreference}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        taxPreference: value,
                                    }));
                                    setShowTaxFields(value !== "Non-Taxable");
                                }}
                            >
                                <option value="Taxable">Taxable</option>
                                <option value="Non-Taxable">Non-Taxable</option>
                            </FormSelect>
                        </FormGroup>
                    </Col>
                    {showTaxFields && (
                    <Col md={6} className="my-2">
                    <label className="fw-bold my-2">
                                {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                Tax
                                <span className="text-danger ms-1 ">*</span>
                            </label>
                   
                        <FormGroup className="d-flex justify-content-between gap-3 align-items-center">
                            <InputGroup>
                                <FormSelect 
                                    aria-label="Select Tax"
                                    value={formData.selectedTax}
                                    onChange={(e) => {
                                        const selectedTax = taxFields.find(tax => tax._id === e.target.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            selectedTax: e.target.value
                                        }));
                                    }}
                                >
                                    <option value="">Select Tax</option>
                                    {taxFields.map(tax => (
                                        <option key={tax._id} value={tax.tax_rate}>
                                            {tax.tax_name} ({tax.tax_rate}%)
                                        </option>
                                    ))}
                                </FormSelect>
                            </InputGroup>
                            <div id="addTaxFieldContainer" />
                            <Button 
                                className="d-flex justify-content-end align-items-center" 
                                style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} 
                                variant="outline-secondary" 
                                onClick={() => setShowTaxModal(true)}
                            >
                                <FaPlus className="text-primary" size={30} />
                            </Button>
                            <Tax show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
                        </FormGroup>
                    </Col>
                    )}

                    <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">Dimensions</label>
                            <InputGroup>
                                <FormControl
                                    type="tel"
                                    id="length"
                                    placeholder="Length"
                                    value={formData.length}
                                    onChange={handleChange}
                                />
                                <FormControl
                                    type="tel"
                                    id="width"
                                    placeholder="Width"
                                    value={formData.width}
                                    onChange={handleChange}
                                />
                                <FormControl
                                    type="tel"
                                    id="height"
                                    placeholder="Height"
                                    value={formData.height}
                                    onChange={handleChange}
                                />
                                <FormSelect
                                    name="dimension_unit"
                                    value={formData.dimension_unit}
                                    onChange={handleSelectChange}
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
                    <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2" htmlFor="weight">Weight</label>
                            <InputGroup>
                                <FormControl
                                    type="tel"
                                    name="weight"
                                    id="weight"
                                    placeholder="Enter weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                />

                                <FormSelect
                                    name="weight_unit"
                                    id="weight_unit"
                                    value={formData.weight_unit}
                                    onChange={handleSelectChange}
                                >
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
                    <label className="fw-bold my-2">
                                {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                Manufacturer

                            </label>
                    <FormGroup className="d-flex justify-content-between gap-3 align-items-center">
                
                            <InputGroup>
                                <FormSelect
                                    name="manufacturer"
                                    aria-label="Select Manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">Select Manufacturer</option>
                                    {manufacturerOptions.map(manufacturer => (
                                        <option key={manufacturer._id} value={manufacturer._id}>
                                            {manufacturer.name}
                                            <FaTrash 
                                                className="text-danger ms-2" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteManufacturer(manufacturer._id);
                                                }}
                                            />
                                        </option>
                                    ))}
                                </FormSelect>
                            </InputGroup>
                            <div id="addTaxFieldContainer" />
                            <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowManufacturerModal(true)}>
                                <FaPlus className="text-primary" size={30} />
                            </Button>
                        </FormGroup>
                        <Manufacturer show={showManufacturerModal} handleClose={() => setShowManufacturerModal(false)} />
                    </Col>


                    <Col md={6} className="my-2">
                    <label className="fw-bold my-2">
                                {/* <FaStarOfLife className="text-danger size-sm" /> */}
                                Brand
                            </label>
                    <FormGroup className="d-flex justify-content-between gap-3 align-items-center">
                  
                            <InputGroup>
                                <FormSelect
                                    name="brand"
                                    aria-label="Select Brand"
                                    value={formData.brand}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">Select Brand</option>
                                    {brandOptions.map(brand => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.name}
                                            <FaTrash 
                                                className="text-danger ms-2" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteBrand(brand._id);
                                                }}
                                            />
                                        </option>
                                    ))}
                                </FormSelect>
                            </InputGroup>
                            <div />
                            <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowBrandModal(true)}>
                                <FaPlus className="text-primary" size={30} />
                            </Button>
                        </FormGroup>
                        <Brand show={showBrandModal} handleClose={() => setShowBrandModal(false)} />
                    </Col>
                    <Col md={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">
                                {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                MPN
                                {/* <span className="text-danger ms-1 ">*</span> */}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="mpn"
                                placeholder="0 0 0 - 0 0 0"
                                value={formData.mpn}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6} className="my-2">
                        <FormGroup>
                            <label  className="fw-bold my-2">
                                {/* <FaStarOfLife className="text-danger size-sm" />  */}
                                UPC
                                {/* <span className="text-danger ms-1 ">*</span> */}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="upc"
                                placeholder="0 0 0 - 0 0 0"
                                value={formData.upc}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Card>


            <Card className="shadow my-4 p-4">
                <Row>
                    <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">
                                Cost Price <span className="text-danger">*</span>
                            </label>
                            <InputGroup>
                                <InputGroupText>₹</InputGroupText>
                                <FormControl
                                    type="tel"
                                    id="costPrice"
                                    placeholder="00.00"
                                    value={formData.costPrice}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col sm={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">
                                Selling Price <span className="text-danger">*</span>
                            </label>
                            <InputGroup>
                                <InputGroupText>₹</InputGroupText>
                                <FormControl
                                    type="tel"
                                    id="sellingPrice"
                                    placeholder="00.00"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>

                    <Col md={6} className="my-2">
                        <FormGroup>
                            <label className="fw-bold my-2">
                                Preferred Vendor <span className="text-danger ms-1">*</span>
                            </label>
                            <InputGroup>
                                <FormSelect
                                    name="preferredVendor"
                                    aria-label="Select Vendor"
                                    value={formData.preferredVendor}
                                    onChange={handleSelectChange}
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
                            <FormControl
                                type="tel"
                                name="stock"
                                placeholder="100"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>

                    <Col sm={6} className="my-2">
                        <FormGroup controlId="stock_rate">
                            <FormLabel>Opening Stock (Rate Per Unit)</FormLabel>
                            <InputGroup>
                                <InputGroupText>₹</InputGroupText>
                                <FormControl
                                    type="tel"
                                    name="stock_rate"
                                    placeholder="00.00"
                                    value={formData.stock_rate}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>

                    <Col sm={6} className="my-2">
                        <FormGroup controlId="reorder_point">
                            <FormLabel>Reorder Point</FormLabel>
                            <FormControl
                                type="tel"
                                name="reorder_point"
                                placeholder="000"
                                value={formData.reorder_point}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Card>





            <Card className="shadow my-4 p-4">
                <Row>
                    {/* <Col sm={3} className="my-2">
                        <FormLabel htmlFor="linking">Link with Website</FormLabel>
                        <div className="form-group m-t-15 m-checkbox-inline mb-3 custom-radio-ml">
                            <FormCheck
                                type="radio"
                                id="radioinline1"
                                name="linking"
                                value="Y"
                                label="Yes"
                                inline
                                checked={formData.linking === 'Y'}
                                onChange={handleChange}
                            />
                            <FormCheck
                                type="radio"
                                id="radioinline2"
                                name="linking"
                                value="N"
                                label="No"
                                inline
                                checked={formData.linking === 'N'}
                                onChange={handleChange}
                            />
                        </div>
                    </Col> */}

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
                            src={`${import.meta.env.VITE_API_URL}/${imagePreview}`} 
                            alt="product image"
                            fluid
                            style={{ width: '100px', aspectRatio: '1', objectFit: 'cover' }}
                            onError={(e) => e.target.src = 'https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg'}
                        />
                    </Col>

                    <Col sm={12} className="my-2 btn-lg">
                        <Button variant="primary" type="submit" className="my-2">
                            {isEditMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button 
                            variant="secondary" 
                            className="my-2 ms-2" 
                            onClick={() => navigate(-1)}
                        >
                            Cancel
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

export default CreateItemsForm

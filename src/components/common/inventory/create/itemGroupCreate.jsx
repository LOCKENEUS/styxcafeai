import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormGroup, FormSelect, InputGroup, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Units } from "../modal/units";
import { TaxModal } from "../modal/tax";
import { Manufacturer } from "../modal/manufacturer";
import { Brand } from "../modal/brand";
import { getCustomFields } from "../../../../store/AdminSlice/CustomField";
import { getTaxFields } from "../../../../store/AdminSlice/TextFieldSlice";
import { useDispatch, useSelector } from "react-redux";
import { addItemsGroups } from "../../../../store/slices/inventory";
import { toast } from "react-toastify";

export const IitemGroupCreate = () => {
    const [attributes, setAttributes] = useState([{ name: '', options: '' }]);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showManufacturerModal, setShowManufacturerModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [taxPreference, setTaxPreference] = useState('Taxable');
    const [superAdminId, setSuperAdminId] = useState('');
    const [names, setNames] = useState(['']);
    const [options, setOptions] = useState(['']);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        group_name: '',
        unitType: '',
        taxPreference: 'Taxable',
        tax: '',
        manufacturer: '',
        brand: '',
        description: '',
        items: [],


    })
    const generateSKU = (groupName, itemName, attribute, index) => {
        if (!groupName) return '';
        const groupInitial = groupName.charAt(0).toUpperCase();
        const attributeInitial = attribute.charAt(0).toUpperCase();
        return `${groupInitial}${attributeInitial}-${String(index + 1).padStart(3, '0')}`;
    };


    const dispatch = useDispatch();

    useEffect(() => {
        const userData = localStorage.getItem("user");
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


    const customFields = useSelector(state => state.customFields.customFields);
    const taxFieldsList = useSelector((state) => state.taxFieldSlice.taxFields);

    const unitOptions = customFields.filter(field => field.type === "Unit");
    const manufacturerOptions = customFields.filter(field => field.type === "Manufacturer");
    const brandOptions = customFields.filter(field => field.type === "Brand");

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

    const handleAttributeChange = (index, field, value) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const addRow = () => {
        setAttributes([...attributes, { name: "", options: "" }]);
    };

    const handleNameChange = (index, value) => {
        const updated = [...names];
        updated[index] = value;
        setNames(updated);
    };

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };
    const handleCopyToAll = (field, sourceIndex = 0) => {
        const valueToCopy = formData.items[sourceIndex]?.[field] || '';

        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item) => ({
                ...item,
                [field]: valueToCopy,
            })),
        }));
    };
    const removeRow = (index) => {
        if (attributes.length > 1) {
            const newAttributes = [...attributes];
            newAttributes.splice(index, 1);
            setAttributes(newAttributes);
        }
    };

    const handleGenerateSKU = () => {
        const items = generateItems(); // Always regenerate based on latest attributes
        const updatedItems = items.map((item, index) => {
            const attribute = attributes.find((attr) =>
                item.name.includes(attr.name)
            );
            const generatedSKU = generateSKU(
                formData.group_name,
                item.name,
                attribute?.name || "",
                index
            );
            return {
                ...item,
                sku: generatedSKU,
            };
        });

        setFormData((prev) => ({
            ...prev,
            items: updatedItems,
        }));
    };


    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        // Create the item if it doesn't exist
        if (!updatedItems[index]) {
            updatedItems[index] = {};
        }
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            items: updatedItems
        }));
    };

    const generateItems = () => {
        const items = [];
        let globalIndex = 0;

        attributes.forEach((attribute, attrIndex) => {
            const options = attribute.options.split(",").map((option) => option.trim());
            options.forEach((option, optIndex) => {
                const itemIndex = attributes
                    .slice(0, attrIndex)
                    .reduce(
                        (acc, attr) => acc + attr.options.split(",").length,
                        0
                    ) + optIndex;

                const itemName = `${formData.group_name} ${attribute.name} ${option}`;
                // Auto-generate SKU directly
                const sku = generateSKU(formData.group_name, itemName, attribute.name, itemIndex);

                const item = {
                    name: itemName,
                    sku: sku || "", // Do not generate SKU by default
                    hsn: formData.items[itemIndex]?.hsn || "",
                    unit: formData.unit,
                    taxable: formData.taxable,
                    manufacturer: formData.manufacturer,
                    brand: formData.brand,
                    costPrice: formData.items[itemIndex]?.costPrice || 0,
                    sellingPrice: formData.items[itemIndex]?.sellingPrice || 0,
                    stock: formData.items[itemIndex]?.stock || 0,
                    upc: formData.items[itemIndex]?.upc || "",
                    ean: formData.items[itemIndex]?.ean || "",
                    isbn: formData.items[itemIndex]?.isbn || "",
                    cafe: superAdminId,
                };
                items.push(item);
            });
        });
        return items;
    };
    const handleChangeItem = (index, field, value) => {
        const updated = [...attributes];
        updated[index][field] = value;
        setAttributes(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        // Basic validation
        if (
            !formData.group_name.trim() ||
            !formData.unitType.trim() ||
            formData.items.length === 0
        ) {
            setSubmitLoading(false);
            return toast.error('Please fill all the required fields');
        }

        try {
            const payload = {
                group_name: formData.group_name.trim(),
                unit: formData.unitType.trim(),
                taxable: formData.taxPreference === "Taxable",
                tax: formData.tax ? formData.tax : null, // Avoid sending empty string
                manufacturer: formData.manufacturer?.trim() || null,
                brand: formData.brand?.trim() || null,
                items: formData.items
            };

            await dispatch(addItemsGroups(payload)).unwrap();
        } catch (error) {
            toast.error('Submission failed');
        } finally {
            setSubmitLoading(false);
        }
    };


    useEffect(() => {
        const items = generateItems();

        setFormData((prev) => ({
            ...prev,
            items: items,
        }));
    }, [attributes, formData.group_name, formData.unit, formData.taxable, formData.manufacturer, formData.brand]);

    //   useEffect(() => {
    //     const items = generateItems();
    //     const updatedItems = items.map((item, index) => {
    //       const attribute = attributes.find(attr => item.name.includes(attr.name));
    //       const generatedSKU = generateSKU(
    //         formData.group_name,
    //         item.name,
    //         attribute?.name || '',
    //         index
    //       );
    //       return {
    //         ...item,
    //         sku: generatedSKU,
    //       };
    //     });

    //     setFormData(prev => ({
    //       ...prev,
    //       items: updatedItems,
    //     }));
    //   }, [attributes, formData.group_name]);

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

                    <Form onSubmit={handleSubmit}>


                        <Card className="shadow p-4 my-4">

                            <div className="d-flex justify-content-start align-items-start">
                                <h1 className="text-center mx-2 mt-2">Create New Item Group </h1>
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
                                            id="group_name"
                                            name="group_name"
                                            placeholder="Enter item group name"
                                            value={formData.group_name}
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
                                                value={formData.unitType}
                                                onChange={handleChange}

                                            >
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
                                                    border: "1px double #E5EFFF",
                                                }}
                                            >
                                                <FaPlus />
                                            </Button>
                                            <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} superAdminId={superAdminId} />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col md={4} className="my-2  px-4">
                                    <FormGroup>
                                        <label className="fw-bold my-2" style={lableHeader}>

                                            Tax Preference
                                            {/* <span className="text-danger ms-1 ">*</span> */}
                                        </label>
                                        <FormSelect
                                            aria-label="Select Tax Preference"
                                            name="taxPreference"
                                            value={formData.taxPreference}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="Taxable">Taxsaple</option>
                                            <option value="Non-Taxable">Not Tax</option>
                                        </FormSelect>
                                    </FormGroup>
                                </Col>
                                {taxPreference === 'Taxable' && (
                                    <Col sm={4} className="my-2  px-4">
                                        <FormGroup>
                                            <label className="fw-bold my-2" style={lableHeader}>
                                                Tax
                                                {/* <span className="text-danger ms-1">*</span> */}
                                            </label>
                                            <InputGroup>
                                                <FormSelect
                                                    aria-label="Select Tax"
                                                    name="tax"
                                                    style={inputStyle}
                                                    value={formData.tax}
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
                                                        border: "1px double #E5EFFF",
                                                    }}
                                                >
                                                    <FaPlus />
                                                </Button>
                                                <TaxModal show={showTaxModal} handleClose={() => setShowTaxModal(false)} superAdminId={superAdminId} />
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
                                            <FormSelect aria-label="Select Tax" name="manufacturer" style={inputStyle}
                                                value={formData.manufacturer} onChange={handleChange}
                                            >
                                                <option value="" disabled>Select Manufacturer</option>
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
                                                value={formData.brand}
                                                onChange={handleChange}
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
                                                    border: "1px double #E5EFFF",
                                                }}>
                                                <FaPlus />
                                            </Button>
                                            <Brand show={showBrandModal} handleClose={() => setShowBrandModal(false)} superAdminId={superAdminId} />
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
                                            value={formData.description} onChange={handleChange}
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
                                        <span className="text-danger ms-1">*</span>
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
                                                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
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
                                                    onChange={(e) => handleAttributeChange(index, 'options', e.target.value)}
                                                    style={inputStyle}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm={4}>
                                            <InputGroup>
                                                <Button variant="outline-primary" className="p-3 rounded-2" onClick={addRow}
                                                    disabled={attributes.length >= 3}
                                                >
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

                            <Col sm={12} className="my-2 px-4" >

                                {attributes.some(attr => attr.name || attr.options) && (
                                    <div className="col-sm-12 mb-3" id="tableDiv" style={{ zoom: 0.9, overflowX: 'auto' }}>
                                        <table className="table table-sm table-border table-border-vertical table-hover" >
                                            <thead className="bg-light " style={{ border: '2px solid #E5EFFF' }} >
                                                <tr>
                                                    <th className="border-2 border-end" nowrap="" style={lableHeader}>SN</th>
                                                    <th className="border-2 border-end" nowrap="" style={lableHeader}>Item name</th>
                                                    <th style={lableHeader} nowrap="" className="px-1">
                                                        HSN<br />
                                                        <span
                                                            type="button"
                                                            className="text-primary"
                                                            onClick={() => handleCopyToAll('hsn')}
                                                        >
                                                            (Copy to All)
                                                        </span>
                                                    </th>
                                                    <th style={lableHeader} nowrap="" className="px-1 border-2 border-end">SKU<br />
                                                        <span
                                                            type="button"
                                                            className="text-primary"
                                                            onClick={handleGenerateSKU}
                                                        >(Generate SKU)</span>
                                                    </th>
                                                    <th style={lableHeader} nowrap="" className="px-1  border-2 border-end">
                                                        Cost Price<br />
                                                        <span
                                                            type="button"
                                                            className="text-primary"
                                                            onClick={() => handleCopyToAll('costPrice')}
                                                        >
                                                            (Copy to All)
                                                        </span>
                                                    </th>
                                                    <th style={lableHeader} nowrap="" className="px-1  border-2 border-end">
                                                        Selling Price<br />
                                                        <span
                                                            type="button"
                                                            className="text-primary"
                                                            onClick={() => handleCopyToAll('sellingPrice')}
                                                        >
                                                            (Copy to All)
                                                        </span>
                                                    </th>
                                                    <th className="border-2 border-end" style={lableHeader}>UPC</th>
                                                    <th className="border-2 border-end" style={lableHeader}>EAN</th>
                                                    <th className="border-2 border-end" style={lableHeader}>ISBN</th>
                                                    <th style={lableHeader} nowrap="" className="px-1 ">
                                                        Opening Stock<br />
                                                        <span
                                                            type="button"
                                                            className="text-primary"
                                                            onClick={() => handleCopyToAll('stock')}
                                                        >
                                                            (Copy to All)
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody id="table-body">
                                                {attributes.map((attribute, attrIndex) => {
                                                    const options = attribute.options.split(',').map(option => option.trim());
                                                    return options.map((option, optIndex) => {
                                                        const itemIndex = attributes.slice(0, attrIndex).reduce(
                                                            (acc, attr) => acc + attr.options.split(',').length,
                                                            0
                                                        ) + optIndex;

                                                        const itemName = `${formData.group_name} ${attribute.name} ${option}`;
                                                        const sku = generateSKU(formData.group_name, itemName, attribute.name, itemIndex);

                                                        return (
                                                            <tr key={`${attrIndex}-${optIndex}`}>
                                                                <td>{rowIndex++}</td>
                                                                <td>
                                                                    <b>{itemName}</b>
                                                                    <input type="hidden" name="item_name[]" value={itemName} />
                                                                </td>
                                                                <td className="px-1">
                                                                    <input
                                                                        type="number"
                                                                        name="item_hsn[]"
                                                                        className="form-control hsn"

                                                                        value={formData.items[itemIndex]?.hsn || ''}
                                                                        onChange={(e) => handleItemChange(itemIndex, 'hsn', e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className="px-1">
                                                                    <input
                                                                        type="text"
                                                                        name="item_sku[]"
                                                                        className="form-control sku"
                                                                        placeholder="SKU"
                                                                        style={{ width: '120px' }}
                                                                        value={formData.items[itemIndex]?.sku}
                                                                        onChange={(e) => handleItemChange(itemIndex, 'sku', e.target.value)}
                                                                    />
                                                                </td>
                                                                <td
                                                                    className="px-1"><input
                                                                        value={formData?.items?.[itemIndex]?.costPrice}
                                                                        type="number" name="item_cost[]" className="form-control cost-price" required placeholder="Cost Price" style={{ width: '120px' }}
                                                                        onChange={(e) => handleItemChange(itemIndex, 'costPrice', e.target.value)}
                                                                    /></td>
                                                                <td
                                                                    className="px-1"><input
                                                                        required
                                                                        type="number"
                                                                        value={formData?.items?.[itemIndex]?.sellingPrice}
                                                                        name="item_price[]" className="form-control selling-price" placeholder="Selling Price" style={{ width: '120px' }}
                                                                        onChange={(e) => handleItemChange(itemIndex, 'sellingPrice', e.target.value)}
                                                                    /></td>
                                                                <td
                                                                    className="px-1"><input

                                                                        type="number"
                                                                        value={formData?.items?.[itemIndex]?.upc}
                                                                        name="item_upc[]" className="form-control" placeholder="UPC" style={{ width: '120px' }}
                                                                        onChange={(e) => handleItemChange(itemIndex, 'upc', e.target.value)}
                                                                    /></td>
                                                                <td
                                                                    className="px-1"><input

                                                                        value={formData?.items?.[itemIndex]?.ean}
                                                                        type="number" name="item_ean[]" className="form-control" placeholder="EAN" style={{ width: '120px' }}
                                                                        onChange={(e) => handleItemChange(itemIndex, 'ean', e.target.value)}
                                                                    /></td>
                                                                <td
                                                                    className="px-1"><input type="number"

                                                                        value={formData?.items?.[itemIndex]?.isbn}
                                                                        name="item_isbn[]" className="form-control" placeholder="ISBN" style={{ width: '120px' }}
                                                                        onChange={(e) => handleItemChange(itemIndex, 'isbn', e.target.value)}
                                                                    /></td>
                                                                <td className="px-1"><input

                                                                    value={formData?.items?.[itemIndex]?.stock}
                                                                    type="number" name="item_stock[]" className="form-control stock" placeholder="Opening Stock" style={{ width: '120px' }}
                                                                    onChange={(e) => handleItemChange(itemIndex, 'stock', e.target.value)}
                                                                /></td>
                                                            </tr>
                                                        );
                                                    });
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                            </Col>
                            <Col sm={12} className="my-4 btn-lg justify-content-end align-items-end">
                                <Button variant="primary" type="submit" className="mt-4 btn-lg rounded-2 float-end">
                                    {submitLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" /> Saving...
                                        </>
                                    ) : ('Submit')}
                                </Button>
                            </Col>
                        </Card>
                    </Form>
                </Row>
            </Card.Header>
        </Container>

    );
};
import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, InputGroup, Modal, Container, BreadcrumbItem, Breadcrumb, Alert } from "react-bootstrap";
import { BiPlus, BiTrash } from "react-icons/bi";
import { FaPlus, FaTrash } from "react-icons/fa";
import Units from "../modal/Units";
import Tax from "../modal/Tax";
import Manufacturer from "../modal/Manufacturer";
import Brand from "../modal/Brand";
import { useDispatch, useSelector } from 'react-redux';
import { addItemGroup, getItemGroupById, updateItemGroup } from '../../../../store/AdminSlice/Inventory/ItemGroupSlice';
import { getCustomFields, deleteCustomField } from '../../../../store/AdminSlice/CustomField';
import { getTaxFields } from '../../../../store/AdminSlice/TextFieldSlice';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../../../components/common/Breadcrumbs/Breadcrumbs";
import { toast } from "react-toastify";

const ItemGroupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the ID from URL params for editing
  const isEditMode = Boolean(id);

  // Add loading state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const customFields = useSelector((state) => state.customFields.customFields);
  const taxFields = useSelector(state => state.taxFieldSlice.taxFields);
  const selectedItemGroup = useSelector(state => state.itemGroups.selectedItemGroup);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [taxable, setTaxable] = useState("Y");
  const [attributes, setAttributes] = useState([{ color: "", options: "" }]);
  const [taxPreference, setTaxPreference] = useState("Taxable");
  const [itemGroupName, setItemGroupName] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const cafeId = user?._id;

  const [formData, setFormData] = useState({
    group_name: '',
    unit: '',
    taxable: taxPreference === 'Taxable',
    tax: null,
    manufacturer: '',
    brand: '',
    description: '',
    items: [],
    cafe: cafeId
  });

  let rowIndex = 1; // Initialize a counter for the rows

  // Organize custom fields by type
  const units = customFields.filter(field => field.type === "Unit");
  const manufacturers = customFields.filter(field => field.type === "Manufacturer");
  const brands = customFields.filter(field => field.type === "Brand");

  // Add new state for latest created items
  const [latestCreatedUnit, setLatestCreatedUnit] = useState(null);
  const [latestCreatedManufacturer, setLatestCreatedManufacturer] = useState(null);
  const [latestCreatedBrand, setLatestCreatedBrand] = useState(null);
  const [latestCreatedTax, setLatestCreatedTax] = useState(null);

  useEffect(() => {
    const cafeId = JSON.parse(localStorage.getItem("user"))?._id;
    dispatch(getCustomFields(cafeId));
    dispatch(getTaxFields(cafeId));

    // If in edit mode, fetch the item group data
    if (isEditMode) {
      dispatch(getItemGroupById(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    const items = generateItems();
    setFormData((prev) => ({
      ...prev,
      items,
    }));
  }, [attributes, formData.group_name, formData.unit, formData.taxable, formData.manufacturer, formData.brand]);

  // Populate form when selectedItemGroup changes (for edit mode)
  useEffect(() => {
    if (isEditMode && selectedItemGroup) {
      setFormData({
        group_name: selectedItemGroup.group_name || '',
        unit: selectedItemGroup.unit || '',
        taxable: selectedItemGroup.taxable || false,
        tax: selectedItemGroup.tax ? selectedItemGroup.tax._id : null,
        manufacturer: selectedItemGroup.manufacturer ? selectedItemGroup.manufacturer._id : undefined,
        brand: selectedItemGroup.brand ? selectedItemGroup.brand._id : undefined,
        description: selectedItemGroup.description || '',
        items: selectedItemGroup.items || [],
        cafe: cafeId
      });

      // Set tax preference based on taxable value
      setTaxPreference(selectedItemGroup.taxable ? 'Taxable' : 'Non-Taxable');

      // Reconstruct attributes from items
      if (selectedItemGroup.items && selectedItemGroup.items.length > 0) {
        const reconstructedAttributes = selectedItemGroup.items.reduce((acc, item) => {
          const [groupName, color, ...options] = item.name.split(' ');
          const optionString = options.join(' ');
          const existingAttribute = acc.find(attr => attr.color === color);

          if (existingAttribute) {
            existingAttribute.options = `${existingAttribute.options}, ${optionString}`.trim();
          } else {
            acc.push({ color, options: optionString });
          }
          return acc;
        }, []);
        setAttributes(reconstructedAttributes);
      }
    }
  }, [selectedItemGroup, isEditMode, cafeId]);

  // Add new useEffect hooks to handle latest created items
  useEffect(() => {
    if (customFields.length > 0 && latestCreatedUnit && latestCreatedUnit.type === 'Unit') {
      const latestUnit = customFields.find(field => field._id === latestCreatedUnit.id);
      if (latestUnit) {
        setFormData(prev => ({ ...prev, unit: latestUnit.name }));
      }
    }
  }, [customFields, latestCreatedUnit]);

  useEffect(() => {
    if (customFields.length > 0 && latestCreatedManufacturer && latestCreatedManufacturer.type === 'Manufacturer') {
      const latestManufacturer = customFields.find(field => field._id === latestCreatedManufacturer.id);
      if (latestManufacturer) {
        setFormData(prev => ({ ...prev, manufacturer: latestManufacturer._id }));
      }
    }
  }, [customFields, latestCreatedManufacturer]);

  useEffect(() => {
    if (customFields.length > 0 && latestCreatedBrand && latestCreatedBrand.type === 'Brand') {
      const latestBrand = customFields.find(field => field._id === latestCreatedBrand.id);
      if (latestBrand) {
        setFormData(prev => ({ ...prev, brand: latestBrand._id }));
      }
    }
  }, [customFields, latestCreatedBrand]);


  useEffect(() => {
    if (taxFields.length > 0 && latestCreatedTax) {
      const latestTax = taxFields.find(tax => tax._id === latestCreatedTax.id);
      if (latestTax) {
        setFormData(prev => ({
          ...prev,
          tax: latestTax._id
        }));
      }
    }
  }, [taxFields, latestCreatedTax]);

  const handleDeleteUnit = (unitId) => {
    dispatch(deleteCustomField(unitId));
  };

  const handleDeleteManufacturer = (manufacturerId) => {
    dispatch(deleteCustomField(manufacturerId));
  };

  const handleDeleteBrand = (brandId) => {
    dispatch(deleteCustomField(brandId));
  };

  const addAttribute = () => {
    setAttributes([...attributes, { color: "", options: "" }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
    
    // Clear validation error for this field
    if (errors[`attribute_${index}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`attribute_${index}_${field}`]: null
      }));
    }
  };

  const removeAttribute = (index) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'taxPreference' ? value === 'Taxable' : value
    }));
    
    // Clear validation error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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
    
    // Clear validation error for this field
    if (errors[`item_${index}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`item_${index}_${field}`]: null
      }));
    }
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

  const generateSKU = (groupName, itemName, attribute, index) => {
    if (!groupName) return '';
    const groupInitial = groupName.charAt(0).toUpperCase();
    const attributeInitial = attribute.charAt(0).toUpperCase();
    return `${groupInitial}${attributeInitial}-${String(index + 1).padStart(3, '0')}`;
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

        const itemName = `${formData.group_name} ${attribute.color} ${option}`;

        const item = {
          name: itemName,
          sku: formData.items[itemIndex]?.sku || "", // Do not generate SKU by default
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
          cafe: cafeId,
        };
        items.push(item);
      });
    });
    return items;
  };

  const handleGenerateSKU = () => {
    const updatedItems = formData.items.map((item, index) => {
      const attribute = attributes.find((attr) =>
        item.name.includes(attr.color)
      );
      const generatedSKU = generateSKU(
        formData.group_name,
        item.name,
        attribute?.color || "",
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

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate group name
    if (!formData.group_name || formData.group_name.trim() === '') {
      newErrors.group_name = 'Item group name is required';
    }

    // Validate unit
    if (!formData.unit) {
      newErrors.unit = 'Please select a unit';
    }

    // Validate attributes
    attributes.forEach((attr, index) => {
      if (!attr.color || attr.color.trim() === '') {
        newErrors[`attribute_${index}_color`] = 'Attribute name is required';
      }
      if (!attr.options || attr.options.trim() === '') {
        newErrors[`attribute_${index}_options`] = 'Options are required';
      }
    });

    // Validate items (cost price and selling price)
    formData.items.forEach((item, index) => {
      if (!item.costPrice || item.costPrice <= 0) {
        newErrors[`item_${index}_costPrice`] = 'Cost price is required and must be greater than 0';
      }
      if (!item.sellingPrice || item.sellingPrice <= 0) {
        newErrors[`item_${index}_sellingPrice`] = 'Selling price is required and must be greater than 0';
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Show user-friendly error message
      const errorMessages = Object.values(validationErrors);
      const firstError = errorMessages[0];
      toast.error(firstError || 'Please fill all required fields correctly');
      
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    let items = generateItems();

    if (isEditMode && selectedItemGroup) {
      items = items.map((item, index) => ({
        ...item,
        _id: selectedItemGroup.items[index]?._id || item._id,
      }));
    }

    const submitData = {
      ...formData,
      items
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await dispatch(updateItemGroup({ id, itemGroupData: submitData })).unwrap();
        toast.success('Item group updated successfully!');
      } else {
        await dispatch(addItemGroup(submitData)).unwrap();
        toast.success('Item group created successfully!');
      }
      // Redirect to Item Group List
      navigate('/admin/inventory/item-group-list');
    } catch (error) {
      console.error('Failed to save item group:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to save item group';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Breadcrumbs
        items={[
          { label: "Home", path: "/admin/dashboard" },
          { label: "Item Group List", path: "/admin/inventory/item-group-list" },
          { label: isEditMode ? "Edit" : "Create", active: true }
        ]}
      />
      <Card className="shadow p-4">
        <div className="d-flex justify-content-start align-items-start">
          <h1>{isEditMode ? 'Edit Item Group' : 'Create New Item Group'}</h1>
        </div>
        
        {errors.submit && (
          <Alert variant="danger" dismissible onClose={() => setErrors(prev => ({ ...prev, submit: null }))}>
            {errors.submit}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold">Item Group Name<span className="text-danger ms-1">*</span></Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="group_name"
                  placeholder="Enter item group name"
                  value={formData.group_name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.group_name}
                />
                {errors.group_name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.group_name}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold">Unit<span className="text-danger ms-1">*</span></Form.Label>
                <div className="d-flex gap-2">
                  <Form.Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    isInvalid={!!errors.unit}
                    className="flex-grow-1"
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit._id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Button 
                    style={{ width: "40px", height: "38px", padding: '0', border: "1px solid blue", borderStyle: "dashed" }} 
                    variant="outline-secondary" 
                    onClick={() => setShowUnitModal(true)}
                  >
                    <FaPlus className="text-primary" size={20} />
                  </Button>
                </div>
                {errors.unit && (
                  <div className="text-danger small mt-1">
                    {errors.unit}
                  </div>
                )}
              </Form.Group>
              <Units
                show={showUnitModal}
                handleClose={() => setShowUnitModal(false)}
                onCreated={(unitData) => setLatestCreatedUnit({ ...unitData, type: 'Unit' })}
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold">Tax Preference</Form.Label>
                <Form.Select
                  name="taxPreference"
                  value={taxPreference}
                  onChange={(e) => {
                    setTaxPreference(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      taxable: e.target.value === 'Taxable'
                    }));
                  }}
                >
                  <option value="Taxable">Taxable</option>
                  <option value="Non-Taxable">Non-Taxable</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {formData.taxable && (
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-bold">Tax</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Select
                      aria-label="Select Tax"
                      name="tax"
                      value={formData.tax || ''}
                      onChange={handleInputChange}
                      className="flex-grow-1"
                    >
                      <option value="">Select Tax</option>
                      {taxFields.map(tax => (
                        <option key={tax._id} value={tax._id}>
                          {tax.tax_name} ({tax.tax_rate}%)
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      style={{ width: "40px", height: "38px", padding: '0', border: "1px solid blue", borderStyle: "dashed" }}
                      variant="outline-secondary"
                      onClick={() => setShowTaxModal(true)}
                    >
                      <FaPlus className="text-primary" size={20} />
                    </Button>
                  </div>
                </Form.Group>
                <Tax
                  show={showTaxModal}
                  handleClose={() => setShowTaxModal(false)}
                  onCreated={(taxData) => setLatestCreatedTax(taxData)}
                />
              </Col>
            )}
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold">Manufacturer</Form.Label>
                <div className="d-flex gap-2">
                    <Form.Select
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="flex-grow-1"
                    >
                      <option value="">Select Manufacturer</option>
                      {manufacturers.map((manufacturer) => (
                        <option key={manufacturer._id} value={manufacturer._id}>
                          {manufacturer.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Button 
                      style={{ width: "40px", height: "38px", padding: '0', border: "1px solid blue", borderStyle: "dashed" }} 
                      variant="outline-secondary" 
                      onClick={() => setShowManufacturerModal(true)}
                    >
                      <FaPlus className="text-primary" size={20} />
                    </Button>
                  </div>
              </Form.Group>
              <Manufacturer
                show={showManufacturerModal}
                handleClose={() => setShowManufacturerModal(false)}
                onCreated={(manufacturerData) => setLatestCreatedManufacturer({ ...manufacturerData, type: 'Manufacturer' })}
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold">Brand</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="flex-grow-1"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Button 
                    style={{ width: "40px", height: "38px", padding: '0', border: "1px solid blue", borderStyle: "dashed" }} 
                    variant="outline-secondary" 
                    onClick={() => setShowBrandModal(true)}
                  >
                    <FaPlus className="text-primary" size={20} />
                  </Button>
                </div>
              </Form.Group>
              <Brand
                show={showBrandModal}
                handleClose={() => setShowBrandModal(false)}
                onCreated={(brandData) => setLatestCreatedBrand({ ...brandData, type: 'Brand' })}
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  value={formData.description}
                  onChange={handleInputChange}
                  as="textarea" 
                  placeholder="Enter description" 
                  name="description" 
                  rows={3} 
                />
              </Form.Group>
            </Col>
            <Col xs={12} className="my-4">
              <div>
                <label className="fw-bold mb-2">Multiple Items? Create Attributes and Options <span className="text-danger ms-1">*</span></label>
                {attributes.map((attribute, index) => (
                  <div key={index} className="mb-2 row">
                    <div className="col-md-4">
                      <Form.Control
                        placeholder="e.g: Color"
                        type="text"
                        value={attribute.color}
                        onChange={(e) => handleAttributeChange(index, "color", e.target.value)}
                        disabled={isEditMode}
                        required
                        isInvalid={!!errors[`attribute_${index}_color`]}
                      />
                      {errors[`attribute_${index}_color`] && (
                        <div className="text-danger small mt-1">
                          {errors[`attribute_${index}_color`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <Form.Control
                        placeholder="e.g: Red, Black"
                        type="text"
                        value={attribute.options}
                        onChange={(e) => handleAttributeChange(index, "options", e.target.value)}
                        disabled={isEditMode}
                        required
                        isInvalid={!!errors[`attribute_${index}_options`]}
                      />
                      {errors[`attribute_${index}_options`] && (
                        <div className="text-danger small mt-1">
                          {errors[`attribute_${index}_options`]}
                        </div>
                      )}
                    </div>
                    <div className="col-sm-4">
                      {!isEditMode && (
                        <Button type="button" variant="danger" onClick={() => removeAttribute(index)}>

                          <BiTrash />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {!isEditMode && (
                  <Button type="button" className="ms-4 mt-3" onClick={addAttribute}>
                    <BiPlus /> Add Attribute
                  </Button>
                )}
              </div>
            </Col>

            {/* Conditionally render the table if there are attributes */}
            {attributes.some(attr => attr.color || attr.options) && (
              <Col xs={12} className="mb-3" id="tableDiv" style={{ zoom: 0.9, overflowX: 'auto' }}>
                <table className="table table-sm table-border table-border-vertical table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th>SN</th>
                      <th nowrap="">Item name</th>
                      <th nowrap="" className="px-1">
                        HSN<br />
                        <span
                          type="button"
                          className="text-primary"
                          onClick={() => handleCopyToAll('hsn')}
                        >
                          (Copy to All)
                        </span>
                      </th>
                      <th nowrap="" className="px-1">SKU<br />
                        <span
                          type="button"
                          className="text-primary"
                          onClick={handleGenerateSKU}
                        >(Generate SKU)</span>
                      </th>
                      <th nowrap="" className="px-1">
                        Cost Price<span className="text-danger">*</span><br />
                        <span
                          type="button"
                          className="text-primary"
                          onClick={() => handleCopyToAll('costPrice')}
                        >
                          (Copy to All)
                        </span>
                      </th>
                      <th nowrap="" className="px-1">
                        Selling Price<span className="text-danger">*</span><br />
                        <span
                          type="button"
                          className="text-primary"
                          onClick={() => handleCopyToAll('sellingPrice')}
                        >
                          (Copy to All)
                        </span>
                      </th>
                      <th>UPC</th>
                      <th>EAN</th>
                      <th>ISBN</th>
                      <th nowrap="" className="px-1">
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

                        const itemName = `${formData.group_name} ${attribute.color} ${option}`;
                        const sku = generateSKU(formData.group_name, itemName, attribute.color, itemIndex);

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
                                type="number" 
                                name="item_cost[]" 
                                className={`form-control cost-price ${errors[`item_${itemIndex}_costPrice`] ? 'is-invalid' : ''}`}
                                required 
                                placeholder="Cost Price" 
                                style={{ width: '120px' }}
                                onChange={(e) => handleItemChange(itemIndex, 'costPrice', e.target.value)}
                                onWheel={(e) => e.target.blur()}
                              />
                              {errors[`item_${itemIndex}_costPrice`] && (
                                <div className="invalid-feedback d-block">
                                  {errors[`item_${itemIndex}_costPrice`]}
                                </div>
                              )}
                            </td>
                            <td
                              className="px-1"><input
                                required
                                type="number"
                                value={formData?.items?.[itemIndex]?.sellingPrice}
                                name="item_price[]" 
                                className={`form-control selling-price ${errors[`item_${itemIndex}_sellingPrice`] ? 'is-invalid' : ''}`}
                                placeholder="Selling Price" 
                                style={{ width: '120px' }}
                                onChange={(e) => handleItemChange(itemIndex, 'sellingPrice', e.target.value)}
                                onWheel={(e) => e.target.blur()}
                              />
                              {errors[`item_${itemIndex}_sellingPrice`] && (
                                <div className="invalid-feedback d-block">
                                  {errors[`item_${itemIndex}_sellingPrice`]}
                                </div>
                              )}
                            </td>
                            <td
                              className="px-1"><input

                                type="number"
                                value={formData?.items?.[itemIndex]?.upc}
                                name="item_upc[]" className="form-control" placeholder="UPC" style={{ width: '120px' }}
                                onChange={(e) => handleItemChange(itemIndex, 'upc', e.target.value)}
                                onWheel={(e) => e.target.blur()}
                              /></td>
                            <td
                              className="px-1"><input

                                value={formData?.items?.[itemIndex]?.ean}
                                type="number" name="item_ean[]" className="form-control" placeholder="EAN" style={{ width: '120px' }}
                                onChange={(e) => handleItemChange(itemIndex, 'ean', e.target.value)}
                                onWheel={(e) => e.target.blur()}
                              /></td>
                            <td
                              className="px-1"><input type="number"

                                value={formData?.items?.[itemIndex]?.isbn}
                                name="item_isbn[]" className="form-control" placeholder="ISBN" style={{ width: '120px' }}
                                onChange={(e) => handleItemChange(itemIndex, 'isbn', e.target.value)}
                                onWheel={(e) => e.target.blur()}
                              /></td>
                            <td className="px-1"><input

                              value={formData?.items?.[itemIndex]?.stock}
                              type="number" name="item_stock[]" className="form-control stock" placeholder="Opening Stock" style={{ width: '120px' }}
                              onChange={(e) => handleItemChange(itemIndex, 'stock', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                            /></td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <Col xs={12}>
              <Button type="submit" className="mt-4 btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : (isEditMode ? 'Update' : 'Save')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default ItemGroupForm;

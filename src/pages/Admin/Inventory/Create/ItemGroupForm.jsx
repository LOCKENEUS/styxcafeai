import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, InputGroup, Modal, Container } from "react-bootstrap";
import { BiPlus, BiTrash } from "react-icons/bi";
// import {  CreateCustomTaxModal, ManufacturerModal, Units } from "../modal/Units";
import { FaPlus, FaTrash } from "react-icons/fa";
import Units from "../modal/Units";
import Tax from "../modal/Tax";
import Manufacturer from "../modal/Manufacturer";
import Brand from "../modal/Brand";
import { useDispatch, useSelector } from 'react-redux';
import { addItemGroup, getItemGroupById, updateItemGroup } from '../../../../store/AdminSlice/Inventory/ItemGroupSlice';
import { getCustomFields, deleteCustomField } from '../../../../store/AdminSlice/CustomField';
import { getTaxFields } from '../../../../store/AdminSlice/TextFieldSlice';
import { useNavigate, useParams } from "react-router-dom";

const ItemGroupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the ID from URL params for editing
  const isEditMode = Boolean(id);
  
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
  const user = JSON.parse(sessionStorage.getItem("user"));
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

  useEffect(() => {
    const cafeId = JSON.parse(sessionStorage.getItem("user"))?._id;
    dispatch(getCustomFields(cafeId));
    dispatch(getTaxFields(cafeId));
    
    // If in edit mode, fetch the item group data
    if (isEditMode) {
      dispatch(getItemGroupById(id));
    }
  }, [dispatch, id, isEditMode]);

  // Populate form when selectedItemGroup changes (for edit mode)
  useEffect(() => {
    if (isEditMode && selectedItemGroup) {
      setFormData({
        group_name: selectedItemGroup.group_name || '',
        unit: selectedItemGroup.unit || '',
        taxable: selectedItemGroup.taxable || false,
        tax: selectedItemGroup.tax ? selectedItemGroup.tax._id : null,
        manufacturer: selectedItemGroup.manufacturer ? selectedItemGroup.manufacturer._id : '',
        brand: selectedItemGroup.brand ? selectedItemGroup.brand._id : '',
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

  const handleCopyToAll = (field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => ({
        ...item,
        [field]: value
      }))
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
      const options = attribute.options.split(',').map(option => option.trim());
      options.forEach((option, optIndex) => {
        const itemIndex = attributes.slice(0, attrIndex).reduce(
          (acc, attr) => acc + attr.options.split(',').length,
          0
        ) + optIndex;

        const itemName = `${formData.group_name} ${attribute.color} ${option}`;
        // Generate a unique SKU for each item
        const generatedSKU = generateSKU(formData.group_name, itemName, attribute.color, globalIndex);
        globalIndex++;

        const item = {
          name: itemName,
          sku: formData.items[itemIndex]?.sku || generatedSKU, // Use existing SKU if available, otherwise use generated
          hsn: formData.items[itemIndex]?.hsn || '',
          unit: formData.unit,
          taxable: formData.taxable,
          manufacturer: formData.manufacturer,
          brand: formData.brand,
          costPrice: formData.items[itemIndex]?.costPrice || 0,
          sellingPrice: formData.items[itemIndex]?.sellingPrice || 0,
          stock: formData.items[itemIndex]?.stock || 0,
          upc: formData.items[itemIndex]?.upc || '',
          ean: formData.items[itemIndex]?.ean || '',
          isbn: formData.items[itemIndex]?.isbn || '',
          cafe: cafeId
        };
        items.push(item);
      });
    });
    return items;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let items = generateItems();

    // If in edit mode, add item IDs from selectedItemGroup to each item
    if (isEditMode && selectedItemGroup) {
      items = items.map((item, index) => ({
        ...item,
        _id: selectedItemGroup.items[index]?._id || item._id, // Use existing ID if available
      }));
    }

    const submitData = {
      ...formData,
      items
    };
    
    try {
      if (isEditMode) {
        await dispatch(updateItemGroup({ id, itemGroupData: submitData })).unwrap();
      } else {
        await dispatch(addItemGroup(submitData)).unwrap();
      }
      navigate('/admin/inventory/item-group-list');
    } catch (error) {
      console.error('Failed to save item group:', error);
    }
  };

  return (
    <Container className="p-4">
      <Card className="shadow p-3">
      <div className="d-flex justify-content-start align-items-start">
        <h1>{isEditMode ? 'Edit Item Group' : 'Create New Item'}</h1>
      </div>
      <Form onSubmit={handleSubmit}>
      <div className="row">
        <div className="my-4 col-sm-6">
          <Form.Group>
            <Form.Label className="fw-bold my-2">Item Group Name<span className="text-danger ms-1">*</span></Form.Label>
            <Form.Control
            required
              type="text"
              name="group_name"
              placeholder="Enter item group name"
              value={formData.group_name}
              onChange={handleInputChange}
            />
          </Form.Group>
        </div>
        <div className="my-4 col-sm-6">
            <Form.Label className="fw-bold my-2">Unit<span className="text-danger ms-1">*</span></Form.Label>
          <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
            <Form.Select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit._id} value={unit.name}>
                  {unit.name}
                  <FaTrash 
                    className="text-danger ms-2" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteUnit(unit._id);
                    }}
                  />
                </option>
              ))}
            </Form.Select>
        
            <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowUnitModal(true)}>
              <FaPlus className="text-primary" size={30} />
            </Button>
          </Form.Group>
          <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} />
        </div>
        <div className="my-4 col-md-6">
          <Form.Group>
            <Form.Label className="fw-bold my-2">Tax Preference </Form.Label>
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
        </div>
        {formData.taxable && (
          <div className="my-2 col-md-6">
            <Form.Label className="fw-bold my-2">Tax<span className="text-danger ms-1">*</span></Form.Label>
            <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
              <Form.Select 
                aria-label="Select Tax"
                name="tax"
                value={  formData.tax_rate}
                onChange={handleInputChange}
              >
                <option value="">Select Tax</option>
                {taxFields.map(tax => (
                  <option key={tax._id} value={tax._id}>
                    {tax.tax_name} ({tax.tax_rate}%)
                  </option>
                ))}
              </Form.Select>
              <Button 
                className="d-flex justify-content-end align-items-center" 
                style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} 
                variant="outline-secondary" 
                onClick={() => setShowTaxModal(true)}
              >
                <FaPlus className="text-primary" size={30} />
              </Button>
            </Form.Group>
            <Tax show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
          </div>
        )}
        <div className="my-2 col-md-6">
            <Form.Label className="fw-bold my-2">Manufacturer</Form.Label>
          <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
            <Form.Select 
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
            >
              <option value="">Select Manufacturer</option>
              {manufacturers.map((manufacturer) => (
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
            </Form.Select>
            <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowManufacturerModal(true)}>
              <FaPlus className="text-primary" size={30} />
            </Button>
          </Form.Group>
          <Manufacturer show={showManufacturerModal} handleClose={() => setShowManufacturerModal(false)} />
        </div>
        <div className="my-2 col-md-6">
            <Form.Label className="fw-bold my-2">Brand</Form.Label>
          <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
            <Form.Select 
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
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
            </Form.Select>

            
            <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowBrandModal(true)}>
              <FaPlus className="text-primary" size={30} />
            </Button>
          </Form.Group>

            <Brand show={showBrandModal} handleClose={() => setShowBrandModal(false)} />
        </div>
        <div className="my-2 col-md-6">
          <Form.Group>
            <Form.Label className="fw-bold my-2">Description</Form.Label>
            <Form.Control 
              required
              value={formData.description}
              onChange={handleInputChange}
              as="textarea" placeholder="Description" name="description" rows={3} />
          </Form.Group>
        </div>
        <div className="my-4 col-sm-12">
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
            />
          </div>
          <div className="col-md-4">
            <Form.Control
              placeholder="e.g: Red, Black"
              type="text"
              value={attribute.options}
              onChange={(e) => handleAttributeChange(index, "options", e.target.value)}
              disabled={isEditMode}
              required
            />
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
    </div>        </div>

        {/* Conditionally render the table if there are attributes */}
        {attributes.some(attr => attr.color || attr.options) && (
          <div className="col-sm-12 mb-3" id="tableDiv" style={{ zoom: 0.9, overflowX: 'auto' }}>
            <table className="table table-sm table-border table-border-vertical table-hover">
              <thead className="bg-light">
                <tr>
                  <th>SN</th>
                  <th nowrap="">Item name</th>
                  <th nowrap="" className="px-1">HSN<br /><span type="button" className="text-primary" onClick={() => document.querySelectorAll('.hsn').forEach(el => el.value = document.querySelector('.hsn').value)}>(Copy to All)</span></th>
                  <th nowrap="" className="px-1">SKU<br /><span type="button" className="text-primary">(Generate SKU)</span></th>
                  <th nowrap="" className="px-1">Cost Price<br /><span type="button" className="text-primary" onClick={() => document.querySelectorAll('.cost-price').forEach(el => el.value = document.querySelector('.cost-price').value)}>(Copy to All)</span></th>
                  <th nowrap="" className="px-1">Selling Price<br /><span type="button" className="text-primary" onClick={() => document.querySelectorAll('.selling-price').forEach(el => el.value = document.querySelector('.selling-price').value)}>(Copy to All)</span></th>
                  <th>UPC</th>
                  <th>EAN</th>
                  <th>ISBN</th>
                  <th nowrap="" className="px-1">Opening Stock<br /><span type="button" className="text-primary" onClick={() => document.querySelectorAll('.stock').forEach(el => el.value = document.querySelector('.stock').value)}>(Copy to All)</span></th>
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
                            required
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
                            required
                            style={{ width: '120px' }}
                            value={formData.items[itemIndex]?.sku || generateSKU(formData.group_name, itemName, attribute.color, itemIndex)}
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
                        required
                        type="number"
                        value={formData?.items?.[itemIndex]?.upc}
                        name="item_upc[]" className="form-control" placeholder="UPC" style={{ width: '120px' }} 
                        onChange={(e) => handleItemChange(itemIndex, 'upc', e.target.value)}
                        /></td>
                        <td
             className="px-1"><input 
                        required
                        value={formData?.items?.[itemIndex]?.ean}
                        type="number" name="item_ean[]" className="form-control" placeholder="EAN" style={{ width: '120px' }} 
                        onChange={(e) => handleItemChange(itemIndex, 'ean', e.target.value)}
                        /></td>
                        <td
                    className="px-1"><input type="number"
                        required
                        value={formData?.items?.[itemIndex]?.isbn}
                        name="item_isbn[]" className="form-control" placeholder="ISBN" style={{ width: '120px' }} 
                        onChange={(e) => handleItemChange(itemIndex, 'isbn', e.target.value)}
                        /></td>
                        <td className="px-1"><input
                        required
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

        <div className="col-md-12">
          <Button type="submit" className="mt-4 btn btn-primary">Save</Button>
        </div>
      </div>
      </Form>
      </Card>
    </Container>
  );
};

export default ItemGroupForm;

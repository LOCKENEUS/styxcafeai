import { useState, useEffect } from "react";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Offcanvas, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { addItem, } from "../../../../store/AdminSlice/Inventory/ItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCustomFields } from "../../../../store/AdminSlice/CustomField";
import { getTaxFields } from "../../../../store/AdminSlice/TextFieldSlice";
import { getVendors } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import Tax from "../../../../pages/Admin/Inventory/modal/Tax";
import { Units } from "../modal/units";
import { Brand } from "../modal/brand";
import { Manufacturer } from "../modal/manufacturer";

const OffcanvesItems = ({ showOffCanvasCreateItem, handleCloseCreateItem }) => {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
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
    linking: 'Y',
    image: null,
  })
  const [superAdminId, setSuperAdminId] = useState('');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showTaxFields, setShowTaxFields] = useState(true);
  const customFields = useSelector(state => state.customFields.customFields);
  const taxFields = useSelector(state => state.taxFieldSlice.taxFields);
  const unitOptions = customFields.filter(field => field.type === "Unit");
  const manufacturerOptions = customFields.filter(field => field.type === "Manufacturer");
  const brandOptions = customFields.filter(field => field.type === "Brand");

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
  useEffect(() => {
    if (superAdminId) {
      dispatch(getVendors(superAdminId));
    }
  }, [dispatch, superAdminId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
      setFormData((prev) => ({ ...prev, image: null }));
    }
  };

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('sku', formData.sku);
    formDataToSend.append('unit', formData.unit);
    formDataToSend.append('hsn', formData.hsnCode);
    formDataToSend.append('taxable', formData.taxPreference === 'Taxable');
    formDataToSend.append('tax', formData.selectedTax);
    formDataToSend.append('length', formData.length) || 0;
    formDataToSend.append('width', formData.width) || 0;
    formDataToSend.append('height', formData.height) || 0;
    formDataToSend.append('dimensionUnit', formData.dimension_unit);
    formDataToSend.append('weight', formData.weight);
    formDataToSend.append('weightUnit', formData.weight_unit);
    formDataToSend.append('manufacturer', formData.manufacturer);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('mpn', formData.mpn);
    formDataToSend.append('upc', formData.upc);
    formDataToSend.append('ean', formData.ean);
    formDataToSend.append('isbn', formData.isbn);
    formDataToSend.append('costPrice', parseFloat(formData.costPrice));
    formDataToSend.append('sellingPrice', parseFloat(formData.sellingPrice));
    formDataToSend.append('linking', formData.linking);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    formDataToSend.append('is_active', true);
    formDataToSend.append('is_deleted', false);

    try {
      setSubmitLoading(true);
      await dispatch(addItem(formDataToSend)).then(() => {

        setFormData({
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
          linking: 'Y',
          image: null,
        });
        setSubmitLoading(false);
        handleCloseCreateItem();
      });
    } catch (error) {
      setSubmitLoading(false);
      console.error('Error adding item:', error);
    }
  };

  return (
    <Offcanvas
      show={showOffCanvasCreateItem}
      onHide={handleCloseCreateItem}
      placement="end"
      style={{ width: '600px' }}
      aria-labelledby="offcanvasItemLabel"
    >
      <Offcanvas.Header closeButton className="bg-info bg-opacity-25 py-3">
        <h4 className="fs-2">Create New Item</h4>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Form onSubmit={handleSubmitData}>
          {/* Basic Information Card */}
          <Row>
            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Name
                  <span className="text-danger ms-1">*</span>
                </FormLabel>
                <FormControl
                  type="text"
                  id="name"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  SKU
                  <span className="text-danger ms-1">*</span>
                </FormLabel>
                <FormControl
                  type="text"
                  id="sku"
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Unit
                  <span className="text-danger ms-1">*</span>
                </FormLabel>
                <InputGroup>
                  <FormSelect
                    name="unit"
                    value={formData.unit}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">Select Unit</option>
                    {unitOptions.map(unit => (
                      <option key={unit._id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
                  </FormSelect>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowUnitModal(true)}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  HSN Code
                  <span className="text-danger ms-1">*</span>
                </FormLabel>
                <FormControl
                  type="number"
                  id="hsnCode"
                  name="hsnCode"
                  placeholder="HSN Code"
                  value={formData.hsnCode}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Tax Preference
                  {/* <span className="text-danger ms-1">*</span> */}
                </FormLabel>
                <FormSelect
                  id="taxPreference"
                  name="taxPreference"
                  value={formData.taxPreference}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      taxPreference: value,
                    }));
                    setShowTaxFields(value === "Taxable");
                  }}
                >
                  <option value="Taxable">Taxable</option>
                  <option value="Non-Taxable">Non-Taxable</option>
                </FormSelect>
              </FormGroup>
            </Col>

            {formData.taxPreference === 'Taxable' && (
              <Col sm={6} className="mb-3">
                <FormGroup>
                  <FormLabel className="fw-bold">
                    Tax
                    <span className="text-danger ms-1">*</span>
                  </FormLabel>
                  <InputGroup>
                    <FormSelect
                      name="selectedTax"
                      value={formData.selectedTax}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Tax</option>
                      {taxFields.map(tax => (
                        <option key={tax._id} value={tax._id}>
                          {tax.tax_name} ({tax.tax_rate}%)
                        </option>
                      ))}
                    </FormSelect>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowTaxModal(true)}
                    >
                      <FaPlus />
                    </Button>
                  </InputGroup>
                </FormGroup>
              </Col>
            )}

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Dimensions
                </FormLabel>
                <InputGroup>
                  <FormControl
                    type="number"
                    id="length"
                    placeholder="Length"
                    value={formData.length}
                    onChange={handleChange}
                  />
                  <FormControl
                    type="number"
                    id="width"
                    placeholder="Width"
                    value={formData.width}
                    onChange={handleChange}
                  />
                  <FormControl
                    type="number"
                    id="height"
                    placeholder="Height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                  <FormSelect
                    name="dimension_unit"
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

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Weight
                </FormLabel>
                <InputGroup>
                  <FormControl
                    type="number"
                    id="weight"
                    placeholder="Enter weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  <FormSelect
                    name="weight_unit"
                    value={formData.weight_unit}
                    onChange={handleChange}
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

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Manufacturer
                </FormLabel>
                <InputGroup>
                  <FormSelect
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                  >
                    <option value="">Select manufacturer</option>
                    {manufacturerOptions.map((manufacturer, index) => (
                      <option key={index} value={manufacturer._id}>{manufacturer.name}</option>
                    ))}
                  </FormSelect>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowManufacturerModal(true)}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Brand
                </FormLabel>
                <InputGroup>
                  <FormSelect
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  >
                    <option value="">Select Brand</option>
                    {brandOptions.map((brand, index) => (
                      <option key={index} value={brand._id}>{brand.name}</option>
                    ))}
                  </FormSelect>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowBrandModal(true)}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  MPN
                  <i className="icofont icofont-info-circle" title="Manufacturing Part Number unambiguously identifies a part of design" style={{ cursor: 'pointer', width: '40px' }} />
                </FormLabel>
                <FormControl
                  type="text"
                  id="mpn"
                  placeholder="000-000"
                  value={formData.mpn}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  UPC
                  <i className="icofont icofont-info-circle" title="Twelve digit unique number associated with the barcode(Universal Product Code)" style={{ cursor: 'pointer', width: '40px' }} />
                </FormLabel>
                <FormControl
                  type="text"
                  id="upc"
                  placeholder="000-000"
                  value={formData.upc}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  ISBN
                  <i className="icofont icofont-info-circle" title="Thirteen digit unique commercial book identifier(International Standard Book Number)" style={{ cursor: 'pointer', width: '40px' }} />
                </FormLabel>
                <FormControl
                  type="text"
                  id="isbn"
                  placeholder="000-000"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  EAN
                  <i className="icofont icofont-info-circle" title="Thirteen digit unique number(International Article Number)" style={{ cursor: 'pointer', width: '40px' }} />
                </FormLabel>
                <FormControl
                  type="text"
                  id="ean"
                  placeholder="000-000"
                  value={formData.ean}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Cost Price
                  <span className="text-danger ms-1">*</span>
                </FormLabel>
                <InputGroup>
                  <InputGroup.Text>₹</InputGroup.Text>
                  <FormControl
                    type="number"
                    id="costPrice"
                    name="costPrice"
                    placeholder="00.00"
                    value={formData.costPrice}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Selling Price
                  <span className="text-danger ms-1">*</span>
                </FormLabel>
                <InputGroup>
                  <InputGroup.Text>₹</InputGroup.Text>
                  <FormControl
                    type="number"
                    id="sellingPrice"
                    name="sellingPrice"
                    placeholder="00.00"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={3} className="mb-3">
              <FormGroup>
                <FormLabel className="fw-bold">
                  Product Image
                </FormLabel>
                <FormControl
                  type="file"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImageChange}
                />
              </FormGroup>
            </Col>

            <Col sm={3} className="p-2">
              <img
                src={imagePreview}
                alt="product preview"
                style={{ width: '100px', aspectRatio: 1, objectFit: 'cover' }}
              />
            </Col>
          </Row>

          {/* Submit Buttons */}
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" className="float-end">
              {submitLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Saving...
                </>
              ) : ('Submit')}
            </Button>
            <Button variant="secondary" onClick={handleCloseCreateItem}>
              Cancel
            </Button>
          </div>
        </Form>

        {/* Modals */}
        <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} />
        <Tax show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
        <Manufacturer show={showManufacturerModal} handleClose={() => setShowManufacturerModal(false)} />
        <Brand show={showBrandModal} handleClose={() => setShowBrandModal(false)} />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvesItems;

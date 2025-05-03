import { Offcanvas, Form, Button, Row, Col, InputGroup, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { BiPlus } from 'react-icons/bi';

const CreateItemOffcanvas = ({ show, handleClose }) => {
  const [taxable, setTaxable] = useState(true);
  const [imagePreview, setImagePreview] = useState('https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg');
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [units, setUnits] = useState([
    { value: 'pcs', label: 'pcs (646)' },
    { value: 'abs', label: 'abs (909099)' }
  ]);
  const [taxes, setTaxes] = useState([
    { value: '32', label: '18% GST (SGST 9% +CGST 9%)' },
    { value: '23', label: '10% GST' }
  ]);
  const [manufacturers, setManufacturers] = useState([
    { value: '2', label: 'MI' },
    { value: '14', label: 'HP' }
  ]);
  const [brands, setBrands] = useState([
    { value: '3', label: 'Xiomi' },
    { value: '15', label: 'HP' }
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUnitSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUnit = {
      value: formData.get('name'),
      label: `${formData.get('name')} (${formData.get('code')})`
    };
    
    setUnits(prevUnits => [...prevUnits, newUnit]);
    setShowUnitModal(false);
    e.target.reset();
  };

  const handleTaxSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTax = {
      value: formData.get('tax_value'),
      label: `${formData.get('tax_value')}% - ${formData.get('tax_name')}`
    };
    
    setTaxes(prevTaxes => [...prevTaxes, newTax]);
    setShowTaxModal(false);
    e.target.reset();
  };

  const handleManufacturerSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newManufacturer = {
      value: String(manufacturers.length + 1), // Simple ID generation
      label: formData.get('name')
    };
    
    setManufacturers(prevManufacturers => [...prevManufacturers, newManufacturer]);
    setShowManufacturerModal(false);
    e.target.reset();
  };

  const handleBrandSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBrand = {
      value: String(brands.length + 1), // Simple ID generation
      label: formData.get('name')
    };
    
    setBrands(prevBrands => [...prevBrands, newBrand]);
    setShowBrandModal(false);
    e.target.reset();
  };

  return (
    <>
      <Offcanvas 
        show={show} 
        onHide={handleClose} 
        placement="end" 
        style={{ width: '600px' }}
        aria-labelledby="offcanvasItemLabel"
      >
        <Offcanvas.Header closeButton className="bg-light text-dark">
          <Offcanvas.Title id="offcanvasItemLabel">Create New Item </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          <Form id="createItemForm" encType="multipart/form-data">
            <Row>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="item_name">Name<span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" id="item_name" name="name" placeholder="Name" required />
              </Col>
              
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="sku">SKU <i className="icofont icofont-info-circle" title="The Stock Keeping Unit of the Item" style={{ cursor: 'pointer', width: '40px' }} /></Form.Label>
                <Form.Control type="text" id="sku" name="sku" placeholder="SKU" required />
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="unit">
                  Unit <i className="icofont icofont-info-circle" title="The item will measured in terms of this unit" />
                  <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Select className='me-2' id="unit" name="unit" required>
                    <option value="" disabled>Select Unit</option>
                    {units.map((unit, index) => (
                      <option key={index} value={unit.value}>{unit.label}</option>
                    ))}
                  </Form.Select>
                  <Button variant="outline-secondary" onClick={() => setShowUnitModal(true)}>
                    <BiPlus size={20}/>
                  </Button>
                </InputGroup>
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="hsn">HSN Code <span className="text-danger">*</span></Form.Label>
                <Form.Control type="tel" id="hsn" name="hsn" placeholder="HSN Code" required />
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="taxable">Tax Preference</Form.Label>
                <Form.Select 
                  id="taxable" 
                  name="taxable"
                  onChange={(e) => setTaxable(e.target.value === 'Y')}
                >
                  <option value="Y">Taxable</option>
                  <option value="N">Non Taxable</option>
                </Form.Select>
              </Col>

              {taxable && (
                <Col sm={6} className="mb-3">
                  <Form.Label htmlFor="create_item_tax">Tax<span className="text-danger">*</span></Form.Label>
                  <InputGroup> 
                    <Form.Select className='me-2' id="create_item_tax" name="tax">
                      <option value="" disabled>Select tax</option>
                      {taxes.map((tax, index) => (
                        <option key={index} value={tax.value}>{tax.label}</option>
                      ))}
                    </Form.Select>
                    <Button variant="outline-secondary" onClick={() => setShowTaxModal(true)}>
                      <BiPlus size={20}/>
                    </Button>
                  </InputGroup>
                </Col>
              )}

              <Col sm={6} className="mb-3">
                <Form.Label>Dimensions</Form.Label>
                <InputGroup>
                  <Form.Control type="tel" name="length" placeholder="Length" />
                  <Form.Control type="tel" name="width" placeholder="Width" />
                  <Form.Control type="tel" name="height" placeholder="Height" />
                  <Form.Select name="dimension_unit">
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="inch">inch</option>
                    <option value="feet">feet</option>
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="weight">Weight</Form.Label>
                <InputGroup>
                  <Form.Control type="tel" name="weight" placeholder="Enter weight" />
                  <Form.Select name="weight_unit">
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="t">t</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="manufacturer">Manufacturer</Form.Label>
                <InputGroup>
                  <Form.Select className='me-2' id="manufacturer" name="manufacturer">
                    <option value="" disabled>Select manufacturer</option>
                    {manufacturers.map((manufacturer, index) => (
                      <option key={index} value={manufacturer.value}>{manufacturer.label}</option>
                    ))}
                  </Form.Select>
                  <Button variant="outline-secondary" onClick={() => setShowManufacturerModal(true)}>
                    <BiPlus size={20}/>
                  </Button>
                </InputGroup>
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="brand">Brand</Form.Label>
                <InputGroup>
                  <Form.Select className='me-2' id="brand" name="brand">
                    <option value="" disabled>Select Brand</option>
                    {brands.map((brand, index) => (
                      <option key={index} value={brand.value}>{brand.label}</option>
                    ))}
                  </Form.Select>
                  <Button variant="outline-secondary" onClick={() => setShowBrandModal(true)}>
                    <BiPlus size={20}/>
                  </Button>
                </InputGroup>
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="mpn">
                  MPN
                  <i className="icofont icofont-info-circle" title="Manufacturing Part Number unambiguously identifies a part of design" style={{ cursor: 'pointer', width: '40px' }} />
                </Form.Label>
                <Form.Control type="text" id="mpn" name="mpn" placeholder="000-000" />
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="upc">
                  UPC
                  <i className="icofont icofont-info-circle" title="Twelve digit unique number associated with the barcode(Universal Product Code)" style={{ cursor: 'pointer', width: '40px' }} />
                </Form.Label>
                <Form.Control type="text" id="upc" name="upc" placeholder="000-000" />
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="isbn">
                  ISBN
                  <i className="icofont icofont-info-circle" title="Thirteen digit unique commercial book identifier(International Standard Book Number)" style={{ cursor: 'pointer', width: '40px' }} />
                </Form.Label>
                <Form.Control type="text" id="isbn" name="isbn" placeholder="000-000" />
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="ean">
                  EAN
                  <i className="icofont icofont-info-circle" title="Thirteen digit unique number(International Article Number)" style={{ cursor: 'pointer', width: '40px' }} />
                </Form.Label>
                <Form.Control type="text" id="ean" name="ean" placeholder="000-000" />
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="cost_price">
                  Cost Price
                  <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>₹</InputGroup.Text>
                  <Form.Control type="tel" id="cost_price" name="cost_price" placeholder="00.00" />
                </InputGroup>
              </Col>

              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="selling_price">
                  Selling Price
                  <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>₹</InputGroup.Text>
                  <Form.Control type="tel" id="selling_price" name="selling_price" placeholder="00.00" />
                </InputGroup>
              </Col>

              <Col sm={4} className="mb-2">
                <Form.Label>Link with Website</Form.Label>
                <div className="m-checkbox-inline">
                  <Form.Check 
                    type="radio"
                    inline
                    label="Yes"
                    id="linkingradioinline1"
                    name="linking"
                    value="Y"
                  />
                  <Form.Check 
                    type="radio"
                    inline
                    label="No"
                    id="linkingradioinline2"
                    name="linking"
                    value="N"
                    defaultChecked
                  />
                </div>
              </Col>

              <Col sm={4} className="mb-2">
                <Form.Label htmlFor="imageLabel">Product Image</Form.Label>
                <Form.Control 
                  type="file"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImageChange}
                />
              </Col>

              <Col sm={4} className="p-2 mb-2">
                <img 
                  src={imagePreview}
                  alt="product preview"
                  style={{ width: '100px', aspectRatio: 1, objectFit: 'cover' }}
                />
              </Col>
            </Row>

            <Button variant="primary" >
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Unit Modal */}
      <Modal 
        show={showUnitModal} 
        onHide={() => setShowUnitModal(false)}
        style={{ zIndex: 1100 }}
      >
        <Modal.Header closeButton className="bg-light text-dark">
          <Modal.Title>Inventory Units</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="unitForm" onSubmit={handleUnitSubmit}>
            <Row>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="createUnit">Unit</Form.Label>
                <Form.Control id="createUnit" name="name" type="text" placeholder="Unit" required />
              </Col>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="unit_code">Unique Quantity Code</Form.Label>
                <Form.Control id="unit_code" name="code" type="tel" placeholder="000-000" required />
              </Col>
              <Col xs={12}>
                <Button type="submit"  variant="info" className="text-white" id="unitSubmitBtn">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Tax Modal */}
      <Modal 
        show={showTaxModal} 
        onHide={() => setShowTaxModal(false)}
        style={{ zIndex: 1100 }}
      >
        <Modal.Header closeButton className="bg-light text-dark">
          <Modal.Title>Create Custom Tax</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="CreateTax" onSubmit={handleTaxSubmit}>
            <Row>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="tax_name">Tax name</Form.Label>
                <Form.Control size="sm" id="tax_name" name="tax_name" type="text" placeholder="Tax name" required />
              </Col>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="tax_value">Tax Value</Form.Label>
                <InputGroup size="sm">
                  <Form.Control
                    id="tax_value"
                    name="tax_value"
                    type="tel"
                    placeholder="0.00"
                    required
                    maxLength={2}
                    onChange={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Col>
              <Col sm={12} className="mb-3">
                <Form.Label htmlFor="tax_description">Tax Description</Form.Label>
                <Form.Control size="sm" id="tax_description" name="tax_description" type="text" placeholder="Custom tax description" required />
              </Col>
              <Col xs={12}>
                <Button type="submit" variant="info" size="sm" className="text-white" id="TaxSubmitBtn">
                  Create Tax
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Manufacturer Modal */}
      <Modal 
        show={showManufacturerModal} 
        onHide={() => setShowManufacturerModal(false)}
        style={{ zIndex: 1100 }}
      >
        <Modal.Header closeButton className="bg-light text-dark">
          <Modal.Title>Manufacturer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="manufacturerForm" onSubmit={handleManufacturerSubmit}>
            <Row>
              <Col sm={12} className="mb-3">
                <Form.Label htmlFor="mrf_name">Manufacturer name</Form.Label>
                <Form.Control id="mrf_name" name="name" type="text" placeholder="Manufacturer Name" required />
              </Col>
              <Col xs={12}>
                <Button type="submit" variant="info" className="text-white" id="manufacturerSubmitBtn">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Brand Modal */}
      <Modal 
        show={showBrandModal} 
        onHide={() => setShowBrandModal(false)}
        style={{ zIndex: 1100 }}
      >
        <Modal.Header closeButton className="bg-light text-dark">
          <Modal.Title>Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="brandForm" onSubmit={handleBrandSubmit}>
            <Row>
              <Col sm={12} className="mb-3">
                <Form.Label htmlFor="brand_name">Brand name</Form.Label>
                <Form.Control id="brand_name" name="name" type="text" placeholder="Brand Name" required />
              </Col>
              <Col xs={12}>
                <Button type="submit" variant="info" className="text-white" id="brandSubmitBtn">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateItemOffcanvas;
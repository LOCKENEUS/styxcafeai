import { useState } from "react";
import { Form, Button, Row, Col, Card, InputGroup, Modal, Container } from "react-bootstrap";
import { BiPlus, BiTrash } from "react-icons/bi";
// import {  CreateCustomTaxModal, ManufacturerModal, Units } from "../modal/Units";
import { FaPlus } from "react-icons/fa";
import Units from "../modal/Units";
import Tax from "../modal/Tax";
import Manufacturer from "../modal/Manufacturer";
import Brand from "../modal/Brand";


const AttributeOptions = ({ attributes, setAttributes }) => {
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

  return (
    <div data-aos="fade-up" data-aos-duration="700">
      <label className="fw-bold mb-2">Multiple Items? Create Attributes and Options</label>
      {attributes.map((attribute, index) => (
        <div key={index} className="mb-2 row">
          <div className="col-md-4">
            <Form.Control
              placeholder="e.g: Color"
              type="text"
              value={attribute.color}
              onChange={(e) => handleAttributeChange(index, "color", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <Form.Control
              placeholder="e.g: Red, Black"
              type="text"
              value={attribute.options}
              onChange={(e) => handleAttributeChange(index, "options", e.target.value)}
            />
          </div>
          <div className="col-sm-4">
            <Button type="button" variant="danger" onClick={() => removeAttribute(index)}>
              <BiTrash /> 
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" className="ms-4 mt-3" onClick={addAttribute}>
        <BiPlus /> Add Attribute
      </Button>
    </div>
  );
};

const ItemGroupForm = () => {
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [taxable, setTaxable] = useState("Y");
  const [attributes, setAttributes] = useState([{ color: "", options: "" }]);
  const [taxPreference, setTaxPreference] = useState("Taxable");

  return (
    <Container className="p-4">
      <Card className="shadow p-3">
      <div className="d-flex justify-content-start align-items-start">
        <h1>Create New Item</h1>
      </div>
      <div className="row">
        <div className="my-4 col-sm-6">
          <Form.Group>
            <Form.Label className="fw-bold my-2">Item Group Name<span className="text-danger ms-1">*</span></Form.Label>
            <Form.Control type="text" id="itemGroupName" placeholder="Enter item group name" />
          </Form.Group>
        </div>
        <div className="my-4 col-sm-6">
            <Form.Label className="fw-bold my-2">Unit<span className="text-danger ms-1">*</span></Form.Label>
          <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
            <Form.Select name="unitType" aria-label="Select unit">
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Fax">Fax</option>
              <option value="Direct">Direct</option>
              <option value="Mobile">Mobile</option>
            </Form.Select>
        
            <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowUnitModal(true)}>
              <FaPlus className="text-primary" size={30} />
            </Button>
          </Form.Group>
          <Units show={showUnitModal} handleClose={() => setShowUnitModal(false)} />
        </div>
        <div className="my-4 col-md-6">
          <Form.Group>
            <Form.Label className="fw-bold my-2">Tax Preference<span className="text-danger ms-1">*</span></Form.Label>
            <Form.Select 
              value={taxPreference} 
              onChange={(e) => setTaxPreference(e.target.value)}
            >
              <option value="Taxable">Taxable</option>
              <option value="Non-Taxable">Non-Taxable</option>
            </Form.Select>
          </Form.Group>
        </div>
        {taxPreference === "Taxable" && (
          <div className="my-2 col-md-6">
            <Form.Label className="fw-bold my-2">Tax<span className="text-danger ms-1">*</span></Form.Label>
            <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
              <Form.Select aria-label="Select Tax">
                <option value="23%">23%</option>
                <option value="8%">8%</option>
                <option value="7%">7%</option>
              </Form.Select>
              <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowTaxModal(true)}>
                <FaPlus className="text-primary" size={30} />
              </Button>
            </Form.Group>
            <Tax show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
          </div>
        )}
        <div className="my-2 col-md-6">
            <Form.Label className="fw-bold my-2">Manufacturer</Form.Label>
          <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
            <Form.Select name="manufacturer">
              <option value="MI">MI</option>
              <option value="HP">HP</option>
              <option value="Dell">Dell</option>
            </Form.Select>
            <div id="addTaxFieldContainer"></div>
            <Button className="d-flex justify-content-end align-items-center" style={{ width: "40px", padding: '12px', border: "1px solid blue", height: "40px", borderStyle: "dashed" }} variant="outline-secondary" onClick={() => setShowManufacturerModal(true)}>
              <FaPlus className="text-primary" size={30} />
            </Button>
          </Form.Group>
          <Manufacturer show={showManufacturerModal} handleClose={() => setShowManufacturerModal(false)} />
        </div>
        <div className="my-2 col-md-6">
            <Form.Label className="fw-bold my-2">Brand</Form.Label>
          <Form.Group className="d-flex justify-content-between gap-3 align-items-center">
            <Form.Select name="brand">
              <option value="">Select Brand</option>
              <option value="Work">HP</option>
              <option value="Xiomi">Xiomi</option>
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
            <Form.Control as="textarea" placeholder="Description" name="description" rows={3} />
          </Form.Group>
        </div>
        <div className="my-4 col-sm-12">
          <AttributeOptions attributes={attributes} setAttributes={setAttributes} />
        </div>
        <div className="col-md-12">
          <Button type="submit" className="mt-4 btn btn-primary">Save</Button>
        </div>
      </div>
      </Card>
    </Container>
  );
};

export default ItemGroupForm;

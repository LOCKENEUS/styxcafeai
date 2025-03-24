import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  NavItem,
  NavLink,
  TabContainer,
  TabContent,
  Table,
  TabPane,
} from "react-bootstrap";
import { Nav, Tab, Col, Row } from "react-bootstrap";
import deleteplogo from "/assets/inventory/Vector (1).png";
import check from "/assets/inventory/Check.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomFields,
  addCustomField,
  updateCustomField,
  deleteCustomField,
} from "../../../../store/AdminSlice/CustomField";
import { BiCheck, BiTrash } from "react-icons/bi";

export const InventorySettingAdmin = () => {
  const dispatch = useDispatch();
  const { customFields, loading } = useSelector((state) => state.customFields);
  const [activeKey, setActiveKey] = useState("unit");
  const [newUnit, setNewUnit] = useState({ name: "", code: "" });
  const [newBrand, setNewBrand] = useState({ name: "" });
  const [newManufacturer, setNewManufacturer] = useState({ name: "" });
  const [newpaymentTerm, setNewPaymentTerm] = useState({ name: "", code: "" });
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;

  useEffect(() => {
    dispatch(getCustomFields(cafeId));
  }, [dispatch, cafeId]);

  // Filter custom fields by type
  const units = customFields.filter((field) => field.type === "Unit");
  const brands = customFields.filter((field) => field.type === "Brand");
  const manufacturers = customFields.filter(
    (field) => field.type === "Manufacturer"
  );
  const paymentTerms = customFields.filter(
    (field) => field.type === "Payment Terms"
  );

  const handleUnitChange = (e) => {
    const { name, value } = e.target;
    setNewUnit({ ...newUnit, [name]: value });
  };

  const handleBrandChange = (e) => {
    setNewBrand({ name: e.target.value });
  };

  const handleUnitSubmit = (e) => {
    e.preventDefault();
    if (newUnit.name && newUnit.code) {
      dispatch(
        addCustomField({
          name: newUnit.name,
          code: newUnit.code,
          type: "Unit",
          cafe: cafeId,
          description: "Custom field for product",
        })
      );
      setNewUnit({ name: "", code: "" });
    }
  };

  const handleBrandSubmit = (e) => {
    e.preventDefault();
    if (newBrand.name) {
      dispatch(
        addCustomField({
          name: newBrand.name,
          type: "Brand",
          cafe: cafeId,
          description: "Custom field for product",
        })
      );
      setNewBrand({ name: "" });
    }
  };

  const handleManufacturerSubmit = (e) => {
    e.preventDefault();
    if (newManufacturer.name) {
      dispatch(
        addCustomField({
          name: newManufacturer.name,
          type: "Manufacturer",
          cafe: cafeId,
          description: "Custom field for product",
        })
      );
      setNewManufacturer({ name: "" });
    }
  };

  const handalePaymentTermSubmit = (e) => {
    e.preventDefault();
    if (newpaymentTerm.name && newpaymentTerm.code) {
      dispatch(
        addCustomField({
          name: newpaymentTerm.name,
          code: newpaymentTerm.code,
          type: "Payment Terms",
          cafe: cafeId,
          description: "Custom field for product",
        })
      );
      setNewPaymentTerm({ name: "", code: "" });
    }
  };

  const handleUpdate = (id, data) => {
    dispatch(updateCustomField({ id, data }));
  };

  const handleDelete = (id) => {
    dispatch(deleteCustomField(id));
  };

  // Add new state for edited items
  const [editedFields, setEditedFields] = useState({});

  // New function to handle temporary changes
  const handleFieldChange = (id, field, value) => {
    setEditedFields(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  // New function to submit changes
  const handleSubmitChanges = (id) => {
    if (editedFields[id]) {
      handleUpdate(id, editedFields[id]);
      setEditedFields(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  return (
    <Container>
      <Row className="px-2">
        <Col sm={12} className="mx-4 my-3">
          <div style={{ top: "186px", fontSize: "18px" }}>
            <Breadcrumb>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Inventory</BreadcrumbItem>
              <BreadcrumbItem active> Inventory Settings</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        <TabContainer
          id="inventory-tabs"
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
        >
          <Row>
            <Col sm={5} className="tabs-responsive-side my-4 ">
              <Card className="rounded-4 p-1 border">
                <Nav
                  variant="pills"
                  className="nav-material justify-content-center "
                >
                  <NavItem>
                    <NavLink
                      eventKey="unit"
                      className={
                        activeKey === "unit" ? "bg-primary text-white" : ""
                      }
                    >
                      Unit
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      eventKey="brand"
                      className={
                        activeKey === "brand" ? "bg-primary text-white" : ""
                      }
                    >
                      Brand
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      eventKey="manufacturer"
                      className={
                        activeKey === "manufacturer"
                          ? "bg-primary text-white"
                          : ""
                      }
                    >
                      Manufacturer
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      eventKey="paymentterms"
                      className={
                        activeKey === "paymentterms"
                          ? "bg-primary text-white"
                          : ""
                      }
                    >
                      Payment Terms
                    </NavLink>
                  </NavItem>
                </Nav>
              </Card>
            </Col>
            <Col sm={6}></Col>
            <Col sm={12}>
              <TabContent>
                <TabPane eventKey="unit">
                  <Row>
                    <Col sm={3} className="mb-2">
                      <Card className="rounded-4 p-1 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Create New Unit</h4>
                          <Form autoComplete="off" onSubmit={handleUnitSubmit}>
                            <FormGroup className="mb-3">
                              <FormLabel>Unit Name</FormLabel>
                              <FormControl
                                type="text"
                                name="name"
                                placeholder="Unit"
                                value={newUnit.name}
                                onChange={handleUnitChange}
                                required
                              />
                            </FormGroup>
                            <FormGroup className="mb-3">
                              <FormLabel>Unique Quantity Code</FormLabel>
                              <FormControl
                                type="text"
                                name="code"
                                placeholder="000-000"
                                value={newUnit.code}
                                onChange={handleUnitChange}
                                required
                              />
                            </FormGroup>
                            <Button
                              className="my-3 float-end"
                              type="submit"
                              variant="primary"
                            >
                              Submit
                            </Button>
                          </Form>
                        </div>
                      </Card>
                    </Col>
                    <Col sm={9} className="mb-2" style={{ overflowX: "auto" }}>
                      <Card className="rounded-4 p-2 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Unit List</h4>
                          <Table className="border-none" hover size="sm">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Unit Code</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {units.map((unit) => (
                                <tr key={unit._id}>
                                  <td>{unit._id}</td>
                                  <td>
                                    <FormControl
                                      type="text"
                                      value={editedFields[unit._id]?.name ?? unit.name}
                                      onChange={(e) => handleFieldChange(unit._id, 'name', e.target.value)}
                                      style={{ minWidth: "200px" }}
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <FormControl
                                      type="text"
                                      value={editedFields[unit._id]?.code ?? unit.code}
                                      onChange={(e) => handleFieldChange(unit._id, 'code', e.target.value)}
                                      style={{ minWidth: "200px" }}
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td className="d-flex gap-2">
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleDelete(unit._id)}
                                      style={{ backgroundColor: "#FFE5E5" }}
                                    >
                                      <BiTrash size={20} color="#FF4242" />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleSubmitChanges(unit._id)}
                                      style={{ backgroundColor: "#E8FFE5" }}
                                      disabled={!editedFields[unit._id]}
                                    >
                                      <BiCheck size={20} color="#28A745" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane eventKey="brand">
                  <Row>
                    <Col sm={3} className="mb-2">
                      <Card className="rounded-4 p-1 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Create New Brand</h4>
                          <Form autoComplete="off" onSubmit={handleBrandSubmit}>
                            <FormGroup className="mb-3">
                              <FormLabel>Brand Name</FormLabel>
                              <FormControl
                                type="text"
                                placeholder="Brand Name"
                                value={newBrand.name}
                                onChange={handleBrandChange}
                                required
                              />
                            </FormGroup>
                            <Button
                              className="my-3 float-end"
                              type="submit"
                              variant="primary"
                            >
                              Submit
                            </Button>
                          </Form>
                        </div>
                      </Card>
                    </Col>
                    <Col sm={9} className="mb-2" style={{ overflowX: "auto" }}>
                      <Card className="rounded-4 p-2 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Brand List</h4>
                          <Table className="border-none" hover size="sm">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {brands.map((brand) => (
                                <tr key={brand._id}>
                                  <td>{brand._id}</td>
                                  <td>
                                    <FormControl
                                      type="text"
                                      value={editedFields[brand._id]?.name ?? brand.name}
                                      onChange={(e) => handleFieldChange(brand._id, 'name', e.target.value)}
                                      style={{ minWidth: "200px" }}
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td className="d-flex gap-2">
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleDelete(brand._id)}
                                      style={{ backgroundColor: "#FFE5E5" }}
                                    >
                                      <BiTrash size={20} color="#FF4242" />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleSubmitChanges(brand._id)}
                                      style={{ backgroundColor: "#E8FFE5" }}
                                      disabled={!editedFields[brand._id]}
                                    >
                                      <BiCheck size={20} color="#28A745" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane eventKey="manufacturer">
                  <Row>
                    <Col sm={3} className="mb-2">
                      <Card className="rounded-4 p-1 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Create New Manufacturer</h4>
                          <Form autoComplete="off" onSubmit={handleManufacturerSubmit}>
                            <FormGroup className="mb-3">
                              <FormLabel>Manufacturer Name</FormLabel>
                              <FormControl
                                type="text"
                                placeholder="Manufacturer Name"
                                value={newManufacturer.name}
                                onChange={(e) => setNewManufacturer({ ...newManufacturer, name: e.target.value })}
                                required
                              />
                            </FormGroup>
                            <Button
                              className="my-3 float-end"
                              type="submit"
                              variant="primary"
                            >
                              Submit
                            </Button>
                          </Form>
                        </div>
                      </Card>
                    </Col>
                    <Col sm={9} className="mb-2" style={{ overflowX: "auto" }}>
                      <Card className="rounded-4 p-2 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Manufacturer List</h4>
                          <Table className="border-none" hover size="sm">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {manufacturers.map((manufacturer) => (
                                <tr key={manufacturer._id}>
                                  <td>{manufacturer._id}</td>
                                  <td>
                                    <FormControl
                                      type="text"
                                      value={editedFields[manufacturer._id]?.name ?? manufacturer.name}
                                      onChange={(e) => handleFieldChange(manufacturer._id, 'name', e.target.value)}
                                      style={{ minWidth: "200px" }}
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td className="d-flex gap-2">
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleDelete(manufacturer._id)}
                                      style={{ backgroundColor: "#FFE5E5" }}
                                    >
                                      <BiTrash size={20} color="#FF4242" />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleSubmitChanges(manufacturer._id)}
                                      style={{ backgroundColor: "#E8FFE5" }}
                                      disabled={!editedFields[manufacturer._id]}
                                    >
                                      <BiCheck size={20} color="#28A745" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane eventKey="paymentterms">
                  <Row>
                    <Col sm={3} className="mb-2">
                      <Card className="rounded-4 p-1 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Create New Payment Terms</h4>
                          <Form autoComplete="off" onSubmit={handalePaymentTermSubmit}>
                            <FormGroup className="mb-3">
                              <FormLabel>Term Name</FormLabel>
                              <FormControl
                                type="text"
                                placeholder="Term Name"
                                value={newpaymentTerm.name}
                                onChange={(e) => setNewPaymentTerm({ ...newpaymentTerm, name: e.target.value })}
                                required
                              />
                            </FormGroup>
                            <FormGroup className="mb-3">
                              <FormLabel>No of Days</FormLabel>
                              <FormControl
                                type="text"
                                placeholder="No of Days"
                                value={newpaymentTerm.code}
                                onChange={(e) => setNewPaymentTerm({ ...newpaymentTerm, code: e.target.value })}
                                required
                              />
                            </FormGroup>
                            <Button
                              className="my-3 float-end"
                              type="submit"
                              variant="primary"
                            >
                              Submit
                            </Button>
                          </Form>
                        </div>
                      </Card>
                    </Col>
                    <Col sm={9} className="mb-2" style={{ overflowX: "auto" }}>
                      <Card className="rounded-4 p-2 border h-100">
                        <div className="my-3 mx-3">
                          <h4 className="mb-4">Payment Terms List</h4>
                          <Table className="border-none" hover size="sm">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Days</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentTerms.map((term) => (
                                <tr key={term._id}>
                                  <td>{term._id}</td>
                                  <td>
                                    <FormControl
                                      type="text"
                                      value={editedFields[term._id]?.name ?? term.name}
                                      onChange={(e) => handleFieldChange(term._id, 'name', e.target.value)}
                                      style={{ minWidth: "200px" }}
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <FormControl
                                      type="text"
                                      value={editedFields[term._id]?.code ?? term.code}
                                      onChange={(e) => handleFieldChange(term._id, 'code', e.target.value)}
                                      style={{ minWidth: "200px" }}
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td className="d-flex gap-2">
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleDelete(term._id)}
                                      style={{ backgroundColor: "#FFE5E5" }}
                                    >
                                      <BiTrash size={20} color="#FF4242" />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                                      onClick={() => handleSubmitChanges(term._id)}
                                      style={{ backgroundColor: "#E8FFE5" }}
                                      disabled={!editedFields[term._id]}
                                    >
                                      <BiCheck size={20} color="#28A745" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </TabContainer>
      </Row>
    </Container>
  );
};

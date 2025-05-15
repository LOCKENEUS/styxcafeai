import { useState } from "react";
import { Button, Card, Container, Form, FormControl, FormGroup, FormLabel, NavItem, NavLink, TabContainer, TabContent, Table, TabPane } from "react-bootstrap"
import { Nav, Tab, Col, Row } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export const InventorySetting = () => {
    const [activeKey, setActiveKey] = useState("unit");
    const [newUnit, setNewUnit] = useState({ name: "", code: "" });
    const [newBrand, setNewBrand] = useState({ name: "" });
    const [newManufacturer, setNewManufacturer] = useState({ name: "" });
    const [newpaymentTerm, setNewPaymentTerm] = useState({ name: "", noofDays:"" });

    const [units, setUnits] = useState([
        { id: 1, name: "pcs", code: "646" },
        { id: 2, name: "abs", code: "909099" },
    ]);

    const [brands, setBrands] = useState([
        { id: 1, name: "Brand1" },
        { id: 2, name: "Brand2" },
        { id: 3, name: "Brand3" },
    ]);

    const [manufacturers, setManufacturers] = useState([
        { id: 1, name: "Manufacturer1" },
        { id: 2, name: "Manufacturer2" },
        { id: 3, name: "Manufacturer3" },
    ])
    const [paymentTerm, setPaymentTerm] = useState(
        [
            {id:1, name: "checque" ,noofDays:"5"},
            {id:2, name: "cash3" ,noofDays:"0"},
            {id:3, name: "bank transfer" ,noofDays:"3"},
        ]
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
            setUnits([...units, { id: units.length + 1, ...newUnit }]);
            setNewUnit({ name: "", code: "" });
        }
    };

    const handleBrandSubmit = (e) => {
        e.preventDefault();
        if (newBrand.name) {
            setBrands([...brands, { id: brands.length + 1, ...newBrand }]);
            setNewBrand({ name: "" });
        }
    };

    const handalePaymentTermSubmit = (e) => {
        e.preventDefault();
        if (newpaymentTerm.name && newpaymentTerm.noofDays) {
            setPaymentTerm([...paymentTerm, { id: paymentTerm.length + 1, ...newpaymentTerm }]);
            setNewPaymentTerm({ name: "", noofDays:"" });
        }
    }

    const handleManufacturerSubmit = (e) => {
        e.preventDefault();
        if (newManufacturer.name) {
            setManufacturers([...manufacturers, { id: manufacturers.length + 1, ...newManufacturer }]);
            setNewBrand({ name: "" });
        }
    }

    const handleUpdate = (id, name,code , noofDays ) => {
        setUnits(
            units.map((unit1) =>
                unit1.id === id ? { ...unit1, name, code } : unit1
            )
        );
        setManufacturers(
            manufacturers.map((manufacturer) =>
                manufacturer.id === id ? { ...manufacturer, name } : manufacturer
            )
        )
        setBrands(
            brands.map((brand) =>
                brand.id === id ? { ...brand, name } : brand
            )
        )
        setPaymentTerm(
            paymentTerm.map((paymentTerm) =>        
                paymentTerm.id === id ? { ...paymentTerm, name , noofDays} : paymentTerm
            )
        )
    };

    const handleDelete = (id) => {
        setUnits(units.filter((unit) => unit.id !== id));
    };
    const handleDeleteBrand = (id) => {
        setBrands(brands.filter((brand) => brand.id !== id));
    }
    const handleDeletePaymentTerm = (id) => {
        setPaymentTerm(paymentTerm.filter((paymentTerm) => paymentTerm.id !== id));
    }

    const handleDeleteManufacturer = (id) => {
        setManufacturers(manufacturers.filter((manufacturer) => manufacturer.id !== id));
    }


    return (
        <Container>
            <Row>
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1>Inventory Customization Settings</h1>
                </div>

                <TabContainer id="inventory-tabs" activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                    <Row>
                        <Col sm={2} className="tabs-responsive-side">
                            <Nav variant="pills" className="flex-column nav-material nav-left">
                                <NavItem>
                                    <NavLink eventKey="unit">Unit</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink eventKey="brand">Brand</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink eventKey="manufacturer">Manufacturer</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink eventKey="paymentterms">Payment Terms</NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                        <Col sm={10}>
                            <TabContent>
                                <TabPane eventKey="unit">
                                    <Card className="rounded-2 p-2 border">
                                        <Row>
                                            <Col sm={4} className="mb-2">
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
                                                    <Button type="submit" variant="primary">
                                                        Submit
                                                    </Button>
                                                </Form>
                                            </Col>
                                            <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
                                                <h4 className="mb-4">Unit List</h4>
                                                <Table striped bordered hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Unit Code</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {units.map((unit) => (
                                                            <tr key={unit.id}>
                                                                <td>{unit.id}</td>
                                                                <td>
                                                                    <FormControl
                                                                        type="text"
                                                                        value={unit.name}
                                                                        onChange={(e) => handleUpdate(unit.id,e.target.value)} 
                                                                        style={{ minWidth: "200px" }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <FormControl 
                                                                    type="text"
                                                                     value={unit.code}
                                                                      onChange={(e) => handleUpdate(unit.id,e.target.value)}
                                                                       style={{ minWidth: "200px" }} 
                                                                       />
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        className="px-2"
                                                                        onClick={() => handleDelete(unit.id)}
                                                                    >
                                                                        <ImCross />
                                                                    </Button>
                                                                    <Button
                                                                            variant="outline-success"
                                                                            size="sm"
                                                                            className="px-2 mx-2"
                                                                            // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        >
                                                                            
                                                                            <FaCheck /> 
                                                                        </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Card>
                                </TabPane>

                                <TabPane eventKey="brand">
                                    <Card className="rounded-2 p-2 border">
                                        <Row>
                                            <Col sm={4} className="mb-2">
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
                                                    <Button type="submit" variant="primary">
                                                        Submit
                                                    </Button>
                                                </Form>
                                            </Col>
                                            <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
                                                <h4 className="mb-4">Brand List</h4>
                                                <Table striped bordered hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {brands.map((brand) => (
                                                            <tr key={brand.id}>
                                                                <td>{brand.id}</td>
                                                                <td><FormControl type="text" value={brand.name}  /></td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        className="px-2 mx-2"
                                                                        // onClick={() =>
                                                                        //     setBrands(brands.filter((b) => b.id !== brand.id))
                                                                        // }
                                                                        onClick={() => handleDeleteBrand(brand.id)}
                                                                       
                                                                    >
                                                                        <ImCross />
                                                                            </Button>
                                                                            <Button
                                                                            variant="outline-success"
                                                                            size="sm"
                                                                            className="px-2"
                                                                            // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        >
                                                                            
                                                                            <FaCheck /> 
                                                                        </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Card>
                                </TabPane>

                                <TabPane eventKey="manufacturer">
                                <Card className="rounded-2 p-2 border">
                                        <Row>
                                            <Col sm={4} className="mb-2">
                                                <h4 className="mb-4">Create New Manufacturer </h4>
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
                                                    <Button type="submit" variant="primary">
                                                        Submit
                                                    </Button>
                                                </Form>
                                            </Col>
                                            <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
                                                <h4 className="mb-4">Manufacturer List</h4>
                                                <Table striped bordered hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {manufacturers.map((brand) => (
                                                            <tr key={brand.id}>
                                                                <td>{brand.id}</td>
                                                                <td><FormControl type="text" value={brand.name} 
                                                                onChange={(e) => handleUpdate(brand.id, e.target.value)} 
                                                                />
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        className="px-2 mx-2"
                                                                        onClick={() =>handleDeleteManufacturer(brand.id) }
                                                                    >
                                                                        <ImCross />
                                                                            </Button>
                                                                            <Button
                                                                            variant="outline-success"
                                                                            size="sm"
                                                                            className="px-2"
                                                                            // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        >
                                                                            
                                                                            <FaCheck /> 
                                                                        </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Card>
                                </TabPane>

                                <TabPane eventKey="paymentterms">
                                <Card className="rounded-2 p-2 border">
                                        <Row>
                                            <Col sm={4} className="mb-2">
                                                <h4 className="mb-4">Create New Payment Terms </h4>
                                                <Form autoComplete="off" onSubmit={handalePaymentTermSubmit}>
                                                    <FormGroup className="mb-3">
                                                        <FormLabel>Term name</FormLabel>
                                                        <FormControl
                                                            type="text"
                                                            placeholder="Manufacturer Name"
                                                            value={newpaymentTerm.name}
                                                            onChange={(e) => setNewPaymentTerm({ ...newpaymentTerm, name: e.target.value })}
                                                            required
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-3">
                                                        <FormLabel>No of days</FormLabel>
                                                        <FormControl
                                                            type="text"
                                                            placeholder="No of days"
                                                            value={newpaymentTerm.noofDays}
                                                            onChange={(e) => setNewPaymentTerm({ ...newpaymentTerm, noofDays: e.target.value })}
                                                            required
                                                        />
                                                    </FormGroup>
                                                    <Button type="submit" variant="primary">
                                                        Submit
                                                    </Button>
                                                </Form>
                                            </Col>
                                            <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
                                                <h4 className="mb-4">Payment Terms List</h4>
                                                <Table striped bordered hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th> Days</th>
                                                            <th>Action</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paymentTerm.map((brand) => (
                                                            <tr key={brand.id}>
                                                                <td>{brand.id}</td>
                                                                <td><FormControl type="text"  value={brand.name} onChange={(e) => handleUpdate(brand.id, e.target.value)} /></td>
                                                                <td><FormControl type="text"  value={brand.noofDays} onChange={(e) => handleUpdate(brand.id, e.target.value)} /></td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        className="px-2 mx-1"
                                                                        onClick={() => handleDeletePaymentTerm(brand.id)}
                                                                    >
                                                                        <ImCross />
                                                                            </Button>
                                                                            <Button
                                                                            variant="outline-success"
                                                                            size="sm"
                                                                            className="px-2 mx-1"
                                                                            // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        >
                                                                            
                                                                            <FaCheck /> 
                                                                        </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Card>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </TabContainer>
            </Row>
        </Container>
    );
};

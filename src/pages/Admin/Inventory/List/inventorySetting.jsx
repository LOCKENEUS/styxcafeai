import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card, Container, Form, FormControl, FormGroup, FormLabel, Image, NavItem, NavLink, TabContainer, TabContent, Table, TabPane } from "react-bootstrap"
import { Nav, Tab, Col, Row } from "react-bootstrap";
import deleteplogo from "/assets/inventory/Vector (1).png";
import check from "/assets/inventory/Check.png"


export const InventorySettingAdmin = () => {
    const [activeKey, setActiveKey] = useState("unit");
    const [newUnit, setNewUnit] = useState({ name: "", code: "" });
    const [newBrand, setNewBrand] = useState({ name: "" });
    const [newManufacturer, setNewManufacturer] = useState({ name: "" });
    const [newpaymentTerm, setNewPaymentTerm] = useState({ name: "", noofDays: "" });


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
            { id: 1, name: "checque", noofDays: "5" },
            { id: 2, name: "cash3", noofDays: "0" },
            { id: 3, name: "bank transfer", noofDays: "3" },
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
            console.log(units);
        }
    };

    const handleBrandSubmit = (e) => {
        e.preventDefault();
        if (newBrand.name) {
            setBrands([...brands, { id: brands.length + 1, ...newBrand }]);
            setNewBrand({ name: "" });
            console.log("brands -------", brands);
        }
    };

    const handalePaymentTermSubmit = (e) => {
        e.preventDefault();
        if (newpaymentTerm.name && newpaymentTerm.noofDays) {
            setPaymentTerm([...paymentTerm, { id: paymentTerm.length + 1, ...newpaymentTerm }]);
            setNewPaymentTerm({ name: "", noofDays: "" });
            console.log("brands -------", paymentTerm);
        }
    }

    const handleManufacturerSubmit = (e) => {
        e.preventDefault();
        if (newManufacturer.name) {
            setManufacturers([...manufacturers, { id: manufacturers.length + 1, ...newManufacturer }]);
            setNewBrand({ name: "" });
            console.log("brands -------", manufacturers);
        }
    }

    const handleUpdate = (id, name, code, noofDays) => {
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
                paymentTerm.id === id ? { ...paymentTerm, name, noofDays } : paymentTerm
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

                <TabContainer id="inventory-tabs" activeKey={activeKey} onSelect={(k) => setActiveKey(k)} >
                    <Row>
                        <Col sm={6} className="tabs-responsive-side my-4 ">
                            <Card className="rounded-4 p-1 border">
                                <Nav variant="pills" className="nav-material justify-content-center ">
                                    <NavItem>
                                        <NavLink eventKey="unit" className={activeKey === "unit" ? "bg-primary text-white" : ""}
                                     
                                        >Unit</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink eventKey="brand" className={activeKey === "brand" ? "bg-primary text-white" : ""}
                                        >Brand</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink eventKey="manufacturer" className={activeKey === "manufacturer" ? "bg-primary text-white" : ""}
                                        >Manufacturer</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink eventKey="paymentterms" className={activeKey === "paymentterms" ? "bg-primary text-white" : ""    }>Payment Terms</NavLink>
                                    </NavItem>
                                </Nav>
                            </Card>
                        </Col>
                        <Col sm={6}></Col>
                        <Col sm={12}>
                            <TabContent>
                                <TabPane eventKey="unit">

                                    <Row>
                                        <Col sm={4} className="mb-2">
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
                                                        <Button className="my-3 float-end" type="submit" variant="primary">
                                                            Submit
                                                        </Button>
                                                    </Form>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
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
                                                                <tr key={unit.id}>
                                                                    <td>{unit.id}</td>
                                                                    <td>
                                                                        <FormControl
                                                                            type="text"
                                                                            value={unit.name}
                                                                            onChange={(e) => handleUpdate(unit.id, e.target.value)}
                                                                            style={{ minWidth: "200px" }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <FormControl
                                                                            type="text"
                                                                            value={unit.code}
                                                                            onChange={(e) => handleUpdate(unit.id, e.target.value)}
                                                                            style={{ minWidth: "200px" }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 rounded-3"
                                                                            onClick={() => handleDelete(unit.id)}
                                                                      style={{backgroundColor:"#FFD9DA"}}
                                                                        
                                                                        >
                                                                            <Image src={deleteplogo} className="mx-2" />
                                                                        </Button>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 mx-2 rounded-3"
                                                                            style={{backgroundColor:"#D1FFC8"}}
                                                                        // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        >

                                                                            <Image src={check} className="mx-2"/>
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
                                        <Col sm={4} className="mb-2">
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
                                                        <Button className="my-3 float-end" type="submit" variant="primary">
                                                            Submit
                                                        </Button>
                                                    </Form>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
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
                                                                <tr key={brand.id}>
                                                                    <td>{brand.id}</td>
                                                                    <td><FormControl type="text" value={brand.name} /></td>
                                                                    <td>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 mx-2 rounded-3"
                                                                            // onClick={() =>
                                                                            //     setBrands(brands.filter((b) => b.id !== brand.id))
                                                                            // }
                                                                            onClick={() => handleDeleteBrand(brand.id)}
                                                                            style={{backgroundColor:"#FFD9DA"}}

                                                                        >
                                                                            <Image src={deleteplogo} className="mx-2" />
                                                                        </Button>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 rounded-3"
                                                                            style={{backgroundColor:"#D1FFC8"}}
                                                                        // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        >

                                                                            <Image src={check} className="mx-2" />
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
                                        <Col sm={4} className="mb-2">
                                            <Card className="rounded-4 p-1 border h-100">
                                                <div className="my-3 mx-3">
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
                                                        <Button className="my-3 float-end" type="submit" variant="primary">
                                                            Submit
                                                        </Button>
                                                    </Form>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
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
                                                            {manufacturers.map((brand) => (
                                                                <tr key={brand.id}>
                                                                    <td>{brand.id}</td>
                                                                    <td><FormControl type="text" value={brand.name}
                                                                        onChange={(e) => handleUpdate(brand.id, e.target.value)}
                                                                    />
                                                                    </td>
                                                                    <td>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 mx-2 rounded-3"
                                                                            onClick={() => handleDeleteManufacturer(brand.id)}
                                                                            style={{backgroundColor:"#FFD9DA"}}
                                                                        >
                                                                            <Image src={deleteplogo} className="mx-2"/>
                                                                        </Button>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 rounded-3"
                                                                            style={{backgroundColor:"#D1FFC8"}}
                                                                        // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        >

                                                                            <Image src={check} className="mx-2"/>
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
                                    {/* <Card className="rounded-2 p-2 border"> */}
                                    <Row >

                                        <Col sm={4} className="mb-2 ">
                                            <Card className="rounded-2 p-2 border ">
                                                <div className="mx-4 my-4">

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
                                                        <Button className="my-3 float-end" type="submit" variant="primary">
                                                            Submit
                                                        </Button>
                                                    </Form>

                                                </div>
                                            </Card>
                                        </Col>


                                        <Col sm={8} className="mb-2" style={{ overflowX: "auto" }}>
                                            <Card className="rounded-2 p-2 border h-100">
                                                <div className="mx-4 my-4">
                                                    <h4 className="mb-4">Payment Terms List</h4>
                                                    <Table className="border-none" hover size="sm">
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                <th>Name</th>
                                                                <th> Days</th>
                                                                <th>Action</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paymentTerm.map((brand) => (
                                                                <tr key={brand.id}>
                                                                    <td>{brand.id}</td>
                                                                    <td><FormControl type="text" value={brand.name} onChange={(e) => handleUpdate(brand.id, e.target.value)} /></td>
                                                                    <td><FormControl type="text" value={brand.noofDays} onChange={(e) => handleUpdate(brand.id, e.target.value)} /></td>
                                                                    <td>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 mx-1 rounded-3"
                                                                            onClick={() => handleDeletePaymentTerm(brand.id)}
                                                                            style={{backgroundColor:"#FFD9DA"}}
                                                                        >
                                                                            <Image src={deleteplogo} className="mx-2"/>
                                                                        </Button>
                                                                        <Button
                                                                            variant=""
                                                                            size="sm"
                                                                            className="px-2 mx-1 rounded-3"
                                                                        // onClick={() => handleUpdate(unit.id, unit.name, unit.code)}
                                                                        style={{backgroundColor:"#D1FFC8"}}
                                                                        >

                                                                            <Image src={check} className="mx-2" />
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
                                    {/* </Card> */}
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </TabContainer>
            </Row>
        </Container>
    );
};
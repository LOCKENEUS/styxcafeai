import { useState } from "react";
import { Card, Col, Container, FormControl, InputGroup, Button, Breadcrumb, BreadcrumbItem, Row, Image, Pagination, Table } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { useNavigate } from "react-router-dom";
import gm1 from '/assets/inventory/mynaui_search.svg'
import solar_export from '/assets/inventory/solar_export-linear.png'
import add from '/assets/inventory/material-symbols_add-rounded.png'
import { BsCurrencyRupee } from "react-icons/bs";

const ItemsList = () => {
    const [searchText, setSearchText] = useState("");
    const navigator = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(3 / itemsPerPage);

    const getRandomColor = (name) => {
        const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
        let index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const itemsData = [
        { sn: 1, name: "Alice", price: "231", stock: "231", sku: "231", hsn: "231", unit: "231", dimension: "231" },
        { sn: 2, name: "Bob", price: "231", stock: "231", sku: "231", hsn: "231", unit: "231", dimension: "231" },
        { sn: 3, name: "Charlie", price: "231", stock: "231", sku: "231", hsn: "231", unit: "231", dimension: "231" }
    ];

    const filteredItems = itemsData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setActivePage(page);
        }
    };

    const handleShowCreate = () => {
        navigator("/admin/inventory/create-items");
    }

    const generateCSV = () => {
        const headers = ["SN", "Item Name", "Price", "Stock", "SKU", "HSN", "Unit", "Dimension"];
        const rows = itemsData.map(item => [
            item.sn, item.name, item.price, item.stock, item.sku, item.hsn, item.unit, item.dimension
        ]);
        
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'items_list.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Container fluid className="mt-4 min-vh-100">
            
            <Row>
                <Col sm={12}>
                    <Breadcrumb>
                        <BreadcrumbItem href="#">Home</BreadcrumbItem>
                        <BreadcrumbItem href="#">Purchase</BreadcrumbItem>
                        <BreadcrumbItem active>Items List</BreadcrumbItem>
                    </Breadcrumb>
                </Col>

       
                    <Row>
                        <Col sm={4} className="d-flex">
                            <h1 className="mx-1 my-4" style={{ fontSize: "18px", fontWeight: "500" }}>Items List</h1>
                        </Col>

                        <Col sm={4} className="d-flex">
                            <InputGroup className="mx-1 my-3">
                                <InputGroupText className="border-0" style={{ background: "#FAFAFA" }}>
                                    <Image src={gm1} />
                                </InputGroupText>
                                <FormControl
                                    type="search"
                                    size="sm"
                                    placeholder="Search for vendors"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                                />
                            </InputGroup>
                        </Col>

                        <Col sm={4} style={{height:"50px" , marginTop:"auto"}} className="d-flex align-items-center justify-content-end">
                            <Button variant="white" className=" border-1 border-danger text-danger" size="sm" onClick={generateCSV}>
                                <Image className="me-2" style={{ width: "22px", height: "22px" }} src={solar_export} />
                                Export
                            </Button>
                            <Button variant="primary" className="mx-2" size="sm" onClick={handleShowCreate}>
                                <Image className="me-2" style={{ width: "22px", height: "22px" }} src={add} />
                                New Items
                            </Button>
                        </Col>

                        <Col sm={12}>
                            <Table striped style={{ minWidth: '600px', marginTop: "2rem" }}>
                                <thead style={{ backgroundColor: '#0062FF0D' }}>
                                    <tr>
                                        {['S/N', 'Item Name', 'Price', 'Stock', 'SKU', 'HSN', 'Unit', 'Dimension'].map((header, index) => (
                                            <th key={index} style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody style={{ backgroundColor: "#F5F5F5" }}>
                                    {filteredItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex gap-2 align-items-center" onClick={() => navigator("/admin/inventory/item-details")}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: getRandomColor(item.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {item.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: "bold", cursor: "pointer", color: "#0062FF" }}>{item.name}</span>
                                                </div>
                                            </td>
                                            <td><BsCurrencyRupee /> {item.price}</td>
                                            <td>{item.stock}</td>
                                            <td>{item.sku}</td>
                                            <td>{item.hsn}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.dimension}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
               
            </Row>
        </Container>
    );
}

export default ItemsList;
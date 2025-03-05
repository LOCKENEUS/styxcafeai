import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import DataTable from "react-data-table-component";
import { BiSearch } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export const SaleOrder = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const columns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, width: "80px" },
        { name: " Order No", selector: (row) => row.orderNo, sortable: true },
        { name: "Client", selector: (row) => row.name, sortable: true },
        { name: "Status", selector: (row) => row.status, sortable: true },      
        { name: "Shipment Date", selector: (row) => row.shipmentDate, sortable: true },
       


    ];

    const itemsData = [
        { sn: 1, name: "5Item ", status: " 100",  shipmentDate: "cash", orderNo: "1234567890"},
        { sn: 2, name: "1Item 22", status: " 200",  shipmentDate: "online", orderNo: "9876543210" },
        { sn: 3, name: "Item 3", status: " 150",  shipmentDate: "online", orderNo: "1122334455"},
    ];

    const filteredItems = itemsData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shipmentDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.transactionID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.timing.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) 

    );

    return (

        <Container>
            <div className="d-flex justify-content-center align-items-center">
                <h1>Sales Order List</h1>
            </div>
            <Col md={12} className="my-4">
                <Card>
                    <CardHeader className="d-md-flex justify-content-between align-items-center">
                        <div className="mb-2 mb-md-0">
                            <Form>
                                <InputGroup className="input-group-merge input-group-flush">
                                    <InputGroupText>
                                        <BiSearch />
                                    </InputGroupText>
                                    <FormControl
                                        type="search"
                                        placeholder="Search items"
                                        aria-label="Search items"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </InputGroup>
                            </Form>
                        </div>

                        {/* Link to open the itemCreate page */}
                        <Link to="/Inventory/PurchaseOrderCreate">
                            <Button variant="primary" className="mb-3">
                                <FaPlus className="me-2" /> New SO
                            </Button>
                        </Link>


                       
                    </CardHeader>
                    <CardBody>
                        <DataTable
                            columns={columns}
                            data={filteredItems}
                            pagination
                            highlightOnHover
                            //   striped
                            responsive
                            persistTableHead
                            customStyles={{
                                rows: {
                                    style: {
                                        backgroundColor: "#ffffff", // default row color
                                    },
                                },
                                headCells: {
                                    style: {
                                        backgroundColor: "#f1f1f1", // header row color
                                    },
                                },
                            }}
                            conditionalRowStyles={[
                                {
                                    when: (row, index) => index % 2 === 0,
                                    style: {
                                        backgroundColor: "#f8f9fa", // Light background color for even rows
                                    },
                                },
                            ]}
                        />
                    </CardBody>
                </Card>
            </Col>


        </Container>
    );
}
import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import DataTable from "react-data-table-component";
import { BiSearch } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export const InvoicePayments = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const columns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, width: "80px" },
        { name: " Invoice No", selector: (row) => row.invoiceNo, sortable: true },
        { name: "Vendor", selector: (row) => row.vendor, sortable: true },
        { name: "Amount", selector: (row) => row.amount, sortable: true },      
        { name: " Mode", selector: (row) => row.mode, sortable: true },
        { name: "transactionID", selector: (row) => row.transactionID, sortable: true },
        { name: "Timing", selector: (row) => row.timing, sortable: true },
    ];

    const itemsData = [
        { sn: 1, vendor: "5Item ", amount: " 100",  mode: "online", invoiceNo: "1234567890",transactionID:"7234567890" ,timing:"1234567890"},
        { sn: 2, vendor: "1Item 22", amount: " 200",  mode: "cash", invoiceNo: "9876543210",transactionID:"123456890",timing:"123406890" },
        { sn: 3, vendor: "Item 3", amount: " 150",  mode: "online", invoiceNo: "1122334455" , transactionID:"1244567890",timing:"12345689"},
    ];

    const filteredItems = itemsData.filter((item) =>
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.transactionID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amount.toLowerCase().includes(searchQuery.toLowerCase()) 

    );

    return (

        <Container>
            <div className="d-flex justify-content-center align-items-center">
                <h1>Invoice Payment List</h1>
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
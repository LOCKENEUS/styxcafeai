import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import DataTable from "react-data-table-component";
import { BiSearch } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export const PurchaseReceived = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const columns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, width: "80px" },
        // { name: " Receive No", selector: (row) => row.receiveNo, sortable: true },
        { name: "Receive No", selector: (row) => row.receiveNo, sortable: true ,
            cell: (row) => (
                <span style={{ color: "#007bff", cursor: "pointer" }}
                onClick={() => handleRowClick(row)}>
                    {row.name}
                </span>
            ),
         },
         { name: " Vendor", selector: (row) => row.name, sortable: true },
        { name: "Status", selector: (row) => row.Status, sortable: true },
        { name: "Delivery Date", selector: (row) => row.deliveryDate, sortable: true }

    ];
    const handleRowClick = (row) => {
        // Handle row click logic here
        console.log("Row clicked:", row);
          navigate("/Inventory/PurchaseReceivedDetails", { state: { vendor: row } });
      };

    const itemsData = [
        { sn: 1, name: "5Item ", Status: " 100",  deliveryDate: "ABC123", receiveNo: "1234567890" },
        { sn: 2, name: "1Item 22", Status: " 200",  deliveryDate: "DEF456", receiveNo: "9876543210" },
        { sn: 3, name: "Item 3", Status: " 150",  deliveryDate: "GHI789", receiveNo: "1122334455" },
    ];

    const filteredItems = itemsData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deliveryDate.toLowerCase().includes(searchQuery.toLowerCase())

    );

    return (

        <Container>
            <div className="d-flex justify-content-center align-items-center">
                <h1>Purchase Received List</h1>
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
                        <Link to="/Inventory/PurchaseReceived/Create">
                            <Button variant="primary" className="mb-3">
                                <FaPlus className="me-2" /> New PR
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
    )
}
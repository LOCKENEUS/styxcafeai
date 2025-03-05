import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import DataTable from "react-data-table-component";
import { BiSearch } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


export const PurchaseOrder = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const columns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, width: "80px" },
        { name: " Order No", selector: (row) => row.purchase_order_no, sortable: true ,
            cell: (row) => (
                <span style={{ color: "#007bff", cursor: "pointer" }}
                onClick={() => handleRowClick(row)}
                >
                    {row.name}
                </span>
            )
        },
        { name: "Vendor", selector: (row) => row.name, sortable: true },
        { name: "Status", selector: (row) => row.Status, sortable: true },
        { name: "Amount", selector: (row) => row.amount, sortable: true },
        { name: "Delivery Date", selector: (row) => row.deliveryDate, sortable: true }

    ];

    const itemsData = [
        { sn: 1, name: "Krunal  ", Status: "Default", amount: 10, deliveryDate: "10/02/2008", purchase_order_no: "PO-900 " },
        { sn: 2, name: "Rohit ", Status: "Recived", amount: 20, deliveryDate: "12/02/2008", purchase_order_no: "PO-901" },
        { sn: 3, name: "Pankaj", Status: "Pending", amount: 5, deliveryDate: "14/02/2008", purchase_order_no: "PO-903" },
    ];

    const filteredItems = itemsData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deliveryDate.toLowerCase().includes(searchQuery.toLowerCase())

    );

    const handleRowClick = (row) => {
        // Handle row click logic here
        console.log("Row clicked:", row);
          navigate("/Inventory/PurchaseOrderDetails", { state: { vendor: row } });
      };

    return (

        <Container fluid className='p-4 m-0' style={{ backgroundColor: "#F2F2F2"}}>
            <div className="d-flex justify-content-center align-items-center">
                <h1>Purchase Order List</h1>
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
                                <FaPlus className="me-2" /> New PO
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
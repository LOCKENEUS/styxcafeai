// import { useState } from "react";
// import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";
// import InputGroupText from "react-bootstrap/esm/InputGroupText";
// import DataTable from "react-data-table-component";
// import { BiSearch } from "react-icons/bi";
// import { FaPlus } from "react-icons/fa";
// import { Link } from "react-router-dom";

// export const InvoicePayments = () => {
//     const [searchQuery, setSearchQuery] = useState("");

//     const columns = [
//         { name: "SN", selector: (row) => row.sn, sortable: true, width: "80px" },
//         { name: " Invoice No", selector: (row) => row.invoiceNo, sortable: true },
//         { name: "Vendor", selector: (row) => row.vendor, sortable: true },
//         { name: "Amount", selector: (row) => row.amount, sortable: true },      
//         { name: " Mode", selector: (row) => row.mode, sortable: true },
//         { name: "transactionID", selector: (row) => row.transactionID, sortable: true },
//         { name: "Timing", selector: (row) => row.timing, sortable: true },
//     ];

//     const itemsData = [
//         { sn: 1, vendor: "5Item ", amount: " 100",  mode: "online", invoiceNo: "1234567890",transactionID:"7234567890" ,timing:"1234567890"},
//         { sn: 2, vendor: "1Item 22", amount: " 200",  mode: "cash", invoiceNo: "9876543210",transactionID:"123456890",timing:"123406890" },
//         { sn: 3, vendor: "Item 3", amount: " 150",  mode: "online", invoiceNo: "1122334455" , transactionID:"1244567890",timing:"12345689"},
//     ];

//     const filteredItems = itemsData.filter((item) =>
//         item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.transactionID.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.amount.toLowerCase().includes(searchQuery.toLowerCase()) 

//     );

//     return (

//         <Container>
//             <div className="d-flex justify-content-center align-items-center">
//                 <h1>Invoice Payment List</h1>
//             </div>
//             <Col md={12} className="my-4">
//                 <Card>
//                     <CardHeader className="d-md-flex justify-content-between align-items-center">
//                         <div className="mb-2 mb-md-0">
//                             <Form>
//                                 <InputGroup className="input-group-merge input-group-flush">
//                                     <InputGroupText>
//                                         <BiSearch />
//                                     </InputGroupText>
//                                     <FormControl
//                                         type="search"
//                                         placeholder="Search items"
//                                         aria-label="Search items"
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                     />
//                                 </InputGroup>
//                             </Form>
//                         </div>





//                     </CardHeader>
//                     <CardBody>
//                         <DataTable
//                             columns={columns}
//                             data={filteredItems}
//                             pagination
//                             highlightOnHover
//                             //   striped
//                             responsive
//                             persistTableHead
//                             customStyles={{
//                                 rows: {
//                                     style: {
//                                         backgroundColor: "#ffffff", // default row color
//                                     },
//                                 },
//                                 headCells: {
//                                     style: {
//                                         backgroundColor: "#f1f1f1", // header row color
//                                     },
//                                 },
//                             }}
//                             conditionalRowStyles={[
//                                 {
//                                     when: (row, index) => index % 2 === 0,
//                                     style: {
//                                         backgroundColor: "#f8f9fa", // Light background color for even rows
//                                     },
//                                 },
//                             ]}
//                         />
//                     </CardBody>
//                 </Card>
//             </Col>


//         </Container>
//     );
// }






















import React from 'react'
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Col,
    Container,
    FormControl,
    Image,
    InputGroup,
    Row,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import gm1 from "/assets/inventory/mynaui_search.svg";
import solar_export from "/assets/inventory/solar_export-linear.png";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from '../Loader/Loader';
import { getInvoicePaymentList } from '../../../store/slices/Inventory/invoiceSlice';

export const InvoicePayments = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getInvoicePaymentList());
    }, [dispatch])

    const { invoicePaymentList, loading } = useSelector(state => state.saSalesInvoice);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(3 / itemsPerPage);

    // Function to handle modal (replace with actual logic
    const getRandomColor = (name) => {
        const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
        let index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
        return colors[index];
    };

    const itemsData = Array.isArray(invoicePaymentList)
        ? invoicePaymentList.map((item, index) => ({
            sn: index + 1,
            invoice_id: item?.bill_id?.po_no || "N/A",
            vendor: item?.bill_id?.customer_id?.name || "N/A",
            amount: item?.deposit_amount || "N/A",
            mode: item?.mode || "N/A",
            transactionID: item?.transaction_id || "N/A",
            timing: item?.deposit_date
                ? new Date(item.deposit_date).toISOString().split("T")[0]
                : "N/A",
        }))
        : [];

    const columns = [
        {
            name: "SN",
            selector: (row) => row.sn,
            minWidth: "70px",
            maxWidth: "70px",
        },
        {
            name: "Invoice No",
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <div>
                        <div
                            style={{ color: "#0062FF", cursor: "pointer" }}
                            onClick={() => handleShowDetails(row._id)}
                        >
                            {row?.invoice_id}
                        </div>
                    </div>
                </div>
            ),
        },
        { name: "Vendor", selector: (row) => row?.vendor, sortable: true },
        { name: "Amount", selector: (row) => row?.amount, sortable: true },
        { name: "Mode", selector: (row) => row?.mode, sortable: true },
        { name: "Transaction ID", selector: (row) => row?.transactionID, sortable: true },
        {
            name: "Timing",
            selector: (row) => row.timing,
            sortable: true,
        },
    ];

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setActivePage(page);
        }
    };

    const handleShowDetails = (id) => {
        navigate(`/Inventory/SaleInvoice/View/${id}`);
    }
    const filteredItems = itemsData.filter((item) =>
        item.invoice_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.timing.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
        const headers = ["S/N", "Pack No", "Client", "Status", "Delivery Date"];
        const rows = shipmentList?.selectedItem?.map(item => [
            item.sn, item.name, item.vendor, item.status, item.delivery_date
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
        <Container data-aos="fade-right" data-aos-duration="1000" fluid className="mt-4 min-vh-100">
            <Row>
                <Col sm={12} className="mx-2 my-3 px-5">
                    <div style={{ top: "186px", fontSize: "16px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link to="/superadmin/dashboard">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link to="/Inventory/dashboard">Inventory</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>Invoice Payment List</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                {/* Items List Card */}
                <Col sm={12}>

                    <Card className="mx-4 p-3">
                        <Row className="align-items-center">
                            {/* Title */}
                            <Col sm={4} className="d-flex my-2">
                                <h2
                                    style={{
                                        textTransform: 'uppercase',
                                        letterSpacing: '5px',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        // background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                                        background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                    className="m-0"
                                >
                                    INVOICE PAYMENT LIST
                                </h2>
                            </Col>

                            {/* Search Input */}
                            <Col sm={3} className="d-flex my-2">
                                <InputGroup className="navbar-input-group">
                                    <InputGroupText
                                        className="border-0"
                                        style={{ backgroundColor: "#FAFAFA" }}
                                    >
                                        <Image src={gm1} />
                                    </InputGroupText>

                                    <FormControl
                                        type="search"
                                        size="sm"
                                        placeholder="Search..."
                                        aria-label="Search in docs"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ backgroundColor: "#FAFAFA", border: "none" }}
                                    />

                                    {searchQuery && (
                                        <InputGroupText
                                            as="button"
                                            className="border-0 bg-transparent"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            ✖
                                        </InputGroupText>
                                    )}
                                </InputGroup>
                            </Col>

                            {/* Action Buttons */}
                            <Col sm={5} className="d-flex justify-content-end text-end my-2">
                                <Button variant="denger" className="btn  px-4 mx-2" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }} onClick={handleExport}>
                                    <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={solar_export} />
                                    Export
                                </Button>
                            </Col>

                            <Col sm={12} style={{ marginTop: "30px" }}>
                                <DataTable
                                    columns={columns}
                                    data={filteredItems}
                                    progressPending={loading}
                                    progressComponent={<div><Loader /></div>}
                                    highlightOnHover
                                    responsive
                                    persistTableHead
                                    pagination
                                    paginationPerPage={10}
                                    paginationRowsPerPageOptions={[10, 20, 30, 40]}
                                    customStyles={{
                                        rows: {
                                            style: {
                                                backgroundColor: "#ffffff", padding: 'clamp(10px, 2vw, 15px)',
                                                border: 'none',
                                                fontSize: '14px',
                                            }
                                        },
                                        headCells: {
                                            style: {
                                                backgroundColor: "#e9f5f8", padding: 'clamp(10px, 2vw, 15px)',
                                                border: 'none',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                            },
                                        },
                                        table: { style: { borderRadius: "5px", overflow: "hidden" } },
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card></Col>
            </Row>
        </Container>
    );
};
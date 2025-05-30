// import { useState } from "react";
// import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";
// import InputGroupText from "react-bootstrap/esm/InputGroupText";
// import DataTable from "react-data-table-component";
// import { BiSearch } from "react-icons/bi";
// import { FaPlus } from "react-icons/fa";
// import { Link } from "react-router-dom";

// export const SaleOrder = () => {
//     const [searchQuery, setSearchQuery] = useState("");

//     const columns = [
//         { name: "SN", selector: (row) => row.sn, sortable: true, width: "80px" },
//         { name: " Order No", selector: (row) => row.orderNo, sortable: true },
//         { name: "Client", selector: (row) => row.name, sortable: true },
//         { name: "Status", selector: (row) => row.status, sortable: true },      
//         { name: "Shipment Date", selector: (row) => row.shipmentDate, sortable: true },



//     ];

//     const itemsData = [
//         { sn: 1, name: "5Item ", status: " 100",  shipmentDate: "cash", orderNo: "1234567890"},
//         { sn: 2, name: "1Item 22", status: " 200",  shipmentDate: "online", orderNo: "9876543210" },
//         { sn: 3, name: "Item 3", status: " 150",  shipmentDate: "online", orderNo: "1122334455"},
//     ];

//     const filteredItems = itemsData.filter((item) =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.shipmentDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.transactionID.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.timing.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.status.toLowerCase().includes(searchQuery.toLowerCase()) 

//     );

//     return (

//         <Container>
//             <div className="d-flex justify-content-center align-items-center">
//                 <h1>Sales Order List</h1>
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

//                         {/* Link to open the itemCreate page */}
//                         <Link to="/Inventory/SalesOrderCreate">
//                             <Button variant="primary" className="mb-3">
//                                 <FaPlus className="me-2" /> New SO
//                             </Button>
//                         </Link>



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


















import { useState, useEffect } from "react";
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
import add from "/assets/inventory/material-symbols_add-rounded.png";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { getsalesOrders } from "../../../store/slices/Inventory/soSlice";
// import { format } from "date-fns";

export const SaleOrder = () => {
  // State for search input
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const { salesOrders, loading, error } = useSelector((state) => state.saSalesOrder);

  useEffect(() => {
    dispatch(getsalesOrders());
  }, [dispatch]);

  // Function to handle modal (replace with actual logic)
  const handleShowCreate = () => {
    navigate("/Inventory/SalesOrderCreate");
  };

  const getRandomColor = (name) => {
    const colors = [
      "#FAED39",
      "#FF5733",
      "#33FF57",
      "#339FFF",
      "#FF33F6",
      "#FFAA33",
      "#39DDFA",
      "#3DFF16",
    ];
    let index = name.charCodeAt(0) % colors.length; // Generate a consistent index
    return colors[index];
  };

  const handleShowDetails = (id) => {
    navigate(`/Inventory/SalesOrderDetails/${id}`);
  };

  const columns = [
    {
      name: "SN",
      selector: (row, index) => index + 1,
      minWidth: "70px",
      maxWidth: "70px",
    },
    {
      name: "Order No",
      selector: (row) => row.po_no,
      sortable: true,
      cell: (row) => (
        <div>
          <div
            style={{ color: "#0062FF", cursor: "pointer" }}
            onClick={() => handleShowDetails(row._id)}
          >
            {row.po_no}
          </div>
        </div>
      ),
    },
    {
      name: "Client",
      selector: (row) => row.customer_id?.name || row?.cafe?.name,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => row.total,
      sortable: true,
      cell: (row) => (
        <span>
         ₹ {row.total ? row.total : "N/A"}
        </span>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.delivery_date,
      sortable: true,
      cell: (row) => {
        // Extract only the date part from the ISO string
        if (!row.delivery_date) return "N/A";
        const date = new Date(row.delivery_date);
        if (isNaN(date)) return "Invalid Date";
        return `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
      },
    },
  ];

  const totalPages = Math.ceil((salesOrders?.length || 0) / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const filteredItems =
    salesOrders?.filter(
      (item) =>
        item.po_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer_id?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  const handleExport = () => {
    // Define CSV headers
    const csvHeader = "S/N,Order No,Client,Total,Date\n";

    // Convert salesOrders data to CSV rows
    const csvRows = filteredItems.map((order, index) => {
      // Format the date
      const date = new Date(order.delivery_date);
      const formattedDate =
        date instanceof Date && !isNaN(date)
          ? `${date.getDate().toString().padStart(2, "0")}/${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`
          : "N/A";

      // Format the total
      const total = order.total ? order.total : "N/A";

      // Create CSV row
      return `${index + 1},${order.po_no || ""},${order.customer_id?.name || "N/A"
        },${total},${formattedDate}`;
    });

    // Combine header and rows
    const csvContent = csvHeader + csvRows.join("\n");

    // Create a Blob with CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_orders.csv";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    // <Container className="p-0">
    <Container data-aos="fade-right" data-aos-duration="1000" fluid className="mt-2 min-vh-100">
      <Row>
        {/* Items List Card */}
        <Col sm={12} className="p-4">
          <div className="p-2" style={{ top: "186px", fontSize: "16px" }}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/superadmin/dashboard">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/Inventory/dashboard">Inventory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Sales Order List</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <Card
            data-aos="fade-right"
            data-aos-duration="1000"
            className="mx-2 p-2"
          >
            <Row className="align-items-center">
              {/* Title */}
              <Col sm={4} className="d-flex my-2">
                <h1
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
                  className="ms-2"
                >
                  Sales Order List
                </h1>
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
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery directly
                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                  />

                  {searchQuery && (
                    <InputGroupText
                      as="button"
                      className="border-0 bg-transparent"
                      onClick={() => setSearchQuery("")} // Clear searchQuery instead of searchText
                    >
                      ✖
                    </InputGroupText>
                  )}
                </InputGroup>
              </Col>

              {/* Action Buttons */}
              <Col sm={5} className="d-flex justify-content-end text-end my-2">
                <Button
                  variant="denger"
                  className="btn px-4 mx-2 border-1 border-danger text-danger"
                  size="sm"
                  onClick={handleExport}
                >
                  <Image
                    className="me-2 size-sm"
                    style={{ width: "22px", height: "22px" }}
                    src={solar_export}
                  />
                  Export
                </Button>

                <Button
                  variant="primary"
                  className="px-4 mx-2"
                  size="sm"
                  onClick={handleShowCreate}
                >
                  <Image
                    className="me-2"
                    style={{ width: "22px", height: "22px" }}
                    src={add}
                  />
                  New SO
                </Button>
              </Col>

              <Col sm={12} style={{ marginTop: "30px" }}>
                {loading ? (
                  <div className="text-center py-4">
                    <Loader />
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredItems}
                    highlightOnHover
                    responsive
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 40]}
                    persistTableHead
                    noDataComponent={
                      <div className="p-4 text-center">
                        No sales orders found
                      </div>
                    }
                    customStyles={{
                      rows: {
                        style: {
                          backgroundColor: "#ffffff",
                          // padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          fontSize: "14px",
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: "#e9f5f8",
                          padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          fontSize: "clamp(14px, 3vw, 16px)",
                        },
                      },
                      table: {
                        style: { borderRadius: "5px", overflow: "hidden" },
                      },
                    }}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

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
import { getSOs } from "../../../../store/AdminSlice/Inventory/SoSlice";
import Loader from "../../../../components/common/Loader/Loader";
// import { format } from "date-fns";

export const SalesOrder = () => {
  // State for search input
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const { salesOrders, loading, error } = useSelector((state) => state.so);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;

  useEffect(() => {
    if (cafeId) {
      dispatch(getSOs(cafeId));
    }
  }, [dispatch, cafeId]);

  // Function to handle modal (replace with actual logic)
  const handleShowCreate = () => {
    console.log("Show create item modal");
    navigate("/admin/Inventory/SaleOrderCreate");
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
    navigate(`/admin/Inventory/SaleOrderDetails/${id}`);
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
      selector: (row) => row.so_no,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span
            className="d-flex justify-content-center align-items-center rounded-circle me-2"
            style={{
              width: "35px",
              height: "35px",
              backgroundColor: getRandomColor(row.so_no),
              color: "white",
              fontWeight: "bold",
              padding: "8px 12px",
              gap: "10px",
            }}
          >
            {row.so_no.charAt(0).toUpperCase()}
          </span>
          <div>
            <div
              style={{ color: "#0062FF", cursor: "pointer" }}
              onClick={() => handleShowDetails(row._id)}
            >
              {row.so_no}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Client",
      selector: (row) => row.customer_id?.name || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => "Pending", // You may need to adjust this based on your API response
      sortable: true,
      cell: (row) => (
        <span
          className={`badge ${
            row.pending_qty > 0 ? "bg-warning" : "bg-success"
          }`}
        >
          {row.pending_qty > 0 ? "Pending" : "Completed"}
        </span>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      cell: (row) => {
        // Extract only the date part from the ISO string
        if (!row.date) return "N/A";
        const date = new Date(row.date);
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
        item.so_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer_id?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  const handleExport = () => {
    // Define CSV headers
    const csvHeader = "S/N,Order No,Client,Status,Date\n";

    // Convert salesOrders data to CSV rows
    const csvRows = filteredItems.map((order, index) => {
      // Format the date
      const date = new Date(order.date);
      const formattedDate =
        date instanceof Date && !isNaN(date)
          ? `${date.getDate().toString().padStart(2, "0")}/${(
              date.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${date.getFullYear()}`
          : "N/A";

      // Format the status
      const status = order.pending_qty > 0 ? "Pending" : "Completed";

      // Create CSV row
      return `${index + 1},${order.so_no || ""},${
        order.customer_id?.name || "N/A"
      },${status},${formattedDate}`;
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
    <Container className="p-0">
      <Row>
        <Col sm={12} className="mx-2 my-3">
          <div style={{ top: "186px", fontSize: "18px" }}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/admin/dashboard">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/admin/inventory/dashboard">Inventory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Sales Order List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        {/* Items List Card */}
        <Col sm={12}>
          <Card
            data-aos="fade-right"
            data-aos-duration="1000"
            className="mx-2 p-1"
          >
            <Row className="align-items-center">
              {/* Title */}
              <Col sm={4} className="d-flex my-2">
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    lineHeight: "18px",
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
                    placeholder="Search for vendors"
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
                  className="btn px-4 mx-2"
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
                    pagination
                    paginationPerPage={itemsPerPage}
                    highlightOnHover
                    responsive
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
                          padding: "clamp(10px, 2vw, 15px)",
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

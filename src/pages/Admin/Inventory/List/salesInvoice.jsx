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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSOInvoices } from "../../../../store/AdminSlice/Inventory/SoInvoiceSlice";

export const SaleInvoiceInventory = () => {
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.soInvoice);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  useEffect(() => {
    dispatch(getSOInvoices(cafeId));
  }, [dispatch]);

  // State for search input
  const [searchText, setSearchText] = useState("");
  const navigator = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(3 / itemsPerPage); 
 
  // Function to handle modal (replace with actual logic)
  const handleShowCreate = () => {
    console.log("Show create item modal");
    navigator("/admin/Inventory/InvoiceCreate");
  };

  const getRandomColor = (name) => {
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33","#39DDFA","#3DFF16"];
    let index = name.charCodeAt(0) % colors.length; // Generate a consistent index
    return colors[index];
  };

  const columns = [
    {
      name: "SN",
      selector: (row, index) => index + 1,
      minWidth: "70px",
      maxWidth: "70px",
    },
    {
      name: "Invoice No",
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
            <div style={{ color: "#0062FF", cursor: "pointer" }} onClick={() => handalDetails(row._id)}>
              {row.so_no}
            </div>
          </div>
        </div>
      ),
    },
    { 
      name: "Sales Person", 
      selector: (row) => row.sales_person, 
      sortable: true 
    },
    { 
      name: "Total", 
      selector: (row) => row.total, 
      sortable: true 
    },
    { 
      name: "Date", 
      selector: (row) => new Date(row.date).toLocaleDateString(), 
      sortable: true 
    },
  ];

  const handalDetails = (id) => {
    navigator(`/admin/Inventory/SaleInvoiceDetails/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const filteredItems = invoices.filter((item) =>
    item.so_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sales_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.total.toString().includes(searchQuery.toLowerCase())
  );

  return (
    <Container >
      <Row>
        <Col sm={12} className="mx-4 my-3">
          <div style={{ top: "186px", fontSize: "18px" }}>
            <Breadcrumb>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Sales</BreadcrumbItem>
              <BreadcrumbItem active>Sales Invoice</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        {/* Items List Card */}
        <Col sm={12}>
          <Card className="mx-4 p-3">
            <Row className="align-items-center">
              {/* Title */}
              <Col sm={4} className="d-flex my-2">
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    lineHeight: "18px",
                  }}
                  className="m-0"
                >
                  Sales Invoice List
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
                    onChange={(e) => setSearchQuery(e.target.value)}  // Update searchQuery directly
                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                  />

                  {searchQuery && (
                    <InputGroupText
                      as="button"
                      className="border-0 bg-transparent"
                      onClick={() => setSearchQuery("")}  // Clear searchQuery instead of searchText
                    >
                      ✖
                    </InputGroupText>
                  )}
                </InputGroup>
              </Col>

              {/* Action Buttons */}
              <Col sm={5} className="d-flex justify-content-end text-end my-2">
                <Button variant="denger" className="btn  px-4 mx-2" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }}>
                  <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={solar_export} />
                  Export
                </Button>

                <Button variant="primary" className="px-4 mx-2" size="sm" onClick={handleShowCreate}>
                  <Image
                    className="me-2"
                    style={{ width: "22px", height: "22px" }}
                    src={add}
                  />
                  New Invoice
                </Button>
              </Col>

              <Col sm={12} style={{marginTop:"30px"}}>
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  progressPending={loading}
                  highlightOnHover
                  responsive
                  persistTableHead
                  customStyles={{
                    rows: { style: { backgroundColor: "#ffffff", padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: '14px',} },
                    headCells: {
                      style: { backgroundColor: "#e9f5f8", padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)', },
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
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
import add from "/assets/inventory/material-symbols_add-rounded.png";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPBills } from "../../../../store/AdminSlice/Inventory/PBillSlice";
import Loader from "../../../../components/common/Loader/Loader";
import { getStyxData } from "../../../../store/AdminSlice/Inventory/purchaseOrder";

const PurchaseBillList = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { bills, loading, error } = useSelector((state) => state.pBill);
  const { styxData } = useSelector((state) => state.purchaseOrder);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(3 / itemsPerPage);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  useEffect(() => {
    dispatch(getPBills(cafeId)).unwrap()
    dispatch(getStyxData());
  }, [dispatch]);

  // Function to handle modal (replace with actual logic)
  const handleShowCreate = () => {
    navigate("/admin/inventory/PurchaseBillCreate");
  };

  const getRandomColor = (po_no) => {
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
    let index = (po_no?.charCodeAt(0) + po_no?.charCodeAt(po_no?.length - 1)) % colors.length;
    return colors[index];
  };
  
  const columns = [
    {
      name: "SN",
      cell: (row, index) => index + 1,
      minWidth: "70px",
      maxWidth: "70px",
    },
    {
      name: "Order No",
      selector: (row) => row.po_no,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span
            className="d-flex justify-content-center align-items-center rounded-circle me-2"
            style={{
              width: "35px",
              height: "35px",
              backgroundColor: getRandomColor(row.po_no),
              color: "white",
              fontWeight: "bold",
              padding: "8px 12px",
              gap: "10px",
            }}
          >

            {row.po_no?.charAt(0).toUpperCase()}
          </span>
          <div>
            <div style={{ color: "#0062FF",cursor:"pointer" }} onClick={() => handleShowDetails(row)}>{row.po_no}</div>
            {/* <div style={{ fontSize: "12px", color: "gray" }}>{row.email}</div> */}
          </div>
        </div>
      ),
    },
    { name: "vendor", selector: (row) => row.vendor_id?.name || styxData.name, sortable: true },
    { name: " Status", selector: (row) => row.status || "Pending", sortable: true },
    { name: "Total", selector: (row) => `₹ ${row.total}`, sortable: true },

  ];
    const handleShowDetails = (row) => {
      navigate(`/admin/inventory/PurchaseBillDetails/${row._id}`);
    }

  const filteredItems = bills.filter((item) =>
    item.vendor_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor_id?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(item.total)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    // Define CSV headers
    const csvHeader = "S/N,Order No,Vendor,Status,Total\n";
    
    // Convert bills data to CSV rows
    const csvRows = filteredItems.map((bill, index) => {
      return `${index + 1},${bill.po_no || ""},${bill?.vendor_id?.name || ""},${bill.status || "Pending"},${bill.total || 0}`;
    });

    // Combine header and rows
    const csvContent = csvHeader + csvRows.join("\n");

    // Create a Blob with CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase_bills.csv";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container  fluid className="mt-4 min-vh-100">
      <Row>
      <Col sm={12} className="mx-2 mb-3 px-5">
          <div style={{ top: "186px", fontSize: "16px" }}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/admin/dashboard">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/admin/inventory/dashboard">Inventory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Purchase Bill List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        {/* Items List Card */}
        <Col data-aos="fade-right" data-aos-duration="1000" sm={12}>
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
                  Purchase Bill List
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
                    onChange={(e) => setSearchQuery(e.target.value)} 
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
                <Button 
                  variant="denger" 
                  className="btn px-4 mx-2" 
                  size="sm" 
                  style={{ borderColor: "#FF3636", color: "#FF3636" }}
                  onClick={handleExport}
                >
                  <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={solar_export} />
                  Export
                </Button>

                <Button variant="primary" className="px-4 mx-2" size="sm" onClick={handleShowCreate}>
                  <Image
                    className="me-2"
                    style={{ width: "22px", height: "22px" }}
                    src={add}
                  />
                  New PB
                </Button>
              </Col>

              <Col sm={12} style={{ marginTop: "30px" }}>
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  // pagination
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 20, 30, 40]}
                  responsive
                  progressPending={loading}
                  progressComponent={<div><Loader/></div>}
                  persistTableHead
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
}

export default PurchaseBillList

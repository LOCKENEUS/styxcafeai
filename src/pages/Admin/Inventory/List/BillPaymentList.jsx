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
import { getPurchaseBillPayments } from "../../../../store/AdminSlice/Inventory/CollectPurchaseBill";
import Loader from "../../../../components/common/Loader/Loader";

const BillPaymentList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(3 / itemsPerPage);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const dispatch = useDispatch();
    const { payments, loading } = useSelector((state) => state.purchaseBill);

    useEffect(() => {
        dispatch(getPurchaseBillPayments(cafeId));
    }, [dispatch, cafeId]);

    // Function to handle modal (replace with actual logic)
 

    const getRandomColor = (name) => {
      const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
      let index = (name?.charCodeAt(0) + name?.charCodeAt(name.length - 1)) % colors.length;
      return colors[index];
    };
    
    const columns = [
      {
        name: "SN",
        selector: (_, index) => index + 1,
        minWidth: "70px",
        maxWidth: "70px",
      },
      {
        name: "Bill No",
        selector: (row) => row.bill_id.po_no,
        sortable: true,
        cell: (row) => (
          <div className="d-flex align-items-center">
            <span
              className="d-flex justify-content-center align-items-center rounded-circle me-2"
              style={{
                width: "35px",
                height: "35px",
                backgroundColor: getRandomColor(row.bill_id.po_no),
                color: "white",
                fontWeight: "bold",
                padding: "8px 12px",
                gap: "10px",
              }}
            >
              {row.bill_id?.po_no?.charAt(0).toUpperCase()}
            </span>
            <div>
              <div style={{ color: "#0062FF", cursor: "pointer" }} onClick={() => handleShowDetails(row?.bill_id._id)}>
                {row.bill_id.po_no}
              </div>
            </div>
          </div>
        ),
      },
      { name: "Mode", selector: (row) => row.mode, sortable: true },
      { name: "Amount", selector: (row) => row.deposit_amount, sortable: true },
      { name: "Transaction ID", selector: (row) => row.transaction_id, sortable: true },
      { 
        name: "Date", 
        selector: (row) => new Date(row.deposit_date).toLocaleDateString(), 
        sortable: true 
      },
    ];

    const itemsData = [
      { sn: 1, name: "PB-190", vendor: "31", mode: "Packed", amount: "21" ,transactionID:"112",time:"5:59"},
      { sn: 2, name: "PB-191", vendor: "6", mode: "Shipped", amount: "8" ,transactionID:"12",time:"5:59"},
      { sn: 3, name: "PB-192", vendor: "21", mode: "Packed", amount: "18" ,transactionID:"17",time:"5:59"},
      { sn: 4, name: "PB-193", vendor: "1", mode: "Shipped", amount: "89" ,transactionID:"11",time:"5:59"},
      { sn: 5, name: "PB-198", vendor: "2", mode: "Packed", amount: "0" ,transactionID:"12",time:"5:59"},
    ];

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setActivePage(page);
      }
    };

    const handleShowDetails = (id) => {
      navigate(`/admin/inventory/PurchaseBillDetails/${id}`);
    };

    const filteredItems = payments.filter((item) =>
      item.bill_id?.po_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deposit_amount?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
      // Define CSV headers
      const csvHeader = "S/N,Bill No,Mode,Amount,Transaction ID,Date\n";
      
      // Convert payments data to CSV rows
      const csvRows = filteredItems.map((payment, index) => {
        // Format the date
        const date = new Date(payment.deposit_date);
        const formattedDate = date instanceof Date && !isNaN(date) 
          ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
          : "N/A";

        return `${index + 1},${payment.bill_id?.po_no || ""},${payment.mode || ""},${payment.deposit_amount || 0},${payment.transaction_id || ""},${formattedDate}`;
      });

      // Combine header and rows
      const csvContent = csvHeader + csvRows.join("\n");

      // Create a Blob with CSV content
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      // Create a temporary download link
      const a = document.createElement("a");
      a.href = url;
      a.download = "bill_payments.csv";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <Container fluid className="mt-4 min-vh-100">
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
              <BreadcrumbItem active>Bill Payment List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

          {/* Items List Card */}
          <Col data-aos="fade-right" data-aos-duration="1000" sm={12}>
            <Card  className="mx-4 p-3">
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
                    Bill Payment List
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
                      placeholder="Search for Bill Payment " 
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
                </Col>

                <Col sm={12} style={{ marginTop: "30px" }}>
                
                  <DataTable
                    columns={columns}
                    data={filteredItems}
                    highlightOnHover
                    pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 20, 30, 40]}
                    responsive
                    persistTableHead
                    progressPending={loading}
                    progressComponent={<div><Loader/></div>}
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

export default BillPaymentList

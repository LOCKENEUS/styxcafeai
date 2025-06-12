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
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getPayments } from '../../../../store/AdminSlice/Inventory/CollectPaymentSlice';
import Loader from "../../../../components/common/Loader/Loader";

export const InvoicePaymentInventory = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payment || {});
  const [searchQuery, setSearchQuery] = useState("");
  const navigator = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cafeId = user?._id;
    if (cafeId) {
      dispatch(getPayments(cafeId));
    }
  }, [dispatch]);

  const getRandomColor = (str) => {
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
    let index = str?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const handleDetails = (id) => {
    navigator(`/admin/Inventory/SaleInvoiceDetails/${id}`);
  };

  const handleExport = () => {
    // Define CSV headers
    const csvHeader = "S/N,Invoice ID,Amount,Payment Mode,Payment Date,Description\n";

    // Convert payments data to CSV rows
    const csvRows = filteredItems.map((payment, index) => {
      // Format the date
      const date = new Date(payment.deposit_date);
      const formattedDate = date instanceof Date && !isNaN(date)
        ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        : "N/A";

      // Format amount to remove the '₹' symbol for CSV
      const amount = payment.deposit_amount || 0;

      // Create CSV row with proper escaping for potential commas in text
      return [
        index + 1,
        payment?.invoice_id?.so_no || "",
        amount,
        payment.mode || "",
        formattedDate,
        `"${payment.description || ""}"`  // Wrap description in quotes to handle commas
      ].join(',');
    });

    // Combine header and rows
    const csvContent = csvHeader + csvRows.join("\n");

    // Create a Blob with CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice_payments.csv";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      name: "SN",
      selector: (row, index) => index + 1,
      minWidth: "70px",
      maxWidth: "70px",
    },
    {
      name: "Invoice ID",
      selector: (row) => row?.invoice_id?.so_no,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span
            className="d-flex justify-content-center align-items-center rounded-circle me-2"
            style={{
              width: "35px",
              height: "35px",
              backgroundColor: getRandomColor(row?.invoice_id?.so_no),
              color: "white",
              fontWeight: "bold",
              padding: "8px 12px",
              gap: "10px",
            }}
          >
            {row?.invoice_id?.so_no?.charAt(0).toUpperCase()}
          </span>
          <div>
            <div
              style={{ color: "#0062FF", cursor: "pointer" }}
              onClick={() => handleDetails(row?.invoice_id?._id)}
            >
              {row?.invoice_id?.so_no}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => `₹${row.deposit_amount}`,
      sortable: true
    },
    {
      name: "Payment Mode",
      selector: (row) => row.mode,
      sortable: true
    },
    {
      name: "Payment Date",
      selector: (row) => new Date(row.deposit_date).toLocaleDateString(),
      sortable: true
    },
    // { 
    //   name: "Description", 
    //   selector: (row) => row.description,
    //   sortable: true 
    // },
  ];

  const filteredItems = payments?.filter((item) =>
    item.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Container className="p-2 p-md-4">
      <Row>
        <Col sm={12} className="mx-2 mb-0 mb-md-3">
          <div style={{ top: "186px", fontSize: "16px" }}>
            <Breadcrumb>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Sales</BreadcrumbItem>
              <BreadcrumbItem active>Invoice Payment List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        <Col sm={12}>
          <Card data-aos="fade-right" data-aos-duration="1000" className="mx-2 p-3">
            <Row className="align-items-center">
              <Col sm={4} className="d-flex my-2">
                <h1 style={{ fontSize: "20px", fontWeight: "500", lineHeight: "18px" }} className="m-0">
                  Invoice Payment List
                </h1>
              </Col>

              <Col sm={3} className="d-flex my-2">
                <InputGroup className="navbar-input-group">
                  <InputGroupText className="border-0" style={{ backgroundColor: "#FAFAFA" }}>
                    <Image src={gm1} />
                  </InputGroupText>

                  <FormControl
                    type="search"
                    size="sm"
                    placeholder="Search..."
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

              <Col sm={5} className="d-flex justify-content-end text-end my-2">
                <Button
                  variant="white"
                  className="btn px-4 mx-2"
                  size="sm"
                  style={{ borderColor: "#FF3636", color: "#FF3636" }}
                  onClick={handleExport}
                >
                  <Image
                    className="me-2 size-sm"
                    style={{ width: "22px", height: "22px" }}
                    src={solar_export}
                  />
                  Export
                </Button>
              </Col>

              <Col sm={12} style={{ marginTop: "30px" }}>
                {loading ? (
                  <div className="text-center p-4">
                    <Loader />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredItems}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 40]}
                    responsive
                    persistTableHead
                    customStyles={{
                      rows: {
                        style: {
                          backgroundColor: "#ffffff",
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: '14px',
                        }
                      },
                      headCells: {
                        style: {
                          backgroundColor: "#e9f5f8",
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                        },
                      },
                      table: {
                        style: {
                          borderRadius: "5px",
                          overflow: "hidden"
                        }
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
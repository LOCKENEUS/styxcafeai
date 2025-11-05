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
  Table,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import gm1 from "/assets/inventory/mynaui_search.svg";
import solar_export from "/assets/inventory/solar_export-linear.png";
import add from "/assets/inventory/material-symbols_add-rounded.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSaPOList } from "../../../store/slices/Inventory/poSlice";
import Loader from "../Loader/Loader";

export const PurchaseOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { purchaseOrder, loading, error } = useSelector((state) => state.saPurchaseOrder);
  const listOfPO = purchaseOrder;
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) {
      dispatch(getSaPOList());
    }
  }, [dispatch]);

  const formattedPOList = Array.isArray(listOfPO)
    ? listOfPO.map((po, index) => ({
      sn: index + 1,
      name: po.po_no,
      user_type: po.user_type,
      vendor: po.vendor_id?.name || "-",
      amount: po.total || "-",
      status: po.status ? "Pending" : "Completed",
      delivery_date: new Date(po.delivery_date).toLocaleDateString(),
      full: po, // Keep original object for view details
    }))
    : [];

  const getRandomColor = (name) => {
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
    const index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
    return colors[index];
  };

  const handleShowDetails = (item) => {
    // navigate("/admin/inventory/purchase-order-details", { state: item });
    navigate(`/Inventory/PurchaseOrderDetails/${item._id}`);
  };

  const filteredList = formattedPOList.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedData = filteredList.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const generateCSV = () => {
    const headers = ["S/N", "Order No", "Vendor", "Amount", "Status", "Delivery Date"];
    const rows = paginatedData.map(item => [
      item.sn, item.name, item.vendor, item.amount, item.status, item.delivery_date
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase_order_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container>
      <Row>
        <Col sm={12} className="mx-2 my-3">
          <div style={{ top: "186px", fontSize: "16px" }}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/superadmin/dashboard">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/Inventory/dashboard">Inventory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Purchase Order List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        <Col data-aos="fade-right" data-aos-duration="1000" sm={12}>
          <Card className="mx-2 p-3">
            <Row className="align-items-center">
              <Col sm={4} className="d-flex my-2">
                <h2
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '5px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  className="m-0"
                >
                  PURCHASE ORDER LIST
                </h2>
              </Col>

              <Col sm={3} className="d-flex my-2">
                <InputGroup className="navbar-input-group">
                  <InputGroupText className="border-0"
                    style={{ backgroundColor: "#FAFAFA" }}>
                    <Image src={gm1} alt="search" />
                  </InputGroupText>

                  <FormControl
                    type="search"
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
                <Button variant="denger" className="btn  px-4 mx-2" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }} onClick={generateCSV}>
                  <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={solar_export} />
                  Export

                </Button>
                <Link to="/Inventory/PurchaseOrderCreate">
                  <Button variant="primary" className="px-4 mx-2" size="sm">
                    <Image className="me-2" src={add} alt="Add" style={{ width: "22px", height: "22px" }} />
                    New PO
                  </Button>
                </Link>
              </Col>
            </Row>
            <Col sm={12} style={{ marginTop: "30px" }}>
              <Table className="mt-4" responsive style={{ borderRadius: "5px", overflow: "hidden" }}>
                <thead style={{ backgroundColor: "#e9f5f8" }}>
                  <tr>
                    {["S/N", "Order No", "Vendor", "Amount", "Status", "Delivery Date"].map((head, idx) => (
                      <th key={idx}
                        style={{
                          fontWeight: "500",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          padding: "clamp(10px, 2vw, 15px)",
                          // width: "clamp(200px, 20vw, 200px)",
                          border: "none",
                          color: "black",
                        }}
                      >{head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody >
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4"><Loader /></td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-danger">{error}</td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No Data Found</td>
                    </tr>
                  ) : (
                    paginatedData.map((row, idx) => (
                      <tr key={idx} onClick={() => handleShowDetails(row.full)} style={{ cursor: "pointer" }}>
                        <td style={{
                          cursor: "pointer",
                          padding: "clamp(10px, 2vw, 15px)",
                          fontSize: "14px",
                          border: "none",
                        }}>{row.sn}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {/* <span
                              className="d-flex justify-content-center align-items-center rounded-circle me-2"
                              style={{
                                width: "35px",
                                height: "35px",
                                backgroundColor: getRandomColor(row.name),
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              {row.name.charAt(0)}
                            </span> */}
                            <div style={{ color: "#0062FF" }}>{row.name}</div>
                          </div>
                        </td>
                        <td>{row?.user_type === "Vendor" ? row?.vendor : "Superadmin"}</td>
                        <td>&#8377; {row.amount}</td>
                        <td>{row.status}</td>
                        <td>{row.delivery_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handlePageChange(activePage - 1)}
                    disabled={activePage === 1}
                    className="mx-2"
                  >
                    Previous
                  </Button>
                  <span className="mx-2 align-self-center">
                    Page {activePage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handlePageChange(activePage + 1)}
                    disabled={activePage === totalPages}
                    className="mx-2"
                  >
                    Next
                  </Button>
                </div>
              )}
            </Col>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
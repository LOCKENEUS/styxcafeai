import { color } from "chart.js/helpers";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button, Breadcrumb, BreadcrumbItem, Row, Image, Pagination, Table } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import DataTable from "react-data-table-component";
import { BiSearch, BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import gm1 from '/assets/inventory/mynaui_search.svg'
import solar_export from '/assets/inventory/solar_export-linear.png'
import add from '/assets/inventory/material-symbols_add-rounded.png'
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../../../store/slices/inventory";
import Loader from "../../Loader/Loader";
import { FcNext, FcPrevious } from "react-icons/fc";

export const Items = () => {
  const [superAdminId, setSuperAdminId] = useState('');
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setSuperAdminId(parsedUser._id);
    }
  }, []);
  const [searchText, setSearchText] = useState("");
  const navigator = useNavigate();
  const [mainLoading, setMainLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const dispatch = useDispatch();
  useEffect(() => {
    // if (superAdminId) {
    setMainLoading(true);
    dispatch(getItems()).finally(() => {
      setMainLoading(false);
    });
    // }
  }, [dispatch]);

  const itemsList = useSelector((state) => state.inventorySuperAdmin.it);

  const filteredItems = Array.isArray(itemsList)
    ? itemsList.filter((item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.costPrice?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item.stock?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.unit?.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];


  const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentItems = items.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil((filteredItems.length || 0) / itemsPerPage);
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleShowCreate = (e) => {
    e.preventDefault();
    // e.target.value = ""; 
    navigator("/Inventory/itemCreate");
  }

  // /Inventory/ItemDetails
  const handleShowDetails = (groupId) => {
    // e.preventDefault();
    navigator("/Inventory/itemDetails", { state: { groupId } });
  }
  const exportToCSV = () => {
    const headers = ["#", "Item Name", "Price", "Stock", "SKU", "HSN", "Unit", "Dimension"];
    const rows = currentItems.map((row, index) => {
      const dimension = (!row.length || !row.width || !row.height || !row.dimensionUnit)
        ? '---'
        : `${row.length} x ${row.width} x ${row.height} ${row.dimensionUnit}`;

      return [
        index + 1,
        row.name || '----',
        `₹ ${row.costPrice || '----'}`,
        row.stock || '----',
        row.sku || '----',
        row.hsn || '----',
        row.unit || '----',
        dimension
      ];
    });
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "group_items.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Container fluid >
      <Row  >
        <Card.Header className="fw-bold">
          <Row className="d-flex justify-content-between align-items-center">
            <Col sm={8} xs={12} >
              <Breadcrumb>
                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>
                  <Link to="/superadmin/dashboard">Home
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>
                  <Link to="/Inventory/Dashboard"
                  >
                    Inventory
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Items List </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>

          <Row className="mx-auto">
            <Card className="my-3 mx-auto py-3 px-3 rounded-4" style={{ backgroundColor: "white" }}>
              <Row className="">
                <Col sm={4} className="fluid d-flex justify-content-start">
                  <h1 className="text-center mx-2 mt-2"
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '5px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >Items List</h1>
                </Col>
                <Col sm={8}>
                  <div className="d-flex justify-content-end align-items-center flex-wrap my-2">
                    <InputGroup
                      className="navbar-input-group mx-2"
                      style={{ border: "none", width: "300px", backgroundColor: "#FAFAFA" }}
                    >
                      <InputGroupText className="border-0" style={{ backgroundColor: "#FAFAFA" }}>
                        <Image src={gm1} />
                      </InputGroupText>

                      <FormControl
                        type="search"
                        size="sm"
                        placeholder="Search for items"
                        aria-label="Search in docs"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ backgroundColor: "#FAFAFA", border: "none" }}
                      />

                      {searchText && (
                        <InputGroupText
                          as="a"
                          href="#"
                          onClick={() => setSearchText("")}
                          style={{ cursor: "pointer" }}
                        >

                        </InputGroupText>
                      )}
                    </InputGroup>

                    <Button variant="denger" className="btn  px-4 mx-4" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }}
                      onClick={exportToCSV}
                    >
                      <Image className="me-2" style={{ width: "22px", height: "22px" }} src={solar_export}
                      />
                      Export
                    </Button>

                    <Button type="button" variant="primary" className="px-4 mx-2" size="sm" onClick={handleShowCreate}>
                      <Image className="me-2" style={{ width: "22px", height: "22px" }} src={add} />
                      New Items
                    </Button>
                  </div>
                </Col>
                <Col sm={12} className="my-2">
                  <div style={{ position: "relative", height: "500px", overflowY: "auto" }}>
                    <Table hover >
                      <thead style={{
                        position: "sticky", top: 0, backgroundColor: "#e9f5f8", zIndex: 1,
                      }}>
                        <tr>
                          <th style={{
                            fontWeight: "600",
                            fontSize: "clamp(14px, 3vw, 16px)",
                            padding: "clamp(10px, 2vw, 15px)",
                            border: "none",
                            color: "gray",
                            borderTopLeftRadius: "10px",
                            borderBottomLeftRadius: "10px",
                          }}>#</th>
                          <th style={{
                            fontWeight: "600",
                            fontSize: "clamp(14px, 3vw, 16px)",
                            padding: "clamp(10px, 2vw, 15px)",
                            border: "none",
                            color: "gray",
                          }}>Item Name</th>
                          <th
                            style={{
                              fontWeight: "600",
                              fontSize: "clamp(14px, 3vw, 16px)",
                              padding: "clamp(10px, 2vw, 15px)",
                              border: "none",
                              color: "gray",
                            }}
                          >Price</th>
                          <th
                            style={{
                              fontWeight: "600",
                              fontSize: "clamp(14px, 3vw, 16px)",
                              padding: "clamp(10px, 2vw, 15px)",
                              border: "none",
                              color: "gray",
                            }}
                          >Stock</th>
                          <th
                            style={{
                              fontWeight: "600",
                              fontSize: "clamp(14px, 3vw, 16px)",
                              padding: "clamp(10px, 2vw, 15px)",
                              border: "none",
                              color: "gray",
                            }}
                          >SKU</th>
                          <th
                            style={{
                              fontWeight: "600",
                              fontSize: "clamp(14px, 3vw, 16px)",
                              padding: "clamp(10px, 2vw, 15px)",
                              border: "none",
                              color: "gray",
                            }}
                          >HSN</th>
                          <th
                            style={{
                              fontWeight: "600",
                              fontSize: "clamp(14px, 3vw, 16px)",
                              padding: "clamp(10px, 2vw, 15px)",
                              border: "none",
                              color: "gray",
                            }}
                          >Unit</th>
                          <th
                            style={{
                              fontWeight: "600",
                              fontSize: "clamp(14px, 3vw, 16px)",
                              padding: "clamp(10px, 2vw, 15px)",
                              border: "none",
                              color: "gray",
                              borderTopRightRadius: "10px",
                              borderBottomRightRadius: "10px"
                            }}
                          >Dimension</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          mainLoading || !itemsList ? (
                            <tr>
                              <td colSpan={8} className="text-center">
                                <Loader />
                              </td>
                            </tr>
                          ) : currentItems.length > 0 ? (
                            currentItems.map((row, index) => {
                              const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
                              const bgColor = colors[index % colors.length];
                              const initial = row.name?.charAt(0)?.toUpperCase() || "?";

                              return (
                                <tr key={index} style={{ verticalAlign: "middle", color: "gray", fontSize: "14px", fontWeight: "500" }}>
                                  <td className="py-4">{index + 1}</td>
                                  <td className="py-4 d-flex align-items-center">
                                    <div
                                      style={{
                                        backgroundColor: bgColor,
                                        color: "#fff",
                                        borderRadius: "50%",
                                        width: "40px",
                                        height: "40px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: "20px",
                                        fontWeight: "800",
                                        marginRight: "10px",
                                      }}
                                    >
                                      {initial}
                                    </div>
                                    <span style={{ color: "rgb(0, 98, 255)", cursor: "pointer", fontWeight: "600", fontSize: "16px" }} onClick={() => handleShowDetails(row._id)}>
                                      {row.name}
                                    </span>
                                  </td>
                                  <td className="py-4">₹ {row.costPrice || '----'}</td>
                                  <td className="py-4">{row.stock || '----'}</td>
                                  <td className="py-4">{row.sku || '----'}</td>
                                  <td className="py-4">{row.hsn || '----'}</td>
                                  <td className="py-4">{row.unit || '----'}</td>
                                  <td className="py-4">
                                    {(!row.length || !row.width || !row.height || !row.dimensionUnit)
                                      ? '---'
                                      : `${row.length} x ${row.width} x ${row.height} ${row.dimensionUnit}`}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8} className="text-center">No Items Found</td>
                            </tr>
                          )
                        }
                      </tbody>


                    </Table>
                  </div>

                  {/* <Pagination className="mt-3 justify-content-end">
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx}
                        active={idx + 1 === currentPage}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  </Pagination> */}
                  <Col sm={12} className="d-flex justify-content-end align-items-center mt-3">
                    <Button
                      className="btn btn-light fw-bold"
                      onClick={handlePrev}
                      disabled={currentPage === 1}

                    >
                      <FcPrevious />
                    </Button>

                    <span className="mx-3">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      className="btn btn-light "
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      <FcNext />
                    </Button>
                  </Col>


                </Col>
              </Row>
            </Card>
          </Row>
        </Card.Header>
      </Row>
    </Container>
  );
};

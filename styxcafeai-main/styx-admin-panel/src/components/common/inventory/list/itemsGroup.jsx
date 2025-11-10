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
import { getItemsGroups } from "../../../../store/slices/inventory";
import { FcNext, FcPrevious } from "react-icons/fc";
import Loader from "../../Loader/Loader";

export const ItemsGroup = () => {
  const [searchText, setSearchText] = useState("");
  const navigator = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [mainLoading, setMainLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setMainLoading(true);
    dispatch(getItemsGroups()).finally(() => {
      setMainLoading(false);
    });
  }, [dispatch]);
  const itemsGroupList = useSelector((state) => state.inventorySuperAdmin?.inventory) || [];

  const filteredItems = Array.isArray(itemsGroupList)
    ? itemsGroupList.filter((item) =>
      item.group_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.unit?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.manufacturer?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.brand?.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleShowCreate = (e) => {
    e.preventDefault();
    navigator("/Inventory/ItemGroupCreate");
  }
  const handleShowDetails = (groupId) => {
    navigator("/Inventory/ItemsGroupDetails", { state: { groupId } });
  }
  const handleExportToCSV = () => {
    const headers = ["#", "Name", "Unit", "Manufacturer", "Brand", "Items"];
    const rows = currentItems.map((row, index) => {
      return [
        index + 1,
        row.group_name || "---",
        typeof row.unit === "object" ? row.unit?.name || "---" : row.unit || "---",
        typeof row.manufacturer?.name === "object" ? row.manufacturer?.name?.en || "---" : row.manufacturer?.name || "---",
        typeof row.brand === "object" ? row.brand?.name || "---" : row.brand || "---",
        row.length || "---",
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
          <Row className="d-flex justify-content-between align-items-center  ">
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
                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Group  Item  List </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>

          <Row className="mx-auto">
            <Card className="my-3 mx-auto py-3 px-3 rounded-4" style={{ backgroundColor: "white" }}>
              <Row className="d-flex  ">
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
                  >Group  Item  List</h1>
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
                        placeholder="Search..."
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
                      onClick={handleExportToCSV}
                    >

                      <Image className="me-2" style={{ width: "22px", height: "22px" }} src={solar_export} />
                      Export
                    </Button>

                    <Button type="button" variant="primary" className="px-4 mx-2" size="sm" onClick={handleShowCreate}>
                      <Image className="me-2" style={{ width: "22px", height: "22px" }} src={add} />
                      New Group
                    </Button>
                  </div>
                </Col>
                <Col sm={12} className="my-2">
                  <div style={{ position: "relative", height: "500px", overflowY: "auto" }}>
                    <Table hover >
                      <thead style={{
                        position: "sticky", top: 0, backgroundColor: "#e9f5f8", zIndex: 1, width: "100%"
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
                          }}> Name</th>
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
                            }}
                          >Manufacturer</th>
                          <th
                            style={{
                              fontWeight: "600",
                              fontSize: "clamp(14px, 3vw, 16px)",
                              padding: "clamp(10px, 2vw, 15px)",
                              border: "none",
                              color: "gray",
                            }}
                          >Brand</th>

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
                          >Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          mainLoading || !itemsGroupList ? (
                            <tr>
                              <td colSpan={8} className="text-center">
                                <Loader />
                              </td>
                            </tr>
                          ) : itemsGroupList.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center py-4 text-muted">
                                No items found
                              </td>
                            </tr>
                          ) : (
                            currentItems.map((row, index) => {
                              const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
                              const bgColor = colors[index % colors.length];
                              const initial = row.group_name?.charAt(0)?.toUpperCase() || "?";

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
                                    <span style={{ color: "rgb(0, 98, 255)", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}
                                      onClick={() => handleShowDetails(row._id)}
                                    >
                                      {row.group_name}
                                    </span>
                                  </td>
                                  <td className="py-4">
                                    {typeof row.unit === "object" ? row.unit?.name || "---" : row.unit || "---"}
                                  </td>
                                  <td className="py-4" style={{ width: "200px" }}>
                                    {typeof row.manufacturer?.name === "object"
                                      ? row.manufacturer.name.en || "---"
                                      : row.manufacturer?.name || "---"}
                                  </td>
                                  <td className="py-4">
                                    {typeof row.brand === "object" ? row.brand?.name || "---" : row.brand || "---"}
                                  </td>
                                  <td className="py-4" style={{ width: "300px" }}>
                                    {row.length || "---"}
                                  </td>
                                </tr>
                              );
                            })
                          )
                        }
                      </tbody>
                    </Table>
                  </div>
                </Col>
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
              </Row>
            </Card>
          </Row>
        </Card.Header>
      </Row>
    </Container>
  );
};
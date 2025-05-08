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



export const Items = () => {
  const [superAdminId, setSuperAdminId] = useState('');
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setSuperAdminId(parsedUser._id);
      console.log("User ID (_id):-- ", parsedUser._id);
      console.log("User Name:", parsedUser.name);
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
    dispatch(getItems());
    // }
  }, [dispatch]);
  const items = useSelector((state) => state.inventorySuperAdmin.inventory);

  console.log("item list  ----", items);

  const filteredItems = [
    { itemName: "oItem A", price: "100", stock: 50, sku: "SKU001", hsn: "1234", unit: "pcs", dimension: "10x10x5" },
    { itemName: "Item B", price: "120", stock: 30, sku: "SKU002", hsn: "1235", unit: "pcs", dimension: "12x10x6" },
    { itemName: "Item C", price: "90", stock: 40, sku: "SKU003", hsn: "1236", unit: "pcs", dimension: "11x9x5" },
    { itemName: "Item D", price: "110", stock: 60, sku: "SKU004", hsn: "1237", unit: "pcs", dimension: "13x11x6" },
    { itemName: "Item E", price: "95", stock: 70, sku: "SKU005", hsn: "1238", unit: "pcs", dimension: "10x8x5" },
    { itemName: "Item F", price: "105", stock: 20, sku: "SKU006", hsn: "1239", unit: "pcs", dimension: "14x10x7" },
    { itemName: "Item G", price: "130", stock: 10, sku: "SKU007", hsn: "1240", unit: "pcs", dimension: "15x12x6" },
    { itemName: "Item H", price: "125", stock: 90, sku: "SKU008", hsn: "1241", unit: "pcs", dimension: "13x10x8" },
    { itemName: "Item I", price: "140", stock: 35, sku: "SKU009", hsn: "1242", unit: "pcs", dimension: "16x12x9" },
    { itemName: "Item J", price: "85", stock: 45, sku: "SKU010", hsn: "1243", unit: "pcs", dimension: "10x9x5" },
    { itemName: "Item K", price: "115", stock: 65, sku: "SKU011", hsn: "1244", unit: "pcs", dimension: "12x10x6" },
    { itemName: "Item L", price: "150", stock: 25, sku: "SKU012", hsn: "1245", unit: "pcs", dimension: "14x12x7" },
    { itemName: "Item M", price: "135", stock: 75, sku: "SKU013", hsn: "1246", unit: "pcs", dimension: "13x11x6" },
    { itemName: "Item N", price: "145", stock: 80, sku: "SKU014", hsn: "1247", unit: "pcs", dimension: "15x13x7" },
    { itemName: "Item O", price: "155", stock: 100, sku: "SKU015", hsn: "1248", unit: "pcs", dimension: "16x14x8" },
    { itemName: "Item P", price: "160", stock: 20, sku: "SKU016", hsn: "1249", unit: "pcs", dimension: "17x15x8" },
    { itemName: "Item Q", price: "165", stock: 30, sku: "SKU017", hsn: "1250", unit: "pcs", dimension: "18x16x9" },
    { itemName: "Item R", price: "170", stock: 45, sku: "SKU018", hsn: "1251", unit: "pcs", dimension: "19x17x9" },
    { itemName: "Item S", price: "175", stock: 55, sku: "SKU019", hsn: "1252", unit: "pcs", dimension: "20x18x10" },
    { itemName: "Item T", price: "180", stock: 60, sku: "SKU020", hsn: "1253", unit: "pcs", dimension: "21x19x10" }
  ];
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentItems = items.slice(startIndex, startIndex + itemsPerPage);
  const currentItems = (items || []).slice(startIndex, startIndex + itemsPerPage);


  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleShowCreate = (e) => {
    e.preventDefault();
    // e.target.value = ""; 
    navigator("/Inventory/itemCreate");
  }

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
                  // state={{ cafeId: cafeId }}
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
              <Row className="d-flex  ">
                <Col sm={4} className="fluid d-flex justify-content-start">
                  <h1 className="text-center mx-2 mt-2">Items List</h1>
                </Col>
                {/* <Col sm={3} className="fluid d-flex justify-content-end">
          <div className="d-flex justify-content-start align-items-start my-2" >

                <InputGroup className="navbar-input-group " style={{ border: "none" }}>
                  <InputGroupText className="border-0" style={{ background: "transparent", backgroundColor: "#FAFAFA" }}>
                    < Image src={gm1} />
                  </InputGroupText>

                  <FormControl
                    type="search"
                    className="search"
                    size="sm"
                    placeholder="Search for vendors"
                    aria-label="Search in docs"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    
                    style={{ background: "transparent", backgroundColor: "#FAFAFA",border:"none" }}
                  />

                  {searchText && (
                    <InputGroupText
                      as="a"
                      href="javascript:;"
                      onClick={() => setSearchText("")}
                      
                    >
                     
                    </InputGroupText>
                  )}
                </InputGroup>

              </div>
          
          </Col> */}
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
                          {/* <X id="clearSearchResultsIcon" /> */}
                        </InputGroupText>
                      )}
                    </InputGroup>

                    {/* <Button
                      variant="danger"
                      className="px-4 mx-2"
                      size="sm"
                      style={{ borderColor: "#FF3636", color: "#FF3636" }}
                    > */}
                    <Button variant="denger" className="btn  px-4 mx-4" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }}>

                      <Image className="me-2" style={{ width: "22px", height: "22px" }} src={solar_export} />
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
                          mainLoading || !items ? (
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
                                    <span style={{ color: "rgb(0, 98, 255)", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
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
                  <Pagination className="mt-3 justify-content-end">
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />

                    {/* Generate pagination items dynamically based on totalPages */}
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx}
                        active={idx + 1 === currentPage}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>


                </Col>
              </Row>
            </Card>
          </Row>
        </Card.Header>
      </Row>
    </Container>
  );
};

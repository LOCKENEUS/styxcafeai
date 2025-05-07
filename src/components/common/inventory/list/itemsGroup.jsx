import { color } from "chart.js/helpers";
import { useState } from "react";
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

export const ItemsGroup = () => {
  const [searchText, setSearchText] = useState("");
  const navigator = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const filteredItems = [
    { itemName: "oItem A", price: "100", manufacturer: 50, brand: "SKU001", items: "1234", unit: "pcs"},
    {  itemName: "Alice", unit: "231",manufacturer : "231", brand: "SKU0011", items: "231", unit: "231" },
    {  itemName: "Bob", unit: "231", manufacturer: "231", brand: "SKU0012", items: "231", unit: "231"},
    {  itemName: "Charlie", unit: "231", manufacturer: "231", brand: "SKU00121", items: "231", unit: "231" },
    { itemName: "David", unit: "231", manufacturer: "231", brand: "SKU0013", items: "231", unit: "231" },
    {  itemName: "Eve", unit: "231", manufacturer: "231", brand: "SKU0014", items: "231", unit: "231" },    
  ];
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);


  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // const handleShowCreate = (e) => {
  //   e.preventDefault();
    // e.target.value = ""; 
  //   navigator("/Inventory/itemCreate");
  // }

  
      const handleShowCreate = (e) => {
        e.preventDefault();
        navigator("/Inventory/ItemGroupCreate");
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
                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Group  Item  List </Breadcrumb.Item>

              </Breadcrumb>

            </Col>
          </Row>

          <Row className="mx-auto">
            <Card className="my-3 mx-auto py-3 px-3 rounded-4" style={{ backgroundColor: "white" }}>
              <Row className="d-flex  ">
                <Col sm={4} className="fluid d-flex justify-content-start">
                  <h1 className="text-center mx-2 mt-2">Group  Item  List</h1>
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
                        placeholder="Search for Group "
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
                      New Group 
                    </Button>
                  </div>
                </Col>
                <Col sm={12} className="my-2">
                  <div style={{ position: "relative", height: "500px", overflowY: "auto" }}>
                    <Table hover >
                      <thead style={{
                        position: "sticky", top: 0, backgroundColor: "#e9f5f8", zIndex: 1,width:"100%"
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
                        {currentItems.map((row, index) => {
                          const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
                          const bgColor = colors[index % colors.length];
                          const initial = row.itemName?.charAt(0)?.toUpperCase() || "?";

                          return (
                            // <tr key={index} style={{ fontSize: "1px", verticalAlign: "middle", color: "black" }}>
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
                                <span style={{ color: "rgb(0, 98, 255)" ,cursor:"pointer", fontWeight:"600" ,fontSize:"16px"}}>{row.itemName}</span>
                              </td>
                              <td className="py-4">{row.unit}</td>
                              <td className="py-4" style={{ width: "200px" }}>{row.manufacturer}</td>
                              <td className="py-4">{row.brand}</td>
                              <td className="py-4" style={{ width: "300px" }}>{row.items}</td>
                             
                              <td className="py-4">{row.dimension}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  {/* Pagination Controls */}
                  <Pagination className="mt-3 justify-content-end">
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


    

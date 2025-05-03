import { color } from "chart.js/helpers";
import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button, Breadcrumb, BreadcrumbItem, Row, Image, Pagination } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import DataTable from "react-data-table-component";
import { BiSearch, BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import gm1 from '/assets/inventory/mynaui_search.svg'
import solar_export from '/assets/inventory/solar_export-linear.png'
import add from '/assets/inventory/material-symbols_add-rounded.png'

export const Items = () => {
  const [searchText, setSearchText] = useState("");
  const navigator = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(3 / itemsPerPage);
  const getRandomColor = (name) => {
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
    let index = name.charCodeAt(0) % colors.length; // Generate a consistent index
    return colors[index];
  };


  
  const filteredItems = [
    {  itemName: "oItem A", price: "100", stock: 50, sku: "SKU001", hsn: "1234", unit: "pcs", dimension: "10x10x5" },
    {  itemName: "Item B", price: "120", stock: 30, sku: "SKU002", hsn: "1235", unit: "pcs", dimension: "12x10x6" },
    {  itemName: "Item C", price: "90", stock: 40, sku: "SKU003", hsn: "1236", unit: "pcs", dimension: "11x9x5" },
    {  itemName: "Item D", price: "110", stock: 60, sku: "SKU004", hsn: "1237", unit: "pcs", dimension: "13x11x6" },
    {  itemName: "Item E", price: "95", stock: 70, sku: "SKU005", hsn: "1238", unit: "pcs", dimension: "10x8x5" },
    {  itemName: "Item F", price: "105", stock: 20, sku: "SKU006", hsn: "1239", unit: "pcs", dimension: "14x10x7" },
    {  itemName: "Item G", price: "130", stock: 10, sku: "SKU007", hsn: "1240", unit: "pcs", dimension: "15x12x6" },
    {  itemName: "Item H", price: "125", stock: 90, sku: "SKU008", hsn: "1241", unit: "pcs", dimension: "13x10x8" },
    {  itemName: "Item I", price: "140", stock: 35, sku: "SKU009", hsn: "1242", unit: "pcs", dimension: "16x12x9" },
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
  


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
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
                        placeholder="Search for vendors"
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

                    <Button  type="button" variant="primary" className="px-4 mx-2" size="sm" onClick={handleShowCreate}>
                      <Image className="me-2" style={{ width: "22px", height: "22px" }} src={add} />
                      New Items
                    </Button>
                  </div>
                </Col>

               
                <Col sm={12} className="my-2" >
                <div style={{ position: "relative", textAlign: "left" }}>

    <DataTable 
      columns={[
        {
          name: "S.No",
          cell: (row, index) => <div className="p-2">{index + 1}</div>,
          width: "70px",
        },
        {
          name: "Item Name",
          selector: row => row.itemName,
          sortable: true,
          cell: (row, index) => {
            const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
            const bgColor = colors[index % colors.length];
            const initial = row.itemName?.charAt(0)?.toUpperCase() || "?";
        
            return (
              <div className="d-flex align-items-center p-2">
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
                    fontWeight: "bold",
                    marginRight: "10px",
                  }}
                >
                  {initial}
                </div>
                <span className="float-left">{row.itemName}</span>
              </div>
            );
          }
        }
        ,        
        {
          name: "Price",
          selector: row => row.price,
          sortable: true,
          cell: row => <div className=" ">{row.price}</div>
        },
        {
          name: "Stock",
          selector: row => row.stock,
          sortable: true,
          cell: row => <div className="">{row.stock}</div>
        },
        {
          name: "SKU",
          selector: row => row.sku,
          sortable: true,
          cell: row => <div className="">{row.sku}</div>
        },
        {
          name: "HSN",
          selector: row => row.hsn,
          sortable: true,
          cell: row => <div className="">{row.hsn}</div>
        },
        {
          name: "Unit",
          selector: row => row.unit,
          sortable: true,
          cell: row => <div className="">{row.unit}</div>
        },
        {
          name: "Dimension",
          selector: row => row.dimension,
          sortable: true,
          cell: row => <div className="">{row.dimension}</div>
        }
      ]}
      
      data={filteredItems}
      pagination
      paginationPerPage={10}
      highlightOnHover
      persistTableHead
      fixedHeader
      fixedHeaderScrollHeight="400px"
      customStyles={{
        headCells: {
          style: {
            position: "sticky",
            top: 0,
            backgroundColor: "#e9f5f8",
            fontWeight: "600",
            fontSize: "clamp(14px, 3vw, 16px)",
            padding: "clamp(10px, 2vw, 15px)",
            border: "none",
            color: "gray"
          },
        },
        rows: {
          style: {
            textAlign: "start", 
            paddingTop: "10px",
            paddingBottom: "10px",
            fontSize: "clamp(14px, 3vw, 15px)",
           
          },
        },
          
        pagination: {
          style: {
            position: "sticky",
            bottom: 0,
            backgroundColor: "#f8f9fa",
            zIndex: 1,
          },
        },
        table: {
          style: {
            borderRadius: "5px",
            overflow: "hidden",

           
          },
        },
      }}
      

    />
  </div>
</Col>



               

              </Row>
            </Card>
          </Row>
        </Card.Header>
      </Row>
    </Container>
  );
};

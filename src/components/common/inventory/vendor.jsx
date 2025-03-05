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

export const Vendor = () => {
  const [searchText, setSearchText] = useState("");
 const navigator = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(3 / itemsPerPage); 
  const getRandomColor = (name) => {
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33","#39DDFA","#3DFF16"];
    let index = name.charCodeAt(0) % colors.length; // Generate a consistent index
    return colors[index];
  };

    
  const columns = [
    {
      name: "SN",
      selector: (row) => row.sn,
      sortable: true,
      width: "100px",
      
    },
    {
      name: "Vendor Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span
            className="d-flex justify-content-center align-items-center rounded-circle me-2"
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: getRandomColor(row.name),
              color: "white",
              fontWeight: "bold",
            }}
          >
            {row.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <div style={{ color: "#0062FF"}}>{row.name}</div>
            <div style={{ fontSize: "12px", color: "gray" }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    { name: "Company", selector: (row) => row.brand, sortable: true },
    { name: "Billing Address", selector: (row) => row.unit, sortable: true },
    { name: "Shipping Address", selector: (row) => row.items, sortable: true },
  ];
  
    
  const itemsData = [
    { sn: 1, name: "Alice", email: "alice@example.com", brand: "HP", items: 'Nagpur, Maharashtra, India', unit: "Telephone Exchange Chowk, Nagpur, Maharashtra, India" },
    { sn: 2, name: "Bob", email: "bob@example.com", brand: "Dell", items: 'Telephone Exchange Chowk, Nagpur, Maharashtra, India', unit: "Nagpur, Maharashtra, India" },
    { sn: 3, name: "Charlie", email: "charlie@example.com", brand: "Lenovo", items: 'Telephone Exchange Chowk, Nagpur, Maharashtra, India', unit: "Nagpur, Maharashtra, India" },
  ];
  
    
      const filteredItems = itemsData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        
      );

     
    
      const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
          setActivePage(page);
        }
      };
      // /Inventory/vendorCreate
      const handleShowCreate = () => {
        navigator("/Inventory/vendorCreate");
      }

  return (

    <Container className=""
    //  style={{backgroundColor:"#F2F2F2"}}
     >
      <Row style={{ marginTop: "50px", 
        // backgroundColor:"#F2F2F2",height:"100vh" 
        
        }}>

        <Col sm={12} className="d-flex "  >
          {/* style={{top:"110px" , left:"700px"}} */}

          <div style={{ top: "186px" }}>
            <Breadcrumb  >
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">
                Purchase
              </BreadcrumbItem>
              <BreadcrumbItem active>Vendor List</BreadcrumbItem>
            </Breadcrumb>
          </div>

        </Col>



        {/* ----------------------------------------------------------------------------------------------------------------------------- */}

        <Card style={{ marginLeft: "10px" }}>
          <Row>

            <Col sm={4} className="d-flex">

              <div className="d-flex justify-content-start align-items-start mx-1 my-4" >
                <h1 style={{ fontFamily: '', fontSize: "18px", fontWeight: '500', lineHeight: "18px" }}>Vendor List</h1>
              </div>



            </Col>

            <Col sm={4} className="d-flex">
              <div className="d-flex justify-content-start align-items-start mx-1 my-3" >

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
                      {/* <X id="clearSearchResultsIcon" /> */}
                    </InputGroupText>
                  )}
                </InputGroup>
              </div>

            </Col>
            <Col sm={4} className="d-flex">
            <div className="d-flex justify-content-end align-items-end mx-1 my-4" >
              <Button variant="denger" className="btn  px-4 mx-4" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }}>
                <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={solar_export} />
                Export
              </Button>
              <Button variant="primary" className="btn  px-4 mx-4" size="sm" onClick={handleShowCreate}>
                <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={add} />
                New Vendor
              </Button>

            </div>
            </Col>

            <Col sm={12}>
              <DataTable
                columns={columns}
                data={filteredItems}
                // pagination
                highlightOnHover
                responsive
                persistTableHead
                customStyles={{
                  rows: { style: { backgroundColor: "#ffffff", borderRadius: "5px",marginBottom:"10px",marginTop:"10px"} },
                  headCells: {
                    style: { backgroundColor: "#e9f5f8", fontWeight: "bold", fontSize: "13px" },
                  },
                  table: { style: { borderRadius: "5px", overflow: "hidden" } },
                }}
              />
            </Col>
          </Row>

          
        </Card>

        <Pagination className="d-flex justify-content-end mt-3">
            <Pagination.Prev onClick={() => handlePageChange(activePage - 1)} disabled={activePage === 1} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i + 1} active={activePage === i + 1} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(activePage + 1)} disabled={activePage === totalPages} />
          </Pagination>
      </Row>


    </Container>
  );
};
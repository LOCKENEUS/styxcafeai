import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Form, FormControl, InputGroup, Button, Breadcrumb, BreadcrumbItem, Row, Image, Pagination } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import gm1 from '/assets/inventory/mynaui_search.svg'
import solar_export from '/assets/inventory/solar_export-linear.png'
import add from '/assets/inventory/material-symbols_add-rounded.png'
import { useDispatch, useSelector } from "react-redux";
import { getSaVendors } from "../../../store/slices/Inventory/saVendorSlice";

export const Vendor = () => {
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

  const itemsData = useSelector((state) => state.saVendor.vendors);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSaVendors());
  }, [dispatch]);

  const columns = [
    {
      name: "SN",
      selector: (row, index) => index + 1,
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
            <div style={{ color: "#0062FF", cursor: "pointer" }}><Link to={`/Inventory/VendorDetails/${row._id}`}>{row.name}</Link></div>
            <div style={{ fontSize: "12px", color: "gray" }}>{row.emailID}</div>
          </div>
        </div>
      ),
    },
    { name: "Company", selector: (row) => row.company, sortable: true },
    { name: "Billing Address", selector: (row) => row.billingAddress, sortable: true },
    { name: "Shipping Address", selector: (row) => row.shippingAddress, sortable: true },
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
    <Container>
      <Row style={{ marginTop: "16px" }}>
        <Col sm={12} className="d-flex" style={{ fontSize: "16px" }} >
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

        <Card style={{ marginLeft: "10px" }} className="shadow-sm my-3">
          <Row>
            <Col sm={4} className="d-flex">
              <div className="d-flex justify-content-start align-items-start mx-1 my-4" >
                {/* <h1
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '5px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >Vendor List</h1> */}

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
                  >Vendor List</h1>
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
                    style={{ background: "transparent", backgroundColor: "#FAFAFA", border: "none" }}
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
                  rows: { style: { backgroundColor: "#ffffff", borderRadius: "5px", marginBottom: "10px", marginTop: "10px" } },
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
import React from 'react'
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
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import gm1 from "/assets/inventory/mynaui_search.svg";
import solar_export from "/assets/inventory/solar_export-linear.png";
import add from "/assets/inventory/material-symbols_add-rounded.png";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Loader/Loader";
import { getShipmentList } from '../../../../store/slices/Inventory/shipSlice';

export const ShipmentList = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getShipmentList());
  }, [dispatch])

  const { shipmentList, loading } = useSelector(state => state.saShipment);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(3 / itemsPerPage);

  console.log("shipmentList", shipmentList);

  // Function to handle modal (replace with actual logic)
  const handleShowCreate = () => {
    navigate("/Inventory/Shipment");
  };

  const getRandomColor = (name) => {
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
    let index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
    return colors[index];
  };

  const itemsData = Array.isArray(shipmentList)
    ? shipmentList.map((item, index) => ({
      sn: index + 1,
      _id: item?._id,
      name: item?.po_no || "N/A",
      vendor: item?.vendor_id?.name || "N/A",
      status: item?.status || "Draft",
      deliveredDate: item?.delivery_date
        ? new Date(item.delivery_date).toISOString().split("T")[0]
        : "N/A",
    }))
    : [];

  const columns = [
    {
      name: "SN",
      selector: (row) => row.sn,
      minWidth: "70px",
      maxWidth: "70px",
    },
    {
      name: "Shipment No",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
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
            {row.name.charAt(0).toUpperCase()}
          </span> */}
          <div>
            <div
              style={{ color: "#0062FF", cursor: "pointer" }}
              onClick={() => handleShowDetails(row._id)}

            >
              {row.name}
            </div>
          </div>
        </div>
      ),
    },
    { name: "Client", selector: (row) => row?.vendor, sortable: true },
    { name: "Status", selector: (row) => row?.status, sortable: true },
    {
      name: "Shipping Date",
      selector: (row) => row.deliveredDate,
      sortable: true,
    },
  ];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const handleShowDetails = (id) => {
    navigate("/Inventory/Shipment/View", { state: id });
  }
  const filteredItems = itemsData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deliveredDate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const headers = ["S/N", "Pack No", "Client", "Status", "Delivery Date"];
    const rows = shipmentList?.selectedItem?.map(item => [
      item.sn, item.name, item.vendor, item.status, item.delivery_date
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'items_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container data-aos="fade-right" data-aos-duration="1000" fluid className="mt-4 min-vh-100">
      <Row>
        <Col sm={12} className="mx-2 my-3 px-5">
          <div style={{ top: "186px", fontSize: "16px" }}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/superadmin/dashboard">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/Inventory/dashboard">Inventory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Package Shipping List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        {/* Items List Card */}
        <Col sm={12}>

          <Card className="mx-4 p-3">
            <Row className="align-items-center">
              {/* Title */}
              <Col sm={4} className="d-flex my-2">
                <h2
                  // style={{
                  //   fontSize: "20px",
                  //   fontWeight: "500",
                  //   lineHeight: "18px",
                  // }}
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '5px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    // background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                    background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  className="m-0"
                >
                  PACKAGE SHIPPING LIST
                </h2>
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
                    placeholder="Search..."
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
                <Button variant="denger" className="btn  px-4 mx-2" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }} onClick={handleExport}>
                  <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={solar_export} />
                  Export
                </Button>

                <Button variant="primary" className="px-3 mx-2" size="sm" onClick={handleShowCreate}>
                  <Image
                    className="me-2"
                    style={{ width: "22px", height: "22px" }}
                    src={add}
                  />
                  New Shipment
                </Button>
              </Col>

              <Col sm={12} style={{ marginTop: "30px" }}>
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  progressPending={loading}
                  progressComponent={<div><Loader /></div>}

                  // pagination
                  highlightOnHover
                  responsive
                  persistTableHead
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 20, 30, 40]}
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
};
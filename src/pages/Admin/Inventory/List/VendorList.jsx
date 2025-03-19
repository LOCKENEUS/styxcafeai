import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Form, InputGroup, Pagination, Container, Row, Col, Breadcrumb, FormControl, Spinner, Card } from "react-bootstrap";
import { FaFileExport, FaSearch } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import gm1 from '/assets/inventory/mynaui_search.svg'
import solar_export from "/assets/inventory/solar_export-linear.png";
import { useDispatch, useSelector } from "react-redux";
import { getVendors, deleteVendor } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import { toast } from "react-toastify";

const avatarColors = ['#0062FF', '#FF6B6B', '#4CAF50', '#9C27B0', '#FF9800', '#795548', '#607D8B', '#E91E63'];

const VendorList = () => {
  const [search, setSearch] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const editDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { vendors, loading, error } = useSelector(state => state.vendors);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;  
  useEffect(() => {
    dispatch(getVendors(cafeId));
  }, [dispatch, cafeId]);
  
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (editDropdownRef.current && !editDropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getRandomColor = (index) => {
    return avatarColors[index % avatarColors.length];
  };
  
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      dispatch(deleteVendor(id))
        .unwrap()
        .then(() => {
          setActiveDropdownId(null);
        })
        .catch(error => {
          toast.error(error || "Failed to delete vendor");
        });
    }
  };
  
  const handleExport = () => {
    const csvHeader = "S/N,Vendor Name,Email,Company,Billing Address,Shipping Address\n";
    const csvRows = filteredVendors.map((vendor, index) =>
      `${index + 1},${vendor.name},${vendor.email},${vendor.company},${vendor.billingAddress},${vendor.shippingAddress}`
    );
  
    const csvContent = csvHeader + csvRows.join("\n");
  
    // Create a Blob with CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    // Create a temporary download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendor_list.csv";
    document.body.appendChild(a);
    a.click();
  
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Filter vendors based on search
  const filteredVendors = vendors?.filter(vendor => 
    vendor.name?.toLowerCase().includes(search.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(search.toLowerCase()) ||
    vendor.company?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Add handlePageChange function
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  return (
    <Container>
      <Row>
        <Col sm={12} className="mx-4 my-3">
          <div style={{ top: "186px", fontSize: "18px" }}>
            <Breadcrumb>
              <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="/admin/inventory">Inventory</Breadcrumb.Item>
              <Breadcrumb.Item active>Vendor List</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>

        <Col sm={12}>
          <Card className="mx-4 p-3">
            <Row className="align-items-center">
              <Col sm={4} className="d-flex my-2">
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    lineHeight: "18px",
                  }}
                  className="m-0"
                >
                  Vendor List
                </h1>
              </Col>

              <Col sm={3} className="d-flex my-2">
                <InputGroup className="navbar-input-group">
                  <InputGroup.Text
                    className="border-0"
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    <img src={gm1} alt="Search Icon" />
                  </InputGroup.Text>

                  <FormControl
                    type="search"
                    size="sm"
                    placeholder="Search for vendors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                  />

                  {search && (
                    <InputGroup.Text
                      as="button"
                      className="border-0 bg-transparent"
                      onClick={() => setSearch("")}
                    >
                      ✖
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </Col>

              <Col sm={5} className="d-flex justify-content-end text-end my-2">
                <Button variant="white" className="btn px-4 mx-2" size="sm" onClick={handleExport} style={{ borderColor: "#FF3636", color: "#FF3636" }}>
                  <img src={solar_export} alt="Export Icon" style={{ width: "22px", height: "22px" }} className="me-2" />
                  Export
                </Button>

                <Link to={'/admin/inventory/create-vendor'}>
                  <Button variant="primary" className="px-4 mx-2" size="sm">
                    <BsPlusLg className="me-2" style={{ fontSize: "1.2rem" }} />
                    New Vendor
                  </Button>
                </Link>
              </Col>

              <Col sm={12} style={{ marginTop: "30px" }}>
                <Table striped  hover style={{ minWidth: '600px', marginTop: "2rem" }}>
                  <thead className="no-uppercase" style={{ backgroundColor: '#0062FF0D' }}>
                    <tr >
                      {['S/N', 'Vendor Name', 'Company', 'Billing Address', 'Shipping Address', 'Actions'].map((header, index) => (
                        <th key={index} style={{  fontSize: "0.9rem" ,color:'black', textAlign:"center" }}>  <h4> {header} </h4> </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#F5F5F5" }}>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-danger">
                          {error}
                        </td>
                      </tr>
                    ) : filteredVendors.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No vendors found
                        </td>
                      </tr>
                    ) : (
                      filteredVendors
                        .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
                        .map((vendor, index) => (
                          <tr key={vendor._id}>
                            <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                            <td>
                              <div className="d-flex gap-2 align-items-center">
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: getRandomColor(index),
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: '10px',
                                }}>
                                  {getInitials(vendor.name)}
                                </div>
                                <div>
                                  <Link to={`/admin/inventory/vendor-details/${vendor._id}`} className="fw-bold text-primary">{vendor.name}</Link><br />
                                  <small>{vendor.email}</small>
                                </div>
                              </div>
                            </td>
                            <td>{vendor.company}</td>
                            <td>{vendor.billingAddress}</td>
                            <td>{vendor.shippingAddress}</td>
                            <td>
                              <Button
                                variant="link"
                                className="text-primary"
                                onClick={() => setActiveDropdownId(
                                  activeDropdownId === vendor._id ? null : vendor._id
                                )}
                              >
                                <FaEdit style={{ color: '#0062FF', fontSize: '1.2rem' }} />
                              </Button>

                              {activeDropdownId === vendor._id && (
                                <div
                                  ref={editDropdownRef}
                                  style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                    borderRadius: '4px',
                                    zIndex: 1000,
                                    minWidth: 'clamp(120px, 30vw, 150px)',
                                  }}
                                >
                                  <Link
                                    to={`/admin/inventory/vendors/edit/${vendor._id}`}
                                    style={{ textDecoration: 'none' }}
                                  >
                                    <div style={{
                                      padding: 'clamp(8px, 2vw, 10px)',
                                      cursor: 'pointer',
                                      color: '#0062FF',
                                      borderBottom: '1px solid #eee',
                                    }}>
                                      Edit Vendor
                                    </div>
                                  </Link>
                                  <div style={{
                                    padding: 'clamp(8px, 2vw, 10px)',
                                    cursor: 'pointer',
                                    color: '#FF0000',
                                  }}
                                    onClick={() => handleDelete(vendor._id)}
                                  >
                                    Delete Vendor
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.Prev 
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === activePage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
          />
        </Pagination>
      </div>
      <style jsx>{`
  .no-uppercase th {
    text-transform: none !important;
  }
`}</style>

    </Container>
  );
};

export default VendorList;

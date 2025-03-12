import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Form, InputGroup, Pagination, Container, Row, Col, Breadcrumb, FormControl, Spinner } from "react-bootstrap";
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

  return (
    <Container data-aos="fade-right" data-aos-duration="500" fluid className="mt-4 min-vh-100">
    <Breadcrumb>
        <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/admin/inventory">Inventory</Breadcrumb.Item>
        <Breadcrumb.Item href="/admin/inventory/vendor-list">Vendor List</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-between my-4">
        <h2>Vendor</h2>
        <div sm={4} className="d-flex">
                            <InputGroup className="mx-1 my-3">
                                <InputGroup.Text className="border-0" style={{ background: "#FAFAFA" }}>
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
                            </InputGroup>
                        </div>
        <div>
          <Button variant="light" className="me-2 border-1 text-danger border-danger" onClick={handleExport}>
            <img src={solar_export} alt="Export Icon" /> Export
          </Button>
          <Link to={'/admin/inventory/create-vendor'}>
          <Button  variant="primary">
            <BsPlusLg className="me-2" style={{fontSize:"1.2rem"}} /> New Vendor
          </Button>
          </Link>
        </div>
      </div>
      <Table striped bordered hover style={{ minWidth: '600px', marginTop:"2rem" }}>
          <thead style={{ backgroundColor: '#0062FF0D' }}>
            <tr>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
              }}>S/N</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
              }}>Vendor Name</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
              }}>Company</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
              }}>Billing Address</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
              }}>Shipping Address</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
              }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{backgroundColor:"#F5F5F5"}}>
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
              filteredVendors.map((vendor, index) => (
                <tr key={vendor._id}>
                  <td style={{
                    padding: 'clamp(10px, 2vw, 15px)',
                    border: 'none',
                  }}>{index + 1}</td>
                  <td style={{
                    padding: 'clamp(10px, 2vw, 15px)',
                    border: 'none',
                  }}>
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
                  <td style={{
                    padding: 'clamp(10px, 2vw, 15px)',
                    border: 'none',
                  }}>{vendor.company}</td>
                  <td style={{
                    padding: 'clamp(10px, 2vw, 15px)',
                    border: 'none',
                  }}>{vendor.billingAddress}</td>
                  <td style={{
                    padding: 'clamp(10px, 2vw, 15px)',
                    border: 'none',
                  }}>{vendor.shippingAddress}</td>
                  <td style={{
                    padding: 'clamp(10px, 2vw, 15px)',
                    border: 'none',
                    position: 'relative',
                  }}>
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
      <Row className="justify-content-end mt-3">
        <Col xs="auto">
          <Pagination>
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Next />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorList;

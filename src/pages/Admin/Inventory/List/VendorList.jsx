import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Form, InputGroup, Pagination, Container, Row, Col } from "react-bootstrap";
import { FaFileExport, FaSearch } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const avatarColors = ['#0062FF', '#FF6B6B', '#4CAF50', '#9C27B0', '#FF9800', '#795548', '#607D8B', '#E91E63'];

const dummyVendors = [
  { id: 1, name: "Shardul Thakur", email: "shardulthakur12@gmail.com", company: "Appearance Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "S" },
  { id: 2, name: "Pravin Reddy", email: "pravinreddy12@gmail.com", company: "Regular Mineral Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "P" },
  { id: 3, name: "Zein Malik", email: "zeinmalik12@gmail.com", company: "Stroke Frame Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "Z" },
  { id: 4, name: "Elivish Rathore", email: "elivishrathore12@gmail.com", company: "Snacks Food Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "E" },
  { id: 5, name: "Ashok Bhatia", email: "ahokbhatia12@gmail.com", company: "Pool Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "A" },
  { id: 6, name: "Shardul Thakur", email: "shardulthakur12@gmail.com", company: "Appearance Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "K" },
  { id: 7, name: "Shardul Thakur", email: "shardulthakur12@gmail.com", company: "Appearance Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "R" },
  { id: 8, name: "Shardul Thakur", email: "shardulthakur12@gmail.com", company: "Appearance Pvt Ltd", billing: "Mahal Nagpur, Maharashtra", shipping: "Andheri West Mumbai, (MH)", avatar: "M" },
];

const VendorList = () => {
  const [search, setSearch] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const editDropdownRef = useRef(null);

  const getRandomColor = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  return (
    <Container className="mt-4">
      <h5 className="text-muted ">
        Home / Purchase / <span className="text-primary">Vendor List</span>
      </h5>
      <div className="d-flex justify-content-between my-4">
        <h2>Vendor</h2>
        <InputGroup className="d-flex align-items-center" style={{ maxWidth: "300px" 
            
         }}>
        <FaSearch className="me-2 text-muted" />
          <Form.Control
            placeholder="Search for Vendors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <div>
          <Button variant="light" className="me-2 border-1 text-danger border-danger">
            <FaFileExport className="me-2 text-danger" /> Export
          </Button>
          <Button variant="primary">
            <BsPlusLg className="me-2" style={{fontSize:"1.2rem"}} /> New Vendor
          </Button>
        </div>
      </div>
      <Table striped bordered hover style={{ minWidth: '600px', marginTop:"2rem" }}>
          <thead style={{ backgroundColor: '#0062FF0D' }}>
            <tr>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}>S/N</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}>Vendor Name</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}>Company</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}>Billing Address</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}>Shipping Address</th>
              <th style={{
                padding: 'clamp(10px, 2vw, 15px)',
                border: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{backgroundColor:"#F5F5F5"}}>
            {dummyVendors.map((vendor, index) => (
              <tr key={vendor.id}>
                <td style={{
                  padding: 'clamp(10px, 2vw, 15px)',
                  border: 'none',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}>{index + 1}</td>
                <td style={{
                  padding: 'clamp(10px, 2vw, 15px)',
                  border: 'none',
                  fontSize: 'clamp(14px, 3vw, 16px)',
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
                      fontSize: '16px',
                    }}>
                      {vendor.avatar}
                    </div>
                    <div>
                     <Link to={'/admin/inventory/vendor-details'} className="fw-bold text-primary">{vendor.name}</Link><br />
                      <small>{vendor.email}</small>
                    </div>
                  </div>
                </td>
                <td style={{
                  padding: 'clamp(10px, 2vw, 15px)',
                  border: 'none',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}>{vendor.company}</td>
                <td style={{
                  padding: 'clamp(10px, 2vw, 15px)',
                  border: 'none',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}>{vendor.billing}</td>
                <td style={{
                  padding: 'clamp(10px, 2vw, 15px)',
                  border: 'none',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}>{vendor.shipping}</td>
                <td style={{
                  padding: 'clamp(10px, 2vw, 15px)',
                  border: 'none',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  position: 'relative',
                }}>
                  <Button
                    variant="link"
                    className="text-primary"
                    onClick={() => setActiveDropdownId(
                      activeDropdownId === vendor.id ? null : vendor.id
                    )}
                  >
                    <FaEdit style={{ color: '#0062FF', fontSize: '1.2rem' }} />
                  </Button>

                  {activeDropdownId === vendor.id && (
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
                        to={`/admin/inventory/edit-vendor/${vendor.id}`}
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
                        onClick={() => {/* handle delete */}}
                      >
                        Delete Vendor
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
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

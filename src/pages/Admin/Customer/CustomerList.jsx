import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Table, Pagination, InputGroup, FormControl } from "react-bootstrap";
import { IoAdd } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers, deleteCustomer } from "../../../store/AdminSlice/CustomerSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader/Loader";
import { BiSearch } from "react-icons/bi";

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const editDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const cafeId = user?._id;

    if (cafeId) {
      dispatch(getCustomers(cafeId));
    }
  }, [dispatch]);

  const handleDeleteCustomer = (customerId) => {
    dispatch(deleteCustomer(customerId));
    setActiveDropdownId(null);
  };

  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editDropdownRef.current && !editDropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editDropdownRef]);

  // Add handlePageChange function
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer?.contact_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4" style={{ padding: '0 1rem' }}>
      <>
        <div className="d-flex justify-content-between align-items-center mt-5 mb-5" style={{ flexDirection: 'row', gap: '1rem' }}>
          <h4 className="text-dark fw-bold" style={{ fontSize: 'clamp(20px, 5vw, 25px)', margin: 0 }}>
            Customer List
          </h4>

          {/* Search Input */}
          <InputGroup className="mb-3 w-50">
            <div className="d-flex px-2 bg-white align-items-center">
              <BiSearch size={20} />
            </div>
            <FormControl
              className="border-none"
              placeholder="Search by Name, Contact, or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Link to="/admin/users/create-customer">
            <IoAdd
              style={{
                fontSize: 'clamp(30px, 8vw, 40px)',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: 'blue',
                border: '2px solid blue',
                borderRadius: '50%',
                padding: '0.2rem',
              }}
            />
          </Link>
        </div>

        <div data-aos="fade-right" ata-aos-duration="1000" style={{ overflowX: 'auto', width: '100%' }}>
          <Table striped hover style={{ minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#0062FF0D' }}>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                    <Loader />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    No Customer found. Click the + button to add a new customer.
                  </td>
                </tr>
              ) : (
                filteredCustomers
                  .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
                  .map((customer, index) => (
                    <tr key={customer._id}>
                      <td>{index + 1}</td>
                      <td onClick={() => navigate(`/admin/users/customer-details/${customer._id}`)} style={{ color: 'blue', cursor: 'pointer' }}>
                        {customer.name}
                      </td>
                      <td>{customer.contact_no || 'N/A'}</td>
                      <td>{customer.email || 'N/A'}</td>
                      <td>{customer.gender || 'N/A'}</td>
                      <td>{customer.address || 'N/A'}</td>
                      <td>{customer.age || 'N/A'}</td>
                      <td>
                        <Button variant="link"
                          className="text-danger"
                          onClick={() => handleDeleteCustomer(customer._id)}
                        >
                          <FaTrash style={{ color: '#FF0000', fontSize: '1.2rem' }} />
                        </Button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Add pagination */}
        <div className="d-flex justify-content-center mt-3 mb-3">
          <div className="pagination-wrapper">
            <Pagination size={window.innerWidth < 768 ? "sm" : ""}>
              <Pagination.Prev onClick={() => handlePageChange(activePage - 1)} disabled={activePage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === activePage} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(activePage + 1)} disabled={activePage === totalPages} />
            </Pagination>
          </div>
        </div>
      </>

      {/* Optional: Add custom CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            padding: 0 0.5rem;
          }

          h4 {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          thead th {
            font-size: 12px;
            padding: 8px;
          }
          tbody td {
            font-size: 12px;
            padding: 8px;
          }
        }

        .pagination-wrapper {
          overflow-x: auto;
          padding: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default CustomerList;
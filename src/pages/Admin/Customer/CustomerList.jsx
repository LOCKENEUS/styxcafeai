import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Table } from "react-bootstrap";
import { IoAdd } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers, deleteCustomer } from "../../../store/AdminSlice/CustomerSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader/Loader";
const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const editDropdownRef = useRef(null);
  const navigate = useNavigate();
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

  // Remove the displayCustomers variable and use customers directly

  return (
    <div className="container mt-4" style={{ padding: '0 1rem' }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Loader />
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div
            className="d-flex justify-content-between align-items-center mt-5 mb-5"
            style={{ flexDirection: 'row', gap: '1rem' }}
          >
            <h4
              className="text-dark fw-bold"
              style={{ fontSize: 'clamp(20px, 5vw, 25px)', margin: 0 }}
            >
              Customer List
            </h4>
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

          {/* Wrapping table in a scrollable div */}
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <Table striped bordered hover style={{ minWidth: '600px' }}>
              <thead style={{ backgroundColor: '#0062FF0D' }}>
                <tr>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    S/N
                  </th>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    Contact
                  </th>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    Gender
                  </th>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    Address
                  </th>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    Date of Birth
                  </th>
                  <th
                    style={{
                      padding: 'clamp(10px, 2vw, 15px)',
                      border: 'none',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td 
                      colSpan="8" 
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                      }}
                    >
                   empty customer list

                    </td>
                  </tr>
                ) : (
                  customers.map((customer, index) => (
                    <tr key={customer._id}>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)', 
                          color: 'blue',
                          cursor: 'pointer',
                        }}
                      onClick={() => navigate(`/admin/users/customer-details/${customer._id}`)}
                      >
                        {customer.name}
                      </td>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                        }}
                      >
                        {customer.contact_no}
                      </td>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                        }}
                      >
                        {customer.email}
                      </td>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                        }}
                      >
                        {customer.gender}
                      </td>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                        }}
                      >
                        {customer.address}
                      </td>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                        }}
                      >
                        {customer.age}
                      </td>
                      <td
                        style={{
                          padding: 'clamp(10px, 2vw, 15px)',
                          border: 'none',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                          gap: '10px'
                          
                        }}
                      >
                        <Link 
                          to={`/admin/users/create-customer/${customer._id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="link"
                            className="text-primary p-0 mx-2"
                          >
                            <FaEdit style={{ color: '#0062FF', fontSize: '1.2rem' }} />
                          </Button>
                        </Link>
                        <Button
                          variant="link"
                          className="text-danger p-0"
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
        </>
      )}

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
      `}</style>
    </div>
  );
};

export default CustomerList;
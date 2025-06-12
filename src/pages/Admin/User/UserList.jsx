import React, { useState, useRef, useEffect } from "react";
import { Button, Table, Pagination, FormControl, InputGroup } from "react-bootstrap";
import { IoAdd } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../../store/AdminSlice/UserSlice";
import Loader from "../../../components/common/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const editDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Pagination state
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const cafeId = user?._id;

    if (cafeId) {
      dispatch(getUsers(cafeId));
    }
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
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

  // Pagination handling
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contact_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage); // Calculate total pages based on filtered users

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4 mx-2 py-2 bg-white rounded-2" style={{ padding: '0 1rem' }}>
      <div
        className="d-flex justify-content-between align-items-center mt-3 mb-3"
        style={{ flexDirection: 'row', gap: '1rem' }}
      >
        <div
          className="text-dark fw-bold responsive-heading"
        >
          User List
        </div>

        {/* Search Input */}
        <InputGroup className="mb-3 w-50 mt-3">
          <div className="d-flex px-2 bg-white align-items-center">
            <BiSearch size={20} />
          </div>
          <FormControl
            className="border-none "
            placeholder="Search by Name, Contact, or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Link to="/admin/users/create-user">
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



      {filteredUsers.length === 0 ? (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table data-aos="fade-right" ata-aos-duration="1000" striped hover style={{ minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#0062FF0D' }}>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No users found. Click the + button to add a new user.
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table striped hover style={{ minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#0062FF0D' }}>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers
                .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage) // Pagination logic
                .map((user, index) => (
                  <tr key={user._id}>
                    <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                    <td style={{ color: 'blue' }} onClick={() => navigate(`/admin/users/user-details/${user._id}`)}>
                      {user.name}
                    </td>
                    <td>{user.contact_no}</td>
                    <td>{user.email}</td>
                    <td>{user.department}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button
                        variant="link"
                        className="text-primary"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <FaTrash style={{ color: 'red', fontSize: '1.2rem' }} />
                      </Button>


                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}

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

export default UserList;

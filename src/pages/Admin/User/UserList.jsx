import React, { useState, useRef, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { IoAdd } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../../store/AdminSlice/UserSlice";
import Loader from "../../../components/common/Loader/Loader";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const editDropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4" style={{ padding: '0 1rem' }}>
      <div
        className="d-flex justify-content-between align-items-center mt-5 mb-5"
        style={{ flexDirection: 'row', gap: '1rem' }}
      >
        <h4
          className="text-dark fw-bold"
          style={{ fontSize: 'clamp(20px, 5vw, 25px)', margin: 0 }}
        >
          User List
        </h4>
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

      {users.length === 0 ? (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table data-aos="fade-right" ata-aos-duration="1000"  striped bordered hover style={{ minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#0062FF0D' }}>
              <tr>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  S/N
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Name
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Contact
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Email
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Department
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Role
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Actions
                </th>
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
          <Table striped bordered hover style={{ minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#0062FF0D' }}>
              <tr>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  S/N
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Name
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Contact
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Email
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Department
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Role
                </th>
                <th style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user,index) => (
                <tr key={user._id}>
                  <td style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', 
                  color: 'blue',
                  fontSize: 'clamp(14px, 3vw, 16px)' }} 
                  onClick={() => navigate(`/admin/users/user-details/${user._id}`)}
                  >
                    {user.name}
                  </td>
                  <td style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    {user.contact_no}
                  </td>
                  <td style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    {user.department}
                  </td>
                  <td style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    {user.role}
                  </td>
                  <td style={{ padding: 'clamp(10px, 2vw, 15px)', border: 'none', fontSize: 'clamp(14px, 3vw, 16px)', position: 'relative' }}>
                    <Button
                      variant="link"
                      className="text-primary"
                      onClick={() => setActiveDropdownId(activeDropdownId === user._id ? null : user._id)}
                    >
                      <FaEdit style={{ color: '#0062FF', fontSize: '1.2rem' }} />
                    </Button>

                    {activeDropdownId === user._id && (
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
                          to={`/admin/users/create-user/${user._id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <div
                            style={{
                              padding: 'clamp(8px, 2vw, 10px)',
                              cursor: 'pointer',
                              color: '#0062FF',
                              borderBottom: '1px solid #eee',
                            }}
                          >
                            Edit User
                          </div>
                        </Link>
                        <div
                          style={{
                            padding: 'clamp(8px, 2vw, 10px)',
                            cursor: 'pointer',
                            color: '#FF0000',
                          }}
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete User
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

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

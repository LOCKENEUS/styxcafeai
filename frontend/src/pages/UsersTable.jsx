import React from 'react';
import { Table, ProgressBar, Container, Nav, Row, Col } from 'react-bootstrap';
import Userimg1 from '/assets/Front/img10.jpg'
import Userimg2 from '/assets/Front/img6.jpg'
const UsersTable = () => {
  const users = [
    {
      id: 1,
      name: 'Amanda Harvey',
      email: 'amanda@site.com',
      position: 'Director',
      department: 'Human resources',
      country: 'United Kingdom',
      status: 'Active',
      statusColor: 'success',
      portfolio: 72,
      role: 'Employee',
      avatar: { image: Userimg1 },
      endorsed: true
    },
    {
      id: 2,
      name: 'Anne Richard',
      email: 'anne@site.com',
      position: 'Seller',
      department: 'Branding products',
      country: 'United States',
      status: 'Pending',
      statusColor: 'warning',
      portfolio: 24,
      role: 'Employee',
      avatar: { initials: 'A', color: 'primary' }
    },
    // Add other users following the same structure
  ];

  return (
    <Container>
      <div className="page-header">
        <Row className="align-items-end">
          <Col sm className="mb-2 mt-6 mb-sm-0">

            <h1 className="page-header-title">Users</h1>
          </Col>

        </Row>
      </div>
      <Table responsive borderless className="table-lg">
        <thead className="thead-light">
          <tr>
            <th>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="datatableCheckAll" />
              </div>
            </th>
            <th>Name</th>
            <th>Position</th>
            <th>Country</th>
            <th>Status</th>
            <th>Portfolio</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id={`userCheck${user.id}`} />
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  {user.avatar.image ? (
                    <img
                      src={user.avatar.image}
                      alt={user.name}
                      className="avatar avatar-circle me-3"
                    />
                  ) : (
                    <div className={`avatar avatar-soft-${user.avatar.color} avatar-circle me-3`}>
                      <span className="avatar-initials">{user.avatar.initials}</span>
                    </div>
                  )}
                  <div>n
                    <div className="h5 mb-0">
                      {user.name}
                      {user.endorsed && (
                        <i className="bi-patch-check-fill text-primary ms-1" />
                      )}
                    </div>
                    <div className="text-body">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="h5 mb-0">{user.position}</div>
                <div className="text-body">{user.department}</div>
              </td>
              <td>{user.country}</td>
              <td>
                <span className={`legend-indicator bg-${user.statusColor}`} />
                {user.status}
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <span className="me-2">{user.portfolio}%</span>
                  <ProgressBar now={user.portfolio} style={{ width: '100px', height: '5px' }} />
                </div>
              </td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-white btn-sm">
                  <i className="bi-pencil-fill me-1" /> Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UsersTable;
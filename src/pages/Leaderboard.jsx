import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
  Nav,
  Tab,
  Tabs,
  Table,
  Image,
  Badge
} from 'react-bootstrap';

import Userimg1 from '/assets/Front/img10.jpg'
import Userimg2 from '/assets/Front/img10.jpg'

const Leaderboard = () => {
  const [key, setKey] = useState('all-time');

  // You'll need to implement the chart components separately using react-chartjs-2
  const ChartPlaceholder = () => (
    <div style={{ height: '2rem', width: '6rem', backgroundColor: '#f0f0f0' }} />
  );

  const UserAvatar = ({ src, initials, color }) => {
    if (src) {
      return <Image src={src} roundedCircle width="40" height="40" />;
    }
    return (
      <div
        className={`avatar avatar-soft-${color} avatar-circle`}
        style={{ width: '40px', height: '40px' }}
      >
        <span className="avatar-initials">{initials}</span>
      </div>
    );
  };

  const EfficiencyBadge = ({ trend, value }) => {
    const isPositive = trend === 'up';
    return (
      <Badge bg={isPositive ? 'success' : 'danger'} className="p-1">
        <i className={`bi-graph-${trend}`}></i> {value}
      </Badge>
    );
  };

  return (
    <Container fluid>
      {/* Page Header */}
      <div className="page-header">
        <Row className="align-items-end">
          <Col sm className="mb-2 mb-sm-0">

            <h1 className="page-header-title">Leaderboard</h1>
          </Col>

          <Col sm="auto">
            <Nav variant="pills" activeKey={key} onSelect={(k) => setKey(k)}>
              <Nav.Item>
                <Nav.Link eventKey="all-time">All time</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="weekly">Weekly</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="monthly">Monthly</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </div>

      <Card>
        <Tab.Content>
          <Tab.Pane eventKey="all-time" active>
            <div className="table-responsive">
              <Table borderless className="align-middle">
                <thead className="thead-light">
                  <tr>
                    <th style={{ width: '2rem' }}>Rank</th>
                    <th>Name</th>
                    <th>Closed issues</th>
                    <th>Completed projects</th>
                    <th>Progress</th>
                    <th>Efficiency rate</th>
                    <th>Hours</th>
                    <th>Avg. Score</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Repeat similar structure for each row */}
                  <tr>
                    <td><span style={{ fontSize: '1.5rem' }}>🥇</span></td>
                    <td>
                      <a className="d-flex align-items-center" href="#">
                        <UserAvatar src={Userimg1} />
                        <div className="ms-3">
                          <span className="d-block h5 mb-0">Amanda Harvey</span>
                        </div>
                      </a>
                    </td>
                    <td>20</td>
                    <td>35</td>
                    <td><ChartPlaceholder /></td>
                    <td><EfficiencyBadge trend="up" value="1.5%" /></td>
                    <td>505</td>
                    <td><i className="bi-star-fill text-warning me-1"></i> 4.97</td>
                  </tr>
                  {/* Add other rows similarly */}
                </tbody>
              </Table>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="weekly">
            {/* Weekly Table - similar structure */}
          </Tab.Pane>

          <Tab.Pane eventKey="monthly">
            {/* Monthly Table - similar structure */}
          </Tab.Pane>
        </Tab.Content>
      </Card>
    </Container>
  );
};

export default Leaderboard;
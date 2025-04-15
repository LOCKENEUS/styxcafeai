import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Nav, Dropdown } from 'react-bootstrap';
import { FaRegUser, FaChartLine, FaBell, FaCog } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { PiGameController, PiGameControllerBold } from "react-icons/pi";
import { MdOutlineLocalCafe, MdDashboard } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { LuMapPinHouse } from "react-icons/lu";
import { BiChevronRightCircle, BiSearch, BiCalendar } from "react-icons/bi";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './CafeDashboard.css'; // For custom CSS

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const CafeManagementDashboard = () => {
  // Initialize AOS animation
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFilter, setTimeFilter] = useState('weekly');

  // Dummy data
  const summaryData = {
    totalUsers: 1248,
    totalCustomers: 876,
    cafeCards: 653,
    gamesCards: 312,
    totalLocation: 20,
    membershipCards: 485
  };

  const recentUsers = [
    { id: 1, name: "Emma Wilson", email: "emma@example.com", status: "Active", joinDate: "12 Apr 2025" },
    { id: 2, name: "James Miller", email: "james@example.com", status: "Active", joinDate: "10 Apr 2025" },
    { id: 3, name: "Sarah Johnson", email: "sarah@example.com", status: "Inactive", joinDate: "08 Apr 2025" },
    { id: 4, name: "Michael Brown", email: "michael@example.com", status: "Active", joinDate: "05 Apr 2025" },
  ];

  const recentCustomers = [
    { id: 1, name: "Alex Thompson", visits: 23, lastVisit: "14 Apr 2025", spent: "$178.50" },
    { id: 2, name: "Olivia Parker", visits: 16, lastVisit: "13 Apr 2025", spent: "$124.75" },
    { id: 3, name: "Daniel Martinez", visits: 31, lastVisit: "12 Apr 2025", spent: "$256.20" },
    { id: 4, name: "Sophia Chen", visits: 8, lastVisit: "10 Apr 2025", spent: "$67.30" },
  ];

  // Chart Data
  const customerGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Customers',
        data: [65, 78, 90, 85, 102, 98, 114, 120, 135, 142, 158, 165],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const cardUsageData = {
    labels: ['Cafe Cards', 'Games Cards', 'Membership Cards'],
    datasets: [
      {
        label: 'Number of Cards',
        data: [summaryData.cafeCards, summaryData.gamesCards, summaryData.membershipCards],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const weeklyRevenueData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1200, 1900, 1500, 1700, 2100, 2800, 2300],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Customer Growth Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Card Distribution',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Revenue',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Main Content */}
      <div className="">
     

        {/* Dashboard Content */}
        <Container fluid className="py-4 px-4">
          {/* Welcome Header */}
          <div className="welcome-header" data-aos="fade-up">
            <Row className="mb-4 align-items-center">
              <Col>
                <h3 className="text-primary fw-bold mb-0">Dashboard Overview</h3>
                <p className="text-muted">Welcome back, Admin! Here's what's happening with your cafe operations</p>
              </Col>
              <Col xs="auto">
                <Button variant="primary" className="shadow-sm">
                  Generate Report
                </Button>
              </Col>
            </Row>
          </div>

          {/* Stats Cards */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6} sm={6} data-aos="fade-up" data-aos-delay="100">
              <Card className="border-start-primary shadow h-100 py-2">
                <Card.Body>
                  <Row className="no-gutters align-items-center">
                    <Col className="mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Users
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{summaryData.totalUsers}</div>
                      <div className="small text-success fw-bold">
                        <i className="fas fa-arrow-up"></i> +12% from last month
                      </div>
                    </Col>
                    <Col xs="auto">
                      <div className="icon-circle bg-primary text-white">
                        <FaRegUser size={24} />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} sm={6} data-aos="fade-up" data-aos-delay="200">
              <Card className="border-start-success shadow h-100 py-2">
                <Card.Body>
                  <Row className="no-gutters align-items-center">
                    <Col className="mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Total Customers
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{summaryData.totalCustomers}</div>
                      <div className="small text-success fw-bold">
                        <i className="fas fa-arrow-up"></i> +8.4% from last month
                      </div>
                    </Col>
                    <Col xs="auto">
                      <div className="icon-circle bg-success text-white">
                        <RiCustomerService2Fill size={24} />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} sm={6} data-aos="fade-up" data-aos-delay="300">
              <Card className="border-start-info shadow h-100 py-2">
                <Card.Body>
                  <Row className="no-gutters align-items-center">
                    <Col className="mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Total Locations
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{summaryData.totalLocation}</div>
                      <div className="small text-info fw-bold">
                        <i className="fas fa-arrow-right"></i> No change
                      </div>
                    </Col>
                    <Col xs="auto">
                      <div className="icon-circle bg-info text-white">
                        <LuMapPinHouse size={24} />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} sm={6} data-aos="fade-up" data-aos-delay="400">
              <Card className="border-start-warning shadow h-100 py-2">
                <Card.Body>
                  <Row className="no-gutters align-items-center">
                    <Col className="mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Total Cards
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {summaryData.cafeCards + summaryData.gamesCards + summaryData.membershipCards}
                      </div>
                      <div className="small text-success fw-bold">
                        <i className="fas fa-arrow-up"></i> +5.2% from last month
                      </div>
                    </Col>
                    <Col xs="auto">
                      <div className="icon-circle bg-warning text-white">
                        <LuCrown size={24} />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row className="mb-4">
            <Col lg={8} data-aos="fade-right">
              <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Customer Growth Overview</h6>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="no-arrow">
                      <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>View Details</Dropdown.Item>
                      <Dropdown.Item>Export Data</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Header>
                <Card.Body>
                  <div className="chart-area">
                    <Line data={customerGrowthData} options={lineChartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} data-aos="fade-left">
              <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Card Distribution</h6>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="no-arrow">
                      <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>View Details</Dropdown.Item>
                      <Dropdown.Item>Export Data</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Header>
                <Card.Body>
                  <div className="chart-pie pt-4 pb-2">
                    <Doughnut data={cardUsageData} options={doughnutOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

         

          {/* Cards Section */}
          <h4 className="h5 mb-3 text-gray-800 fw-bold" data-aos="fade-up">Card Management</h4>
          <Row className="g-3 mb-4">
            <Col lg={4} md={6} data-aos="zoom-in" data-aos-delay="100">
              <Card className="shadow border-0 h-100 card-hover">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="rounded-lg bg-primary bg-opacity-10 p-3 text-primary">
                      <MdOutlineLocalCafe size={28} />
                    </div>
                    {/* <Badge bg="primary" className="card-badge">Active</Badge> */}
                  </div>
                  <h5 className="font-weight-bold mb-1">Cafe Cards</h5>
                  <p className="text-muted mb-3">Manage cafe-specific cards and privileges</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h4 fw-bold mb-0">{summaryData.cafeCards}</h3>
                    <Button variant="outline-primary" size="sm" className="rounded-pill d-flex align-items-center">
                      Manage <BiChevronRightCircle className="ms-1" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} data-aos="zoom-in" data-aos-delay="200">
              <Card className="shadow border-0 h-100 card-hover">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                  <div className="rounded-lg bg-danger bg-opacity-10 p-3 text-danger">          
                                <PiGameControllerBold size={28} />
                    </div>
                    {/* <Badge bg="success" className="card-badge">Active</Badge> */}
                  </div>
                  <h5 className="font-weight-bold mb-1">Games Cards</h5>
                  <p className="text-muted mb-3">Manage gaming services and rewards</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h4 fw-bold mb-0">{summaryData.gamesCards}</h3>
                    <Button variant="outline-primary" size="sm" className="rounded-pill d-flex align-items-center">
                      Manage <BiChevronRightCircle className="ms-1" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} data-aos="zoom-in" data-aos-delay="300">
              <Card className="shadow border-0 h-100 card-hover">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="rounded-lg bg-warning bg-opacity-10 p-3 text-warning">
                      <LuCrown size={28} />
                    </div>
                    {/* <Badge bg="success" className="card-badge">Active</Badge> */}
                  </div>
                  <h5 className="font-weight-bold mb-1">Membership Cards</h5>
                  <p className="text-muted mb-3">Manage membership levels and benefits</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h4 fw-bold mb-0">{summaryData.membershipCards}</h3>
                    <Button variant="outline-primary" size="sm" className="rounded-pill d-flex align-items-center">
                      Manage <BiChevronRightCircle className="ms-1" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tables Section */}
          <Row className="g-4">
            <Col lg={6} data-aos="fade-up" data-aos-delay="100">
              <Card className="shadow border-0">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="font-weight-bold mb-0 text-primary">Recent Users</h5>
                    <Button variant="outline-primary" size="sm" className="rounded-pill">View All</Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="table-flush">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Join Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map(user => (
                        <tr key={user.id} className="align-middle">
                          <td className="ps-3 fw-medium">{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge 
                              bg={user.status === 'Active' ? 'success' : 'secondary'}
                              className="rounded-pill"
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td>{user.joinDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} data-aos="fade-up" data-aos-delay="200">
              <Card className="shadow border-0">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="font-weight-bold mb-0 text-primary">Recent Customers</h5>
                    <Button variant="outline-primary" size="sm" className="rounded-pill">View All</Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="table-flush">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Name</th>
                        <th>Visits</th>
                        <th>Last Visit</th>
                        <th>Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCustomers.map(customer => (
                        <tr key={customer.id} className="align-middle">
                          <td className="ps-3 fw-medium">{customer.name}</td>
                          <td>{customer.visits}</td>
                          <td>{customer.lastVisit}</td>
                          <td className="fw-semibold text-success">{customer.spent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
           {/* Revenue Chart */}
           <Row className="mb-4">
            <Col lg={12} data-aos="fade-up">
              <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Weekly Revenue</h6>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="no-arrow">
                      <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>View Details</Dropdown.Item>
                      <Dropdown.Item>Export Data</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Header>
                <Card.Body>
                  <div className="chart-bar">
                    <Bar data={weeklyRevenueData} options={barChartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

<style jsx>{`
  .dashboard-wrapper {
    display: flex;
  }

  .main-content {
    margin-left: 250px;
    width: calc(100% - 250px);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .sidebar-brand {
    padding: 1.5rem 1rem;
    text-align: center;
  }

  .sidebar-nav .sidebar-item {
    padding: 0.8rem 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .sidebar-nav .sidebar-item:hover,
  .sidebar-nav .sidebar-item.active {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    text-decoration: none;
  }

  .sidebar-icon {
    margin-right: 0.75rem;
  }

  .navbar {
    padding: 0.5rem 1rem;
  }

  .icon-circle {
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .search-bar {
    max-width: 300px;
  }

  .border-start-primary {
    border-left: 0.25rem solid #4e73df !important;
  }

  .border-start-success {
    border-left: 0.25rem solid #1cc88a !important;
  }

  .border-start-info {
    border-left: 0.25rem solid #36b9cc !important;
  }

  .border-start-warning {
    border-left: 0.25rem solid #f6c23e !important;
  }

  .card-hover {
    transition: all 0.3s ease;
  }

  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
  }

  .table-flush td, 
  .table-flush th {
    padding: 1rem;
    border-top: 1px solid #e3e6f0;
  }

  .sticky-footer {
    padding: 1rem 0;
    margin-top: auto;
  }

  .chart-area, 
  .chart-pie, 
  .chart-bar {
    position: relative;
    height: 20rem;
    width: 100%;
  }

  /* Added missing styles */
  .sidebar-divider {
    margin: 0 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .topbar-divider {
    width: 0;
    border-right: 1px solid #e3e6f0;
    height: calc(4.375rem - 2rem);
    margin: auto 1rem;
  }

  .no-arrow::after {
    display: none !important;
  }

  .card-badge {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.35em 0.65em;
  }

  .bg-purple {
    background-color: #6f42c1 !important;
  }

  .text-purple {
    color: #6f42c1 !important;
  }
`}</style>
    </div>
    
  );
};


export default CafeManagementDashboard;
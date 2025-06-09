import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaRegUser,
  FaChartLine,
  FaArrowUp,
  FaChartBar,
  FaCircle,
  FaChartPie,
  FaArrowDown,
} from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { PiGameController, PiGameControllerBold } from "react-icons/pi";
import { MdOutlineLocalCafe, MdDashboard } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { LuMapPinHouse } from "react-icons/lu";
import { BiChevronRightCircle, BiSearch, BiCalendar } from "react-icons/bi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdQuestionMark } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../../store/slices/dashboardSlice";
import { useNavigate } from "react-router-dom";

// import 'bootstrap/dist/css/bootstrap.min.css';
// import './CafeDashboard.css'; // For custom CSS

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Legend
);

const CafeManagementDashboard = () => {
  // Initialize AOS animation
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // State management
  // const [activeTab, setActiveTab] = useState("dashboard");
  // const [timeFilter, setTimeFilter] = useState("weekly");
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeMonth, setActiveMonth] = useState(currentDate.getMonth());
  const [activeYear, setActiveYear] = useState(currentDate.getFullYear());
  const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
  const [showCalendar, setShowCalendar] = useState(true);
  const [showCalendarInfo, setShowCalendarInfo] = useState(false);
  const [showGrowthInfo, setShowGrowthInfo] = useState(false);
  const [showRevenueInfo, setShowRevenueInfo] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [monthlyCommission, setMonthlyCommission] = useState([]);
  const { dashboardData } = useSelector((state) => state.saDashboard);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDashboardData())
  }, []);

  useEffect(() => {
    if (dashboardData?.monthlyCommissions) {
      const commissions = dashboardData.monthlyCommissions.map(item => item.totalCommission || 0);
      setMonthlyCommission(commissions);
    }
  }, [dashboardData]);

  const fixedBookingData = {
    1: 2,   // April 1 - 2 slots booked
    3: 5,   // April 3 - 5 slots booked
    5: 1,   // April 5 - 1 slot booked
    7: 3,   // April 7 - 3 slots booked
    10: 4,  // April 10 - 4 slots booked
    12: 2,  // April 12 - 2 slots booked
    15: 60,  // April 15 - 6 slots booked
    18: 1,  // April 18 - 1 slot booked
    20: 3,  // April 20 - 3 slots booked
    22: 2,  // April 22 - 2 slots booked
    25: 4,  // April 25 - 4 slots booked
    28: 1,  // April 28 - 1 slot booked
    30: 2   // April 30 - 2 slots booked
  };

  // Dummy data
  const summaryData = {
    totalUsers: 1248,
    totalCustomers: 876,
    cafeCards: 653,
    gamesCards: 312,
    totalLocation: 20,
    membershipCards: 485,
  };

  const recentUsers = [
    {
      id: 1,
      name: "Emma Wilson",
      email: "emma@example.com",
      status: "Active",
      joinDate: "12 Apr 2025",
    },
    {
      id: 2,
      name: "James Miller",
      email: "james@example.com",
      status: "Active",
      joinDate: "10 Apr 2025",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "Inactive",
      joinDate: "08 Apr 2025",
    },
    {
      id: 4,
      name: "Michael Brown",
      email: "michael@example.com",
      status: "Active",
      joinDate: "05 Apr 2025",
    },
  ];

  const recentCustomers = [
    {
      id: 1,
      name: "Alex Thompson",
      visits: 23,
      lastVisit: "14 Apr 2025",
      spent: "$178.50",
    },
    {
      id: 2,
      name: "Olivia Parker",
      visits: 16,
      lastVisit: "13 Apr 2025",
      spent: "$124.75",
    },
    {
      id: 3,
      name: "Daniel Martinez",
      visits: 31,
      lastVisit: "12 Apr 2025",
      spent: "$256.20",
    },
    {
      id: 4,
      name: "Sophia Chen",
      visits: 8,
      lastVisit: "10 Apr 2025",
      spent: "$67.30",
    },
  ];

  // Chart Data
  const customerGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue ($)",
        data: monthlyCommission,
        borderColor: "rgba(7, 192, 192, 1)",
        backgroundColor: "rgba(7, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const cardUsageData = {
    labels: ["Active Users", "Inactive Users", "Frequent Visitors"],
    datasets: [
      {
        label: "User Segments",
        data: [
          summaryData.totalUsers * 0.7, // 70% active users
          summaryData.totalUsers * 0.3, // 30% inactive users
          summaryData.totalCustomers * 0.4 // Frequent visitors (40% of customers)
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)", // Teal for active users
          "rgba(255, 99, 132, 0.7)", // Red for inactive users
          "rgba(255, 159, 64, 0.7)", // Orange for frequent visitors
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const weeklyRevenueData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Revenue ($)",
        data: [1200, 1900, 1500, 1700, 2100, 2800, 2300],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };
  const mostPopularCardType = ['cafeCards', 'gamesCards', 'membershipCards'].reduce((a, b) =>
    summaryData[a] > summaryData[b] ? a : b
  );
  const totalCards = summaryData.cafeCards + summaryData.gamesCards + summaryData.membershipCards;
  const percentage = Math.round((summaryData[mostPopularCardType] / totalCards) * 100);

  // Chart options
  // Update chart options for both charts
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Add this
    plugins: {
      legend: {
        position: window.innerWidth < 768 ? 'bottom' : 'top', // Mobile-friendly legend
      },
      title: {
        display: true,
        text: "Game Commission Revenue",
        font: {
          size: window.innerWidth < 768 ? 14 : 16 // Responsive font size
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: window.innerWidth < 768 ? 'bottom' : 'top',
      },
      title: {
        display: true,
        text: "Weekly Revenue",
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return window.innerWidth < 768 ? `$${value / 1000}k` : `$${value}`;
          },
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "User Activity",
      },
    },
  };
  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    return () => {
      tooltipList.forEach(tooltip => tooltip.dispose()); // Clean up tooltips on unmount
    };
  }, []);

  return (
    <div className="bg-light min-vh-100">
      {/* Main Content */}
      <div className="">
        {/* Dashboard Content */}
        <Container fluid className={`${isMobile ? "px-3" : "py-4 px-4"} `}>
          {/* Welcome Header */}
          <div className="welcome-header" data-aos="fade-up">
            <Row className="mb-4 align-items-center">
              <Col>
                <h3 className="text-primary fw-bold mb-0">
                  Dashboard Overview /{" "}
                  <span className="text-danger">Static Page</span>{" "}
                </h3>
              </Col>
              {/* <Col xs="auto">
                <Button variant="primary" className="shadow-sm">
                  Generate Report
                </Button>
              </Col> */}
            </Row>
          </div>

          {/* Stats Cards */}
          <Row className="mb-4 g-3">
            <Col lg={4} md={6} sm={6} xs={6} data-aos="fade-up" data-aos-delay="100">
              <Card className="border-start-primary shadow h-100 py-2">
                <Card.Body className="d-flex flex-column flex-sm-row align-items-center justify-content-between">
                  <div className="text-center text-sm-start mb-2 mb-sm-0">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Cafes
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {dashboardData?.totalCafes}
                    </div>
                    <div className="small text-primary fw-bold">
                      {dashboardData?.changePercentages?.cafes < 0 ? <FaArrowDown /> : <FaArrowUp />} {dashboardData?.changePercentages?.cafes < 0 ? "" : ""}{dashboardData?.changePercentages?.cafes}% from last month
                    </div>
                  </div>
                  <div className="icon-circle bg-primary text-white">
                    <FaRegUser size={24} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} sm={6} xs={6} data-aos="fade-up" data-aos-delay="200">
              <Card className="shadow h-100 py-2" style={{ borderLeft: "0.25rem solid orange" }}>
                <Card.Body className="d-flex flex-column flex-sm-row align-items-center justify-content-between">
                  <div className="text-center text-sm-start mb-2 mb-sm-0">
                    <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: "orange" }}>
                      Total Vendors
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {dashboardData?.totalVendors}
                    </div>
                    <div className="small fw-bold" style={{ color: "orange" }}>
                      {dashboardData?.changePercentages?.vendors < 0 ? <FaArrowDown /> : <FaArrowUp />} {dashboardData?.changePercentages?.vendors < 0 ? "-" : ""}{dashboardData?.changePercentages?.vendors}% from last month
                    </div>
                  </div>
                  <div className="icon-circle text-white" style={{ background: "orange" }}>
                    <RiCustomerService2Fill size={24} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={12} sm={12} xs={12} data-aos="fade-up" data-aos-delay="300">
              <Card className="border-start-info shadow h-100 py-2">
                <Card.Body className="d-flex flex-column flex-sm-row align-items-center justify-content-between">
                  <div className="text-center text-sm-start mb-2 mb-sm-0">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Total Locations
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {dashboardData?.totalLocations}
                    </div>
                    <div className="small text-info fw-bold">
                      <i className="fas fa-arrow-right"></i> {dashboardData?.locationsThisMonth > 0 ? <>{dashboardData?.locationsThisMonth} new locations this month</> : "No Change"}
                    </div>
                  </div>
                  <div className="icon-circle bg-info text-white">
                    <LuMapPinHouse size={24} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row className="mb-4">
            <Col lg={8} data-aos="fade-right">
              <Card className="shadow mb-4 h-100">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Customer Growth Overview</h6>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-top">
                        {showGrowthInfo ? "Hide Growth Info" : "Show Growth Info"}
                      </Tooltip>
                    }
                  >
                    <Button variant="link" onClick={() => setShowGrowthInfo(!showGrowthInfo)}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Toggle growth information">
                      {!showGrowthInfo ? <MdQuestionMark /> : <FaChartLine />}
                    </Button>
                  </OverlayTrigger>
                </Card.Header>
                <Card.Body className={`${isMobile && "p-1"}`} style={{ height: '300px' }}>
                  {!showGrowthInfo ? (
                    <div className="chart-area" style={{ height: '100%' }}>
                      <Line data={customerGrowthData} options={lineChartOptions} />
                    </div>
                  ) : (
                    <div className="chart-info p-3">
                      <h5>About Customer Growth</h5>
                      <p>
                        This chart shows the monthly trend of new customer acquisitions over the past year.
                      </p>
                      <ul>
                        <li>The line represents the number of new customers each month</li>
                        <li>Hover over data points to see exact numbers</li>
                        <li>Growth trends are highlighted with a smooth curve</li>
                      </ul>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-25"
                        onClick={() => setShowGrowthInfo(false)}
                      >
                        Back to Chart
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} data-aos="fade-left">
              <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    User Activity
                  </h6>
                  <Button
                    variant="link"
                    id="dropdown-basic"
                    className="no-arrow"
                    onClick={() => setShowCardInfo(!showCardInfo)}
                  >
                    {showCardInfo ? <FaChartPie /> : <MdQuestionMark />}
                  </Button>
                </Card.Header>
                <Card.Body>
                  {!showCardInfo ? (
                    <>
                      <div className="chart-pie pt-4 pb-2">
                        <Doughnut data={cardUsageData} options={doughnutOptions} />
                      </div>
                      <div className="d-flex justify-content-center gap-4 mt-2 small">
                        <span><FaCircle className="text-teal" /> Active: {Math.round(summaryData.totalUsers * 0.7)}</span>
                        <span><FaCircle className="text-danger" /> Inactive: {Math.round(summaryData.totalUsers * 0.3)}</span>
                        <span><FaCircle className="text-warning" /> Frequent: {Math.round(summaryData.totalCustomers * 0.4)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="chart-info p-3">
                      <h5>About User Activity</h5>
                      <p>
                        This chart shows the distribution of user engagement across your platform.
                      </p>
                      <ul>
                        <li><strong>Active Users</strong>: Regularly using the system</li>
                        <li><strong>Inactive Users</strong>: No recent activity</li>
                        <li><strong>Frequent Visitors</strong>: Top 40% of customers by visit frequency</li>
                      </ul>
                      <p className="mb-3">
                        <strong>Key Insights:</strong><br />
                        • {percentage}% of users are {mostPopularCardType.replace('Cards', '').toLowerCase()} card holders<br />
                        • {Math.round(summaryData.totalCustomers * 0.4)} frequent visitors drive most revenue
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowCardInfo(false)}
                      >
                        Back to Chart
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Cards Section */}
          <h4 className="h5 mb-3 text-gray-800 fw-bold" data-aos="fade-up">
            Card Management
          </h4>
          <Row className="g-3 mb-4">
            <Col lg={4} md={6} data-aos="zoom-in" data-aos-delay="100">
              <Card className="shadow border-0 h-100 card-hover">
                <Card.Body>
                  <div className="d-flex  justify-content-between mb-3">
                    <div className="rounded-lg bg-primary rounded-circle bg-opacity-10 p-3 text-primary">
                      <MdOutlineLocalCafe size={28} />
                    </div>
                    {/* <Badge bg="primary" className="card-badge">Active</Badge> */}
                  </div>
                  <h5 className="font-weight-bold mb-1">Cafe Cards</h5>
                  <p className="text-muted mb-3">
                    Manage cafe-specific cards and privileges
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h4 fw-bold mb-0">{summaryData.cafeCards}</h3>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill d-flex align-items-center"
                    >
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
                    <div className="rounded-lg rounded-circle bg-danger bg-opacity-10 p-3 text-danger">
                      <PiGameControllerBold size={28} />
                    </div>
                    {/* <Badge bg="success" className="card-badge">Active</Badge> */}
                  </div>
                  <h5 className="font-weight-bold mb-1">Games Cards</h5>
                  <p className="text-muted mb-3">
                    Manage gaming services and rewards
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h4 fw-bold mb-0">
                      {summaryData.gamesCards}
                    </h3>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill d-flex align-items-center"
                    >
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
                    <div className="rounded-lg rounded-circle bg-warning bg-opacity-10 p-3 text-warning">
                      <LuCrown size={28} />
                    </div>
                    {/* <Badge bg="success" className="card-badge">Active</Badge> */}
                  </div>
                  <h5 className="font-weight-bold mb-1">Membership Cards</h5>
                  <p className="text-muted mb-3">
                    Manage membership levels and benefits
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h4 fw-bold mb-0">
                      {summaryData.membershipCards}
                    </h3>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill d-flex align-items-center"
                    >
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
                    <h5 className="font-weight-bold mb-0 text-primary">
                      Recent Cafes
                    </h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => navigate("/superadmin/cafeList")}
                    >
                      View All
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="table-flush">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Join Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentCafes?.map((cafe) => (
                        <tr key={cafe.id} className="align-middle pointer-cursor" onClick={() => navigate(`/superadmin/cafe/viewdetails`, { state: { cafeId: cafe._id } })}>
                          <td className="ps-3 fw-medium">{cafe.name}</td>
                          <td>{cafe.email}</td>
                          <td>
                            {/* <Badge
                              bg={
                                user.status === "Active"
                                  ? "success"
                                  : "secondary"
                              }
                              className="rounded-pill"
                            > */}
                            {cafe.location.city}
                            {/* </Badge> */}
                          </td>
                          <td>{new Date(cafe.createdAt).toDateString()}</td>
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
                    <h5 className="font-weight-bold mb-0 text-primary">
                      Recent Vendors
                    </h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => navigate("/Inventory/Vendor")}
                    >
                      View All
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="table-flush">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Name</th>
                        <th>email</th>
                        <th>Company</th>
                        <th>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentVendors?.map((vendor) => (
                        <tr key={vendor.id} className="align-middle pointer-cursor" onClick={() => navigate(`/Inventory/VendorDetails/${vendor._id}`)}>
                          <td className="ps-3 fw-medium">{vendor.name}</td>
                          <td>{vendor.emailID}</td>
                          <td>{vendor.company}</td>
                          <td className="fw-semibold text-success">
                            {vendor.phone}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Revenue Chart */}
          <Row className="mb-4 mt-3">
            <Col lg={6} data-aos="fade-Left">
              <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Weekly Revenue
                  </h6>
                  <Button
                    variant="link"
                    id="dropdown-basic"
                    className="no-arrow"
                    onClick={() => setShowRevenueInfo(!showRevenueInfo)}
                  >
                    {showRevenueInfo ? <FaChartBar /> : <MdQuestionMark />}
                  </Button>
                </Card.Header>
                <Card.Body className={`${isMobile && "p-1"}`}>
                  {!showRevenueInfo ? (
                    <div className="chart-bar">
                      <Bar data={weeklyRevenueData} options={barChartOptions} />
                    </div>
                  ) : (
                    <div className="chart-info p-3">
                      <h5>About Weekly Revenue</h5>
                      <p>
                        This chart shows the daily revenue trends throughout the week.
                      </p>
                      <ul>
                        <li>Bars represent total revenue for each day</li>
                        <li>Weekends typically show higher revenue</li>
                        <li>Hover over bars to see exact revenue amounts</li>
                      </ul>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowRevenueInfo(false)}
                      >
                        Back to Chart
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col data-aos="fade-right" lg={6}>
              <Card className="shadow">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between text-white">
                  <h6 className="m-0 font-weight-bold text-primary">Booking Calendar</h6>
                  <Button
                    variant="light"
                    size="sm"
                    id="dropdown-basic"
                    className="no-arrow"
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                      setShowCalendarInfo(!showCalendarInfo);
                    }}
                  >

                    {
                      showCalendar ? <MdQuestionMark color="blue" /> : <SlCalender color="blue" />
                    }


                  </Button>
                </Card.Header>
                <Card.Body className="p-1">
                  {showCalendar && (
                    <div className="calendar-container">
                      <div className="react-calendar">
                        <div className="react-calendar__navigation">
                          <button
                            type="button"
                            className="nav-button"
                            onClick={() => {
                              const prevMonth = new Date(activeYear, activeMonth - 1, 1);
                              setActiveMonth(prevMonth.getMonth());
                              setActiveYear(prevMonth.getFullYear());
                            }}
                          >
                            ‹
                          </button>
                          <span className="month-title">
                            {new Date(activeYear, activeMonth).toLocaleString('default', { month: 'long' })} {activeYear}
                          </span>
                          <button
                            type="button"
                            className="nav-button"
                            onClick={() => {
                              const nextMonth = new Date(activeYear, activeMonth + 1, 1);
                              setActiveMonth(nextMonth.getMonth());
                              setActiveYear(nextMonth.getFullYear());
                            }}
                          >
                            ›
                          </button>
                        </div>
                        <div className="react-calendar__month-view__weekdays">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="weekday">{day}</div>
                          ))}
                        </div>
                        <div className="react-calendar__month-view__days">
                          {/* Add empty cells for days before the first of the month */}
                          {Array.from({
                            length: new Date(activeYear, activeMonth, 1).getDay()
                          }).map((_, i) => (
                            <div key={`empty-${i}`} className="react-calendar__tile empty-day" />
                          ))}

                          {/* Render the days of the month */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const date = i + 1;
                            const slotsBooked = fixedBookingData[date] || 0;
                            const isWeekend = (new Date(activeYear, activeMonth, date).getDay() % 6) === 0;
                            const isToday = date === currentDate.getDate() &&
                              activeMonth === currentDate.getMonth() &&
                              activeYear === currentDate.getFullYear();

                            return (
                              <div
                                key={date}
                                className={`react-calendar__tile 
          ${isWeekend ? 'weekend' : ''} 
          ${slotsBooked > 0 ? 'has-bookings' : ''}
          ${isToday ? 'current-day' : ''}`}
                                onMouseEnter={() => setActiveTooltip(date)}
                                onMouseLeave={() => setActiveTooltip(null)}
                              >
                                <div className="date-number">{date}</div>
                                {slotsBooked > 0 && (
                                  <div className="booking-indicator">
                                    <div
                                      className="booking-bar"
                                      style={{
                                        width: `${Math.min(slotsBooked * 10, 100)}%`,
                                        backgroundColor: slotsBooked > 3 ? '#28a745' : '#17a2b8'
                                      }}
                                    />
                                  </div>
                                )}
                                {activeTooltip === date && (
                                  <div className="booking-tooltip">
                                    <div className="tooltip-content">
                                      <strong>{date} {new Date(activeYear, activeMonth).toLocaleString('default', { month: 'short' })}</strong>
                                      <div className="slots-count">
                                        {slotsBooked} slot{slotsBooked !== 1 ? 's' : ''} booked
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {showCalendarInfo && (
                    <div className="calendar-info p-3">
                      <h5>About Booking Calendar</h5>
                      <p>
                        This calendar shows daily booking slots for your cafe.
                        The colored bars indicate how many slots are booked each day:
                      </p>
                      <ul>
                        <li>Blue bars: 1-3 slots booked</li>
                        <li>Green bars: 4+ slots booked</li>
                      </ul>
                      <p>
                        Hover over any day to see exact booking numbers.
                        Use the navigation buttons to view different months.
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setShowCalendar(true);
                          setShowCalendarInfo(false);
                        }}
                      >
                        Back to Calendar
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
      .react-calendar {
  width: 100%;
  border: none;
  font-family: inherit;
  background: transparent;
    overflow: auto;

}


  .calendar-info {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e3e6f0;
}
  .chart-info {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e3e6f0;
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chart-info h5 {
  color: #4e73df;
  margin-bottom: 1rem;
}

.chart-info ul {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.calendar-info h5 {
  color: #4e73df;
  margin-bottom: 1rem;
}

.calendar-info ul {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.react-calendar__navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.month-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4e73df;
}

.nav-button {
  background: #f8f9fa;
  border: 1px solid #e3e6f0;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:hover {
  background: #e3e6f0;
}

.react-calendar__month-view__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #721818;
  font-size: 0.85rem;
  text-transform: uppercase;
  gap: 0.5rem; /* Add gap between weekday labels */
}

.weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.react-calendar__month-view__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.react-calendar__tile {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  border: 1px solid #e3e6f0;
  padding: 0.5rem 0;
}

.react-calendar__tile:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.react-calendar__tile.weekend {
  background: #f8f9fa;
}

.react-calendar__tile.current-day {
  background: #e6f7ff;
  border: 1px solid #4e73df;
}

.react-calendar__tile.current-day .date-number {
  color: #4e73df;
  font-weight: bold;
}

.react-calendar__tile.has-bookings .date-number {
  font-weight: 600;
  color: #4e73df;
}

.date-number {
  font-size: 1rem;
  font-weight: 500;
  color: #5a5c69;
}

.booking-indicator {
  width: 80%;
  height: 4px;
  background: #e3e6f0;
  border-radius: 2px;
  overflow: hidden;
}

.booking-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.booking-tooltip {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #5a5c69;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid #e3e6f0;
  pointer-events: none;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip-content strong {
  color: #4e73df;
}

.slots-count {
  font-size: 0.8rem;
  color: #858796;
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
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
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

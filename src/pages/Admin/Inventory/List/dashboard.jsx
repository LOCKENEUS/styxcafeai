import React from "react";
import { Container, Row, Col, Card, Table, Image } from "react-bootstrap";
import { Doughnut, Line } from "react-chartjs-2";
// import dashboardBarIcon from "/assets/Admin/Dashboard/dashboardBarIcon.svg"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import { TfiBoltAlt } from "react-icons/tfi";
import { AiOutlineStock } from "react-icons/ai";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const DashboardInventory = () => {
  // Inventory Doughnut Chart Data
  const inventoryData = {
    labels: ["Qty in Hands", "Qty Received"],
    datasets: [{
      data: [1030, 240],
      backgroundColor: ["#FF6B4A", "#4AFF93"],
      borderWidth: 0,
    }],
  };

  // Conversion Rate Doughnut Data
  const conversionData = {
    datasets: [{
      data: [78, 22],
      backgroundColor: ["#4AFF93", "#F5F5F5"],
      borderWidth: 0,
    }],
  };

  // Customer Satisfaction Doughnut Data
  const satisfactionData = {
    datasets: [{
      data: [60, 40],
      backgroundColor: ["#FF6B4A", "#F5F5F5"],
      borderWidth: 0,
    }],
  };

  // Monthly Earnings Line Chart Data
  const lineData = {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    datasets: [{
      label: "Monthly Earning",
      data: [10, 30, 70, 100, 80, 60, 20, 100],
      fill: true,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;
        
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(74, 255, 147, 0.2)');
        gradient.addColorStop(1, 'rgba(74, 255, 147, 0)');
        return gradient;
      },
      borderColor: "#4AFF93",
      borderWidth: 1,
      borderDash: [3, 3], // Creates dotted line
      pointRadius: 0, // Hides the points
      tension: 0.9, // Makes the line smoother
    }],
  };

  const doughnutOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: true
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawTicks: false
        },
        ticks: {
          padding: 10,
          callback: function(value) {
            return value + 'k';
          }
        }
      },
      x: {
        border: {
          display: false
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawTicks: false
        },
        ticks: {
          padding: 10
        }
      }
    },
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.4 // Makes the line smoother
      }
    }
  };

  const statsCards = [
    { title: "TOTAL SALE", value: "145", bgColor: "#E6F8FF", iconBg: "#66C2EA" },
    { title: "TOTAL ORDER", value: "456", bgColor: "#E6FFE6", iconBg: "#66CC66" },
    { title: "NEW ORDER", value: "45", bgColor: "#FFE6FF", iconBg: "#FF66FF" },
    { title: "CANCELLED ORDER", value: "50", bgColor: "#FFE6E6", iconBg: "#FF6666" }
  ];

  const tableData = [
    { name: "Appearance Pvt Ltd", quantity: "100 Kg", price: "45000" },
    { name: "Appearance Pvt Ltd", quantity: "200 Kg", price: "56000" },
    { name: "Appearance Pvt Ltd", quantity: "200 Kg", price: "56000" }
  ];

  return (
    <Container fluid className="p-4">
      <h3 className="mb-4">Hello, Styx Cafe</h3>
      
      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={6}>
        <Row className="g-3">
        {statsCards.map((card, index) => (
          <Col key={index} xs={6} lg={6}>
            <Card className="border-0">
              <Card.Body className="d-flex justify-content-start gap-3 align-items-center">
                <div style={{  backgroundColor: card.bgColor, height: "100px", width: "70px", borderRadius: "10px"  }} className="d-flex justify-content-center align-items-center mb-2">
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: card.iconBg,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{  display: 'inline-block' }}><AiOutlineStock color="#fff" size={20} /></span>
                  </div>
                </div>

                <div className="d-flex flex-column justify-content-between align-items-center">
                <div style={{ color: "#000" , fontWeight:'500' }} className="small">{card.title}</div>
                <h1 className="mt-2 mb-0">{card.value}</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        </Row>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <h6 className="text-muted mb-4">Inventory Summary</h6>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", position: "relative" }}>
                <Doughnut data={inventoryData} options={doughnutOptions} />
                <div style={{ 
                  position: "absolute", 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)",
                  textAlign: "center"
                }}>
                  <h6>Inventory Summary</h6>
                </div>
                {/* Qty in Hands Label */}
                <div style={{
                  position: "absolute",
                  top: "10%",
                  right: "10%",
                  backgroundColor: "rgba(255, 107, 74, 0.1)",
                  padding: "8px 16px",
                  borderRadius: "16px"
                }}>
                  <div className="text-muted small">Qty in Hands</div>
                  <div style={{ color: "#FF6B4A", fontWeight: "bold" }}>1030</div>
                </div>
                {/* Qty Received Label */}
                <div style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "10%",
                  backgroundColor: "rgba(74, 255, 147, 0.1)",
                  padding: "8px 16px",
                  borderRadius: "16px"
                }}>
                  <div className="text-muted small">Qty Received</div>
                  <div style={{ color: "#4AFF93", fontWeight: "bold" }}>240</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Charts Row */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="h-100 bg-transparent border-0 shadow-none">
            <Card.Body  className="p-0 ">
              <div className="mb-4 bg-white rounded-3 p-2 p-sm-3 gap-2 gap-sm-3 d-flex flex-column flex-sm-row align-items-center">
                <div style={{ height: "80px", width: "80px", position: "relative" }}>
                  <Doughnut data={conversionData} options={doughnutOptions} />
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <h6 className="mb-0">78%</h6>
                  </div>
                </div>

                <div className="text-center text-sm-start">
                  <h6 className="text-muted mb-2">Total Conversion Rate</h6>
                  <h5 className="mb-0">178</h5>
                </div>
              </div>

              <div className="mb-4 gap-2 gap-sm-3 d-flex flex-column flex-sm-row bg-white rounded-3 p-2 p-sm-3 align-items-center">
                <div style={{ height: "80px", width: "80px", position: "relative" }}>
                  <Doughnut data={satisfactionData} options={doughnutOptions} />
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <h6 className="mb-0">60%</h6>
                  </div>
                </div>

                <div className="text-center text-sm-start">
                  <h6 className="text-muted mb-2">Customer Satisfaction</h6>
                  <h5 className="mb-0">178</h5>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="p-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-muted">Monthly Earning</h6>
                <div className="text-end">
                  <div>Total : 100K</div>
                  <div className="text-muted">Missed : 41K</div>
                </div>
              </div>
              <div style={{ height: '200px' }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Card.Body className="p-2 p-sm-3">
          <div className="table-responsive">
            <Table borderless hover className="align-middle">
              <thead style={{backgroundColor:"#0062FF0D", color:"black"}} className="border-bottom no-uppercase">
                <tr>
                  <th className="text-black">Icon</th>
                  <th className="text-black">Name</th>
                  <th className="text-black">Quantity</th>
                  <th className="text-black">Price</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: '#F5F5F5',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Image src={dashboardBarIcon} alt="dashboardBarIcon" />
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardInventory;

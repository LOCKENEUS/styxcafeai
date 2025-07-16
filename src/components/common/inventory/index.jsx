// import { Card, CardBody, CardHeader, Col, Image, ListGroup, ListGroupItem, Row, Table } from "react-bootstrap";
// import { FaRegCircle, FaTag, FaUserAlt } from "react-icons/fa";
// import { FiArrowDownLeft } from "react-icons/fi";
// import { MdNote } from "react-icons/md";
// import { VscGraph } from "react-icons/vsc";

// export const Dashboards = () => {

//     const metrics = [
//         {
//             title: "Total Sale",
//             value: "₹ 0",
//             orders: "Shifted",
//             change: "4.3%",
//             icon: <VscGraph />,

//         },
//         {
//             title: "Total Order",
//             value: "0",
//             orders: "To be Packed",
//             change: "12.5%",
//             icon: <FaTag />,

//         },
//         {
//             title: "Cancelled Order",
//             value: "0",
//             orders: "Not Packed",
//             icon: <MdNote />,
//         },
//         {
//             title: "New Order",
//             value: "0",
//             orders: "To be Packed",
//             change: "4.4%",
//             icon: <FaUserAlt />, // Affiliate Icon

//         },
//     ];

//     const topProducts = [
//         {
//             name: "Photive wireless speakers",
//             image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img4.jpg",
//             change: "-72%",
//             changeType: "down",
//             price: "$65",
//             sold: "7,545",

//         },
//         {
//             name: "Topman shoe in green",
//             image: "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img26.jpg",
//             change: "+69%",
//             changeType: "up",
//             price: "$21",
//             sold: "6,643",

//         },
//         {
//             name: "RayBan black sunglasses",
//             image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img25.jpg",
//             change: "-65%",
//             changeType: "down",
//             price: "$37",
//             sold: "5,951",

//         },
//         {
//             name: "Mango Women's shoe",
//             image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img6.jpg",
//             change: "-53%",
//             changeType: "down",
//             price: "$65",
//             sold: "5,002",

//         },
//         {
//             name: "Calvin Klein t-shirts",
//             image: "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img3.jpg",
//             change: "+50%",
//             changeType: "up",
//             price: "$89",
//             sold: "4,714",

//         },
//         {
//             name: "Givenchy perfume",
//             image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img5.jpg",
//             change: "+50%",
//             changeType: "up",
//             price: "$99",
//             sold: "4,155",

//         },
//     ];

//     const scheduleItems = [
//         {

//             title: "Low Stocks Items",
//             subtitle: "*Low stock set below 15 Qty",
//             borderClass: "border-primary",
//             qty: "0",
//         },
//         {

//             title: "All Listed Item",
//             subtitle: "",
//             borderClass: "border-info",
//             qty: "0",
//         },
//         {

//             title: "All Item",
//             subtitle: "",
//             borderClass: "border-danger",
//             qty: "3",
//         }
//     ];

//     return (
//         <Row className="p-3">
//             <Col md={12} className="mt-4">
//                 <Row>
//                     <Col md={9}>
//                         <Card className="mb-3 mb-lg-5 rounded-1">
//                             <CardHeader>
//                                 <h3>Sales Activity</h3>
//                             </CardHeader>
//                             <CardBody>
//                                 <Row className="gx-lg-6">
//                                     {metrics.map((metric, index) => (
//                                         <Col lg={3} key={index}
//                                             className={index !== metrics.length - 1 ? "border-end border-gray" : ""}
//                                         >
//                                             <div className="d-flex">
//                                                 <div className="flex-grow-1">
//                                                     <h6 className="card-subtitle mb-3">{metric.title}</h6>
//                                                     <h3 className="card-title">{metric.value}</h3>
//                                                     <div className="d-flex align-items-center">
//                                                         <span className="d-block fs-6">{metric.orders}</span>
//                                                     </div>
//                                                 </div>
//                                                 <span className="icon icon-soft-secondary icon-sm icon-circle ms-1 fw-bold">{metric.icon}</span>
//                                             </div>
//                                         </Col>
//                                     ))}
//                                 </Row>
//                             </CardBody>
//                         </Card></Col>
//                     <Col md={3} className="border-start border-gray mt-4">
//                         <h6 className="lead text-start fw-bold">Inventory Summary</h6>
//                         <Row className="card p-2">
//                             <Col md={12} className=" border-bottom border-gray">
//                                 <div
//                                     className="d-flex justify-content-center flex-column mb-3"
//                                 >
//                                     <h6 className="lead">
//                                         970
//                                     </h6>
//                                     <span className="d-block text-success display-6">
//                                         <FaRegCircle className="me-1" /> <span className=" text-dark mb-1 me-3">
//                                             Quantity in Hand
//                                         </span>
//                                     </span>
//                                 </div>
//                             </Col>

//                             <Col md={12}>
//                                 <div
//                                     className="d-flex justify-content-center flex-column mt-3"
//                                 >
//                                     <h6 className="lead">0</h6>
//                                     <span className="d-block text-danger display-6">
//                                         <FiArrowDownLeft className="me-1 " /> <span className=" text-dark mb-1 me-3">
//                                             Quantity to be Recieved
//                                         </span>
//                                     </span>
//                                 </div>
//                             </Col>
//                         </Row>
//                     </Col>
//                 </Row>
//             </Col>

//             {/* Product Details */}
//             <Col md={12} className="">
//                 <Row>
//                     <Col md={7}>
//                         <h2 className="fw-bold my-2">Product Details</h2>
//                         <ListGroup className="list-group-flush">
//                             {scheduleItems.map((item, index) => (
//                                 <ListGroupItem key={index} className={`list-group-item-action ${item.borderClass}`}>
//                                     <Row className="align-items-center my-2">
//                                         <Col>
//                                             <h5 className="text-inherit mb-0">{item.title}</h5>
//                                             <span className="text-body small">{item.subtitle}</span>
//                                         </Col>
//                                         <Col sm="auto" className="text-end">
//                                             <div className="fw-bold">{item.qty}</div>
//                                         </Col>
//                                     </Row>
//                                 </ListGroupItem>
//                             ))}
//                         </ListGroup>
//                     </Col>

//                     <Col md={5} >
//                         {/* Top Products */}
//                         <Card className="h-100">
//                             <CardHeader className="d-flex justify-content-between align-items-center">
//                                 <h4 className="mb-0">Top Selling Item</h4>
//                             </CardHeader>
//                             <div className="card-body-height">
//                                 <div className="table-responsive">
//                                     <Table className="table-borderless table-thead-bordered table-nowrap table-align-middle card-table">
//                                         <thead className="thead-light">
//                                             <tr>
//                                                 <th>Icon</th>
//                                                 <th>Name</th>
//                                                 <th>Price</th>
//                                                 <th>Qty</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {topProducts.map((product, index) => (
//                                                 <tr key={index}>
//                                                     <td>
//                                                         <a
//                                                             href="./ecommerce-product-details.html"
//                                                             className="d-flex align-items-center"
//                                                         >
//                                                             <div className="flex-shrink-0">
//                                                                 <img
//                                                                     src={product.image}
//                                                                     alt="Product"
//                                                                     className="avatar"
//                                                                 />
//                                                             </div>
//                                                         </a>
//                                                     </td>
//                                                     <td>{product.name}</td>
//                                                     <td>{product.price}</td>
//                                                     <td>{product.sold}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>
//                                 </div>
//                             </div>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Col>
//         </Row>
//     );
// };








import React, { useEffect } from "react";
import { Container, Row, Col, Card, Table, Image } from "react-bootstrap";
import { Doughnut, Line } from "react-chartjs-2";
import dashboardBarIcon from "/assets/Admin/Dashboard/dashboardBarIcon.svg"
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
import { useDispatch, useSelector } from "react-redux";
import { getSaInvDashboardData } from "../../../store/slices/inventory";

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

export const Dashboards = () => {

  const dispatch = useDispatch();

  const data = useSelector((state) => state.inventorySuperAdmin.invDashboard);

  useEffect(() => {
    dispatch(getSaInvDashboardData())
  }, [dispatch])

  // Inventory Doughnut Chart Data
  const inventoryData = {
    labels: ["Qty in Hands", "Qty Received"],
    datasets: [{
      // data: [data?.item_stock, data?.qty_received],
      data: [700, 500],
      backgroundColor: ["#FF6B4A", "#4AFF93"],
      borderWidth: 0,
    }],
  };

  useEffect(() => {
    window.scrollTo(0, 0);

  }, [])

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
          callback: function (value) {
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

  const tableData = [
    { name: "Appearance Pvt Ltd", quantity: "100 Kg", price: "45000" },
    { name: "Appearance Pvt Ltd", quantity: "200 Kg", price: "56000" },
    { name: "Appearance Pvt Ltd", quantity: "200 Kg", price: "56000" }
  ];
  const user = JSON.parse(localStorage.getItem("user"));
  const cafe_name = user?.cafe_name;

  return (
    <Container fluid className="p-4">
      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col data-aos="fade-right" data-aos-duration="800" md={6}>
          <Row className="g-3">
            <Col xs={6} lg={6}>
              <Card className="border-0">
                <Card.Body className="d-flex justify-content-start gap-3 align-items-center">
                  <div style={{ backgroundColor: "#E6F8FF", height: "100px", width: "70px", borderRadius: "10px" }} className="d-flex justify-content-center align-items-center mb-2">
                    <div style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#66C2EA",
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ display: 'inline-block' }}><AiOutlineStock color="#fff" size={20} /></span>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-between align-items-center">
                    <div style={{ color: "#000", fontWeight: '500' }} className="small">TOTAL SALE</div>
                    <h1 className="mt-2 mb-0">{data?.total_sale}</h1>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} lg={6}>
              <Card className="border-0">
                <Card.Body className="d-flex justify-content-start gap-3 align-items-center">
                  <div style={{ backgroundColor: "#E6FFE6", height: "100px", width: "70px", borderRadius: "10px" }} className="d-flex justify-content-center align-items-center mb-2">
                    <div style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#66CC66",
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ display: 'inline-block' }}><AiOutlineStock color="#fff" size={20} /></span>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-between align-items-center">
                    <div style={{ color: "#000", fontWeight: '500' }} className="small">TOTAL ORDER</div>
                    <h1 className="mt-2 mb-0">{data?.total_orders}</h1>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} lg={6}>
              <Card className="border-0">
                <Card.Body className="d-flex justify-content-start gap-3 align-items-center">
                  <div style={{ backgroundColor: "#FFE6FF", height: "100px", width: "70px", borderRadius: "10px" }} className="d-flex justify-content-center align-items-center mb-2">
                    <div style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#FF66FF",
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ display: 'inline-block' }}><AiOutlineStock color="#fff" size={20} /></span>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-between align-items-center">
                    <div style={{ color: "#000", fontWeight: '500' }} className="small">NEW ORDER</div>
                    <h1 className="mt-2 mb-0">{data?.new_orders}</h1>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} lg={6}>
              <Card className="border-0">
                <Card.Body className="d-flex justify-content-start gap-3 align-items-center">
                  <div style={{ backgroundColor: "#FFE6E6", height: "100px", width: "70px", borderRadius: "10px" }} className="d-flex justify-content-center align-items-center mb-2">
                    <div style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#FF6666",
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ display: 'inline-block' }}><AiOutlineStock color="#fff" size={20} /></span>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-between align-items-center">
                    <div style={{ color: "#000", fontWeight: '500' }} className="small">CANCELLED ORDER</div>
                    <h1 className="mt-2 mb-0">{data?.cancelled_orders || 0}</h1>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col data-aos="fade-left" data-aos-duration="1000" md={6}>
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
                  <div style={{ color: "#FF6B4A", fontWeight: "bold" }}>
                    {/* {data?.item_stock} */}
                    1000
                  </div>
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
                  <div style={{ color: "#4AFF93", fontWeight: "bold" }}>
                    {/* {data?.qty_received}  */}
                    500
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row data-aos="fade-down" data-aos-duration="1500" className="g-3 mb-4">
        <Col md={4}>
          <Card className="h-100 bg-transparent border-0 shadow-none">
            <Card.Body className="p-0 ">
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
          <Card className="p-1">
            <Card.Body className="p-1">
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
              <thead style={{ backgroundColor: "#0062FF0D", color: "black" }} className="border-bottom no-uppercase">
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
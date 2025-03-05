import React, { useEffect, useRef } from 'react';
import { Row, Col, Card, Badge, Container } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import UsersTable from '../../UsersTable'
import Leaderboard from '../../Leaderboard';
const StatCard = ({ title, value, chartData, badgeVariant, badgeIcon, badgeText, comparisonText }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;
    
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 31 }, (_, i) => `${i + 1} May`),
          datasets: [{
            data: chartData,
            backgroundColor: ['rgba(55, 125, 255, 0)', 'rgba(255, 255, 255, 0)'],
            borderColor: '#377dff',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0
          }]
        },
        options: {
          scales: {
            y: { display: false },
            x: { display: false }
          },
          hover: {
            mode: 'nearest',
            intersect: false
          },
          plugins: {
            tooltip: {
              postfix: 'k',
              hasIndicator: true,
              intersect: false
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <Col sm={6} lg={3} className="mb-3 mb-lg-5">
      <Card className="card-hover-shadow h-100">
        <Card.Body>
          <Card.Subtitle className="mb-3">{title}</Card.Subtitle>
          
          <Row className="align-items-center gx-2 mb-1">
            <Col xs={6}>
              <h2 className="card-title">{value}</h2>
            </Col>
            <Col xs={6}>
              <div className="chartjs-custom" style={{ height: '3rem' }}>
                <canvas ref={chartRef} style={{ display: 'block', height: '48px', width: '116px' }} />
              </div>
            </Col>
          </Row>

          <Badge bg={badgeVariant} className="bg-soft-success text-success me-2">
            <i className={`bi ${badgeIcon}`}></i> {badgeText}
          </Badge>
          <span className="text-body fs-6">{comparisonText}</span>
        </Card.Body>
      </Card>
    </Col>
    
  );
};

const Stats = () => {
  const cardsData = [
    {
      title: "Total Users",
      value: "72,540",
      chartData: [21,20,24,20,18,17,15,17,18,30,31,30,30,35,25,35,35,40,60,90,90,90,85,70,75,70,30,30,30,50,72],
      badgeVariant: "success-soft",
      badgeIcon: "bi-graph-up",
      badgeText: "12.5%",
      comparisonText: "from 70,104"
    },
    {
      title: "Sessions",
      value: "29.4%",
      chartData: [21,20,24,20,18,17,15,17,30,30,35,25,18,30,31,35,35,90,90,90,85,100,120,120,120,100,90,75,75,75,90],
      badgeVariant: "success-soft",
      badgeIcon: "bi-graph-up",
      badgeText: "1.7%",
      comparisonText: "from 29.1%"
    },
    {
      title: "Avg. Click Rate",
      value: "56.8%",
      chartData: [25,18,30,31,35,35,60,60,60,75,21,20,24,20,18,17,15,17,30,120,120,120,100,90,75,90,90,90,75,70,60],
      badgeVariant: "danger-soft",
      badgeIcon: "bi-graph-down",
      badgeText: "4.4%",
      comparisonText: "from 61.2%"
    },
    {
      title: "Pageviews",
      value: "92,913",
      chartData: [21,20,24,15,17,30,30,35,35,35,40,60,12,90,90,85,70,75,43,75,90,22,120,120,90,85,100,92,92,92,92],
      badgeVariant: "secondary-soft",
      badgeIcon: "",
      badgeText: "0.0%",
      comparisonText: "from 2,913"
    }
  ];

  return (
    <Container>
    <Row>
      {cardsData.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </Row>
    <Leaderboard/>
  <UsersTable/>
    </Container>
  );
};

export default Stats;
import React from "react";
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import TurfCricket from "/assets/Admin/Table/TurfCricket.svg";
import TurfFootball from "/assets/Admin/Table/TurfFootball.svg";
import { MdOutlineArrowOutward } from "react-icons/md";

const tables = [
  { turf: "Cricket Turf", size: "(6/12) Feet", slots: 30 },
  { turf: "Cricket Turf", size: "(6/12) Feet", slots: 0 },
  { turf: "Cricket Turf", size: "(6/12) Feet", slots: 30 },
  { turf: "Football Turf", size: "(6/12) Feet", slots: 30 },
  { turf: "Football Turf", size: "(6/12) Feet", slots: 0 },
  { turf: "Football Turf", size: "(6/12) Feet", slots: 30 },
];

const CricketTurfList = () => {
  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Cricket Turf List</Breadcrumb.Item>
      </Breadcrumb>

      {['Cricket Turf', 'Football Turf'].map((turf) => (
        <div key={turf} className="mb-5">
          <h2 className="fw-bold mb-4">
            {turf}
            <div className="border-bottom border-primary w-25 mt-2" style={{ height: '4px' }}></div>
          </h2>
          <Row className="g-4">
            {tables
              .filter((table) => table.turf === turf)
              .map((table, index) => (
                <Col key={index} xs={12} md={6} lg={4}>
                  <Card className="h-100 shadow-sm hover-shadow transition-all">
                    <Card.Body className="d-flex flex-column">
                      <div className="text-center mb-3">
                        <img
                          src={turf === "Cricket Turf" ? TurfCricket : TurfFootball}
                          alt="Turf"
                          className="img-fluid mb-3"
                          style={{ maxWidth: '200px' }}
                        />
                        <h5 className="fw-semibold mb-2">Table {index + 1}</h5>

                      </div>

                      <div className="position-relative">
                        <div className="text-center">
                          <p className="text-muted mb-2">{table.size}</p>
                          <div className={`badge ${table.slots > 0 ? 'bg-success' : 'bg-danger'} p-2 mb-3`}>
                            {table.slots > 0
                              ? `${table.slots} Slots Available`
                              : "No Available Slots"}
                          </div>
                        </div>
                        <Button
                          variant={table.slots > 0 ? "primary" : "secondary"}
                          className="rounded-circle position-absolute d-flex align-items-center justify-content-center"
                          disabled={table.slots === 0}
                          style={{
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '40px',
                            height: '40px',
                            padding: '0'
                          }}
                        >
                          <MdOutlineArrowOutward />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default CricketTurfList;
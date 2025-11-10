import React from "react";
import { Container, Row, Col, Breadcrumb, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CafeSloteIcon from "/assets/Admin/Table/CafeSlot.svg";
import { Breadcrumbs } from "../../../components/common/Breadcrumbs/Breadcrumbs";

const CafeTableList = () => {
  const slots = Array(10).fill(null); // Example: 10 slots

  return (
    <Container fluid>
      <Breadcrumbs
        items={[
          { label: "Home", path: "/admin/dashboard" },
          { label: "Cafe Table", active: true }
        ]}
      />

      <h5 className="mt-3">Floor 1</h5>
      <Row className="mt-3 d-flex align-items-center">
        {slots.map((_, index) => (
          <Col key={index} xs={4} sm={3} md={2} className="mb-3">
            <Card className="p-2 text-center shadow-sm" style={{ cursor: "pointer", height: "87px", width: "90px" }}>
              <img src={CafeSloteIcon} alt="Cafe Slote Icon" style={{ height: "100%", width: "100%", objectFit: "contain" }} />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CafeTableList;

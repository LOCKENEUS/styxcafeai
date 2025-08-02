import React from "react";
import { Row, Col } from "react-bootstrap";
import { CreditCard, User, Home, X } from "lucide-react";

const features = [
  {
    icon: <CreditCard size={18} color="white" />,
    label: "Online Payment",
    gradient: "linear-gradient(135deg, #34d399, #14b8a6)", // emerald to teal
  },
  {
    icon: <User size={18} color="white" />,
    label: "Single Player",
    gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)", // blue
  },
  {
    icon: <Home size={18} color="white" />,
    label: "Indoor",
    gradient: "linear-gradient(135deg, #d946ef, #a855f7)", // pink to purple
  },
  {
    icon: <X size={18} color="white" />,
    label: "Cross Sign",
    gradient: "linear-gradient(135deg, #fb923c, #f97316)", // orange
  },
];

const FeatureIcons = () => {
  return (
    <Row className="align-items-center">
      {features.map((feature, index) => (
        <Col xs={3} key={index}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                background: feature.gradient,
                padding: "8px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {feature.icon}
            </div>
            <span style={{ color: "#1f2937", fontWeight: "500" }}>{feature.label}</span>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default FeatureIcons;

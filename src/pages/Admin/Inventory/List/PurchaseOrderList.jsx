import React, { useState } from "react";
import {
  Table,
  Container,
  Image,
  Row,
  Col,
  Pagination,
  Button,
  InputGroup,
  Form,
  Breadcrumb,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import solar_export from "/assets/inventory/solar_export-linear.png";
import gm1 from '/assets/inventory/mynaui_search.svg'

const dummyOrders = [
  {
    id: 1,
    orderNo: "PO12345",
    vendor: "Shardul Thakur",
    amount: "$500",
    status: "Pending",
    deliveryDate: "2023-10-15",
  },
  {
    id: 2,
    orderNo: "PO12346",
    vendor: "Pravin Reddy",
    amount: "$300",
    status: "Completed",
    deliveryDate: "2023-10-10",
  },
  {
    id: 3,
    orderNo: "PO12347",
    vendor: "Zein Malik",
    amount: "$700",
    status: "Pending",
    deliveryDate: "2023-10-20",
  },
  {
    id: 4,
    orderNo: "PO12348",
    vendor: "Elivish Rathore",
    amount: "$200",
    status: "Cancelled",
    deliveryDate: "2023-10-05",
  },
  {
    id: 5,
    orderNo: "PO12349",
    vendor: "Ashok Bhatia",
    amount: "$450",
    status: "Completed",
    deliveryDate: "2023-10-12",
  },
  {
    id: 6,
    orderNo: "PO12350",
    vendor: "Rajesh Kumar",
    amount: "$600",
    status: "Pending",
    deliveryDate: "2023-10-18",
  },
  {
    id: 7,
    orderNo: "PO12351",
    vendor: "Rajesh Kumar",
    amount: "$600",
    status: "Pending",
    deliveryDate: "2023-10-18",
  },
  {
    id: 8,
    orderNo: "PO12352",
    vendor: "Rajesh Kumar",
    amount: "$600",
    status: "Pending",
    deliveryDate: "2023-10-18",
  },
  {
    id: 9,
    orderNo: "PO12353",
    vendor: "Rajesh Kumar",
    amount: "$600",
    status: "Pending",
    deliveryDate: "2023-10-18",
  },
  {
    id: 10,
    orderNo: "PO12354",
    vendor: "Rajesh Kumar",
    amount: "$600",
    status: "Pending",
    deliveryDate: "2023-10-18",
  },
];

const PurchaseOrderList = () => {
  const getRandomColor = (name) => {
    const colors = [
      "#FAED39",
      "#FF5733",
      "#33FF57",
      "#339FFF",
      "#FF33F6",
      "#FFAA33",
      "#39DDFA",
      "#3DFF16",
    ];
    let index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const [search, setSearch] = useState("");

  const exportCSV = () => {
    const csvRows = [];
    const headers = [
      "S/N",
      "ORDER NO",
      "VENDOR",
      "AMOUNT",
      "STATUS",
      "DELIVERY DATE",
    ];
    csvRows.push(headers.join(","));

    dummyOrders.forEach((order, index) => {
      const row = [
        index + 1,
        order.orderNo,
        order.vendor,
        order.amount,
        order.status,
        order.deliveryDate,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase_orders.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container fluid className="mt-4 min-vh-100">
      <Breadcrumb>
        <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/admin/inventory">Inventory</Breadcrumb.Item>
        <Breadcrumb.Item href="/admin/inventory/purchase-order-list">Purchase Order List</Breadcrumb.Item>
      </Breadcrumb>
    
      <div className="d-flex justify-content-between my-4">
        <h2>Purchase Orders</h2>
        <div sm={4} className="d-flex">
                            <InputGroup className="mx-1 my-3">
                                <InputGroup.Text className="border-0" style={{ background: "#FAFAFA" }}>
                                    <img src={gm1} alt="Search Icon" />
                                </InputGroup.Text>
                                <FormControl
                                    type="search"
                                    size="sm"
                                    placeholder="Search for vendors"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                                />
                            </InputGroup>
                        </div>
        <div>
          <Button
            variant="light"
            className="me-2 border-1 text-danger border-danger"
            onClick={exportCSV}
          >
            <Image
              className="me-2"
              style={{ width: "22px", height: "22px" }}
              src={solar_export}
            />
            Export
          </Button>
          <Link to={"/admin/inventory/purchase-order"}>
            <Button variant="primary">
              <span className="me-2">+</span> New PO
            </Button>
          </Link>
        </div>
      </div>
      <Table
        striped
        hover
        style={{
          minWidth: "600px",
          marginTop: "2rem",
          borderBottom: "1px solid #dee2e6",
          marginBottom: "1rem",
        }}
      >
        <thead style={{ backgroundColor: "#0062FF0D" }}>
          <tr>
            <th>S/N</th>
            <th>ORDER NO</th>
            <th>VENDOR</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>DELIVERY DATE</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "#F5F5F5" }}>
          {dummyOrders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>
                <Link
                  to={`/admin/inventory/purchase-order-details`}
                  style={{ fontWeight: "bold" }}
                >
                  {order.orderNo}
                </Link>
              </td>

              <td>
                <div className="d-flex gap-2 align-items-center">
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: getRandomColor(order.vendor),
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {order.vendor.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: "bold"}}>
                    {order.vendor}
                  </span>
                </div>
              </td>
              <td>{order.amount}</td>
              <td>
                <div className="d-flex gap-2 align-items-center">
                  <div
                    className={`rounded-pill px-2 py-1 `}
                    style={{
                      backgroundColor:
                        order.status === "Pending"
                          ? "#fdffcc"
                          : order.status === "Completed"
                          ? "#D1FFC8"
                          : "#FFD9DA",
                    }}
                  >
                    {order.status}
                  </div>
                </div>
              </td>
              <td>{order.deliveryDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="justify-content-end mt-3">
        <Col xs="auto">
          <Pagination>
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Next />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default PurchaseOrderList;

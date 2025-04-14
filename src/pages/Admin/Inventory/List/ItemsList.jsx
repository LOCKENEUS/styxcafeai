import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Image,
  Pagination,
  Table,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { Link, useNavigate } from "react-router-dom";
import gm1 from "/assets/inventory/mynaui_search.svg";
import solar_export from "/assets/inventory/solar_export-linear.png";
import add from "/assets/inventory/material-symbols_add-rounded.png";
import { BsCurrencyRupee } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { getItems } from "../../../../store/AdminSlice/Inventory/ItemsSlice"; // Adjust the path as necessary
import Loader from "../../../../components/common/Loader/Loader";

const ItemsList = () => {
  const [searchText, setSearchText] = useState("");
  const navigator = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;

  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(getItems(cafeId));
  }, [dispatch]);

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

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const handleShowCreate = () => {
    navigator("/admin/inventory/create-items");
  };

  const generateCSV = () => {
    const headers = [
      "SN",
      "Item Name",
      "Price",
      "Stock",
      "SKU",
      "HSN",
      "Unit",
      "Dimension",
    ];
    const rows = items.map((item) => [
      item.sn,
      item.name,
      item.price,
      item.stock,
      item.sku,
      item.hsn,
      item.unit,
      item.dimension,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "items_list.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container fluid className="p-1">
      <Row>
        <Col xs={12} className="mx-2 mx-md-4 my-3">
          <div style={{ fontSize: "12px" }}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/admin/dashboard">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/admin/inventory/dashboard">Inventory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Items List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        <Col xs={12}>
          <Card
            data-aos="fade-right"
            data-aos-duration="1000"
            className="mx-2 mx-md-4 p-2 p-md-3"
          >
            <Row className="align-items-center">
              <Col xs={12} md={4} className="d-flex my-2">
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    lineHeight: "18px",
                  }}
                  className="ms-2"
                >
                  Items List
                </h1>
              </Col>

              <Col xs={12} md={3} className="d-flex my-2">
                <InputGroup className="navbar-input-group">
                  <InputGroupText
                    className="border-0"
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    <Image src={gm1} />
                  </InputGroupText>

                  <FormControl
                    type="search"
                    size="sm"
                    placeholder="Search for vendors"
                    aria-label="Search in docs"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                  />

                  {searchText && (
                    <InputGroupText
                      as="button"
                      className="border-0 bg-transparent"
                      onClick={() => setSearchText("")}
                    >
                      ✖
                    </InputGroupText>
                  )}
                </InputGroup>
              </Col>

              <Col
                xs={12}
                md={5}
                className="d-flex justify-content-start justify-content-md-end text-start text-md-end my-2"
              >
                <Button
                  variant="white"
                  className="btn px-4 mx-2"
                  size="sm"
                  style={{ borderColor: "#FF3636", color: "#FF3636" }}
                  onClick={generateCSV}
                >
                  <Image
                    className="me-2 size-sm"
                    style={{ width: "22px", height: "22px" }}
                    src={solar_export}
                  />
                  Export
                </Button>

                <Button
                  variant="primary"
                  className="px-4 mx-2"
                  size="sm"
                  onClick={handleShowCreate}
                >
                  <Image
                    className="me-2"
                    style={{ width: "22px", height: "22px" }}
                    src={add}
                  />
                  New Items
                </Button>
              </Col>

              <Col xs={12} style={{ marginTop: "20px" }}>
                <div className="table-responsive">
                  <Table striped style={{ minWidth: "600px" }}>
                    <thead style={{ backgroundColor: "#0062FF0D" }}>
                      <tr className="no-uppercase">
                        {[
                          "S/N",
                          "Item Name",
                          "Price",
                          "Stock",
                          "SKU",
                          "HSN",
                          "Unit",
                          "Dimension",
                        ].map((header, index) => (
                          <th
                            key={index}
                            style={{
                              fontWeight: "bold",
                              fontSize: "0.9rem",
                              color: "black",
                            }}
                          >
                            {" "}
                            <h4> {header} </h4>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#F5F5F5" }}>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            <Loader />
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-danger"
                          >
                            {error}
                          </td>
                        </tr>
                      ) : filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            No items found
                          </td>
                        </tr>
                      ) : (
                        filteredItems
                          .slice(
                            (activePage - 1) * itemsPerPage,
                            activePage * itemsPerPage
                          )
                          .map((item, index) => (
                            <tr key={index}>
                              <td>
                                {(activePage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>
                                <div
                                  className="d-flex gap-2 align-items-center"
                                  onClick={() =>
                                    navigator(
                                      `/admin/inventory/item-details/${item._id}`
                                    )
                                  }
                                >
                                  <div
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                      backgroundColor: getRandomColor(
                                        item.name
                                      ),
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {item.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                      color: "#0062FF",
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <BsCurrencyRupee />
                                {item.sellingPrice}
                              </td>
                              <td>{item.stock}</td>
                              <td>{item.sku}</td>
                              <td>{item.hsn}</td>
                              <td>{item.unit}</td>
                              <td>{item.dimension}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(activePage - 1)}
                      disabled={activePage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === activePage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(activePage + 1)}
                      disabled={activePage === totalPages}
                    />
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <style jsx>{`
        @media (max-width: 768px) {
          .table-responsive {
            overflow-x: auto;
          }

          th h4 {
            font-size: 0.8rem;
          }

          td {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </Container>
  );
};

export default ItemsList;

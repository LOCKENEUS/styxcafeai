import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Tab,
  Table,
  Card,
  Breadcrumb,
  BreadcrumbItem,
} from "react-bootstrap";
import { BiArrowBack, BiCloudUpload } from "react-icons/bi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItemsGroupsById } from "../../../../store/slices/inventory";

export const ItemGroupDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { groupId: id } = location.state
  // const { selectedItemGroup, loading, error } = useSelector(
  //   (state) => state.itemGroups
  // );

  console.log("groupId", id)
  const selectedItemGroup = useSelector((state) => state.inventorySuperAdmin.inventory);

  useEffect(() => {
    dispatch(getItemsGroupsById(id)).then((res) => {
    });
  }, [dispatch, id]);

  return (
    <Container
      fluid
      className="mt-4 min-vh-100"
    >
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/admin/dashboard">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/admin/inventory/dashboard">Inventory</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/admin/inventory/item-group-list">Item Group List</Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Item Groups Details</BreadcrumbItem>
      </Breadcrumb>
      <Tab.Container defaultActiveKey="checkout">
        <Row data-aos="fade-down" data-aos-duration="1000">
          <Col sm={12} className="mt-3">
            <Tab.Content>
              <Card className="p-3">
                <Tab.Pane eventKey="checkout">
                  {/* <h5>Details</h5> */}
                  <div className="d-flex justify-content-between mt-3">
                    <div className="ms-2">
                      <h3>{selectedItemGroup?.group_name}</h3>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          navigate(`/admin/inventory/item-group-form/${id}`)
                        }
                        className="btn btn-primary me-2"
                      >
                        <BiCloudUpload /> Edit
                      </button>

                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                      >
                        <BiArrowBack /> Back
                      </button>
                    </div>
                  </div>
                  <Table className="w-25" borderless>
                    <tbody>
                      <tr>
                        <td>Unit</td>
                        <td>
                          <b>{selectedItemGroup?.unit || "N/A"}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Tax</td>
                        <td>
                          <b>{selectedItemGroup?.tax?.tax_rate || "N/A"}%</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Manufacturer</td>
                        <td>
                          <b>
                            {selectedItemGroup?.manufacturer?.name || "N/A"}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Brand</td>
                        <td>
                          <b>{selectedItemGroup?.brand?.name || "N/A"}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Description</td>
                        <td><b>{selectedItemGroup?.description || 'N/A'}</b></td>
                      </tr>
                    </tbody>
                  </Table>
                  <hr className="w-50" />
                  <h5>List of Items under this Group:</h5>
                  <Row>
                    {selectedItemGroup?.items?.map((item, index) => (
                      <Col md={6} key={item._id} className="mb-3 pointer-cursor" onClick={() => navigate(`/Inventory/itemDetails`, { state: { groupId: item?._id } })}>
                        <Card className="p-3">
                          <Row>
                            <Col md={6}>
                              <h6>{item.name || "No Name Available"}</h6>
                              <p>SKU : {item.sku || "No SKU Available"}</p>
                              <p>
                                Price : ₹
                                {item.sellingPrice !== null
                                  ? item.sellingPrice
                                  : "Price Not Available"}
                              </p>
                              <p>
                                Stock :{" "}
                                {item.stock !== null
                                  ? item.stock
                                  : "Stock Not Available"}
                              </p>
                            </Col>
                            <Col md={6}>
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#e0e0e0",
                                  borderRadius: "5px",
                                }}
                              >
                                <span>250 x 250</span>
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
              </Card>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};
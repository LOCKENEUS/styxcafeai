import { useEffect, useState } from "react";
import { Tabs, Tab, Container, Row, Col, Card, CardHeader, Button, Table, Image, Breadcrumb } from "react-bootstrap";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Rectangle389 from "/assets/superAdmin/cafe/Rectangle389.png";
import { useDispatch, useSelector } from "react-redux";
import { getItemsById, getItemTransactions } from "../../../../store/slices/inventory";
import { ItemDeleteModal } from "../delete/itemDelete";
import Loader from "../../Loader/Loader";

export const ItemsDetails = () => {
  const location = useLocation();
  const { groupId } = location.state || {};
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [key, setKey] = useState("tabOne");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    setMainLoading(true);
    if (groupId) {
      dispatch(getItemsById(groupId)).finally(() => {
        setMainLoading(false);
      });
    }
  }, [dispatch]);

  useEffect(() => {
        dispatch(getItemTransactions(groupId));

  }, [dispatch]);

  const itemDetails = useSelector((state) => state.inventorySuperAdmin.inventory);
  const transactionDetails = useSelector((state) => state.inventorySuperAdmin.itemTransactions);

  const handaleBack = () => {
    navigate("/Inventory/Items");
  }

  return (
    <Container className="text-center">

      <Row>
        <Card.Header className="fw-bold py-0 py-md-2">
          <Row className="d-flex justify-content-between align-items-center  ">
            <Col sm={8} xs={12} >
              <Breadcrumb className="ms-3">
                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>

                  <Link to="/superadmin/dashboard">Home
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                  <Link to="/Inventory/Dashboard">
                    Inventory
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>
                  <Link to="/Inventory/Items"
                  >
                    Items List
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Items Details</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Card.Header>
        {mainLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
            <Loader />
          </div>
        ) : !itemDetails || Object.keys(itemDetails).length === 0 ? (
          <div className="text-center mt-5">
            <h5>No item details found.</h5>
          </div>
        ) : (
          <>
            <Col md={12} className="my-0 my-md-2">
              <Card className="my-2">
                <CardHeader as="h5">
                  <Row >
                    <Col sm={6} className="d-flex justify-content-start">
                      <h3 className="fw-bold txt-start">{itemDetails.name}</h3>
                    </Col>
                    <Col sm={6} className="d-flex justify-content-end">
                      <Button className="mx-2" variant="outline-dark" onClick={handaleBack}><IoArrowBackOutline className="mx-2" />Back</Button>
                      <Button className="mx-2" variant="success" onClick={() => navigate(`/Inventory/Items/ItemEdit`, { state: { groupId: groupId } })}>
                        <RiEditFill className="mx-2" />
                        Edit
                      </Button>

                      <Button className="mx-2" variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                      ><MdDelete className="mx-2" />Delete</Button>

                      <ItemDeleteModal show={showdeleteModal} handleClose={() => setShowDeleteModal(false)} groupId={groupId} />
                    </Col>
                  </Row>
                </CardHeader>
              </Card>
              <Row>

                <Col sm={7}>
                  <Card className="my-3 px-4" style={{ height: "700px", overflowY: "scroll" }} >
                    <Tabs
                      id="vendor-tabs"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                      className="mb-5 mx-2"
                      justify
                      style={{ fontSize: "16px", fontWeight: "500" }}
                    >
                      <Tab eventKey="tabOne" title="Overview" style={{ fontSize: "16px", fontWeight: "500" }}>
                        <Row>
                          <Col sm={12} className="mb-2">
                            <Row className="mb-3 mx-4">
                              <Col sm={6} xs={3} className="justify-content-start align-items-start my-2"><strong className="float-start">SKU</strong></Col>
                              <Col sm={6} xs={9} className="my-2">{itemDetails.sku || "---"}</Col>

                              <Col sm={6} xs={3} className="my-2"><strong className="float-start">Unit</strong></Col>
                              <Col sm={6} xs={9} className="my-2">{itemDetails.unit || "---"}</Col>

                              <Col sm={6} xs={3} className="my-2"><strong className="float-start">Dimension</strong></Col>
                              <Col sm={6} xs={9} className="my-2">
                                {(!itemDetails.length || !itemDetails.width || !itemDetails.height || !itemDetails.dimensionUnit)
                                  ? '---'
                                  : `${itemDetails.length} x ${itemDetails.width} x ${itemDetails.height} ${itemDetails.dimensionUnit}`}
                              </Col>

                              <Col sm={6} xs={3} className="my-2"><strong className="float-start">Weight</strong></Col>
                              <Col sm={6} xs={9} className="my-2">{itemDetails.weight || "---"}</Col>

                              <Col sm={6} xs={3} className="my-2"><strong className="float-start">Manufacturer</strong></Col>
                              <Col sm={6} xs={9} className="my-2">{itemDetails.manufacturer?.name || "---"}</Col>

                              <Col sm={6} xs={3} className="my-2"><strong className="float-start">Brand</strong></Col>
                              <Col sm={6} xs={9} className="my-2">{itemDetails.brand?.name || itemDetails.brand || "---"}</Col>
                            </Row>

                            <h5 className="fw-bold mt-4 mx-5 border-top py-4 border-bottom border-dark text-start" style={{ fontSize: "16px", fontWeight: "500" }}>Purchase Information</h5>
                            <Row className="mb-3 mx-4">
                              <Col sm={6} xs={5} className="my-2"><strong className="float-start">Cost Price</strong></Col>
                              <Col sm={6} xs={7} className="my-2">₹{itemDetails.costPrice || "---"}</Col>

                              <Col sm={6} xs={5} className="my-2"><strong className="float-start">Selling Price</strong></Col>
                              <Col sm={6} xs={7} className="my-2">₹{itemDetails.sellingPrice || "---"}</Col>
                            </Row>
                          </Col>
                        </Row>
                      </Tab>
                      <Tab eventKey="tabTwo" title="Transaction">
                        {/* <Card className="rounded-2 p-2" style={{ overflowX: "auto" }}> */}
                        <Table className="table-sm table-hover table-vertical-border">
                          <thead style={{ backgroundColor: "#f8f9fa" }}>
                            <tr>
                              <th className="py-3 fw-bold">#</th>
                              <th className="py-3 fw-bold" >BILL NO</th>
                              <th className="py-3 fw-bold">QTY</th>
                              <th className="py-3 fw-bold">PRICE</th>
                              <th className="py-3 fw-bold">STATUS</th>
                              <th className="py-3 fw-bold">DATETIME</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionDetails.length > 0 && transactionDetails.map((row, index) => (
                              <tr key={row.id}>
                                <td>{index + 1}</td>
                                <td nowrap="true" className="text-primary " style={{ cursor: "pointer" }}>
                                  {/* <a href={row.link}>{row.billNo}</a> */}
                                  {row.refer_data?.po_no}
                                </td>
                                <td nowrap="true">{row.quantity}</td>
                                <td nowrap="true">{row.price}</td>
                                <td>Draft</td>
                                <td>{new Date(row.refer_data.delivery_date).toDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {/* </Card> */}
                      </Tab>
                      <Tab eventKey="tabThree" title="History">
                        <Table className="table-sm table-hover table-vertical-border">
                          <thead style={{ backgroundColor: "#f8f9fa" }}>
                            <tr>
                              <th className="py-3 fw-bold">#</th>
                              <th className="py-3 fw-bold">QUANTITY</th>
                              <th className="py-3 fw-bold">DESCRIPTION</th>
                              <th className="py-3 fw-bold">DATETIME</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionDetails.map((item, index) => (
                              <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.quantity}</td>
                                <td>{item.description || "-"}</td>
                                <td>{new Date(item.refer_data.delivery_date).toDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Tab>
                    </Tabs>
                  </Card>

                </Col>

                <Col sm={5} className="mb-2">
                  <Card className="my-3 p-2" style={{ height: "700px", overflowY: "scroll" }} >
                    <div className="my-3  text-center ">
                      <Image
                        src={`${import.meta.env.VITE_API_URL}/${itemDetails.image}`}
                        alt="product image"
                        id="imagePreview"
                        onError={(e) =>
                        (e.target.src =
                          { Rectangle389 })
                        }
                        style={{ width: "200px", aspectRatio: "1", objectFit: "cover" }}
                        className="rounded-3"
                      />
                    </div>

                    <div className="text-dark p-2 rounded-2 text-start">
                      <h5 className="fw-bold d-flex align-items-center mb-4 ms-2" style={{ fontSize: "16px", fontWeight: "500" }}>
                        <b style={{ fontSize: "17px", fontWeight: "700" }}>Stock Details</b>
                      </h5>

                      <Row className="ps-3 my-2">
                        <Col md={6} className="mb-3">
                          <h6 className="fw-bold" style={{ fontSize: "16px" }}>Accounting Stock</h6>
                          <div className="my-3">
                            <div className="my-1">Stock In Hand &nbsp;: <b>{itemDetails.stock}</b></div>
                            <div className="my-1">Committed Stock : <b>0</b></div>
                            <div className="my-1">Available Stock  &nbsp;: <b>0</b></div>
                          </div>
                        </Col>

                        <Col md={6} className="mb-3">
                          <h6 className="fw-bold" style={{ fontSize: "16px" }}>Physical Stock</h6>
                          <div className="my-3">
                            <div className="my-1">Stock In Hand &nbsp;: <b>{itemDetails.stock}</b></div>
                            <div className="my-1">Committed Stock : <b>0</b></div>
                            <div className="my-1">Available Stock  &nbsp;: <b>0</b></div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={6} className="pe-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4 style={{ fontSize: "16px" }}>
                              {itemDetails.qty_to_ship} <span >Qty</span>
                            </h4>
                            <p>To be Shipped</p>
                          </Card>
                        </Col>
                        <Col xs={6} className="ps-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4>
                              {itemDetails.qty_to_receive} <span >Qty</span>
                            </h4>
                            <p>To be Received</p>
                          </Card>
                        </Col>
                        <Col xs={6} className="pe-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4>
                              {itemDetails.qty_to_invoice} <span >Qty</span>
                            </h4>
                            <p>To be Invoiced</p>
                          </Card>
                        </Col>
                        <Col xs={6} className="ps-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4>
                              {itemDetails.qty_to_bill} <span >Qty</span>
                            </h4>
                            <p>To be Billed</p>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </Container>
  )
}

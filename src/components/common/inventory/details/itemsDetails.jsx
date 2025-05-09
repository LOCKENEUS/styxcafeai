import { useEffect, useState } from "react";
import { Tabs, Tab, Container, Row, Col, Card, CardHeader, Button, Table, Image, Breadcrumb } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Rectangle389 from "/assets/superAdmin/cafe/Rectangle389.png";
import { useDispatch, useSelector } from "react-redux";
import { getItemsById } from "../../../../store/slices/inventory";
import { ItemDeleteModal } from "../delete/itemDelete";
import Loader from "../../Loader/Loader";

export const ItemsDetails = () => {
  const location = useLocation();
  const { groupId } = location.state || {};
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  console.log("Received groupId:", groupId);
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

  const itemDetails = useSelector((state) => state.inventorySuperAdmin.inventory);
  console.log("itemDetails:", itemDetails);

  const tableData = [
    {
      id: 1,
      billNo: "SINV-004",
      qty: "18 Nos",
      price: "₹ 499",
      status: "Draft",
      datetime: "2025-02-07",
      // link: "https://fsm.lockene.net/Web/Inventory/InvoiceDetails/12",
    },
    {
      id: 2,
      billNo: "SINV-003",
      qty: "50 Nos",
      price: "₹ 499",
      status: "Paid",
      datetime: "2025-02-07",
      // link: "https://fsm.lockene.net/Web/Inventory/InvoiceDetails/6",
    },
    {
      id: 3,
      billNo: "PB-004",
      qty: "8 Nos",
      price: "₹ 245",
      status: "Paid",
      datetime: "2025-02-07",
      // link: "https://fsm.lockene.net/Web/Inventory/PBDetails/25",
    },
  ];

  const data = [
    { id: 1, quantity: "10 Nos", description: "Order is received", datetime: "2025-02-08 10:57:01" },
    { id: 2, quantity: "10 Nos", description: "Order is received", datetime: "2025-02-08 10:56:41" },
    { id: 3, quantity: "20 Nos", description: "Purchase order created", datetime: "2025-02-08 10:56:13" },
    { id: 4, quantity: "50 Nos", description: "", datetime: "2025-02-08 10:53:00" },
    { id: 5, quantity: "18 Nos", description: "Shipping invoice created", datetime: "2025-02-07 11:18:21" },
    { id: 6, quantity: "10 Nos", description: "Order is shipped", datetime: "2025-02-07 11:18:07" },
    { id: 7, quantity: "8 Nos", description: "Order is shipped", datetime: "2025-02-07 11:17:41" },
    { id: 8, quantity: "8 Nos", description: "Order is packed", datetime: "2025-02-07 11:17:15" },
    { id: 9, quantity: "10 Nos", description: "Order is packed", datetime: "2025-02-07 11:16:23" },
    { id: 10, quantity: "18 Nos", description: "Sales order created", datetime: "2025-02-07 11:15:56" },
    { id: 11, quantity: "50 Nos", description: "Shipping invoice created", datetime: "2025-02-07 11:08:20" },
    { id: 12, quantity: "50 Nos", description: "Order is shipped", datetime: "2025-02-07 11:06:40" },
    { id: 13, quantity: "50 Nos", description: "Order is packed", datetime: "2025-02-07 11:04:19" },
    { id: 14, quantity: "50 Nos", description: "Sales order created", datetime: "2025-02-07 11:03:42" },
    { id: 15, quantity: "8 Nos", description: "Received order bill created", datetime: "2025-02-07 10:59:59" },
    { id: 16, quantity: "8 Nos", description: "Order is received", datetime: "2025-02-07 10:57:55" },
    { id: 17, quantity: "10 Nos", description: "Purchase order created", datetime: "2025-02-07 10:57:47" },
    { id: 18, quantity: "80 Nos", description: "Order is received", datetime: "2025-02-07 10:56:43" },
    { id: 19, quantity: "100 Nos", description: "Purchase order created", datetime: "2025-02-07 10:56:08" },
  ];

  const handaleBack = () => {
    console.log("Back button clicked");

    navigate("/Inventory/Items");
  }

  return (
    <Container className="text-center">

      <Row>
        <Card.Header className="fw-bold">
          <Row className="d-flex justify-content-between align-items-center  ">
            <Col sm={8} xs={12} >
              <Breadcrumb>
                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>

                  <Link to="/superadmin/dashboard">Home
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                  <Link to="/Inventory/Dashboard"

                  >
                    Inventory
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>

                  <Link to="/Inventory/Items"
                  // state={{ cafeId: cafeId }}
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
            <Col md={12} className="my-2">
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
                  <Card className="my-3 px-4  " style={{ height: "700px", overflowY: "scroll" }} >
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
                              <Col sm={6} className="justify-content-start align-items-start my-2"><strong className="float-start">SKU</strong></Col>
                              <Col sm={6} className="my-2">{itemDetails.sku || "---"}</Col>

                              <Col sm={6} className="my-2"><strong className="float-start">Unit</strong></Col>
                              <Col sm={6} className="my-2">{itemDetails.unit || "---"}</Col>

                              <Col sm={6} className="my-2"><strong className="float-start">Dimension</strong></Col>
                              <Col sm={6} className="my-2">
                                {(!itemDetails.length || !itemDetails.width || !itemDetails.height || !itemDetails.dimensionUnit)
                                  ? '---'
                                  : `${itemDetails.length} x ${itemDetails.width} x ${itemDetails.height} ${itemDetails.dimensionUnit}`}
                              </Col>

                              <Col sm={6} className="my-2"><strong className="float-start">Weight</strong></Col>
                              <Col sm={6} className="my-2">{itemDetails.weight || "---"}</Col>

                              <Col sm={6} className="my-2"><strong className="float-start">Manufacturer</strong></Col>
                              <Col sm={6} className="my-2">{itemDetails.manufacturer?.name || "---"}</Col>

                              <Col sm={6} className="my-2"><strong className="float-start">Brand</strong></Col>
                              <Col sm={6} className="my-2">{itemDetails.brand?.name || itemDetails.brand || "---"}</Col>
                            </Row>

                            <h5 className="fw-bold mt-4 mx-5 border-top py-4 border-bottom border-dark text-start" style={{ fontSize: "16px", fontWeight: "500" }}>Purchase Information</h5>
                            <Row className="mb-3 mx-4">
                              <Col sm={6} className="my-2"><strong className="float-start">Cost Price</strong></Col>
                              <Col sm={6} className="my-2">₹{itemDetails.costPrice || "---"}</Col>

                              <Col sm={6} className="my-2"><strong className="float-start">Selling Price</strong></Col>
                              <Col sm={6} className="my-2">₹{itemDetails.sellingPrice || "---"}</Col>
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
                            {tableData.map((row) => (
                              <tr key={row.id}>
                                <td>{row.id}</td>
                                <td nowrap="true" className="text-primary " style={{ cursor: "pointer" }}>
                                  {/* <a href={row.link}>{row.billNo}</a> */}
                                  {row.billNo}
                                </td>
                                <td nowrap="true">{row.qty}</td>
                                <td nowrap="true">{row.price}</td>
                                <td>{row.status}</td>
                                <td>{row.datetime}</td>
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
                            {data.map((item) => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.quantity}</td>
                                <td>{item.description || "-"}</td>
                                <td>{item.datetime}</td>
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
                        src={Rectangle389}
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
                      <h5 className="fw-bold d-flex align-items-center mb-4" style={{ fontSize: "16px", fontWeight: "500" }}>
                        <b style={{ fontSize: "17px", fontWeight: "700" }}>Stock Details</b>
                      </h5>

                      <Row className="ps-3 my-2">
                        <Col md={6} className="mb-3">
                          <h6 className="fw-bold" style={{ fontSize: "16px" }}>Accounting Stock</h6>
                          <div className="my-3">
                            <div className="my-1">Stock In Hand &nbsp;: <b>41</b></div>
                            <div className="my-1">Committed Stock : <b>22</b></div>
                            <div className="my-1">Available Stock  &nbsp;: <b>63</b></div>
                          </div>
                        </Col>

                        <Col md={6} className="mb-3">
                          <h6 className="fw-bold" style={{ fontSize: "16px" }}>Physical Stock</h6>
                          <div className="my-3">
                            <div className="my-1">Stock In Hand &nbsp;: <b>41</b></div>
                            <div className="my-1">Committed Stock : <b>0</b></div>
                            <div className="my-1">Available Stock  &nbsp;: <b>41</b></div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={6} className="pe-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4 style={{ fontSize: "16px" }}>
                              0 <span >Qty</span>
                            </h4>
                            <p>To be Shipped</p>
                          </Card>
                        </Col>
                        <Col xs={6} className="ps-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4>
                              22 <span >Qty</span>
                            </h4>
                            <p>To be Received</p>
                          </Card>
                        </Col>
                        <Col xs={6} className="pe-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4>
                              0 <span >Qty</span>
                            </h4>
                            <p>To be Invoiced</p>
                          </Card>
                        </Col>
                        <Col xs={6} className="ps-1">
                          <Card className="rounded-2 border p-2 my-3 mx-3 text-center">
                            <h4>
                              122 <span >Qty</span>
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

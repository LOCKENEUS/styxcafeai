import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";;
import sendMail from "/assets/inventory/Group.png";
import Lockenelogo from "/assets/inventory/companylogo.png";
import print from "/assets/inventory/Vector.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { getSalesReturnDetails } from "../../../../store/slices/Inventory/returnSlice";

export const SalesReturnDetails = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const cafeId = user?._id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSalesReturnDetails(shipment));
  }, [dispatch, cafeId]);

  const shipmentData = useSelector(state => state.saSalesReturn.selectedItem);
  const loading = useSelector(state => state.saShipment).loading;
  const location = useLocation();
  const { id } = useParams();
  const shipment = id;

  const handleSendMail = () => {
    dispatch(sendMailToVendor(shipmentData))
  }

  const handlePoNavigation = () => {
    const poId = shipmentData?.refer_id?._id;
    navigate(`/Inventory/SalesOrderDetails/${poId}`);
  }

  const handleItemNavigation = (id) => {
    navigate(`/Inventory/itemDetails`, { state: { groupId: id } });
  }

  // count items
  const countItems = shipmentData?.ship_id;

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
        </Spinner>
      </Container>
    );
  }

  return (
    <Container >
      <Row className="mx-2">
        {/* Breadcrumb Section */}
        <Col sm={12} className="mt-3">
          <div style={{ top: "186px", fontSize: "16px" }}>
            <Breadcrumb>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem><Link to="/Inventory/SalesReturn/List">Sales Return List</Link></BreadcrumbItem>
              <BreadcrumbItem active>Sales Return Details</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        <Col sm={12} className="my-2">
          <Card className="p-3">
            <Row>
              <Col sm={6} xs={12}>
                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                  <span>Return No : </span>
                  <span>{shipmentData?.po_no}</span>
                </h5>
              </Col>
              <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}
                  onClick={() => window.print()}
                >
                  <Image src={print} className="me-2" /> Print
                </Button>
                <Button className="d-flex align-items-center" onClick={handleSendMail} style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                  <Image src={sendMail} className="me-2" /> Send Email
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <Row className="align-items-center">
              <Col xs={2}>
                <img
                  src={Lockenelogo}
                  alt="Logo"
                  className="img-fluid"
                />
              </Col>
              <Col>
                <h5>{user?.name}</h5>
                <p className="mb-1">{user?.email} / {user?.contact}</p>
                <p className="mb-1">
                  {user?.address}
                </p>
                <strong>PAN: {user?.pan}</strong>
              </Col>
              <Col xs={2} className="text-end">
                <span className="text-muted">Invoice:</span>
                <strong className="text-primary">Draft</strong>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Customer & Order Details */}
        <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <Row>
              {/* Customer Info */}
              <Col sm={6}  >
                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>{shipmentData?.vendor_id?.name}</h5>
                <h5 className="text-muted mb-3" style={{ fontSize: '16px' }}>{shipmentData?.vendor_id?.email} / {shipmentData?.vendor_id?.contact_no}</h5>
                <Row>
                  <Col sm={6} >
                    <span className="text-color" style={{ fontSize: '16px' }}>From Address</span>
                    <div className="my-3">{shipmentData?.vendor_id?.address}</div>
                  </Col>
                </Row>
              </Col>
              <Col sm={6} >
                <div className="mx-2 border-start border-3 px-2 d-flex flex-column gap-2">
                  <div><span className="my-1 fw-bold">Return No:</span> <span className="float-end">{shipmentData?.po_no}</span></div>
                  <div><span className="my-1 fw-bold">Return Date:</span> <span className="float-end">{new Date(shipmentData?.delivery_date).toLocaleDateString()}</span></div>
                  <div>
                    <span className="my-1 fw-bold">
                      Order No:
                    </span>
                    <span
                      className="float-end text-primary pointer-cursor"
                      onClick={() => navigate(`/Inventory/SalesOrderDetails/${shipmentData?.refer_id?._id}`)}>{shipmentData?.refer_id?.po_no}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <Row>
              <Col sm={12}>
                <div className="table-responsive">
                  <Table className="text-center align-middle">
                    <thead className="text-start" >
                      <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                        <th className="fw-bold"  >PRODUCT</th>
                        <th className="fw-bold" ></th>
                        <th className="fw-bold" >QUANTITY</th>
                        <th className="fw-bold" ></th>
                      </tr>
                    </thead>
                    <tbody className="text-start" >
                      {countItems && countItems.length > 0 ? (
                        countItems.map((item, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" className="fw-bold bg-light text-primary py-2">
                                {item.po_no}
                              </td>
                            </tr>
                            {item.items.map((subItem, subIndex) => (
                              <tr key={index}>
                                <td className="pointer-cursor text-primary" onClick={() => handleItemNavigation(subItem?.item_id?._id)}>
                                  {/* <b>{item?.item_id?.name}</b> */}
                                  <b>
                                    {subItem?.item_id?.name}
                                  </b>
                                  <br />
                                  HSN : {subItem?.item_id?.hsn}
                                </td>
                                <td>
                                  SKU : {subItem?.item_id?.sku}
                                </td>
                                <td>
                                  Ordered Qty  : {subItem?.quantity} Nos
                                </td>
                                <td>  Packed Qty :  {subItem?.qty_packed}</td>
                                <td>  Shipped Qty :  {subItem?.qty_shipped}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No Items Found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <Row>
              <Col sm={6} className="p-2 position-relative">
                <div><b>Description : </b></div>
                <div className="d-none d-sm-block" style={{ height: "2rem" }}>
                  {shipmentData?.description}
                </div>
              </Col>
              <Col sm={6} className="p-2">
                {/* Add any content here if needed */}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
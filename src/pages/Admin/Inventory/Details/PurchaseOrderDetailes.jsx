import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Table } from "react-bootstrap";
import { LuPencil } from "react-icons/lu";
import pdflogo from "/assets/Admin/profileDetails/pdflogo.svg";
import deleteplogo from "/assets/inventory/Vector (1).png";
import receive from "/assets/inventory/solar_card-send-linear.png";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import companylog from "/assets/inventory/companylogo.png";
import { Link, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
// import { GetPurchaseOrder } from "../../../../store/AdminSlice/Inventory/purchaseOrder";

import { useDispatch, useSelector } from "react-redux";
import { GetPurchaseOrder } from "../../../../store/AdminSlice/Inventory/purchaseOrder";

const PurchaseOrderDetails = () => {
    
    const dispatch = useDispatch();
    const location = useLocation();
    const purchaseOrder = location.state;

    const POId =purchaseOrder?._id;
    console.log("Purchase Order ID call:", POId);
  
    console.log("Purchase Order 101:", purchaseOrder);
    const ShippingAd = purchaseOrder?.vendor_id?.shippingAddress;
    const BillingAddress = purchaseOrder?.vendor_id?.billingAddress;
    const payment_terms = purchaseOrder?.payment_terms;
    const reference = purchaseOrder?.reference;
    const shipment_preference = purchaseOrder?.shipment_preference;
    console.log("payment_terms", shipment_preference);
    const delivery_datedelivery_date = purchaseOrder?.delivery_date;
    console.log("delivery_datedelivery_date", new Date(delivery_datedelivery_date).toLocaleDateString());
    

    const user = JSON.parse(sessionStorage.getItem("user"));
 
  const cafeId = user?._id;

  console.log("user ----", user);
  const userName= user?.name;
  const userEmail= user?.email;
  const UserContactN = user?.contact_no;
  const UserAddress = user?.address;
  const UesrPAN = user?.panNo;
  console.log("userName call ----", userName);
 
 
  useEffect(() => {
    dispatch(GetPurchaseOrder(user?._id));
    
    
  }, [dispatch]);
  const PurchaseOrderList = useSelector((state) => state.purchaseOrder);
  console.log("Purchase Order filter data PurchaseOrderList :", PurchaseOrderList);
  console.log("Purchase Order filter data selectedItem:", PurchaseOrderList?.selectedItem);




  
  return (
    <Container >
        <Row className="mx-2">
            {/* Breadcrumb Section */}
            <Col sm={12} className="my-3">
                <div style={{ top: "186px", fontSize: "18px" }}>
                    <Breadcrumb>
                        <BreadcrumbItem ><Link to="/admin/dashboard">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to="/admin/inventory/purchase-order-list">Purchase Order List</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Purchase Order Details</BreadcrumbItem>
                    </Breadcrumb>
                </div>
            </Col>


            <Col sm={12} className="my-2">
                <Card className="p-3">
                    <Row>
                        <Col sm={6} xs={12}>
                            <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                <span>Purchase Order  :  </span>
                                <span> {purchaseOrder?.po_no}</span>
                            </h5>
                        </Col>
                        <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                            <Button className="d-flex align-items-center 	" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}
                            //  onClick={handlePrint}
                            onClick={() => window.print()}
                            >
                                <Image src={print} className="me-2" /> Print
                            </Button>
                            <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                <Image src={sendMail} className="me-2" /> Send Email
                            </Button>
                            <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                <Image src={receive} className="me-2" /> Receive
                            </Button>
                            <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                <Link to={`/admin/inventory/PurchaseOrderUpdate/${POId}`} >
                               
                                    <Image src={editlogo} className="me-2" /> Edit
                                </Link>


                            </Button>
                            <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                <Image src={deleteplogo} />
                            </Button>

                        </Col>
                    </Row>
                </Card>
            </Col>

            {/* Company Info */}
            <Col sm={12} className="my-2">
                <Card className="p-3">
                    <Row className="align-items-center">
                        <Col sm={2}>
                            <img src={companylog} alt="Logo" className="img-fluid" />
                        </Col>
                        <Col sm={8}>
                            <h5>{userName}</h5>
                            <p className="mb-1">{userEmail} / {UserContactN}</p>
                            <p className="mb-1">
                               {UserAddress}
                            </p>
                            <strong>PAN: {UesrPAN}</strong>
                        </Col>
                        <Col sm={2} className=" d-flex  ">
                            <span className="p-2 float-right">PO :<b className="text-primary">Received</b></span>
                            {/* <strong className="text-primary"> Draft</strong> */}
                        </Col>
                    </Row>
                </Card>
            </Col>

            {/* Customer & Order Details */}
            <Col sm={12} className="my-2">
                <Card className="p-3 shadow-sm">
                    <Row>
                        {/* Customer Info */}
                        <Col sm={4}  >
                            <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>{purchaseOrder?.reference}</h5>
                            <Row>
                                <Col sm={6} >
                                    <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                    <p className="my-3">{BillingAddress} ||Nagpur Division, Maharashtra, India</p>
                                </Col>

                                <Col sm={6} className="border-end border-3" >
                                    <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                    <p className="my-3">{ShippingAd} || Nagpur Division, Maharashtra, India</p>
                                </Col>
                            </Row>
                        </Col>



                        <Col sm={8} >
                            <Row>
                                {/* Delivery Details */}
                                <Col sm={6}  >
                                    <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                    <p className="my-3">
                                        <span style={{ fontSize: '16px' }}>{userName}</span><br />
                                        <span>{userEmail} / {UserContactN}</span>
                                        <br />
                                        <span>{UserAddress}</span>
                                        <br />
                                        <span>PAN:</span> {UesrPAN}
                                    </p>
                                </Col>

                                {/* Order Info */}
                                <Col sm={6} >
                                    <span className="mb-3 float-end" style={{ fontSize: '16px', fontWeight: '500' }}>Order No:<b className="text-primary"> {purchaseOrder?.po_no}</b></span>
                                    <p className="my-5 mx-2 border-start border-3 p-2">
                                        <p><span className="my-1 fw-bold">Expected Delivery:</span> {new Date(delivery_datedelivery_date).toLocaleDateString()}</p>
                                        <p><span className="my-1 fw-bold">Payment Terms:</span> {payment_terms}</p>
                                        <p><span className="my-1 fw-bold">Reference:</span> {reference}</p>
                                        <p><span className="my-1 fw-bold">Shipment Preference:</span> {shipment_preference}</p>
                                    </p>

                                </Col>
                            </Row>
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
                                            <th className="fw-bold" >QUANTITY</th>
                                            <th className="fw-bold" >PRICE</th>
                                            <th className="fw-bold" >TAX</th>
                                            <th className="fw-bold" >TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-start" >
                                        <tr>
                                            <td>
                                                <b>{purchaseOrder?.items?.[0]?.item_id?.name} </b>
                                                <br />
                                                HSN : {purchaseOrder?.items?.[0]?.item_id?.hsn}
                                            </td>
                                            <td>
                                                SKU : {purchaseOrder?.items?.[0]?.item_id?.sku} <br />
                                                Qty : {purchaseOrder?.items?.[0]?.quantity}
                                            </td>
                                            <td>Price : {purchaseOrder?.items?.[0]?.price}</td>
                                            <td>{purchaseOrder?.tax?.[0]?.tax_name}:{purchaseOrder?.tax?.[0]?.tax_rate }</td>
                                            <td>Total : {purchaseOrder?.items?.[0]?.total}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-4 border-top border-3 p-2">
    <Col sm={6} className="border-end border-3">
      <p>
        <b>Description:</b>  Et quae qui veritati 
      </p>
    </Col>
    <Col sm={6} className="text-end">
      <Table  className="text-end">
<tbody>
<tr>
  <td className="fw-bold text-start">Subtotal:</td>
  <td>{purchaseOrder?.subtotal}</td>
</tr>
<tr>
  <td className="fw-bold text-start">Discount:</td>
  <td>
    <span className="text-primary" style={{ cursor: "pointer" }}>
    {purchaseOrder?.discount_value}{purchaseOrder?.discount_type === 'percentage' ? '%' : ' Rs'}

    </span>{" "}
   
  </td>
</tr>
<tr>
  <td className="fw-bold text-start">Tax:</td>
  <td>{purchaseOrder?.tax?.[0]?.tax_name}: ({purchaseOrder?.tax?.[0]?.tax_rate })</td>
</tr>
<tr>
  <td className="fw-bold text-start">Total:</td>
  <td>{purchaseOrder?.total}</td>
</tr>
<tr>
  <td className="fw-bold text-start">{purchaseOrder?.adjustment_note === 0 ? "No Adjustment" : "Adjustment:"}
  {/* {purchaseOrder?.discount_value}{purchaseOrder?.discount_type === 'percentage' ? '%' : ' Rs'}  adjustment_note */}

  </td>
  <td>{purchaseOrder?.adjustment_amount }</td>
</tr>
</tbody>
</Table>
    </Col>

    </Row>

                </Card>
            </Col>
            
{/* <Col sm={12} className="my-2">
    <Card className=" p-3 shadow-sm">
        <h5 className=" mb-3" style={{ fontSize:'20px' }}>Receive & Payment Details</h5>
        <div className="table-responsive">

        <Table className="text-center align-middle">
        <thead >
          <tr  style={{ borderBottom: "2px solid #dee2e6",borderTop: "2px solid #dee2e6" }}>
            <th className="fw-bold">#</th>
            <th className="fw-bold">Date</th>
            <th className="fw-bold">Amount</th>
            <th className="fw-bold">Mode</th>
            <th className="fw-bold">Transaction</th>
           
            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
            1
            </td>
            
            <td>{delivery_datedelivery_date}</td>
            <td>5610</td>
            <td>
            online
            </td>
            <td>UPI</td>
            
          </tr>
        </tbody>
      </Table>

        </div>
    </Card>
</Col> */}

        </Row>

    </Container>
)
};

export default PurchaseOrderDetails;

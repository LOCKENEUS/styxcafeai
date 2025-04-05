import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getPBillById } from "../../../../store/AdminSlice/Inventory/PBillSlice";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import CollectPayment from "../modal/CollectBillPayment";
import {  getPurchaseBillPaymentById } from "../../../../store/AdminSlice/Inventory/CollectPurchaseBill";

export const PurchaseBillDetailsAdmin = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { selectedBill, loading } = useSelector((state) => state.pBill);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();
    const [collectAmount, setCollectAmount] = useState(0);
    const [showCollectModal, setShowCollectModal] = useState(false);
    const { selectedPayment, loading: paymentLoading, error: paymentError } = useSelector(
        (state) => state.purchaseBill
    );

    const cafeId = user?._id;
  
    const userName= user?.name;
    const userEmail= user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;
    console.log("userName ----", userName);

    // Calculate remaining amount
    const { totalPaidAmount, remainingAmount } = useMemo(() => {
        if (!selectedPayment) {
            return {
                totalPaidAmount: 0,
                remainingAmount: selectedBill?.total || 0
            };
        }

        const totalPaid = selectedPayment.reduce(
            (sum, payment) => sum + (Number(payment.deposit_amount) || 0),
            0
        );

        return {
            totalPaidAmount: totalPaid,
            remainingAmount: Math.max(0, (selectedBill?.total || 0) - totalPaid)
        };
    }, [selectedPayment, selectedBill?.total]);

    useEffect(() => {
        if (id) {
            dispatch(getPBillById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        setCollectAmount(remainingAmount);
    }, [remainingAmount]);

    useEffect(() => {
        if (id) {
            dispatch(getPurchaseBillPaymentById(id))
                .unwrap()
                .catch((error) => {
                    console.error('Failed to fetch payment details:', error);
                });
        }
    }, [dispatch, id]);

    const refreshPaymentData = async () => {
        if (id) {
            await dispatch(getPurchaseBillPaymentById(id));
        }
    };

    const handleModalClose = () => {
        setShowCollectModal(false);
        refreshPaymentData();
    };

    const handleCollectData = () => {
        if (remainingAmount > 0) {
            setShowCollectModal(true);
        }
    };

    if (loading) {
        return (
          <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinner animation="border" color="primary" role="status">
            </Spinner>
          </Container>
        );
      }

    if (!selectedBill) {
        return <div>No data found</div>;
    }

    return (
        <Container>
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="my-3">
                    <div style={{ top: "186px", fontSize: "18px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem >Home</BreadcrumbItem>
                            <BreadcrumbItem><Link to="/admin/inventory/purchase-bill-list">Purchase Bill  List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Purchase Bill Details</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3">
                        <Row>
                            <Col sm={6} xs={12}>
                                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                    <span>Purchase Bill : </span>
                                    <span>{selectedBill.po_no}</span>
                                </h5>
                            </Col>
                            <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={print} className="me-2" /> Print
                                </Button>
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={sendMail} className="me-2" /> Send Email
                                </Button>
                                <Button
                  onClick={() =>
                    navigate(`/admin/inventory/PurchaseBillCreate/${selectedBill._id}`)
                  }
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: "#FAFAFA",
                    color: "black",
                    border: "none",
                  }}
                >
                  <Image src={editlogo} className="me-2" /> Edit
                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Company Info */}
                <Col sm={12} className="my-2">
                <Card className="p-3 mb-3 shadow-sm">
        <Row className="align-items-center">
          <Col xs={2}>
            <img src={Lockenelogo} alt="Logo" className="img-fluid" />
          </Col>
          <Col>
            <h5>{userName}</h5>
            <p className="mb-1">{userEmail} / {UserContactN}</p>
            <p className="mb-1">
              {UserAddress}
            </p>
            <strong>PAN: {UesrPAN}</strong>
          </Col>
          <Col xs={2} className="text-end">
            <span className="text-muted">PO:</span>
            <strong className="text-primary"> Draft</strong>
          </Col>
        </Row>
      </Card>
                </Col>

                {/* Vendor & Order Details */}
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            <Col sm={4}>
                                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>{selectedBill.vendor_id?.name}</h5>
                                <Row>
                                    <Col sm={6}>
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                        <p className="my-3">{selectedBill.vendor_id?.billingAddress}</p>
                                    </Col>
                                    <Col sm={6} className="border-end border-3">
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                        <p className="my-3">{selectedBill.vendor_id?.shippingAddress}</p>
                                    </Col>
                                </Row>
                            </Col>

                            <Col sm={8}>
                                <Row>
                                    <Col sm={6}>
                                        <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                        <p className="my-3">
                                            {
                                                selectedBill.delivery_type === "customer" ?<>
                                                 <span>Address:</span><span>{selectedBill.customer_id?.address}</span><br />
                                            <span>City:</span> {selectedBill.customer_id?.city}<br />
                                            <span>State:</span> {selectedBill.customer_id?.state}<br />
                                            <span>Country:</span> {selectedBill.customer_id?.country} <br />
                                                </> :
                                                <>
                                                <h4>Organization Address</h4>
                                                <span>{UserAddress}</span>
                                                </>

                                            }
                                            
                                            </p>
                                    </Col>

                                    <Col sm={6}>
                                        <span className="mb-3 float-end" style={{ fontSize: '16px', fontWeight: '500' }}>
                                            Order No: <b className="text-primary">{selectedBill.po_no}</b>
                                        </span>
                                        <p className="my-5 mx-2 border-start border-3 p-2">
                                            <p><span className="my-1 fw-bold">Expected Delivery:</span> {new Date(selectedBill.delivery_date).toLocaleDateString()}</p>
                                            <p><span className="my-1 fw-bold">Payment Terms:</span> {selectedBill.payment_terms}</p>
                                            <p><span className="my-1 fw-bold">Reference:</span> {selectedBill.reference}</p>
                                            <p><span className="my-1 fw-bold">Shipment Preference:</span> {selectedBill.shipment_preference}</p>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Items Table */}
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row>
                            <Col sm={12}>
                                <div className="table-responsive">
                                    <Table className="text-center align-middle">
                                        <thead className="text-start">
                                            <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                                                <th className="fw-bold">PRODUCT</th>
                                                <th className="fw-bold">QUANTITY</th>
                                                <th className="fw-bold">PRICE</th>
                                                <th className="fw-bold">TAX</th>
                                                <th className="fw-bold">TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-start">
                                            {selectedBill.items?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <b>{item.item_id?.name}</b><br />
                                                        HSN: {item.item_id?.hsn}
                                                    </td>
                                                    <td>
                                                        SKU: {item.item_id?._id}<br />
                                                        Qty: {item.quantity} Nos
                                                    </td>
                                                    <td>Price: ₹{item.price}</td>
                                                    <td>{item.tax?.tax_name} ({item.tax?.tax_rate}%)</td>
                                                    <td>Total: ₹{item.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-4 border-top border-3 p-2">
                            <Col sm={6} className="border-end border-3">
                                <p><b>Description:</b> {selectedBill.description}</p>
                            </Col>
                            <Col sm={6} className="text-end">
                                <Table className="text-end">
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold text-start">Subtotal:</td>
                                            <td>₹{selectedBill.subtotal}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold text-start">Discount:</td>
                                            <td>
                                                <span className="text-primary" style={{ cursor: "pointer" }}>
                                                    {selectedBill.discount_type === 'percentage' ? `${selectedBill.discount_value}%` : '₹' + selectedBill.discount_value}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold text-start">Total:</td>
                                            <td>₹{selectedBill.total}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold text-start">Adjustment:</td>
                                            <td>₹{selectedBill.adjustment_amount}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold text-start">Balance</td>
                                            <td>
                                                {remainingAmount <= 0 ? (
                                                    <span style={{fontWeight:"600"}} className="text-success">Amount Paid</span>
                                                ) : (
                                                    <Button
                                                        onClick={handleCollectData}
                                                        variant="outline-success"
                                                        disabled={remainingAmount <= 0}
                                                    >
                                                        Pay ₹{remainingAmount.toFixed(2)}
                                                    </Button>
                                                )}
                                                <CollectPayment
                                                    show={showCollectModal}
                                                    handleClose={handleModalClose}
                                                    maxAmount={remainingAmount}
                                                    invoiceId={id}
                                                    onSuccess={refreshPaymentData}
                                                />
                                            </td>
                                        </tr>


                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                
                {/* <Col sm={12} className="my-2">
                    <Card className=" p-3 shadow-sm">
                        <h5 className=" mb-3" style={{ fontSize:'20px' }}>Paid Payment Details</h5>
                        <div className="table-responsive">
                            <Table className="text-center align-middle">
                                <thead>
                                    <tr style={{ borderBottom: "2px solid #dee2e6",borderTop: "2px solid #dee2e6" }}>
                                        <th className="fw-bold">#</th>
                                        <th className="fw-bold">Date</th>
                                        <th className="fw-bold">Amount</th>
                                        <th className="fw-bold">Mode</th>
                                        <th className="fw-bold">Transaction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.payments?.map((payment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{new Date(payment.date).toLocaleDateString()}</td>
                                            <td>{payment.amount}</td>
                                            <td>{payment.mode}</td>
                                            <td>{payment.transaction}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col> */}

                {/* Payment Collection Details */}
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <h5 className="mb-3" style={{ fontSize: "20px" }}>
                            Payment Collection Details
                        </h5>
                        <div className="table-responsive">
                            {paymentLoading ? (
                                <div className="text-center p-4">
                                    Loading...
                                </div>
                            ) : (
                                <Table className="text-center align-middle">
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid #dee2e6", borderTop: "2px solid #dee2e6" }}>
                                            <th className="fw-bold">#</th>
                                            <th className="fw-bold">Deposit Date</th>
                                            <th className="fw-bold">Deposit Amount</th>
                                            <th className="fw-bold">Mode</th>
                                            <th className="fw-bold">Transaction ID</th>
                                            <th className="fw-bold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPayment?.length > 0 ? (
                                            <>
                                                {selectedPayment.map((payment, index) => (
                                                    <tr key={payment._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{new Date(payment.deposit_date).toLocaleDateString()}</td>
                                                        <td>₹ {payment.deposit_amount.toLocaleString()}</td>
                                                        <td>{payment.mode}</td>
                                                        <td>{payment.transaction_id || '-'}</td>
                                                        <td>{payment.description || '-'}</td>
                                                    </tr>
                                                ))}
                                                <tr style={{ backgroundColor: "#f8f9fa" }}>
                                                    <td colSpan="2" className="text-end fw-bold">Total Paid:</td>
                                                    <td className="fw-bold">₹ {totalPaidAmount.toLocaleString()}</td>
                                                    <td colSpan="3"></td>
                                                </tr>
                                                {remainingAmount > 0 && (
                                                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                                                        <td colSpan="2" className="text-end fw-bold">Remaining Amount:</td>
                                                        <td className="fw-bold text-danger">₹ {remainingAmount.toLocaleString()}</td>
                                                        <td colSpan="3"></td>
                                                    </tr>
                                                )}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-3">No payment records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
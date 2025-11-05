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
import { getPurchaseBillPaymentById } from "../../../../store/AdminSlice/Inventory/CollectPurchaseBill";
import { getStyxData, sendMailToVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { Breadcrumbs } from "../../../../components/common/Breadcrumbs/Breadcrumbs";

export const PurchaseBillDetailsAdmin = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { selectedBill, loading } = useSelector((state) => state.pBill);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [collectAmount, setCollectAmount] = useState(0);
    const [showCollectModal, setShowCollectModal] = useState(false);
    const { selectedPayment, loading: paymentLoading, error: paymentError } = useSelector(
        (state) => state.purchaseBill
    );
    const { styxData } = useSelector((state) => state.purchaseOrder);

    const cafeId = user?._id;

    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

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
            dispatch(getStyxData());
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

    const handleSendMail = async () => {
        await dispatch(sendMailToVendor(selectedBill))
    }

    const handleModalClose = () => {
        setShowCollectModal(false);
        refreshPaymentData();
    };

    const handleCollectData = () => {
        if (remainingAmount > 0) {
            setShowCollectModal(true);
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById("printableArea");
        const originalContents = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open("", "_blank");

        // Add necessary styles for printing
        printWindow.document.write(`
            <html>
                <head>
                    <title>Purchase Bill: ${selectedBill.po_no}</title>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .print-header { text-align: center; margin-bottom: 20px; }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container mt-4">
                        <div class="print-header">
                            <h3>Purchase Bill: ${selectedBill.po_no}</h3>
                        </div>
                        ${printContent.innerHTML}
                    </div>
                </body>
                   <div class="row mt-4 no-print">
                            <div class="col-12 text-center">
                                <button onclick="window.print()" class="btn btn-primary">Print</button>
                                <button onclick="window.close()" class="btn btn-secondary ms-2">Close</button>
                            </div>
                        </div>
            </html>
        `);

        printWindow.document.close();
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
        <Container fluid>
            <Breadcrumbs
                items={[
                    { label: "Home", path: "/admin/dashboard" },
                    { label: "Purchase Bill List", path: "/admin/inventory/purchase-bill-list" },
                    { label: "Details", active: true }
                ]}
            />
            <Row>
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
                                <Button
                                    className="d-flex align-items-center"
                                    style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}
                                    onClick={handlePrint}
                                    title="Print > More Settings > Page Size > Select A3"
                                >
                                    <Image src={print} className="me-2" /> Print
                                </Button>
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }} onClick={handleSendMail}>
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

                {/* Printable area starts here */}
                <div id="printableArea">
                    {/* Company Info */}
                    {/* Vendor & Order Details */}
                    <Col sm={12} className="my-2">
                        <Card className="p-3 shadow-sm">
                            <Row>
                                <Col sm={4}>
                                    <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>
                                        {selectedBill.vendor_id ? selectedBill.vendor_id.name : styxData?.name}
                                    </h5>
                                    <Row>
                                        {selectedBill?.vendor_id && <Col sm={6} >
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                            <p className="my-1">{selectedBill?.vendor_id?.billingAddress}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.city1}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.state1}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.pincode1}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.country1}</p>
                                        </Col>}

                                        {!selectedBill?.vendor_id && <Col sm={6} >
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                                            <p className="my-1">{styxData?.billingAddress}</p>
                                            <p className="my-1">{styxData?.city1}</p>
                                            <p className="my-1">{styxData?.state1}</p>
                                            <p className="my-1">{styxData?.pincode1}</p>
                                            <p className="my-1">{styxData?.country1}</p>
                                        </Col>}

                                        {selectedBill?.vendor_id && <Col sm={6} className="border-end border-3" >
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                            <p className="my-1">{selectedBill?.vendor_id?.shippingAddress}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.city2}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.state2}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.pincode2}</p>
                                            <p className="my-1">{selectedBill?.vendor_id?.country2}</p>
                                        </Col>}

                                        {!selectedBill?.vendor_id && <Col sm={6} className="border-end border-3" >
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                                            <p className="my-1">{styxData?.shippingAddress}</p>
                                            <p className="my-1">{styxData?.city2}</p>
                                            <p className="my-1">{styxData?.state2}</p>
                                            <p className="my-1">{styxData?.pincode2}</p>
                                            <p className="my-1">{styxData?.country2}</p>
                                        </Col>}
                                    </Row>
                                </Col>

                                <Col sm={8}>
                                    <Row>
                                        <Col sm={6}>
                                            <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                            <p className="my-3">
                                                {selectedBill?.delivery_type === 'organization' ?
                                                    <p className="my-3">{UserAddress}
                                                        <span style={{ fontSize: '16px' }}>{userName}</span><br />
                                                        <span>{userEmail} / {UserContactN}</span>
                                                        <br />
                                                        <span>{UserAddress}</span>
                                                        <br />
                                                        <span>PAN:</span> {UesrPAN}
                                                    </p>
                                                    :
                                                    <p className="my-3">
                                                        <span style={{ fontSize: '16px' }}>{selectedBill?.customer_id?.name}</span><br />
                                                        <span>{selectedBill?.customer_id?.address} / {selectedBill?.customer_id?.contact_no}</span>
                                                    </p>
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
                                                            SKU: {item.item_id?.sku}<br />
                                                            Qty: {item.quantity} Nos
                                                        </td>
                                                        <td>Price: ₹{item.price}</td>
                                                        <td>{item.tax?.tax_name} ({item.tax?.tax_rate || 0}%)</td>
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
                                                        <span style={{ fontWeight: "600" }} className="text-success">Amount Paid</span>
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
                </div>
                {/* Printable area ends here */}
            </Row>
        </Container>
    );
};
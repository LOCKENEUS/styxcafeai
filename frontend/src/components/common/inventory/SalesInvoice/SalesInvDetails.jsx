import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSOById, deleteSO } from "../../../../store/AdminSlice/Inventory/SoSlice";
import { addSOInvoice } from "../../../../store/AdminSlice/Inventory/SoInvoiceSlice";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Table, Spinner, Modal, Badge } from "react-bootstrap";
import deleteplogo from "/assets/inventory/Vector (1).png";
import receive from "/assets/inventory/solar_card-send-linear.png";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import companylog from "/assets/inventory/companylogo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendMailToVendor } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { collectInvoicePayment, getSalesInvoiceDetails } from "../../../../store/slices/Inventory/invoiceSlice";
import CollectBillPayment from "../modal/CollectBillPayment";
import CollectInvoicePayment from "../modal/CollectInvoicePayment";
import { formatDateAndTime } from "../../../utils/utils";

export const SalesInvDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.saSalesInvoice);
    const { selectedSalesInvoice } = useSelector((state) => state.saSalesInvoice);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name || "";
    const userEmail = user?.email || "";
    const UserContactN = user?.contact_no || "";
    const UserAddress = user?.address || "";
    const UesrPAN = user?.panNo || "";

    useEffect(() => {
        if (id) {
            dispatch(getSalesInvoiceDetails(id));
        }
    }, [dispatch, id]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // Calculate payment status
    const calculatePaymentStatus = () => {
        if (!selectedSalesInvoice || !selectedSalesInvoice.total) {
            return { collected: 0, balance: 0, isFullyPaid: false };
        }

        const totalAmount = parseFloat(selectedSalesInvoice.total) || 0;
        const adjustmentAmount = parseFloat(selectedSalesInvoice.adjustment_amount) || 0;
        const finalTotal = totalAmount + adjustmentAmount;

        // Calculate total collected from payments
        const totalCollected = selectedSalesInvoice.payments?.reduce((sum, payment) => {
            return sum + (parseFloat(payment.deposit_amount) || 0);
        }, 0) || 0;

        const balance = finalTotal - totalCollected;
        const isFullyPaid = balance <= 0;

        return {
            collected: totalCollected,
            balance: Math.max(0, balance),
            finalTotal,
            isFullyPaid
        };
    };

    const paymentStatus = calculatePaymentStatus();

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-GB");
        } catch {
            return "N/A";
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        const printContent = document.getElementById('printableArea');
        if (!printContent) {
            toast.error("Unable to print. Content not found.");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Unable to open print window. Please check your popup settings.");
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Sales Invoice: ${selectedSalesInvoice?.so_no || 'N/A'}</title>
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
                            <h3>Sales Invoice: ${selectedSalesInvoice?.po_no || 'N/A'}</h3>
                        </div>
                        ${printContent.innerHTML}
                        <div class="row mt-4 no-print">
                            <div class="col-12 text-center">
                                <button onclick="window.print()" class="btn btn-primary">Print</button>
                                <button onclick="window.close()" class="btn btn-secondary ms-2">Close</button>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
    };

    // Handle delete confirmation
    const handleDelete = () => {
        dispatch(deleteSO(id)).then((result) => {
            if (!result.error) {
                navigate('/admin/Inventory/SaleOrderList');
            }
            setShowDeleteModal(false);
        });
    };

    const handleCreateInvoice = () => {
        if (!selectedSalesInvoice) {
            toast.error("Invoice data not loaded");
            return;
        }

        const invoiceData = {
            cafe: selectedSalesInvoice.cafe?._id,
            customer_id: selectedSalesInvoice.customer_id?._id,
            refer_id: selectedSalesInvoice._id,
            date: new Date().toISOString(),
            shipment_date: "",
            payment_terms: selectedSalesInvoice.payment_terms || "",
            reference: selectedSalesInvoice.reference || "",
            delivery_preference: "",
            sales_person: selectedSalesInvoice.sales_person || "",
            description: selectedSalesInvoice.description || "",
            internal_team_notes: selectedSalesInvoice.internal_team_notes || "",
            discount_value: selectedSalesInvoice.discount_value || 0,
            discount_type: selectedSalesInvoice.discount_type || "percentage",
            tax: selectedSalesInvoice.tax || [],
            total: selectedSalesInvoice.total || 0,
            adjustment_note: selectedSalesInvoice.adjustment_note || "",
            adjustment_amount: selectedSalesInvoice.adjustment_amount || 0,
            type: "SI",
            items: selectedSalesInvoice.items?.map(item => ({
                id: item.item_id?._id,
                qty: item.quantity || 0,
                hsn: item.item_id?.hsn || "",
                sku: item.item_id?.sku || "",
                name: item.item_id?.name || "",
                total: item.total || 0,
                discount_value: item.discount_value || 0,
                discount_type: item.discount_type || "percentage",
            })) || [],
        };

        dispatch(addSOInvoice(invoiceData)).then((result) => {
            if (!result.error) {
                toast.success("Invoice created successfully!");
            }
        });
    };

    const handleEdit = () => {
        navigate(`/Inventory/SaleInvoice/Edit/${id}`);
    };

    const handleSendMail = () => {
        if (!selectedSalesInvoice?.customer_id?.email) {
            toast.error("Customer email not found");
            return;
        }

        dispatch(sendMailToVendor({
            invoiceId: id,
            recipientEmail: selectedSalesInvoice.customer_id.email
        })).then((result) => {
            if (!result.error) {
                toast.success("Email sent successfully!");
            }
        });
    };

    const handleProductClick = (groupId) => {
        navigate("/Inventory/itemDetails", { state: { groupId } });
    };

    const handleInvoicePayment = async () => {
        if (paymentStatus.isFullyPaid) {
            toast.info("This invoice is already fully paid");
            return;
        }
        setShowModal(true);
    };

    const handleSuccess = async () => {
        // Refresh the invoice details after payment
        await dispatch(getSalesInvoiceDetails(id));
        handleClose();
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Loading invoice details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Card className="text-center border-danger">
                    <Card.Body>
                        <h4 className="text-danger">Error Loading Invoice</h4>
                        <p>{error}</p>
                        <Button variant="primary" onClick={() => navigate('/Inventory/SaleInvoice/List')}>
                            Back to List
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (!selectedSalesInvoice || !selectedSalesInvoice._id) {
        return (
            <Container className="mt-5">
                <Card className="text-center">
                    <Card.Body>
                        <h4>Invoice Not Found</h4>
                        <p>The requested sales invoice could not be found.</p>
                        <Button variant="primary" onClick={() => navigate('/Inventory/SaleInvoice/List')}>
                            Back to List
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row>
                <Breadcrumb className="py-3">
                    <BreadcrumbItem linkAs={Link} linkProps={{ to: "/admin/dashboard" }}>
                        Home
                    </BreadcrumbItem>
                    <BreadcrumbItem linkAs={Link} linkProps={{ to: "/Inventory/SaleInvoice/List" }}>
                        Sales Invoice
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Invoice Details</BreadcrumbItem>
                </Breadcrumb>

                <Col sm={12}>
                    <div id="printableArea">
                        <Card className="border-0 rounded shadow-sm">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center p-3">
                                <div>
                                    <h5 className="mb-0">
                                        Sales Invoice: {selectedSalesInvoice.so_no || 'N/A'}
                                    </h5>
                                    {paymentStatus.isFullyPaid && (
                                        <Badge bg="success" className="mt-2">
                                            ✓ Fully Paid
                                        </Badge>
                                    )}
                                    {!paymentStatus.isFullyPaid && paymentStatus.collected > 0 && (
                                        <Badge bg="warning" text="dark" className="mt-2">
                                            Partially Paid
                                        </Badge>
                                    )}
                                    {paymentStatus.collected === 0 && (
                                        <Badge bg="danger" className="mt-2">
                                            Unpaid
                                        </Badge>
                                    )}
                                </div>
                                <div className="d-flex gap-2 flex-wrap no-print">
                                    <Button variant="link" size="sm" onClick={handleEdit}>
                                        <Image src={editlogo} alt="Edit" width="20" /> Edit
                                    </Button>
                                    <Button variant="link" size="sm" onClick={handlePrint}>
                                        <Image src={print} alt="Print" width="20" /> Print
                                    </Button>
                                    <Button variant="link" size="sm" onClick={handleSendMail}>
                                        <Image src={sendMail} alt="Send Mail" width="20" /> Send Mail
                                    </Button>
                                    <Button variant="link" size="sm" onClick={() => setShowDeleteModal(true)} className="text-danger">
                                        <Image src={deleteplogo} alt="Delete" width="20" /> Delete
                                    </Button>
                                </div>
                            </Card.Header>

                            <Card.Body className="p-4">
                                {/* Company and Customer Details */}
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Image src={companylog} alt="Company Logo" width="150" className="mb-3" />
                                            <h6 className="fw-bold mb-2">From</h6>
                                            <div className="text-muted">
                                                <div>{userName}</div>
                                                <div>{UserAddress}</div>
                                                <div>Email: {userEmail}</div>
                                                <div>Contact: {UserContactN}</div>
                                                {UesrPAN && <div>PAN: {UesrPAN}</div>}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <h6 className="fw-bold mb-2">Bill To</h6>
                                            <div className="text-muted">
                                                <div className="fw-semibold">{selectedSalesInvoice.customer_id?.name || 'N/A'}</div>
                                                <div>{selectedSalesInvoice.customer_id?.company || ''}</div>
                                                <div>{selectedSalesInvoice.customer_id?.billing?.address || 'N/A'}</div>
                                                <div>Email: {selectedSalesInvoice.customer_id?.email || 'N/A'}</div>
                                                <div>Contact: {selectedSalesInvoice.customer_id?.contact || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Invoice Details */}
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <div className="d-flex justify-content-between py-1">
                                            <div className="text-muted">Invoice No:</div>
                                            <div className="fw-medium">{selectedSalesInvoice.so_no || 'N/A'}</div>
                                        </div>
                                        <div className="d-flex justify-content-between py-1">
                                            <div className="text-muted">Order Date:</div>
                                            <div className="fw-medium">{formatDate(selectedSalesInvoice.delivery_date)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between py-1">
                                            <div className="text-muted">Payment Terms:</div>
                                            <div className="fw-medium">{selectedSalesInvoice.payment_terms || "Cash"}</div>
                                        </div>
                                        <div className="d-flex justify-content-between py-1">
                                            <div className="text-muted">Reference:</div>
                                            <div className="fw-medium">{selectedSalesInvoice.reference || "N/A"}</div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="d-flex justify-content-between py-1">
                                            <div className="text-muted">Sales Person:</div>
                                            <div className="fw-medium">{selectedSalesInvoice.sales_person || 'N/A'}</div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Items Table */}
                                <Row className="mb-4">
                                    <Col sm={12}>
                                        <div className="p-2 bg-light">Item Details</div>
                                        <Table className="text-center align-middle mb-0" bordered hover>
                                            <thead>
                                                <tr>
                                                    <th className="fw-bold">#</th>
                                                    <th className="fw-bold">Item Name</th>
                                                    <th className="fw-bold">HSN</th>
                                                    <th className="fw-bold">SKU</th>
                                                    <th className="fw-bold">Quantity</th>
                                                    <th className="fw-bold">Rate</th>
                                                    <th className="fw-bold">Discount</th>
                                                    <th className="fw-bold">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedSalesInvoice.items && selectedSalesInvoice.items.length > 0 ? (
                                                    selectedSalesInvoice.items.map((item, index) => (
                                                        <tr key={item._id || index}>
                                                            <td>{index + 1}</td>
                                                            <td className="text-start">
                                                                <div 
                                                                    className="text-primary cursor-pointer"
                                                                    onClick={() => handleProductClick(item.item_id?._id)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {item.item_id?.name || 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td>{item.item_id?.hsn || 'N/A'}</td>
                                                            <td>{item.item_id?.sku || 'N/A'}</td>
                                                            <td>{item.quantity || 0}</td>
                                                            <td>₹{item.rate || 0}</td>
                                                            <td>
                                                                {item.discount_value || 0}
                                                                {item.discount_type === 'percentage' ? '%' : '₹'}
                                                            </td>
                                                            <td>₹{item.total || 0}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="text-center text-muted">
                                                            No items found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>

                                {/* Summary Section */}
                                <Row className="mb-4">
                                    <Col md={6}>
                                        {selectedSalesInvoice.description && (
                                            <div className="mb-3">
                                                <h6 className="fw-bold">Description</h6>
                                                <p className="text-muted">{selectedSalesInvoice.description}</p>
                                            </div>
                                        )}
                                        {selectedSalesInvoice.internal_team_notes && (
                                            <div>
                                                <h6 className="fw-bold">Internal Notes</h6>
                                                <p className="text-muted">{selectedSalesInvoice.internal_team_notes}</p>
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        <div className="border rounded p-3">
                                            <div className="d-flex justify-content-between py-2 border-bottom">
                                                <span className="fw-semibold">Subtotal:</span>
                                                <span>₹{selectedSalesInvoice.subtotal || 0}</span>
                                            </div>
                                            {selectedSalesInvoice.discount_value > 0 && (
                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="fw-semibold">Discount:</span>
                                                    <span>
                                                        {selectedSalesInvoice.discount_value}
                                                        {selectedSalesInvoice.discount_type === 'percentage' ? '%' : '₹'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between py-2 border-bottom">
                                                <span className="fw-semibold">Tax:</span>
                                                <span>
                                                    {selectedSalesInvoice.tax && selectedSalesInvoice.tax.length > 0 ?
                                                        selectedSalesInvoice.tax.map((tax, index) => (
                                                            <div key={index}>
                                                                {tax.tax_name} ({tax.tax_rate}%)
                                                            </div>
                                                        )) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between py-2 border-bottom">
                                                <span className="fw-bold">Total:</span>
                                                <span className="fw-bold">₹{selectedSalesInvoice.total || 0}</span>
                                            </div>
                                            {selectedSalesInvoice.adjustment_amount !== 0 && (
                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="fw-semibold">{selectedSalesInvoice.adjustment_note || 'Adjustment'}:</span>
                                                    <span>₹{selectedSalesInvoice.adjustment_amount || 0}</span>
                                                </div>
                                            )}
                                            {paymentStatus.finalTotal !== selectedSalesInvoice.total && (
                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="fw-bold">Final Total:</span>
                                                    <span className="fw-bold">₹{paymentStatus.finalTotal}</span>
                                                </div>
                                            )}
                                            {paymentStatus.collected > 0 && (
                                                <div className="d-flex justify-content-between py-2 border-bottom text-success">
                                                    <span className="fw-semibold">Amount Collected:</span>
                                                    <span className="fw-bold">₹{paymentStatus.collected.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between py-2">
                                                <span className="fw-bold">Balance:</span>
                                                <span className="fw-bold">
                                                    {paymentStatus.isFullyPaid ? (
                                                        <Badge bg="success">Fully Paid ✓</Badge>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            variant="warning" 
                                                            onClick={handleInvoicePayment}
                                                            className="no-print"
                                                        >
                                                            Collect ₹{paymentStatus.balance.toFixed(2)}
                                                        </Button>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Payment Collection Details */}
                                <Row className="mb-4">
                                    <Col sm={12}>
                                        <div className="p-2 bg-light">Payment Collection Details</div>
                                        <Table className="text-center align-middle mb-0" bordered hover>
                                            <thead>
                                                <tr>
                                                    <th className="fw-bold">#</th>
                                                    <th className="fw-bold">Date</th>
                                                    <th className="fw-bold">Amount</th>
                                                    <th className="fw-bold">Mode</th>
                                                    <th className="fw-bold">Transaction ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedSalesInvoice.payments && selectedSalesInvoice.payments.length > 0 ? (
                                                    selectedSalesInvoice.payments.map((payment, index) => (
                                                        <tr key={payment._id || index}>
                                                            <td>{index + 1}</td>
                                                            <td>{formatDate(payment.deposit_date)}</td>
                                                            <td className="text-success fw-semibold">₹{payment.deposit_amount || 0}</td>
                                                            <td>{payment.mode || 'N/A'}</td>
                                                            <td>{payment.transaction_id || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center text-muted">
                                                            No payments collected yet
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this sales invoice? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Row>
            <CollectInvoicePayment 
                show={showModal} 
                handleClose={handleClose} 
                maxAmount={paymentStatus.balance} 
                invoiceId={selectedSalesInvoice._id} 
                onSuccess={handleSuccess} 
            />
        </Container>
    );
};

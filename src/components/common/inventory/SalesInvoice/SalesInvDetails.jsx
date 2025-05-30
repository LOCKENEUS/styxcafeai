import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSOById, deleteSO } from "../../../../store/AdminSlice/Inventory/SoSlice";
import { addSOInvoice } from "../../../../store/AdminSlice/Inventory/SoInvoiceSlice";
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Image, Row, Table, Spinner, Modal } from "react-bootstrap";
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

    const user = JSON.parse(sessionStorage.getItem("user"));
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    useEffect(() => {
        if (id) {
            dispatch(getSalesInvoiceDetails(id));
        }
    }, [dispatch, id]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // Handle print functionality
    const handlePrint = () => {
        const printContent = document.getElementById('printableArea');
        const originalContents = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        // Add necessary styles for printing
        printWindow.document.write(`
            <html>
                <head>
                    <title>Sales Invoice: ${selectedSalesInvoice.so_no}</title>
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
                            <h3>Sales Invoice: ${selectedSalesInvoice.po_no}</h3>
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
        // Prepare the invoice data from selectedSalesInvoice
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
            subtotal: selectedSalesInvoice.subtotal || 0,
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
                price: item.price || 0,
                tax: item.tax?._id || null,
                tax_amt: item.tax_amt || 0,
                total: item.total || 0
            })) || []
        };

        // Add validation before dispatch
        if (!invoiceData.cafe || !invoiceData.customer_id) {
            toast.error("Missing required data: Cafe or Customer information");
            return;
        }

        dispatch(addSOInvoice(invoiceData))
            .then(() => {
                navigate(`/admin/Inventory/SaleInvoiceDetails/${id}`);
            })
            .catch((error) => {
                console.error("Error creating invoice:", error);
            });
    };

    const handleSendMail = async () => {
        await dispatch(sendMailToVendor(selectedSalesInvoice))
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                <h4 className="text-danger">Error: {error}</h4>
            </div>
        );
    }

    if (!selectedSalesInvoice) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                <h4>No sales invoice found</h4>
            </div>
        );
    }

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleProductClick = (groupId) => {
        navigate("/Inventory/itemDetails", { state: { groupId } });
    };

    const handleInvoicePayment = async () => {
        // await dispatch(collectInvoicePayment(id));
        setShowModal(true);
    }

    const handleSuccess = async () => {
        // await dispatch(getSalesInvoiceById(id));
    }

    return (
        <Container >
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="mx-2 my-3">
                    <div style={{ top: "186px", fontSize: "12px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link to="/">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link to="/Inventory/dashboard">Inventory</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link to="/Inventory/SaleInvoice/List">Sales Invoice List</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>SalesInvoiceDetails</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3">
                        <Row>
                            <Col sm={6} xs={12}>
                                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                    <span>Sales Invoice: </span>
                                    <span>{selectedSalesInvoice.po_no}</span>
                                </h5>
                            </Col>
                            <Col sm={6} xs={12} className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center">
                                <Button
                                    className="d-flex align-items-center"
                                    style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}
                                    onClick={handlePrint}
                                >
                                    <Image src={print} className="me-2" /> Print
                                </Button>
                                <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }} onClick={handleSendMail}>
                                    <Image src={sendMail} className="me-2" /> Send Email
                                </Button>
                                <Button
                                    onClick={() => navigate(`/Inventory/SaleInvoice/Edit/${id}`)}
                                    className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={editlogo} className="me-2" /> Edit
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Printable area starts here */}
                <div id="printableArea">
                    <Col sm={12} className="my-2">
                        <Card className="p-3 mb-3 shadow-sm">
                            <Row className="align-items-center">
                                <Col xs={2}>
                                    <img
                                        src={companylog}
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
                                    <span className="text-muted">PO:</span>
                                    <strong className="text-primary"> Draft</strong>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Customer & Order Details */}
                    <Col sm={12} className="my-2">
                        <Card className="p-3 shadow-sm">
                            <Row>
                                {/* Customer Info */}
                                <Col sm={6}>
                                    <div className="mb-4">
                                        <h5 className="text-primary" style={{ fontSize: '22px', fontWeight: '600' }}>
                                            {selectedSalesInvoice.customer_id ? selectedSalesInvoice.customer_id.name : ""}
                                        </h5>
                                    </div>
                                    <Row>
                                        <Col sm={8}>
                                            <div className="mb-4">
                                                <h6 className="text-dark mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                                                    Billing Address
                                                </h6>
                                                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                    {selectedSalesInvoice.customer_id ? selectedSalesInvoice.customer_id.address : ""},<br />
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm={6}>
                                    {/* <div className="text-end mb-4">
                                        <h6 className="text-dark" style={{ fontSize: '16px' }}>
                                            Order No: <span className="text-primary fw-bold">{selectedSalesInvoice.so_no}</span>
                                        </h6>
                                    </div> */}

                                    {/* <div className="order-details ms-auto" style={{ maxWidth: '400px' }}>
                                        <table className="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted" style={{ width: '50%' }}>Sales Invoice No:</td>
                                                    <td className="fw-medium">{selectedSalesInvoice.po_no}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Order Date:</td>
                                                    <td className="fw-medium">{formatDate(selectedSalesInvoice.delivery_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Payment Terms:</td>
                                                    <td className="fw-medium">{selectedSalesInvoice.payment_terms || "Cash"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Reference:</td>
                                                    <td className="fw-medium">{selectedSalesInvoice.reference || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Sales Person:</td>
                                                    <td className="fw-medium">{selectedSalesInvoice.sales_person || "N/A"}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div> */}

                                    <div className="order-details ms-auto" style={{ maxWidth: '400px' }}>
                                        <div className="d-flex justify-content-between py-1">
                                            <div className="text-muted">Sales Invoice No:</div>
                                            <div className="fw-medium">{selectedSalesInvoice.po_no}</div>
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
                                        <div className="d-flex justify-content-between py-1">
                                            <div className="text-muted">Sales Person:</div>
                                            <div className="fw-medium">{selectedSalesInvoice.sales_person || "N/A"}</div>
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
                                                    <th className="fw-bold">PRODUCT</th>
                                                    <th className="fw-bold">QUANTITY</th>
                                                    <th className="fw-bold">PRICE</th>
                                                    <th className="fw-bold">TAX</th>
                                                    <th className="fw-bold">TOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-start">
                                                {selectedSalesInvoice.items && selectedSalesInvoice.items.map((item, index) => (
                                                    <tr key={item._id || index}>
                                                        <td>
                                                            <b className="text-primary" onClick={() => handleProductClick(item.item_id)}>{item?.item_id?.name}</b>
                                                            <br />
                                                            HSN : {item.item_id ? item.item_id.hsn : "N/A"}
                                                        </td>
                                                        <td>
                                                            SKU : {item.item_id ? item.item_id.sku : "N/A"} <br />
                                                            Qty : {item.quantity} Nos
                                                        </td>
                                                        <td>Price : ₹{item.price}</td>
                                                        <td>{item?.tax?.tax_rate}%</td>
                                                        <td>Total : ₹{item.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-4 border-top border-3 p-2">
                                <Col sm={6} className="border-end border-3">
                                    <p>
                                        <b>Description:</b> {selectedSalesInvoice.description || "N/A"}
                                    </p>
                                </Col>
                                <Col sm={6} className="text-end">
                                    <p className="border-bottom border-3 p-2">
                                        <b>Subtotal:</b> ₹{selectedSalesInvoice.subtotal}
                                    </p>
                                    <p className="border-bottom border-3 p-2">
                                        <b>Discount:</b>{" "}
                                        <span className="text-primary" style={{ cursor: "pointer" }}>
                                            {selectedSalesInvoice.discount_value}%
                                        </span>{" "}
                                        ₹{(selectedSalesInvoice.subtotal * selectedSalesInvoice.discount_value / 100).toFixed(2)}
                                    </p>
                                    <p className="border-bottom border-3 p-2">
                                        <b>Tax:</b> {selectedSalesInvoice.tax && selectedSalesInvoice.tax.length > 0 ?
                                            selectedSalesInvoice.tax.map((tax, index) => (
                                                <span key={index}>
                                                    {tax.tax_name} ({tax.tax_rate}%)
                                                    {index < selectedSalesInvoice.tax.length - 1 ? ', ' : ''}
                                                </span>
                                            )) : 'N/A'}
                                    </p>
                                    <p className="border-bottom border-3 p-2">
                                        <b>Total:</b> ₹{selectedSalesInvoice.total}
                                    </p>
                                    {selectedSalesInvoice.adjustment_amount > 0 && <p className="border-bottom border-3 p-2">
                                        <b>{selectedSalesInvoice.adjustment_note}:</b> ₹{selectedSalesInvoice.adjustment_amount}
                                    </p>}
                                    <p className="border-bottom border-3 p-2">
                                        <b>Balance:</b> <Button size="sm" variant="secondary" onClick={() => handleInvoicePayment()}>Collect ₹ {selectedSalesInvoice.total}</Button>
                                    </p>
                                </Col>
                            </Row>

                        {/* Packages */}
                            <Row>
                                <Col sm={12}>
                                    <div className="p-2" style={{ backgroundColor: "#dee2e6" }}>Package Details</div>
                                    <Table className="text-center align-middle">
                                        <thead className="text-start" >
                                            <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                                                <th className="fw-bold">#</th>
                                                <th className="fw-bold">Package No</th>
                                                <th className="fw-bold">Packing Date</th>
                                                <th className="fw-bold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-start">
                                            {selectedSalesInvoice?.packages?.length > 0 && selectedSalesInvoice.packages.map((pkg, index) => (
                                                <tr key={pkg._id || index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        {pkg?.po_no}
                                                    </td>
                                                    <td>{formatDateAndTime(pkg?.delivery_date)}</td>
                                                    <td>{pkg?.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                        {/* Shipments */}

                            <Row>
                                <Col sm={12}>
                                    <div className="p-2" style={{ backgroundColor: "#dee2e6" }}>Shipment Details</div>
                                    <Table className="text-center align-middle">
                                        <thead className="text-start" >
                                            <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                                                <th className="fw-bold">#</th>
                                                <th className="fw-bold">Shipping No</th>
                                                <th className="fw-bold">Shipping Date</th>
                                                <th className="fw-bold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-start">
                                            {selectedSalesInvoice?.shipments?.length > 0 && selectedSalesInvoice.shipments.map((shipment, index) => (
                                                <tr key={shipment._id || index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        {shipment?.po_no}
                                                    </td>
                                                    <td>{formatDateAndTime(shipment?.delivery_date)}</td>
                                                    <td>{shipment?.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <div className="p-2" style={{ backgroundColor: "#dee2e6" }}>Payment Collection Details</div>
                                    <Table className="text-center align-middle">
                                        <thead className="text-start" >
                                            <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                                                <th className="fw-bold">#</th>
                                                <th className="fw-bold">Date</th>
                                                <th className="fw-bold">Amount</th>
                                                <th className="fw-bold">Mode</th>
                                                <th className="fw-bold">Transaction</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-start">
                                            {selectedSalesInvoice.payments && selectedSalesInvoice.payments.map((payment, index) => (
                                                <tr key={payment._id || index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        {new Date(payment.deposit_date).toLocaleDateString("en-GB")}
                                                    </td>
                                                    <td>{payment?.deposit_amount}</td>
                                                    <td>{payment?.mode}</td>
                                                    <td>{payment.transaction_id}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col sm={12} className="my-2">
                        <Card className="p-3 shadow-sm">
                            <h5 className="mb-3" style={{ fontSize: '20px' }}>Terms and Condition </h5>
                            <div className="table-responsive">
                                <b>{selectedSalesInvoice.internal_team_notes || "Terms and Condition not applied"}</b>
                            </div>
                        </Card>
                    </Col>
                </div>
                {/* Printable area ends here */}

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
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Row>
            <CollectInvoicePayment show={showModal} handleClose={handleClose} maxAmount={selectedSalesInvoice.total} invoiceId={selectedSalesInvoice._id} onSuccess={handleSuccess} />
        </Container>
    )
};
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteSO } from "../../../../store/AdminSlice/Inventory/SoSlice";
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
import { getsalesOrderById } from "../../../../store/slices/Inventory/soSlice";
import { createSalesInvoice } from "../../../../store/slices/Inventory/invoiceSlice";

export const SoDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.saSalesOrder);
    const selectedSO = useSelector((state) => state.saSalesOrder.selectedsalesOrder);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    useEffect(() => {
        if (id) {
            dispatch(getsalesOrderById(id));
        }
    }, [dispatch, id]);

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
                    <title>Sales Order: ${selectedSO.so_no}</title>
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
                            <h3>Sales Order: ${selectedSO.po_no}</h3>
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

    const handleCreateInvoice = async () => {

        const submitData = new FormData();
        // Add basic form fields
        submitData.append('customer_id', selectedSO?.customer_id?._id || '');
        submitData.append('date', selectedSO.delivery_date);
        submitData.append('shipment_date', selectedSO.delivery_date);
        submitData.append('payment_terms', selectedSO.payment_terms || '');
        submitData.append('reference', selectedSO.reference || '');
        submitData.append('delivery_preference', selectedSO.delivery_preference || '');
        submitData.append('sales_person', selectedSO.sales_person || '');
        submitData.append('description', selectedSO.description || '');
        submitData.append('internal_team_notes', selectedSO.internal_team_notes || '');

        // Add financial details
        submitData.append('subtotal', selectedSO.subtotal || 0);
        submitData.append('discount_value', selectedSO.discount || 0);
        submitData.append('discount_type', selectedSO.discount_type);
        submitData.append('refer_id', selectedSO._id || 0);

        // Format tax data - just send array of tax IDs
        submitData.append('tax', JSON.stringify(selectedSO.tax));
        submitData.append('total', selectedSO.total || 0);
        submitData.append('adjustment_note', selectedSO.adjustment_note || "");
        submitData.append('adjustment_amount', selectedSO.adjustment_amount || 0);
        submitData.append('type', 'SINV');

        // Format items data - updated to send tax ID
        const formattedItems = selectedSO.items.map(product => ({
            id: product.item_id,
            qty: product.quantity,
            hsn: product.hsn || '',
            price: product.price,
            tax: product.tax || '', // Send the tax ID instead of tax rate
            tax_amt: product.tax_amt || 0,
            total: product.total
        }));
        submitData.append('items', JSON.stringify(formattedItems));

        dispatch(createSalesInvoice(submitData))
            .then(() => {
                navigate(`/Inventory/SaleInvoice/View/${id}`);
            })
            .catch((error) => {
                console.error("Error creating invoice:", error);
            });
    };

    const handleSendMail = async () => {
        await dispatch(sendMailToVendor(selectedSO))
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

    if (!selectedSO) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                <h4>No sales order found</h4>
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

    return (
        <Container >
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="mx-2 mt-3">
                    <div style={{ top: "186px", fontSize: "16px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link to="/superadmin/dashboard">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link to="/Inventory/dashboard">Inventory</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link to="/Inventory/SaleOrder">Sales Order List</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>SaleOrderDetails</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col sm={12} className="mt-2">
                    <Card className="p-3 mb-2 shadow-sm">
                        <Row>
                            <Col sm={6} xs={12}>
                                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                                    <span>Sales Order: </span>
                                    <span>{selectedSO.po_no}</span>
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
                                    className="d-flex align-items-center"
                                    style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}
                                    onClick={handleCreateInvoice}
                                >
                                    <Image src={receive} className="me-2" /> Create Invoice
                                </Button>
                                <Button
                                    onClick={() => navigate(`/Inventory/SalesOrder/Edit/${id}`)}
                                    className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={editlogo} className="me-2" /> Edit
                                </Button>
                            </Col>
                        </Row>
                    </Card>

                    <Card className="p-3 shadow-sm">
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

                {/* Printable area starts here */}
                <div id="printableArea">
                    {/* Customer & Order Details */}
                    <Col sm={12} className="my-2">
                        <Card className="p-3 shadow-sm">
                            <Row>
                                {/* Customer Info */}
                                <Col sm={6}>
                                    <div className="mb-4">
                                        <h5 className="text-primary" style={{ fontSize: '22px', fontWeight: '600' }}>
                                            {selectedSO.customer_id ? selectedSO.customer_id.name : selectedSO?.cafe?.name}
                                        </h5>
                                    </div>
                                    <Row>
                                        <Col sm={6}>
                                            <div className="mb-4">
                                                <h6 className="text-dark mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                                                    Billing Address
                                                </h6>
                                                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                    {/* {selectedSO?.cafe?.address} */}
                                                    {selectedSO.customer_id ? selectedSO.customer_id.address : selectedSO?.cafe?.address}
                                                </p>
                                            </div>
                                        </Col>
                                        
                                        <Col sm={6}>
                                            <div className="mb-4 ps-4 border-start">
                                                <h6 className="text-dark mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                                                    Shipping Address
                                                </h6>
                                                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                    {/* {selectedSO?.cafe?.address} */}
                                                    {selectedSO.customer_id ? selectedSO.customer_id.address : selectedSO?.cafe?.address}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm={6}>
                                    <div className="text-end mb-4">
                                        <h6 className="text-dark" style={{ fontSize: '16px' }}>
                                            Order No: <span className="text-primary fw-bold">{selectedSO.so_no}</span>
                                        </h6>
                                    </div>

                                    <div className="order-details ms-auto" style={{ maxWidth: '400px' }}>
                                        <table className="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted" style={{ width: '50%' }}>Sales Order No:</td>
                                                    <td className="fw-medium">{selectedSO.po_no}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Order Date:</td>
                                                    <td className="fw-medium">{formatDate(selectedSO.delivery_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Payment Terms:</td>
                                                    <td className="fw-medium">{selectedSO.payment_terms || "Cash"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Reference:</td>
                                                    <td className="fw-medium">{selectedSO.reference || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Sales Person:</td>
                                                    <td className="fw-medium">{selectedSO.sales_person || "N/A"}</td>
                                                </tr>
                                            </tbody>
                                        </table>
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
                                                {selectedSO.items && selectedSO.items.map((item, index) => (
                                                    <tr key={item._id || index}>
                                                        <td>
                                                            <b className="text-primary pointer-cursor" onClick={() => handleProductClick(item.item_id)}>{item?.item_id?.name}</b>
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
                                        <b>Description:</b> {selectedSO.description || "N/A"}
                                    </p>
                                </Col>
                                <Col sm={6} className="text-end">
                                    <p className="border-bottom border-3 p-3">
                                        <b>Subtotal:</b> ₹{selectedSO.subtotal}
                                    </p>
                                    <p className="border-bottom border-3 p-3">
                                        <b>Discount:</b>{" "}
                                        <span className="text-primary" style={{ cursor: "pointer" }}>
                                            {selectedSO.discount_value}%
                                        </span>{" "}
                                        ₹{(selectedSO.subtotal * selectedSO.discount_value / 100).toFixed(2)}
                                    </p>
                                    <p className="border-bottom border-3 p-3">
                                        <b>Tax:</b> {selectedSO.tax && selectedSO.tax.length > 0 ?
                                            selectedSO.tax.map((tax, index) => (
                                                <span key={index}>
                                                    {tax.tax_name} ({tax.tax_rate}%)
                                                    {index < selectedSO.tax.length - 1 ? ', ' : ''}
                                                </span>
                                            )) : 'N/A'}
                                    </p>
                                    <p className="border-bottom border-3 p-3">
                                        <b>Total:</b> ₹{selectedSO.total}
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col sm={12} className="my-2">
                        <Card className="p-3 shadow-sm">
                            <h5 className="mb-3" style={{ fontSize: '20px' }}>Terms and Condition </h5>
                            <div className="table-responsive">
                                <b>{selectedSO.internal_team_notes || "Terms and Condition not applied"}</b>
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
                        Are you sure you want to delete this sales order? This action cannot be undone.
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
        </Container>
    )
};
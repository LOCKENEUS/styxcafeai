import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import deleteplogo from "/assets/inventory/Vector (1).png";
import receive from "/assets/inventory/solar_card-send-linear.png";
import print from "/assets/inventory/Vector.png";
import sendMail from "/assets/inventory/Group.png";
import editlogo from "/assets/inventory/mage_edit.png";
import companylog from "/assets/inventory/companylogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSOInvoiceById } from "../../../../store/AdminSlice/Inventory/SoInvoiceSlice";
import CollectPayment from "../modal/CollectPayment";
import { getPaymentById } from "../../../../store/AdminSlice/Inventory/CollectPaymentSlice";
import Loader from "../../../../components/common/Loader/Loader";
import { Breadcrumbs } from "../../../../components/common/Breadcrumbs/Breadcrumbs";

export const SIDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;
  const userEmail = user?.email;
  const UserContactN = user?.contact_no;
  const UserAddress = user?.address;
  const UesrPAN = user?.panNo;

  const { selectedInvoice: invoice, loading } = useSelector(
    (state) => state.soInvoice
  );
  const { selectedPayment, loading: paymentLoading } = useSelector(
    (state) => state.payment || {}
  );
  const [collectAmount, setCollectAmount] = useState(0);
  const [showCollectModal, setShowCollectModal] = useState(false);

  // Add handlePrint function
  const handlePrint = () => {
    const printContent = document.getElementById("printableArea");
    const originalContents = document.body.innerHTML;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Add necessary styles for printing
    printWindow.document.write(`
            <html>
                <head>
                    <title>Sales Invoice: ${invoice.so_no}</title>
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
                            <h3>Sales Invoice: ${invoice.so_no}</h3>
                        </div>
                        ${printContent.innerHTML}
                       
                        <div>
                            <h5>Payment Collection Details</h5>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Mode</th>
                                        <th>Transaction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${selectedPayment?.length > 0 ? selectedPayment.map((payment, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${new Date(payment.deposit_date).toLocaleDateString("en-US", {
                                                                                              year: "numeric",
                                                                                              month: "short",
                                                                                              day: "2-digit",
                                                                                            })}</td>
                                            <td>₹ ${payment.deposit_amount}</td>
                                            <td>${payment.mode}</td>
                                            <td>${payment.transaction_id}</td>
                                        </tr>
                                    `).join('') : `
                                        <tr>
                                            <td colspan="5" class="text-center py-3">No payment records found</td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
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

  // Calculate remaining amount using useMemo
  const { totalPaidAmount, remainingAmount } = useMemo(() => {
    const totalPaid =
      selectedPayment?.reduce(
        (sum, payment) => sum + (payment.deposit_amount || 0),
        0
      ) || 0;

    return {
      totalPaidAmount: totalPaid,
      remainingAmount: (invoice?.total || 0) - totalPaid,
    };
  }, [selectedPayment, invoice?.total]);

  // Update collect amount when remaining amount changes
  useEffect(() => {
    setCollectAmount(remainingAmount);
  }, [remainingAmount]);

  useEffect(() => {
    if (id) {
      dispatch(getSOInvoiceById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(getPaymentById(id));
    }
  }, [dispatch, id]);

  // Function to refresh payment data
  const refreshPaymentData = async () => {
    if (id) {
      await dispatch(getPaymentById(id));
    }
  };

  const handleModalClose = () => {
    setShowCollectModal(false);
    refreshPaymentData();
  };

  // Initial data fetch
  useEffect(() => {
    refreshPaymentData();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
        </Spinner>
      </Container>
    );
  }

  if (!invoice) {
    return <div>No invoice found</div>;
  }

  const handleCollectData = () => {
    if (remainingAmount > 0) {
      setShowCollectModal(true);
    }
  };

  return (
    <Container fluid>
      <Breadcrumbs
              items={[
                { label: "Home", path: "/admin/dashboard" },
                { label: "Sales Invoice List", path: "/admin/inventory/sales-invoice-list" },
                { label: "Details", active: true }
              ]}
            />
      <Row>
        <Col sm={12} className="my-2">
          <Card className="p-3">
            <Row>
              <Col sm={6} xs={12}>
                <h5 className="text-dark p-2" style={{ fontSize: "18px" }}>
                  <span>Sales Invoice : </span>
                  <span>{invoice.so_no}</span>
                </h5>
              </Col>
              <Col
                sm={6}
                xs={12}
                className="d-flex flex-wrap justify-content-center justify-content-sm-end align-items-center gap-2 text-center"
              >
                <Button
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: "#FAFAFA",
                    color: "black",
                    border: "none",
                  }}
                  onClick={handlePrint}
                >
                  <Image src={print} className="me-2" /> Print
                </Button>
                <Button
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: "#FAFAFA",
                    color: "black",
                    border: "none",
                  }}
                >
                  <Image src={sendMail} className="me-2" /> Send Email
                </Button>
                {/* <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={receive} className="me-2" /> Receive
                                </Button> */}
                <Button
                  onClick={() =>
                    navigate(`/admin/Inventory/InvoiceCreate/${invoice._id}`)
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
                {/* <Button className="d-flex align-items-center" style={{ backgroundColor: '#FAFAFA', color: 'black', border: 'none' }}>
                                    <Image src={deleteplogo} />
                                </Button> */}
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Printable area starts here */}
        <div id="printableArea">
          {/* Company Info Card */}
          {/* <Col sm={12} className="my-2">
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
                    <Col sm={2} className="d-flex">
                        <span className="p-2 float-right">SO:<b className="text-primary">Draft</b></span>
                    </Col>
                </Row>
            </Card>
        </Col> */}

          {/* Customer Info and Invoice Details */}
          <Col sm={12} className="my-2">
            <Card className="p-3 shadow-sm">
              <Row>
                <Col sm={6}>
                  <h5
                    className="text-primary mb-3"
                    style={{ fontSize: "20px" }}
                  >
                    {invoice.customer_id?.name || "Customer Name"}
                  </h5>
                  <h5>Address</h5>
                  <p className="mb-1">
                    {invoice.customer_id?.address || "N/A"}
                  </p>
                  <div className="mt-3">
                    <p className="mb-1">
                      <span style={{ fontWeight: "700" }} className="me-2">
                        City :
                      </span>{" "}
                      {invoice.customer_id?.city || "N/A"}
                    </p>
                    <p className="mb-1 mt-2">
                      <span style={{ fontWeight: "700" }} className="me-2">
                        State :
                      </span>{" "}
                      {invoice.customer_id?.state || "N/A"}
                    </p>
                    <p className="mb-1 mt-2">
                      <span style={{ fontWeight: "700" }} className="me-2">
                        Country :
                      </span>{" "}
                      {invoice.customer_id?.country || "N/A"}
                    </p>
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="p-3"></div>
                  <Table>
                    <tbody>
                      <tr>
                        <th>Sales Invoice No</th>
                        <th>{invoice.so_no}</th>
                      </tr>
                      <tr>
                        <th>Invoice Date</th>
                        <th>{new Date(invoice.date).toLocaleDateString()}</th>
                      </tr>
                      <tr>
                        <th>Payment Terms:</th>
                        <th>{invoice.payment_terms || "--"}</th>
                      </tr>
                      <tr>
                        <th>Reference:</th>
                        <th>{invoice.reference || "--"}</th>
                      </tr>
                      <tr>
                        <th>Sales Person:</th>
                        <th>{invoice.sales_person || "- - - (Unknown)"}</th>
                      </tr>
                    </tbody>
                  </Table>
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
                        {invoice.items.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <b> <Link to={`/admin/inventory/item-details/${item?.item_id?._id}`}> {item?.item_id?.name}</Link></b>
                              <br />
                              HSN: {item?.item_id?.hsn}
                            </td>
                            <td>Qty: {item?.quantity} Nos</td>
                            <td>Price: ₹{item?.price}</td>
                            <td>{item?.tax?.tax_rate}%</td>
                            <td>Total: ₹{item?.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>

              {/* Totals Section */}
              <Row className="mt-4 border-top border-3 p-2">
                <Col sm={6} className="border-end border-3">
                  <p>
                    <b>Description:</b> {invoice.description}
                  </p>
                </Col>
                <Col sm={6} className="text-end">
                  <Table>
                    <tbody>
                      <tr>
                        <th className="text-start">Subtotal:</th>
                        <th>₹{invoice.subtotal}</th>
                      </tr>
                      <tr>
                        <th className="text-start">
                          Discount {invoice.discount_value}%:
                        </th>
                        <th>
                          ₹
                          {(
                            (invoice.subtotal * invoice.discount_value) /
                            100
                          ).toFixed(2)}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-start">Tax</th>
                        <th>
                          {invoice.tax
                            .map((tax) => `${tax.tax_name} (${tax.tax_rate}%)`)
                            .join(" + ")}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-start">Total</th>
                        <th>₹{invoice.total}</th>
                      </tr>
                      <tr>
                        <th className="text-start">
                          Adjustment ({invoice.adjustment_note})
                        </th>
                        <th>₹{invoice.adjustment_amount}</th>
                      </tr>
                      <tr className="border-top border-3">
                        <th className="text-start">Balance</th>
                        <th>
                          {((invoice?.total || 0) - (selectedPayment?.reduce((sum, payment) => sum + (payment.deposit_amount || 0), 0) || 0)) <= 0 ? (
                            <span style={{ fontWeight: "600" }} className="text-success">Amount Paid</span>
                          ) : (
                            <Button
                              onClick={handleCollectData}
                              variant="outline-success">
                              Collect ₹{(invoice?.total || 0) - (selectedPayment?.reduce((sum, payment) => sum + (payment.deposit_amount || 0), 0) || 0)}
                            </Button>
                          )}

                          <CollectPayment
                            show={showCollectModal}
                            handleClose={handleModalClose}
                            maxAmount={remainingAmount}
                            invoiceId={id}
                            onSuccess={refreshPaymentData}
                          />
                        </th>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col sm={12} className="my-2">
            <Card className="p-3 shadow-sm">
              <h5 className="mb-3" style={{ fontSize: "20px" }}>
                Terms and Condition{" "}
              </h5>
              <div className="table-responsive">
                <b>{invoice.internal_team_notes}</b>
              </div>
            </Card>
          </Col>
        </div>
        {/* Printable area ends here */}

        {/* Payment Collection Details */}
        <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3" style={{ fontSize: "20px" }}>
              Payment Collection Details
            </h5>
            <div className="table-responsive">
              {paymentLoading ? (
                <div className="text-center p-4">
                  <Loader />
                </div>
              ) : (
                <Table className="text-center align-middle">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "2px solid #dee2e6",
                        borderTop: "2px solid #dee2e6",
                      }}
                    >
                      <th className="fw-bold">#</th>
                      <th className="fw-bold">Date</th>
                      <th className="fw-bold">Amount</th>
                      <th className="fw-bold">Mode</th>
                      <th className="fw-bold">Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayment?.length > 0 ? (
                      <>
                        {selectedPayment.map((payment, index) => (
                          <tr key={payment._id}>
                            <td>{index + 1}</td>
                            <td>
                              {new Date(
                                payment.deposit_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              })}
                            </td>
                            <td>₹ {payment.deposit_amount}</td>
                            <td>{payment.mode}</td>
                            <td>{payment.transaction_id}</td>
                          </tr>
                        ))}
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <td colSpan="2" className="text-end fw-bold">
                            Total Paid:
                          </td>
                          <td className="fw-bold">₹ {totalPaidAmount}</td>
                          <td colSpan="2"></td>
                        </tr>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <td colSpan="2" className="text-end fw-bold">
                            Remaining Amount:
                          </td>
                          <td className="fw-bold">₹ {remainingAmount}</td>
                          <td colSpan="2"></td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-3">
                          No payment records found
                        </td>
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

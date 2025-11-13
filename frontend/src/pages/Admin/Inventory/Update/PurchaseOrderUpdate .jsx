import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table, } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { GetPurchaseOrder, GetVendorsList, UpdatePurchaseOrder, } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { getItems, getSuperItems } from "../../../../store/AdminSlice/Inventory/ItemsSlice";
import { getTaxFields } from "../../../../store/AdminSlice/Inventory/taxSlice";
import Customers from "../modal/customersModal";
import VendorsList from "../modal/vendoreListModal";
import PaymentTermsModal from "../modal/PaymentTermsModal";
import Tax from "../modal/tax";
import OffcanvesItemsNewCreate from "../modal/itemCreateModal";

export const PurchaseOrderUpdate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [showVendorList, setShowVendorList] = useState(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    shipment_date: "",
    delivery_type: "",
    shipment_preference: "",
    date: "",
    reference: "",
    description: "",
    payment_terms: "",
    internal_team_notes: ""
  });

  const [products, setProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [showProductList, setShowProductList] = useState(false);
  const [showOffCanvasCreateItem, setshowOffCanvasCreateItem] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const cafeId = user?._id;
  const selectedPo = useSelector((state) => state.purchaseOrder?.selectedPurchaseOrder);
  const taxFields = useSelector((state) => state.tax?.taxes);
  const itemListForItems = useSelector((state) => state.items?.items);
  const itemListForSuperItems = useSelector((state) => state.items?.super_items);
  const [userType, setUserType] = useState("Vendor");

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    discountType: 'Percentage',
    taxAmount: 0,
    selectedTaxes: [],
    total: 0,
    adjustmentNote: '',
    adjustmentAmount: 0,
    discountAmount: 0
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseVendorList = () => setShowVendorList(false);
  const handleShowVendorList = () => setShowVendorList(true);

  const handleCloseCreateItem = () => setshowOffCanvasCreateItem(false);
  const handleShowCreateItem = () => setshowOffCanvasCreateItem(true);
  const [vendorSelected, setVendorSelected] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [vendorId, setVendorId] = useState("");

  const [styxData, setStyxData] = useState(null);
  const [paymentTerms, setPaymentTerms] = useState([
    { _id: 1, name: "Net 15" },
    { _id: 2, name: "Net 30" },
    { _id: 3, name: "Net 45" },
    { _id: 4, name: "Net 60" },
    { _id: 5, name: "Due end of the month" },
    { _id: 6, name: "Due end of next month" },
    { _id: 7, name: "Due on Receipt" },
  ]);

  useEffect(() => {
    if (id) {
      dispatch(GetPurchaseOrder(id));
    }
  }, [id]);

  useEffect(() => {
    if (userType === "Superadmin") {
      dispatch(getSuperItems());
    } else {
      dispatch(getItems(cafeId));
    }
  }, [userType])

  useEffect(() => {
    if (selectedPo) {
      if (selectedPo?.vendor_id === null) {
        setUserType("Superadmin")
      }
      setFormData({
        vendorId: selectedPo?.vendor_id?._id,
        delivery_type: selectedPo?.delivery_type,
        date: new Date(selectedPo?.delivery_date).toISOString().split('T')[0],
        shipment_date: selectedPo?.shipment_date,
        payment_terms: selectedPo?.payment_terms,
        reference: selectedPo?.reference,
        shipment_preference: selectedPo?.shipment_preference,
        description: selectedPo?.description,
        internal_team_notes: selectedPo?.internal_team_notes
      })
      setVendorSelected(selectedPo?.vendor_id);
      // FIXED: Also set vendorId state for dropdown
      if (selectedPo?.vendor_id?._id) {
        setVendorId(selectedPo?.vendor_id._id);
      }
      // setProducts(selectedPo?.items)

      const formattedProducts = selectedPo.items.map(item => ({
        // _id: item.item_id._id,
        item: item.item_id._id, // Extract item name
        quantity: item.quantity, // Extract quantity
        price: item.price, // Extract price
        tax: item.tax._id, // Extract tax rate
        total: item.total, // Extract total
        totalTax: item.tax_amt // Extract total tax amount
      }));

      setProducts(formattedProducts);

      setTotals({
        ...totals,
        discount: selectedPo?.discount_value || 0,
        selectedTaxes: selectedPo?.tax
          ? selectedPo.tax.map(tax => ({ id: tax._id, rate: tax.tax_rate }))
          : [],
        adjustmentNote: selectedPo?.adjustment_note || '',
        adjustmentAmount: selectedPo?.adjustment_amount || 0,
      })
    }
  }, [selectedPo])

  useEffect(() => {
    // FIXED: Removed getStyxData() call - causes "Failed to fetch Styx data" error
    dispatch(GetVendorsList(cafeId));
    dispatch(getTaxFields(cafeId));
    dispatch(getItems(cafeId));
  }, [dispatch]);
  const vendorsList = useSelector((state) => state.purchaseOrder?.vendors);
  const lisgetCustomers = useSelector((state) => state.customers);
  const customersList = lisgetCustomers?.customers;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const cafeId = user?._id;
    if (cafeId) {
      dispatch(GetVendorsList(cafeId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userType === "Superadmin") {
      setProductsList(itemListForSuperItems);
    } else {
      setProductsList(itemListForItems);
    }
  }, [userType, itemListForItems, itemListForSuperItems]);

  const addProductRow = () => {
    setProducts([
      ...products,
      { item: '', quantity: '', price: '', tax: '', total: 0, totalTax: 0 },
    ]);
  };

  const deleteProductRow = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;

    if (field === 'item') {
      const selectedProduct = productsList.find((prod) => prod._id === value);
      if (selectedProduct) {
        updatedProducts[index].price = selectedProduct.costPrice || 0;
      }
    }

    if (['quantity', 'price', 'tax'].includes(field)) {
      const quantity = parseFloat(updatedProducts[index].quantity) || 0;
      const price = parseFloat(updatedProducts[index].price) || 0;
      const taxId = updatedProducts[index].tax;
      const selectedTax = taxFields.find((tax) => tax._id === taxId);
      const taxRate = selectedTax ? parseFloat(selectedTax.tax_rate) : 0;

      const subtotal = quantity * price;
      const taxAmount = (subtotal * taxRate) / 100;

      updatedProducts[index].total = subtotal;
      updatedProducts[index].totalTax = taxAmount;
    }

    setProducts(updatedProducts);
  };

  useEffect(() => {
    const subtotal = products.reduce((acc, product) => acc + (parseFloat(product.total) || 0), 0);
    const totalTax = products.reduce((acc, product) => acc + (parseFloat(product.totalTax) || 0), 0);

    const discountAmount = totals.discountType === 'Percentage'
      ? (subtotal * parseFloat(totals.discount || 0)) / 100
      : parseFloat(totals.discount || 0);

    const additionalTax = totals.selectedTaxes.reduce((acc, tax) => {
      return acc + (subtotal * parseFloat(tax.rate || 0)) / 100;
    }, 0);

    const grandTotal = subtotal + totalTax + additionalTax - discountAmount + parseFloat(totals.adjustmentAmount || 0);

    setTotals((prev) => ({
      ...prev,
      subtotal,
      taxAmount: totalTax + additionalTax,
      discountAmount,
      total: grandTotal,
    }));
  }, [products, totals.discount, totals.discountType, totals.selectedTaxes, totals.adjustmentAmount]);

  const handleTaxSelection = (e) => {
    const taxId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      const selectedTax = taxFields.find((tax) => tax._id === taxId);
      if (selectedTax) {
        setTotals({
          ...totals,
          selectedTaxes: [...totals.selectedTaxes, { id: selectedTax._id, rate: selectedTax.tax_rate }],
        });
      }
    } else {
      setTotals({
        ...totals,
        selectedTaxes: totals.selectedTaxes.filter((tax) => tax.id !== taxId),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const submitData = new FormData();
    submitData.append('vendor_id', vendorId);
    submitData.append('delivery_type', formData.delivery_type);
    submitData.append('delivery_date', formData.date);
    submitData.append('shipment_date', formData.shipment_date);
    submitData.append('shipment_preference', formData.shipment_preference);
    submitData.append('payment_terms', formData.payment_terms);
    submitData.append('description', formData.description);
    submitData.append('reference', formData.reference);
    submitData.append('internal_team_notes', formData.internal_team_notes);

    const formattedItems = products.map((product) => ({
      item_id: product.item,
      quantity: product.quantity,
      price: product.price,
      tax: product.tax,
      total: product.total,
      tax_amt: product.totalTax,
    }));

    submitData.append('items', JSON.stringify(formattedItems));

    submitData.append('subtotal_amt', totals.subtotal);
    submitData.append('discount_type', totals.discountType);
    submitData.append('discount_value', totals.discount);
    submitData.append('tax', JSON.stringify(totals.selectedTaxes.map((tax) => tax.id)));
    submitData.append('tax_amt', totals.taxAmount);
    submitData.append('adjustment_amount', totals.adjustmentAmount);
    submitData.append('adjustment_note', totals.adjustmentNote);
    submitData.append('total_amt', totals.total);
    submitData.append('cafe', cafeId);
    submitData.append('pending_qty', products.reduce((acc, product) => acc + parseFloat(product.quantity || 0), 0));

    try {
      await dispatch(UpdatePurchaseOrder({ id, updatedData: submitData })).unwrap();
      navigate('/admin/inventory/purchase-order-list');
    } catch (error) {
      console.error('Error updating purchase order:', error);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      vendorId: '',
      shipment_date: "",
      delivery_type: "",
      shipment_preference: "",
      date: "",
      reference: "",
      description: "",
      payment_terms: "",
      internal_team_notes: ""
    });
    setProducts([]);
    setTotals({
      subtotal: 0,
      discount: 0,
      discountType: 'Percentage',
      taxAmount: 0,
      selectedTaxes: [],
      total: 0,
      adjustmentNote: '',
      adjustmentAmount: 0,
      discountAmount: 0
    });
  };

  const handleVendorSelect = (newVendorId) => {
    const selectedVendor = vendorsList.find((vendor) => vendor?._id == newVendorId);
    if (selectedVendor) {
      setVendorSelected(selectedVendor);
      setFormData({
        ...formData,
        vendor_id: selectedVendor?._id,
      });
      setVendorId(selectedVendor?._id);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <div className="d-flex my-3 flex-row align-items-center justify-content-between">
            <div className="d-flex my-3 flex-row align-items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-light border border-dark"
              >
                <GiCancel />
              </button>
              <h1>Update Purchase Order</h1>
            </div>
          </div>

          <Col sm={8}>
            <Row className="d-flex align-items-center mb-2">
              <Col md={4}>
                <h5 className="text-muted">Vendor <span className="text-danger">*</span></h5>
              </Col>
              <Col md={8}>
                <div
                  style={{
                    border: "1px solid black",
                    borderStyle: "dashed",
                    borderRadius: "5px",
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                  }}
                  onClick={() => {
                    if (userType !== "Superadmin") {
                      setShowVendorList(true);
                    }
                  }}
                >
                  {userType === "Superadmin" ? "StyxCafe" : userType === "Vendor" ? vendorSelected?.name : "Select Vendor"}
                </div>
                {userType !== "Superadmin" && (
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => {
                        setVendorSelected(null);
                        setVendorId("");
                        setUserType("Superadmin");
                      }}
                    >
                      Or Select StyxCafe
                    </button>
                  </div>
                )}
              </Col>
            </Row>

            <Row>
              {userType === "Vendor" && <Col md={6}>
                <h6 style={{ fontSize: "1rem" }}>Billing Address</h6>
                <p>{vendorSelected?.name || "Vendor Name"}</p>
                <div>
                  <h6 style={{ fontSize: "1rem" }}>Billing Address</h6>
                  <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.city1 || "Billing City"}</p>
                  <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.state1 || "Billing State"}</p>
                  <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.pincode1 || "Billing Pincode"}</p>
                  <p className="mb-0" style={{ fontSize: "0.9rem" }}>{vendorSelected?.country1 || "Billing Country"}</p>
                </div>
              </Col>}
              {userType === "Vendor" && <Col md={6}>
                <h6 style={{ fontSize: "1rem" }}>Shipping Address</h6>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.city2 || "Shipping City"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.state2 || "Shipping State"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.pincode2 || "Shipping Pincode"}</p>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>{vendorSelected?.country2 || "Shipping Country"}</p>
              </Col>}

              {userType === "Superadmin" && <Col md={6}>
                <h6 style={{ fontSize: "1rem" }}>Billing Address</h6>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{styxData?.city1 || "Billing City"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{styxData?.state1 || "Billing State"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{styxData?.pincode1 || "Billing Pincode"}</p>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>{styxData?.country1 || "Billing Country"}</p>
              </Col>}

              {userType === "Vendor" && <Col md={6}>
                <h6 style={{ fontSize: "1rem" }}>Shipping Address</h6>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.city2 || "Shipping City"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.state2 || "Shipping State"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.pincode2 || "Shipping Pincode"}</p>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>{vendorSelected?.country2 || "Shipping Country"}</p>
              </Col>}

              {userType === "Superadmin" && <Col md={6}>
                <h6 style={{ fontSize: "1rem" }}>Shipping Address</h6>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{styxData?.city2 || "Shipping City"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{styxData?.state2 || "Shipping State"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{styxData?.pincode2 || "Shipping Pincode"}</p>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>{styxData?.country2 || "Shipping Country"}</p>
              </Col>}
            </Row>
          </Col>

          <Col sm={4}>
            <div className="d-flex my-3 flex-row align-items-center gap-2">
              <h5 className="text-muted">Delivery Address <span className="text-danger">*</span></h5>
            </div>
            <div>
              <div className="d-flex align-items-center gap-3">
                <Form.Check
                  type="radio"
                  name="delivery_type"
                  label="Organization"
                  value="Organization"
                  checked={formData.delivery_type === "Organization"}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_type: e.target.value })
                  }
                />
                <Form.Check
                  type="radio"
                  name="delivery_type"
                  label="My Location"
                  value="My Location"
                  checked={formData.delivery_type === "My Location"}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_type: e.target.value })
                  }
                />
              </div>
            </div>

            {formData.delivery_type === "Organization" && (
              <Row>
                <Col md={12}>
                  <h6 style={{ fontSize: "1rem" }}>Organization Address</h6>
                  <p className="mb-1" style={{ fontSize: "0.9rem" }}>City</p>
                  <p className="mb-1" style={{ fontSize: "0.9rem" }}>State</p>
                  <p className="mb-1" style={{ fontSize: "0.9rem" }}>Pincode</p>
                  <p className="mb-0" style={{ fontSize: "0.9rem" }}>Country</p>
                </Col>
              </Row>
            )}

            {formData.delivery_type === "My Location" && (
              <Row>
                <Col md={12}>
                  <h6 style={{ fontSize: "1rem" }}>My Location</h6>
                  {customersList && customersList.length > 0 ? (
                    <Button onClick={handleShow} variant="outline-primary">
                      Select Customer
                    </Button>
                  ) : (
                    <p>No customers available</p>
                  )}
                </Col>
              </Row>
            )}
          </Col>

          <Col sm={4} style={{ marginTop: "2rem" }}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex flex-row align-items-center gap-2">
                <Form.Control
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="Delivery Date"
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = 'text'
                  }}
                />
              </div>

              <div className="d-flex flex-row align-items-center gap-2">
                <Form.Select
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    height: "44px",
                    borderStyle: "dashed",
                  }}
                >
                  <option value="">Select Payment Term</option>
                  {paymentTerms.map((term) => (
                    <option key={term._id} value={term.name}>
                      {term.name}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  style={{
                    width: "50px",
                    border: "1px solid black",
                    height: "30px",
                    borderStyle: "dashed",
                  }}
                  onClick={() => setShowPaymentTerms(true)}
                >
                  <FaPlus />
                </Button>
              </div>

              <div className="d-flex flex-row align-items-center gap-2">
                <Form.Control
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  placeholder="Reference"
                />
              </div>
            </div>
          </Col>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <h5>Items</h5>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={addProductRow}
            className="mb-3"
          >
            <FaPlus /> Add Item
          </Button>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>
                    <Form.Select
                      value={product.item}
                      onChange={(e) =>
                        handleProductChange(index, 'item', e.target.value)
                      }
                    >
                      <option value="">Select Item</option>
                      {productsList.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(index, 'quantity', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handleProductChange(index, 'price', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={product.tax}
                      onChange={(e) =>
                        handleProductChange(index, 'tax', e.target.value)
                      }
                    >
                      <option value="">Select Tax</option>
                      {taxFields.map((tax) => (
                        <option key={tax._id} value={tax._id}>
                          {tax.tax_name} ({tax.tax_rate}%)
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>{(product.total + product.totalTax).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteProductRow(index)}
                    >
                      <RiDeleteBinLine />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <h6>Additional Charges</h6>
          <div className="d-flex flex-column gap-2">
            <div>
              <Form.Label>Discount</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  value={totals.discount}
                  onChange={(e) =>
                    setTotals({ ...totals, discount: e.target.value })
                  }
                />
                <Form.Select
                  value={totals.discountType}
                  onChange={(e) =>
                    setTotals({ ...totals, discountType: e.target.value })
                  }
                  style={{ width: '150px' }}
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed</option>
                </Form.Select>
              </div>
            </div>

            <div>
              <Form.Label>Additional Taxes</Form.Label>
              {taxFields.map((tax) => (
                <Form.Check
                  key={tax._id}
                  type="checkbox"
                  label={`${tax.tax_name} (${tax.tax_rate}%)`}
                  value={tax._id}
                  checked={totals.selectedTaxes.some((t) => t.id === tax._id)}
                  onChange={handleTaxSelection}
                />
              ))}
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowTaxModal(true)}
              >
                + Add New Tax
              </Button>
            </div>

            <div>
              <Form.Label>Adjustment</Form.Label>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={totals.adjustmentAmount}
                onChange={(e) =>
                  setTotals({ ...totals, adjustmentAmount: e.target.value })
                }
              />
              <Form.Control
                as="textarea"
                placeholder="Note"
                value={totals.adjustmentNote}
                onChange={(e) =>
                  setTotals({ ...totals, adjustmentNote: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="border p-3 rounded">
            <h6>Summary</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Discount:</span>
              <span>-₹{totals.discountAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax:</span>
              <span>₹{totals.taxAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Adjustment:</span>
              <span>₹{parseFloat(totals.adjustmentAmount || 0).toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Internal Team Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="internal_team_notes"
              value={formData.internal_team_notes}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Customers
        show={show}
        handleClose={handleClose}
        onClientSelect={handleClientSelect}
      />
      {showProductList && (
        <OffcanvesItemsNewCreate
          show={showProductList}
          handleClose={() => setShowProductList(false)}
        />
      )}
      <PaymentTermsModal
        show={showPaymentTerms}
        handleClose={() => setShowPaymentTerms(false)}
      />
      <Tax show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
      <OffcanvesItemsNewCreate
        showOffCanvasCreateItem={showOffCanvasCreateItem}
        handleCloseCreateItem={handleCloseCreateItem}
      />

      <VendorsList
        showVendorList={showVendorList}
        handleCloseVendorList={handleCloseVendorList}
        onVendorSelect={handleVendorSelect}
      />

      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="primary"
          onClick={handleSubmit}
        >
          Update Purchase Order
        </Button>
      </div>
    </Container>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Table, Modal, Breadcrumb, BreadcrumbItem, Dropdown, ButtonGroup } from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
import OffcanvesItemsNewCreate from "../Offcanvas/OffcanvesItems"
import Tax from "../modal/Tax";
import PaymentTermsModal from "../modal/PaymentTermsModal";
import { Link, useParams } from "react-router-dom";
import { GetPurchaseOrder, getStyxData, GetVendorsList, UpdatePurchaseOrder, } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { useDispatch, useSelector } from "react-redux";
import AddClint from "../modal/AddClint";
import VendorsList from "../modal/vendoreListModal";
import { getItems } from "../../../../store/AdminSlice/Inventory/ItemsSlice";
import { getTaxFields } from "../../../../store/AdminSlice/TextFieldSlice";
import { getCustomers } from "../../../../store/AdminSlice/CustomerSlice";
import { getItems as getSuperItems } from "../../../../store/slices/inventory";
import { Breadcrumbs } from "../../../../components/common/Breadcrumbs/Breadcrumbs";

export const PurchaseOrderUpdate = () => {
  const [show, setShow] = useState(false);
  const [showClientList, setShowClientList] = useState(true);
  const [showOffCanvasCreateItem, setShowOffCanvasCreateItem] = useState(false);
  const [userType, setUserType] = useState("Superadmin");
  const handleShowCreateItem = () => setShowOffCanvasCreateItem(true);
  const handleCloseCreateItem = () => setShowOffCanvasCreateItem(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    delivery_type: "organization",
    date: '',
    shipment_date: '',
    payment_terms: '',
    reference: '',
    shipment_preference: '',
    description: '',
    internal_team_notes: ''
  });
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
  const [products, setProducts] = useState([
    { id: 1, item: "", quantity: 1, price: 0, tax: 0, total: 0, totalTax: 0 },
  ]);
  const [showProductList, setShowProductList] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const dispatch = useDispatch();

  const id = useParams();
  const { customFields } = useSelector((state) => state.customFields);
  const selectedPo = useSelector((state) => state.purchaseOrder.selectedPo);
  const { taxFields } = useSelector((state) => state.taxFieldSlice);
  const { loading } = useSelector((state) => state.items);
  let items = []
  if (userType === "Superadmin") {
    items = useSelector((state) => state.inventorySuperAdmin.it);
  } else {
    items = useSelector((state) => state.items.items);
  }
  const [showVendorList, setShowVendorList] = useState(false);
  const handleShowVendorList = () => {
    setUserType("Vendor");
    setShowVendorList(true)
  };
  const handleCloseVendorList = () => setShowVendorList(false);
  const [vendorSelected, setVendorSelected] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Organization");
  const [vendorId, setVendorId] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const cafeId = user?._id;

  const userName = user?.name;
  const userEmail = user?.email;
  const UserContactN = user?.contact_no;
  const UserAddress = user?.address;
  const UesrPAN = user?.panNo;

  // Filter payment terms from custom fields
  const paymentTerms = customFields.filter(field => field.type === 'Payment Terms');
  const { styxData } = useSelector((state) => state.purchaseOrder);

  useEffect(() => {
    if (id) {
      dispatch(GetPurchaseOrder(id?.id))
    }
  }, [id])

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

      // const [totals, setTotals] = useState({
      //   subtotal: 0,
      //   discount: 0,
      //   discountType: 'Percentage',
      //   taxAmount: 0,
      //   selectedTaxes: [],
      //   total: 0,
      //   adjustmentNote: '',
      //   adjustmentAmount: 0,
      //   discountAmount: 0
      // });

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
    dispatch(getStyxData());
    dispatch(GetVendorsList(cafeId));
    dispatch(getTaxFields(cafeId));
    dispatch(getItems(cafeId));
  }, [dispatch]);
  const vendorsList = useSelector((state) => state.purchaseOrder?.vendors);
  // const lisgetCustomers = useSelector((state) => state.customers?.customers);
  const lisgetCustomers = useSelector((state) => state.customers);
  const customersList = lisgetCustomers?.customers;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const cafeId = user?._id;
    if (cafeId) {
      dispatch(getCustomers(cafeId));
    }
  }, [dispatch]);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setShowClientList(true);
  };

  const TaxList = useSelector((state) => state.taxFieldSlice?.taxFields);

  const calculateTotal = (price, quantity, tax) => {
    const subtotal = Math.round(price * quantity);
    const totalTax = Math.round((subtotal * tax) / 100);
    return { total: subtotal + totalTax, totalTax };
  };

  const updateProduct = (id, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };

        if (field === "item") {
          const selectedItem = items.find(item => item._id === value);
          if (selectedItem) {
            updatedProduct.price = selectedItem.costPrice;
            updatedProduct.tax = selectedItem.tax;
            const itemTax = taxFields.find(tax => tax._id === selectedItem.tax);
            updatedProduct.taxRate = itemTax ? itemTax.tax_rate : 0;
          }
          const isDuplicate = products.some(
            (product) => product.id !== id && product.item === value
          );

          if (isDuplicate) {
            alert("You have selected the same item.");
            return product;
          }
        }
        if (field === "tax") {
          const selectedTax = taxFields.find(tax => tax._id === value);
          updatedProduct.taxRate = selectedTax ? selectedTax.tax_rate : 0;
        }
        const price = parseFloat(updatedProduct.price) || 0;
        const quantity = parseInt(updatedProduct.quantity) || 1;
        const taxRate = parseFloat(updatedProduct.taxRate) || 0;
        const subtotal = Math.round(price * quantity);
        const totalTax = Math.round((subtotal * taxRate) / 100);
        updatedProduct.total = Math.round(subtotal + totalTax);
        updatedProduct.totalTax = Math.round(totalTax);
        return updatedProduct;
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { id: products.length + 1, item: "", quantity: 1, price: 0, tax: 0, total: 0, totalTax: 0 },
    ]);
  };

  // Add this function to handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  // Add this calculation function
  const calculateTotals = () => {
    // Calculate subtotal from products
    const subtotal = products.reduce((sum, product) => sum + (product.total), 0);

    // Calculate discount
    let discountAmount = 0;
    if (totals.discountType === 'Percentage') {
      discountAmount = Math.round((subtotal * totals.discount) / 100);
    } else {
      discountAmount = Math.round(parseFloat(totals.discount)) || 0;
    }

    // Calculate tax amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(totals.selectedTaxes.reduce((sum, tax) => {
      return sum + (taxableAmount * (tax.rate / 100));
    }, 0));

    // taxAmount = Math.round(taxAmount);

    // Calculate final total
    // const total = subtotal - discountAmount + taxAmount + (parseFloat(totals.adjustmentAmount) || 0);
    const total = Math.round((subtotal - discountAmount + taxAmount + (parseFloat(totals?.adjustmentAmount) || 0)));

    setTotals(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total,
      discountAmount
    }));
  };

  // Add useEffect to recalculate when products or totals change
  useEffect(() => {
    calculateTotals();
  }, [products, totals.discount, totals.discountType, totals.selectedTaxes, totals.adjustmentAmount]);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleRemoveFile = (index, event) => {
    // Stop event from bubbling up to parent
    event.stopPropagation();
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange2 = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile2 = (index, e) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    const submitData = new FormData();
    for (let i = 0; i < files.length; i++) {
      submitData.append("images", files[i]);
    }
    // Add basic form fields
    submitData.append('cafe', cafeId);
    submitData.append('vendor_id', vendorId);
    submitData.append('delivery_date', formData.date);
    submitData.append('payment_terms', formData.payment_terms);
    submitData.append('reference', formData.reference);
    submitData.append('shipment_preference', formData.shipment_preference);
    submitData.append('description', formData.description);
    submitData.append('internal_team_notes', formData.internal_team_notes);
    submitData.append('delivery_type', formData.delivery_type);

    // Add financial details
    submitData.append('subtotal', totals.subtotal.toString());
    submitData.append('discount_value', totals.discount.toString());
    submitData.append('discount_type', totals.discountType.toLowerCase());

    // Format tax data - just send array of tax IDs
    const taxIds = totals.selectedTaxes.map(tax => tax.id);
    submitData.append('tax', JSON.stringify(taxIds));

    submitData.append('total', totals.total.toString());
    submitData.append('adjustment_note', totals.adjustmentNote);
    submitData.append('adjustment_amount', totals.adjustmentAmount.toString());
    // submitData.append('type', 'PO');

    // Format items data - updated to send tax ID
    const formattedItems = products.map(product => ({
      id: product.item,
      qty: product.quantity,
      hsn: product.hsn || '',
      price: product.price,
      tax: product.tax || '',
      tax_amt: product.totalTax || 0,
      total: product.total
    }));
    submitData.append('items', JSON.stringify(formattedItems));

    // Append files
    files.forEach((file, index) => {
      submitData.append('internal_team_file', file);
    });

    try {
      await dispatch(UpdatePurchaseOrder({ id: id?.id, POData: submitData })).unwrap();
      // Handle success (e.g., redirect to SO list)
      setFormData({
        cafeId: '',
        vendorId: '',
        date: '',
        payment_terms: '',
        reference: '',
        shipment_preference: '',
        description: '',
        internal_team_notes: '',
        delivery_type: "organization",
        subtotal: '',
        total: '',
        taxIds: [],
        adjustmentNote: '',
        adjustmentAmount: '',
      });
    } catch (error) {
      // Handle error
      console.error('Error creating SO:', error);
    }
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
    handleClose();
  };

  return (
    <Container fluid>
      <Breadcrumbs
        items={[
          { label: "Home", path: "/admin/dashboard" },
          { label: "Purchase Order List", path: "/admin/inventory/purchase-order-list" },
          { label: "Purchase Order Update", active: true }
        ]}
      />
      {/* Header Card */}
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

      {/* Client & Delivery Details */}
      <Card className="p-3 shadow-sm">
        <Row>
          <Col sm={4} className="d-flex border-end flex-column gap-2">
            {/* <div className="border-bottom ">
              <div className="d-flex flex-row align-items-center justify-content-around mb-3 gap-2">
                <h5 className="text-muted">Vendor :  </h5>
                <Button
                  style={{ width: "144px", height: "44px", borderStyle: "dashed" }}
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={handleShowVendorList}
                >
                  <span>+</span> Add Vendor
                </Button>
              </div>
            </div> */}

            <div className="d-flex flex-row align-items-center mb-3 gap-2">
              <h5 className="text-muted pt-1">Vendor:</h5>

              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle
                  variant="outline-primary"
                  style={{ width: "144px", height: "30px", borderStyle: "dashed" }}
                  className="d-flex align-items-center justify-content-center"
                >
                  {userType === "Superadmin" ? "StyxCafe" : userType === "Vendor" ? vendorSelected?.name : "Select Vendor"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleShowVendorList}>
                    Add Vendor
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => {
                    setVendorSelected(null);
                    setUserType("Superadmin")
                  }}>
                    StyxCafe
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Row className="mt-3">
              <p>{vendorSelected?.name || "Vendor Name"}</p>
              {/* 
              <Col md={5}>
                <h6 style={{ fontSize: "1rem" }}>Billing Address</h6>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.city1 || "Billing City"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.state1 || "Billing State"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.pincode1 || "Billing Pincode"}</p>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>{vendorSelected?.country1 || "Billing Country"}</p>
              </Col>

              <Col md={5}>
                <h6 style={{ fontSize: "1rem" }}>Shipping Address</h6>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.city2 || "Shipping City"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.state2 || "Shipping State"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.pincode2 || "Shipping Pincode"}</p>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>{vendorSelected?.country2 || "Shipping Country"}</p>
              </Col> */}

              {userType === "Vendor" && <Col md={6}>
                <h6 style={{ fontSize: "1rem" }}>Billing Address</h6>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.city1 || "Billing City"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.state1 || "Billing State"}</p>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>{vendorSelected?.pincode1 || "Billing Pincode"}</p>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>{vendorSelected?.country1 || "Billing Country"}</p>
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
                  style={{ fontWeight: "bold", color: "black" }}
                />
                <Form.Check
                  type="radio"
                  name="delivery_type"
                  label="Customer"
                  value="Customer"
                  checked={formData.delivery_type === "Customer"}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_type: e.target.value })
                  }
                  style={{ fontWeight: "bold", color: "black" }}
                  className="custom-radio-dark"
                />
              </div>

              {formData.delivery_type === "Organization" && (
                <>
                  <p style={{ fontWeight: "bold", marginTop: "30px", color: "black" }} className="mb-1">
                    {userName}
                  </p>
                  <div style={{ marginTop: "15px" }} className="d-flex flex-column gap-2">
                    <p className="mb-1"> {userEmail} / {UserContactN}</p>
                    <p className="mb-1">{UserAddress}</p>
                    <p className="mb-0">PAN: {UesrPAN}</p>
                  </div>
                </>
              )}

              {formData.delivery_type === "Customer" && (
                <>
                  <Form.Select className="my-0">
                    <option>Select Customer</option>
                    {customersList.map((customer, index) => (
                      <option key={index} value={customer.customer_id}>
                        {customer.name}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="my-3">
                    <p className="my-0 mx-2">{customersList?.address}</p>
                    <p className="my-0 mx-2">Customer City,</p>
                    <p className="my-0 mx-2">Customer State,</p>
                    <p className="my-0 mx-2">Customer Country-123456</p>
                  </div>
                </>
              )}
            </div>
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
                  variant="outline-secondary"
                  onClick={() => setShowPaymentTerms(true)}
                  className="end-0 top-0 h-100 px-2"
                >
                  +
                </Button>
              </div>

              <Form.Control
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="Enter Reference"
              />

              <Form.Control
                name="shipment_preference"
                value={formData.shipment_preference}
                onChange={handleInputChange}
                placeholder="Enter Shipment Preference"
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Product Details Card */}
      <Card className="p-3 mt-3 shadow-sm">
        <Table responsive>
          <thead>
            <tr>
              <th className="w-25">PRODUCT</th>
              <th className="w-15">QUANTITY</th>
              <th className="w-15">PRICE</th>
              <th className="w-15">TAX</th>
              <th className="w-30">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>
                  <div className="d-flex gap-2">
                    <Form.Select
                      className="flex-grow-1"
                      style={{ border: "1px solid black", borderStyle: "dashed" }}
                      value={product.item}
                      onChange={(e) => updateProduct(product.id, "item", e.target.value)}
                    >
                      <option value="">Select Item</option>
                      {items.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} (₹{item.costPrice})
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      onClick={handleShowCreateItem}
                      className="flex-shrink-0"
                      style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }}
                      variant="outline-secondary"
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="QTY : 1"
                    style={{ border: "1px solid black", width: "100%" }}
                    value={product.quantity}
                    onChange={(e) => updateProduct(product.id, "quantity", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                  />
                </td>
                <td>
                  <div className="position-relative w-100">
                    <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                      <FaRupeeSign />
                    </span>
                    <Form.Control
                      type="number"
                      placeholder="0.00"
                      className="w-100"
                      style={{ paddingLeft: "25px", border: "1px solid black" }}
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, "price", e.target.value)}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Form.Select
                      className="flex-grow-1"
                      style={{ border: "1px solid black" }}
                      value={product.tax || ""}
                      onChange={(e) => updateProduct(product.id, "tax", e.target.value)}
                    >
                      <option value="">Select Tax</option>
                      {taxFields.map(tax => (
                        <option key={tax._id} value={tax._id}>
                          {tax.tax_name} ({tax.tax_rate}%)
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      className="flex-shrink-0"
                      style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }}
                      variant="outline-secondary"
                      onClick={() => setShowTaxModal(true)}
                    >
                      +
                    </Button>
                  </div>
                  <div className="position-relative w-100 my-3">
                    <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                      <FaRupeeSign />
                    </span>
                    <Form.Control
                      type="text"
                      className="text-end"
                      value={product.totalTax?.toFixed(2) || "0.00"}
                      readOnly
                      style={{ paddingLeft: "25px", border: "1px solid black" }}
                    />
                  </div>
                </td>
                <td>
                  <div className="position-relative w-100">
                    <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                      <FaRupeeSign />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="PRICE : 0.00"
                      className="text-end w-100"
                      style={{ paddingLeft: "25px", border: "1px solid black" }}
                      value={product.total}
                      readOnly
                    />
                  </div>
                </td>
                {index > 0 && (
                  <td>
                    <Button
                      onClick={() => {
                        const updatedProducts = products.filter((_, i) => i !== index);
                        setProducts(updatedProducts);
                      }}
                      className="flex-shrink-0 d-flex justify-content-center align-items-center"
                      style={{ width: "40px", padding: "0px", height: "40px", border: "1px solid black", borderStyle: "dashed" }}
                      variant="outline-danger"
                    >
                      <FaTrash style={{ fontSize: "15px" }} />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>

        <Button
          variant="outline-primary"
          className="mb-4 w-100 w-sm-50 w-md-25"
          style={{ borderStyle: "dashed" }}
          onClick={addProduct}
        >
          <span className="me-2">+</span> Add Product
        </Button>

        <Row>
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Form.Control
              as="textarea"
              rows={7}
              placeholder="Vendor Description & Instruction"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ border: "1px solid gray" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <div className="d-flex flex-column gap-3">
              {/* Subtotal */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Subtotal</span>
                <InputGroup style={{ maxWidth: "200px" }}>
                  <InputGroup.Text><FaRupeeSign /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={totals.subtotal.toFixed(2)}
                    readOnly
                  />
                </InputGroup>
              </div>

              {/* Discount */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>
                  Discount
                  {totals?.discountAmount > 0 && <> &#40;<FaRupeeSign />{totals?.discountAmount}&#41;</>}
                </span>
                <div className="d-flex gap-2" style={{ maxWidth: "200px" }}>
                  <Form.Control
                    type="number"
                    value={totals.discount}
                    onChange={(e) => setTotals(prev => ({ ...prev, discount: e.target.value }))}
                    onWheel={(e) => e.target.blur()}
                    placeholder="0.00"
                  />
                  <Form.Select
                    value={totals.discountType}
                    onChange={(e) => setTotals(prev => ({ ...prev, discountType: e.target.value }))}
                    style={{ width: "70px" }}
                  >
                    <option value="Percentage">%</option>
                    <option value="flat">₹</option>
                  </Form.Select>
                </div>
              </div>

              {/* Tax */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Tax &#40;<FaRupeeSign />{totals.taxAmount.toFixed(2)}&#41;</span>
                <Dropdown style={{ maxWidth: "200px" }}>
                  <Dropdown.Toggle variant="outline-primary" style={{ width: "100%" }}>
                    {totals.selectedTaxes.length ?
                      `${totals.selectedTaxes.reduce((sum, tax) => sum + tax.rate, 0)}% Tax`
                      : '0.00% Tax'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {taxFields.map(tax => (
                      <Dropdown.Item key={tax._id} as="div">
                        <Form.Check
                          type="checkbox"
                          id={`tax-${tax._id}`}
                          label={`${tax.tax_name} (${tax.tax_rate}%)`}
                          checked={totals.selectedTaxes.some(t => t.id === tax._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTotals(prev => ({
                                ...prev,
                                selectedTaxes: [...prev.selectedTaxes, { id: tax._id, rate: tax.tax_rate }]
                              }));
                            } else {
                              setTotals(prev => ({
                                ...prev,
                                selectedTaxes: prev.selectedTaxes.filter(t => t.id !== tax._id)
                              }));
                            }
                          }}
                        />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Total */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Total</span>
                <InputGroup style={{ maxWidth: "200px" }}>
                  <InputGroup.Text><FaRupeeSign /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={totals.total.toFixed(2)}
                    readOnly
                  />
                </InputGroup>
              </div>

              {/* Adjustment */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <Form.Control
                  type="text"
                  placeholder="Adjustment Note"
                  value={totals.adjustmentNote}
                  onChange={(e) => setTotals(prev => ({ ...prev, adjustmentNote: e.target.value }))}
                  style={{ maxWidth: "200px" }}
                />
                <InputGroup style={{ maxWidth: "200px" }}>
                  <InputGroup.Text><FaRupeeSign /></InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Adjustment Amount"
                    value={totals.adjustmentAmount}
                    onChange={(e) => setTotals(prev => ({ ...prev, adjustmentAmount: e.target.value }))}
                    onWheel={(e) => e.target.blur()}
                  />
                </InputGroup>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Terms and Conditions Card */}
      <Card className="p-3 mt-3  shadow-sm">
        <h6>Terms And Condition & Attachments</h6>
        <Row className="mt-3">
          <Col md={12}>
            <Form.Control
              as="textarea"
              rows={9}
              name="internal_team_notes"
              value={formData.internal_team_notes}
              onChange={handleInputChange}
              placeholder="Terms & Condition Notes"
              style={{ border: "1px solid gray" }}
            />
          </Col>

          {/* <Col md={6}>
            <div
              className="rounded d-flex flex-column align-items-center justify-content-center p-4"
              style={{
                minHeight: "200px",
                border: "1px solid black",
                borderStyle: "dashed",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                type="file"
                id="fileInput"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={handleFileChange2}
              />

              <div className="text-center">
                <div className="mb-2">
                  <FaUpload />
                </div>
                <p className="mb-0">Click to upload multiple files (.pdf, .jpg, .jpeg, .png)</p>
              </div>

              <div
                style={{ height: "100px" }}
                className="mt-3 d-flex align-items-end w-100 flex-wrap gap-2"
              >
                {files.map((file, index) => (
                  <div key={index} className="position-relative">
                    {file.type.includes("image") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        onLoad={(e) => {
                          // Cleanup the object URL after the image has loaded
                          const objectUrl = URL.createObjectURL(file);
                          e.target.src = objectUrl;
                          URL.revokeObjectURL(objectUrl);
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <FaFilePdf size={40} />
                      </div>
                    )}
                    <div
                      className="position-absolute end-0"
                      onClick={(e) => handleRemoveFile2(index, e)}
                      style={{ cursor: "pointer", top: "-20px" }}
                    >
                      <MdOutlineRemoveCircleOutline
                        style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col> */}
        </Row>
      </Card>

      <AddClint
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

      {/* Add a submit button */}
      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="primary"
          onClick={handleSubmit}
        // disabled={!selectedClient || products.length === 0}
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};

// export default PurchaseOrderUpdate;

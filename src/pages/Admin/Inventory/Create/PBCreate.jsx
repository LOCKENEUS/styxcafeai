import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Table, Modal, Breadcrumb, BreadcrumbItem, Dropdown } from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { FaFilePdf, FaRupeeSign, FaTrash, FaUpload } from "react-icons/fa";
import { BiArrowToLeft, BiPlus } from "react-icons/bi";
// import  { OffcanvesItemsCreate } from "../Offcanvas/OffcanvesItems";
import OffcanvesItemsNewCreate from "../Offcanvas/OffcanvesItems"
import Tax from "../modal/Tax";
// import AddClint from "../modal/vendorListModal";
import PaymentTermsModal from "../modal/PaymentTermsModal";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CreatePurchaseOrder, GetVendorsList, } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { useDispatch, useSelector } from "react-redux";
import AddClint from "../modal/AddClint";
import VendorsList from "../modal/vendoreListModal";
import { getItems } from "../../../../store/AdminSlice/Inventory/ItemsSlice";
import { getTaxFields } from "../../../../store/AdminSlice/TextFieldSlice";
import { getCustomers } from "../../../../store/AdminSlice/CustomerSlice";
import { addPBill, getPBillById, updatePBill } from "../../../../store/AdminSlice/Inventory/PBillSlice";

const PurchaseBillCreate = () => {
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const [showClientList, setShowClientList] = useState(true);
  const [showOffCanvasCreateItem, setShowOffCanvasCreateItem] = useState(false);
  const handleShowCreateItem = () => setShowOffCanvasCreateItem(true);
  const handleCloseCreateItem = () => setShowOffCanvasCreateItem(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const navigate = useNavigate();

  const [products, setProducts] = useState([
    { id: 1, item: "", quantity: 1, price: 0, tax: 0, total: 0, totalTax: 0 },
  ]);
  const [showProductList, setShowProductList] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const dispatch = useDispatch();
  const { customFields } = useSelector((state) => state.customFields);
  const { taxFields } = useSelector((state) => state.taxFieldSlice);
  const { items, loading } = useSelector((state) => state.items);
  const [showVendorList, setShowVendorList] = useState(false);
  const handleShowVendorList = () => setShowVendorList(true);
  const handleCloseVendorList = () => setShowVendorList(false);
  const [vendorSelected, setVendorSelected] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
 
  const cafeId = user?._id;

  console.log("user ----", user);
  const userName= user?.name;
  const userEmail= user?.email;
  const UserContactN = user?.contact_no;
  const UserAddress = user?.address;
  const UesrPAN = user?.panNo;
  console.log("userName ----", userName);


  // Filter payment terms from custom fields
  const paymentTerms = customFields.filter(field => field.type === 'Payment Terms');

  useEffect(() => {
    dispatch(GetVendorsList(cafeId));
    dispatch(getTaxFields(cafeId));
    dispatch(getItems(cafeId));
  }, [dispatch]);
  const vendorsList = useSelector((state) => state.purchaseOrder?.vendors);
  // const lisgetCustomers = useSelector((state) => state.customers?.customers);
  const { customers, loading: customerLoading } = useSelector((state) => state.customers);
  const customersList = customers?.customers;
  console.log("customersList ========", customersList);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
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

  // Add these new state and calculation functions
  const priceList = {
    "34": 34,
    "3": 3,
    "4": 4,
    "1800": 1800,
  };


  const TaxList = useSelector((state) => state.taxFieldSlice?.taxFields);
  console.log("unit Tax 101", TaxList);

  const calculateTotal = (price, quantity, tax) => {
    const subtotal = Math.round(price * quantity * 100) / 100;
    const totalTax = Math.round((subtotal * tax) / 100 * 100) / 100;
    return { 
      total: Math.round((subtotal + totalTax) * 100) / 100, 
      totalTax: totalTax
    };
  };

  const updateProduct = (id, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };

        if (field === "item") {
          const selectedItem = items.find(item => item._id === value);
          if (selectedItem) {
            updatedProduct.price = Math.round(selectedItem.sellingPrice * 100) / 100;
            updatedProduct.tax = selectedItem.tax;
            const itemTax = taxFields.find(tax => tax._id === selectedItem.tax);
            updatedProduct.taxRate = itemTax ? Math.round(itemTax.tax_rate * 100) / 100 : 0;
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
          updatedProduct.taxRate = selectedTax ? Math.round(selectedTax.tax_rate * 100) / 100 : 0;
        }

        const price = Math.round(parseFloat(updatedProduct.price || 0) * 100) / 100;
        const quantity = parseInt(updatedProduct.quantity) || 1;
        const taxRate = Math.round(parseFloat(updatedProduct.taxRate || 0) * 100) / 100;
        const subtotal = Math.round(price * quantity * 100) / 100;
        const totalTax = Math.round((subtotal * taxRate) / 100 * 100) / 100;
        updatedProduct.total = Math.round((subtotal + totalTax) * 100) / 100;
        updatedProduct.totalTax = totalTax;

        return updatedProduct;
      }
      
      return product;
    });

    setProducts(updatedProducts);
  };

  // Update the addProduct function
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

  // Update the payment terms section in your existing JSX

  // Add the payment terms modal

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    discountType: 'percentage',
    taxAmount: 0,
    selectedTaxes: [],
    total: 0,
    adjustmentNote: '',
    adjustmentAmount: 0
  });

  // Add this calculation function
  const calculateTotals = () => {
    // Calculate subtotal from products
    const subtotal = Math.round(products.reduce((sum, product) => sum + (product.total || 0), 0) * 100) / 100;

    // Calculate discount
    let discountAmount = 0;
    if (totals.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * totals.discount / 100) * 100) / 100;
    } else {
      discountAmount = Math.round(parseFloat(totals.discount || 0) * 100) / 100;
    }

    // Calculate tax amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(totals.selectedTaxes.reduce((sum, tax) => {
      return sum + (taxableAmount * (tax.rate / 100));
    }, 0) * 100) / 100;

    // Calculate final total
    const total = Math.round(subtotal - discountAmount + taxAmount + (parseFloat(totals.adjustmentAmount) || 0));
    console.log("total", total);

    setTotals(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  };

  // Add useEffect to recalculate when products or totals change
  useEffect(() => {
    calculateTotals();
  }, [products, totals.discount, totals.discountType, totals.selectedTaxes, totals.adjustmentAmount]);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

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

  // Add new state for form data
  const [formData, setFormData] = useState({
    vendorId: '',
    delivery_type: "organization",
    date: new Date().toISOString().split('T')[0],
    shipment_date: '',
    payment_terms: '',
    reference: '',
    shipment_preference: '',
    description: '',
    internal_team_notes: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  // Add this useEffect to fetch data when id is present
  useEffect(() => {
    if (id) {
      dispatch(getPBillById(id))
        .unwrap()
        .then((data) => {
          // Set vendor data
          setVendorSelected(data.vendor_id);
          setVendorId(data.vendor_id._id);

          // Set form data including delivery type and customer
          setFormData({
            ...formData,
            delivery_type: data.delivery_type || 'organization',
            date: data.delivery_date || '',
            payment_terms: data.payment_terms || '',
            reference: data.reference || '',
            shipment_preference: data.shipment_preference || '',
            description: data.description || '',
            internal_team_notes: data.internal_team_notes || '',
            customer_id: data.customer_id?._id || ''
          });

          // Set selected customer if delivery type is customer
          if (data.delivery_type === 'customer' && data.customer_id) {
            setSelectedCustomer(data.customer_id);
          }

          // Set products
          if (data.items && data.items.length > 0) {
            const formattedProducts = data.items.map((item, index) => ({
              id: index + 1,
              item: item.item_id._id,
              quantity: item.quantity,
              price: item.price,
              tax: item.tax?._id || '',
              taxRate: item.tax?.tax_rate || 0,
              total: item.total,
              totalTax: item.tax_amt,
              hsn: item.item_id.hsn
            }));
            setProducts(formattedProducts);
          }

          // Set totals
          setTotals({
            subtotal: data.subtotal || 0,
            discount: data.discount_value || 0,
            discountType: data.discount_type || 'percentage',
            taxAmount: data.items.reduce((sum, item) => sum + (item.tax_amt || 0), 0),
            selectedTaxes: data.tax?.map(tax => ({
              id: tax._id,
              rate: tax.tax_rate
            })) || [],
            total: data.total || 0,
            adjustmentNote: data.adjustment_note || '',
            adjustmentAmount: data.adjustment_amount || 0
          });
        })
        .catch((error) => {
          console.error('Error fetching purchase bill:', error);
        });
    }
  }, [id, dispatch]);

  // Update handleSubmit to handle both create and update
  const handleSubmit = async () => {
    const submitData = {
      cafe: cafeId,
      vendor_id: vendorId,
      delivery_type: formData.delivery_type.toLowerCase(),
      delivery_date: formData.date,
      payment_terms: formData.payment_terms,
      reference: formData.reference,
      shipment_preference: formData.shipment_preference,
      description: formData.description,
      internal_team_notes: formData.internal_team_notes,
      // Add customer_id when delivery type is Customer
      ...(formData.delivery_type === "Customer" && { customer_id: formData.customer_id }),
      
      // Financial details
      subtotal: Math.round(totals.subtotal * 100) / 100,
      discount_value: Math.round(totals.discount * 100) / 100,
      discount_type: totals.discountType,
      tax: totals.selectedTaxes.map(tax => tax.id),
      total: Math.round(totals.total * 100) / 100,
      adjustment_note: totals.adjustmentNote,
      adjustment_amount: Math.round(parseFloat(totals.adjustmentAmount || 0) * 100) / 100,

      // Items details
      items: products.map(product => ({
        id: product.item,
        hsn: product.hsn || '',
        qty: parseInt(product.quantity) || 1,
        price: Math.round(parseFloat(product.price || 0) * 100) / 100,
        tax: product.tax || '',
        tax_amt: Math.round(parseFloat(product.totalTax || 0) * 100) / 100,
        total: Math.round(parseFloat(product.total || 0) * 100) / 100
      }))
    };

    try {
      if (id) {
        await dispatch(updatePBill({ id, billData: submitData })).unwrap().then((res) => {
          navigate(`/admin/inventory/PurchaseBillDetails/${res._id}`);
        });
      } else {
        await dispatch(addPBill(submitData)).unwrap().then((res) => {
          navigate(`/admin/inventory/PurchaseBillDetails/${res._id}`);
        });
      }
    } catch (error) {
      console.error('Error saving Purchase Bill:', error);
    }
  };


  // const handleVendorSelect = (newVendor) => {
  //   const selectedVendorId = newVendor;
  //   const selectedVendor = vendorsList.find(
  //     (vendor) => vendor?._id == selectedVendorId
  //   );
  //   if (selectedVendor) {
  //     setVendorSelected(selectedVendor);
  //     setFormData({
  //       ...formData,
  //       vendor_id: selectedVendor?._id,
  //     });
  //     setVendorId(selectedVendor?._id);
  //   }
  //   handleClose();
  //   setVendorId(newVendor._id);
  //   console.log("Selected vendor ID:---", vendorId);
  // };


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
    console.log("Selected vendor ID:---", newVendorId);
  };

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Update the customer selection handler
  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    const customer = customers.find((c) => c._id === customerId);
    setSelectedCustomer(customer);
    setFormData({
      ...formData,
      customer_id: customerId
    });
  };

  return (
    <Container fluid className="p-4">
      <Col sm={12} className="my-3">
        <div style={{ top: "186px", fontSize: "18px" }}>
          <Breadcrumb>
            <BreadcrumbItem >Home</BreadcrumbItem>
            <BreadcrumbItem><Link to="/admin/inventory/purchase-bill-list">Purchase Bill List</Link></BreadcrumbItem>
            <BreadcrumbItem active>Purchase Bill Create</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </Col>
      {/* Header Card */}
      {/* <Card className="p-3 mb-3 shadow-sm">
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
      </Card> */}

      {/* Client & Delivery Details */}
      <Card className="p-3 shadow-sm">
        <Row>
          <Col sm={4} className="d-flex border-end flex-column gap-2">
            <div className="border-bottom ">
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
            </div>
            <Row className="mt-3">
              <p style={{fontSize:"1.2rem" , fontWeight:"600"}} className="text-primary">{vendorSelected?.name || "Vendor Name"}</p>

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
              </Col>
            </Row>


          </Col>

          <Col sm={4}>
            <div className="d-flex my-3 flex-row align-items-center gap-2">
              <h5 className="text-muted">Delivery Address <span className="text-danger">*</span></h5>

            </div>


            <div >
              {/* Radio Buttons */}
              <div className="d-flex flex-row mb-2 align-items-center gap-2">
              <Form.Check
                checked={formData.delivery_type === "organization"}
                type="radio"
                name="delivery_type" 
                label="Organization"
                value="organization"
                onChange={(e) =>
                  setFormData({ ...formData, delivery_type: e.target.value })
                }
                style={{ fontWeight: "bold", color: "black" }}
                // check by default
                defaultChecked

              />
              <Form.Check
                type="radio"
                name="delivery_type"
                label="Customer"
                value="customer"
                checked={formData.delivery_type === "customer"}
                onChange={(e) =>
                  setFormData({ ...formData, delivery_type: e.target.value })
                }
                style={{ fontWeight: "bold", color: "black" }}
              />
              </div>


              {formData.delivery_type === "organization" && (
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

              {formData.delivery_type === "customer" && (
                <>
                  <Form.Select 
                    className="my-3" 
                    onChange={handleCustomerSelect}
                    value={selectedCustomer?._id || ''}
                  >
                    <option value="">Select Customer</option>
                    {customers && customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="my-3">
                    {selectedCustomer ? (
                      <>
                        <p style={{ fontWeight: "bold", color: "black" }} className="mb-1">
                          {selectedCustomer.name}
                        </p>
                        <div style={{ marginTop: "15px" }} className="d-flex flex-column gap-2">
                          <p className="mb-1">{selectedCustomer.email} / {selectedCustomer.contact_no}</p>
                          <p className="mb-1">{selectedCustomer.address}</p>
                          <p className="mb-1">{selectedCustomer.city}, {selectedCustomer.state}</p>
                          <p className="mb-0">{selectedCustomer.country} - {selectedCustomer.pincode}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted mb-0">Select a customer to view their details</p>
                    )}
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
                  value={formData.date || new Date().toISOString().split('T')[0]}
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
                    <option key={term._id} value={term._id}>
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
                          {item.name} (₹{item.sellingPrice})
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
                <span>Discount</span>
                <div className="d-flex gap-2" style={{ maxWidth: "200px" }}>
                  <Form.Control
                    type="number"
                    value={totals.discount}
                    onChange={(e) => setTotals(prev => ({ ...prev, discount: e.target.value }))}
                    placeholder="0.00"
                  />
                  <Form.Select
                    value={totals.discountType}
                    onChange={(e) => setTotals(prev => ({ ...prev, discountType: e.target.value }))}
                    style={{ width: "70px" }}
                  >
                    <option value="percentage">%</option>
                    <option value="flat">₹</option>
                  </Form.Select>
                </div>
              </div>

              {/* Tax */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Tax ₹{totals.taxAmount.toFixed(2)}</span>
                <Dropdown style={{ maxWidth: "200px" }}>
                  <Dropdown.Toggle variant="outline-primary" style={{ width: "100%" }}>
                    {totals.selectedTaxes.length ?
 `${totals.selectedTaxes.reduce((sum, tax) => sum + tax.rate, 0)}%` :                      '0.00% Tax'}
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
        >
          {id ? 'Update' : 'Submit'}
        </Button>
      </div>

      

    </Container>
  );
};

export default PurchaseBillCreate;

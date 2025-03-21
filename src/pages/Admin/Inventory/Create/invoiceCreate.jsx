import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Table,
  Modal,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
} from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { FaCheck, FaRupeeSign, FaTrash, FaUpload, FaFilePdf } from "react-icons/fa";
import { BiArrowToLeft, BiPlus } from "react-icons/bi";
import OffcanvesItemsNewCreate from "../Offcanvas/OffcanvesItems"
import Tax from "../modal/Tax";
import AddClint from "../modal/AddClint";
import PaymentTermsModal from "../modal/PaymentTermsModal";
import { Link } from "react-router-dom";
import AddressModal from "../modal/AddressModal";
import { useDispatch, useSelector } from 'react-redux';
import { getCustomFields } from '../../../../store/AdminSlice/CustomField';
import { getTaxFields } from '../../../../store/AdminSlice/TextFieldSlice';
import { getItems } from '../../../../store/AdminSlice/Inventory/ItemsSlice';
import { MdOutlineRemoveCircleOutline } from "react-icons/md";


export const InvoiceCreate =()=>{
  const [show, setShow] = useState(false);
  const [showClientList, setShowClientList] = useState(true);
  const [showOffCanvasCreateItem, setShowOffCanvasCreateItem] = useState(false);
  const handleShowCreateItem = () => setShowOffCanvasCreateItem(true);
  const handleCloseCreateItem = () => setShowOffCanvasCreateItem(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [products, setProducts] = useState([
    { id: 1, item: "", quantity: 1, price: 0, tax: 0, total: 0, totalTax: 0 },
  ]);
  const [showProductList, setShowProductList] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const dispatch = useDispatch();
  const { customFields } = useSelector((state) => state.customFields);
  const { taxFields } = useSelector((state) => state.taxFieldSlice);
  const { items, loading } = useSelector((state) => state.items);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  
  // Filter payment terms from custom fields
  const paymentTerms = customFields.filter(field => field.type === 'Payment Terms');

  useEffect(() => {
    dispatch(getCustomFields(cafeId));
    dispatch(getTaxFields(cafeId));
    dispatch(getItems(cafeId));
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

  const calculateTotal = (price, quantity, tax) => {
    const subtotal = price * quantity;
    const totalTax = (subtotal * tax) / 100;
    return { total: subtotal + totalTax, totalTax };
  };

  const updateProduct = (id, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };

        if (field === "item") {
          const selectedItem = items.find(item => item._id === value);
          if (selectedItem) {
            updatedProduct.price = selectedItem.sellingPrice;
            updatedProduct.tax = selectedItem.tax;
            const itemTax = taxFields.find(tax => tax._id === selectedItem.tax);
            updatedProduct.taxRate = itemTax ? itemTax.tax_rate : 0;
          }
        }

        if (field === "tax") {
          const selectedTax = taxFields.find(tax => tax._id === value);
          updatedProduct.taxRate = selectedTax ? selectedTax.tax_rate : 0;
        }

        const price = parseFloat(updatedProduct.price) || 0;
        const quantity = parseInt(updatedProduct.quantity) || 1;
        const taxRate = parseFloat(updatedProduct.taxRate) || 0;

        const subtotal = price * quantity;
        const totalTax = (subtotal * taxRate) / 100;
        updatedProduct.total = subtotal + totalTax;
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
    discountType: 'Percentage',
    taxAmount: 0,
    selectedTaxes: [],
    total: 0,
    adjustmentNote: '',
    adjustmentAmount: 0
  });

  // Add this calculation function
  const calculateTotals = () => {
    // Calculate subtotal from products
    const subtotal = products.reduce((sum, product) => sum + (product.total), 0);
    
    // Calculate discount
    let discountAmount = 0;
    if (totals.discountType === 'Percentage') {
      discountAmount = (subtotal * totals.discount) / 100;
    } else {
      discountAmount = parseFloat(totals.discount) || 0;
    }

    // Calculate tax amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = totals.selectedTaxes.reduce((sum, tax) => {
      return sum + (taxableAmount * (tax.rate / 100));
    }, 0);

    // Calculate final total
    const total = subtotal - discountAmount + taxAmount + (parseFloat(totals.adjustmentAmount) || 0);

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

  // Add these state variables at the top with other useState declarations
  const [files, setFiles] = useState([]);

  // Add these handler functions before the return statement
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index, event) => {
    event.stopPropagation();
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container fluid className="p-4">
      <Col sm={12} className="my-3">
        <div style={{ top: "186px", fontSize: "18px" }}>
          <Breadcrumb>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>
              <Link  to="/admin/Inventory/SalesOrder">
               Sales Order List
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Sales Order Create</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </Col>
      {/* Header Card */}
      <Card className="p-3 mb-3 shadow-sm">
        <Row className="align-items-center">
          <Col xs={2}>
            <img src={Lockenelogo} alt="Logo" className="img-fluid" />
          </Col>
          <Col>
            <h5>Linganwar</h5>
            <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
            <p className="mb-1">
              Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra,
              India
            </p>
            <strong>PAN: ADNP5467B</strong>
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
          <Col md={6} className="d-flex border-end flex-column gap-2">
            <div className="border-bottom ">
              <div className="d-flex flex-row align-items-center mb-3 gap-2">
                <h5 className="text-muted me-2">Client Name Here</h5>
                <Button
                  style={{
                    width: "144px",
                    height: "44px",
                    borderStyle: "dashed",
                  }}
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={handleShow}
                >
                  <span> { selectedClient ? <FaCheck/> : <BiPlus/>}</span>
                  { selectedClient ? "Client" : "Add Client"}
                </Button>
              </div>
            </div>
            <Row className="mt-3"> 
              <Col style={{ fontSize: "1rem" , color:"black" }} md={5}>
                {selectedClient ? selectedClient.name : "Client Name"}
              </Col>
              <Col style={{ fontSize: "1rem", color:"black" }} md={7}>
                {selectedClient 
                  ? `${selectedClient.email} / ${selectedClient.contact_no}`
                  : "example@gmail.com / 00-0000-0000"}
              </Col>
            </Row>

            <Row className="mt-3 justify-content-center ">
              <Col className="" md={12}>
                <h6
                  className="d-flex align-items-center"
                  style={{ fontSize: "1rem" }}
                >
                  {" "}
                  <span style={{ marginRight: "10px" }}>
                    Billing Address
                  </span>{" "}
                  <Button
                    onClick={() => setShowAddressModal(true)}
                    style={{ borderStyle: "dashed" }}
                    variant="outline-primary"
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    +
                  </Button>{" "}
                </h6>
                <AddressModal 
                  show={showAddressModal} 
                  handleClose={() => setShowAddressModal(false)} 
                />
                <p style={{ fontSize: "0.9rem" }} className="mb-1">
                  {selectedClient ? selectedClient.address : "Address"}
                </p>
                <p style={{ fontSize: "0.9rem" }} className="mb-1">
                  {selectedClient ? selectedClient.city : "City"}
                </p>
                <p style={{ fontSize: "0.9rem" }} className="mb-0">
                  {selectedClient ? selectedClient.state : "State"}
                </p>
              </Col>
            </Row>
          </Col>

          <Col md={6} style={{ marginTop: "2rem" }}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex flex-row align-items-center gap-2">
                <Form.Control
                  type="text"
                  style={{
                    border: "1px solid black",
                    height: "44px",
                    borderStyle: "dashed",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  placeholder="Date"
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.type = 'text'
                    }
                  }}
                />
              </div>

              {/* <div className="d-flex flex-row align-items-center gap-2">
                <Form.Control
                  type="text"
                  style={{
                    border: "1px solid black",
                    height: "44px",
                    borderStyle: "dashed",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  placeholder="Expected Shipment"
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.type = 'text'
                    }
                  }}
                />
              </div> */}

              <div className="d-flex flex-row align-items-center gap-2">
                <Form.Select
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
                style={{ border: "1px solid black", height: "44px" }}
                placeholder="Enter Reference"
              />

              <Form.Control
                style={{ border: "1px solid black", height: "44px" }}
                placeholder="Enter Shipment Preference"
              />

              <Form.Select
                style={{
                  border: "1px solid black",
                  height: "44px",
                  borderStyle: "dashed",
                }}
              >
                <option>Select Sale Person</option>
                <option>Super Admin</option>
              </Form.Select>
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
                    <option value="Percentage">%</option>
                    <option value="Fixed">₹</option>
                  </Form.Select>
                </div>
              </div>

              {/* Tax */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <span>Tax ₹{totals.taxAmount.toFixed(2)}</span>
                <Dropdown style={{ maxWidth: "200px" }}>
                  <Dropdown.Toggle variant="outline-primary" style={{ width: "100%" }}>
                    {totals.selectedTaxes.length ? 
                      totals.selectedTaxes.map(tax => `${tax.rate}%`).join(', ') : 
                      '0.00% Tax'}
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
          <Col md={6}>
            <Form.Control
              as="textarea"
              rows={9}
              placeholder="Terms & Condition Notes"
              style={{ border: "1px solid gray" }}
            />
          </Col>

          <Col className="" md={6}>
            <div
              className="rounded d-flex flex-column align-items-center justify-content-center p-4"
              style={{
                minHeight: "200px",
                border: "1px solid black",
                borderStyle: "dashed",
                cursor: "pointer"
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                type="file"
                id="fileInput"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              <div className="text-center">
                <div className="mb-2">
                  <FaUpload />
                </div>
                <p className="mb-0">
                  Click to upload multiple files (.pdf, .jpg, .jpeg, .png)
                </p>
              </div>
              <div style={{height:"100px"}} className="mt-3 d-flex align-items-end w-100 flex-wrap gap-2">
                {files.map((file, index) => (
                  <div key={index} className="position-relative">
                    {file.type.includes('image') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light" 
                           style={{ width: '50px', height: '50px' }}>
                        <FaFilePdf size={40} />
                      </div>
                    )}
                    <div
                      className="position-absolute end-0"
                      onClick={(e) => handleRemoveFile(index, e)}
                      style={{ cursor: 'pointer', top:"-20px" }}
                    >
                      <MdOutlineRemoveCircleOutline style={{color:"red", fontWeight:"bold", fontSize:"20px"}} /> 
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
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
    </Container>
  )
}
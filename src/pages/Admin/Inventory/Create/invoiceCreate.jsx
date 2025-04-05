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
import { FaCheck, FaRupeeSign, FaTrash} from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import OffcanvesItemsNewCreate from "../Offcanvas/OffcanvesItems"
import Tax from "../modal/Tax";
import AddClint from "../modal/AddClint";
import PaymentTermsModal from "../modal/PaymentTermsModal";
import { Link, useParams, useNavigate } from "react-router-dom";
import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';
import { getCustomFields } from '../../../../store/AdminSlice/CustomField';
import { getTaxFields } from '../../../../store/AdminSlice/TextFieldSlice';
import { getItems } from '../../../../store/AdminSlice/Inventory/ItemsSlice';
// import { addSO, getSOById, updateSO } from '../../../../store/AdminSlice/Inventory/SoSlice';
import { addSOInvoice ,updateSOInvoice,getSOInvoiceById } from '../../../../store/AdminSlice/Inventory/SoInvoiceSlice';

export const InvoiceCreate =()=>{
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [show, setShow] = useState(false);

  const [showClientList, setShowClientList] = useState(true);
  const [showOffCanvasCreateItem, setShowOffCanvasCreateItem] = useState(false);
  const handleShowCreateItem = () => setShowOffCanvasCreateItem(true);
  const handleCloseCreateItem = () => setShowOffCanvasCreateItem(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);

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
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  

  // Add this new state for validation errors
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(getCustomFields(cafeId));
    dispatch(getTaxFields(cafeId));
    dispatch(getItems(cafeId));
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getSOInvoiceById(id))
        .unwrap()
        .then((soData) => {
          console.log("SO Data received:", soData);
          
          setFormData({
            date: soData.date ? new Date(soData.date).toISOString().split('T')[0] : '',
            payment_terms: soData.payment_terms || '',
            reference: soData.reference || '',
            sales_person: soData.sales_person || '',
            description: soData.description || '',
            internal_team_notes: soData.internal_team_notes || ''
          });
          
          if (soData.customer_id) {
            setSelectedClient(soData.customer_id);
          }
          
          if (soData.items && soData.items.length > 0) {
            const formattedProducts = soData.items.map((item, index) => {
              // Handle tax object, tax ID, or null tax
              const taxId = item.tax ? 
                (typeof item.tax === 'object' ? item.tax._id : item.tax) : 
                '';
              
              const taxRate = item.tax ? 
                (typeof item.tax === 'object' ? 
                  item.tax.tax_rate : 
                  taxFields.find(t => t._id === item.tax)?.tax_rate || 0) :
                0;
              
              return {
                id: index + 1,
                item: item.item_id?._id || '', 
                itemName: item.item_id?.name || '',
                quantity: item.quantity || 1,
                price: item.price || 0,
                tax: taxId, // Will be empty string if tax is null
                taxRate: taxRate,
                total: item.total || 0,
                totalTax: item.tax_amt || 0,
                hsn: item.hsn || ''
              };
            });
            setProducts(formattedProducts);
          }
          
          // Set tax totals
          setTotals({
            subtotal: soData.subtotal || 0,
            discount: soData.discount_value || 0,
            discountType: soData.discount_type === 'flat' ? 'flat' : 'Percentage',
            taxAmount: soData.tax?.reduce((sum, tax) => sum + (soData.subtotal * (tax.tax_rate / 100)), 0) || 0,
            selectedTaxes: soData.tax?.map(tax => ({ id: tax._id, rate: tax.tax_rate })) || [],
            total: soData.total || 0,
            adjustmentNote: soData.adjustment_note || '',
            adjustmentAmount: soData.adjustment_amount || 0
          });
          
          if (soData.internal_team_file && soData.internal_team_file.length > 0) {
            // Handle existing files if needed
          }
        })
        .catch((error) => {
          console.error('Error fetching SO data:', error);
        });
    }
  }, [dispatch, id, isEditMode, taxFields]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setShowClientList(true);
  };

  // Add these new handler functions
  const handlePaymentTermCreated = (newTerm) => {
    setLatestPaymentTerm(newTerm);
    // Automatically set the new payment term in the form
    setFormData(prev => ({
      ...prev,
      payment_terms: newTerm.name
    }));
  };

  const handleTaxCreated = (newTax) => {
    // Update the current product's tax field with the newly created tax
    const updatedProducts = products.map(product => {
      if (product.id === products[products.length - 1].id) {
        return {
          ...product,
          tax: newTax.id,
          taxRate: parseFloat(newTax.rate),
          totalTax: Math.round((product.price * product.quantity * newTax.rate) / 100),
          total: product.price * product.quantity + Math.round((product.price * product.quantity * newTax.rate) / 100)
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);

    // Also add the new tax to selected taxes for the total calculation
    setTotals(prev => ({
      ...prev,
      selectedTaxes: [...prev.selectedTaxes, { id: newTax.id, rate: parseFloat(newTax.rate) }]
    }));
  };

  // Add these new state and calculation functions
  const priceList = {
    "34": 34,
    "3": 3,
    "4": 4,
    "1800": 1800,
  };

  const formatItemsForSelect = (items) => {
    return items.map(item => ({
      value: item._id,
      label: `${item.name} (₹${item.sellingPrice})`,
      price: item.sellingPrice,
      tax: item.tax
    }));
  };

  const updateProduct = (id, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };

        if (field === "item") {
          const selectedItem = items.find(item => item._id === value);
          if (selectedItem) {
            updatedProduct.price = selectedItem.sellingPrice;
            updatedProduct.tax = selectedItem.tax || '';
            const itemTax = selectedItem.tax ? taxFields.find(tax => tax._id === selectedItem.tax) : null;
            updatedProduct.taxRate = itemTax ? itemTax.tax_rate : 0;
          }
        }

        if (field === "tax") {
          const selectedTax = value ? taxFields.find(tax => tax._id === value) : null;
          updatedProduct.taxRate = selectedTax ? selectedTax.tax_rate : 0;
        }

        // Ensure quantity is at least 1
        const quantity = field === "quantity" ? 
          (parseInt(value) || 1) : // If updating quantity, use input value or 1 if invalid
          (parseInt(updatedProduct.quantity) || 1); // Otherwise use existing quantity or 1 if invalid
        
        updatedProduct.quantity = quantity;

        const price = parseFloat(updatedProduct.price) || 0;
        const taxRate = parseFloat(updatedProduct.taxRate) || 0;

        const subtotal = price * quantity;
        const totalTax = Math.round((subtotal * taxRate) / 100);
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
      { 
        id: products.length + 1, 
        item: "", 
        quantity: 1,  // Always set default quantity to 1
        price: 0, 
        tax: "", 
        total: 0, 
        totalTax: 0 
      },
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
      discountAmount = Math.round((subtotal * totals.discount) / 100);
    } else {
      discountAmount = Math.round(parseFloat(totals.discount) || 0);
    }

    // Calculate tax amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(totals.selectedTaxes.reduce((sum, tax) => {
      return sum + (taxableAmount * (tax.rate / 100));
    }, 0));

    // Calculate final total
    const total = subtotal - discountAmount + taxAmount + Math.round(parseFloat(totals.adjustmentAmount) || 0);

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

  const [files, setFiles] = useState([]);



  const handleRemoveFile = (index, event) => {
    // Stop event from bubbling up to parent
    event.stopPropagation();
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Add new state for form data
  const [formData, setFormData] = useState({
    date: '',
    shipment_date: '',
    payment_terms: '',
    reference: '',
    delivery_preference: '',
    sales_person: '',
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

  // Add this new state for the validation modal
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Update the handleSubmit function
  const handleSubmit = async () => {
    // Validate all products have items selected
    let hasErrors = false;
    const newValidationErrors = {};

    // Check if client is selected
    if (!selectedClient) {
      setShowValidationModal(true);
      return;
    }

    // Validate products
    products.forEach(product => {
      if (!product.item) {
        hasErrors = true;
        newValidationErrors[`product-${product.id}`] = 'Product selection is required';
      }
    });

    if (hasErrors) {
      setValidationErrors(newValidationErrors);
      return;
    }

    // Create simple JSON object
    const submitData = {
      cafe: cafeId,
      customer_id: selectedClient?._id || '',
      date: formData.date,
      payment_terms: formData.payment_terms,
      reference: formData.reference,
      sales_person: formData.sales_person,
      description: formData.description,
      internal_team_notes: formData.internal_team_notes,
      subtotal: totals.subtotal,
      discount_value: totals.discount,
      discount_type: totals.discountType.toLowerCase(),
      tax: totals.selectedTaxes.map(tax => tax.id),
      total: totals.total,
      adjustment_note: totals.adjustmentNote,
      adjustment_amount: totals.adjustmentAmount,
      type: 'SI',
      items: products.map(product => ({
        id: product.item,
        qty: product.quantity,
        hsn: product.hsn || '',
        price: product.price,
        tax: product.tax || '',
        tax_amt: product.totalTax || 0,
        total: product.total
      }))
    };

    try {
      if (isEditMode) {
        await dispatch(updateSOInvoice({ id, invoiceData: submitData })).unwrap();
      } else {
        await dispatch(addSOInvoice(submitData)).unwrap();
      }
      navigate('/admin/Inventory/SaleInvoice');
    } catch (error) {
      console.error('Error with Sales Order:', error);
    }
  };

  // Update the page title based on mode
  const pageTitle = isEditMode ? "Edit Sales Order" : "Create Sales Order";
  
  return (
    <Container fluid className="p-4">
    <Col sm={12} className="my-3">
      <div style={{ top: "186px", fontSize: "18px" }}>
        <Breadcrumb>
          <BreadcrumbItem>
          <Link to={'/admin/dashboard'} >
          Home
          </Link>
           </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/admin/Inventory/SaleInvoice">
              Sales Invoice List
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>{pageTitle}</BreadcrumbItem>
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
            <h5>{user?.name}</h5>
            <p className="mb-1">{user?.email} / {user?.contact_no}</p>
            <p className="mb-1">
              {user?.address}
            </p>
            <strong>PAN: {user?.panNo}</strong>
          </Col>
          <Col xs={2} className="text-end">
            <span className="text-muted">SO:</span>
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
              </h6>
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
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Date"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text'
                }}
              />
            </div>

            {/* <div className="d-flex flex-row align-items-center gap-2">
              <Form.Control
                type="text"
                name="shipment_date"
                value={formData.shipment_date}
                onChange={handleInputChange}
                placeholder="Expected Shipment"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text'
                }}
              />
            </div> */}

            {/* <div className="d-flex flex-row align-items-center gap-2">
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
            </div> */}

            {/* <Form.Control
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              placeholder="Enter Reference"
            /> */}

            {/* <Form.Control
              name="delivery_preference"
              value={formData.delivery_preference}
              onChange={handleInputChange}
              placeholder="Enter Shipment Preference"
            /> */}

            <Form.Select
              name="sales_person"
              value={formData.sales_person}
              onChange={handleInputChange}
            >
              <option value="">Select Sale Person</option>
              <option value="Super Admin">Super Admin</option>
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
                <div className="d-flex gap-2 flex-column">
                  <div className="d-flex gap-2">
                    <div className="flex-grow-1">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Select Item *"
                        isClearable={true}
                        isSearchable={true}
                        name={`item-${product.id}`}
                        options={formatItemsForSelect(items)}
                        value={
                          product.item
                            ? formatItemsForSelect(items).find(option => option.value === product.item) ||
                              (product.itemName ? { value: product.item, label: product.itemName } : null)
                            : null
                        }
                        onChange={(selectedOption) => {
                          updateProduct(
                            product.id,
                            "item",
                            selectedOption ? selectedOption.value : ""
                          );
                          if (selectedOption) {
                            setValidationErrors(prev => ({
                              ...prev,
                              [`product-${product.id}`]: null
                            }));
                          }
                        }}
                        onBlur={() => {
                          if (!product.item) {
                            setValidationErrors(prev => ({
                              ...prev,
                              [`product-${product.id}`]: 'Product selection is required'
                            }));
                          }
                        }}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: validationErrors[`product-${product.id}`] ? 'red' : 'black',
                            borderStyle: 'dashed',
                            borderWidth: '1px',
                            '&:hover': {
                              borderColor: validationErrors[`product-${product.id}`] ? 'red' : 'black'
                            }
                          }),
                          placeholder: (baseStyles) => ({
                            ...baseStyles,
                            color: '#6c757d'
                          }),
                          input: (baseStyles) => ({
                            ...baseStyles,
                            color: 'black'
                          }),
                          singleValue: (baseStyles) => ({
                            ...baseStyles,
                            color: 'black'
                          }),
                          option: (baseStyles, { isFocused, isSelected }) => ({
                            ...baseStyles,
                            backgroundColor: isSelected 
                              ? '#0d6efd' 
                              : isFocused 
                              ? '#e9ecef' 
                              : null,
                            color: isSelected ? 'white' : 'black',
                            ':active': {
                              backgroundColor: '#0d6efd',
                              color: 'white'
                            }
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            position: 'absolute',
                            width: '100%',
                            maxWidth: '400px',
                            zIndex: 9999,
                          }),
                          menuList: (baseStyles) => ({
                            ...baseStyles,
                            maxHeight: '200px',
                            overflowY: 'auto',
                          })
                        }}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <Button
                      onClick={handleShowCreateItem}
                      className="flex-shrink-0"
                      style={{ 
                        width: "40px", 
                        height: "38px",
                        border: "1px solid black", 
                        borderStyle: "dashed",
                        marginTop: "auto" 
                      }}
                      variant="outline-secondary"
                    >
                      +
                    </Button>
                  </div>
                  {validationErrors[`product-${product.id}`] && (
                    <div style={{ color: 'red', fontSize: '0.875rem' }}>
                      {validationErrors[`product-${product.id}`]}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <Form.Control
                required
                  type="number"
                  min="1"
                  placeholder="QTY : 1"
                  style={{ border: "1px solid black", width: "100%" }}
                  value={product.quantity}
                  onChange={(e) => updateProduct(product.id, "quantity", e.target.value || 1)}
                  onBlur={(e) => {
                    if (!e.target.value || e.target.value < 1) {
                      updateProduct(product.id, "quantity", 1);
                    }
                  }}
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
                  <option value="Percentage">%</option>
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
 `${totals.selectedTaxes.reduce((sum, tax) => sum + tax.rate, 0)}%` :                    '0.00% Tax'}
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
            {/* Add a Attachment */}
        {/* <Col className="" md={6}>
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
                    className="position-absolute  end-0"
                    onClick={(e) => handleRemoveFile(index, e)}
                    style={{ cursor: 'pointer', top:"-20px" }}
                  >
                    <MdOutlineRemoveCircleOutline style={{color:"red", fontWeight:"bold", fontSize:"20px"}} /> 
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

    <Tax 
      show={showTaxModal} 
      handleClose={() => setShowTaxModal(false)}
      onCreated={handleTaxCreated}
    />
    <OffcanvesItemsNewCreate 
      showOffCanvasCreateItem={showOffCanvasCreateItem} 
      handleCloseCreateItem={handleCloseCreateItem} 
    />

    {/* Add a submit button */}
    <div className="d-flex justify-content-end mt-3">
      <Button
        variant="primary"
        onClick={handleSubmit}
      >
        {isEditMode ? "Update Sales Order" : "Create Sales Order"}
      </Button>
    </div>

    {/* Validation Modal */}
    <Modal 
      show={showValidationModal} 
      onHide={() => setShowValidationModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Required Field Missing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please select a client before creating the invoice.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => {
          setShowValidationModal(false);
          handleShow(); // Open the client selection modal
        }}>
          Add Client
        </Button>
        <Button variant="secondary" onClick={() => setShowValidationModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

  </Container>
  )
}
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
  Spinner,
} from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { FaCheck, FaRupeeSign, FaTrash, FaUpload, FaFilePdf } from "react-icons/fa";
import { BiArrowToLeft, BiPlus } from "react-icons/bi";
import OffcanvesItemsNewCreate from "../Offcanvas/OffcanvesItems"
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import Select from 'react-select';
import { TaxModal } from "../modal/tax";
import AddCafe from "../modal/addCafe";
import { getItems } from "../../../../store/slices/inventory";
import { getTaxes } from "../../../../store/slices/tax";
import { fetchCafes } from "../../../../store/slices/cafeSlice";
import { getSaCustomFields } from "../../../../store/slices/Inventory/customField";
import { createSalesInvoice, getSalesInvoiceDetails, updateSalesInvoice } from "../../../../store/slices/Inventory/invoiceSlice";

export const CreateSalesInv = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [show, setShow] = useState(false);
  const [showClientList, setShowClientList] = useState(true);
  const [showOffCanvasCreateItem, setShowOffCanvasCreateItem] = useState(false);
  const handleShowCreateItem = () => setShowOffCanvasCreateItem(true);
  const handleCloseCreateItem = () => setShowOffCanvasCreateItem(false);

  const [products, setProducts] = useState([
    { id: 1, item: "", quantity: 1, price: 0, tax: 0, total: 0, totalTax: 0 },
  ]);
  const [showProductList, setShowProductList] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const dispatch = useDispatch();
  const { customFields } = useSelector((state) => state.customFields);
  const items = useSelector((state) => state.inventorySuperAdmin.it);

  const { taxFields } = useSelector((state) => state.taxFieldSlice);
  const { loading } = useSelector((state) => state.inventorySuperAdmin);
  const user = JSON.parse(localStorage.getItem("user"));
  const cafeId = user?._id;
  const [latestTax, setLatestTax] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1200;
      setIsMobile(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update the handleTaxCreated function in SOCreate component
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

  useEffect(() => {
    dispatch(getTaxes())
    dispatch(fetchCafes());
    dispatch(getItems());
    dispatch(getSaCustomFields());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getSalesInvoiceDetails(id))
        .unwrap()
        .then((soData) => {
          setFormData({
            date: soData.date ? new Date(soData.date).toISOString().split('T')[0] : '',
            shipment_date: soData.shipment_date ? new Date(soData.shipment_date).toISOString().split('T')[0] : '',
            payment_terms: soData.payment_terms || '',
            reference: soData.reference || '',
            delivery_preference: soData.delivery_preference || '',
            sales_person: soData.sales_person || '',
            description: soData.description || '',
            internal_team_notes: soData.internal_team_notes || ''
          });

          if (soData.customer_id) {
            setSelectedCafe(soData.customer_id);
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

  const updateProduct = (id, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };

        if (field === "item") {
          const selectedItem = items.find(item => item._id === value);
          if (selectedItem) {
            updatedProduct.price = selectedItem.sellingPrice;
            // Handle null tax case
            updatedProduct.tax = selectedItem.tax._id || ''; // Set empty string if tax is null
            const itemTax = selectedItem.tax ? taxFields.find(tax => tax._id === selectedItem.tax._id) : null;
            updatedProduct.taxRate = itemTax ? itemTax.tax_rate : 0;
          }
        }

        if (field === "tax") {
          const selectedTax = value ? taxFields.find(tax => tax._id === value) : null;
          updatedProduct.taxRate = selectedTax ? selectedTax.tax_rate : 0;
        }

        const price = parseFloat(updatedProduct.price) || 0;
        const quantity = parseInt(updatedProduct.quantity) || 1;
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
      { id: products.length + 1, item: "", quantity: 1, price: 0, tax: 0, total: 0, totalTax: 0 },
    ]);
  };

  // Add this function to handle client selection
  const handleClientSelect = (client) => {
    setSelectedCafe(client);
  };

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

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index, event) => {
    // Stop event from bubbling up to parent
    event.stopPropagation();
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Add new state for form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
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

  // Add this new state for validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Update the handleSubmit function
  const handleSubmit = async () => {
    // Validate all products have items selected
    let hasErrors = false;
    const newValidationErrors = {};

    // Check if client is selected
    if (!selectedCafe) {
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

    const submitData = new FormData();
    // Add basic form fields
    submitData.append('customer_id', selectedCafe?._id || '');
    submitData.append('date', formData.date);
    submitData.append('shipment_date', formData.shipment_date);
    submitData.append('payment_terms', formData.payment_terms);
    submitData.append('reference', formData.reference);
    submitData.append('delivery_preference', formData.delivery_preference);
    submitData.append('sales_person', formData.sales_person);
    submitData.append('description', formData.description);
    submitData.append('internal_team_notes', formData.internal_team_notes);

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
    submitData.append('type', 'SO');

    // Format items data - updated to send tax ID
    const formattedItems = products.map(product => ({
      id: product.item,
      qty: product.quantity,
      hsn: product.hsn || '',
      price: product.price,
      tax: product.tax || '', // Send the tax ID instead of tax rate
      tax_amt: product.totalTax || 0,
      total: product.total
    }));
    submitData.append('items', JSON.stringify(formattedItems));

    // Append files
    files.forEach((file, index) => {
      submitData.append('internal_team_file', file);
    });

    try {
      setSubmitLoading(true);
      if (isEditMode) {
        const res = await dispatch(updateSalesInvoice({ id, siData: submitData })).unwrap();
        if (res?._id) {
          navigate(`/Inventory/SaleInvoice/View/${res._id}`);
        } else {
          setSubmitLoading(false);
          console.error('No ID returned from update operation');
        }
      } else {
        const res = await dispatch(createSalesInvoice(submitData)).unwrap();
        if (res?._id) {
          navigate(`/Inventory/SaleInvoice/View/${res._id}`);
        } else {
          setSubmitLoading(false);
          console.error('No ID returned from create operation');
        }
      }
    } catch (error) {
      setSubmitLoading(false);
      console.error('Error with Sales Invoice:', error);
    }
  };

  // Update the page title based on mode
  const pageTitle = isEditMode ? "Edit Sales Invoice" : "Create Sales Invoice";

  // Add this function to format items for react-select
  const formatItemsForSelect = (items) => {
    return items.map(item => ({
      value: item._id,
      label: `${item.name} (₹${item.sellingPrice})`,
      price: item.sellingPrice,
      tax: item.tax
    }));
  };

  return (
    <Container fluid className="p-4">
      <Col sm={12} className="my-3">
        <div style={{ top: "186px", fontSize: "16px" }}>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/Inventory/SaleInvoice/List">
                Sales Invoice List
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{pageTitle}</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </Col>

      <Card className="p-3 mb-3 shadow-sm">
        <Row className="align-items-center">
          <Col xs={2}>
            <img
              src={Lockenelogo}
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
            <span className="text-muted">Invoice:</span>
            <strong className="text-primary">Draft</strong>
          </Col>
        </Row>
      </Card>
      {/* Client & Delivery Details */}
      <Card className="p-3 shadow-sm">
        <Row>
          <Col md={6} className="d-flex border-end flex-column gap-2">
            <div className="border-bottom ">
              <div className="d-flex flex-row align-items-center mb-3 gap-2">
                <h5 className="text-muted my-auto">Cafe Name Here</h5>
                <Button
                  size="sm"
                  style={{
                    width: "144px",
                    // height: "44px",
                    borderStyle: "dashed",
                  }}
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={handleShow}
                >
                  <span> {selectedCafe ? <FaCheck /> : <BiPlus />}</span>
                  {selectedCafe ? "Client" : "Select Cafe"}
                </Button>
              </div>
            </div>
            <Row className="mt-3">
              <Col style={{ fontSize: "1rem", color: "black" }} md={5}>
                {selectedCafe ? selectedCafe.name : "Client Name"}
              </Col>
              <Col style={{ fontSize: "1rem", color: "black" }} md={7}>
                {selectedCafe
                  ? `${selectedCafe.email} / ${selectedCafe.contact_no}`
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
                  {selectedCafe ? selectedCafe.address : "Address"}
                </p>
                <p style={{ fontSize: "0.9rem" }} className="mb-1">
                  {selectedCafe ? selectedCafe.city : "City"}
                </p>
                <p style={{ fontSize: "0.9rem" }} className="mb-0">
                  {selectedCafe ? selectedCafe.state : "State"}
                </p>
              </Col>
            </Row>
          </Col>

          <Col md={6} style={{ marginTop: "2rem" }}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex flex-row align-items-center gap-2">
                <Form.Control
                  size="sm"
                  type="text"
                  name="date"
                  value={formData.date || new Date().toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  placeholder="Date"
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = 'text'
                  }}
                />
              </div>
              <Form.Select
                className="form-select form-select-sm"
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
            <tr className={` ${isMobile && "d-flex"} `}>
              <th className="w-25">PRODUCT</th>
              <th className="w-15">QUANTITY</th>
              <th className="w-15">PRICE</th>
              <th className="w-15">TAX</th>
              <th className="w-30">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr className={` ${isMobile && "d-flex flex-column"} `} key={product.id}>
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
                        className="flex-shrink-0 p-1"
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
                    size="sm"
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
                      size="sm"
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
                      className="form-select form-select-sm flex-grow-1"
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
                      className="flex-shrink-0 p-1"
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
                      size="sm"
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
                      size="sm"
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
                <span>Discount (₹{totals.discountType === 'Percentage'
                  ? Math.round((totals.subtotal * totals.discount) / 100).toFixed(2)
                  : parseFloat(totals.discount || 0).toFixed(2)})</span>
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
                <span>Tax ₹{totals.taxAmount.toFixed(2)}</span>
                <div className="d-flex gap-2">
                  <Dropdown style={{ maxWidth: "200px" }}>
                    <Dropdown.Toggle variant="outline-primary" style={{ width: "100%" }}>
                      {totals.selectedTaxes.length ?
                        `${totals.selectedTaxes.reduce((sum, tax) => sum + tax.rate, 0)}%` :
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
                  <div
                    className="py-2 px-3 border border-primary rounded-1 border-dashed"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowTaxModal(true)}
                  >
                    +
                  </div>
                </div>
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
        </Row>
      </Card>

      {showProductList && (
        <OffcanvesItemsNewCreate
          show={showProductList}
          handleClose={() => setShowProductList(false)}
        />
      )}

      <TaxModal
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
        {/* <Button
          variant="primary"
          onClick={handleSubmit}
        >
          {isEditMode ? "Update Sales Invoice" : "Create Sales Invoice"}
        </Button> */}
        <Button variant="primary" type="submit" className=" my-2 float-end" onClick={handleSubmit}>
          {submitLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Saving...
            </>
          ) : (`${isEditMode ? 'Update' : 'Submit'}`)}
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
          <p>Please select a client before creating the sales invoice.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setShowValidationModal(false);
            handleShow(); // Open the client selection modal
          }}>
            Select Cafe
          </Button>
          <Button variant="secondary" onClick={() => setShowValidationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <AddCafe
        show={show}
        handleClose={handleClose}
        onClientSelect={handleClientSelect}
      />
    </Container>
  );
};

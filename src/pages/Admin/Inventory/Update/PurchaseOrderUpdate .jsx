import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Dropdown, Form, FormCheck, FormControl, FormGroup, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { useEffect, useState } from "react";
import PaymentTermsModal from "../modal/PaymentTermsModal";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
import OffcanvesItemsNewCreate from "../Offcanvas/OffcanvesItems"
import { getItems } from "../../../../store/AdminSlice/Inventory/ItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import Tax from "../modal/Tax";
import { getTaxFields } from "../../../../store/AdminSlice/TextFieldSlice";
import { GetVendorsList } from "../../../../store/AdminSlice/Inventory/purchaseOrder";


export const PurchaseOrderUpdate = () => {

  const POID  = useParams(); 
  console.log("Purchase Order ID:", POID);

  const [deliveryType, setDeliveryType] = useState('organization');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [currentDate, setCurrentDate] = useState("");
  const [showOffCanvasCreateItem, setShowOffCanvasCreateItem] = useState(false);
  const handleShowCreateItem = () => setShowOffCanvasCreateItem(true);
  const handleCloseCreateItem = () => setShowOffCanvasCreateItem(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, item: "", quantity: 1, price: 0, tax: 0, total: 0, totalTax: 0 },
  ]);
  const { customFields } = useSelector((state) => state.customFields);
  const paymentTerms = customFields.filter(field => field.type === 'Payment Terms');
  console.log("customFields ----", customFields);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const cafeId = user?._id;

  console.log("user ----", user);
  const userName = user?.name;
  const userEmail = user?.email;
  const UserContactN = user?.contact_no;
  const UserAddress = user?.address;
  const UesrPAN = user?.panNo;
  console.log("userName call ----", userName);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetVendorsList(cafeId));
    dispatch(getTaxFields(cafeId));
    dispatch(getItems(cafeId));
  }, [dispatch]);
  const { items, loading, error } = useSelector((state) => state.items);
  console.log("items List ", items);
  const { taxFields } = useSelector((state) => state.taxFieldSlice);
  console.log("unit Tax 101", taxFields);
  const vendorsList = useSelector((state) => state.purchaseOrder?.vendors);
  console.log("vendors List 101", vendorsList);
  

  

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
  const [Percentage, setPercentage] = useState(0);
  const [AmountRS, setAmountRS] = useState(0);
  const calculateTotals = () => {
    // Calculate subtotal from products
    const subtotal = products.reduce((sum, product) => sum + (product.total), 0);

    // Calculate discount
    let discountAmount = 0;
    if (totals.discountType === 'Percentage') {
      discountAmount = (subtotal * totals.discount) / 100;
      setPercentage(discountAmount);
    } else {
      discountAmount = parseFloat(totals.discount) || 0;
      setAmountRS(discountAmount);
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

  useEffect(() => {

    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);
  useEffect(() => {
    calculateTotals();
  }, [products, totals.discount, totals.discountType, totals.selectedTaxes, totals.adjustmentAmount]);
  const customers = [
    { id: 49, name: 'Amit' },
    { id: 105, name: 'Cassady Herrera Harper Drake' },
    { id: 103, name: 'Naida Mcmahon Camilla Merrill' },
    { id: 38, name: 'Poonam Bais' },
    { id: 84, name: 'Praful Patel' },
    { id: 39, name: 'RITESH BAIS' },
    { id: 1, name: 'Yash Linganwar' },
    { id: 3, name: 'Yash Test' },
    { id: 104, name: 'Yen Johnson Lara Waters' },
  ];

  const handleDeliveryChange = (type) => {
    setDeliveryType(type);
    if (type === 'organization') {
      setSelectedCustomerId('');
    }
  };

  const handleQtyChange = (e, index) => {
    const { value } = e.target;
    const enteredQty = parseInt(value, 10) || 0;
    console.log("Entered quantity:", value);

  };

  const handleProductChange = (productId, index) => {
    console.log("Updating product with ID:", productId);
  }

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
  const formattedItems = products.map(product => ({
    id: product.item,
    qty: product.quantity,
    hsn: product.hsn || '',
    price: product.price,
    tax: product.tax || '',
    tax_amt: product.totalTax || 0,
    total: product.total
  }));


  return (
    <Container >
      <Row className="mx-2">
        {/* Breadcrumb Section */}
        <Col sm={12} className="my-3">
          <div style={{ top: "186px", fontSize: "18px" }}>
            <Breadcrumb>
              <BreadcrumbItem ><Link to="/admin/dashboard">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/admin/inventory/purchase-order-list">Purchase Order List</Link></BreadcrumbItem>
              <BreadcrumbItem active>Purchase Order Update</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>
        <Col sm={12} className="my-2">
          <Card className="p-3">
            <Row>
              <Col sm={6} xs={12}>
                <h5 className="text-dark p-2" style={{ fontSize: '18px' }}>
                  <span>Purchase Order Update : PO-015</span>
                  {/* <span> {purchaseOrder?.po_no}</span> */}
                </h5>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col sm={12} className="my-2">
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
              <Col sm={2} className=" d-flex  ">
                {/* <span className="p-2 float-right">PO :<b className="text-primary">Received</b></span> */}
                {/* <strong className="text-primary"> Draft</strong> */}
              </Col>
            </Row>
          </Card>
        </Col>


        <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <Row>
              {/* Customer Info */}
              <Col sm={4}  >
                <h5 className="text-primary mb-3" style={{ fontSize: '20px' }}>Reference</h5>
                <Row>
                  <Col sm={6} >
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>Billing Address</span>
                    <p className="my-3">Nagpur Division, Maharashtra, India</p>
                  </Col>

                  <Col sm={6} className="border-end border-3" >
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>Shipping Address</span>
                    <p className="my-3"> Nagpur Division, Maharashtra, India</p>
                  </Col>
                </Row>
              </Col>



              <Col sm={8} >
                <Row>
                  {/* Delivery Details */}
                  {/* <Col sm={6}  >
                                    <span className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Address</span>
                                    <p className="my-3">
                                        <span style={{ fontSize: '16px' }}>{userName}</span><br />
                                        <span>{userEmail} / {UserContactN}</span>
                                        <br />
                                        <span>{UserAddress}</span>
                                        <br />
                                        <span>PAN:</span> {UesrPAN}
                                    </p>
                                </Col> */}
                  <Col sm={6} className="bg-white">
                    <div className="mb-3 pt-3">
                      <Form.Label>
                        Delivery Address <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="mt-2">
                        <FormGroup className="mb-0 d-flex flex-column">
                          <FormCheck
                            type="radio"
                            id="radioOrganization"
                            label="Organization"
                            name="delivery_type"
                            value="organization"
                            checked={deliveryType === 'organization'}
                            onChange={() => handleDeliveryChange('organization')}
                          />
                          <FormCheck
                            type="radio"
                            id="radioCustomer"
                            label="Customer"
                            name="delivery_type"
                            value="customer"
                            checked={deliveryType === 'customer'}
                            onChange={() => handleDeliveryChange('customer')}
                          />
                        </FormGroup>
                      </div>
                    </div>

                    {/* Organization Address */}
                    {deliveryType === 'organization' && (
                      <div id="organizationDiv">

                        <p className="my-3">
                          <span style={{ fontSize: '16px' }}>{userName}</span><br />
                          <span>{userEmail} / {UserContactN}</span>
                          <br />
                          <span>{UserAddress}</span>
                          <br />
                          <span>PAN:</span> {UesrPAN}
                        </p>
                      </div>
                    )}

                    {/* Customer Selection */}
                    {deliveryType === 'customer' && (
                      <div id="customerDiv">
                        <Form.Select
                          size="sm"
                          required
                          value={selectedCustomerId}
                          onChange={(e) => setSelectedCustomerId(e.target.value)}
                        >
                          <option value="" disabled>Select Customer</option>
                          {customers.map((cust) => (
                            <option key={cust.id} value={cust.id}>
                              {cust.name}
                            </option>
                          ))}
                        </Form.Select>

                        <p className="mt-2">
                          <span id="customerAddress">Customer Address</span><br />
                          <span id="customerCity">Customer City</span>,<br />
                          <span id="customerState">Customer State</span>,<br />
                          <span id="customerCountry">Customer Country</span>-
                          <span id="customerPincode">123456</span>
                        </p>
                      </div>
                    )}
                  </Col>

                  <Col md={4} style={{ marginTop: "2rem" }}>
                    <div className="d-flex flex-column gap-2">
                      {/* <span className="p-0 my-0">Expected Delivery: </span> */}
                      <FormControl
                        type="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                        style={{ border: "1px solid black", height: "44px" }}
                        className="my-3"
                      />
                      <div className=" d-flex flex-row align-items-center gap-2">
                        <Form.Select
                          name="payment_terms"
                          //  value={formData.payment_terms}
                          //  onChange={handleInputChange}
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
                        <Button style={{ width: "50px", border: "1px solid black", height: "30px", borderStyle: "dashed" }} variant="outline-secondary" className=" end-0 top-0 h-100 px-2" onClick={() => setShowPaymentTerms(true)}>+</Button>
                      </div>


                      <FormControl style={{ border: "1px solid black", height: "44px" }} placeholder="Enter Reference" />
                      <FormControl style={{ border: "1px solid black", height: "44px" }} placeholder="Enter Shipment Preference" />

                    </div>
                  </Col>


                  {/* Order Info */}
                  {/* <Col sm={6} >
                                    <span className="mb-3 float-end" style={{ fontSize: '16px', fontWeight: '500' }}>Order No:<b className="text-primary"> </b></span>
                                    <p className="my-5 mx-2 border-start border-3 p-2">
                                        <p><span className="my-1 fw-bold">Expected Delivery:</span> </p>
                                        <p><span className="my-1 fw-bold">Payment Terms:</span> </p>
                                        <p><span className="my-1 fw-bold">Reference:</span> </p>
                                        <p><span className="my-1 fw-bold">Shipment Preference:</span></p>
                                    </p>

                                </Col> */}
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>



        <Col sm={12} className="my-2" >
          <Card className="p-3 shadow-sm">
            <Row>
              <Col sm={12}>
                <div className="table-responsive">
                  <Table className="text-center align-middle">
                    <thead className="text-start" >
                      <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                        <th className="fw-bold"  >PRODUCT</th>
                        <th className="fw-bold" >QUANTITY</th>
                        <th className="fw-bold" >PRICE</th>
                        <th className="fw-bold" >TAX</th>
                        <th className="fw-bold" >TOTAL</th>
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
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6} className="mb-3 mb-md-0">
                <Form.Control
                  as="textarea"
                  rows={7}
                  placeholder="Vendor Description & Instruction"
                  name="description"
                  // value={formData.description}
                  // onChange={handleInputChange}
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
                      {/* Display Discount Result */}
                      {totals.discountType === 'Percentage' ? (
                        <div className="text-end text-muted my-3"> ₹{Percentage.toFixed(2)}</div>
                      ) : (
                        <div className="text-end text-muted my-3"> ₹{AmountRS.toFixed(2)}</div>
                      )}

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



              <Col className="d-flex justify-content-end my-4">
         <Button variant="primary"  className="px-4 rounded-2"
        //  onClick={handleSave}
         >
           Submit</Button>
        </Col>


            </Row>
          </Card>
        </Col>


        



        {/* <Col sm={12} className="my-2">
          <Card className="p-3 shadow-sm">
            <Row>
              <Col sm={6} style={{ borderRight: "2px solid #dee2e6" }}>
                <div>
                  <h5 className="my-2">Description :</h5>
                  <p className="my-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed</p>
                </div>
              </Col>
              <Col sm={6}>
                <Row>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-between align-items-center">
                      Subtotal
                    </div>
                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-end align-items-end">
                      ₹ 1223
                    </div>

                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-between align-items-center">
                      Discount 10%
                    </div>
                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-end align-items-end">
                      ₹ 122
                    </div>

                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-between align-items-center">
                      Tax
                    </div>
                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-end align-items-end">
                      GST (10 %)
                    </div>

                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-between align-items-center">
                      Total
                    </div>
                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-end align-items-end">
                      ₹ 1409
                    </div>

                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-between align-items-center">
                      No Adjustment
                    </div>
                  </Col>
                  <Col sm={6} className="my-2">
                    <div className="d-flex justify-content-end align-items-end">
                      ₹ o
                    </div>

                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col> */}





      </Row>


      <PaymentTermsModal
        show={showPaymentTerms}
        handleClose={() => setShowPaymentTerms(false)}
      />
      <OffcanvesItemsNewCreate
        showOffCanvasCreateItem={showOffCanvasCreateItem}
        handleCloseCreateItem={handleCloseCreateItem}
      />
      <Tax show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
    </Container>
  )
};
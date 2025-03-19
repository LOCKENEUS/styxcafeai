import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Table, Modal, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { FaRupeeSign, FaTrash, FaUpload } from "react-icons/fa";
import { BiArrowToLeft, BiPlus } from "react-icons/bi";
// import  { OffcanvesItemsCreate } from "../Offcanvas/OffcanvesItems";
import OffcanvesItemsNewCreate from "../Offcanvas/OffcanvesItems"
import Tax from "../modal/Tax";
// import AddClint from "../modal/vendorListModal";
import PaymentTermsModal from "../modal/PaymentTermsModal";
import { Link } from "react-router-dom";
import { GetVendorsList } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { useDispatch, useSelector } from "react-redux";
import AddClint from "../modal/AddClint";
import VendorsList from "../modal/vendoreListModal";

const PurchaseOrderForm = () => {
  const [show, setShow] = useState(false);
  const [showClientList, setShowClientList] = useState(true);
  const [showVendorList, setShowVendorList] = useState(false);
  const handleShowVendorList = () => setShowVendorList(true);
  const handleCloseVendorList = () => setShowVendorList(false);
  const [currentDate, setCurrentDate] = useState("");

  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Organization");
  const [showOffCanvasCreateItem, setShowOffCanvasCreateItem] = useState(false);
  const handleShowCreateItem = () => setShowOffCanvasCreateItem(true);
  const handleCloseCreateItem = () => setShowOffCanvasCreateItem(false);
  const [vendorSelected, setVendorSelected] = useState("");

  

  // const [products, setProducts] = useState([
  //   {
  //     id: 1,
  //     item: '',
  //     quantity: '',
  //     price: '',
  //     tax: '',
  //     total: ''
  //   }
  // ]);
  const [showProductList, setShowProductList] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  // const [taxList, setTaxList] = useState([]);


  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setShowClientList(true);
  };


  // Add this new function to handle adding products
  // const addProduct = () => {
  //   setProducts([...products, {
  //     id: products.length + 1,
  //     item: '',
  //     quantity: '',
  //     price: '',
  //     tax: '',
  //     total: ''
  //   }]);
  // };
  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);


  // Update the payment terms section in your existing JSX

  //-------------------------------------------

  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
    // Fetch Vendors List
    useEffect(() => {
      if (cafeId) {
        dispatch(GetVendorsList(cafeId));
      }
    }, [dispatch, cafeId]);
    const vendors = useSelector((state) => state.purchaseOrder);
 
    const vendorsList = vendors?.vendors || [];
    console.log("vendors 00",vendorsList);
    

  const [products, setProducts] = useState([
    { id: 1, item: "", quantity: 1, price: 0, tax: 0, total: 0 },
  ]);

  const taxList = [
    { name: "GST 5%", value: 5 },
    { name: "GST 12%", value: 12 },
    { name: "GST 18%", value: 18 },
  ];

  const priceList = {
    "34": 34, // Example prices
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
          updatedProduct.price = priceList[value] || 0;
        }

        const price = parseFloat(updatedProduct.price) || 0;
        const quantity = parseInt(updatedProduct.quantity) || 1;
        const tax = parseFloat(updatedProduct.tax) || 0;

        const { total, totalTax } = calculateTotal(price, quantity, tax);
        updatedProduct.total = total;
        updatedProduct.totalTax = totalTax;

        return updatedProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { id: products.length + 1, item: "", quantity: 1, price: 0, tax: 0, total: 0 },
    ]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };


  const handleVendorSelect = (newVendorId) => {
    console.log("selectedVendorId", newVendorId);

  const selectedVendor = vendorsList.find((vendor) => vendor?._id === newVendorId);

  if (selectedVendor) {
    setVendorSelected(selectedVendor);
    setFormData({
      ...formData,
      vendor_id: selectedVendor._id,
    });
  }
    handleClose();
  };
 
  return (
    <Container fluid className="p-4">

      <Col sm={12} className="my-3">
        <div style={{ top: "186px", fontSize: "18px" }}>
          <Breadcrumb>
            <BreadcrumbItem >Home</BreadcrumbItem>
            <BreadcrumbItem><Link to="/admin/inventory/purchase-order-list">Purchase Order List</Link></BreadcrumbItem>
            <BreadcrumbItem active>Purchase Order Create</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </Col>
      {/* Header Card */}
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
          <Col md={4} className="d-flex border-end flex-column gap-2">
            <div className="border-bottom ">
              <div className="d-flex flex-row align-items-center justify-content-around mb-3 gap-2">
                <h5 className="text-muted">Client Name Here</h5>
                <Button
                  style={{ width: "144px", height: "44px", borderStyle: "dashed" }}
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={handleShowVendorList}
                >
                  <span>+</span> Add Client
                </Button>
              </div>
            </div>
            <Row className="mt-3 ">
              <Col className="" md={5}>
                <h6 style={{ fontSize: "1rem" }} >Billing Address</h6>
                <p style={{ fontSize: "0.9rem" }} className="mb-1">Nagpur Division</p>
                <p style={{ fontSize: "0.9rem" }} className="mb-1">Maharashtra</p>
                <p style={{ fontSize: "0.9rem" }} className="mb-0">India</p>
              </Col>
              <Col md={5} className="">
                <h6 style={{ fontSize: "1rem" }} >Shipping Address</h6>
                <p style={{ fontSize: "0.9rem" }} className="mb-1">Nagpur Division</p>
                <p style={{ fontSize: "0.9rem" }} className="mb-1">Maharashtra</p>
                <p style={{ fontSize: "0.9rem" }} className="mb-0">India</p>
              </Col>
            </Row>

          </Col>

          <Col md={4}>
            <div className="d-flex my-3 flex-row align-items-center gap-2">
              <h5 className="text-muted">Delivery Address <span className="text-danger">*</span></h5>

            </div>
            {/* <div  className="d-flex  gap-4 mb-2">
                <Form.Check  className="" style={{  fontWeight:"bold", color: "black"}} type="radio" name="delivery" label="Organization" defaultChecked />
                <Form.Check  className="" style={{  fontWeight:"bold", color: "black"}} type="radio" name="delivery" label="Customer" />
              </div>
              <p style={{  fontWeight:"bold", marginTop:"30px",  color: "black"}} className="mb-1">Linganwar</p>
              <div style={{marginTop:"15px"}} className="d-flex flex-column   gap-2">
              <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
              <p className="mb-1">Karve Statue, DP Road, Pune Maharashtra</p>
              <p className="mb-0">PAN: ADNP5467B</p>
              </div> */}

            <div>
              {/* Radio Buttons */}
              <div className="d-flex gap-4 mb-2">
                <Form.Check
                  type="radio"
                  name="delivery"
                  label="Organization"
                  value="Organization"
                  checked={selectedOption === "Organization"}
                  onChange={() => setSelectedOption("Organization")}
                  style={{ fontWeight: "bold", color: "black" }}
                />
                <Form.Check
                  type="radio"
                  name="delivery"
                  label="Customer"
                  value="Customer"
                  checked={selectedOption === "Customer"}
                  onChange={() => setSelectedOption("Customer")}
                  style={{ fontWeight: "bold", color: "black" }}
                />
              </div>

              {/* Organization Details */}
              {selectedOption === "Organization" && (
                <>
                  <p style={{ fontWeight: "bold", marginTop: "30px", color: "black" }} className="mb-1">
                    Linganwar
                  </p>
                  <div style={{ marginTop: "15px" }} className="d-flex flex-column gap-2">
                    <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
                    <p className="mb-1">Karve Statue, DP Road, Pune Maharashtra</p>
                    <p className="mb-0">PAN: ADNP5467B</p>
                  </div>
                </>
              )}

              {/* Customer Selection Dropdown */}
              {selectedOption === "Customer" && (
                <>
                  <Form.Select className="my-0">
                    <option>Select Customer</option>
                    <option value="1">Customer 1</option>
                    <option value="2">Customer 2</option>
                    <option value="3">Customer 3</option>
                  </Form.Select>
                  <div className="my-3">
                    <p className="my-0 mx-2">Customer Address</p>
                    <p className="my-0 mx-2">Customer City,</p>
                    <p className="my-0 mx-2">Customer State,</p>
                    <p className="my-0 mx-2">Customer Country-123456</p>
                  </div>
                </>
              )}
            </div>
          </Col>

          <Col md={4} style={{ marginTop: "2rem" }}>
            <div className="d-flex flex-column gap-2">
              <div className=" d-flex flex-row align-items-center gap-2">
                <Form.Control
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                /> </div>
              <div className="d-flex flex-row align-items-center gap-2">
                <Form.Select
                  style={{ border: "1px solid black", height: "44px", borderStyle: "dashed" }}
                >
                  <option>Select Payment Terms</option>

                </Form.Select>
                <Button
                  style={{ width: "50px", border: "1px solid black", height: "30px", borderStyle: "dashed" }}
                  variant="outline-secondary"
                  onClick={() => setShowPaymentTerms(true)}
                  className="end-0 top-0 h-100 px-2"
                >
                  +
                </Button>
              </div>
              <Form.Control style={{ border: "1px solid black", height: "44px" }} placeholder="Enter Reference" />
              <Form.Control style={{ border: "1px solid black", height: "44px" }} placeholder="Enter Shipment Preference" />

            </div>
          </Col>
        </Row>

      </Card>

      {/* Product Details Card */}
      <Card className="p-3 mt-3 shadow-sm">
      <Table responsive>
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>QUANTITY</th>
            <th>PRICE</th>
            <th>TAX</th>
            {/* <th>TOTAL TAX</th> */}
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
              <div className="d-flex gap-2">
                <Form.Select
                  value={product.item}
                  onChange={(e) => updateProduct(product.id, "item", e.target.value)}
                >
                  <option value="">Select Item</option>
                  <option value="34">Item 34</option>
                  <option value="3">Item 3</option>
                  <option value="4">Item 4</option>
                  <option value="1800">Item 1800</option>
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
                  value={product.quantity}
                  onChange={(e) => updateProduct(product.id, "quantity", e.target.value)}
                />
              </td>
              <td>
              <div className="position-relative w-100">
                    <span className="position-absolute " style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "black", }}>
                      <FaRupeeSign />
                    </span>
                <Form.Control type="text" value={product.price} placeholder="0.00"
                      className="text-end w-100"
                      style={{ paddingLeft: "25px" }}
                       readOnly />
                       </div>
              </td>
              <td>
              <div className="d-flex gap-2">
                <Form.Select
                  value={product.tax}
                  onChange={(e) => updateProduct(product.id, "tax", e.target.value)}
                >
                  <option value="0">0% TAX</option>
                  {taxList.map((tax, index) => (
                    <option key={index} value={tax.value}>
                      {tax.name}
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
                <span className="position-absolute " style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "black", }}>
                      <FaRupeeSign />
                    </span>
                <Form.Control className="text-end" type="text" value={product.totalTax} readOnly />
                </div>
              </td>
              {/* <td>
                <Form.Control type="text" value={product.totalTax} readOnly />
              </td> */}
              <td>
              
              <div className="position-relative w-100 ">
                <span className="position-absolute " style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "black", }}>
                      <FaRupeeSign />
                    </span>
                <Form.Control type="text" className="text-end" value={product.total} readOnly />
                </div>
              </td>

              <td className="d-flex justify-content-end">
                {products.length > 1 && (
                  <Button
                    onClick={() => removeProduct(product.id)}
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "40px", padding: "0px", height: "40px" }}
                    variant="outline-danger"
                  >
                    <FaTrash style={{ fontSize: "15px" }} />
                  </Button>
                )}
              </td>
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
            <div className="rounded d-flex flex-column align-items-center justify-content-center p-4" style={{ minHeight: "200px", border: "1px solid black", borderStyle: "dashed" }}>
              <div className="text-center">
                <div className="mb-2">
                  <FaUpload />
                </div>
                <p className="mb-0">Click to upload, only accept .pdf, .jpg, .jpeg, .png</p>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <VendorsList
        showVendorList={showVendorList}
        handleCloseVendorList={handleCloseVendorList}
        onVendorSelect={handleVendorSelect}
      />
      {/* {showProductList && <OffcanvesItems show={showProductList} handleClose={() => setShowProductList(false)} />} */}
      <PaymentTermsModal
        show={showPaymentTerms}
        handleClose={() => setShowPaymentTerms(false)}

      />
      <Tax show={showTaxModal} handleClose={() => setShowTaxModal(false)} />
      <OffcanvesItemsNewCreate showOffCanvasCreateItem={showOffCanvasCreateItem} handleCloseCreateItem={handleCloseCreateItem} />
    </Container>
  );
};

export default PurchaseOrderForm;

import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { useEffect, useState } from "react";
import { FaRupeeSign, FaUpload } from "react-icons/fa";


export const PurchaseBillCreate = () => {
        const [selectedDate, setSelectedDate] = useState("");
        const [selectedDateShipment,setSelectedDateShipment] = useState("");
        const [currentDate, setCurrentDate] = useState("");
        const [products, setProducts] = useState([
              {
                  id: 1,
                  item: '',
                  quantity: '',
                  price: '',
                  tax: '',
                  total: ''
              }
          ]);
            const [taxList, setTaxList] = useState([]);
    
        const addProduct = () => {
            setProducts([...products, {
                id: products.length + 1,
                item: '',
                quantity: '',
                price: '',
                tax: '',
                total: ''
            }]);
        };
         useEffect(() => {
                    // Get today's date in YYYY-MM-DD format
                    const today = new Date().toISOString().split("T")[0];
                    setCurrentDate(today);
                  }, []);
        const handleTaxSubmit = (e) => {
            e.preventDefault();
            setTaxList([...taxList, newTax]);
            setNewTax({ name: '', value: '', description: '' });
            setShowTaxModal(false);
        };
    
        return (
            <Container >
               <Row className="mx-2">
        {/* Breadcrumb Section */}
        <Col sm={12} className="my-3">
        <div style={{ top: "186px", fontSize: "18px" }}>
            <Breadcrumb>
                <BreadcrumbItem href="#">Home</BreadcrumbItem>
                <BreadcrumbItem> <Link to="/admin/inventory/purchase-bill-list">Purchase Bill  List</Link></BreadcrumbItem>
                <BreadcrumbItem active>Purchase Bill Create</BreadcrumbItem>
            </Breadcrumb>
            </div>
        </Col>
        <Col sm={12} className="my-2">
        <Card className="p-3">
                <Row className="align-items-center">
                    <Col  sm={2}>
                        <img src={companylog} alt="Logo" className="img-fluid" />
                    </Col>
                    <Col  sm={8}>
                        <h5>Linganwar</h5>
                        <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
                        <p className="mb-1">
                            Karve Statue, DP Road, Mayur Colony, Kothrud, Pune, Maharashtra, India
                        </p>
                        <strong>PAN: ADNP5467B</strong>
                    </Col>
                    <Col  sm={2} className=" d-flex  ">
                        {/* <span className="p-2 float-right">PO:<b className="text-primary">Draft</b></span> */}
                        {/* <strong className="text-primary"> Draft</strong> */}
                    </Col>
                </Row>
            </Card>
        
        </Col>
    
        <Col sm={12} className="my-2">
        <Card className="p-3 shadow-sm">
              <Row>
                <Col md={4} className="d-flex border-end flex-column gap-2">
                <div className="border-bottom ">
                <div className="d-flex flex-row align-items-center justify-content-around mb-3 gap-2">
                  <h5 className="text-muted">Vendor</h5>
                  <Button 
                      style={{width: "144px", height:"44px", borderStyle: "dashed"}} 
                      variant="outline-primary" 
                      className="d-flex align-items-center justify-content-center gap-2"
                    //   onClick={handleShow}
                  >
                      <span>+</span> Add Client 
                  </Button>
                  </div>
                  </div>
                  <Row className="mt-3 ">
                <Col className="" md={5}>
                  <h6 style={{fontSize:"1rem"}} >Billing Address</h6>
                  <p style={{fontSize:"0.9rem"}} className="mb-1">Nagpur Division</p>
                  <p style={{fontSize:"0.9rem"}} className="mb-1">Maharashtra</p>
                  <p style={{fontSize:"0.9rem"}} className="mb-0">India</p>
                </Col>
                <Col md={5} className="">
                  <h6 style={{fontSize:"1rem"}} >Shipping Address</h6>
                  <p style={{fontSize:"0.9rem"}} className="mb-1">Nagpur Division</p>
                  <p style={{fontSize:"0.9rem"}} className="mb-1">Maharashtra</p>
                  <p style={{fontSize:"0.9rem"}} className="mb-0">India</p>
                </Col>
              </Row>
                  
                </Col>
      
                <Col md={4}>
                <div className="d-flex my-3 flex-row align-items-center gap-2">
                  <h5 className="text-muted">Delivery Address <span className="text-danger">*</span></h5>
      
                  </div>
                  <div  className="d-flex  gap-4 mb-2">
                    <FormCheck  className="" style={{  fontWeight:"bold", color: "black"}} type="radio" name="delivery" label="Organization" defaultChecked />
                    <FormCheck  className="" style={{  fontWeight:"bold", color: "black"}} type="radio" name="delivery" label="Customer" />
                  </div>
                  <p style={{  fontWeight:"bold", marginTop:"30px",  color: "black"}} className="mb-1">Linganwar</p>
                  <div style={{marginTop:"15px"}} className="d-flex flex-column   gap-2">
                  <p className="mb-1">yash123linganwar@gmail.com / 91562173745</p>
                  <p className="mb-1">Karve Statue, DP Road, Pune Maharashtra</p>
                  <p className="mb-0">PAN: ADNP5467B</p>
                  </div>
                </Col>
      
                <Col md={4} style={{marginTop:"2rem"}}>
                  <div className="d-flex flex-column gap-2">
                    {/* <span className="p-0 my-0">Expected Delivery:                    </span> */}
                  <FormControl
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    style={{ border: "1px solid black", height: "44px" }}
                    className="my-3"
                    />
                    <div  className=" d-flex flex-row align-items-center gap-2">
                      <FormControl style={{  border:"1px solid black", height:"44px" , borderStyle:"dashed"}} placeholder="Expected Delivery" />
                      <Button style={{width:"50px" , border:"1px solid black", height:"30px" , borderStyle:"dashed"}} variant="outline-secondary" className=" end-0 top-0 h-100 px-2">+</Button>
                    </div>
                    
                    {/* {paymentTermsSection} */}
                    <FormControl  style={{  border:"1px solid black", height:"44px" }}  placeholder="Enter Reference" />
                    <FormControl style={{  border:"1px solid black", height:"44px" }}  placeholder="Enter Shipment Preference" />
      
                  </div>
                </Col>
              </Row>
    
            </Card>
    </Col >
    
    <Col sm={12} className="my-2">
    <Card className="p-3  shadow-sm">
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
                                  <FormSelect 
                                      className="flex-grow-1" 
                                      style={{ border: "1px solid black", borderStyle: "dashed" }}
                                      value={product.item}
                                      onChange={(e) => {
                                          const updatedProducts = products.map(p => 
                                              p.id === product.id ? {...p, item: e.target.value} : p
                                          );
                                          setProducts(updatedProducts);
                                      }}
                                  >
                                      <option>Select Item</option>
                                  </FormSelect>
                                  <Button 
                                  onClick={() => setShowProductList(true)}
                                  className="flex-shrink-0" 
                                  style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }} 
                                  variant="outline-secondary"
                                  >
                                  +
                                  </Button>
                                  
                              </div>
                          </td>
                          <td>
                              <FormControl 
                                  type="text" 
                                  placeholder="QTY : 1" 
                                  style={{ border: "1px solid black", width: "100%" }}
                                  value={product.quantity}
                                  onChange={(e) => {
                                      const updatedProducts = products.map(p => 
                                          p.id === product.id ? {...p, quantity: e.target.value} : p
                                      );
                                      setProducts(updatedProducts);
                                  }}
                              />
                          </td>
                          <td>
                              <div className="position-relative w-100">
                                  <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                      <FaRupeeSign />
                                  </span>
                                  <FormControl
                                      type="text"
                                      placeholder="0.00"
                                      className="w-100"
                                      style={{ paddingLeft: "25px", border: "1px solid black" }}
                                      value={product.price}
                                      onChange={(e) => {
                                          const updatedProducts = products.map(p => 
                                              p.id === product.id ? {...p, price: e.target.value} : p
                                          );
                                          setProducts(updatedProducts);
                                      }}
                                  />
                              </div>
                          </td>
                          <td>
                              <div className="d-flex gap-2">
                                  <FormSelect 
                                      className="flex-grow-1" 
                                      style={{ border: "1px solid black" }}
                                      value={product.tax}
                                      onChange={(e) => {
                                          const updatedProducts = products.map(p => 
                                              p.id === product.id ? {...p, tax: e.target.value} : p
                                          );
                                          setProducts(updatedProducts);
                                      }}
                                  >
                                      <option value="">0 % TAX</option>
                                      {taxList.map((tax, index) => (
                                          <option key={index} value={tax.value}>
                                              {tax.name} ({tax.value}%)
                                          </option>
                                      ))}
                                  </FormSelect>
                                  <Button 
                                      className="flex-shrink-0" 
                                      style={{ width: "40px", border: "1px solid black", borderStyle: "dashed" }} 
                                      variant="outline-secondary"
                                      onClick={() => setShowTaxModal(true)}
                                  >
                                      +
                                  </Button>
                              </div>
                          </td>
                          <td>
                              <div className="position-relative w-100">
                                  <span className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                      <FaRupeeSign />
                                  </span>
                                  <FormControl 
                                      type="text" 
                                      placeholder="PRICE : 0.00" 
                                      className="w-100" 
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
                                      className="flex-shrink-0  d-flex justify-content-center align-items-center" 
                                      style={{ width: "40px", padding: "0px", height: "40px", border: "1px solid black", borderStyle: "dashed" }} 
                                      variant="outline-danger"
                                      >
                                      <FaTrash style={{fontSize:"15px"}}/>
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
                //   onClick={addProduct}
              >
                  <span className="me-2">+</span> Add Product
              </Button>
      
              <Row className="border-top border-3 ">
                <Col xs={12} md={6} className="my-3 mb-md-0  ">
                  <FormControl
                    as="textarea"
                    rows={7}
                    placeholder="Client description / instruction...."
                    style={{ border: "1px solid gray" }}
                  />
                </Col>
                <Col xs={12} md={6} className="my-3 mb-md-0  ">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                      <span>Subtotal</span>
                      <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                        <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                          <FaRupeeSign />
                        </span>
                        <FormControl type="text" placeholder="Sub - Total" style={{ paddingLeft: "25px", border: "1px solid black" }} readOnly />
                      </div>
                    </div>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                      <span>Discount</span>
                      <Button variant="outline-primary" style={{ width: "100%", maxWidth: "200px", borderStyle: "dashed" }}>
                        <span className="me-2">+</span> Add Discount
                      </Button>
                    </div>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                      <span>Tax</span>
                      <Button variant="outline-primary" style={{ width: "100%", maxWidth: "200px", borderStyle: "dashed" }}>
                        <span className="me-2">+</span> TAX
                      </Button>
                    </div>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                      <span>Total</span>
                      <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                        <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                          <FaRupeeSign />
                        </span>
                        <FormControl type="text" placeholder="Total" style={{ paddingLeft: "25px", border: "1px solid black" }} readOnly />
                      </div>
                    </div>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                      <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                        <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                          <FaRupeeSign />
                        </span>
                        <FormControl type="text" placeholder="Adjust Note" style={{ paddingLeft: "25px", border: "1px solid black" }} />
                      </div>
                      <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "200px" }}>
                        <span style={{ position: "absolute", left: "10px", top: "45%", transform: "translateY(-50%)" }}>
                          <FaRupeeSign />
                        </span>
                        <FormControl type="text" placeholder="Adjust Amount" style={{ paddingLeft: "25px", border: "1px solid black" }} />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
    
    </Col>
    
    <Col sm={12} className="my-2">
    <Card className="p-3  shadow-sm">
              <h6 style={{fontSize:'17px'}}>Terms And Condition & Attachments</h6>
              <Row className="mt-3 my-2">
                <Col md={6}>
                  <FormControl
                    as="textarea"
                    rows={9}
                    placeholder="Terms & Condition Notes"
                    style={{ border: "1px solid gray" }}
                  />
                </Col>
      
                <Col className="my-2" md={6}>
                  <div  className="rounded d-flex flex-column align-items-center justify-content-center p-4" style={{ minHeight: "200px", border: "1px solid black" , borderStyle:"dashed" }}>
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
    
    </Col>

    <Col sm={12} className="my-3 d-flex justify-content-end">
                <Button style={{ padding: "10px 35px", fontSize: "14px" }}>Submit</Button>

</Col>
    
        </Row>
        </Container>
        )
};
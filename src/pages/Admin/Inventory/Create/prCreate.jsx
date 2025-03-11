import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { useEffect, useState } from "react";
import { FaRupeeSign, FaUpload } from "react-icons/fa";
import { PiAsteriskSimpleBold } from "react-icons/pi";

export const PRCreate = () => {
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

            useEffect(() => {
                        // Get today's date in YYYY-MM-DD format
                        const today = new Date().toISOString().split("T")[0];
                        setCurrentDate(today);
                      }, []);
    
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
                <BreadcrumbItem> <Link to="/admin/inventory/purchaseReceived">Purchase Received List</Link></BreadcrumbItem>
                <BreadcrumbItem active>Purchase Received Create</BreadcrumbItem>
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
              <Row className="align-items-center">


                <Col sm={4}>
                <FormLabel className="my-3" style={{ fontSize: "16px" , fontWeight: "500" }}>Vendor
                <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <FormSelect aria-label="Default select example">
                    <option> select vendor</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </FormSelect>
                </Col>
                <Col sm={4}>
                <FormLabel className="my-3" style={{ fontSize: "16px" , fontWeight: "500" }}>Purchase Order
                <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <FormSelect aria-label="Default select example">
                    <option> select PO No</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </FormSelect>
                </Col>
                <Col sm={4}>
    <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>
        Received Date
        <span style={{ color: "red" }}>*</span>
    </FormLabel>
    <FormControl
        type="date"
        value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
    />
</Col>
               
              </Row>
    
            </Card>
    </Col >
    
    <Col sm={12} className="my-2">
    <Card className="p-3  shadow-sm">
              <Table responsive className="mb-2">
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
      
              
      
              <Row className="border-top border-3 ">
                <Col xs={12} md={6} className="my-3 mb-md-0  ">
                <FormLabel style={{fontSize:'16' , fontWeight:'500'}} className="my-2" >All listed items will be visible here</FormLabel>
                
                  <FormControl
                    as="textarea"
                    rows={7}
                    placeholder="Order received description / instruction...."
                    style={{ border: "1px solid gray" }}
                  />
                </Col>
                <Col sm={12} className="my-3 d-flex justify-content-end">
                <Button style={{ padding: "10px 35px", fontSize: "14px" }}>Submit</Button>

</Col>

                
              </Row>
            </Card>

            
    
    </Col>
    
        </Row>
        </Container>
        )
};
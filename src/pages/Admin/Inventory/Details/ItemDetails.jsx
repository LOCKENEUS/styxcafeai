import React from 'react'
import { Container, Row, Col, Tab, Nav, Table, Card, Breadcrumb } from 'react-bootstrap'
import { BiArrowBack, BiCloudUpload } from 'react-icons/bi'
import user_check from '/assets/Admin/Dashboard/solar_user-check-bold.svg';
import { HiOutlineTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const ItemDetails = () => {
  const navigate = useNavigate();

  return (
    <Container data-aos="fade-down" data-aos-duration="700" className="mt-4 min-vh-100">
    <Breadcrumb>
      <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
      <Breadcrumb.Item active>Booking Details</Breadcrumb.Item>
    </Breadcrumb>
    <Tab.Container defaultActiveKey="checkout">
      <Row>
        <Col sm={6} className="mt-3">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="checkout">Checkout Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="transaction">Transaction History</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="history">History</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={6}>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary me-2">
              <BiCloudUpload /> Edit
            </button>
            <button className="btn btn-danger me-2">
              <HiOutlineTrash /> Delete
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              <BiArrowBack /> Back
            </button>
          </div>
        </Col>
        <Col sm={5} className="mt-3">
          <Tab.Content>
            <Tab.Pane eventKey="checkout">
                <Card className='p-3'>
              <h4>Details</h4>
              <Table className='w-50' borderless>
                <tbody>
                  <tr>
                    <td className='fw-bold'>SKU</td>
                    <td>YYU</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Unit</td>
                    <td>PCS</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Dimension</td>
                    <td>0 × 0 × 0 mm</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Weight</td>
                    <td>0 g</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Manufacturer</td>
                    <td>MI</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Brand</td>
                    <td>Xiaomi</td>
                  </tr>
                </tbody>
              </Table>
              <hr className='w-50' />
              <h4>Purchase Information</h4>
              <Table className='w-50' borderless>
                <tbody>
                  <tr>
                    <td className='fw-bold'>Cost Price</td>
                    <td>₹ 0</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Selling Price</td>
                    <td>₹ 77</td>
                  </tr>
                </tbody>
              </Table>
              <hr className='w-50' />
              <h4>Other Information</h4>
              <Table className='w-50' borderless>
                <tbody>
                  <tr>
                    <td className='fw-bold'>Cost Price</td>
                    <td>₹ 0</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Selling Price</td>
                    <td>₹ 77</td>
                  </tr>
                </tbody>
              </Table>
              </Card>
            </Tab.Pane>
            <Tab.Pane eventKey="transaction">
              <Card className='p-3'>
                <h5>Transaction History</h5>
                <Table className='w-100' borderless>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>BILL NO</th>
                      <th>QTY</th>
                      <th>PRICE</th>
                      <th>STATUS</th>
                      <th>DATETIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" className="text-center">No transaction history available.</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Tab.Pane>
            <Tab.Pane eventKey="history">
              <Card className='p-3'>
                <h5>History</h5>
                <Table className='w-100' borderless>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>QUANTITY</th>
                      <th>DESCRIPTION</th>
                      <th>DATETIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td  className="text-center">No history available.</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Col>
        <Col sm={7} className="mt-3">
        <Card className='p-3'>
        <Container className="mt-4">
      <Card className="p-4">
        <div className="d-flex justify-content-center mb-4">
          <Card className="p-5 d-flex justify-content-center align-items-center" style={{ width: "250px", height: "250px", border: "1px dashed #ccc" }}>
            <BiCloudUpload size={40} className="mb-2" />
            <p>Upload Image (250 × 250)</p>
          </Card>
        </div>
        
        <h5>Accounting Stock</h5>
        <Table borderless>
          <tbody>
            <tr>
              <td>Stock in hand</td>
              <td><b>0</b></td>
            </tr>
            <tr>
              <td>Committed Stock</td>
              <td><b>0</b></td>
            </tr>
            <tr>
              <td>Available Stock</td>
              <td><b>0</b></td>
            </tr>
          </tbody>
        </Table>
        
        <h5>Physical Stock</h5>
        <Table borderless>
          <tbody>
            <tr>
              <td>Stock in hand</td>
              <td><b>0</b></td>
            </tr>
            <tr>
              <td>Committed Stock</td>
              <td><b>0</b></td>
            </tr>
            <tr>
              <td>Available Stock</td>
              <td><b>0</b></td>
            </tr>
          </tbody>
        </Table>
        
        <Row className="mt-4">
          {['To be Shipped', 'To be Received', 'To be Invoiced', 'To be Billed'].map((item, index) => (
            <Col key={index} xs={6} className="mb-3"> {/* Changed xs={6} to xs={3} to cover the width */}
              <Card className="p-3 d-flex">
                <div className="d-flex gap-3 justify-content-center align-items-center">
                  <div className="">
                    <img src={user_check} alt="icon" />
                  </div>
                  <div>
                    <h6>{item}</h6>
                    <h4>145</h4>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Container>
        </Card>

        </Col>
      </Row>
    </Tab.Container>
  </Container>  
  )
}

export default ItemDetails

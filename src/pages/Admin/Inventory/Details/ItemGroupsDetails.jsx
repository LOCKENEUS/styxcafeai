import React from 'react'
import { Container, Row, Col, Tab, Nav, Table, Card, Breadcrumb } from 'react-bootstrap'
import { BiArrowBack, BiCloudUpload } from 'react-icons/bi'
import { HiOutlineTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom';
const ItemGroupsDetails = () => {

    const navigate = useNavigate();
  return (
    <Container data-aos="fade-down" data-aos-duration="700" fluid className="mt-4 min-vh-100">
    <Breadcrumb>
      <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/admin/inventory">Inventory</Breadcrumb.Item>
      <Breadcrumb.Item href="/admin/inventory/item-groups-details">Item Groups Details</Breadcrumb.Item>
    </Breadcrumb>
    <Tab.Container defaultActiveKey="checkout">
      <Row>
        <Col sm={12} className="mt-3">
          <Tab.Content>
            <Card className='p-3'>
            <Tab.Pane eventKey="checkout">
            <h5>Details</h5>
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
              
              <Table className='w-25' borderless>
                <tbody>
                  <tr>
                    <td>Unit</td>
                    <td><b>pcs</b></td>
                  </tr>
                  <tr>
                    <td>Tax</td>
                    <td><b>0%</b></td>
                  </tr>
                  <tr>
                    <td>Manufacturer</td>
                    <td><b>MI</b></td>
                  </tr>
                  <tr>
                    <td>Brand</td>
                    <td><b>Xiaomi</b></td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td><b>fghfghfghfgh</b></td>
                  </tr>
                </tbody>
              </Table>
              <hr className='w-50' />
              <h5>List of Item under this Group:</h5>
              <Card className="p-3 w-75">
                <Row>
                  <Col md={8}>
                    <h6>16</h6>
                    <p>SKU : yyu</p>
                    <p>Price : ₹77</p>
                    <p>Stock : 0</p>
                  </Col>
                  <Col md={4}>
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e0e0e0", borderRadius: "5px" }}>
                      <span>250 x 250</span>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Tab.Pane>
            </Card>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Container>
  )
}

export default ItemGroupsDetails

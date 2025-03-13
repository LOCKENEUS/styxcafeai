import React, { useEffect } from 'react';
import { Container, Row, Col, Tab, Table, Card, Breadcrumb } from 'react-bootstrap';
import { BiArrowBack, BiCloudUpload } from 'react-icons/bi';
import { HiOutlineTrash } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getItemGroupById } from '../../../../store/AdminSlice/Inventory/ItemGroupSlice';

const ItemGroupsDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selectedItemGroup, loading, error } = useSelector((state) => state.itemGroups);

  useEffect(() => {
    dispatch(getItemGroupById(id)).then((res) => {
      console.log("res.payload", res.payload);
    });
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
                    <button onClick={() => navigate(`/admin/inventory/item-group-form/${id}`)} className="btn btn-primary me-2">
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
                        <td><b>{selectedItemGroup?.unit || 'N/A'}</b></td>
                      </tr>
                      <tr>
                        <td>Tax</td>
                        <td><b>{selectedItemGroup?.tax || 'N/A'}%</b></td>
                      </tr> 
                      <tr>
                        <td>Manufacturer</td>
                        <td><b>{selectedItemGroup?.manufacturer?.name || 'N/A'}</b></td>
                      </tr>
                      <tr>
                        <td>Brand</td>
                        <td><b>{selectedItemGroup?.brand?.name || 'N/A'}</b></td>
                      </tr>
                      {/* <tr>
                        <td>Description</td>
                        <td><b>{selectedItemGroup?.description || 'N/A'}</b></td>
                      </tr> */}
                    </tbody>
                  </Table>
                  <hr className='w-50' />
                  <h5>List of Items under this Group:</h5>
                  <Row>
                    {selectedItemGroup?.items?.map((item, index) => (
                      <Col md={6} key={item._id} className="mb-3">
                        <Card className="p-3">
                          <Row>
                            <Col md={6}>
                              <h6>{item.name || 'No Name Available'}</h6>
                              <p>SKU : {item.sku || 'No SKU Available'}</p>
                              <p>Price : ₹{item.sellingPrice !== null ? item.sellingPrice : 'Price Not Available'}</p>
                              <p>Stock : {item.stock !== null ? item.stock : 'Stock Not Available'}</p>
                            </Col>
                            <Col md={6}>
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e0e0e0", borderRadius: "5px" }}>
                                <span>250 x 250</span>
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
              </Card>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default ItemGroupsDetails;

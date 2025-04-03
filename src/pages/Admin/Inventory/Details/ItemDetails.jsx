import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Table,
  Card,
  Breadcrumb,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import { BiArrowBack, BiCloudUpload } from "react-icons/bi";
import user_check from "/assets/Admin/Dashboard/solar_user-check-bold.svg";
import { HiOutlineTrash } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getItemById,
  deleteItem,
  getItemsCount,
} from "../../../../store/AdminSlice/Inventory/ItemsSlice";
import { getCustomFieldById } from "../../../../store/AdminSlice/CustomField";

const ItemDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selectedItem, itemsCount, loading, error } = useSelector((state) => state.items);
  const { selectedCustomField } = useSelector((state) => state.customFields);
  const [manufacturer, setManufacturer] = React.useState(null);
  const [brand, setBrand] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getItemById(id));
      dispatch(getItemsCount(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Fetch manufacturer data when selectedItem changes and has manufacturer ID
    if (selectedItem?.manufacturer) {
      dispatch(getCustomFieldById(selectedItem.manufacturer)).then((action) => {
        if (action.payload) {
          setManufacturer(action.payload);
        }
      });
    }
  }, [dispatch, selectedItem?.manufacturer]);

  useEffect(() => {
    // Fetch brand data when selectedItem changes and has brand ID
    if (selectedItem?.brand) {
      dispatch(getCustomFieldById(selectedItem.brand)).then((action) => {
        if (action.payload) {
          setBrand(action.payload);
        }
      });
    }
  }, [dispatch, selectedItem?.brand]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteItem(id)).then(() => {
      setShowDeleteModal(false);
      navigate(-1);
    });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4 min-vh-100">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <BiArrowBack /> Back
        </button>
      </Container>
    );
  }

  if (!selectedItem) {
    return (
      <Container className="mt-4 min-vh-100">
        <div className="alert alert-info">Item not found</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <BiArrowBack /> Back
        </button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 min-vh-100">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/inventory/dashboard">Inventory</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/inventory/items-list">Item List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Item Details</Breadcrumb.Item>
      </Breadcrumb>
      <Tab.Container defaultActiveKey="checkout">
        <Row>
          <Col xs={12} sm={6} className="mt-3">
            <Nav variant="tabs" className="flex-nowrap">
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
          <Col xs={12} sm={6}>
            <div className="d-flex justify-content-end mt-3 flex-wrap gap-2">
              <button
                onClick={() => navigate(`/admin/inventory/edit/${id}`)}
                className="btn btn-primary"
              >
                <BiCloudUpload /> Edit
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <HiOutlineTrash /> Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                <BiArrowBack /> Back
              </button>
            </div>
          </Col>

          <Col xs={12} lg={5} className="mt-3">
            <Tab.Content>
              <Tab.Pane eventKey="checkout">
                <Card className="p-3">
                  <h4>Details</h4>
                  <div className="table-responsive">
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td className="fw-bold">SKU</td>
                          <td>{selectedItem.sku}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Unit</td>
                          <td>{selectedItem.unit}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Dimension</td>
                          <td>
                            {selectedItem.length} × {selectedItem.width} ×{" "}
                            {selectedItem.height} {selectedItem.dimensionUnit}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Weight</td>
                          <td>
                            {selectedItem.weight} {selectedItem.weightUnit}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Manufacturer</td>
                          <td>
                            {manufacturer ? manufacturer.name : "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Brand</td>
                          <td>{brand ? brand.name : "-"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <hr className="w-50" />
                  <h4>Purchase Information</h4>
                  <div className="table-responsive">
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td className="fw-bold">Cost Price</td>
                          <td>₹ {selectedItem.costPrice}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Selling Price</td>
                          <td>₹ {selectedItem.sellingPrice}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <hr className="w-50" />
                  <h4>Other Information</h4>
                  <div className="table-responsive">
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td className="fw-bold">Cost Price</td>
                          <td>₹ {selectedItem.costPrice}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Selling Price</td>
                          <td>₹ {selectedItem.sellingPrice}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="transaction">
                <Card className="p-3">
                  <h5>Transaction History</h5>
                  <div className="table-responsive">
                    <Table borderless>
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
                          <td colSpan="6" className="text-center">
                            No transaction history available.
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="history">
                <Card className="p-3">
                  <h5>History</h5>
                  <div className="table-responsive">
                    <Table borderless>
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
                          <td className="text-center">No history available.</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
          <Col xs={12} lg={7} className="mt-3">
              <Container fluid className="px-0">
                <Card className="p-4">
                  <div className="d-flex justify-content-center mb-4">
                    {selectedItem.image ? (
                      <Card
                        className="p-5 d-flex justify-content-center align-items-center"
                        style={{
                          width: "250px",
                          height: "250px",
                          border: "1px dashed #ccc",
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${
                            selectedItem.image
                          }`}
                          alt="Item"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Card>
                    ) : (
                      <Card
                        className="p-5 d-flex justify-content-center align-items-center"
                        style={{
                          width: "250px",
                          height: "250px",
                          border: "1px dashed #ccc",
                        }}
                      >
                        <BiCloudUpload size={40} className="mb-2" />
                        <p>Upload Image (250 × 250)</p>
                      </Card>
                    )}
                  </div>

                  <h5>Physical Stock</h5>
                  <div className="table-responsive">
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td>Stock in hand</td>
                          <td>
                            <b>{selectedItem.stock}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Stock Rate</td>
                          <td>
                            <b>
                              {selectedItem.stockRate || selectedItem.costPrice}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Available Stock</td>
                          <td>
                            <b>{selectedItem.stock}</b>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <br/>

                  <h5>Accounting Stock</h5>
                  <div className="table-responsive">
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td>Stock in hand</td>
                          <td>
                            <b>{selectedItem.stock}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Committed Stock</td>
                          <td>
                            <b>
                              {itemsCount?.toBeInvoiced}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Available Stock</td>
                          <td>
                            <b>{selectedItem.stock}</b>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <Row className="mt-4">
                      <Col xs={12} sm={6} className="mb-3">
                        <Card className="p-3">
                          <div className="d-flex gap-3 justify-content-center align-items-center">
                            <div>
                              <img src={user_check} alt="icon" />
                            </div>
                            <div>
                              <h6>To be Received</h6>
                              <h4>{itemsCount?.toBeReceived}</h4>
                            </div>
                          </div>
                        </Card>
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Card className="p-3">
                          <div className="d-flex gap-3 justify-content-center align-items-center">
                            <div>
                              <img src={user_check} alt="icon" />
                            </div>
                            <div>
                              <h6>To be Billed</h6>
                              <h4>{itemsCount?.toBeBilled}</h4>
                            </div>
                          </div>
                        </Card>
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Card className="p-3">
                          <div className="d-flex gap-3 justify-content-center align-items-center">
                            <div>
                              <img src={user_check} alt="icon" />
                            </div>
                            <div>
                              <h6>To be Invoiced</h6>
                              <h4>{itemsCount?.toBeInvoiced}</h4>
                            </div>
                          </div>
                        </Card>
                      </Col>
                  </Row>
                </Card>
              </Container>
          </Col>
        </Row>
      </Tab.Container>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Item
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ItemDetails;
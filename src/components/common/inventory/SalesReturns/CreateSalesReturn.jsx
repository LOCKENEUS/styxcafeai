import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormLabel, FormSelect, Row, Spinner, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import Lockenelogo from "/assets/Admin/Inventory/Lockenelogo.svg";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCafes } from "../../../../store/slices/cafeSlice";
import { getsalesOrderByCafeId, getsalesOrderById } from "../../../../store/slices/Inventory/soSlice";
import { createSalesReturn } from "../../../../store/slices/Inventory/returnSlice";

export const CreateSalesReturn = () => {
    const [formData, setFormData] = useState({
        selectedClient: "",
        salesOrder: "",
        currentDate: new Date().toISOString().split("T")[0],
        description: "",
        inventoryItems: [],
        shippingDate: new Date().toISOString().split("T")[0],
    });
    const [inventoryItems, setInventoryItems] = useState([
        {
            id: "",
            name: "",
            qty: 1,
            rate: "",
            tax: "",
            tax_amt: "",
            amount: "",
            qty_returned: 0,
            hsn: "",
            sku: "",
            qty_to_return: 0,
        },
    ]);
    const [selectedPack, setSelectedPack] = useState([]);
    const [shipmentItems, setShipmentItems] = useState({});
    const [soSelected, setSoSelected] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [taxList, setTaxList] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    // const salesOrderData = location.state;

    const selectedSo = useSelector((state) => state.saSalesOrder.selectedsalesOrder);
    const { salesOrders, loading, error } = useSelector((state) => state.saSalesOrder);
    const cafes = useSelector((state) => state.cafes.cafes);

    const user = JSON.parse(localStorage.getItem("user"));
    const cafeId = user?._id;
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    useEffect(() => {
        if (selectedSo) {
            setSoSelected(selectedSo?._id);
            setSelectedClient(selectedSo?.customer_id?._id);
            setFormData((prev) => ({
                ...prev,
                selectedClient: selectedSo?.customer_id?._id,
                currentDate: new Date().toISOString().split("T")[0],
            }));
        }
    }, [selectedSo]);

    useEffect(() => {
        dispatch(fetchCafes());
    }, [dispatch]);

    useEffect(() => {
        if (selectedClient) {
            dispatch(getsalesOrderByCafeId(selectedClient));
        }
    }, [dispatch, selectedClient]);

    useEffect(() => {
        if (soSelected) {
            dispatch(getsalesOrderById(soSelected));
        }
    }, [dispatch, soSelected]);

    useEffect(() => {
        if (selectedSo) {
            setInventoryItems(selectedSo?.items || []);
        }
    }, [selectedSo]);

    const handleTaxSubmit = (e) => {
        e.preventDefault();
        setTaxList([...taxList, newTax]);
        setNewTax({ name: '', value: '', description: '' });
        setShowTaxModal(false);
    };

    const handleVendorChange = (vendorId) => {
        setSelectedClient(vendorId);
        setFormData((prev) => ({
            ...prev,
            selectedClient: vendorId,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQtyChange = (e, packageId, itemId) => {
        const value = parseInt(e.target.value, 10) || 0;

        setShipmentItems((prev) => ({
            ...prev,
            [packageId]: {
                ...prev[packageId],
                [itemId]: {
                    ...prev[packageId]?.[itemId],
                    qty_to_return: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedItems = selectedPack.map((pkgId) => ({
            package_id: pkgId,
            items: Object.entries(shipmentItems[pkgId] || {}).map(
                ([itemId, itemData]) => ({
                    item_id: itemId,
                    qty_to_return: itemData.qty_to_return,
                })
            ),
        }));

        const submitData = {
            so_id: selectedSo._id,
            client_id: selectedClient,
            return_date: formData.currentDate,
            description: formData.description,
            shipments: formattedItems,
        };

        try {
            setSubmitLoading(true);
            const response = await dispatch(createSalesReturn(submitData)).unwrap();
            navigate(`/Inventory/SalesReturn/View/${response._id}`);
            setFormData({
                selectedClient: '',
                SalesOrder: '',
                selectedTax: '',
                currentDate: '',
                description: '',
            });
        } catch (error) {
            // Handle error
            setSubmitLoading(false);
            console.error('Error creating package:', error);
        }
    };

    const handlePackageCheck = (id, checked) => {
        if (checked) {
            setSelectedPack(prev => [...prev, id]);
        } else {
            setSelectedPack(prev => prev.filter(item => item !== id));
        }
    };

    return (
        <Container >
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="mt-3">
                    <div style={{ top: "186px", fontSize: "16px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem> <Link to="/Inventory/Package">Package List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Package Create</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>

                <Col xs={12} className="my-2">

                    <Card className="p-3 shadow-sm">
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

                </Col>

                <Col xs={12} className="my-2">
                    <Card className="p-4 shadow-sm">
                        <Row className="align-items-start">
                            {/* Client */}
                            <Col xs={12} sm={4} className="mb-3">
                                <FormLabel style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Client <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormSelect
                                    size="sm"
                                    aria-label="Select client"
                                    value={formData.selectedClient}
                                    name="selectedClient"
                                    onChange={(e) => handleVendorChange(e.target.value)}
                                >
                                    <option>select client</option>
                                    {cafes?.map((cafe) => (
                                        <option key={cafe._id} value={cafe._id}>
                                            {cafe.name}
                                        </option>
                                    ))}
                                </FormSelect>
                            </Col>

                            {/* Sales Order */}
                            <Col xs={12} sm={4} className="mb-3">
                                <FormLabel style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Sales Order <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormSelect
                                    size="sm"
                                    aria-label="Select sales order"
                                    name="SalesOrder"
                                    value={soSelected}
                                    onChange={(e) => setSoSelected(e.target.value)}
                                >
                                    <option value="">
                                        {selectedClient && salesOrders.length ? "SO found!" : "Select SO No"}
                                    </option>
                                    {salesOrders?.map((po) => (
                                        <option key={po._id} value={po._id}>
                                            {po.po_no}
                                        </option>
                                    ))}
                                </FormSelect>
                            </Col>

                            {/* Shipment No */}
                            <Col xs={12} sm={4} className="mb-3">
                                <FormLabel style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Shipment No <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <div className="d-flex flex-wrap gap-1 mt-2">
                                    {selectedSo?.shipments?.map((pkg, index) => (
                                        <div key={index} className="d-flex align-items-center" style={{ minWidth: 120 }}>
                                            <input
                                                size={"sm"}
                                                type="checkbox"
                                                style={{ height: "18px", width: "20px", marginRight: "8px" }}
                                                checked={selectedPack.includes(pkg._id)}
                                                value={pkg._id}
                                                onChange={(e) => handlePackageCheck(pkg._id, e.target.checked)}
                                                id={`pkg-checkbox-${pkg._id}`}
                                            />
                                            <label htmlFor={`pkg-checkbox-${pkg._id}`} style={{ margin: 0, cursor: "pointer" }}>
                                                {pkg.po_no}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Col>

                            {/* Shipping Date */}
                            <Col xs={12} sm={4} className="mb-3">
                                <FormLabel style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Shipping Date <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <Form.Control
                                    size="sm"
                                    type="date"
                                    name="shippingDate"
                                    value={formData.shippingDate}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            shippingDate: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col sm={12} className="my-2">
                    {selectedClient && selectedSo && selectedPack.length > 0 && <Card className="p-3  shadow-sm">
                        <Table responsive className="mb-2">
                            <thead>
                                <tr>
                                    <th className="w-25">PRODUCT</th>
                                    <th className="w-15"></th>
                                    <th className="w-30">SHIPPED</th>
                                    <th className="w-30">RETURNED</th>
                                    <th className="w-15">QTY to RETURN</th>
                                </tr>
                            </thead>
                            {selectedSo?.packages?.length > 0 && (
                                <tbody>
                                    {selectedSo?.shipments
                                        ?.filter((pkg) => selectedPack.includes(pkg._id))
                                        .map((pkg) => (
                                            <>
                                                <div style={{ paddingLeft: '10px', paddingTop: '10px' }}>{pkg?.po_no}</div>
                                                {pkg?.items?.map((item) => (
                                                    <tr key={item._id}>
                                                        {/* ...other columns... */}
                                                        <td>
                                                            <span className="fw-bold">{item.item_id?.name}</span>
                                                            <br />
                                                            <span className="fw-none">HSN: {item?.hsn}</span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-bold">SKU: {item?.quantity}</span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-bold">{item?.qty_shipped}</span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-bold">{item?.qty_returned}</span>
                                                        </td>
                                                        <td>
                                                            <Form.Control
                                                                size="sm"
                                                                type="number"
                                                                value={
                                                                    shipmentItems[pkg._id]?.[item._id]?.qty_to_return || ""
                                                                }
                                                                placeholder={item.qty_shipped - item.qty_returned}
                                                                min="0"
                                                                max={item.qty_shipped - item.qty_returned}
                                                                onChange={(e) =>
                                                                    handleQtyChange(e, pkg._id, item._id)
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ))}
                                </tbody>
                            )}
                        </Table>

                        <Row className="border-top border-3 ">
                            <Col xs={12} md={6} className="my-3 mb-md-0  ">
                                <FormLabel style={{ fontSize: '16', fontWeight: '500' }} className="my-2" >All listed items will be visible here</FormLabel>
                                <FormControl
                                    as="textarea"
                                    rows={7}
                                    placeholder="Order package description / instruction...."
                                    style={{ border: "1px solid gray" }}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col sm={12} className="my-3 d-flex justify-content-end">
                                {/* <Button type="submit " onClick={handleSubmit} style={{ padding: "10px 35px", fontSize: "14px" }}>Submit</Button> */}
                                <Button variant="primary" type="submit" className=" my-2 float-end" onClick={handleSubmit}>
                                    {submitLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" /> Saving...
                                        </>
                                    ) : ('Submit')}
                                </Button>
                            </Col>
                        </Row>
                    </Card>}
                </Col>
            </Row>
        </Container>
    )
};

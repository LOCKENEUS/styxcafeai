import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormLabel, FormSelect, Row, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCafes } from "../../../../store/slices/cafeSlice";
import { getsalesOrderByCafeId, getsalesOrderById } from "../../../../store/slices/Inventory/soSlice";
import { createShipment } from "../../../../store/slices/Inventory/shipSlice";
import { getPackageDetails } from "../../../../store/slices/Inventory/packSlice";

export const CreateShipment = () => {
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
            qty_packed: 0,
            hsn: "",
            sku: "",
            qty_to_pack: 0,
        },
    ]);
    const [selectedPack, setSelectedPack] = useState([]);
    const [packageItems, setPackageItems] = useState({});
    const [soSelected, setSoSelected] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [taxList, setTaxList] = useState([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const selectedSo = useSelector((state) => state.saSalesOrder.selectedsalesOrder);
    const { salesOrders, loading, error } = useSelector((state) => state.saSalesOrder);
    const cafes = useSelector((state) => state.cafes.cafes);
    const packData = useSelector(state => state.saPackage.selectedPackage);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    useEffect(() => {
        if (id) {
            dispatch(getPackageDetails(id))
        }
    }, [selectedSo]);

    useEffect(() => {
        if (packData) {
            // setSelectedPack(packData?.items || []);
            setSoSelected(packData?.refer_id?._id);
        }
    }, [packData]);

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
        setPackageItems((prev) => ({
            ...prev,
            [packageId]: {
                ...prev[packageId],
                [itemId]: {
                    ...prev[packageId]?.[itemId],
                    qty_to_ship: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedItems = selectedPack.map((pkgId) => ({
            package_id: pkgId,
            items: Object.entries(packageItems[pkgId] || {}).map(
                ([itemId, itemData]) => ({
                    item_id: itemId,
                    qty_to_ship: itemData.qty_to_ship,
                })
            ),
        }));

        const submitData = {
            so_id: selectedSo._id,
            client_id: selectedClient,
            shipment_date: formData.currentDate,
            description: formData.description,
            packages: formattedItems,
        };

        try {
            const response = await dispatch(createShipment(submitData)).unwrap();
            navigate("/Inventory/Shipment/View", { state: response?._id });

            setFormData({
                selectedClient: '',
                SalesOrder: '',
                selectedTax: '',
                currentDate: '',
                description: '',
            });
        } catch (error) {
            // Handle error
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

    console.log("packages", selectedSo.packages)

    return (
        <Container >
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="my-3">
                    <div style={{ top: "186px", fontSize: "12px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem> <Link to="/Inventory/Package">Shipment List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Package Shipment Create</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
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
                                {/* <span className="p-2 float-right">PO : <b className="text-primary">{selectedPo?.status}</b></span> */}
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row className="align-items-center">
                            <Col sm={4}>
                                <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>Client
                                    <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormSelect aria-label="Default select example"
                                    value={formData.selectedClient}
                                    name="selectedClient"
                                    onChange={(e) => handleVendorChange(e.target.value)}
                                >
                                    <option> select client</option>
                                    {cafes?.map((cafe) => (
                                        <option key={cafe._id} value={cafe._id}>
                                            {cafe.name}
                                        </option>
                                    ))}
                                </FormSelect>
                            </Col>
                            <Col sm={4}>
                                <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Sales Order <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormSelect
                                    aria-label="Default select example"
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

                            <Col sm={4}>
                                <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Package No
                                    <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                {/* <div className="d-flex flex-wrap gap-2">
                                    {selectedSo?.packages?.map((pkg, index) => (
                                        <div key={index}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    style={{ height: "18px", width: "20px" }}
                                                    checked={selectedPack.includes(pkg._id)}
                                                    value={pkg._id}
                                                    onChange={(e) => handlePackageCheck(pkg._id, e.target.checked)}
                                                />
                                                {pkg.po_no}
                                            </label>
                                        </div>
                                    ))}
                                </div> */}
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedSo?.packages?.map((pkg, index) => (
                                        <div key={index}
                                            className="d-flex align-items-center"
                                            style={{ minWidth: 120 }}
                                        >
                                            <input
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
                        </Row>

                        <Row className="align-items-center">
                            <Col sm={4}>
                                <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Shipping Date <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <Form.Control
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
                </Col >

                <Col sm={12} className="my-2">
                    {selectedClient && selectedSo && selectedPack.length > 0 && <Card className="p-3  shadow-sm">
                        <Table responsive className="mb-2">
                            <thead>
                                <tr>
                                    <th className="w-25">PRODUCT</th>
                                    <th className="w-15"></th>
                                    <th className="w-15">ORDERED</th>
                                    <th className="w-15">PACKED</th>
                                    <th className="w-30">SHIPPED</th>
                                    <th className="w-15">QTY to SHIP</th>
                                </tr>
                            </thead>
                            {selectedSo?.packages?.length > 0 && (
                                <tbody>
                                    {selectedSo?.packages
                                        ?.filter((pkg) => selectedPack.includes(pkg._id))
                                        .map((pkg) => (
                                            <>
                                                {/* <tr className="mt-2">
                                                    <td colSpan={6} style={{ background: "#f5f5f5", padding: "5px" }}>{pkg?.po_no}</td>
                                                </tr> */}
                                                <tr>
                                                    <td colSpan="6" className="fw-bold bg-light text-primary py-2">
                                                        {pkg?.po_no}
                                                    </td>
                                                </tr>
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
                                                            <span className="fw-bold">{item?.quantity}</span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-bold">{item?.qty_packed}</span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-bold">{item?.qty_shipped}</span>
                                                        </td>
                                                        <td>
                                                            <Form.Control
                                                                size="sm"
                                                                type="number"
                                                                value={
                                                                    packageItems[pkg._id]?.[item._id]?.qty_to_ship || ""
                                                                }
                                                                placeholder={item.qty_packed - item.qty_shipped}
                                                                min="0"
                                                                max={item.qty_packed - item.qty_shipped}
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
                                <Button type="submit " onClick={handleSubmit} style={{ padding: "10px 35px", fontSize: "14px" }}>Submit</Button>
                            </Col>
                        </Row>
                    </Card>}
                </Col>
            </Row>
        </Container>
    )
};

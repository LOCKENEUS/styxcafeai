import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormLabel, FormSelect, Row, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCafes } from "../../../../store/slices/cafeSlice";
import { getsalesOrderByCafeId, getsalesOrderById } from "../../../../store/slices/Inventory/soSlice";
import { createPackage } from "../../../../store/slices/Inventory/packSlice";

export const CreatePackage = () => {
    const [formData, setFormData] = useState({
        selectedClient: "",
        salesOrder: "",
        currentDate: new Date().toISOString().split("T")[0],
        description: "",
        inventoryItems: [],
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
    const [soSelected, setSoSelected] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [taxList, setTaxList] = useState([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    // const salesOrderData = location.state;

    const selectedSo = useSelector((state) => state.saSalesOrder.selectedsalesOrder);

    const { salesOrders, loading, error } = useSelector((state) => state.saSalesOrder);

    const cafes = useSelector((state) => state.cafes.cafes);

    const user = JSON.parse(sessionStorage.getItem("user"));
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

    const handleQtyChange = (e, index) => {
        const { value } = e.target;
        const enteredQty = parseInt(value, 10) || 0;

        if (!inventoryItems || !inventoryItems[index]) return; // Prevent errors

        const orderedQty = inventoryItems[index]?.quantity || 0;
        const packedQty = inventoryItems[index]?.qty_packed || 0;
        const maxQty = orderedQty - packedQty;

        if (enteredQty > maxQty) {
            alert(`You cannot enter more than ${maxQty} units.`);
            setInventoryItems((prevItems) =>
                prevItems.map((item, i) =>
                    i === index ? { ...item, qty_to_pack: maxQty } : item
                )
            );
            return;
        } else {
            setInventoryItems((prevItems) =>
                prevItems.map((item, i) =>
                    i === index ? { ...item, qty_to_pack: enteredQty } : item
                )
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = {
            so_id: selectedSo._id,
            vendor_id: selectedClient,
            cafe: cafeId,
            package_date: formData.currentDate,
            description: formData.description,
            items: inventoryItems,
        };

        try {
            const response = await dispatch(createPackage(submitData)).unwrap();
            navigate("/Inventory/Package/View", { state: response?._id });

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

        console.log("soSelected", soSelected);

    return (
        <Container >
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="my-3">
                    <div style={{ top: "186px", fontSize: "12px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem> <Link to="/Inventory/Package">Package List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Package Create</BreadcrumbItem>
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
                                    size="sm"
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
                                    size="sm"
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
                                    Package Date
                                    <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormControl
                                    size="sm"
                                    type="date"
                                    name="currentDate"
                                    value={formData.currentDate}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col >

                <Col sm={12} className="my-2">
                    {selectedClient && soSelected && salesOrders.length > 0 && <Card className="p-3  shadow-sm">
                        <Table responsive className="mb-2">
                            <thead>
                                <tr>
                                    <th className="w-25">PRODUCT</th>
                                    <th className="w-15"></th>
                                    <th className="w-15">ORDERED</th>
                                    <th className="w-15">PACKED</th>
                                    <th className="w-30">QTY to PACK</th>
                                </tr>
                            </thead>
                            {inventoryItems.length > 0 && (
                                <tbody>
                                    {inventoryItems?.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>
                                                <span className="fw-bold">{item?.item_id?.name}</span>
                                                <br />
                                                <span className="fw-none"> HSN : {item.item_id?.hsn}</span>
                                            </td>
                                            <td >SKU : {item?.item_id?.sku}</td>
                                            <td >  {item?.quantity} Qty</td>
                                            <td>{item?.qty_packed} Qty</td>
                                            <td>
                                                <Form.Control
                                                    size="sm"
                                                    id={`product_qty${item.id}`}
                                                    value={inventoryItems[index]?.qty_to_pack || ""}
                                                    type="number"
                                                    placeholder={item.quantity - item.qty_packed}
                                                    min="0"
                                                    max={item.quantity - item.qty_packed}
                                                    className="mb-3"
                                                    onChange={(e) => handleQtyChange(e, index)}
                                                    onWheel={(e) => e.target.blur()} // 👈 disables scroll on focus
                                                />
                                            </td>
                                        </tr>
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
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormControl, FormLabel, FormSelect, Row, Spinner, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSaVendors } from "../../../store/slices/Inventory/saVendorSlice";
import { getSaPOListByVendor, getSaPurchaseOrder } from "../../../store/slices/Inventory/poSlice";
import { createSaPurchaseReceive } from "../../../store/slices/Inventory/prSlice";

export const PurchaseReceivedCreate = () => {
    const [formData, setFormData] = useState({
        selectedVendor: "",
        PurchaseOrder: "",
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
            qty_received: 0,
            hsn: "",
            sku: "",
            qty_to_receive: 0,
        },
    ]);
    const [poSelected, setPoSelected] = useState("");
    const [selectedVendor, setSelectedVendor] = useState("");
    const [taxList, setTaxList] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const purchaseOrderData = location.state;

    const { purchaseOrder, selectedPo, loading, error } = useSelector((state) => state.saPurchaseOrder);

    const vendors = useSelector((state) => state.saVendor.vendors);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact;
    const UserAddress = user?.address;
    const UesrPAN = user?.pan;

    useEffect(() => {
        if (purchaseOrderData) {
            setPoSelected(purchaseOrderData?._id);
            setSelectedVendor(purchaseOrderData?.vendor_id?._id);
            setFormData((prev) => ({
                ...prev,
                selectedVendor: purchaseOrderData?.vendor_id?._id,
                currentDate: new Date().toISOString().split("T")[0],
            }));
        }
    }, [purchaseOrderData]);

    useEffect(() => {
        dispatch(getSaVendors());
    }, [dispatch, cafeId]);

    useEffect(() => {
        if (selectedVendor) {
            dispatch(getSaPOListByVendor({ vendor: selectedVendor }));
        }
    }, [dispatch, selectedVendor]);

    useEffect(() => {
        if (poSelected) {
            dispatch(getSaPurchaseOrder(poSelected));
        }
    }, [dispatch, poSelected]);

    useEffect(() => {
        if (selectedPo) {
            setInventoryItems(selectedPo?.items || []);
        }
    }, [selectedPo]);

    const handleTaxSubmit = (e) => {
        e.preventDefault();
        setTaxList([...taxList, newTax]);
        setNewTax({ name: '', value: '', description: '' });
        setShowTaxModal(false);
    };

    const handleVendorChange = (vendorId) => {
        setSelectedVendor(vendorId);
        setFormData((prev) => ({
            ...prev,
            selectedVendor: vendorId,
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
        const receivedQty = inventoryItems[index]?.qty_received || 0;
        const maxQty = orderedQty - receivedQty;

        if (enteredQty > maxQty) {
            alert(`You cannot enter more than ${maxQty} units.`);
            setInventoryItems((prevItems) =>
                prevItems.map((item, i) =>
                    i === index ? { ...item, qty_to_receive: maxQty } : item
                )
            );
            return;
        } else {
            setInventoryItems((prevItems) =>
                prevItems.map((item, i) =>
                    i === index ? { ...item, qty_to_receive: enteredQty } : item
                )
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        const submitData = {
            po_id: selectedPo._id,
            vendor_id: selectedVendor,
            cafe: cafeId,
            received_date: formData.currentDate,
            description: formData.description,
            items: inventoryItems,
        };

        try {
            const response = await dispatch(createSaPurchaseReceive(submitData)).unwrap();
            navigate("/Inventory/PurchaseReceive", { state: response?._id });

            setFormData({
                selectedVendor: '',
                PurchaseOrder: '',
                selectedTax: '',
                currentDate: '',
                description: '',
            });
        } catch (error) {
            // Handle error
            setSubmitLoading(false);
            console.error('Error creating purchase receive:', error);
        }
    };

    return (
        <Container >
            <Row className="mx-2">
                {/* Breadcrumb Section */}
                <Col sm={12} className="mt-3">
                    <div style={{ top: "186px", fontSize: "16px" }}>
                        <Breadcrumb>
                            <BreadcrumbItem href="/">Home</BreadcrumbItem>
                            <BreadcrumbItem> <Link to="/Inventory/PurchaseReceived">Purchase Received List</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Purchase Received Create</BreadcrumbItem>
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
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col sm={12} className="my-2">
                    <Card className="p-3 shadow-sm">
                        <Row className="align-items-center">
                            <Col sm={4}>
                                <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>Vendor
                                    <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormSelect aria-label="Default select example"
                                    value={formData.selectedVendor}
                                    name="selectedVendor"
                                    onChange={(e) => handleVendorChange(e.target.value)}
                                >
                                    <option> select vendor</option>
                                    {vendors.map((vendor) => (
                                        <option key={vendor.id} value={vendor._id}>
                                            {vendor.name}
                                        </option>
                                    ))}
                                </FormSelect>
                            </Col>
                            <Col sm={4}>
                                <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Purchase Order <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormSelect
                                    aria-label="Default select example"
                                    name="PurchaseOrder"
                                    value={poSelected}
                                    onChange={(e) => setPoSelected(e.target.value)}
                                >
                                    <option value="">
                                        {selectedVendor && purchaseOrder.length ? "PO found!" : "Select PO No"}
                                    </option>
                                    {purchaseOrder?.map((po) => (
                                        <option key={po._id} value={po._id}>
                                            {po.po_no}
                                        </option>
                                    ))}
                                </FormSelect>
                            </Col>

                            <Col sm={4}>
                                <FormLabel className="my-3" style={{ fontSize: "16px", fontWeight: "500" }}>
                                    Received Date
                                    <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <FormControl
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
                    {selectedVendor && poSelected && purchaseOrder.length > 0 && <Card className="p-3  shadow-sm">
                        <Table responsive className="mb-2">
                            <thead>
                                <tr>
                                    <th className="w-25">PRODUCT</th>
                                    <th className="w-15"></th>
                                    <th className="w-15">ORDERED</th>
                                    <th className="w-15">RECEIVED</th>
                                    <th className="w-30">QTY to RECEIVE</th>
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
                                            <td>{item?.qty_received} Qty</td>
                                            <td>
                                                <Form.Control
                                                    id={`product_qty${item.id}`}
                                                    value={inventoryItems[index]?.qty_to_receive || ""}
                                                    type="number"
                                                    placeholder={"0"}
                                                    min="0"
                                                    max={item.quantity - item.qty_received}
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
                                    placeholder="Order received description / instruction...."
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

import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { useEffect, useState } from "react";
import { getVendors } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetPOList, GetPOListByVendor, GetPurchaseOrder } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { createPurchaseReceive } from "../../../../store/AdminSlice/Inventory/purchaseReceive";

export const PRCreate = () => {
    const [formData, setFormData] = useState({
        selectedVendor: "",
        PurchaseOrder: "",
        currentDate: "",
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
            qty_to_receive: 1,
        },
    ]);
    // const [inventoryItems ,setInventoryItems]= useState([]);
    const [selectedPo, setSelectedPo] = useState("");
    const [selectedVendor, setSelectedVendor] = useState("");
    const [PurchaseOrder, setPurchaseOrder] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [products, setProducts] = useState([]);
    const [taxList, setTaxList] = useState([]);
    const dispatch = useDispatch();

    const { purchaseOrder, selectedItem, loadingPO, errorPO } = useSelector((state) => state.purchaseOrder);
    const { vendors, loading, error } = useSelector(state => state.vendors);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;

    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;

    useEffect(() => {
        dispatch(getVendors(cafeId));
    }, [dispatch, cafeId]);

    useEffect(() => {
        if (selectedVendor) {
            dispatch(GetPOListByVendor({ id: cafeId, vendor: selectedVendor }));
        }
    }, [dispatch, selectedVendor]);

    useEffect(() => {
        if (selectedPo) {
            dispatch(GetPurchaseOrder(selectedPo));
        }
    }, [dispatch, selectedPo]);

    useEffect(() => {
        if (selectedItem) {
            console.log("Setting Inventory Items:", selectedItem[0]?.items); // Debugging Log
            setInventoryItems(selectedItem?.items || []);
        }
    }, [selectedItem]);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setCurrentDate(today);
    }, []);

    console.log("purchaseOrder", purchaseOrder);

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

    const handlePoChange = async (poId) => {
        setPurchaseOrder(poId);

        if (POItems && poId) {
            const filteredProducts = POItems
                .filter((item) => item?.refer_id === poId)
                .map((item, index) => {
                    return {
                        id: item?._id,
                        item_id: item?.item_id?._id || "",
                        hsn: item?.hsn?.toString() || "",
                        qty_to_receive: item?.quantity || 0,
                        price: item?.price || 0,
                        tax: item?.tax || "",
                        tax_amt: item?.tax_amt || 0,
                        total: item?.total || 0,
                    };
                });
            setProducts(filteredProducts);
        }
        setFormData((prev) => ({
            ...prev,
            PurchaseOrder: poId,
        }));
    };

    // const handleQtyChange = (e, index) => {
    //     const { value } = e.target;
    //     const enteredQty = parseInt(value, 10) || 0;

    //     const orderedQty = POItems[index]?.quantity || 0; // Total Ordered Quantity
    //     const receivedQty = POItems[index]?.qty_received || 0; // Already Received Quantity
    //     const maxQty = orderedQty - receivedQty; // Max allowed qty to receive

    //     if (enteredQty > maxQty) {
    //         alert(`You cannot enter more than ${maxQty} units.`);
    //         return;
    //     }

    //     setInventoryItems((prevItems) =>
    //         prevItems.map((item, i) =>
    //             i === index ? { ...item, qty_to_receive: enteredQty } : item
    //         )
    //     );

    //     setFormData((prev) => ({
    //         ...prev,
    //         inventoryItems: prev.inventoryItems.map((item, i) =>
    //             i === index ? { ...item, qty_to_receive: enteredQty } : item
    //         ),
    //     }));
    // };

    const handleQtyChange = (e, index) => {
        const { value } = e.target;
        const enteredQty = parseInt(value, 10) || 0;
    
        if (!inventoryItems || !inventoryItems[index]) return; // Prevent errors
    
        const orderedQty = inventoryItems[index]?.quantity || 0;
        const receivedQty = inventoryItems[index]?.qty_received || 0;
        const maxQty = orderedQty - receivedQty;
    
        if (enteredQty > maxQty) {
            alert(`You cannot enter more than ${maxQty} units.`);
            return;
        }
    
        setInventoryItems((prevItems) =>
            prevItems.map((item, i) =>
                i === index ? { ...item, qty_to_receive: enteredQty } : item
            )
        );
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = {
            po_id: selectedItem._id,
            vendor_id: selectedVendor,
            cafe: cafeId,
            received_date: formData.currentDate,
            description: formData.description,
            items: inventoryItems,
        };

        try {
            await dispatch(createPurchaseReceive(submitData)).unwrap();
            // Handle success (e.g., redirect to SO list)

            setFormData({
                selectedVendor: '',
                PurchaseOrder: '',
                selectedTax: '',
                currentDate: '',
                description: '',
            });
        } catch (error) {
            // Handle error
            console.error('Error creating SO:', error);
        }
    };

    console.log("selectedItem", selectedItem);
    console.log("inventoryItems", inventoryItems);

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
                                {/* <strong className="text-primary"> Draft</strong> */}
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
                                    value={selectedPo}
                                    onChange={(e) => setSelectedPo(e.target.value)}
                                >
                                    <option value="">
                                        {purchaseOrder.length ? "PO found!" : "Select PO No"}
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
                                    // onChange={(e) => setCurrentDate(e.target.value)}
                                    onChange={handleChange}
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
                                                    type="number"
                                                    placeholder={item.qty_to_receive}
                                                    min="0"
                                                    max={item.quantity - item.qty_received}
                                                    className="mb-3"
                                                    onChange={(e) => handleQtyChange(e, index)}
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
                                <Button type="submit " onClick={handleSubmit} style={{ padding: "10px 35px", fontSize: "14px" }}>Submit</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};
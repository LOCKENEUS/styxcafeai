import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import companylog from "/assets/inventory/companylogo.png";
import { useEffect, useState } from "react";
import { FaRupeeSign, FaUpload } from "react-icons/fa";
import { PiAsteriskSimpleBold } from "react-icons/pi";
import { getVendors } from "../../../../store/AdminSlice/Inventory/VendorSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetPOList } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { createPurchaseReceive } from "../../../../store/AdminSlice/Inventory/purchaseReceive";

export const PRCreate = () => {
    const [formData, setFormData] = useState({
        selectedVendor: "",
        PurchaseOrder: "",
        currentDate: "",
        description: "",
        inventoryItems: [],



    });
    // const [inventoryItems ,setInventoryItems]= useState([]);
    const [selectedVendor, setSelectedVendor] = useState("");
    const [PurchaseOrder, setPurchaseOrder] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDateShipment, setSelectedDateShipment] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const dispatch = useDispatch();

    const user = JSON.parse(sessionStorage.getItem("user"));

    const cafeId = user?._id;

    //   console.log("user ---- pr", user);
    const userName = user?.name;
    const userEmail = user?.email;
    const UserContactN = user?.contact_no;
    const UserAddress = user?.address;
    const UesrPAN = user?.panNo;
    console.log("userName ----", userName);
    useEffect(() => {
        dispatch(getVendors(cafeId));
        dispatch(GetPOList(cafeId));
    }, [dispatch, cafeId]);
    const { vendors, loading, error } = useSelector(state => state.vendors);
    console.log("vendors", vendors);
    const { selectedItem, loadingPO, errorPO } = useSelector((state) => state.purchaseOrder);
    const listOfPO = selectedItem;
    console.log("listOfPO", listOfPO);
    const formattedPOList = Array.isArray(listOfPO)
        ? listOfPO
            .filter((po) => po?.vendor_id?._id === selectedVendor)
            .map((po) => ({
                full: po 
            }))
        : [];
    const POItems =formattedPOList[0]?.full?.items;
    // po pass in formdata 
    
console.log("Items Details display -------", POItems);





// POItems pass in formdata POItems


// const handalItemsCountTable = () => {
    // formattedPOList[0]?.full?.items count who many time item added
    const itemsCount = formattedPOList[0]?.full?.items.reduce((acc, item) => {
        return acc + item.quantity;

    }, 0);
    
    console.log("Count Items -----",itemsCount);

    // const product = formattedPOList[0]?.full?.items ;


// }


    const [products, setProducts] = useState([ ]);
    console.log("products ======", products);
    const [taxList, setTaxList] = useState([]);



    useEffect(() => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];
        setCurrentDate(today);
    }, []);

    
    const handleTaxSubmit = (e) => {
        e.preventDefault();
        setTaxList([...taxList, newTax]);
        setNewTax({ name: '', value: '', description: '' });
        setShowTaxModal(false);
    };
    const handleVendorChange = (vendorId) => {
        console.log("Selected vendor: ", vendorId);
        setSelectedVendor(vendorId);
        console.log("Selected vendor: ", vendorId);
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
        console.log("Selected PO: ", poId);
        console.log("---------------------------------------------");
      
        if (POItems && poId) {
          const filteredProducts = POItems
            .filter((item) => item?.refer_id === poId)
            .map((item, index) => {
              console.log(`POItems[${index}] _id:`, item?._id);
              console.log("Matched Selected PO:", poId);
              console.log("Full Item:", item);
      
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
          console.log("Updated Products:", filteredProducts);
        }
      
        console.log("---------------------------------------------");
      
        setFormData((prev) => ({
          ...prev,
          PurchaseOrder: poId,
        }));
      };
      
// const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitted data:", formData);
// };


const handleQtyChange = (e, index) => {
        const { value } = e.target;
        const enteredQty = parseInt(value, 10) || 0;
        console.log("Entered quantity:", value);

        // formdata POItems
        setFormData((prev) => ({
            ...prev,
            selectedVendor: POItems,
        }));

        

        const remainingQty = POItems[0]?.quantity - value;
        console.log("Remaining quantity:", POItems[0]?.quantity);
        console.log("remainingQty", remainingQty);


        if (enteredQty > remainingQty) {
            setInventoryItems((prevItems) =>
                prevItems.map((item, i) =>
                    i === index ? { ...item, qty_received: remainingQty } : item
                )
            );
            setFormData((prev) => ({
                ...prev,
                inventoryItems: prev.inventoryItems.map((item, i) =>
                    i === index ? { ...item, qty_received: remainingQty } : item
                ),
            }));
        } else {
            setInventoryItems((prevItems) =>
                prevItems.map((item, i) =>
                    i === index ? { ...item, qty_received: enteredQty } : item
                )
            );
        }

    



        
    
        
    };


    // ----------------------------------------------------------------------------

    const [inventoryItems, setInventoryItems] = useState([
        {
          id: "",
          name: "",
          qty: 1,
          rate: "",
          tax: "",
          tax_amt: "",
          amount: "",
          qty_to_receive: 1,
        },
      ]);












    // ----------------------------------------------------------------------------------

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitted data:", formData);
        const submitData = {
            po_id: formData.PurchaseOrder,
            vendor_id: selectedVendor,
            cafe: cafeId,
            received_date: formData.currentDate,
            description: formData.description,
            items: products, 
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
        value={formData.PurchaseOrder}
        onChange={(e) => handlePoChange(e.target.value)}
    >
        <option value="">
            {formattedPOList.length ? "PO found!" : "Select PO No"}
        </option>
        {formattedPOList.map((po) => (
            <option key={po.full._id} value={po.full._id}>
                {po.full.po_no}
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
                           {itemsCount > 0 && (
                                <tbody>
                                  {POItems.filter(item => item.refer_id === PurchaseOrder).map((item, index) => (
                                        <tr key={index}>
                                            <td >
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
                                                    placeholder={item.qty_received}
                                                    min="0"
                                                    max={item.quantity - item.qty_received}
                                                    // value={inventoryItems}
                                                    // name="inventoryItems"
                                                    className="mb-3"
                                                    onChange={(e) => handleQtyChange(e, index)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                            {/* <tbody>
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
                                                            p.id === product.id ? { ...p, item: e.target.value } : p
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
                                                        p.id === product.id ? { ...p, quantity: e.target.value } : p
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
                                                            p.id === product.id ? { ...p, price: e.target.value } : p
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
                                                            p.id === product.id ? { ...p, tax: e.target.value } : p
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
                                                    <FaTrash style={{ fontSize: "15px" }} />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody> */}
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
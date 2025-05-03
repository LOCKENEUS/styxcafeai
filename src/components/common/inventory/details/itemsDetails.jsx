import { useState } from "react";
import { Tabs, Tab, Container, Row, Col, Card, CardHeader, Button, Table, Image } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export const ItemsDetails = () => {
    const [key, setKey] = useState("tabOne");
    const navigate = useNavigate();

    const tableData = [
        {
            id: 1,
            billNo: "SINV-004",
            qty: "18 Nos",
            price: "₹ 499",
            status: "Draft",
            datetime: "2025-02-07",
            // link: "https://fsm.lockene.net/Web/Inventory/InvoiceDetails/12",
        },
        {
            id: 2,
            billNo: "SINV-003",
            qty: "50 Nos",
            price: "₹ 499",
            status: "Paid",
            datetime: "2025-02-07",
            // link: "https://fsm.lockene.net/Web/Inventory/InvoiceDetails/6",
        },
        {
            id: 3,
            billNo: "PB-004",
            qty: "8 Nos",
            price: "₹ 245",
            status: "Paid",
            datetime: "2025-02-07",
            // link: "https://fsm.lockene.net/Web/Inventory/PBDetails/25",
        },
    ];

    const data = [
        { id: 1, quantity: "10 Nos", description: "Order is received", datetime: "2025-02-08 10:57:01" },
        { id: 2, quantity: "10 Nos", description: "Order is received", datetime: "2025-02-08 10:56:41" },
        { id: 3, quantity: "20 Nos", description: "Purchase order created", datetime: "2025-02-08 10:56:13" },
        { id: 4, quantity: "50 Nos", description: "", datetime: "2025-02-08 10:53:00" },
        { id: 5, quantity: "18 Nos", description: "Shipping invoice created", datetime: "2025-02-07 11:18:21" },
        { id: 6, quantity: "10 Nos", description: "Order is shipped", datetime: "2025-02-07 11:18:07" },
        { id: 7, quantity: "8 Nos", description: "Order is shipped", datetime: "2025-02-07 11:17:41" },
        { id: 8, quantity: "8 Nos", description: "Order is packed", datetime: "2025-02-07 11:17:15" },
        { id: 9, quantity: "10 Nos", description: "Order is packed", datetime: "2025-02-07 11:16:23" },
        { id: 10, quantity: "18 Nos", description: "Sales order created", datetime: "2025-02-07 11:15:56" },
        { id: 11, quantity: "50 Nos", description: "Shipping invoice created", datetime: "2025-02-07 11:08:20" },
        { id: 12, quantity: "50 Nos", description: "Order is shipped", datetime: "2025-02-07 11:06:40" },
        { id: 13, quantity: "50 Nos", description: "Order is packed", datetime: "2025-02-07 11:04:19" },
        { id: 14, quantity: "50 Nos", description: "Sales order created", datetime: "2025-02-07 11:03:42" },
        { id: 15, quantity: "8 Nos", description: "Received order bill created", datetime: "2025-02-07 10:59:59" },
        { id: 16, quantity: "8 Nos", description: "Order is received", datetime: "2025-02-07 10:57:55" },
        { id: 17, quantity: "10 Nos", description: "Purchase order created", datetime: "2025-02-07 10:57:47" },
        { id: 18, quantity: "80 Nos", description: "Order is received", datetime: "2025-02-07 10:56:43" },
        { id: 19, quantity: "100 Nos", description: "Purchase order created", datetime: "2025-02-07 10:56:08" },
      ];

      const handaleBack =()=>{
        console.log("Back button clicked");
        // navigate /Inventory/Items
        navigate("/Inventory/Items");
      }
    return (
        <Container className="text-center">

            <Row>
                <div className="d-flex justify-content-center align-items-center">
                    <h1>Inventory Item Details</h1>
                </div>
                <Col md={12} className="my-4">
                    <Card>
                        <CardHeader as="h5">
                            <Row >
                                <Col sm={6} className="d-flex justify-content-start">
                                    <h3 className="fw-bold txt-start">Wired Headphone</h3>
                                </Col>
                                <Col sm={6} className="d-flex justify-content-end">
                                    <Button className="mx-2" variant="outline-dark" onClick={handaleBack}><IoArrowBackOutline className="mx-2"/>Back</Button>
                                    <Button className="mx-2" variant="success"><RiEditFill  className="mx-2" />
                                    Edit</Button>
                                    <Button className="mx-2" variant="danger"><MdDelete className="mx-2" />Delete</Button>
                                </Col>
                            </Row>
                        </CardHeader>
                        <Tabs
                            id="vendor-tabs"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-7 mx-0"
                            justify
                        >
                            <Tab eventKey="tabOne" title="Overview" >
                                <Row>
                                    <Col sm={7} className="mb-2">
                                        <Table responsive size="sm" className="table-bordernone">
                                            <tbody>
                                                <tr>
                                                    <td>SKU</td>
                                                    <td className="fw-bold">WH001</td>
                                                </tr>
                                                <tr>
                                                    <td>Unit</td>
                                                    <td className="fw-bold">pcs</td>
                                                </tr>
                                                <tr>
                                                    <td>Dimension</td>
                                                    <td className="fw-bold">0 x 0 x 0 mm</td>
                                                </tr>
                                                <tr>
                                                    <td>Weight</td>
                                                    <td className="fw-bold">0 kg</td>
                                                </tr>
                                                <tr>
                                                    <td>Manufacturer</td>
                                                    <td className="fw-bold">MI</td>
                                                </tr>
                                                <tr>
                                                    <td>Brand</td>
                                                    <td className="fw-bold">Xiomi</td>
                                                </tr>
                                                <tr style={{ marginBottom: '20px' }}>
                                                    <th colSpan="2" className="fw-bold fs-5 ">Purchase Information</th>
                                                </tr>
                                                <tr>
                                                    <td>Cost Price</td>
                                                    <td className="fw-bold">₹245</td>
                                                </tr>
                                                <tr>
                                                    <td>Selling Price</td>
                                                    <td className="fw-bold">₹499</td>
                                                </tr>
                                                <tr>
                                                    <th colSpan="2" className="fw-bold fs-5">Other Information</th>
                                                </tr>
                                                <tr>
                                                    <td>Returnable Item</td>
                                                    <td className="fw-bold">Yes</td>
                                                </tr>
                                                <tr>
                                                    <td>Link with Website</td>
                                                    <td className="fw-bold">No</td>
                                                </tr>
                                                <tr>
                                                    <td>Reorder Point</td>
                                                    <td className="fw-bold">0</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>

                                    <Col sm={5} className="mb-2">
                                        <div className="mb-2 border text-center p-2">
                                            <Image
                                                src="https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg"
                                                alt="product image"
                                                id="imagePreview"
                                                onError={(e) =>
                                                (e.target.src =
                                                    "https://fsm.lockene.net/assets/Web-Fsm/images/avtar/3.jpg")
                                                }
                                                style={{ width: "200px", aspectRatio: "1", objectFit: "cover" }}
                                            />
                                        </div>

                                        <div className="bg-light text-dark p-2 rounded-2 text-start">
                                            <h5>
                                                <b>Accounting Stock</b>
                                            </h5>
                                            <p className="ps-3">
                                                <b>Stock In Hand</b> &nbsp; &nbsp; &nbsp;: 41
                                                <br />
                                                <b>Committed Stock</b> : 22
                                                <br />
                                                <b>Available Stock</b> &nbsp; : 63
                                            </p>

                                            <h5>
                                                <b>Physical Stock</b>
                                            </h5>
                                            <p className="ps-3">
                                                <b>Stock In Hand</b> &nbsp; &nbsp; &nbsp;: 41
                                                <br />
                                                <b>Committed Stock</b> : 0
                                                <br />
                                                <b>Available Stock</b> &nbsp; : 41
                                            </p>

                                            <hr className="my-1" />

                                            <Row>
                                                <Col xs={6} className="pe-1">
                                                    <Card className="rounded-2 border p-1 mb-1 text-center">
                                                        <h4>
                                                            0 <span style={{ fontSize: "10px" }}>Qty</span>
                                                        </h4>
                                                        <p>To be Shipped</p>
                                                    </Card>
                                                </Col>
                                                <Col xs={6} className="ps-1">
                                                    <Card className="rounded-2 border p-1 mb-1 text-center">
                                                        <h4>
                                                            22 <span style={{ fontSize: "10px" }}>Qty</span>
                                                        </h4>
                                                        <p>To be Received</p>
                                                    </Card>
                                                </Col>
                                                <Col xs={6} className="pe-1">
                                                    <Card className="rounded-2 border p-1 mb-1 text-center">
                                                        <h4>
                                                            0 <span style={{ fontSize: "10px" }}>Qty</span>
                                                        </h4>
                                                        <p>To be Invoiced</p>
                                                    </Card>
                                                </Col>
                                                <Col xs={6} className="ps-1">
                                                    <Card className="rounded-2 border p-1 mb-1 text-center">
                                                        <h4>
                                                            122 <span style={{ fontSize: "10px" }}>Qty</span>
                                                        </h4>
                                                        <p>To be Billed</p>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="tabTwo" title="Transaction">
                                {/* <Card className="rounded-2 p-2" style={{ overflowX: "auto" }}> */}
                                <Table className="table-sm table-hover table-vertical-border">
                                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                                        <tr>
                                            <th className="py-3 fw-bold">#</th>
                                            <th className="py-3 fw-bold" >BILL NO</th>
                                            <th className="py-3 fw-bold">QTY</th>
                                            <th className="py-3 fw-bold">PRICE</th>
                                            <th className="py-3 fw-bold">STATUS</th>
                                            <th className="py-3 fw-bold">DATETIME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row) => (
                                            <tr key={row.id}>
                                                <td>{row.id}</td>
                                                <td nowrap="true" className="text-primary " style={{cursor:"pointer"}}>
                                                    {/* <a href={row.link}>{row.billNo}</a> */}
                                                    {row.billNo}
                                                </td>
                                                <td nowrap="true">{row.qty}</td>
                                                <td nowrap="true">{row.price}</td>
                                                <td>{row.status}</td>
                                                <td>{row.datetime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {/* </Card> */}
                            </Tab>
                            <Tab eventKey="tabThree" title="History">
                            <Table className="table-sm table-hover table-vertical-border">
        <thead style={{ backgroundColor: "#f8f9fa" }}>
          <tr>
            <th className="py-3 fw-bold">#</th>
            <th className="py-3 fw-bold">QUANTITY</th>
            <th className="py-3 fw-bold">DESCRIPTION</th>
            <th className="py-3 fw-bold">DATETIME</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.quantity}</td>
              <td>{item.description || "-"}</td>
              <td>{item.datetime}</td>
            </tr>
          ))}
        </tbody>
      </Table>
                            </Tab>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

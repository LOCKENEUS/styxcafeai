import { Card, CardBody, CardHeader, Col, Image, ListGroup, ListGroupItem, Row, Table } from "react-bootstrap";
import { FaRegCircle, FaTag, FaUserAlt } from "react-icons/fa";
import { FiArrowDownLeft } from "react-icons/fi";
import { MdNote } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

export const Dashboards = () => {

    const metrics = [
        {
            title: "Total Sale",
            value: "₹ 0",
            orders: "Shifted",
            change: "4.3%",
            icon: <VscGraph />,

        },
        {
            title: "Total Order",
            value: "0",
            orders: "To be Packed",
            change: "12.5%",
            icon: <FaTag />,

        },
        {
            title: "Cancelled Order",
            value: "0",
            orders: "Not Packed",
            icon: <MdNote />,
        },
        {
            title: "New Order",
            value: "0",
            orders: "To be Packed",
            change: "4.4%",
            icon: <FaUserAlt />, // Affiliate Icon

        },
    ];

    const topProducts = [
        {
            name: "Photive wireless speakers",
            image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img4.jpg",
            change: "-72%",
            changeType: "down",
            price: "$65",
            sold: "7,545",

        },
        {
            name: "Topman shoe in green",
            image: "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img26.jpg",
            change: "+69%",
            changeType: "up",
            price: "$21",
            sold: "6,643",

        },
        {
            name: "RayBan black sunglasses",
            image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img25.jpg",
            change: "-65%",
            changeType: "down",
            price: "$37",
            sold: "5,951",

        },
        {
            name: "Mango Women's shoe",
            image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img6.jpg",
            change: "-53%",
            changeType: "down",
            price: "$65",
            sold: "5,002",

        },
        {
            name: "Calvin Klein t-shirts",
            image: "https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img3.jpg",
            change: "+50%",
            changeType: "up",
            price: "$89",
            sold: "4,714",

        },
        {
            name: "Givenchy perfume",
            image: "	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/img/400x400/img5.jpg",
            change: "+50%",
            changeType: "up",
            price: "$99",
            sold: "4,155",

        },
    ];

    const scheduleItems = [
        {

            title: "Low Stocks Items",
            subtitle: "*Low stock set below 15 Qty",
            borderClass: "border-primary",
            qty: "0",
        },
        {

            title: "All Listed Item",
            subtitle: "",
            borderClass: "border-info",
            qty: "0",
        },
        {

            title: "All Item",
            subtitle: "",
            borderClass: "border-danger",
            qty: "3",
        }
    ];

    return (
        <Row className="p-3">
            <Col md={12} className="mt-4">
                <Row>
                    <Col md={9}>
                        <Card className="mb-3 mb-lg-5 rounded-1">
                            <CardHeader>
                                <h3>Sales Activity</h3>
                            </CardHeader>
                            <CardBody>
                                <Row className="gx-lg-6">
                                    {metrics.map((metric, index) => (
                                        <Col lg={3} key={index}
                                            className={index !== metrics.length - 1 ? "border-end border-gray" : ""}
                                        >
                                            <div className="d-flex">
                                                <div className="flex-grow-1">
                                                    <h6 className="card-subtitle mb-3">{metric.title}</h6>
                                                    <h3 className="card-title">{metric.value}</h3>
                                                    <div className="d-flex align-items-center">
                                                        <span className="d-block fs-6">{metric.orders}</span>
                                                    </div>
                                                </div>
                                                <span className="icon icon-soft-secondary icon-sm icon-circle ms-1 fw-bold">{metric.icon}</span>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </CardBody>
                        </Card></Col>
                    <Col md={3} className="border-start border-gray mt-4">
                        <h6 className="lead text-start fw-bold">Inventory Summary</h6>
                        <Row className="card p-2">
                            <Col md={12} className=" border-bottom border-gray">
                                <div
                                    className="d-flex justify-content-center flex-column mb-3"
                                >
                                    <h6 className="lead">
                                        970
                                    </h6>
                                    <span className="d-block text-success display-6">
                                        <FaRegCircle className="me-1" /> <span className=" text-dark mb-1 me-3">
                                            Quantity in Hand
                                        </span>
                                    </span>
                                </div>
                            </Col>

                            <Col md={12}>
                                <div
                                    className="d-flex justify-content-center flex-column mt-3"
                                >
                                    <h6 className="lead">0</h6>
                                    <span className="d-block text-danger display-6">
                                        <FiArrowDownLeft className="me-1 " /> <span className=" text-dark mb-1 me-3">
                                            Quantity to be Recieved
                                        </span>
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            {/* Product Details */}
            <Col md={12} className="">
                <Row>
                    <Col md={7}>
                        <h2 className="fw-bold my-2">Product Details</h2>
                        <ListGroup className="list-group-flush">
                            {scheduleItems.map((item, index) => (
                                <ListGroupItem key={index} className={`list-group-item-action ${item.borderClass}`}>
                                    <Row className="align-items-center my-2">
                                        <Col>
                                            <h5 className="text-inherit mb-0">{item.title}</h5>
                                            <span className="text-body small">{item.subtitle}</span>
                                        </Col>
                                        <Col sm="auto" className="text-end">
                                            <div className="fw-bold">{item.qty}</div>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>

                    <Col md={5} >
                        {/* Top Products */}
                        <Card className="h-100">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Top Selling Item</h4>
                            </CardHeader>
                            <div className="card-body-height">
                                <div className="table-responsive">
                                    <Table className="table-borderless table-thead-bordered table-nowrap table-align-middle card-table">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Icon</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topProducts.map((product, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <a
                                                            href="./ecommerce-product-details.html"
                                                            className="d-flex align-items-center"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    src={product.image}
                                                                    alt="Product"
                                                                    className="avatar"
                                                                />
                                                            </div>
                                                        </a>
                                                    </td>
                                                    <td>{product.name}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.sold}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
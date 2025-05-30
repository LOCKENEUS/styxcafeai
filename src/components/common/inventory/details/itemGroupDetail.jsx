import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getItemsGroupsById } from "../../../../store/slices/inventory";
import { Breadcrumb, Button, Card, CardHeader, Col, Container, Row } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { RiEditFill } from "react-icons/ri";
import { ItemGroupDeleteModal } from "../delete/itemGroupDelete";

export const ItemGroupDetail = () => {
    const location = useLocation();
    const { groupId } = location.state || {};
    const navigate = useNavigate();
    const [showdeleteModal, setShowDeleteModal] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (groupId) {
            dispatch(getItemsGroupsById(groupId));
        }
    }, [dispatch, groupId]);
    const itemGroupDetails = useSelector((state) => state.inventorySuperAdmin.inventory);
    const handaleBack = () => {
        navigate("/Inventory/ItemsGroup");
    }
    return (
        <Container className="text-center">
            <Row>
                <Card.Header className="fw-bold">
                    <Row className="d-flex justify-content-between align-items-center  ">
                        <Col sm={8} xs={12} >
                            <Breadcrumb>
                                <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>
                                    <Link to="/superadmin/dashboard">Home
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>
                                    <Link to="/Inventory/Dashboard"
                                    >
                                        Inventory
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>
                                    <Link to="/Inventory/ItemsGroup"
                                    >
                                        Items Groups List
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Items Group Details</Breadcrumb.Item>

                            </Breadcrumb>
                        </Col>
                    </Row>
                </Card.Header>

                <Col md={12} className="my-2">
                    <Card className="my-2">
                        <CardHeader as="h5">
                            <Row >
                                <Col sm={6} className="d-flex justify-content-start">
                                    <h3 className="fw-bold txt-start">{itemGroupDetails?.group_name}</h3>
                                </Col>
                                <Col sm={6} className="d-flex justify-content-end">
                                    <Button className="mx-2" variant="outline-dark" onClick={handaleBack}><IoArrowBackOutline className="mx-2" />Back</Button>
                                    <Button className="mx-2" variant="success"><RiEditFill className="mx-2" />
                                        Edit</Button>
                                    <Button className="mx-2" variant="danger"
                                        onClick={() => setShowDeleteModal(true)}
                                    ><MdDelete className="mx-2" />Delete</Button>

                                    <ItemGroupDeleteModal show={showdeleteModal} handleClose={() => setShowDeleteModal(false)} groupId={groupId} />
                                </Col>
                            </Row>
                        </CardHeader>
                    </Card>
                </Col>

                <Col sm={6}>
                    <Card className="my-3 px-4  " style={{ height: "700px", overflowY: "scroll" }} >
                        <Row className="text-start my-4">
                            <Col sm={6} className="justify-content-start align-items-start my-2"><strong className="float-start">Unit</strong></Col>
                            <Col sm={6} className="my-2">{itemGroupDetails?.unit || "---"}</Col>
                            <Col sm={6} className="justify-content-start align-items-start my-2"><strong className="float-start">Tax</strong></Col>
                            <Col sm={6} className="my-2">{itemGroupDetails?.tax?.tax_rate + "%" || "---"}</Col>
                            <Col sm={6} className="justify-content-start align-items-start my-2"><strong className="float-start">Manufacturer</strong></Col>
                            <Col sm={6} className="my-2">{itemGroupDetails?.manufacturer?.name || "---"}</Col>
                            <Col sm={6} className="justify-content-start align-items-start my-2"><strong className="float-start">Brand</strong></Col>
                            <Col sm={6} className="my-2">{itemGroupDetails?.brand?.name || "---"}</Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
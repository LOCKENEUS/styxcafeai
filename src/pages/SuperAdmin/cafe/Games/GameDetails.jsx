import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  Card,
  Image,
  Modal,
  Container,
  Breadcrumb,
} from "react-bootstrap";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGame,
  deleteGame,
  getGameById,
} from "../../../../store/slices/gameSlice";
import CreateSlot from "../Slots/CreateSlot";
import { deleteslot, getslots } from "../../../../store/slices/slotsSlice";
import { IoMdAdd } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import deleteIcon from '/assets/superAdmin/cafe/delete.png';
import Rectangle389 from '/assets/superAdmin/cafe/Rectangle389.png';
// import delete from '/assets/superAdmin/cafe/delete.png';

const GameDetailsCafe = () => {
  const location = useLocation();
  const { cafeId } = location.state || {}; 


  console.log("your cafe id game 99",cafeId);

  return (
    <Container fluid>
      <Row className="my-5">


      <Card.Header className="fw-bold">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Breadcrumb>
              <Breadcrumb.Item href="#" style={{ fontSize: "16px", fontWeight: "500" }}>Home</Breadcrumb.Item>
              <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: "500" }}>
                {/* <Link to="/superadmin/cafe/viewdetails/" > Games Details</Link> */}
                <Link to={`/superadmin/cafe/viewdetails/${cafeId}`}>Games Details</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item  style={{ fontSize: "16px", fontWeight: "500" }} >
              <Link to={`/superadmin/CafeGames`}>
                All Games 
              </Link>
               </Breadcrumb.Item>
              <Breadcrumb.Item active style={{ fontSize: "16px", fontWeight: "500" }} > Game</Breadcrumb.Item>
              
            </Breadcrumb>

     
              {/* <Button variant="primary" className="rounded-3" onClick={() => {
                dispatch(setSelectedGame(null));
                setFormData(null);
                setShowCanvas(true);
              }}>
                <Image src={Add} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "26.25px", height: "26.25px" }} />
                Create  Game
              </Button> */}
            
          </div>
        </Card.Header>


        <Col sm={12}>

        <Card className="my-3 ">

          <Row className="my-3 mx-1">
            <Col sm={4}>
              <Image src={Rectangle389} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </Col>
            <Col sm={8}>
            <Row>
              <Col sm={8}>

                <h5 style={{ fontSize: "24px", fontWeight: "700" ,color:"#0062FF"}}>Game Name</h5>
              
              </Col>
              <Col sm={4}>
               <Button variant="outline-success" className="rounded-2 "
               style={{ fontSize: "14px", fontWeight: "500" }}
               >Edit</Button>

               <Button variant="outline-danger" className="rounded-2 mx-2"
               style={{ fontSize: "14px", fontWeight: "500" }}
               >
                <Image src={deleteIcon} alt="CafeCall" className="mx-1   " style={{ objectFit: "cover", width: "12px", height: "13px" }} />
               </Button>
               
              </Col>
            </Row>
            </Col>
          </Row>

        </Card>
        
        </Col>

      </Row>
    </Container>
  );
};

export default GameDetailsCafe;

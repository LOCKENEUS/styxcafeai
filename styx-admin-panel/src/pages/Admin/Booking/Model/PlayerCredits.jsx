// import React, { useState, useEffect } from "react";
// import { Modal, Button, Row, Col, Container, Spinner } from "react-bootstrap";

// import { BsCurrencyRupee, BsFillPlusSquareFill, BsSquareHalf } from 'react-icons/bs';
// import { LuBadgeCheck, LuSplit } from "react-icons/lu";
// import { LiaCoinsSolid } from "react-icons/lia";

// const PlayerCredits = ({ show,
//   handleClose,
//   booking
// }) => {

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <div className="modal-content rounded-2">
//         <Modal.Header style={{ backgroundColor: "", padding: "20px 20px 0px 20px" }} className="d-flex ">
//           <Modal.Title>
//             Player Credits
//           </Modal.Title>
//           <Button variant="close" onClick={handleClose} className="ms-auto"></Button>
//         </Modal.Header>
//         <Modal.Body className="p-3 text-dark fs-6">
//           <Container className="bg-white rounded-4 shadow" style={{ maxWidth: '600px' }}>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>Name</div>
//               <div>Credit Amount</div>
//               <div>Paid Amount </div>
//               <div>Status</div>
//             </div>
//             {booking?.playerCredits.map((player, index) => (
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>{player.name}</div>
//                 <div>₹ {player.credit || 0}</div>
//                 <div>₹ {player.paid_amount || 0}</div>
//                 <div>{player.status}</div>
//               </div>
//             ))}
//           </Container>
//         </Modal.Body>
//       </div>
//     </Modal>
//   );
// };

// export default PlayerCredits;













import React from "react";
import { Modal, Button, Container, Badge } from "react-bootstrap";
import { BsCurrencyRupee } from 'react-icons/bs';
import { LiaCoinsSolid } from "react-icons/lia";
import { LuBadgeCheck } from "react-icons/lu";

const PlayerCredits = ({ show, handleClose, booking }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <LiaCoinsSolid className="me-2" />
          Player Credits Breakdown ({booking?.booking_id} ) 
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-1">
        <Container className="p-0 pt-2">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="border border-bottom">
                  <th className="ps-3">Player</th>
                  <th className="text-end">Credit</th>
                  <th className="text-end">Paid</th>
                  <th className="text-end pe-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {booking?.playerCredits?.map((player, index) => (
                  <tr key={index}>
                    <td className="ps-3 fw-medium">{player.name}</td>
                    <td className="text-end">
                      <span className="d-flex align-items-center justify-content-end">
                        <BsCurrencyRupee size={14} className="me-1" />
                        {player.credit?.toLocaleString('en-IN') || 0}
                      </span>
                    </td>
                    <td className="text-end">
                      <span className="d-flex align-items-center justify-content-end">
                        <BsCurrencyRupee size={14} className="me-1" />
                        {player.paid_amount?.toLocaleString('en-IN') || 0}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <Badge 
                        bg={player.status === 'Paid' ? 'success' : 'warning'} 
                        className="text-capitalize"
                      >
                        {player.status === 'Paid' && <LuBadgeCheck className="me-1" />}
                        {player.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {booking?.playerCredits?.length === 0 && (
            <div className="text-center py-4 text-muted">
              No credit information available
            </div>
          )}
        </Container>
      </Modal.Body>
      
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerCredits;
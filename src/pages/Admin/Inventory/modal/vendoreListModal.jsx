import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import { BiPlus } from "react-icons/bi";
import { VendorCreateModal } from "./vendorCreate";
import { GetVendorsList } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { useDispatch, useSelector } from "react-redux";

const VendorsList = ({ showVendorList, handleCloseVendorList,onVendorSelect }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showCreateVendor, setShowCreateVendor] = useState(false);

  // Open and close VendorCreateModal
  const handleShowCreateVendor = () => setShowCreateVendor(true);
  const handleCloseCreateVendor = () => setShowCreateVendor(false);

  const handleOpenCreateVendor = () => {
    handleCloseVendorList();
    setTimeout(() => handleShowCreateVendor(), 300);
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  const dispatch = useDispatch();

  // Fetch Vendors List
  useEffect(() => {
    if (cafeId) {
      dispatch(GetVendorsList(cafeId));
    }
  }, [dispatch, cafeId]);

  // Get vendors data from Redux store
  const vendors = useSelector((state) => state.purchaseOrder);
  
  // Ensure vendors is an array before filtering
  const vendorsList = vendors?.vendors || [];
  
  // Filtering vendors based on search input
  const filteredVendors = vendorsList.filter((vendor) =>
    Object.values(vendor).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const displayedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVendorSelected = ( vendor_id) => {
    if (onVendorSelect) {
      onVendorSelect(vendor_id);
    }
    handleCloseVendorList();
  };
 

  return (
    <>
      {/* Vendor List Modal */}
      <Modal
        show={showVendorList}
        onHide={handleCloseVendorList}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-info bg-opacity-50">
          <h4 className="fs-2 mb-3">Vendor List</h4>
        </Modal.Header>
        <Modal.Body>
          {/* Search Input */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-50"
            />
            <Button variant="outline-primary" onClick={handleOpenCreateVendor}>
              <BiPlus size={20} /> New Vendor
            </Button>
          </div>

          {/* Vendor Table */}
          <Table hover responsive className="text-center my-3">
            <thead className="border-bottom border-2 text-white">
              <tr className="bg-info bg-opacity-10">
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {displayedVendors.length > 0 ? (
                displayedVendors.map((vendor, index) => (
                  <tr key={vendor._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{vendor.name}</td>
                    <td>{vendor.emailID}</td>
                    <td>{vendor.phone}</td>
                    <td>{vendor.city1}</td>
                    <td>
                      <Button variant="success" size="sm"
                      onClick={() => handleVendorSelected(vendor._id)}
                      >
                        <BiPlus size={20} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No matching vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          


          {/* Pagination Controls */}
          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="fw-bold"
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="fw-bold"
              />
            </Pagination>
          </div>
        </Modal.Body>
      </Modal>

      {/* Vendor Create Modal */}
      <VendorCreateModal showCreateVendor={showCreateVendor} handleCloseCreateVendor={handleCloseCreateVendor} />
    </>
  );
};

export default VendorsList;


import { Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteItemById } from "../../../../store/slices/inventory";
import { useState } from "react";

export const ItemDeleteModal = ({ show, handleClose, groupId }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await dispatch(deleteItemById(groupId));


        } catch (error) {
            console.error("Error deleting item group", error);
        }
        finally {
            setDeleteLoading(false);
            handleClose();
            navigate("/Inventory/Items");
            setTimeout(() => handleClose(), 100);
        }
    };


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title><h2 className="text-primary fw-bold">Confirm Deletion</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <h4 style={{fontSize: "16px"}}>
                Are you sure you want to delete this item?
                </h4> 
            </Modal.Body>
            <div className="d-flex justify-content-end align-items-end mb-4 mx-3">
                <Button variant="secondary" className="me-2" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" className="me-2" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Deleting
                        </>
                    ) : (
                        "Delete"
                    )}
                </Button>

            </div>
        </Modal>
    );
};

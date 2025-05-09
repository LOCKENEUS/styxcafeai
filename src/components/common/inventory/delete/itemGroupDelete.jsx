import { Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
// import { deleteItemById, deleteItemGroupsById } from "../../../../store/slices/inventory";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const ItemGroupDeleteModal = ({ show, handleClose, groupId }) => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = () => {
        // Replace this with your actual delete logic using groupId
        console.log(`Item with groupId ${groupId} deleted`);
        // try {
        //     dispatch(deleteItemGroupsById(groupId));
        //     console.log(`Item with groupId ${groupId} deleted`);
            
           
        // } catch (error) {
        //     console.error("Error deleting item group", error);
        // }
        // finally {
            setDeleteLoading(false);
            handleClose();
            navigate("/Inventory/ItemsGroup");
            setTimeout(() => handleClose(), 100);
        // }
        // handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this item?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    {deleteLoading ? (
                        <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        Deleting</>
                    ) : (
                        "Delete"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

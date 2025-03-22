import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { addCustomField } from "../../../../store/AdminSlice/CustomField";
import { toast } from "react-toastify";

const Brand = ({ show, handleClose, onCreated }) => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.customFields.loading);
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    
    const cafeId = user?._id || '';
    
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        cafe: cafeId, 
        type: 'Brand',
        description: 'Brand measurement for inventory'
    });

  
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            cafe: cafeId
        }));
    }, [cafeId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitBrand = (e) => {
        e.preventDefault(); 
        
        
        if (!formData.cafe) {
            toast.error('Cafe ID is missing. Please try logging in again.');
            return;
        }


        dispatch(addCustomField(formData))
            .unwrap()
            .then((response) => {
                onCreated && onCreated({
                    id: response._id,
                    name: formData.name,
                    code: formData.code
                });
                handleClose();
                setFormData({
                    name: '',
                    code: '',
                    cafe: cafeId,
                    type: 'Brand',
                    description: 'Brand measurement for inventory'
                });
            })
            .catch((error) => {
                toast.error(error || 'Failed to save brand');
            });
    };

    return (
        <Modal show={show} onHide={handleClose} centered style={{ zIndex: 2000 }}>
            <Modal.Header className="bg-info text-dark  bg-opacity-25 py-3" closeButton>
                <Modal.Title>Brand</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form  autoComplete="off">
                    <div className="row">
                        <div className="col-sm-12 mb-3">
                            <Form.Group controlId="brand_name">
                                <Form.Label>Brand name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Brand Name" 
                                    required 
                                />
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <Button 
                                type="button" 
                                className="btn btn-primary" 
                                id="brandSubmitBtn"
                                onClick={handleSubmitBrand}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default Brand

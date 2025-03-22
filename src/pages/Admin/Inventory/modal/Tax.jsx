import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { addTaxField } from '../../../../store/AdminSlice/TextFieldSlice';
import { useState } from 'react';

const Tax = ({ show, handleClose, onCreated }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const [formData, setFormData] = useState({
        tax_name: '',
        tax_rate: '',
        description: '',
        cafe: cafeId
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addTaxField(formData)).unwrap();
            onCreated && onCreated({
                id: response._id,
                name: response.tax_name,
                rate: response.tax_rate
            });
            handleClose();
            setFormData({
                tax_name: '',
                tax_rate: '',
                description: '',
                cafe: cafeId
            });
        } catch (error) {
            console.error("Error creating tax:", error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'tax_value' ? 'tax_rate' : id]: value
        }));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header className="bg-light text-dark" closeButton>
                <Modal.Title>Create Custom Tax</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="CreateTax" autoComplete="off">
                    <div className="row">
                        <div className="col-sm-6 mb-3">
                            <Form.Group controlId="tax_name">
                                <Form.Label>Tax name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Tax name" 
                                    required 
                                    value={formData.tax_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Group controlId="tax_value">
                                <Form.Label>Tax Value</Form.Label>
                                <div className="input-group input-group-sm">
                                    <Form.Control 
                                        type="tel" 
                                        placeholder="0.00" 
                                        required 
                                        maxLength="2"
                                        value={formData.tax_rate}
                                        onChange={handleChange}
                                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} 
                                    />
                                    <span className="input-group-text">%</span>
                                </div>
                            </Form.Group>
                        </div>
                        <div className="col-sm-12 mb-3">
                            <Form.Group controlId="description">
                                <Form.Label>Tax Description</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Custom tax description" 
                                    required 
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <Button className="btn btn-sm btn-primary" onClick={handleSubmit} id="TaxSubmitBtn">
                                Create Tax
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default Tax

import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { addTaxField } from '../../../../store/AdminSlice/TextFieldSlice';
import { useState } from 'react';

const Tax = ({ show, handleClose }) => {
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
        await dispatch(addTaxField(formData));
        handleClose();
        // Reset form
        setFormData({
            tax_name: '',
            tax_rate: '',
            description: '',
            cafe: cafeId
        });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'tax_value' ? 'tax_rate' : id === 'tax_name' ? 'tax_name' : 'description']: value
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
                            <Form.Group controlId="tax_description">
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
                            <Button className="btn btn-sm btn-primary" type="button" onClick={handleSubmit} id="TaxSubmitBtn">
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

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomField } from '../../../../store/AdminSlice/CustomField';
import {
    Button,
    Row,
    Col,
    FormGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalTitle
} from "react-bootstrap";

const Units = ({ show, handleClose, onCreated }) => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.customFields.loading);
    const user = JSON.parse(localStorage.getItem("user"));
    const cafeId = user?._id;
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        cafe: cafeId,
        type: 'Unit', // Fixed type for Units
        description: 'Unit measurement for inventory'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
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
                    type: 'Unit',
                    description: 'Unit measurement for inventory'
                });
            });
    };

    return (
        <Modal show={show} onHide={handleClose} centered animation={false} style={{ zIndex: 2000 }} >
            <ModalHeader closeButton className='bg-info bg-opacity-25 py-3' >
                <ModalTitle>Inventory Units</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <label className="my-2">Unit Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Enter unit name"
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="my-2">Unit Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Enter unit code"
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default Units

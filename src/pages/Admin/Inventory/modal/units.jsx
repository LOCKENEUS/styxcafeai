import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomField } from '../../../../store/AdminSlice/CustomField';
import { Button,
    Row,
    Col,
    Form,
    FormGroup,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    ModalTitle } from "react-bootstrap";

const Units = ({ show, handleClose }) => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.customFields.loading);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const cafeId = user?._id;
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        cafe:cafeId,
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
            .then(() => {
                handleClose();
                setFormData({
                    name: '',
                    code: '',
                    cafe:cafeId,
                    type: 'Unit',
                    description: 'Unit measurement for inventory'
                });
            });
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
      <ModalHeader closeButton >
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
  
}

export default Units

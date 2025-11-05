import React, { useEffect, useState } from 'react';
import { Button, Offcanvas, Form, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addMembership, updateMembership, getMembershipsByCafeId } from '../../../../store/slices/MembershipSlice';

const MembershipForm = ({ showCanvas, handleCloseCanvas, membership, cafeId, isEditing }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(['']); // Array to store multiple details
  const [width, setWidth] = useState(window.innerWidth < 768 ? "90%" : "50%");

  const initialFormData = {
    name: '',
    validity: 'Yearly', // Default value
    limit: '',
    price: '',
    is_active: true,
    cafe: cafeId
  };

  const [formData, setFormData] = useState(initialFormData);

  // Set form data when editing
  React.useEffect(() => {
    if (isEditing && membership) {
      setFormData({
        ...membership,
      });
      setDetails(membership.details || ['']);
    } else {
      setFormData(initialFormData);
      setDetails(['']);
    }
  }, [isEditing, membership]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle details input change
  const handleDetailChange = (index, value) => {
    const newDetails = [...details];
    newDetails[index] = value;
    setDetails(newDetails);
  };

  // Add new detail field
  const addDetailField = () => {
    setDetails([...details, '']);
  };

  // Remove detail field
  const removeDetailField = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Filter out empty details
    const filteredDetails = details.filter(detail => detail.trim() !== '');
    const submitData = { ...formData, details: filteredDetails };

    try {
      if (isEditing) {
        await dispatch(updateMembership({ id: membership._id, data: submitData })).unwrap();
      } else {
        await dispatch(addMembership(submitData)).unwrap();
      }

      // Refresh the memberships list
      dispatch(getMembershipsByCafeId(cafeId));
      
      // Reset form
      setFormData(initialFormData);
      setDetails(['']);
      
      // Close the form
      handleCloseCanvas();
    } catch (error) {
      console.error('Error saving membership:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setDetails(['']);
    handleCloseCanvas();
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? "80%" : "50%");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <Offcanvas show={showCanvas}  onHide={handleClose} placement="end" style={{ width }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <h2 className="text-primary fw-bold">
            {isEditing ? 'Edit Membership' : 'Create New Membership'}
          </h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Validity</Form.Label>
            <Form.Select
              name="validity"
              value={formData.validity}
              onChange={handleInputChange}
              required
            >
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
              <option value="3 Months">3 Months </option>
              <option value="Quarterly">Quarterly </option>
              <option value="Weekly">Weekly</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Limit
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="limit"
              value={formData.limit}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Details
              <span className="text-danger">*</span>
            </Form.Label>
            {details.map((detail, index) => (
              <div key={index} className="d-flex mb-2 gap-2">
                <Form.Control
                  type="text"
                  value={detail}
                  onChange={(e) => handleDetailChange(index, e.target.value)}
                  placeholder="Enter detail"
                  required
                />
                {details.length > 1 && (
                  <Button 
                    variant="outline-danger" 
                    onClick={() => removeDetailField(index)}
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
            <Button 
              variant="outline-primary" 
              onClick={addDetailField}
              className="mt-2"
            >
              + Add Detail
            </Button>
          </Form.Group>


          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Saving...
                </>
              ) : (
                'Save Membership'
              )}
            </Button>
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MembershipForm;

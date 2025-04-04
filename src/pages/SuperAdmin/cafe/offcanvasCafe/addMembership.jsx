import { useState } from "react";
import { Button, Form, Offcanvas, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addMembership } from "../../../../store/slices/MembershipSlice";



const AddMembershipOffcanvas = ({ show ,handleClose , cafeId , selectedGameDetails}) => {
    console.log("selectedMembership offcanvas -----------",cafeId);


    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState(['']); // Array to store multiple details
   
  
    const initialFormData = {
      name: '',
      validity: 'Yearly',
      limit: '',
      price: '',
      is_active: true,
      cafe: cafeId
    };
  
    const [formData, setFormData] = useState(initialFormData);
  

    const addDetailField = () => {
        setDetails([...details, '']);
      };

      const handleDetailChange = (index, value) => {
        const newDetails = [...details];
        newDetails[index] = value;
        setDetails(newDetails);
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        // Filter out empty details
        const filteredDetails = details.filter(detail => detail.trim() !== '');
        const submitData = { ...formData, details: filteredDetails };
    
        try {
         
            await dispatch(addMembership(submitData)).unwrap();
          
    
          // Refresh the memberships list
        //   dispatch(getMembershipsByCafeId(cafeId));
          
          // Reset form
          setFormData(initialFormData);
          setDetails(['']);
          
          // Close the form
          handleClose(false);
        } catch (error) {
          console.error('Error saving membership:', error);
        } finally {
          setIsLoading(false);
        }
    
        console.log("this is form data :",formData);
      };   
    return (
        <Offcanvas show={show} onHide={handleClose} placement="end"  style={{ width: "600px" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><h2 className="text-primary fw-bold">Create new  Membership</h2></Offcanvas.Title>
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
    )
};
export default AddMembershipOffcanvas;
import React, { useState, useEffect } from 'react';
import { Form, Button, Offcanvas, Card, Row, Col, ListGroup, Modal, Table } from 'react-bootstrap';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSubscription,
  updateSubscription,
  deleteSubscription,
  setSelectedSubscription,
} from '../../../store/slices/subscriptionSlice';
import ViewDetails from './ViewDetails';
import SubscriptionForm from './SubscriptionForm';


const CreatesubScription = () => {
  const dispatch = useDispatch();
  const { subscriptions, selectedSubscription } = useSelector((state) => state.subscriptions);
  const [showCanvas, setShowCanvas] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [width, setWidth] = useState(window.innerWidth < 768 ? '80%' : '50%');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  
  const [subscription, setSubscription] = useState({
    name: '',
    amount: '',
    description: '',
    tax: 10,
    discount: 0,
    plan: 'monthly',
    benefits: [],
    gameBenefits: []
  });

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? '80%' : '50%'); 
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const planBenefits =  ['Basic Support', '5% Discount', 'Weekly Reports',
    'Priority Support', '10% Discount', 'Monthly Reports', '1 Free Item',
    'VIP Support', '15% Discount', 'Bi-weekly Reports', '3 Free Items', 'Early Access',
    '24/7 Support', '20% Discount', 'Weekly Reports', '5 Free Items', 'Early Access', 'Premium Features'
  ];

  const gameBenefits = [
    'Access to Indoor Games (Pool, Table Tennis, Carrom)',
    '5% Discount on Game Bookings (Foosball, Darts)',
    'Weekly Game Tournaments (Chess, Table Tennis)',
    'Priority Booking for Outdoor Games (Badminton, Volleyball)',
    '10% Discount on Game Snacks and Beverages',
    'Monthly Game Pass for Unlimited Pool and Carrom',
    '1 Free Game Session (Foosball or Darts)',
    'VIP Access to Game Zones (Exclusive Pool Tables, Private Game Rooms)',
    '15% Discount on Equipment Rentals (Badminton Rackets, Volleyballs)',
    'Bi-weekly Game Challenges (Chess, Table Tennis)',
    '3 Free Game Tokens (For Arcade or Darts)',
    'Early Access to New Games (VR Gaming, Arcade Machines)',
    '24/7 Game Zone Access (Pool, Carrom, Chess)',
    '20% Discount on Group Bookings (Badminton, Volleyball)',
    'Exclusive Game Nights (Foosball Tournaments, Pool Competitions)',
    '5 Free Game Sessions per Month (Table Tennis, Carrom)',
    'Priority Access to Outdoor Events (Tournaments, Game Festivals)',
    'Premium Game Equipment (High-Quality Cues, Professional Rackets)'
  ];

  const plans = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: '6-month', label: '6 Months' },
    { value: 'yearly', label: 'Yearly' }
  ];

  useEffect(() => {
    if (subscription.amount) {
      const discountAmount = (subscription.amount * subscription.discount) / 100;
      const discountedAmount = subscription.amount - discountAmount;
      const taxAmount = (discountedAmount * subscription.tax) / 100;
      setTotalAmount(Math.ceil(Number(discountedAmount) + taxAmount));
    }
  }, [subscription.amount, subscription.tax, subscription.discount, subscription.plan]);

  const handleBenefitChange = (benefit) => {
    const newBenefits = subscription.benefits.includes(benefit)
      ? subscription.benefits.filter(b => b !== benefit)
      : [...subscription.benefits, benefit];
    setSubscription({ ...subscription, benefits: newBenefits });
  };

  const handleGameBenefitChange = (gameBenefit) => {
    const newGameBenefits = subscription.gameBenefits.includes(gameBenefit)
      ? subscription.gameBenefits.filter(gb => gb !== gameBenefit)
      : [...subscription.gameBenefits, gameBenefit];
    setSubscription({ ...subscription, gameBenefits: newGameBenefits });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      dispatch(updateSubscription({ 
        index: editingIndex, 
        subscription: { ...subscription, totalAmount } 
      }));
    } else {
      dispatch(addSubscription({ ...subscription, totalAmount }));
    }
    setShowCanvas(false);
    setEditingIndex(null);
    resetForm();
  };

  const resetForm = () => {
    setSubscription({
      name: '',
      amount: '',
      description: '',
      tax: 10,
      discount: 0,
      plan: 'monthly',
      benefits: [],
      gameBenefits: []
    });
  };

  const handleEdit = (index) => {
    setSubscription(subscriptions[index]);
    setEditingIndex(index);
    setShowCanvas(true);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSubscription(deleteIndex));
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleView = (sub) => {
    dispatch(setSelectedSubscription(sub));
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="ms-3">
          <h1>Subscription Details</h1>
        </div>
        <Button variant="primary" onClick={() => setShowCanvas(true)}>
          Create Subscription
        </Button>
      </div>
  
      <Table striped bordered hover responsive className="mt-3 mb-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub, index) => (
            <tr key={index}>
              <td>{sub.name}</td>
              <td>{plans.find(p => p.value === sub.plan)?.label || sub.plan}</td>
              <td>${sub.amount}</td>
              <td>{sub.discount}%</td>
              <td>{sub.tax}%</td>
              <td>${sub.totalAmount.toFixed(2)}</td>
              <td className='d-flex justify-content-evenly'>
                <Button 
                  variant="info" 
                  onClick={() => handleView(sub)}
                >
                  View <BsEye/>
                </Button>
                <Button variant="warning" onClick={() => handleEdit(index)}>Edit <BiEdit/></Button>
                <Button variant="danger" onClick={() => handleDelete(index)}>Delete <BiTrash/></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

          <SubscriptionForm
          editingIndex={editingIndex}
          subscription={subscription}
          setSubscription={setSubscription}
          totalAmount={totalAmount}
          plans={plans}
          planBenefits={planBenefits}
          gameBenefits={gameBenefits}
          handleBenefitChange={handleBenefitChange}
          handleGameBenefitChange={handleGameBenefitChange}
          handleSubmit={handleSubmit}
          setShowCanvas={setShowCanvas}
          showCanvas={showCanvas}
          width={width}

          />

      {/* <Offcanvas show={showCanvas} style={{ width }} onHide={() => setShowCanvas(false)} placement="end">
        <Offcanvas.Header closeButton>

          <Offcanvas.Title>   <h2 className="text-primary fw-bold">{editingIndex !== null ? 'Edit Subscription' : 'Create Subscription'} </h2></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold" htmlFor="subscriptionName">Subscription Name</Form.Label>
              <Form.Control
                id="subscriptionName"
                type="text"
                required
                value={subscription.name}
                onChange={(e) => setSubscription({ ...subscription, name: e.target.value })}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold" htmlFor="amount">Amount ($)</Form.Label>
                  <Form.Control
                    id="amount"
                    type="number"
                    required
                    value={subscription.amount}
                    onChange={(e) => setSubscription({ ...subscription, amount: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold" htmlFor="discount">Discount (%)</Form.Label>
                  <Form.Control
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={subscription.discount}
                    onChange={(e) => setSubscription({ ...subscription, discount: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold" htmlFor="tax">Tax (%)</Form.Label>
                  <Form.Control
                    id="tax"
                    type="number"
                    value={subscription.tax}
                    onChange={(e) => setSubscription({ ...subscription, tax: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mb-3 text-center">
              <h5 className="text-primary fw-bold">Total Amount: ${totalAmount.toFixed(2)}</h5>
            </div>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold" htmlFor="description">Description</Form.Label>
              <Form.Control
                id="description"
                as="textarea"
                rows={3}
                value={subscription.description}
                onChange={(e) => setSubscription({ ...subscription, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Select Plan</Form.Label>
              <div className='d-flex justify-content-between align-items-center '>
                {plans.map((plan) => (
                  <Form.Check
                    key={plan.value}
                    id={`plan-${plan.value}`}
                    type="radio"
                    label={plan.label}
                    name="plan"
                    checked={subscription.plan === plan.value}
                    onChange={() => setSubscription({ ...subscription, plan: plan.value })}
                  />
                ))}
              </div>
            </Form.Group>
            <div className='d-flex justify-content-between align-content-center'>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Select Benefits</Form.Label>
                <div>
                  {planBenefits.map((benefit, index) => (
                    <Form.Check
                      key={benefit}
                      id={`benefit-${index}`}
                      type="checkbox"
                      label={benefit}
                      checked={subscription.benefits.includes(benefit)}
                      onChange={() => handleBenefitChange(benefit)}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Select Game Benefits</Form.Label>
                <div>
                  {gameBenefits.map((gameBenefit, index) => (
                    <Form.Check
                      key={gameBenefit}
                      id={`game-benefit-${index}`}
                      type="checkbox"
                      label={gameBenefit}
                      checked={subscription.gameBenefits.includes(gameBenefit)}
                      onChange={() => handleGameBenefitChange(gameBenefit)}
                    />
                  ))}
                </div>
              </Form.Group>
            </div>
          

             <Button variant="primary" type="submit" className="w-100">
                       {editingIndex !== null ? 'Update Subscription' : 'Create Subscription'}
                     </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas> */}
      {selectedSubscription && (
        <ViewDetails
          subscription={selectedSubscription}
          onHide={() => dispatch(setSelectedSubscription(null))}
        />
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this subscription?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreatesubScription;

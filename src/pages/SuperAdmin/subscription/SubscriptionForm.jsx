import React from 'react'
import { Offcanvas, Form, Row, Col, Button } from 'react-bootstrap';

const SubscriptionForm = ({
    showCanvas, width,  handleSubmit, setShowCanvas,
    editingIndex, subscription, setSubscription, totalAmount, plans, planBenefits, gameBenefits, handleBenefitChange, handleGameBenefitChange

}) => {
  return (
    <Offcanvas show={showCanvas} style={{ width }} onHide={() => setShowCanvas(false)} placement="end">

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
  </Offcanvas>
  )
}

export default SubscriptionForm

import React, { useState } from "react";
import FormField from "../formField/FormField";
import { Form, Row, Col } from "react-bootstrap";

const DynamicForm = ({ formData }) => {
  const [formState, setFormState] = useState(formData.initialData || {});

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <Form >
      {formData.rows ? (
        formData.rows.map((row, rowIndex) => (
          <Row key={rowIndex} className="mb-3">
            {row.fields.map((field) => (
              <Col key={field.name} md={field.col || 6}>
                <FormField field={field} value={formState[field.name]} onChange={handleChange} />
              </Col>
            ))}
          </Row>
        ))
      ) : (
        // Fallback for single column fields
        formData.fields.map((field) => (
          <FormField key={field.name} field={field} value={formState[field.name]} onChange={handleChange} />
        ))
      )}
    </Form>
  );
};

export default DynamicForm;

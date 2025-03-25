import React from "react";
import { Form } from "react-bootstrap";

const FormField = ({ field, value, onChange }) => {
  return (
<>
  <Form.Group className="mb-3">
    <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem', color: '#555' }}>
      {field.label} {field.required && <span className="text-danger">*</span>}
    </Form.Label>

    {field.type === "select" ? (
      <Form.Select name={field.name} value={value || ""} onChange={onChange} required={field.required} className="rounded-2">
        <option value="">Select {field.label}</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </Form.Select>
    ) : field.type === "textarea" ? (
      <Form.Control
        as="textarea"
        name={field.name}
        value={value || ""}
        onChange={onChange}
        required={field.required}
        rows={field.rows || 3}
        className="rounded-2"
      />
    ) : field.type === "radio" ? (
      field.options.map((option) => (
        <Form.Check
          key={option}
          type="radio"
          name={field.name}
          value={option}
          label={option}
          checked={value === option}
          onChange={onChange}
          required={field.required}
          className="me-2"
        />
      ))
    ) : field.type === "checkbox" ? (
      <Form.Check
        type="checkbox"
        name={field.name}
        label={field.label}
        checked={!!value}
        onChange={(e) => onChange({ target: { name: field.name, value: e.target.checked } })}
        required={field.required}
        className="rounded-2"
      />
    ) : field.type === "file" ? (
      <Form.Control
        type="file"
        name={field.name}
        onChange={onChange}
        required={field.required}
        className="rounded-2"
      />
    ) : (
      <Form.Control
        type={field.type}
        name={field.name}
        value={value || ""}
        onChange={onChange}
        required={field.required}
        className="rounded-2"
      />
    )}
  </Form.Group>
</>

  );
};

export default FormField;
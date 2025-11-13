import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const HeroContentManager = () => {
  const [heroContents, setHeroContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Book Now",
    buttonLink: "/booking",
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHeroContents();
  }, []);

  const fetchHeroContents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/cms/hero`);
      if (response.data.status) {
        setHeroContents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching hero contents:", error);
      toast.error("Failed to fetch hero contents");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSend.append("backgroundImage", imageFile);
      }

      let response;
      if (editingContent) {
        response = await axios.put(
          `${API_BASE_URL}/admin/cms/hero/${editingContent._id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/admin/cms/hero`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if (response.data.status) {
        toast.success(
          editingContent
            ? "Hero content updated successfully"
            : "Hero content created successfully"
        );
        fetchHeroContents();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error saving hero content:", error);
      toast.error(error.response?.data?.message || "Failed to save hero content");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero content?")) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/cms/hero/${id}`);
      if (response.data.status) {
        toast.success("Hero content deleted successfully");
        fetchHeroContents();
      }
    } catch (error) {
      console.error("Error deleting hero content:", error);
      toast.error("Failed to delete hero content");
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      subtitle: content.subtitle || "",
      description: content.description || "",
      buttonText: content.buttonText,
      buttonLink: content.buttonLink,
      order: content.order,
      isActive: content.isActive,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContent(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      buttonText: "Book Now",
      buttonLink: "/booking",
      order: 0,
      isActive: true,
    });
    setImageFile(null);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Hero Content Management</h2>
          <p className="text-muted">
            Manage hero banners for the customer website. Changes are synced in
            real-time!
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Add Hero Content
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Title</th>
                    <th>Subtitle</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {heroContents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No hero content found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    heroContents.map((content) => (
                      <tr key={content._id}>
                        <td>{content.order}</td>
                        <td>{content.title}</td>
                        <td>{content.subtitle || "-"}</td>
                        <td>
                          {content.backgroundImage && (
                            <img
                              src={`${API_BASE_URL}/${content.backgroundImage}`}
                              alt={content.title}
                              style={{ width: 100, height: 60, objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              content.isActive ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {content.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="sm btn-outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(content)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="sm btn-outline-danger"
                            size="sm"
                            onClick={() => handleDelete(content._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingContent ? "Edit Hero Content" : "Add Hero Content"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Background Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {editingContent?.backgroundImage && !imageFile && (
                <div className="mt-2">
                  <img
                    src={`${API_BASE_URL}/${editingContent.backgroundImage}`}
                    alt="Current"
                    style={{ width: 200, height: 120, objectFit: "cover" }}
                  />
                </div>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Button Text</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Button Link</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonLink: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : editingContent ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default HeroContentManager;

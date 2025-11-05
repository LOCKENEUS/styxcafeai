import React, { useState, useRef, useEffect } from 'react';
import { Form, Row, Col, Button, Table, Offcanvas, Card, Image } from 'react-bootstrap';
import { TiDeleteOutline } from "react-icons/ti";

const ViewDetails = ({ table, onClose, onDelete, onEdit }) => (
  <div className="p-4">
    <Button variant="outline-secondary" onClick={onClose} className="mb-4 text-primary">
      ← Back to List
    </Button>

    <Card className="shadow">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <Card.Title className="text-primary">Table #{table.tableId}</Card.Title>
          <div className="d-flex gap-2">
            <Button variant="outline-warning" onClick={onEdit}>Edit</Button>
            <Button variant="outline-danger" onClick={onDelete}>Delete</Button>
          </div>
        </div>

        <Row>
          <Col md={6}>
            <dl className="row">
              {Object.entries({
                'Table ID': table.tableId,
                'Game': table.gameName,
                'Players': table.numberOfPlayers,
                'Status': table.availability,
                'Description': table.description
              }).map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="col-sm-4">{key}</dt>
                  <dd className="col-sm-8">{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </Col>

          <Col md={6}>
            {table.images && table.images.length > 0 ? (
              <Row className="g-2">
                {table.images.map((image, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <Image 
                      src={image} 
                      fluid 
                      thumbnail 
                      className="w-100 h-100"
                      alt={`Table preview ${index + 1}`}
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No images available</p>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </div>
);

const CreateTable = () => {
  const [formData, setFormData] = useState({});
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth < 768 ? '80%' : '50%');

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? '80%' : '50%');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    Promise.all(
      files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      })
    ).then(results => {
      setImagePreview(prev => [...prev, ...results]);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...results]
      }));
    });
  };

  const handleRemoveImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({});
    setEditingIndex(-1);
    setShowCanvas(false);
    setImagePreview([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTables = [...tables];
    editingIndex === -1 ? newTables.push(formData) : (newTables[editingIndex] = formData);
    setTables(newTables);
    resetForm();
  };

  const handleEdit = (table) => {
    setFormData(table);
    setEditingIndex(tables.indexOf(table));
    setImagePreview(table.images || []);
    setShowCanvas(true);
    setShowDetails(false);
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Table Management</h1>
        <Button variant="primary" onClick={() => setShowCanvas(true)}>Add New Table</Button>
      </div>

      {showDetails ? (
        <ViewDetails
          table={selectedTable}
          onClose={() => setShowDetails(false)}
          onDelete={() => {
            setTables(tables.filter((t) => t !== selectedTable));
            setShowDetails(false);
          }}
          onEdit={() => handleEdit(selectedTable)}
        />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Table ID</th>
              <th>Game</th>
              <th>Players</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tables.length ? (
              tables.map((table, index) => (
                <tr key={index} onClick={() => { setSelectedTable(table); setShowDetails(true); }} style={{ cursor: "pointer" }}>
                  <td>{index + 1}</td>
                  <td>{table.images?.[0] && <img src={table.images[0]} alt="Table" width={50} height={50} style={{ objectFit: "cover" }} />}</td>
                  <td>{table.tableId}</td>
                  <td>{table.gameName}</td>
                  <td>{table.numberOfPlayers}</td>
                  <td>{table.availability}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center fw-bold py-3">No Tables Added Yet</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Offcanvas show={showCanvas} onHide={resetForm} placement="end" style={{ width }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h2 className="text-primary fw-bold">
              {editingIndex === -1 ? "Add New Table" : "Edit Table"}
            </h2>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-bold text-secondary">Table ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="tableId"
                    value={formData.tableId || ''}
                    onChange={handleInputChange}
                    required
                    className="py-2 border-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-bold text-secondary">Game Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="gameName"
                    value={formData.gameName || ''}
                    onChange={handleInputChange}
                    required
                    className="py-2 border-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-bold text-secondary">Number of Players</Form.Label>
                  <Form.Control
                    type="number"
                    name="numberOfPlayers"
                    value={formData.numberOfPlayers || ''}
                    onChange={handleInputChange}
                    required
                    className="py-2 border-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-bold text-secondary">Availability</Form.Label>
                  <Form.Select
                    name="availability"
                    value={formData.availability || ''}
                    onChange={handleInputChange}
                    required
                    className="py-2 border-2"
                  >
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-secondary">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                className="py-2 border-2"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-secondary">Upload Images</Form.Label>
              <div className="border-2 rounded-3 p-3 bg-light">
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  id="fileUpload"
                  ref={fileInputRef}
                  multiple
                />
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-center">
                    <label
                      htmlFor="fileUpload"
                      className="btn btn-outline-primary"
                      style={{width: "10rem", height: "3rem"}}
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {imagePreview.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="img-thumbnail"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <div 
                            onClick={() => handleRemoveImage(index)}
                            className="position-absolute top-0 end-0 cursor-pointer"
                            style={{transform: 'translate(25%, -25%)'}}
                          >
                            <TiDeleteOutline color="red" size={25}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Form.Group>

            <div className="mt-3 d-flex gap-2 justify-content-end">
              <Button variant="success" type="submit">
                Save Table
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={resetForm}
                className="px-4 py-2 fw-bold"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CreateTable; 
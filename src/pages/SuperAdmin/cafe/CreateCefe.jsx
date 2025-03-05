import React, { useState, useRef, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { addCafe, updateCafe, deleteCafe, fetchCafes, selectCafes, selectLoading, selectError } from '../../../store/slices/cafeSlice';
import { Navigate } from "react-router-dom";

import ViewDetails from "./ViewDetails";
import CafeForm from "./CafeForm";
import Loader from "../../../components/common/Loader/Loader";
const CafeManager = () => {
  const dispatch = useDispatch();
  const cafes = useSelector(selectCafes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [formData, setFormData] = useState({});
  const [selectedCafe, setSelectedCafeState] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showCanvas, setShowCanvas] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth < 768 ? '100%' : '50%');
  const [imagePreview, setImagePreview] = useState([]);
  const initialFormData = {
    name: '',
    email: '',
    contact_no: '',
    cafe_name: '',
    address: '',
    website_url: '',
    cafeImage: [],
    location: null,
    description: '',
    editId: null,
    password: '',
    gstNo: '',
    panNo: '',
    ownershipType: '',
    depositAmount: '',
    yearsOfContract: '',
    document: [],
    officeContactNo: '',
  };

  const [formDataState, setFormDataState] = useState(initialFormData);


  // MObile Size 
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? '100%' : '50%');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch]);

  useEffect(() => {
    console.log('Cafes:', cafes.data);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [cafes, loading, error]);

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  //  Updated handleFileChange for multiple images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Process each file
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
      // Update both preview and formData
      setImagePreview(prev => [...prev, ...results]);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...results]
      }));
    });
  };


  // Updated handleRemoveImage to remove specific image
  const handleRemoveImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images ? prev.images.filter((_, i) => i !== index) : []
    }));
  };

  // Reset form should also clear images
  const resetForm = () => {
    setFormData({});
    setEditingIndex(-1);
    setShowCanvas(false);
    setImagePreview([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (showCanvas && !isEditing) {
      setFormDataState((prev) => prev === initialFormData ? prev : initialFormData);
      setImagePreview([]); // Clear image previews only when adding a new cafe
    }
  }, [showCanvas, isEditing]); // Remove `setFormDataState` and `initialFormData` from dependencies

  console.log("img", imagePreview)

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleCreateClick = () => {
    setFormData(initialFormData); // Ensure fresh form
    setIsEditing(false);
    setShowCanvas(true);
  };

  const handleEdit = () => {
    if (selectedCafe) {
      setFormDataState({
        name: selectedCafe?.name || "",
        email: selectedCafe?.email || "",
        contact_no: selectedCafe?.contact_no || "",
        cafe_name: selectedCafe?.cafe_name || "",
        address: selectedCafe?.address || "",
        website_url: selectedCafe?.website_url || "",
        cafeImage: selectedCafe?.cafeImage || null,
        location: selectedCafe?.location ? selectedCafe.location._id : null,
        editId: selectedCafe?._id,
        description: selectedCafe?.description || "",
        password: selectedCafe?.password || "",
        gstNo: selectedCafe?.gstNo || "",
        panNo: selectedCafe?.panNo || "",
        ownershipType: selectedCafe?.ownershipType || "",
        depositAmount: selectedCafe?.depositAmount || "",
        yearsOfContract: selectedCafe?.yearsOfContract || "",
        document: selectedCafe?.document || [],
        officeContactNo: selectedCafe?.officeContactNo || "",

      });
      setImagePreview(selectedCafe.cafeImage.split(',').map(image => `${import.meta.env.VITE_API_URL}/${image}`) || []);
      setIsEditing(true);
      setShowCanvas(true);
    }
  };

  console.log("data ", formDataState)
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Cafe Details</h1>
        <Button variant="primary" onClick={handleCreateClick}>Add New Cafe</Button>
      </div>

      {showDetails && selectedCafe ? (
        <Navigate to={`/superadmin/cafe/viewdetails/${selectedCafe._id}`} />
      ) : (
        loading ? <Loader /> : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Cafe Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Owner</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {cafes.length ? (
                cafes.map((cafe, index) => (
                  <tr key={index} onClick={() => { setSelectedCafeState(cafe); setShowDetails(true); }} style={{ cursor: "pointer" }}>
                    <td>{index + 1}</td>
                    <td>{cafe.cafe_name}</td>
                    <td>{cafe.address}</td>
                    <td>{cafe.contact_no}</td>
                    <td>{cafe.name}</td>
                    <td>{cafe.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center fw-bold py-3">No Cafes Added Yet</td>
                </tr>
              )}
            </tbody>
          </Table>
        )
      )}


      <CafeForm
        showCanvas={showCanvas}
        handleCloseCanvas={handleCloseCanvas}
        resetForm={resetForm}
        formData={formData}
        initialFormData={initialFormData}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        imagePreview={imagePreview}
        handleRemoveImage={handleRemoveImage}
        setImagePreview={setImagePreview}
        editingIndex={editingIndex}
        width={width}
        cafeData={formDataState}
        setShowCanvas={setShowCanvas}
        fileInputRef={fileInputRef}
        formDataState={formDataState}
        setFormDataState={setFormDataState}
      />


    </div>
  );
};

export default CafeManager;

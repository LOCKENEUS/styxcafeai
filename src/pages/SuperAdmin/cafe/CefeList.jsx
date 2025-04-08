import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Col, Container, FormControl, Image, InputGroup, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { addCafe, updateCafe, deleteCafe, fetchCafes, selectCafes, selectLoading, selectError } from '../../../store/slices/cafeSlice';
import { Navigate } from "react-router-dom";
import gm1 from "/assets/inventory/mynaui_search.svg";
import plus from "/assets/superAdmin/cafe/Plus.png";
import profile from "/assets/profile/user_avatar.jpg";

import ViewDetails from "./ViewDetails";
import CafeForm from "./CafeForm";
import Loader from "../../../components/common/Loader/Loader";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
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
  const [searchQuery, setSearchQuery] = useState("");
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;



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
  console.log('Cafes data  ---:', cafes);
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


  const filteredCafes = cafes.filter(cafe => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      cafe.cafe_name.toLowerCase().includes(lowercasedQuery) ||
      cafe.address.toLowerCase().includes(lowercasedQuery) ||
      cafe.contact_no.toLowerCase().includes(lowercasedQuery) ||
      cafe.name.toLowerCase().includes(lowercasedQuery) ||
      cafe.email.toLowerCase().includes(lowercasedQuery)

    );
  });

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
    setFormData(initialFormData);
    setIsEditing(false);
    setShowCanvas(true);
  };

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCafes = filteredCafes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCafes.length / itemsPerPage);

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
    <div className="my-5">
      {/* <div className="d-flex justify-content-center align-items-start mb-3">
        <h1 className="text-center">Cafe List</h1>
        
      </div> */}

      {/* <Link to={{ pathname: '/superadmin/CreateMembership/', state: { cafeId } }}></Link>
      to={`/superadmin/cafe/viewdetails/${selectedCafe._id}`} 
      */}

      {showDetails && selectedCafe ? (


        <Navigate to={`/superadmin/cafe/viewdetails/${selectedCafe._id}`} />
      ) : (
        loading ? <Loader /> : (

          <Container fluid>
            <Card className="my-3 mx-auto py-3 px-3 rounded-4" style={{ backgroundColor: "white" }}>

              <Row>
                <Col sm={7} className="fluid d-flex justify-content-start">

                  <h1 className="text-center mx-3 mt-2">Cafe List</h1>

                </Col>

                <Col sm={4} className="my-1" >
                  <InputGroup className="navbar-input-group">
                    <InputGroupText className="border-0"
                      style={{ backgroundColor: "#FAFAFA" }}>
                      <Image src={gm1} alt="search" />
                    </InputGroupText>

                    <FormControl
                      type="search"
                      placeholder="Search for Booking"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ backgroundColor: "#FAFAFA", border: "none" }}
                    />
                    {searchQuery && (
                      <InputGroupText
                        as="button"
                        className="border-0 bg-transparent"
                        onClick={() => setSearchQuery("")}
                      >
                        ✖
                      </InputGroupText>
                    )}
                  </InputGroup>
                </Col>
                <Col sm={1} className=" my-1 d-flex justify-content-start">
                  <Button onClick={handleCreateClick} className=" rounded-4 border-0" style={{ backgroundColor: "#F2F2F2" }} >
                    <Image src={plus} alt="add" className=" " />
                  </Button>
                </Col>



                <Col sm={12}>
                  <Table hover responsive className="my-3">
                    <thead style={{ backgroundColor: "#e9f5f8" }}>
                      <tr className="rounded-4">
                        <th style={{
                          fontWeight: "500",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          color: "black",
                          borderTopLeftRadius: "10px",
                          borderBottomLeftRadius: "10px",
                        }}>#</th>
                        <th style={{
                          fontWeight: "500",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          color: "black",
                        }}>Cafe Name</th>
                        <th style={{
                          fontWeight: "500",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          color: "black",
                        }}>Address</th>
                        <th style={{
                          fontWeight: "500",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          color: "black",
                        }}>Contact</th>
                        <th style={{
                          fontWeight: "500",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          color: "black",
                        }}>Owner</th>
                        <th style={{
                          fontWeight: "500",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          padding: "clamp(10px, 2vw, 15px)",
                          border: "none",
                          color: "black",
                          borderTopRightRadius: "10px",
                          borderBottomRightRadius: "10px"
                        }}>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCafes.length ? (
                        currentCafes.reverse().map((cafe, index) => (
                          <tr key={index}>
                            <td className="py-4">{indexOfFirstItem + index + 1}</td>
                            <td
                              className="py-4"
                              style={{ fontWeight: "600", color: "#0062FF", cursor: "pointer" }}
                              onClick={() => {
                                setSelectedCafeState(cafe);
                                setShowDetails(true);
                              }}
                            >
                              {cafe.cafe_name}
                            </td>
                            <td className="py-4" style={{ width: "20%" }}>{cafe.address}</td>
                            <td className="py-4" style={{ width: "20%" }}>{cafe.contact_no}</td>
                            <td className="py-4" style={{ width: "20%" }}>
                              <Image src={profile} alt="owner" className="rounded-circle mr-2" style={{ width: "50px", height: "50px" }} />
                              {cafe.name}
                            </td>
                            <td className="py-4" style={{ width: "20%" }}>{cafe.email}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center fw-bold py-3">No Cafes Added Yet</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>

                <Col sm={12} className="d-flex justify-content-center align-items-center mt-3">
                  <Button
                    variant="primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>

                  <span className="mx-3">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </Col>
              </Row>


            </Card>
          </Container>
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

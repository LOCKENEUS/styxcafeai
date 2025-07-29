// // import { Container } from 'react-bootstrap';

// // const LandingPage = () => {

// //   return (
// //     <Container>
// //        This is User Dashboard
// //     </Container>
// //   );
// // };

// // export default LandingPage;



// import React, { useState } from 'react';
// import { BiCheckCircle, BiMapPin } from 'react-icons/bi';
// import { FaUserSecret } from 'react-icons/fa';
// // import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

// const LandingPage = () => {

//     const [selectedActivity, setSelectedActivity] = useState('Pickleball (Synthetic)');
//   const [selectedFacility, setSelectedFacility] = useState('Court 1');
//   const [selectedDate, setSelectedDate] = useState('30');
//   const [selectedTime, setSelectedTime] = useState('09:30');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');

//   const dates = [
//     { day: '29', date: 'Jul 2025' },
//     { day: '30', date: 'Jul 2025' },
//     { day: '31', date: 'Jul 2025' },
//     { day: '01', date: 'Aug 2025' }
//   ];

//   const timeSlots = [
//     { time: '09:30', price: '₹ 500' },
//     { time: '10:30', price: '₹ 500' },
//     { time: '11:30', price: '₹ 500' },
//     { time: '12:30', price: '₹ 500' },
//     { time: '01:30', price: '₹ 500' },
//     { time: '02:30', price: '₹ 500' }
//   ];

// return (
//     <div className="min-h-screen bg-white text-white">
//       {/* Header Image Section */}
//       <div className="d-flex h-64 bg-gradient-to-r from-gray-800 to-gray-600 overflow-hidden">
//         <div className="absolute inset-0 bg-opacity-40">
//           <img
//             src="https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Training_Paddles/content.jpg&nw=780"
//             alt="Header"
//             className="w-75 object-cover"
//           />
//         </div>
//         <div className="z-10 p-6">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold">
//               VERIFIED
//             </div>
//             <span className="text-yellow-400 text-sm">⭐ 4.86</span>
//           </div>
//           <h1 className="text-3xl font-bold mb-2">TopServe Pickleball</h1>
//           <div className="flex items-center text-gray-300 mb-2">
//             <BiMapPin className="w-4 h-4 mr-2" />
//             <span>2nd floor, Westend Plaza, Chintu dhani, koregaon, Madhya Pradesh, 403516</span>
//           </div>
//           <div className="flex items-center text-yellow-400">
//             <span className="mr-4">GET DIRECTIONS</span>
//             <span>ASK VENUE OWNER</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}

//     </div>
//   );
// };

// export default LandingPage;


// import { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Button } from 'react-bootstrap';

// const LandingPage = ({ className = '' }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const images = [
//     'https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Training_Paddles/content.jpg&nw=780',
//     'https://www.ussportscamps.com/media/images/pickleball/tips/what-is-pickleball-group-rally.jpg',
//     'https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Training_Paddles/content.jpg&nw=780',
//   ];

//   const goToPrevious = () => {
//     console.log('Previous', images[2]);
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <div className={`relative w-full ${className}`}>
//       {/* Main Image */}
//       <div className="relative overflow-hidden rounded-t-lg">
//         <img
//           src={images[currentIndex]}
//           alt={`Slide ${currentIndex + 1}`}
//           className="w-25 object-cover transition-transform duration-300"
//         />

//         {/* Navigation Arrows */}
//         <button
//           type="button"
//           className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-white border-0 rounded-circle p-2"
//           onClick={goToPrevious}
//         >
//           <ChevronLeft className="h-6 w-6" />
//         </button>

//         <button
//           type="button"
//           className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-white border-0 rounded-circle p-2"
//           onClick={goToNext}
//         >
//           <ChevronRight className="h-6 w-6" />
//         </button>
//       </div>

//       {/* Indicators */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'
//               }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LandingPage;



import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab, Button, Card, Badge, Carousel } from 'react-bootstrap';
import { BiMapPin } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';

const LandingPage = () => {
  const images = [
    'https://www.ussportscamps.com/media/images/pickleball/tips/what-is-pickleball-group-rally.jpg', // replace with actual image paths
    'https://www.ussportscamps.com/media/images/pickleball/tips/what-is-pickleball-group-rally.jpg',
    'https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Training_Paddles/content.jpg&nw=780',
  ];

  const activities = [
    {
      name: 'Padel',
      price: 750,
      facilities: '1 Facility/Session Available',
    },
    {
      name: 'Pickleball (Outdoor)',
      price: 300,
      facilities: '2 Facilities/Sessions Available',
    },
  ];

  const [activeTab, setActiveTab] = useState('book');



  return (
    <Container fluid className="p-3">

      
  <style>
    {`
      .step-circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #ffc107;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .btn-style {
        color: #2b2a2aff;
        background-color: #fafafa;
        border: 1px solid #ffc107;
      }
    `}
  </style>
      <Row className="d-flex flex-column flex-md-row align-items-start">
        <Col md={5} className="position-relative mb-3 mb-md-0">
          <div className="carousel-wrapper position-relative" style={{ maxHeight: '300px', overflow: 'hidden' }}>
            <Carousel controls={true} indicators={true} interval={null}>
              {images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100 object-fit-cover rounded-2"
                    src={img}
                    alt={`Slide ${idx}`}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </Col>

        <Col md={7}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="fw-bold">StyxCafe Wardhaman Nagar | Nagpur</h2>
              <p className="mb-1 text-muted" style={{ fontSize: '1.2rem' }}>
                <BiMapPin className="me-1" />
                Vaishnao Devi Square, Wardhaman Nagar, Nagpur, Maharashtra 440008
              </p>
              {/* <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                <strong>Closest Metro station:</strong> Vaishnao devi metro station (500 m)
              </p> */}
              <p className="mb-0" style={{ fontSize: '1rem' }}>
                <strong>Game:</strong> Pickle Ball
              </p>
            </div>

            <div className="text-end">
              <Button className="p-0 border-0 btn-style">
                <FaStar color="#ffc107" size={16} />
                <span className="ms-1 text-dark fw-bold">4.88</span>
              </Button>
            </div>
          </div>

          <Row className="mt-4">
            <Col md={6} className="mb-3">
              <div className="d-flex align-items-center">
                <div className="step-circle">1</div>
                <h5 className="mb-0 ms-2 fw-bold">Choose an Activity</h5>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="book" className="fw-bold text-uppercase">Book A Slot</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="details" className="fw-bold text-uppercase">Details</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="book">
              <Row>
                <Col lg={8}>
                  {/* Step 1 */}
                  <div className="p-3 bg-white rounded shadow-sm mb-3">
                    <div className="d-flex align-items-center mb-3">
                      <div className="step-circle">1</div>
                      <h5 className="mb-0 ms-2 fw-bold">Choose an Activity</h5>
                    </div>

                    <Row>
                      {activities.map((act, idx) => (
                        <Col sm={6} key={idx} className="mb-3">
                          <Card className="border rounded">
                            <Card.Body>
                              <Card.Title className="fw-semibold">{act.name}</Card.Title>
                              <Card.Text className="text-muted small">{act.facilities}</Card.Text>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold">₹ {act.price} <small className="text-muted">onwards</small></div>
                                <Button className='btn-style' size="sm">Book</Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-light rounded shadow-sm mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="step-circle">2</div>
                      <h5 className="mb-0 ms-2 fw-bold">Choose a Facility</h5>
                    </div>
                    <p className="text-muted ps-4 mb-0">Please select an activity to view available facilities</p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 bg-light rounded shadow-sm mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="step-circle">3</div>
                      <h5 className="mb-0 ms-2 fw-bold">Select Slots</h5>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="bg-light p-5 text-center rounded shadow-sm h-100 d-flex flex-column justify-content-center">
                    <div className="text-muted">
                      <img src="/empty-cart.png" alt="Empty" width="60" className="mb-3" />
                      <div>You have not selected any slots!</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="details">
              <div className="bg-white p-4 rounded shadow-sm">
                <h5>Venue Details</h5>
                <p>This is where venue details or any other content will be shown.</p>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Row>
    </Container>
  );
};

export default LandingPage;

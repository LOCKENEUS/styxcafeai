// import React, { useState } from "react";
// import { Button, Form, Offcanvas } from "react-bootstrap";
// import { BiMobile } from "react-icons/bi";
// import { useDispatch } from "react-redux";
// import { registerUser } from "../../../store/userSlice/AuthSlice";
// import './AuthOffcanvas.css';

// const AuthOffcanvas = ({ show, onClose, cafe }) => {
//     const [isSignup, setIsSignup] = useState(false);
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [contactNo, setContactNo] = useState("");
//     const [password, setPassword] = useState("");
//     const dispatch = useDispatch();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (isSignup) {
//             dispatch(registerUser({
//                 name: name,
//                 email: email,
//                 contact_no: contactNo,
//                 password: password,
//                 cafe: cafe
//             }))
//         } else {
//             console.log("Logging in with:", email);
//         }
//     };

//     return (
//         <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: "500px" }} >
//             <Offcanvas.Header closeButton
//                 style={{
//                     border: "none",
//                     // backgroundImage: "url('/assets/profile/auth_header.png')",
//                     // backgroundSize: "cover", // optional: scale image
//                     // backgroundRepeat: "no-repeat", // optional: prevent tiling
//                     // backgroundPosition: "center", // optional: center the image
//                 }}
//             >
//                 <Offcanvas.Title>
//                 </Offcanvas.Title>
//             </Offcanvas.Header>
//             <Offcanvas.Body className="d-flex flex-column justify-content-between">
//                 <div>
//                     <h6 className="text-center text-muted mb-1">
//                         UNLEASH THE SPORTS PERSON IN YOU!
//                     </h6>
//                     <hr />
//                     <Form onSubmit={handleSubmit} className="px-2">
//                         {isSignup && (<Form.Group controlId="name" className="mb-3">
//                             <Form.Label>Full NAme</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder={"Enter your name"}
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                             />
//                         </Form.Group>)}
//                         {/* <Form.Group controlId="contactNo" className="mb-3">
//                             <Form.Label>Mobile Number</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder={"Enter your mobile number"}
//                                 value={contactNo}
//                                 onChange={(e) => setContactNo(e.target.value)}
//                             />
//                         </Form.Group> */}
//                         <div className="floating-input-container">
//                             <input type="text" className="floating-input" placeholder=" " name="contactNo" value={contactNo} id="contactNo" onChange={(e) => setContactNo(e.target.value)}/>
//                             <label for="contactNo" name="contactNo" className="floating-label">Mobile No</label>
//                         </div>
//                         {isSignup && (<Form.Group controlId="email" className="mb-3">
//                             <Form.Label>Email</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder={"Enter your email"}
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                         </Form.Group>)}

//                         <Form.Group controlId="password" className="mb-3">
//                             <Form.Label>Password</Form.Label>
//                             <Form.Control
//                                 type="password"
//                                 placeholder="Create a password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                         </Form.Group>

//                         <div className="d-grid">
//                             <Button type="submit" style={{ background: "#ffc107", border: "none" }}>
//                                 {isSignup ? "Sign Up" : "Submit"}
//                             </Button>
//                         </div>

//                         <div className="text-center mt-3">
//                             <small>
//                                 {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//                                 <span
//                                     className="text-primary fw-semibold"
//                                     role="button"
//                                     onClick={() => setIsSignup(!isSignup)}
//                                 >
//                                     {isSignup ? "Login" : "Sign Up"}
//                                 </span>
//                             </small>
//                         </div>
//                     </Form>
//                 </div>

//                 <div className="text-center mt-4">
//                     <img
//                         src="/assets/profile/sports_background.png"
//                         alt="bg"
//                         style={{ maxWidth: "100%", height: "75%" }}
//                     />
//                 </div>
//             </Offcanvas.Body>
//         </Offcanvas>
//     );
// };

// export default AuthOffcanvas;










import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../../store/userSlice/AuthSlice";
import './AuthOffcanvas.css';

const AuthOffcanvas = ({ show, onClose, cafe }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(registerUser({
                name,
                email,
                contact_no: contactNo,
                password,
                cafe
            }));
        } else {
            dispatch(loginUser({
                
            }))
        }
    };

    return (
        <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: "500px" }}>
            <Offcanvas.Header closeButton style={{ border: "none" }}>
                <Offcanvas.Title />
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column justify-content-between">
                <div>
                    <h6 className="text-center text-muted mb-1">
                        UNLEASH THE SPORTS PERSON IN YOU!
                    </h6>
                    <hr />
                    <form onSubmit={handleSubmit} className="px-2">

                        {isSignup && (
                            <div className="floating-input-container mb-3">
                                <input
                                    type="text"
                                    id="name"
                                    className="floating-input"
                                    placeholder=" "
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="name" className="floating-label">Full Name</label>
                            </div>
                        )}

                        <div className="floating-input-container mb-3">
                            <input
                                type="text"
                                id="contactNo"
                                className="floating-input"
                                placeholder=" "
                                value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}
                            />
                            <label htmlFor="contactNo" className="floating-label">Mobile No</label>
                        </div>

                        {isSignup && (
                            <div className="floating-input-container mb-3">
                                <input
                                    type="email"
                                    id="email"
                                    className="floating-input"
                                    placeholder=" "
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="email" className="floating-label">Email</label>
                            </div>
                        )}

                        <div className="floating-input-container mb-3">
                            <input
                                type="password"
                                id="password"
                                className="floating-input"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password" className="floating-label">Password</label>
                        </div>

                        <div className="d-grid">
                            <Button type="submit" style={{ background: "#ffc107", border: "none" }}>
                                {isSignup ? "Sign Up" : "Submit"}
                            </Button>
                        </div>

                        <div className="text-center mt-3">
                            <small>
                                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                                <span
                                    className="text-primary fw-semibold"
                                    role="button"
                                    onClick={() => setIsSignup(!isSignup)}
                                >
                                    {isSignup ? "Login" : "Sign Up"}
                                </span>
                            </small>
                        </div>
                    </form>
                </div>

                <div className="text-center mt-4">
                    <img
                        src="/assets/profile/sports_background.png"
                        alt="bg"
                        style={{ maxWidth: "100%", height: "75%" }}
                    />
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AuthOffcanvas;


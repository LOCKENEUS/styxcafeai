// import React, { useState } from "react";
// import { Button, Offcanvas } from "react-bootstrap";
// import { useDispatch } from "react-redux";
// import { loginUser, registerUser } from "../../../store/userSlice/AuthSlice";
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
//                 name,
//                 email,
//                 contact_no: contactNo,
//                 password,
//                 cafe
//             }));
//         } else {
//             dispatch(loginUser({

//             }))
//         }
//     };

//     return (
//         <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: "500px" }}>
//             <Offcanvas.Header closeButton style={{ border: "none" }}>
//                 <Offcanvas.Title />
//             </Offcanvas.Header>
//             <Offcanvas.Body className="d-flex flex-column justify-content-between">
//                 <div>
//                     <h6 className="text-center text-muted mb-1">
//                         UNLEASH THE SPORTS PERSON IN YOU!
//                     </h6>
//                     <hr />
//                     <form onSubmit={handleSubmit} className="px-2">

//                         {isSignup && (
//                             <div className="floating-input-container mb-3">
//                                 <input
//                                     type="text"
//                                     id="name"
//                                     className="floating-input"
//                                     placeholder=" "
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                 />
//                                 <label htmlFor="name" className="floating-label">Full Name</label>
//                             </div>
//                         )}

//                         <div className="floating-input-container mb-3">
//                             <input
//                                 type="text"
//                                 id="contactNo"
//                                 className="floating-input"
//                                 placeholder=" "
//                                 value={contactNo}
//                                 onChange={(e) => setContactNo(e.target.value)}
//                             />
//                             <label htmlFor="contactNo" className="floating-label">Mobile No</label>
//                         </div>

//                         {isSignup && (
//                             <div className="floating-input-container mb-3">
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     className="floating-input"
//                                     placeholder=" "
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                 />
//                                 <label htmlFor="email" className="floating-label">Email</label>
//                             </div>
//                         )}

//                         <div className="floating-input-container mb-3">
//                             <input
//                                 type="password"
//                                 id="password"
//                                 className="floating-input"
//                                 placeholder=" "
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <label htmlFor="password" className="floating-label">Password</label>
//                         </div>

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
//                     </form>
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
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const validate = () => {
        const newErrors = {};
        if (isSignup) {
            if (!name.trim()) newErrors.name = "Name is required";
            else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

            if(email){
                if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email";
            }
        }

        if (!contactNo.trim()) newErrors.contactNo = "Mobile number is required";
        else if (!/^\d{10}$/.test(contactNo)) newErrors.contactNo = "Enter a valid 10-digit number";

        if (!password.trim()) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

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
                name,
                contact_no: contactNo,
                password
            }));
            handleOnlinePayment();
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

                        {/* {isSignup && ( */}
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
                                {errors.name && <small className="text-danger">{errors.name}</small>}
                            </div>
                        {/* )} */}

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
                            {errors.contactNo && <small className="text-danger">{errors.contactNo}</small>}
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
                                {errors.email && <small className="text-danger">{errors.email}</small>}
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
                            {errors.password && <small className="text-danger">{errors.password}</small>}
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
                                    onClick={() => {
                                        setIsSignup(!isSignup);
                                        setErrors({});
                                    }}
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

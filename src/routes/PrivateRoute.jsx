// // src/routes/PrivateRoute.jsx
// import { Outlet, Navigate } from "react-router-dom";

// const PrivateRoute = () => {
//   const isAuthenticated = localStorage.getItem("authToken");
//   return isAuthenticated ? <Outlet /> : <Navigate to="/superadmin/login" replace />;
// };

// export default PrivateRoute;


import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = JSON.parse(localStorage.getItem("userRole") || '""');

  return isAuthenticated && userRole === "superadmin" ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;


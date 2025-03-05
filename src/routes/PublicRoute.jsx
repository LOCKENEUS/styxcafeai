// // routes/PublicRoute.jsx
// import { Navigate, Outlet } from 'react-router-dom';

// const PublicRoute = ({ isAuthenticated, ...props }) => {
//   return !isAuthenticated ? (
//     <Outlet {...props} />
//   ) : (
//     <Navigate to="/superadmin/dashboard" replace />
//   );
// };

// export default PublicRoute;

import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ isAuthenticated }) => {
  const userRole = JSON.parse(sessionStorage.getItem("userRole"));

  // If user is authenticated, redirect based on their role
  if (isAuthenticated) {
    if (userRole === "superadmin") {
      return <Navigate to="/superadmin/dashboard" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "user") {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // If not authenticated, allow access to public routes
  return <Outlet />;
};

export default PublicRoute;

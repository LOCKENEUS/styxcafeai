import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = JSON.parse(localStorage.getItem("userRole") || '""');

  // Only allow superadmin users (NOT admin)
  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace />;
  }

  if (userRole === "admin") {
    // Admin trying to access superadmin routes - redirect to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (userRole === "superadmin") {
    return <Outlet />;
  }

  // Unknown role - redirect to login
  return <Navigate to="/superadmin/login" replace />;
};

export default PrivateRoute;

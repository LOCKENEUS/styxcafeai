import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ isAuthenticated }) => {
  const userRole = JSON.parse(localStorage.getItem("userRole") || '""');
  const authToken = localStorage.getItem("authToken");

  // If user is already authenticated, redirect to their appropriate dashboard
  if (authToken && userRole) {
    if (userRole === "superadmin") {
      return <Navigate to="/superadmin/dashboard" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "user") {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;

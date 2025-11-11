import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = JSON.parse(localStorage.getItem("userRole"));

  // Only allow admin users (NOT superadmin)
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userRole === "superadmin") {
    // Superadmin trying to access admin routes - redirect to superadmin dashboard
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  if (userRole === "admin") {
    return <Outlet />;
  }

  // Unknown role - redirect to login
  return <Navigate to="/admin/login" replace />;
};

export default AdminRoute;

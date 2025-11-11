import { Navigate, Outlet } from "react-router-dom";

const InventoryRoute = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = JSON.parse(localStorage.getItem("userRole"));

  // Allow both admin and superadmin to access inventory routes
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userRole === "admin" || userRole === "superadmin") {
    return <Outlet />;
  }

  // Unknown role or user - redirect to login
  return <Navigate to="/admin/login" replace />;
};

export default InventoryRoute;

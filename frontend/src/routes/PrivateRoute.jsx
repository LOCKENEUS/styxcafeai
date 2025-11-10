import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = JSON.parse(localStorage.getItem("userRole") || '""');

  return isAuthenticated && userRole === "superadmin" ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;


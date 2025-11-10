import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  // const userRole = localStorage.getItem("userRole");
  const userRole = JSON.parse(localStorage.getItem("userRole"));

  return isAuthenticated && (userRole === "admin" || userRole === "superadmin") ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminRoute;


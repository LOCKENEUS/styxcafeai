// // routes/AdminRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";

// const AdminRoute = () => {
//   const isAuthenticated = sessionStorage.getItem("authToken");
//   const userRole = sessionStorage.getItem("userRole");

//   return isAuthenticated && userRole === "admin" ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/admin/login" replace />
//   );
// };

// export default AdminRoute;


import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAuthenticated = sessionStorage.getItem("authToken");
  // const userRole = sessionStorage.getItem("userRole");
  const userRole = JSON.parse(sessionStorage.getItem("userRole"));

console.log(userRole);
  return isAuthenticated && (userRole === "admin" || userRole === "superadmin") ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminRoute;


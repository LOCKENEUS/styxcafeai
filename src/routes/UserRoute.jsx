// // routes/UserRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";

// const UserRoute = () => {
//   const isAuthenticated = localStorage.getItem("authToken");
//   const userRole = localStorage.getItem("userRole"); // Assuming you store the role in localStorage

//   return isAuthenticated && userRole === "user" ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/user/login" replace />
//   );
// };

// export default UserRoute;



import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  return isAuthenticated && (userRole === "user" || userRole === "admin" || userRole === "superadmin") ? (
    <Outlet />
  ) : (
    <Navigate to="/user/login" replace />
  );
};

export default UserRoute;


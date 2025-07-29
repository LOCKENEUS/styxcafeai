import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import "./UserLayout.css";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

const UserLayout = ({ setIsAuthenticated }) => {
  return (
    <div className="user-layout">

      <UserHeader setIsAuthenticated={setIsAuthenticated} />
        <Container fluid className="content-wrapper py-4" style={{ minHeight: '100vh' }}>
          {/* Main Navbar */}
          <Outlet />
        </Container>

      <UserFooter />
    </div>
  );
};

export default UserLayout;


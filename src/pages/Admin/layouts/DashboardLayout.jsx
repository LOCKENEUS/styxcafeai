import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/common/navigation/Admin/Sidebar";
import Navbar from "../../../components/common/navigation/Admin/Navbar/MainNavbar";
import "./DashboardLayout.css";

const DashboardLayout = ({ setIsAuthenticated }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1200;
      setIsMobile(mobile);
      setCollapsed(mobile); // Auto-collapse on mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: '#FAFAFA' }}>
      <Sidebar collapsed={collapsed} isMobile={isMobile} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <Navbar setIsAuthenticated={setIsAuthenticated} toggleSidebar={toggleSidebar} collapsed={collapsed} />
        <Container fluid className={`content-wrapper ${isMobile ? 'p-1' : 'p-4'}`}>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default DashboardLayout;

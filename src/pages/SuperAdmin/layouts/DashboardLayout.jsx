import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/common/navigation/Sidebar";
import Navbar from "../../../components/common/navigation/Navbar/MainNavbar";
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
    <div className="dashboard-container">
      <Sidebar collapsed={collapsed} isMobile={isMobile} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <Navbar setIsAuthenticated={setIsAuthenticated} toggleSidebar={toggleSidebar} isSidebarCollapsed={collapsed} />
        <Container fluid className="content-wrapper p-1">
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default DashboardLayout;

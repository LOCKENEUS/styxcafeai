import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import navItems from "./sidebarConfig";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle clicks outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, collapsed, toggleSidebar]);

  return (
    <aside
      ref={sidebarRef}
      className={`navbar navbar-vertical navbar-fixed navbar-expand-xl navbar-bordered bg-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{
        position: "fixed",
        left: collapsed ? "-250px" : "0",
        width: "15rem",
        top: "4rem",
        height: "100vh",
        transition: "left 0.3s ease-in-out, width 0.3s ease-in-out",
      }}
    >
       <button
            ref={toggleButtonRef}
            className="d-flex justify-content-center align-items-center"
            onClick={toggleSidebar}
            style={{
              position: "absolute",
              right: "-4rem",
              top: "5px",
              width: "3rem",
              height: "3rem",
              borderRadius: "100%",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              zIndex: 1000,
              backgroundColor: "white",
              border: "1px solid #ddd",
              touchAction: "manipulation",
            }}
          >
            {collapsed ? (
              <GiHamburgerMenu size={24} style={{ pointerEvents: "none" }} />
            ) : (
              <HiChevronDoubleLeft
                size={24}
                style={{ pointerEvents: "none" }}
              />
            )}
          </button>
      <div className="navbar-vertical-container sidebar-scroll-container"
  style={{
    overflowY: "auto",
    paddingTop: "1rem",
  }}>
        <div className="navbar-vertical-footer-offset">
         

          {/* Sidebar Content */}
          <div className="navbar-vertical-content">
    <div id="navbarVerticalMenu" className="nav nav-pills nav-vertical card-navbar-nav">
      {navItems.map((item, index) => {
        const collapseId = `collapse-${index}`;
        return (
          <div key={index}>
            <span className="dropdown-header mt-1">{item.name}</span>
            <small className="bi-three-dots nav-subtitle-replacer"></small>
            <div className="navbar-nav nav-compact"></div>
            <div id="navbarVerticalMenuPagesMenu">
              <div className="nav-item">
                <a
                  className="nav-link dropdown-toggle collapsed"
                  href={`#${collapseId}`}
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded="false"
                  aria-controls={collapseId}
                >
                  <item.icon className="me-2" />
                  <span className="nav-link-title">{item.title}</span>
                </a>

                <div id={collapseId} className="nav-collapse collapse" data-bs-parent="#navbarVerticalMenuPagesMenu">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className="nav-link"
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      {subItem.title}
                      {subItem.badge && <span className="badge bg-danger ms-2">{subItem.badge}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

          {/* Footer section remains unchanged */}
          <div className="navbar-vertical-footer">
            {/* ... existing footer content ... */}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

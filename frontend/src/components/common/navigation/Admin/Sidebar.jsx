import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiChevronDoubleLeft, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import navItems from "./sidebarConfig";
import { FaCaretDown, FaCaretRight, FaCaretUp } from "react-icons/fa";
import { LuCornerDownRight, LuCornerUpRight, LuLogOut } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import { logout } from '../../../../store/slices/authSlice';
import { gsap } from "gsap";
import { BiHomeAlt } from "react-icons/bi";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const waveRef = useRef(null);

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

  // Improved wave animation effect
  useEffect(() => {
    if (!collapsed && waveRef.current) {
      // Set initial state for all items (main and sub-items)
      gsap.set([
        waveRef.current.querySelectorAll('.nav-item'),
        waveRef.current.querySelectorAll('.nav-collapse-item')
      ], {
        x: -50,
        opacity: 0,
        scale: 0.8,
        display: 'block' // Ensure items are visible before animation
      });

      // Animate main menu items
      gsap.to(waveRef.current.querySelectorAll('.nav-item'), {
        duration: 0.8,
        x: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "all"
      });

      // Handle initially expanded items with smoother transition
      Object.keys(expandedItems).forEach(collapseId => {
        if (expandedItems[collapseId]) {
          const subItems = document.querySelectorAll(`#${collapseId} .nav-collapse-item`);
          gsap.fromTo(subItems,
            { x: -30, opacity: 0, scale: 0.9 },
            {
              duration: 0.5,
              x: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.07,
              ease: "elastic.out(1, 0.5)"
            }
          );
        }
      });
    }
  }, [collapsed]);

  // Enhanced sub-item animation with better timing
  const handleItemClick = (collapseId) => {
    setExpandedItems((prevExpandedItems) => {
      const newState = {
        ...prevExpandedItems,
        [collapseId]: !prevExpandedItems[collapseId]
      };

      const subItems = document.querySelectorAll(`#${collapseId} .nav-collapse-item`);

      // Always ensure items are display block before animation
      gsap.set(subItems, {
        display: 'block',
        pointerEvents: 'none' // Disable interaction during animation
      });

      if (newState[collapseId]) {
        gsap.fromTo(subItems,
          { x: -30, opacity: 0, scale: 0.9 },
          {
            duration: 0.6, // Slightly longer duration
            x: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.07,
            ease: "elastic.out(1, 0.5)",
            onComplete: () => {
              gsap.set(subItems, { pointerEvents: 'auto' }); // Re-enable interaction
            }
          }
        );
      } else {
        gsap.to(subItems, {
          duration: 0.4, // Slightly longer duration
          x: -30,
          opacity: 0,
          scale: 0.9,
          stagger: 0.03,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(subItems, {
              display: 'none',
              pointerEvents: 'auto' // Re-enable interaction
            });
          }
        });
      }

      return newState;
    });
  };

  const handleLogout = async () => {
    try {
      // Dispatch logout action to clear Redux state
      dispatch(logout());

      // Clear session storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');

      // Redirect to login page
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`navbar navbar-vertical navbar-fixed navbar-expand-xl navbar-light bg-white shadow-sm transition-all duration-300 ${collapsed ? "w-16" : "w-64"
        }`}
      style={{
        position: "fixed",
        left: collapsed ? "-272px" : "0",
        width: "272px",
        top: "4rem",
        height: "calc(100vh - 4rem)",
        transition: "all 0.3s ease-in-out",
        borderRight: "1px solid #e5e7eb",
        zIndex: 99,
        overflowY: "auto",
        transform: collapsed ? "translateX(-272px)" : "translateX(0)",
      }}
    >


      <div
        ref={waveRef}
        className="navbar-vertical-container"
        style={{
          height: "100%",
          // overflowY: "auto",
          // overflowX: "hidden",
          paddingTop: "1rem"
        }}
      >

        <div className="navbar-vertical-content px-2" style={{ overflowY: 'auto', height: 'calc(100% - 100px)' }}>
          <div style={{ marginBottom: window.innerWidth <= 768 ? "5rem" : "2rem" }} className="nav nav-pills nav-flush flex-column">
            <div className="nav-item">
              <div className="nav-item-wrapper">
                <Link
                  className="nav-link rounded py-3 px-3"
                  to="/admin/dashboard"
                  style={{
                    // marginLeft: "20px",
                    color: "#1e3a8a",
                    backgroundColor: location.pathname === "/admin/dashboard" ? "#F4F4F4" : "transparent",
                    fontWeight: location.pathname === "/admin/dashboard" ? "600" : "normal",
                    transition: "all 0.2s",
                  }}
                >
                  <BiHomeAlt className="flex-shrink-0 me-3" style={{ fontSize: "1.25rem" }} />
                  <span className="nav-link-text flex-grow-1">Dashboard</span>
                </Link>
              </div>
            </div>

            {navItems.map((item, index) => {
              const collapseId = `collapse-${index}`;

              // Check if any sub-item matches current path
              const isActive = item.subItems && item.subItems.some(subItem =>
                subItem.sub && subItem.sub.some(furtherSubItem =>
                  furtherSubItem.path === location.pathname
                )
              );

              return (
                <div key={index} className="nav-item">

                  <div className="nav-item-wrapper">
                    <a
                      className="nav-link rounded py-3 px-3"
                      href={`#${collapseId}`}
                      role="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${collapseId}`}
                      aria-expanded={expandedItems[collapseId]}
                      aria-controls={collapseId}
                      style={{
                        color: "#1e3a8a",
                        backgroundColor: expandedItems[collapseId] || isActive ? "#F4F4F4" : "transparent",
                        transition: "all 0.2s",
                        '&:hover': {
                          transform: 'translateX(5px)'
                        }
                      }}
                      onClick={() => handleItemClick(collapseId)}
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, {
                          x: 5,
                          scale: 1.02,
                          duration: 0.3,
                          ease: "power2.out"
                        });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, {
                          x: 0,
                          scale: 1,
                          duration: 0.3,
                          ease: "power2.out"
                        });
                      }}
                    >
                      {expandedItems[collapseId] ? (
                        <FaCaretDown
                          className="ms-auto text-muted"
                          style={{
                            transition: 'transform 0.2s ease-in-out',
                            marginRight: "10px"
                          }}
                          size={16}
                        />
                      ) : (
                        <FaCaretRight
                          className="ms-auto text-muted"
                          style={{
                            transition: 'transform 0.2s ease-in-out',
                            marginRight: "10px"
                          }}
                          size={16}
                        />
                      )}
                      <item.icon className="flex-shrink-0 me-3" style={{ fontSize: "1.25rem" }} />


                      <span className="nav-link-text flex-grow-1">{item.title}</span>

                    </a>
                    <div
                      id={collapseId}
                      className={`collapse nav-collapse ${expandedItems[collapseId] ? 'show' : ''}`}
                      data-bs-parent="#navbarVerticalMenu"
                    >
                      <div className="nav-collapse-items justify-content-end pt-1 pb-2 ">
                        {item.subItems && item.subItems.map((subItem, subIndex) => (
                          <div key={subIndex}>
                            {subItem.label && (
                              <div className="nav-sub-label py-1 px-3" style={{ fontWeight: 'bold', color: '#4b5563' }}>
                                {subItem.label}
                              </div>
                            )}
                            {subItem.sub && subItem.sub.map((furtherSubItem, furtherSubIndex) => (
                              <Link
                                key={furtherSubIndex}
                                to={furtherSubItem.path}
                                className="nav-link nav-collapse-item py-2 px-3 ms-4"
                                onClick={() => isMobile && toggleSidebar()}
                                style={{
                                  color: "#4b5563",
                                  fontSize: "0.9rem",
                                  transition: "all 0.2s ease",
                                  zIndex: "200",
                                  display: "block",
                                  visibility: "visible",
                                  opacity: 1,
                                  backgroundColor: location.pathname === furtherSubItem.path ? "#F4F4F4" : "transparent",
                                  fontWeight: location.pathname === furtherSubItem.path ? "600" : "normal",
                                  transform: "scale(1)",
                                }}
                                onMouseEnter={(e) => {
                                  gsap.to(e.currentTarget, {
                                    scale: 1.05,
                                    x: 5,
                                    duration: 0.2,
                                    ease: "power2.out"
                                  });
                                }}
                                onMouseLeave={(e) => {
                                  gsap.to(e.currentTarget, {
                                    scale: 1,
                                    x: 0,
                                    duration: 0.3,
                                    ease: "elastic.out(1, 0.5)"
                                  });
                                }}
                              >
                                <span className="d-flex position-relative align-items-center gap-2">
                                  {furtherSubIndex === 0 ? (
                                    <LuCornerDownRight className="position-absolute" style={{ fontSize: "1rem", left: "-20px", color: "#4b5563", transform: "rotate(0deg)" }} />
                                  ) : null}
                                  {furtherSubItem.title}
                                </span>
                                {furtherSubItem.badge && (
                                  <span className="badge rounded-pill bg-danger ms-auto">
                                    {furtherSubItem.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: "auto", backgroundColor: "white", zIndex: "1000", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", alignItems: "center" }} className="navbar-vertical-footer p-1 border-top">
          <div className="justify-content-center align-items-center g-3"
            onClick={handleLogout}
            style={{
              display: "flex",
              gap: "5px",
              marginTop: "0.9rem",
              padding: "4px",
              backgroundColor: "#F4F4F4",
              height: "60px",
              width: "212px",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "#E5E7EB"
              }
            }}>
            <LuLogOut />
            <h3 className="m-0">LOGOUT</h3>
          </div>



        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

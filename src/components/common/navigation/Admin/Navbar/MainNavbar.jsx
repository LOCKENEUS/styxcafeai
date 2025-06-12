// components/Navbar.jsx
import { Navbar, Container, Button } from 'react-bootstrap';
import { BiBell, BiChevronRight, BiMoon, BiSearch, BiSun } from 'react-icons/bi';
import { PiMapPinBold } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GiHamburgerMenu } from 'react-icons/gi';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { useDispatch, useSelector } from 'react-redux';
import { getSearchData } from '../../../../../store/AdminSlice/DashboardSlice';

const MainNavbar = ({ setIsAuthenticated, collapsed, toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState("/assets/profile/user_avatar.jpg");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();//+
  const logoRef = useRef(null);

  const { searchResults } = useSelector((state) => state.adminDashboard);
  const user = JSON.parse(localStorage.getItem("user"));
  const backend_url = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (searchTerm?.length >= 3) {
      dispatch(getSearchData(searchTerm));
    }
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (user) {
      if (user.role === "superadmin") {
        setProfilePic(`assets/profile/user_avatar.jpg`);
      } else {
        setProfilePic(`${backend_url}/${user.cafeLogo}`);
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');

    setIsAuthenticated(false);//+
    toast.success('Logged out successfully');
    navigate('/login');//+
  };

  const handleHover = (e) => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleHoverEnd = () => {
    gsap.to(logoRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <header id="header" className="navbar navbar-expand-lg  navbar-fixed navbar-height navbar-container navbar-bordered bg-white">
      <div style={{ width: "100%" }} className=" d-flex justify-content-between align-items-center">

        <a className="navbar-brand " style={{ fontSize: "1.5rem", fontWeight: "bold" }} aria-label="Front">
          <button
            className="btn btn-ghost-secondary btn-icon rounded-circle me-2"
            onClick={toggleSidebar}
            style={{ width: "3rem", height: "3rem", borderRadius: "100%", cursor: "pointer", zIndex: 1000 }}
          >
            {collapsed ? (
              <GiHamburgerMenu />
            ) : (
              <HiChevronDoubleLeft />
            )}
          </button>
          <Link
            ref={logoRef}
            to="/admin/dashboard"
            style={{
              textDecoration: "none",

              display: "inline-block"
            }}
            className="nav-logo"
            onMouseMove={handleHover}
            onMouseLeave={handleHoverEnd}
          >
            {user.cafe_name}
          </Link>
        </a>
        {/* Responsive View */}
        <div className="d-md-none ">

        </div>
        {/* Desktop Navigation (above 970px) */}
        <div className="d-none d-lg-block">

          <div className="navbar-nav-wrap-content-start">
            <div className="dropdown ms-2">
              <div className="position-relative" style={{ width: '300px' /* adjust width as needed */ }}>
                <div className="input-group input-group-merge input-group-borderless input-group-hover-light navbar-input-group">
                  <div className="input-group-prepend input-group-text">
                    <BiSearch />
                  </div>

                  <input
                    type="search"
                    className="js-form-search form-control"
                    placeholder="Search..."
                    aria-label="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                </div>

                {/* Dropdown appears just below the input box */}
                {showDropdown && searchResults?.games?.length > 0 && (
                  <ul
                    className="dropdown-menu show shadow-sm overflow-auto"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: '250px',
                      width: '330px', // Adjust width as needed
                      scrollbarWidth: 'none',      // Firefox
                      msOverflowStyle: 'none',
                    }}
                  >
                    {searchResults.games.map((item, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onChange={() => {
                          setSearchTerm(item.name);
                          setShowDropdown(false);
                        }}
                      >
                        <Link to={`/admin/games/${item._id}`} className="text-decoration-none text-dark">
                          <strong>{item.name}</strong>{' '}
                          <small className="text-muted">({item.type})</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {showDropdown && searchResults?.bookings?.length > 0 && (
                  <ul
                    className="dropdown-menu show shadow-sm overflow-auto"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: '250px',
                      width: '330px', // Adjust width as needed
                      scrollbarWidth: 'none',      // Firefox
                      msOverflowStyle: 'none',     // IE 10+
                    }}
                  >
                    {searchResults.bookings.map((item, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={() => {
                          setSearchTerm(item.name);
                          setShowDropdown(false);
                        }}
                      >
                        <Link to={`/admin/booking/checkout/${item._id}`} className="text-decoration-none text-dark">
                          <strong>{item.booking_id}</strong>{' '}
                          <small className="text-muted">({item.booking_type})</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {showDropdown && searchResults?.customers?.length > 0 && (
                  <ul
                    className="dropdown-menu show shadow-sm overflow-auto"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: '250px',
                      width: '330px', // Adjust width as needed
                      scrollbarWidth: 'none',      // Firefox
                      msOverflowStyle: 'none',
                    }}
                  >
                    {searchResults.customers.map((item, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={() => {
                          setSearchTerm(item.name);
                          setShowDropdown(false);
                        }}
                      >
                        <Link to={`/admin/users/customer-details/${item._id}`} className="text-decoration-none text-dark">
                          <strong>{item.name}</strong>{' '}
                          <small className="text-muted">({item.email || "No email"})</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {showDropdown && searchResults?.items?.length > 0 && (
                  <ul
                    className="dropdown-menu show shadow-sm overflow-auto"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: '250px',
                      width: '400px', // Adjust width as needed
                      width: '330px', // Adjust width as needed
                      scrollbarWidth: 'none',      // Firefox
                      msOverflowStyle: 'none',
                    }}
                  >
                    {searchResults?.items.map((item, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={() => {
                          setSearchTerm(item.name);
                          setShowDropdown(false);
                        }}
                      >
                        <Link to={`/admin/inventory/item-details/${item._id}`} className="text-decoration-none text-dark">
                          <strong> {item.name}</strong>{' '}
                          <small className="text-muted">( &#8377; {item.sellingPrice})</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {showDropdown && searchResults?.itemGroups?.length > 0 && (
                  <ul
                    className="dropdown-menu show shadow-sm overflow-auto"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: '250px',
                      width: '400px', // Adjust width as needed
                      width: '330px', // Adjust width as needed
                      scrollbarWidth: 'none',      // Firefox
                      msOverflowStyle: 'none',
                    }}
                  >
                    {searchResults?.itemGroups.map((item, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={() => {
                          setSearchTerm(item.group_name);
                          setShowDropdown(false);
                        }}
                      >
                        <Link to={`/admin/inventory/item-group-details/${item._id}`} className="text-decoration-none text-dark">
                          <strong> {item.group_name}</strong>{' '}
                          <small className="text-muted">({item.items?.length} items)</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Tablet Navigation (768px to 970px) */}
        <div className="d-none d-md-block d-lg-none">
          <div className="navbar-nav-wrap-content-start">
            <div className="dropdown ms-2">
              <div className="">
                {/* Adjusted input group size for tablet */}
                <div className="input-group input-group-merge input-group-borderless input-group-hover-light">
                  <div className="input-group-prepend input-group-text">
                    <BiSearch />
                  </div>

                  <input
                    type="search"
                    className="js-form-search form-control"
                    placeholder="Search"
                    aria-label="Search"
                    style={{ maxWidth: '200px' }}
                    data-hs-form-search-options="{
                    &quot;clearIcon&quot;: &quot;#clearSearchResultsIcon&quot;,
                    &quot;dropMenuElement&quot;: &quot;#searchDropdownMenuTablet&quot;,
                    &quot;dropMenuOffset&quot;: 20,
                    &quot;toggleIconOnFocus&quot;: true,
                    &quot;activeClass&quot;: &quot;focus&quot;
                  }"
                  />
                </div>
              </div>

              {/* Tablet-specific dropdown */}
              <div
                id="searchDropdownMenuTablet"
                className="hs-form-search-menu-content dropdown-menu dropdown-menu-form-search navbar-dropdown-menu-borderless animated hs-form-search-menu-hidden hs-form-search-menu-initialized"
                style={{ maxWidth: '300px' }}
              >
                <div className="card">
                  <div className="card-body-height py-3">
                    <span className="dropdown-header">Recent searches</span>
                    {/* Add your recent search items here */}
                    <div className="dropdown-divider"></div>
                  </div>
                  <a className="card-footer text-center" href="#">
                    See all results <BiChevronRight />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation (below 768px) */}
        <div className="d-block d-md-none">
          <ul className="navbar-nav " style={{ gap: "2rem", padding: "1px", flexDirection: "row" }}>
            <li className="nav-item">
              <div className="dropdown">
                <button type="button" className="btn btn-ghost-secondary btn-icon rounded-circle" id="navbarNotificationsDropdownMobile" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                  <BiBell style={{ fontSize: "1.5rem" }} />
                  <span className="btn-status btn-sm-status btn-status-danger"></span>
                </button>

                <div className="dropdown-menu dropdown-menu-end dropdown-card navbar-dropdown-menu navbar-dropdown-menu-borderless"
                  aria-labelledby="navbarNotificationsDropdownMobile"
                  style={{ width: "300px", maxWidth: "90vw" }}>
                  <div className="card">
                    <div className="card-header card-header-content-between">
                      <h4 className="card-title mb-0">Notifications</h4>
                    </div>

                    <ul className="list-group list-group-flush navbar-card-list-group"
                      style={{ maxHeight: '300px', overflowY: 'auto', scrollbarWidth: 'thin', msOverflowStyle: 'none' }}>
                      <li className="list-group-item">
                        <span className="text-success">✔️ Booking for Snooker & Pool from Harsh</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-info">🔔 System Update 145</span>
                      </li>
                    </ul>

                    <a className="card-footer text-center" href="#">
                      View all notifications <BiChevronRight />
                    </a>
                  </div>
                </div>
              </div>
            </li>

            <li className="nav-item">
              <div className="dropdown">
                <a className="navbar-dropdown-account-wrapper justify-content-center align-items-center gap-4" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                  <div className="avatar avatar-sm avatar-circle">
                    <img className="avatar-img" src={profilePic} alt="Image Description" onError={(e) => {
                      e.target.onerror = null; // prevents infinite loop if fallback also fails
                      e.target.src = "/assets/profile/user_avatar.jpg"; // replace with your fallback path
                    }} />
                    <span className="avatar-status avatar-sm-status avatar-status-success"></span>
                  </div>
                </a>

                <div className="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless navbar-dropdown-account" aria-labelledby="accountNavbarDropdown" style={{ width: "16rem" }}>
                  <div className="dropdown-item-text">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm avatar-circle">
                        <img className="avatar-img" src={profilePic} alt="Image Description" onError={(e) => {
                          e.target.onerror = null; // prevents infinite loop if fallback also fails
                          e.target.src = "/assets/profile/user_avatar.jpg"; // replace with your fallback path
                        }} />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="mb-0">{user?.name}</h5>
                        <p className="card-text text-body">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="/admin/profile">Profile &amp; account</Link>
                  <a className="dropdown-item" href="#">Settings</a>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown">
                    <a className="navbar-dropdown-submenu-item dropdown-item dropdown-toggle" href="javascript:;" id="navSubmenuPagesAccountDropdown2" data-bs-toggle="dropdown" aria-expanded="false">Customization</a>

                    <div className="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless navbar-dropdown-sub-menu" aria-labelledby="navSubmenuPagesAccountDropdown2">
                      <a className="dropdown-item" href="#">Invite people</a>
                      <a className="dropdown-item" href="#">Analytics</a>
                      <a className="dropdown-item" href="#">Customize Front</a>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <a onClick={handleLogout} className="dropdown-item">Sign out</a>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="navbar-nav-wrap-content-end m-0">
          <ul className="navbar-nav" style={{ gap: "2rem" }}>
            <li className="nav-item d-none d-md-block">
              <div className="dropdown">
                <div className="dropdown-menu dropdown-menu-end dropdown-card navbar-dropdown-menu navbar-dropdown-menu-borderless" aria-labelledby="navbarNotificationsDropdown" style={{ width: "25rem" }}>
                  <div className="card">
                    <div className="card-header card-header-content-between">
                      <h4 className="card-title mb-0">Notifications</h4>
                      <div className="dropdown">
                        <button type="button" className="btn btn-icon btn-sm btn-ghost-secondary rounded-circle" id="navbarNotificationsDropdownSettings" data-bs-toggle="dropdown" aria-expanded="false">
                        </button>
                      </div>
                    </div>

                    <ul className="list-group list-group-flush navbar-card-list-group" style={{ maxHeight: '200px', overflowY: 'auto', scrollbarWidth: 'thin', msOverflowStyle: 'none' }}>
                      <li className="list-group-item">
                        <span className="text-success">✔️ Booking for Snooker & Pool from Harsh</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-info">🔔 System Update 145</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-success">✔️ Booking for Snooker & Pool from Harsh</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-warning">⚠️ Feedback received from Rohit</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-info">🔔 System Update 145</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-danger">❌ Booking Cancel Request from Id #547895</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-success">✔️ Booking for Snooker & Pool from Harsh</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-success">✔️ Booking for Snooker & Pool from Harsh</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-success">✔️ Booking for Snooker & Pool from Harsh</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-success">✔️ Booking for Snooker & Pool from Harsh</span>
                      </li>
                      <li className="list-group-item">
                        <span className="text-warning">⚠️ Feedback received from Rohit</span>
                      </li>
                    </ul>
                    <style>
                      {`
                      .navbar-card-list-group::-webkit-scrollbar {
                        width: 8px;
                      }
                      .navbar-card-list-group::-webkit-scrollbar-thumb {
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 10px;
                      }
                      .navbar-card-list-group::-webkit-scrollbar-track {
                        background: transparent;
                      }
                    `}
                    </style>

                    <a className="card-footer text-center" href="#">
                      View all notifications <i className="bi-chevron-right"></i>
                    </a>

                  </div>
                </div>
              </div>

            </li>
            <li className="nav-item d-none d-none d-md-block">
              <div className="dropdown">
                <button type="button" className="btn " id="navbarAppsDropdown">
                  <sapn className='d-flex align-items-center justify-content-center'> <PiMapPinBold style={{ fontSize: "1.3rem" }} /> {user?.location?.city}</sapn>
                </button>
              </div>

            </li>

            <li className="nav-item d-none d-none d-md-block">
              <div className="dropdown" style={{ cursor: "pointer" }}>
                <a className="navbar-dropdown-account-wrapper justify-content-center align-items-center gap-4 px-4" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                  <p style={{ color: "#677788", fontWeight: "bold" }} className='m-0'>{user?.name}</p>
                  <div className="avatar avatar-sm avatar-circle">
                    {/* <img className="avatar-img" src={profilePic} alt="Image Description" /> */}
                    <img className="avatar-img" src={profilePic} alt="Image Description" onError={(e) => {
                      e.target.onerror = null; // prevents infinite loop if fallback also fails
                      e.target.src = "/assets/profile/user_avatar.jpg"; // replace with your fallback path
                    }} />
                    <span className="avatar-status avatar-sm-status avatar-status-success"></span>
                  </div>
                </a>

                <div className="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless navbar-dropdown-account" aria-labelledby="accountNavbarDropdown" style={{ width: "16rem" }}>
                  <div className="dropdown-item-text">
                    <div className="d-flex align-items-center">

                      <div className="flex-grow-1 ms-3">
                        <h5 className="mb-0">{user?.name}</h5>
                        <p className="card-text text-body">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="/admin/profile">Profile &amp; account</Link>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-divider"></div>
                  <a onClick={handleLogout} style={{ cursor: "pointer" }} className="dropdown-item">Sign out</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;

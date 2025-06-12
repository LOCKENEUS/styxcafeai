// components/Navbar.jsx
import { useState } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { BiChevronRight, BiLeftArrow, BiRightArrow, BiSearch } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";

const MainNavbar = ({ setIsAuthenticated, toggleSidebar, collapsed }) => {
  const [profilePic, setProfilePic] = useState("/assets/profile/user_avatar.jpg");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    toast.success('Logout successful');

    // Clear authentication
    setIsAuthenticated(false);

    // Remove any stored tokens
    localStorage.removeItem('authToken');

    // Redirect to login
    navigate('/login');
  };
  return (
    <header id="header" className="navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered bg-white">
      <div className="navbar-nav-wrap">
        <a className="navbar-brand" aria-label="Front">
          <h1 style={{ fontSize: "30px" }} className='nav-Logo-sp'>StyxCafe</h1>
        </a>
        <button
          className="btn  rounded-circle "
          onClick={toggleSidebar}
          style={{ width: "3rem", height: "3rem", borderRadius: "100%", cursor: "pointer", zIndex: 1000 }}
        >
          {!collapsed ? (
            <GiHamburgerMenu color='black' size={25} />
          ) : (
            <TbLayoutSidebarLeftCollapse color='black' size={25} />
          )}
        </button>

        <div className="navbar-nav-wrap-content-start">
          <button type="button" className="js-navbar-vertical-aside-toggle-invoker navbar-aside-toggler">
            <i className="bi-arrow-bar-left navbar-toggler-short-align" data-bs-template="&lt;div class=&quot;tooltip d-none d-md-block&quot; role=&quot;tooltip&quot;&gt;&lt;div class=&quot;arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Collapse" data-bs-original-title="Collapse"><BiLeftArrow /></i>
            <i className="bi-arrow-bar-right navbar-toggler-full-align" data-bs-template="&lt;div class=&quot;tooltip d-none d-md-block&quot; role=&quot;tooltip&quot;&gt;&lt;div class=&quot;arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Expand" data-bs-original-title="Expand"><BiRightArrow /></i>
          </button>

          <div className="dropdown ms-2">
            <div className="d-none d-lg-block">
              <div className="input-group input-group-merge input-group-borderless input-group-hover-light navbar-input-group">
                <div className="input-group-prepend input-group-text">
                  <BiSearch />
                </div>

                <input type="search" className="js-form-search form-control" placeholder="Search..." aria-label="Search" data-hs-form-search-options="{
                      &quot;clearIcon&quot;: &quot;#clearSearchResultsIcon&quot;,
                      &quot;dropMenuElement&quot;: &quot;#searchDropdownMenu&quot;,
                      &quot;dropMenuOffset&quot;: 20,
                      &quot;toggleIconOnFocus&quot;: true,
                      &quot;activeClass&quot;: &quot;focus&quot;
                    }"/>
                <a className="input-group-append input-group-text" href="#">
                  <i id="clearSearchResultsIcon" className="bi-x-lg" style={{ display: "none" }}></i>
                </a>
              </div>
            </div>

            <button className="js-form-search js-form-search-mobile-toggle btn btn-ghost-secondary btn-icon rounded-circle d-lg-none" type="button" data-hs-form-search-options="{
                      &quot;clearIcon&quot;: &quot;#clearSearchResultsIcon&quot;,
                      &quot;dropMenuElement&quot;: &quot;#searchDropdownMenu&quot;,
                      &quot;dropMenuOffset&quot;: 20,
                      &quot;toggleIconOnFocus&quot;: true,
                      &quot;activeClass&quot;: &quot;focus&quot;
                    }">
              <BiSearch />
            </button>

            <div id="searchDropdownMenu" className="hs-form-search-menu-content dropdown-menu dropdown-menu-form-search navbar-dropdown-menu-borderless animated hs-form-search-menu-hidden hs-form-search-menu-initialized">
              <div className="card">

                <div className="card-body-height">
                  <div className="d-lg-none">
                    <div className="input-group input-group-merge navbar-input-group mb-5">
                      <div className="input-group-prepend input-group-text">
                        <BiSearch />
                      </div>

                      <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
                      <a className="input-group-append input-group-text" href="#">
                        <i className="bi-x-lg"></i>
                      </a>
                    </div>
                  </div>

                  <span className="dropdown-header">Recent searches</span>
                  <div className="dropdown-divider"></div>
                </div>
                <a className="card-footer text-center" >
                  See all results   <BiChevronRight />   <i className="bi-chevron-right small"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="navbar-nav-wrap-content-end">

          <ul className="navbar-nav">
            <li className="nav-item d-none d-sm-inline-block">
            </li>

            <li className="nav-item d-none d-sm-inline-block">
            </li>

            <li className="nav-item d-none d-sm-inline-block">
            </li>

            <li className="nav-item">

              <div className="dropdown">
                <a className="navbar-dropdown-account-wrapper" href="#" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                  <div className="avatar avatar-sm avatar-circle">
                    <img className="avatar-img" src={profilePic} alt="Image Description" />
                    <span className="avatar-status avatar-sm-status avatar-status-success"></span>
                  </div>
                </a>

                <div className="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless navbar-dropdown-account" aria-labelledby="accountNavbarDropdown" style={{ width: "16rem", paddingLeft: "0px", paddingRight: "0px" }}>
                  <div className="dropdown-item-text">
                    <div className="d-flex align-items-center gap-1">
                      <div className="avatar avatar-sm avatar-circle">
                        <img className="avatar-img" src={profilePic} alt="Image Description" />
                      </div>
                      <div className="flex-grow-1 ">
                        <h5 className="mb-1">{user?.name}</h5>
                        {/* <p className="card-text text-body ">{user?.email}</p> */}
                        <p className="card-text text-body text-truncate" style={{ maxWidth: '180px' }}>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">Profile &amp; account</a>
                  <div className="dropdown-divider"></div>
                  <a onClick={handleLogout} className="dropdown-item">Sign out</a>
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

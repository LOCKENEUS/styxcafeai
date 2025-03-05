const Signup = () => {
  return (
    <>
      <header id="header" className="navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered bg-white">
        <div className="navbar-nav-wrap">
          <a className="navbar-brand" href="https://htmlstream.com/preview/front-dashboard-v2.1.1/index.html" aria-label="Front">
            <img className="navbar-brand-logo" src="https://htmlstream.com/preview/front-dashboard-v2.1.1../assets/svg/logos/logo.svg" alt="Logo" data-hs-theme-appearance="default" />
          </a>
          <div className="navbar-nav-wrap-content-start">
            <button type="button" className="js-navbar-vertical-aside-toggle-invoker navbar-aside-toggler">
              <i className="bi-arrow-bar-left navbar-toggler-short-align" data-bs-template="&lt;div class=&quot;tooltip d-none d-md-block&quot; role=&quot;tooltip&quot;&gt;&lt;div class=&quot;arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Collapse" data-bs-original-title="Collapse"></i>
              <i className="bi-arrow-bar-right navbar-toggler-full-align" data-bs-template="&lt;div class=&quot;tooltip d-none d-md-block&quot; role=&quot;tooltip&quot;&gt;&lt;div class=&quot;arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Expand" data-bs-original-title="Expand"></i>
            </button>

            <div className="dropdown ms-2">
              <div className="d-none d-lg-block">
                <div className="input-group input-group-merge input-group-borderless input-group-hover-light navbar-input-group">
                  <div className="input-group-prepend input-group-text">
                    <i className="bi-search"></i>
                  </div>

                  <input type="search" className="js-form-search form-control" placeholder="Search in front" aria-label="Search in front" data-hs-form-search-options="{
                        &quot;clearIcon&quot;: &quot;#clearSearchResultsIcon&quot;,
                        &quot;dropMenuElement&quot;: &quot;#searchDropdownMenu&quot;,
                        &quot;dropMenuOffset&quot;: 20,
                        &quot;toggleIconOnFocus&quot;: true,
                        &quot;activeClass&quot;: &quot;focus&quot;
                      }"/>
                  <a className="input-group-append input-group-text" href="javascript:;">
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
                <i className="bi-search"></i>
              </button>

              <div id="searchDropdownMenu" className="hs-form-search-menu-content dropdown-menu dropdown-menu-form-search navbar-dropdown-menu-borderless animated hs-form-search-menu-hidden hs-form-search-menu-initialized">
                <div className="card">

                  <div className="card-body-height">
                    <div className="d-lg-none">
                      <div className="input-group input-group-merge navbar-input-group mb-5">
                        <div className="input-group-prepend input-group-text">
                          <i className="bi-search"></i>
                        </div>

                        <input type="search" className="form-control" placeholder="Search in front" aria-label="Search in front" />
                        <a className="input-group-append input-group-text" href="javascript:;">
                          <i className="bi-x-lg"></i>
                        </a>
                      </div>
                    </div>

                    <span className="dropdown-header">Recent searches</span>



                    <div className="dropdown-divider"></div>


                  </div>

                  <a className="card-footer text-center" href="https://htmlstream.com/preview/front-dashboard-v2.1.1/index.html">
                    See all results <i className="bi-chevron-right small"></i>
                  </a>

                </div>
              </div>


            </div>


          </div>

          <div className="navbar-nav-wrap-content-end">

            <ul className="navbar-nav">
              <li className="nav-item d-none d-sm-inline-block">

                <div className="dropdown">
                  <button type="button" className="btn btn-ghost-secondary btn-icon rounded-circle" id="navbarNotificationsDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                    <i className="bi-bell"></i>
                    <span className="btn-status btn-sm-status btn-status-danger"></span>
                  </button>

                  <div className="dropdown-menu dropdown-menu-end dropdown-card navbar-dropdown-menu navbar-dropdown-menu-borderless" aria-labelledby="navbarNotificationsDropdown" style={{ width: "25rem" }}>
                    <div className="card">

                      <div className="card-header card-header-content-between">
                        <h4 className="card-title mb-0">Notifications</h4>


                        <div className="dropdown">
                          <button type="button" className="btn btn-icon btn-sm btn-ghost-secondary rounded-circle" id="navbarNotificationsDropdownSettings" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi-three-dots-vertical"></i>
                          </button>

                          <div className="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless" aria-labelledby="navbarNotificationsDropdownSettings">
                            <span className="dropdown-header">Settings</span>
                            <a className="dropdown-item" href="#">
                              <i className="bi-archive dropdown-item-icon"></i> Archive all
                            </a>
                            <a className="dropdown-item" href="#">
                              <i className="bi-check2-all dropdown-item-icon"></i> Mark all as read
                            </a>
                            <a className="dropdown-item" href="#">
                              <i className="bi-toggle-off dropdown-item-icon"></i> Disable notifications
                            </a>
                            <a className="dropdown-item" href="#">
                              <i className="bi-gift dropdown-item-icon"></i> What's new?
                            </a>
                            <div className="dropdown-divider"></div>
                            <span className="dropdown-header">Feedback</span>
                            <a className="dropdown-item" href="#">
                              <i className="bi-chat-left-dots dropdown-item-icon"></i> Report
                            </a>
                          </div>
                        </div>

                      </div>

                      <ul className="nav nav-tabs nav-justified" id="notificationTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <a className="nav-link active" href="#notificationNavOne" id="notificationNavOne-tab" data-bs-toggle="tab" data-bs-target="#notificationNavOne" role="tab" aria-controls="notificationNavOne" aria-selected="true">Messages (3)</a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a className="nav-link" href="#notificationNavTwo" id="notificationNavTwo-tab" data-bs-toggle="tab" data-bs-target="#notificationNavTwo" role="tab" aria-controls="notificationNavTwo" aria-selected="false" tabindex="-1">Archived</a>
                        </li>
                      </ul>

                      <div className="card-body-height">

                        <div className="tab-content" id="notificationTabContent">
                          <div className="tab-pane fade show active" id="notificationNavOne" role="tabpanel" aria-labelledby="notificationNavOne-tab">

                            <ul className="list-group list-group-flush navbar-card-list-group">

                            </ul>

                          </div>

                          <div className="tab-pane fade" id="notificationNavTwo" role="tabpanel" aria-labelledby="notificationNavTwo-tab">
                            <ul className="list-group list-group-flush navbar-card-list-group">

                            </ul>

                          </div>
                        </div>

                      </div>

                      <a className="card-footer text-center" href="#">
                        View all notifications <i className="bi-chevron-right"></i>
                      </a>

                    </div>
                  </div>
                </div>

              </li>

              <li className="nav-item d-none d-sm-inline-block">

                <div className="dropdown">
                  <button type="button" className="btn btn-icon btn-ghost-secondary rounded-circle" id="navbarAppsDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-dropdown-animation="">
                    <i className="bi-app-indicator"></i>
                  </button>

                  <div className="dropdown-menu dropdown-menu-end dropdown-card navbar-dropdown-menu navbar-dropdown-menu-borderless" aria-labelledby="navbarAppsDropdown" style={{ width: "25rem" }}>
                    <div className="card">

                      <div className="card-header">
                        <h4 className="card-title">Web apps &amp; services</h4>
                      </div>

                      <a className="card-footer text-center" href="#">
                        View all apps <i className="bi-chevron-right"></i>
                      </a>

                    </div>
                  </div>
                </div>

              </li>

              <li className="nav-item d-none d-sm-inline-block">

                <button className="btn btn-ghost-secondary btn-icon rounded-circle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasActivityStream" aria-controls="offcanvasActivityStream">
                  <i className="bi-x-diamond"></i>
                </button>

              </li>

              <li className="nav-item">

                <div className="dropdown">
                  <a className="navbar-dropdown-account-wrapper" href="javascript:;" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                    <div className="avatar avatar-sm avatar-circle">
                      <img className="avatar-img" src="https://htmlstream.com/preview/front-dashboard-v2.1.1../assets/img/160x160/img6.jpg" alt="Image Description" />
                      <span className="avatar-status avatar-sm-status avatar-status-success"></span>
                    </div>
                  </a>

                  <div className="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless navbar-dropdown-account" aria-labelledby="accountNavbarDropdown" style={{ width: "16rem" }}>
                    <div className="dropdown-item-text">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm avatar-circle">
                          <img className="avatar-img" src="https://htmlstream.com/preview/front-dashboard-v2.1.1../assets/img/160x160/img6.jpg" alt="Image Description" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h5 className="mb-0">Mark Williams</h5>
                          <p className="card-text text-body">mark@site.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>



                    <a className="dropdown-item" href="#">Profile &amp; account</a>
                    <a className="dropdown-item" href="#">Settings</a>

                    <div className="dropdown-divider"></div>



                    <div className="dropdown-divider"></div>


                    <div className="dropdown">
                      <a className="navbar-dropdown-submenu-item dropdown-item dropdown-toggle" href="javascript:;" id="navSubmenuPagesAccountDropdown2" data-bs-toggle="dropdown" aria-expanded="false">Customization</a>

                      <div className="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless navbar-dropdown-sub-menu" aria-labelledby="navSubmenuPagesAccountDropdown2">
                        <a className="dropdown-item" href="#">
                          Invite people
                        </a>
                        <a className="dropdown-item" href="#">
                          Analytics
                          <i className="bi-box-arrow-in-up-right"></i>
                        </a>
                        <a className="dropdown-item" href="#">
                          Customize Front
                          <i className="bi-box-arrow-in-up-right"></i>
                        </a>
                      </div>
                    </div>


                    <div className="dropdown-divider"></div>

                    <a className="dropdown-item" href="#">Sign out</a>
                  </div>
                </div>

              </li>
            </ul>

          </div>
        </div>
      </header>

      <aside className="js-navbar-vertical-aside navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered bg-white navbar-vertical-aside-initialized">
        <div className="navbar-vertical-container">
          <div className="navbar-vertical-footer-offset">


            <a className="navbar-brand" href="https://htmlstream.com/preview/front-dashboard-v2.1.1/index.html" aria-label="Front">
              <img className="navbar-brand-logo" src="https://htmlstream.com/preview/front-dashboard-v2.1.1../assets/svg/logos/logo.svg" alt="Logo" data-hs-theme-appearance="default" />
            </a>

            <button type="button" className="js-navbar-vertical-aside-toggle-invoker navbar-aside-toggler" style={{ opacity: "1" }}>
              <i className="bi-arrow-bar-left navbar-toggler-short-align" data-bs-template="&lt;div class=&quot;tooltip d-none d-md-block&quot; role=&quot;tooltip&quot;&gt;&lt;div class=&quot;arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Collapse" data-bs-original-title="Collapse"></i>
              <i className="bi-arrow-bar-right navbar-toggler-full-align" data-bs-template="&lt;div class=&quot;tooltip d-none d-md-block&quot; role=&quot;tooltip&quot;&gt;&lt;div class=&quot;arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Expand" data-bs-original-title="Expand"></i>
            </button>


            <div className="navbar-vertical-content">
              <div id="navbarVerticalMenu" className="nav nav-pills nav-vertical card-navbar-nav">

                <div className="nav-item">
                  <a className="nav-link dropdown-toggle collapsed" href="#navbarVerticalMenuDashboards" role="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalMenuDashboards" aria-expanded="false" aria-controls="navbarVerticalMenuDashboards">
                    <i className="bi-house-door nav-icon"></i>
                    <span className="nav-link-title">Dashboards</span>
                  </a>

                  <div id="navbarVerticalMenuDashboards" className="nav-collapse collapse " data-bs-parent="#navbarVerticalMenu" hs-parent-area="#navbarVerticalMenu">
                    <a className="nav-link " href="https://htmlstream.com/preview/front-dashboard-v2.1.1/index.html">Default</a>
                    <a className="nav-link " href="https://htmlstream.com/preview/front-dashboard-v2.1.1/dashboard-alternative.html">Alternative</a>
                  </div>
                </div>


                <span className="dropdown-header mt-4">Pages</span>
                <small className="bi-three-dots nav-subtitle-replacer"></small>


                <div className="navbar-nav nav-compact">

                </div>
                <div id="navbarVerticalMenuPagesMenu">

                  <div className="nav-item">
                    <a className="nav-link dropdown-toggle collapsed" href="#navbarVerticalMenuPagesUsersMenu" role="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalMenuPagesUsersMenu" aria-expanded="false" aria-controls="navbarVerticalMenuPagesUsersMenu">
                      <i className="bi-people nav-icon"></i>
                      <span className="nav-link-title">Users</span>
                    </a>

                    <div id="navbarVerticalMenuPagesUsersMenu" className="nav-collapse collapse " data-bs-parent="#navbarVerticalMenuPagesMenu" hs-parent-area="#navbarVerticalMenu">
                      <a className="nav-link " href="https://htmlstream.com/preview/front-dashboard-v2.1.1/users.html">Overview</a>
                      <a className="nav-link " href="https://htmlstream.com/preview/front-dashboard-v2.1.1/users-leaderboard.html">Leaderboard</a>
                      <a className="nav-link " href="https://htmlstream.com/preview/front-dashboard-v2.1.1/users-add-user.html">Add User <span className="badge bg-info rounded-pill ms-1">Hot</span></a>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="navbar-vertical-footer">
              <ul className="navbar-vertical-footer-list">
                <li className="navbar-vertical-footer-list-item">

                  <div className="dropdown dropup">
                    <button type="button" className="btn btn-ghost-secondary btn-icon rounded-circle" id="selectThemeDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-dropdown-animation=""><i className="bi-brightness-high"></i></button>

                    <div className="dropdown-menu navbar-dropdown-menu navbar-dropdown-menu-borderless" aria-labelledby="selectThemeDropdown">
                      <a className="dropdown-item" href="#" data-icon="bi-moon-stars" data-value="auto">
                        <i className="bi-moon-stars me-2"></i>
                        <span className="text-truncate" title="Auto (system default)">Auto (system default)</span>
                      </a>
                      <a className="dropdown-item active" href="#" data-icon="bi-brightness-high" data-value="default">
                        <i className="bi-brightness-high me-2"></i>
                        <span className="text-truncate" title="Default (light mode)">Default (light mode)</span>
                      </a>
                      <a className="dropdown-item" href="#" data-icon="bi-moon" data-value="dark">
                        <i className="bi-moon me-2"></i>
                        <span className="text-truncate" title="Dark">Dark</span>
                      </a>
                    </div>
                  </div>


                </li>

                <li className="navbar-vertical-footer-list-item">

                  <div className="dropdown dropup">
                    <button type="button" className="btn btn-ghost-secondary btn-icon rounded-circle" id="otherLinksDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-dropdown-animation="">
                      <i className="bi-info-circle"></i>
                    </button>

                    <div className="dropdown-menu navbar-dropdown-menu-borderless" aria-labelledby="otherLinksDropdown">
                      <span className="dropdown-header">Help</span>
                      <a className="dropdown-item" href="#">
                        <i className="bi-journals dropdown-item-icon"></i>
                        <span className="text-truncate" title="Resources &amp; tutorials">Resources &amp; tutorials</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="bi-command dropdown-item-icon"></i>
                        <span className="text-truncate" title="Keyboard shortcuts">Keyboard shortcuts</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="bi-alt dropdown-item-icon"></i>
                        <span className="text-truncate" title="Connect other apps">Connect other apps</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="bi-gift dropdown-item-icon"></i>
                        <span className="text-truncate" title="What&#39;s new?">What's new?</span>
                      </a>
                      <div className="dropdown-divider"></div>
                      <span className="dropdown-header">Contacts</span>
                      <a className="dropdown-item" href="#">
                        <i className="bi-chat-left-dots dropdown-item-icon"></i>
                        <span className="text-truncate" title="Contact support">Contact support</span>
                      </a>
                    </div>
                  </div>

                </li>

                <li className="navbar-vertical-footer-list-item">

                  <div className="dropdown dropup">
                    <button type="button" className="btn btn-ghost-secondary btn-icon rounded-circle" id="selectLanguageDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-dropdown-animation="">
                      <img className="avatar avatar-xss avatar-circle" src="./Front_files/us.svg" alt="United States Flag" />
                    </button>

                    <div className="dropdown-menu navbar-dropdown-menu-borderless" aria-labelledby="selectLanguageDropdown">
                      <span className="dropdown-header">Select language</span>
                      <a className="dropdown-item" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="./Front_files/us.svg" alt="Flag" />
                        <span className="text-truncate" title="English">English (US)</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="./Front_files/gb.svg" alt="Flag" />
                        <span className="text-truncate" title="English">English (UK)</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="./Front_files/de.svg" alt="Flag" />
                        <span className="text-truncate" title="Deutsch">Deutsch</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="./Front_files/dk.svg" alt="Flag" />
                        <span className="text-truncate" title="Dansk">Dansk</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="./Front_files/it.svg" alt="Flag" />
                        <span className="text-truncate" title="Italiano">Italiano</span>
                      </a>
                      <a className="dropdown-item" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="./Front_files/cn.svg" alt="Flag" />
                        <span className="text-truncate" title="中文 (繁體)">中文 (繁體)</span>
                      </a>
                    </div>
                  </div>


                </li>
              </ul>
            </div>

          </div>
        </div>
      </aside>

      <main id="content" role="main" className="main">

        <div className="content container-fluid">
          <div className="row justify-content-sm-center text-center py-10">
            <div className="col-sm-7 col-md-5">
              <h1>Hello, nice to see you!</h1>

            </div>
          </div>

        </div>

        <div className="footer">
          <div className="row justify-content-between align-items-center">
            <div className="col">
              <p className="fs-6 mb-0">© Front. <span className="d-none d-sm-inline-block">2022 Htmlstream.</span></p>
            </div>


            <div className="col-auto">
              <div className="d-flex justify-content-end">

                <ul className="list-inline list-separator">
                  <li className="list-inline-item">
                    <a className="list-separator-link" href="#">FAQ</a>
                  </li>

                  <li className="list-inline-item">
                    <a className="list-separator-link" href="#">License</a>
                  </li>

                  <li className="list-inline-item">

                    <button className="btn btn-ghost-secondary btn btn-icon btn-ghost-secondary rounded-circle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasKeyboardShortcuts" aria-controls="offcanvasKeyboardShortcuts">
                      <i className="bi-command"></i>
                    </button>

                  </li>
                </ul>

              </div>
            </div>

          </div>

        </div>

      </main>
    </>
  );
};

export default Signup;
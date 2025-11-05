import { Link, useLocation } from "react-router-dom";
import "./UserHeader.css";

const UserHeader = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="main-header">
        <div className="logo">
          <img src="/assets/profile/styxcafe.png" alt="Styx Logo" />
        </div>

        <nav className="nav-links">
          <Link className={isActive("/") ? "active" : ""} to="/">Home</Link>
          <Link className={isActive("/book")} to="/book">Book a Table</Link>
          <Link className={isActive("/book")} to="/user/bookings">My Bookings</Link>
          <Link className={isActive("/about")} to="/about">About Us</Link>
        </nav>

        <div className="contact-button">
          <a href="tel:8686546474">
            <button>
              📞 Contact Us
            </button>
          </a>
        </div>
      </header>
    </>
  );
};

export default UserHeader;

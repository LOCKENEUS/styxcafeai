import "./UserFooter.css";

const UserFooter = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Styx. All rights reserved.</p>
        <p>Follow us on 
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a> | 
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>
        </p>
      </div>
    </footer>
  );
};

export default UserFooter;

// components/AuthWatcher.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthWatcher = ({ setIsAuthenticated, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
      // if (userRole === 'admin') {
      //   navigate('/admin/login');
      // } else{
      //   navigate('/superadmin/login');
      // }
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        // navigate('/admin/login');
        if (userRole === 'admin') {
          navigate('/admin/login');
        } else {
          navigate('/superadmin/login');
        }
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
      // navigate('/admin/login');
      if (userRole === 'admin') {
        navigate('/admin/login');
      } else {
        navigate('/superadmin/login');
      }
    }
  }, []);

  return children;
};

export default AuthWatcher;

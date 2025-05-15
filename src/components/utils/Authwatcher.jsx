// components/AuthWatcher.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthWatcher = ({ setIsAuthenticated, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userRole = sessionStorage.getItem('userRole');

    if (!token) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userRole');
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
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userRole');
        setIsAuthenticated(false);
        // navigate('/admin/login');
        if (userRole === 'admin') {
          navigate('/admin/login');
        } else{
          navigate('/superadmin/login');
        }
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userRole');
      setIsAuthenticated(false);
      // navigate('/admin/login');
      if (userRole === 'admin') {
        navigate('/admin/login');
      } else{
        navigate('/superadmin/login');
      }
    }
  }, []);

  return children;
};

export default AuthWatcher;

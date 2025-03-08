import { BrowserRouter as Router } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
// import "../assets/Front/theme.min.css";
// import ".../assets/Front/theme.min.js";
// import ".../assets/Front/vendor.min.css";
// import ".../assets/Front/vendor.min.js";
// import ".../assets/Front/hs-navbar-vertical-aside-mini-cache.js";
// import ".../assets/Front/hs.theme-appearance.js";
// import ".../assets/Front/css2.css";
// import ".../assets/Front/theme(1).min.css";
import './App.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 1500,
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem('authToken')
  );

  return (
    <Fragment>
      <Router>
        <AppRoutes setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
      </Router>
    </Fragment>
  );
}
export default App;

// import React from 'react';
// import { createRoot } from 'react-dom/client';  // Use createRoot from react-dom/client
// import { Provider } from 'react-redux';
// import { store } from './store/store';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const container = document.getElementById('root');
// const root = createRoot(container);  // Initialize root

// root.render(


//   <React.StrictMode>
//     <Provider store={store}>
//       <ToastContainer />
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

// // Performance measurement (optional)
// reportWebVitals();



import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const container = document.getElementById('root');
const root = createRoot(container); // Initialize root

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
  </React.StrictMode>
);

// Performance measurement (optional)
reportWebVitals();


import 'bootstrap/dist/css/bootstrap.css';
// index.js o App.js
import './firebase'; // Asegúrate de que la ruta sea la correcta


//import "./css/bootstrap/css/bootstrap.min.css"
//import "./css/bootstrap/css/bootstrap-grid.min.css"
//import "./css/bootstrap/css/bootstrap-reboot.min.css"

import React from 'react';
import ReactDOM from 'react-dom/client';  // Cambiar el import para ReactDOM
import App from './App';



const root = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(root);  // Usar createRoot

reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

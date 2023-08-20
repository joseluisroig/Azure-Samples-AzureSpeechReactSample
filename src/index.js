
import 'bootstrap/dist/css/bootstrap.css';
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

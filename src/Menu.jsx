import React from 'react';
import './css/menu.css'; // Asegúrate de que la ruta sea la correcta
import Autenticador from './Autenticador';

const Menu = () => {
  return (
    <div className="menu">
      <ul className="menu-list">
        <li className="menu-item">
          <a href="#servicios" className="menu-link">Servicios</a>
        </li>
        <li className="menu-item">
          <a href="#quienes-somos" className="menu-link">Quiénes somos</a>
        </li>
        <li className="menu-item">
          <a href="#contacta" className="menu-link">Contacta</a>
        </li>
        <li className="menu-item">
          <Autenticador />
        </li>
      </ul>
    </div>
  );
};

export default Menu;



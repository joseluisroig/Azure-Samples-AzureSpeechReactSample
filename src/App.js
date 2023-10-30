import React from "react";

//import Teams from "./Teams.jsx"; // Asegúrate de que la ruta del archivo sea correcta y coincida con la ubicación real del archivo.
import Menu from "./Menu.jsx";
//import Header from "./Header.jsx";
//import Tarjetas from "./Tarjetas.jsx";

//import Teams from "./Teams.jsx";
import AvatarApp from "./AvatarApp.jsx";
import TeacherGallery from "./TeachersGallery.jsx";
//import "./App.css";
//import Autenticador from "./Autenticador.jsx";


import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Home from './Home'; // Asegúrate de que la ruta de importación sea la correcta
//import TeachersGallery from './TeachersGallery'; // Asegúrate de que la ruta de importación sea la correcta

const App = () => {
  return (
    
    <Router>
      <Menu />

      <Routes>
        <Route path="/teachers" element={<TeacherGallery />} />
        <Route path="/avatar" element={<AvatarApp />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
//  {AvatarApp()} 
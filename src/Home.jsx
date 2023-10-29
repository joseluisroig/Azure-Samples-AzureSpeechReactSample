
import React from 'react';
import { useNavigate } from 'react-router-dom';
//import Teams from "./Teams.jsx"; // Asegúrate de que la ruta del archivo sea correcta y coincida con la ubicación real del archivo.
//import Menu from "./Menu.jsx";
import Header from "./Header.jsx";
import Tarjetas from "./Tarjetas.jsx";
//import TeacherGallery from "./TeachersGallery.jsx";
import Teams from "./Teams.jsx";


const Home = () => {
    const navigate = useNavigate();



  return (
    <main>
    
    <Header />
    <Tarjetas navigate={navigate} />

    <Teams />


   
    </main>
  );
};
export default Home;
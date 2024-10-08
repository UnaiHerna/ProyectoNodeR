// src/pages/Home/Home.tsx

import React from 'react';
import { useLocation } from 'react-router-dom'; // Importa useLocation para acceder a los datos enviados
import SidebarAndNavbar from './Home_components/Navbar';
import Body from './Home_components/Body';

const Home: React.FC = () => {
  const location = useLocation(); // Obtiene la ubicación actual
  const { email } = location.state || {}; // Desestructura el email del estado
  console.log(email);
  
  return (
    <>
      <SidebarAndNavbar title="Machine List" /> {/* Pasa el correo a SidebarAndNavbar */}
      <Body />
    </>
  );
};

export default Home;

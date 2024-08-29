// src/pages/Home/Home.tsx

import React from 'react';
import SidebarAndNavbar from './Home_components/Navbar';
import Body from './Home_components/Body';

const Home: React.FC = () => {
  return (
    <>
      <SidebarAndNavbar title=''/>
      <Body />
    </>
  );
};

export default Home;

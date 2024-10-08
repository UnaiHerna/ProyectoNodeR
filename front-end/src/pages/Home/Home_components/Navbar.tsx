// src/pages/Home/Home_components/Navbar.tsx

import React from 'react';
import UserCard from './nexUI/UserCard';
import { Link } from 'react-router-dom';

interface Props {
  title: string | undefined;
}

const SidebarAndNavbar: React.FC<Props> = ({ title}) => {
  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-cimico text-white p-3 shadow-md fixed z-30 w-full">
        <div className="flex items-center space-x-8 ml-4">
          <Link to="/">
            <img
              src="/cimico-logotipo-blanco.png"
              className="h-9"
              alt="Logo"
            />
          </Link>
          <h2 className="text-2xl font-semibold">{title?.replace("_", " ")}</h2>
        </div>
        <div className="flex items-center space-x-6">
          {/* Pasa el correo a UserCard */}
          <UserCard />
        </div>
      </nav>
    </>
  );
};

export default SidebarAndNavbar;

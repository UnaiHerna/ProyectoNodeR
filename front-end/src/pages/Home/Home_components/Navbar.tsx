import React from 'react';
import UserCard from './nexUI/UserCard';

const SidebarAndNavbar: React.FC = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-cimico text-white p-3 shadow-md fixed z-30 w-full">
        <div className="flex items-center space-x-8 ml-12">
          <img
            src="/cimico-logotipo-blanco.png"
            className="h-9"
            alt="Logo"
          />
          <h2 className="text-2xl font-semibold">EDAR Ranilla</h2>
        </div>
        <div className="flex items-center space-x-6">
          <UserCard />
        </div>
      </nav>
    </>
  );
};

export default SidebarAndNavbar;

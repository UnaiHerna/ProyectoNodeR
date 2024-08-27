// src/pages/Home/Home.tsx

import React from 'react';
import DataDisplay from '../../components/DataDisplay'; // Ajusta la ruta según tu estructura de carpetas

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <DataDisplay />
    </div>
  );
};

export default Home;

import React from 'react';
import Card from '../Atoms/Card';
import { FaArrowLeft } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 min-h-screen">
      {/* Tarjeta con gráfico de caudal */}
      <Card title="Influent flow rate – m³/h">
        <div className="flex items-center">
          <FaArrowLeft className="text-blue-600 w-6 h-6 mr-2" />
          {/* Simulación de gráfico */}
          <div className="flex items-center space-x-1">
            {[...Array(24)].map((_, i) => (
              <span key={i} className="inline-block h-2 w-2 bg-gray-400 rounded-full"></span>
            ))}
          </div>
        </div>
      </Card>

      {/* Tarjeta de calidad */}
      <Card title="Quality">
        <p>Quality data or visualization goes here.</p>
      </Card>

      {/* Tarjeta del clima */}
      <Card title="Weather">
        <p>Weather data or forecast details here.</p>
      </Card>

      {/* Tarjeta de notificaciones */}
      <Card title="Notifications">
        <p>No new notifications.</p>
      </Card>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import Card from '../Atoms/Card';
import FlowRateChart from '../Moleculs/FlowRateChart';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-rows-4 grid-cols-4 gap-4 p-4 bg-gray-100 min-h-screen">
      {/* Tarjeta con gráfico de caudal */}
      <Card title="Influent flow rate – m³/h" className="row-span-2 col-span-3">
        <div className="w-full h-full"> {/* Utilizar altura completa */}
          <FlowRateChart />
        </div>
      </Card>

      {/* Tarjeta de calidad */}
      <Card title="Quality" className="row-span-2 col-span-1">
        <p>Quality data or visualization goes here.</p>
      </Card>

      {/* Tarjeta del clima */}
      <Card title="Weather" className="row-span-2 col-span-3">
        <p>Weather data or forecast details here.</p>
      </Card>

      {/* Tarjeta de notificaciones */}
      <Card title="Notifications" className="row-span-2 col-span-1">
        <p>No new notifications.</p>
      </Card>
    </div>
  );
};

export default Dashboard;

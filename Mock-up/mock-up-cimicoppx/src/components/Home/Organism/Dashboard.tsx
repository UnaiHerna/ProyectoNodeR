import React from "react";
import Card from "../Atoms/Card";
import FlowRateChart from "../Moleculs/FlowRateChart";
import TitleSelection from "../Moleculs/TittleSelect";

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-rows-4 grid-cols-4 gap-4 p-4 bg-gray-100 h-[46rem]">
      {/* Tarjeta con gráfico de caudal */}
      <Card
        title={
          <TitleSelection 
            title="Influent flow rate – m³/h"
            additionalLabels={["Today", "Stats"]}
          />
        }
        className="row-span-2 col-span-3"
      >
        <div className="w-full h-full">
          {/* Utilizar altura completa */}
          <FlowRateChart />
        </div>
      </Card>

      {/* Tarjeta de calidad */}
      <Card
        title={<TitleSelection title="Quality" additionalLabels={[]} />} // No additional labels for this card
        className="row-span-2 col-span-1"
      >
        <p>Quality data or visualization goes here.</p>
      </Card>

      {/* Tarjeta del clima */}
      <Card
        title={
          <TitleSelection 
            title="Weather"
            additionalLabels={["Temperature", "Rain"]}
          />
        }
        className="row-span-2 col-span-3"
      >
        <p>Weather data or forecast details here.</p>
      </Card>

      {/* Tarjeta de notificaciones */}
      <Card
        title={<TitleSelection title="Notifications" additionalLabels={[]} />} // No additional labels for notifications
        className="row-span-2 col-span-1"
      >
        <p>No new notifications.</p>
      </Card>
    </div>
  );
};

export default Dashboard;

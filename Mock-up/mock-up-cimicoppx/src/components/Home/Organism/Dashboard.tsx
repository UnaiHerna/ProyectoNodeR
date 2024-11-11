import React from "react";
import Card from "../Atoms/Card";
import FlowRateChart from "../Moleculs/FlowRateChart";
import TitleSelection from "../Moleculs/TittleSelect";
import DotsCircle from "../Moleculs/DotsCircle";
import WeatherForecast from "../Moleculs/WehaterForecats";

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-rows-4 grid-cols-4 gap-6 p-4 bg-white h-[95%] w-[95%] ml-10">
      {/* Tarjeta con gráfico de caudal */}
      <Card
        title={
          <TitleSelection
            title="Influent flow rate – m³/h"
            additionalLabels={
              <section className="mb-[8px]">
                <DotsCircle />
              </section>
            }
          />
        }
        className="row-span-2 col-span-3 bg-white"
      >
        <div className="w-full h-full">
          <FlowRateChart />
        </div>
      </Card>

      {/* Tarjeta de calidad */}
      <Card
        title={<TitleSelection title="Water Quality" additionalLabels={[]} />} // No additional labels for this card
        className="row-span-2 col-span-1 bg-white"
      >
        <p>Quality data or visualization goes here.</p>
      </Card>

      {/* Tarjeta del clima */}
      <Card
        title={
          <TitleSelection
            title="Weather info"
            additionalLabels={
              <section className="mb-[8px]">
                <DotsCircle />
              </section>
            }
          />
        }
        className="row-span-2 col-span-2"
      >
          <WeatherForecast />
      </Card>

      {/* Tarjeta de notificaciones */}
      <Card
        title={
          <TitleSelection
            title="Operational settings"
            additionalLabels={
              <h3 className="text-blue-800 w-[4rem] font-normal mb-2 text-[11pt] font-raleway bg-white">
                Line #1
              </h3>
            }
          />
        } // No additional labels for notifications
        className="row-span-2 col-span-2 bg-white"
      >
        <p>No new operations.</p>
      </Card>
    </div>
  );
};

export default Dashboard;

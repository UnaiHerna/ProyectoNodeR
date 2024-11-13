import React from "react";
import Card from "../Atoms/Card";
import FlowRateChart from "../Moleculs/FlowRateChart";
import TitleSelection from "../Moleculs/TittleSelect";
import DotsCircle from "../Moleculs/DotsCircle";
import WeatherForecast from "../Moleculs/WehaterForecats";
import PerformanceBody from "./PerformanceBody";
import DataGrid from "./DataGrid";
import IconButton from "./IconButton";

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
        title={
          <TitleSelection
            title="Performance"
            additionalLabels={
              <section className="mb-[8px]">
                <DotsCircle />
              </section>
            }
          />
        } // No additional labels for this card
        className="row-span-2 col-span-1 bg-white"
      >
        <PerformanceBody/>
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
            title="Online sensors"
            additionalLabels={
              <h3 className="text-blue-800 w-[5rem] text-center mb-2 text-[11pt] gap-1 font-raleway bg-white flex flex-row">
                Line #1 <IconButton direction="forward" />
              </h3>
            }
          />
        } // No additional labels for notifications
        className="row-span-2 col-span-2 bg-white"
      >
        <DataGrid />
      </Card>
    </div>
  );
};

export default Dashboard;

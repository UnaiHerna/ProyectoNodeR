import React from "react";
import Card from "../Atoms/Card";
import FlowRateChart from "../Moleculs/FlowRateChart";
import TitleSelection from "../Moleculs/TittleSelect";
import DotsCircle from "../Moleculs/DotsCircle";
import WeatherForecast from "../Moleculs/WehaterForecats";
import PerformanceBody from "./PerformanceBody";
import DataGrid from "./DataGrid";
import MapAndChart from "../Atoms/MapAndChart";
import CylinderAndLine from "../Atoms/CylinderAndLine";
import NavigationControls from "../Atoms/NavigationsControl";
// Import NavigationControls

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
        }
        className="row-span-2 col-span-1 bg-white"
      >
        <PerformanceBody />
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
              <section className="w-full p-1 flex flex-row gap-48 align-middle justify-center items-center">
                <MapAndChart />
                <CylinderAndLine />
                <div className="flex flex-col space-y-4">
                  {/* Call each part here */}
                  <NavigationControls lineLabel="Line #1" />
                </div>
              </section>
            }
          />
        }
        className="row-span-2 col-span-2 bg-white p-0 m-00"
      >
        <DataGrid />
      </Card>
    </div>
  );
};

export default Dashboard;

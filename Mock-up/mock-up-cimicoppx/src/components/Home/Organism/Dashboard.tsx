import React, { useState } from "react";
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

const Dashboard: React.FC = () => {
  // State to control whether to show points or numbers in DataGrid
  const [showPoints, setShowPoints] = useState(false);
  const [showLine, setShowLine] = useState(false);

  // State to control which button is active (set to "span" by default)
  const [activeButton, setActiveButton] = useState<string>("map");

  const handleMapClick = () => {
    console.log("Map marker clicked in MapAndChart");
    setShowPoints(false); // Set to show points
    setShowLine(false);
    setActiveButton("map"); // Set active button to "map"
  };
  
  const handleSpanClick = () => {
    console.log("Span clicked in MapAndChart");
    setShowPoints(true); // Set to show numbers
    setShowLine(false);
    setActiveButton("span"); // Set active button to "span"
  };

  const handleChartClick = () => {
    console.log("Chart icon clicked in MapAndChart");
    setActiveButton("chart"); // Set active button to "chart"
    setShowPoints(false);
    setShowLine(true);
  };

  const handleWWIconClick = () => {
    console.log("WWIcon clicked in CylinderAndLine");
  };

  const handleTubeIconClick = () => {
    console.log("TubeIcon clicked in CylinderAndLine");
  };

  const handleBackNavigationClick = () => {
    console.log("Back navigation clicked in NavigationControls");
  };

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
                <MapAndChart 
                  handleMapClick={handleMapClick}
                  handleChartClick={handleChartClick}
                  handleSpanClick={handleSpanClick}
                  activeButton={activeButton} // Pass activeButton to MapAndChart
                />
                <CylinderAndLine 
                  handleWWIconClick={handleWWIconClick} 
                  handleTubeIconClick={handleTubeIconClick} 
                />
                <div className="flex flex-col space-y-4">
                  <NavigationControls 
                    lineLabel="Line #1" 
                    handleClick={handleBackNavigationClick}
                  />
                </div>
              </section>
            }
          />
        }
        className="row-span-2 col-span-2 bg-white p-0 m-0"
      >
        <DataGrid showPoints={showPoints} showLine={showLine}/> {/* Pass showPoints as prop */}
      </Card>
    </div>
  );
};

export default Dashboard;

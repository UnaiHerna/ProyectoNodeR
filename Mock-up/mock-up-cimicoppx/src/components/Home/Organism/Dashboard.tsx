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
  const [showPoints, setShowPoints] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [activeDataType, setActiveDataType] = useState("ww");
  const [activeButton, setActiveButton] = useState<string>("map");

  const handleMapClick = () => {
    console.log("Map marker clicked in MapAndChart");
    setShowPoints(false);
    setShowLine(false);
    setActiveButton("map");
  };
  
  const handleSpanClick = () => {
    console.log("Span clicked in MapAndChart");
    setShowPoints(true);
    setShowLine(false);
    setActiveButton("span");
  };

  const handleChartClick = () => {
    console.log("Chart icon clicked in MapAndChart");
    setActiveButton("chart");
    setShowPoints(false);
    setShowLine(true);
  };

  const handleWWIconClick = () => {
    setActiveDataType("ww");
    console.log("WWIcon clicked in CylinderAndLine");
  };

  const handleTubeIconClick = () => {
    setActiveDataType("tube");
    console.log("TubeIcon clicked in CylinderAndLine");
  };

  const handleBackNavigationClick = () => {
    console.log("Back navigation clicked in NavigationControls");
  };

  return (
    <div className="grid grid-rows-4 grid-cols-4 gap-6 p-4 bg-white h-full w-full">
      <Card
        title={
          <TitleSelection
            title="Influent flow rate – m³/h"
            additionalLabels={
              <section className="mb-[9px]">
                <DotsCircle />
              </section>
            }
          />
        } /* breakpoint grid para influent rate*/
        className="row-span-2 col-span-3 sm:col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 bg-white"
      >
        <div className="md:h-[80%] lg:h-[80%] xl:h-[80%] 2xl:h-[90%] w-full">
          <FlowRateChart />
        </div>
      </Card>

      <Card
        title={
          <TitleSelection
            title="Performance"
            additionalLabels={
              <section className="lg:mb-[8px] w-full h-full">
                <DotsCircle />
              </section>
            }
          />
        } /*aqui */
        /* breakpoint grid para Performance*/
        className="row-span-2 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 bg-white"
      >
        <PerformanceBody />
      </Card>

      <Card
        title={
          <TitleSelection
            title="Weather info"
            additionalLabels={
              <section className="lg:mb-[8px]">
                <DotsCircle />
              </section>
            }
          />
        }
        /* breakpoint grid para wheather info*/
        className="row-span-2 col-span-2 bg-red-50 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2"
      >
        <WeatherForecast />
      </Card>

      <Card
        title={
          <TitleSelection
            title="Online sensors"
            additionalLabels={
              <section className="w-full h-auto  -mt-12 flex flex-col lg:flex-row align-middle justify-center  md:gap-10 lg:gap-16 xl:gap-20 2xl:gap-56 items-center">
                <MapAndChart 
                  handleMapClick={handleMapClick}
                  handleChartClick={handleChartClick}
                  handleSpanClick={handleSpanClick}
                  activeButton={activeButton}
                  activeDataType={activeDataType}
                />
                <CylinderAndLine 
                  handleWWIconClick={handleWWIconClick} 
                  handleTubeIconClick={handleTubeIconClick} 
                  activeDataType={activeDataType}
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
        /* breakpoint grid para online sensors*/
        className="row-span-2 col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 bg-white p-0 m-0"
      >
        <DataGrid showPoints={showPoints} showLine={showLine} activeDataType={activeDataType}/>
      </Card>
    </div>
  );
};
 
export default Dashboard;

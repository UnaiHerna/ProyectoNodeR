import React from "react";
import ShowLineWW from "../Moleculs/ShowLineTube";
import ScatterChartWW from "../Moleculs/ScatterChartWW";
import TubeChart from "../Moleculs/TubeChart";

interface LineChartComponentProps {
  data: { x: number; y: number }[]; // Data for both scatter and line charts
  rowLabels: string[]; // Labels for Y-axis (row labels)
  headers: string[]; // Headers for X-axis (headers)
  metrics: string[]; // Labels for X-axis (metrics)
  showPoints: boolean; // Flag to toggle showing points
  showLine: boolean; // Flag to toggle between scatter and line chart
  activeDataType: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  rowLabels,
  headers,
  metrics,
  showPoints,
  showLine,
  activeDataType,
}) => {
   
  return (
    <div className="w-full h-full flex items-center justify-center -mt-3">
        {/* Conditionally render either ScatterChart or LineChart */}
        {activeDataType !== "tube" ? (
          showLine ? (
            // Render LineChart
            <ShowLineWW activeDataType={activeDataType} data={data} headers={headers} rowLabels={rowLabels} showLine={showLine} />
          ) : (
            // Render ScatterChart
            <ScatterChartWW metrics={metrics} showPoints={showPoints}  activeDataType={activeDataType} data={data} headers={headers} rowLabels={rowLabels} showLine />
          )
        ) : (
          // Render TubeChart
          <TubeChart activeDataType={activeDataType} headers={headers} showLine={showLine} showPoints={showPoints} />
        )}
    </div>
  );
  
};

export default LineChartComponent;

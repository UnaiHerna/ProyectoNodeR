import React from "react";
import ScatterChartComponent from "./ScatterChart";

const rowLabels = ["TSS", "ORP", "N-NO3", "N-NH4", "DO"];
const headers = ["INF", "AN", "AX", "AX", "AE", "AE", "AE", "AE", "ST"];

// Mapa de índices para las etiquetas de filas
const rowIndexMap = {
  "DO": 4,
  "N-NH4": 3,
  "N-NO3": 2,
  "ORP": 1,
  "TSS": 0
};

// Datos con los puntos en las posiciones exactas como en la imagen
const scatterData = [
  { x: 0, y: rowIndexMap["ORP"], value: 5, metric: "mV" },
  { x: 1, y: rowIndexMap["DO"], value: 7, metric: "ppm" },
  { x: 2, y: rowIndexMap["DO"], value: 8, metric: "ppm" },
  { x: 3, y: rowIndexMap["N-NO3"], value: 10, metric: "ppm" },
  { x: 4, y: rowIndexMap["N-NO3"], value: 6, metric: "ppm" },
  { x: 5, y: rowIndexMap["N-NO3"], value: 12, metric: "ppm" },
  { x: 6, y: rowIndexMap["DO"], value: 12, metric: "ppm" },
  { x: 7, y: rowIndexMap["DO"], value: 8, metric: "ppm" },
  { x: 8, y: rowIndexMap["TSS"], value: 1, metric: "mg/L" },
];

const   DataGrid: React.FC<{ showPoints: boolean, showLine: boolean, activeDataType: string, }> = ({ showPoints, showLine, activeDataType }) => {
  return (
    <div className="flex w-full h-full">
      <div className="w-full">
        <div className="w-full h-72">
          <ScatterChartComponent 
            metrics={["ppm", "ppm", "ppm", "mV", "ppm"]} // Passing the metrics
            data={scatterData} 
            rowLabels={rowLabels} 
            headers={headers}  
            showPoints={showPoints}  // Pass showPoints as a prop
            showLine={showLine}
            activeDataType={activeDataType}
          />
        </div>
      </div>
    </div>
  );
};

export default DataGrid;

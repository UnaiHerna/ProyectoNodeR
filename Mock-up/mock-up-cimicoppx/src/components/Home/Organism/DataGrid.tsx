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
  { x: 0, y: rowIndexMap["ORP"], value: 5 },
  { x: 1, y: rowIndexMap["DO"], value: 7 },
  { x: 2, y: rowIndexMap["DO"], value: 8 },
  { x: 3, y: rowIndexMap["N-NO3"], value: 10 },
  { x: 4, y: rowIndexMap["N-NO3"], value: 6 },
  { x: 5, y: rowIndexMap["N-NO3"], value: 12 },
  { x: 6, y: rowIndexMap["DO"], value: 9 },
  { x: 7, y: rowIndexMap["DO"], value: 4 },
  { x: 8, y: rowIndexMap["TSS"], value: 3 },
];

// const scatterData = [
//   { x: 0, y: rowIndexMap["ORP"], value:0 },
//   { x: 1, y: rowIndexMap["DO"], value:1 },
//   { x: 2, y: rowIndexMap["DO"], value:2 },
//   { x: 3, y: rowIndexMap["N-NO3"], value:3 },
//   { x: 4, y: rowIndexMap["N-NO3"], value:4 },
//   { x: 5, y: rowIndexMap["N-NO3"], value:5 },
//   { x: 6, y: rowIndexMap["DO"], value:6 },
//   { x: 7, y: rowIndexMap["DO"], value:7 },
//   { x: 8, y: rowIndexMap["TSS"], value:8 },
// ];
const DataGrid: React.FC<{ showPoints: boolean }> = ({ showPoints }) => {
  return (
    <div className="flex w-full h-full">
      <div className="w-full">
        <div className="w-full h-52">
          <ScatterChartComponent 
           metrics={["ppm", "ppm", "ppm", "mV", "ppm"]}
            data={scatterData} 
            rowLabels={rowLabels} 
            headers={headers}  
            showPoints={showPoints}  // Pass showPoints as a prop
          />
        </div>
      </div>
    </div>
  );
};

export default DataGrid;

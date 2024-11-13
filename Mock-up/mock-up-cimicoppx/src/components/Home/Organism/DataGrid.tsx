import React from "react";
import ScatterChartComponent from "./ScatterChart";

const rowLabels = ["DO", "N-NH4", "N-NO3", "ORP", "TSS"];
const headers = ["INF", "AN", "AX", "AX", "AE", "AE", "AE", "AE", "ST"];

// Mapa de índices para las etiquetas de filas
const rowIndexMap = {
  "DO": 0,
  "N-NH4": 1,
  "N-NO3": 2,
  "ORP": 3,
  "TSS": 4
};

// Datos con los puntos en las posiciones exactas como en la imagen
const scatterData = [
  { x: 0, y: rowIndexMap["ORP"] },
  { x: 1, y: rowIndexMap["DO"] },
  { x: 2, y: rowIndexMap["DO"] },
  { x: 3, y: rowIndexMap["N-NO3"] },
  { x: 4, y: rowIndexMap["N-NO3"] },
  { x: 5, y: rowIndexMap["N-NO3"] },
  { x: 6, y: rowIndexMap["DO"] },
  { x: 7, y: rowIndexMap["DO"] },
  { x: 8, y: rowIndexMap["TSS"] },
];

const DataGrid: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      {/* Column Headers */}
      <div className="w-full">
        {/* Scatter Chart */}
        <div className="w-full h-52">
          <ScatterChartComponent 
            data={scatterData} 
            rowLabels={rowLabels} 
            headers={headers}  // Pasamos headers como prop
          />
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
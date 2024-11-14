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
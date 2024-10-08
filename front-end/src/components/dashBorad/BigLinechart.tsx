import React from 'react';
import GeneralChartComponent from "./FrameWorkCimico";

interface BigChartProps {
  startDate: string; // Start date as an ISO string
  endDate: string;   // End date as an ISO string
}

const BigChart: React.FC<BigChartProps> = ({ startDate, endDate }) => {
  // Definir las variables que queremos graficar
  const variables = ['NH4', 'NH4_FILT', 'DO_SP', 'QW', 'DO'];
  // Definir los ejes Y para las variables
  const yAxisLeft = [variables[0], variables[1], variables[2], variables[4]]; // Eje Y izquierdo
  const yAxisRight = [variables[3]]; // Eje Y derecho (opcional)

  return (
    <div className="w-full h-96"> {/* Ajusta el tamaño del contenedor */}
      <h1>Gráfico General de Sensores</h1>
      <div style={{ height: '100%', width: '100%' }}> {/* Ajusta el tamaño del contenedor */}
        <GeneralChartComponent
          variables={variables}          // Variables a graficar
          startDate={startDate}          // Fecha de inicio
          endDate={endDate}              // Fecha final
          chartType='line'               // Tipo de gráfico (línea)
          zoomEnabled={true}             // Habilitar zoom
          yAxisLeft={yAxisLeft}          // Variables para el eje Y izquierdo
          yAxisRight={yAxisRight}        // Variables para el eje Y derecho
          useDataset={false}             // Usar series directamente
        />
      </div>
    </div>
  );
};

export default BigChart;

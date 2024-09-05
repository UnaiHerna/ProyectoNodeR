import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {
  fetchNH4Data,
  fetchNH4FiltData,
  fetchDO_SPData,
  fetchDOSensData
} from "../../helpers/apiHelper"; // Ajusta el import según sea necesario

type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";

interface GaugeChartProps {
  variable: VariableType; // Variable para la que se van a buscar los datos
}

const GaugeChart: React.FC<GaugeChartProps> = ({ variable }) => {
  const [value, setValue] = useState<number>(0);

  // Calcular las fechas para las últimas 6 horas
  const now = new Date();
  const endDate = now.toISOString();
  now.setHours(now.getHours() - 6);
  const startDate = now.toISOString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        switch (variable) {
          case "NH4":
            data = await fetchNH4Data(startDate, endDate);
            break;
          case "NH4_FILT":
            data = await fetchNH4FiltData(startDate, endDate, 'timeseries');
            break;
          case "DO_SP":
            data = await fetchDO_SPData(startDate, endDate);
            break;
          case "DO":
            data = await fetchDOSensData(startDate, endDate);
            break;
          default:
            console.warn(`No se definió una función de obtención de datos para la variable: ${variable}`);
            return;
        }

        if (data.length > 0) {
          const latestDataPoint = data[data.length - 1];
          setValue(latestDataPoint.value);
        }
      } catch (error) {
        console.error("Error al obtener datos para el gauge:", error);
      }
    };

    fetchData();
  }, [variable, startDate, endDate]);

  // Definir el mapeo de colores según la variable
  const colorMapping: Record<VariableType, { gaugeColor: string, textColor: string }> = {
    "NH4": { gaugeColor: "#4CAF50", textColor: "#000000" }, // Gauge verde, texto negro
    "NH4_FILT": { gaugeColor: "#4CAF50", textColor: "#000000" },
    "DO_SP": { gaugeColor: "#4CAF50", textColor: "#000000" },
    "DO": { gaugeColor: "#4CAF50", textColor: "#000000" }
  };

  const maxValue = 5; // Establece un valor máximo fijo o busca dinámicamente si es necesario
  const data = [
    { value },
    { value: maxValue - value }
  ];

  // Usar el color del mapeo
  const { gaugeColor, textColor } = colorMapping[variable];
  const COLORS = [gaugeColor, '#E0E0E0']; // Colores para las partes llenas y vacías

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 bg-opacity-50 p-2 rounded-lg shadow-md relative w-full h-52">
      <h1 style={{ color: textColor }}>{variable}</h1>
      <PieChart width={200} height={120}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="100%"
          innerRadius={70}
          outerRadius={90}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute top-1/2 transform -translate-y-1/2 text-xl font-bold" style={{ color: textColor }}>
        {value.toFixed(2)}
      </div>
    </div>
  );
};

export default GaugeChart;

import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import {
  fetchNH4Data,
  fetchNH4FiltData,
  fetchDO_SPData,
  fetchDOSensData,
} from "../../helpers/apiHelper"; // Ajusta la importación según sea necesario

// Define el tipo para los datos del gráfico
interface ChartData {
  time: string;
  value: number;
}

// Define los tipos válidos de variables
type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";

interface CustomLineChartProps {
  variable: VariableType; // Prop para decidir qué variable de datos obtener
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({ variable }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const now = new Date();
  const endDate = now.toISOString();
  now.setHours(now.getHours() - 6); // Obtener datos de las últimas 6 horas
  const startDate = now.toISOString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: ChartData[] = [];

        // Determinar qué datos obtener en función de la prop `variable`
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
            console.error(`Variable inválida: ${variable}`);
            return;
        }

        setChartData(data);
      } catch (error) {
        console.error("Error obteniendo datos del gráfico:", error);
      }
    };

    fetchData();
  }, [variable]); // Vuelve a obtener datos si cambia la variable

  // Establecer el color de la línea basado en la variable
  const lineColor = variable === "NH4" ? "#94CC78" : "#0000FF"; // Verde para NH4, azul para las demás

  // Mapeo de nombres de las variables para mostrarlas en texto
  const variableLabels: { [key in VariableType]: string } = {
    NH4: "NNH4 SENS",
    NH4_FILT: "NH4",
    DO_SP: "DO SP",
    DO: "DO SENS",
  };

  return (
    <div className='h-[40%]'>
      {/* Texto encima del gráfico para mostrar la variable seleccionada */}
      <h3>{variableLabels[variable]}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={chartData}>
          {/* Línea para la variable seleccionada */}
          <Line type="monotone" dataKey="value" stroke={lineColor} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;

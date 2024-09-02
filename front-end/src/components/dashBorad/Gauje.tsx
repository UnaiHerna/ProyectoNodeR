import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {
  fetchNH4Data,
  fetchNH4FiltData,
  fetchDO_SPData,
  fetchDOSensData
} from "../../helpers/apiHelper"; // Adjust import as necessary

type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";

interface GaugeChartProps {
  variable: VariableType; // Variable to fetch data for
}

const GaugeChart: React.FC<GaugeChartProps> = ({ variable }) => {
  const [value, setValue] = useState<number>(0);

  // Calculate dates for the last 6 hours
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
            data = await fetchNH4FiltData(startDate, endDate);
            break;
          case "DO_SP":
            data = await fetchDO_SPData(startDate, endDate);
            break;
          case "DO":
            data = await fetchDOSensData(startDate, endDate);
            break;
          default:
            console.warn(`No fetch function defined for variable: ${variable}`);
            return;
        }

        if (data.length > 0) {
          const latestDataPoint = data[data.length - 1];
          setValue(latestDataPoint.value);
        }
      } catch (error) {
        console.error("Error fetching gauge data:", error);
      }
    };

    fetchData();
  }, [variable, startDate, endDate]);

  // Define color mapping based on variable
  const colorMapping: Record<VariableType, { gaugeColor: string, textColor: string }> = {
    "NH4": { gaugeColor: "#4CAF50", textColor: "#000000" }, // Green gauge, black text
    "NH4_FILT": { gaugeColor: "#4CAF50", textColor: "#000000" }, // Green gauge, black text
    "DO_SP": { gaugeColor: "#4CAF50", textColor: "#000000" }, // Green gauge, black text
    "DO": { gaugeColor: "#4CAF50", textColor: "#000000" } // Green gauge, black text
  };

  const maxValue = 5; // Set this to a fixed value or fetch dynamically if needed
  const data = [
    { value },
    { value: maxValue - value }
  ];

  // Use color from the mapping
  const { gaugeColor, textColor } = colorMapping[variable];
  const COLORS = [gaugeColor, '#E0E0E0']; // Color for filled and unfilled parts

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
          {data.map((entry, index) => (
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

import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import {
  fetchNH4Data,
  fetchNH4FiltData,
  fetchDO_SPData,
  fetchDOSensData,
} from "../../helpers/apiHelper";

interface ChartData {
  time: string;
  value: number;
}

type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";

interface CustomLineChartProps {
  variable: VariableType; // Only variable prop is needed
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({ variable }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const endDate = now.toISOString();
  now.setHours(now.getHours() - 6);
  const startDate = now.toISOString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: ChartData[] = [];
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
            console.error(`Invalid variable: ${variable}`);
            return;
        }

        if (data.length === 0) {
          setError("No data found to display.");
        } else {
          setChartData(data);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Error loading data.");
      }
    };

    fetchData();
  }, [variable]);

  const variableLabels: { [key in VariableType]: string } = {
    NH4: "NNH4 SENS",
    NH4_FILT: "NH4",
    DO_SP: "DO SP",
    DO: "DO SENS",
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ChartData }[] }) => {
    if (active && payload && payload.length) {
      const { time, value } = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 p-2 rounded shadow">
          <p>{`Date: ${time}`}</p>
          <p>{`Value: ${value.toFixed(2)} ppm`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='h-[40%]'>
      <h3 className='flex justify-between'>
        {variableLabels[variable]}
      </h3>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#000" // Default color
              dot={false} 
              strokeWidth={2} // Default width
              animationDuration={500}
            />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CustomLineChart;

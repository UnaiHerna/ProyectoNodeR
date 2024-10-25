import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import {
  fetchNH4Data,
  fetchNH4FiltData,
  fetchDO_SPData,
  fetchDOSensData,
} from "../../helpers/apiHelper"; // Adjust the import as necessary

// Define the type for the chart data
interface ChartData {
  time: string;
  value: number;
}

// Define valid variable types
type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";

interface CustomLineChartProps {
  variable: VariableType; // Prop to decide which data variable to fetch
  lineColor?: string; // Add lineColor property
  lineWidth?: number; // Add lineWidth property
  lineStyle?: "solid" | "dashed" | "dotted"; // Add lineStyle property
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  variable,
  lineColor,
  lineWidth,
  lineStyle = "solid",
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const endDate = now.toISOString();
  now.setHours(now.getHours() - 6); // Get data from the last 6 hours
  const startDate = now.toISOString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: ChartData[] = [];
        // Determine which data to fetch based on the `variable` prop
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
          setError(null); // Reset error if there is data
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Error loading data.");
      }
    };

    fetchData();
  }, [variable]); // Refetch data if variable changes

  // Mapping variable names for display
  const variableLabels: { [key in VariableType]: string } = {
    NH4: "NNH4 SENS",
    NH4_FILT: "NH4",
    DO_SP: "DO SP",
    DO: "DO SENS",
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ChartData }[] }) => {
    if (active && payload && payload.length) {
      const { time, value } = payload[0].payload; // Use ChartData type
      return (
        <div className="bg-white border border-gray-300 p-2 rounded shadow">
          <p>{`Date: ${time}`}</p>
          <p>{`Value: ${value.toFixed(2)} ppm`}</p> {/* Display only two decimals */}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='h-[40%]'>
      {/* Text above the chart to show the selected variable */}
      <h3 className='flex justify-between'>
        {variableLabels[variable]}
      </h3>
      {error ? (
        <p className="text-red-600">{error}</p> // Show error message if no data
      ) : (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData}>
            {/* Line for the selected variable */}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={lineColor || "#000"} // Use lineColor if provided, otherwise black
              dot={false} // Remove markers
              strokeWidth={lineWidth || 2} // Use lineWidth if provided, otherwise width of 2
              strokeDasharray={lineStyle === "dashed" ? "5 5" : lineStyle === "dotted" ? "2 2" : undefined} // Apply line style
              animationDuration={500} 
            />
            {/* Add the Tooltip */}
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CustomLineChart;

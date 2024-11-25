import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SensorButton from "../Atoms/SensorButton";

interface LineChartComponentProps {
  data: { x: number; y: number }[]; // Data for the line plot
  rowLabels: string[]; // Labels for Y-axis (row labels)
  headers: string[]; // Headers for X-axis (headers)
  metrics: string[]; // Labels for X-axis (metrics)
  showPoints: boolean; // Flag to toggle showing points
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  rowLabels,
  headers,
  metrics,
  showPoints,
}) => {
  const CustomXAxisTick = ({
    x,
    y,
    customValue,
  }: {
    x: number;
    y: number;
    customValue: string;
  }) => {
    return (
      <g transform={`translate(${x},${y - 15})`}>
        <foreignObject x={-40} y={-25} width={88} height={30}>
          <div className="flex justify-center items-center w-full h-full">
            {customValue === "INF" ? (
              <SensorButton label={customValue} className="rounded-full w-10" />
            ) : (
              <SensorButton label={customValue} className="rounded-md w-16" />
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  const CustomYAxisTick = ({
    x,
    y,
    customValue,
  }: {
    x: number;
    y: number;
    customValue: string;
  }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-65} y={-15} width={80} height={30}>
          <div className="flex text-start items-center w-full h-full">
            <SensorButton
              label={customValue}
              className="rounded-md self-start text-start w-16"
            />
          </div>
        </foreignObject>
      </g>
    );
  };

  const CustomYAxisTick2 = ({
    x,
    y,
    customValue,
  }: {
    x: number;
    y: number;
    customValue: string;
  }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-1} y={-17} width={80} height={30}>
          <div className="flex text-start items-center w-full h-full">
            <span className="text-[#002060] font-lato text-[8pt]">
              {customValue}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  // Tooltip personalizado
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-[#fff8e1] p-2 rounded shadow-md">
          {/* Hora */}
          <div className="text-[#002060] font-bold text-sm">{label}</div>
          {/* Valor + Unidad */}
          <div className="text-[#002060] text-xs">
            {`${payload[0]?.value} ppm`}
          </div>
        </div>
      );
    }

    return null;
  };

  const scatterData = [
    { x: 0, y: 1, value: 5 },
    { x: 1, y: 2, value: 7 },
    { x: 2, y: 3, value: 8 },
    { x: 3, y: 2, value: 10 },
    { x: 4, y: 5, value: 6 },
    { x: 5, y: 4, value: 12 },
    { x: 6, y: null, value: 9 },
    { x: 7, y: null, value: 4 },
    { x: 8, y: null, value: 3 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={scatterData}
          margin={{ top: 30, right: 0, left: 15, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="0 0" stroke="#f2f2f2" />
          <XAxis
            dataKey="x"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={({ x, y, index }) => (
              <CustomXAxisTick
                x={x}
                y={y}
                customValue={headers[index]} // Pasar directamente el valor correspondiente
              />
            )}
            orientation="top"
          />

          <YAxis
            dataKey="y"
            type="number"
            domain={[4, 0]}
            orientation="left"
            axisLine={false}
            tickLine={true}
            tick={({ x, y, index }) => (
              <CustomYAxisTick
                x={x}
                y={y}
                customValue={rowLabels[index]} // Pasar directamente el valor correspondiente
              />
            )}
          />

          <YAxis
            dataKey="y"
            type="number"
            domain={[4, 0]}
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={true}
            tick={({ x, y, index }) => (
              <CustomYAxisTick2
                x={x}
                y={y}
                customValue={metrics[index]} // Pasar directamente el valor correspondiente
              />
            )}
          />

          {/* Tooltip con contenido personalizado */}
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<CustomTooltip />}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#1e3a8a"
            activeDot={showPoints ? { r: 5 } : undefined}
            dot={showPoints}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;

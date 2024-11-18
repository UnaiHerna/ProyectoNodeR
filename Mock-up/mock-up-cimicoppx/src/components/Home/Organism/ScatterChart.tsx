import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SensorButton from "../Atoms/SensorButton";
import { ScatterPointItem } from "recharts/types/cartesian/Scatter";

interface ScatterChartComponentProps {
  data: { x: number; y: number }[]; // Data for the scatter plot
  rowLabels: string[]; // Labels for Y-axis (row labels)
  headers: string[]; // Headers for X-axis (headers)
  metrics: string[]; // Labels for X-axis (metrics)
  showPoints: boolean; // Flag to toggle showing points
}

const ScatterChartComponent: React.FC<ScatterChartComponentProps> = ({
  data,
  rowLabels,
  headers,
  metrics,
  showPoints,
}) => {
  // Custom tick for X-axis (using headers)
  const CustomXAxisTick = (props: {
    x: number;
    y: number;
    payload: { value: number };
  }) => {
    const { x, y, payload } = props;
    const label = headers[payload.value]; // Use headers for X-axis ticks
  
    return (
      <g transform={`translate(${x},${y - 15})`}> {/* Adjust the y position here */}
        <foreignObject x={-40} y={-25} width={88} height={30}>
          <div className="flex justify-center items-center w-full h-full">
            {label === "INF" ? (
              <SensorButton label={label} className="rounded-full w-10" />
            ) : (
              <SensorButton label={label} className="rounded-md w-16" />
            )}
          </div>
        </foreignObject>
      </g>
    );
  };
  

  // Custom tick for Y-axis (using rowLabels)
  const CustomYAxisTick = (props: {
    x: number;
    y: number;
    payload: { value: number };
  }) => {
    const { x, y, payload } = props;
    const label = rowLabels[payload.value]; // Use rowLabels for Y-axis ticks

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-65} y={-15} width={80} height={30}>
          <div className="flex text-start items-center w-full h-full">
            <SensorButton
              label={label}
              className="rounded-md self-start text-start w-16"
            />
          </div>
        </foreignObject>
      </g>
    );
  };

  // Custom tick for Y-axis (using metrics)
  const CustomYAxisTick2 = (props: {
    x: number;
    y: number;
    metrics: string[];
    payload: { value: number };
  }) => {
    const { x, y, metrics, payload } = props;
    const label = metrics[payload.value]; // Access the correct metric from the metrics array

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-1} y={-17} width={80} height={30}>
          <div className="flex text-start items-center w-full h-full">
            <span className="text-[#002060] font-lato text-[8pt]">
              {label}{" "}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 30, right: 0, left: 15, bottom: 20 }}>
        <CartesianGrid strokeDasharray="0 0" stroke="#f2f2f2" />
          <XAxis
            dataKey="x"
            type="category"
            axisLine={false}
            tickLine={false}
            tickCount={headers.length}
            tick={(props) => <CustomXAxisTick {...props} />}
            orientation="top"
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[4, 0]}
            orientation="left"
            axisLine={false}
            tickLine={true}
            tick={(props) => <CustomYAxisTick {...props} />}
          />
          {showPoints && (
            <YAxis
              dataKey="y"
              type="number"
              domain={[4, 0]}
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={true}
              tick={(props) => (
                <CustomYAxisTick2 {...props} metrics={metrics} />
              )}
            />
          )}

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name="Data Points"
            data={data}
            fill="#1e3a8a"
            shape={showPoints ? CustomScatterShape : "circle"}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

// Custom scatter shape function
const CustomScatterShape = (props: ScatterPointItem) => {
  const { cx, cy, payload } = props;

  // Ensure cx and cy are valid numbers
  if (cx === undefined || cy === undefined || payload.value === undefined) {
    return <></>; // Return nothing if invalid data
  }

  return (
    <>
      {/* Fondo blanco detrás del texto */}
      <rect
        x={cx - 15} // Ajusta la posición horizontal
        y={cy - 10} // Ajusta la posición vertical
        width={30} // Ancho del fondo
        height={20} // Alto del fondo
        fill="white" // Color del fondo
        stroke="none" // Sin borde
        rx={5} // Bordes redondeados
      />
      {/* Texto sobre el fondo */}
      <text
        x={cx}
        y={cy}
        dy={5}
        textAnchor="middle"
        fill="#002060"
        fontFamily="Lato"
        fontSize="12pt"
      >
        {payload.value}
      </text>
    </>
  );
};

export default ScatterChartComponent;

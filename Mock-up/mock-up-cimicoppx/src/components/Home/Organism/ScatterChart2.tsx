import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import SensorButton from "../Atoms/SensorButton";
import { ScatterPointItem } from "recharts/types/cartesian/Scatter";

interface LineChartComponentProps {
  data: { x: number; y: number }[]; // Data for both scatter and line charts
  rowLabels: string[]; // Labels for Y-axis (row labels)
  headers: string[]; // Headers for X-axis (headers)
  metrics: string[]; // Labels for X-axis (metrics)
  showPoints: boolean; // Flag to toggle showing points
  showLine: boolean; // Flag to toggle between scatter and line chart
  activeDataType: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  rowLabels,
  headers,
  metrics,
  showPoints,
  showLine,
  activeDataType,
}) => {
  // Custom tick for X-axis (using headers)
  const CustomXAxisTick = (props: {
    x: number;
    y: number;
    payload: { value: number };
  }) => {
    const { x, y, payload } = props;
    const label = headers[payload.value];
    console.log(activeDataType);

    return (
      <g transform={`translate(${x},${y - 15})`}>
        <foreignObject x={-40} y={-25} width={88} height={30}>
          <div className="flex justify-center items-center w-full h-full">
            {payload.value == 4 && showLine ? (
              <SensorButton
                label={label}
                className="rounded-md self-start w-16 bg-cimico text-white" // Color cambiado aquí
              />
            ) : label === "INF" ? (
              <SensorButton
                label={label}
                className="rounded-full w-10 bg-gray-100"
              />
            ) : (
              <SensorButton
                label={label}
                className="rounded-md w-16 bg-gray-100"
              />
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
    const label = rowLabels[payload.value];

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-65} y={-15} width={80} height={30}>
          <div className="flex text-start items-center w-full h-full">
            {showLine && label == "DO" ? (
              <SensorButton
                label={label}
                className="rounded-md self-start text-start w-16 bg-cimico text-white" // Color cambiado aquí
              />
            ) : (
              <SensorButton
                label={label}
                className="rounded-md self-start text-start w-16 bg-gray-100"
              />
            )}
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
    const label = metrics[payload.value];

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-1} y={-17} width={80} height={30}>
          <div className="flex text-start items-center w-full h-full">
            <span className="text-[#002060] font-lato text-[11pt]">
              {label}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  // Custom tick for Y-axis (using metrics)
  const CustomXAxisTick2 = (props: {
    x: number;
    y: number;
    metrics: string[];
    payload: { value: number };
  }) => {
    const { x, y, payload } = props;
    const label = payload.value;

    return (
      <g transform={`translate(${x},${y - 15})`}>
        <foreignObject x={-40} y={0} width={88} height={30}>
          <div className="flex justify-center items-center w-full h-full">
            <span className="text-black font-lato text-[11pt]">{label}</span>
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
        <div className="bg-[#fee8b4] p-2 rounded opacity-80 w-[7rem] text-start">
          {/* Hora */}
          <div className="text-[#002060] text-[10pt]">{label}:00</div>
          {/* Valor + Unidad */}
          <div className="text-[#002060] text-[10pt]">
            {`${payload[0]?.value} ppm`}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        {/* Conditionally render either ScatterChart or LineChart */}
        {activeDataType !== "tube" ? (
          showLine ? (
            <LineChart
              data={data}
              margin={{ top: 30, right: 0, left: 15, bottom: 20 }}
            >
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
              <XAxis
                dataKey="x"
                type="category"
                axisLine={false}
                tickLine={false}
                tickCount={headers.length}
                tick={(props) => <CustomXAxisTick2 {...props} />}
                orientation="bottom"
                xAxisId="bottom"
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
          ) : (
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
                shape={showPoints ? CustomScatterShape : "circle"} // Show cross shape when showPoints is true
              />
            </ScatterChart>
          )
        ) : (
          <div>gg</div>
        )}
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

export default LineChartComponent;

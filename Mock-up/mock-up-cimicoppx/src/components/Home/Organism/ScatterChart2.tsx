import React, { useRef } from "react";
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

    return (
      <g transform={`translate(${x},${y - 15})`}>
        <foreignObject x={-40} y={-25} width={88} height={30} stroke="red">
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
{/*
   estoe s del nuevo axis del cuando es tube chart optin  
*/}
const CustomYAxisTick3 = (props: {
  x: number;
  y: number;
  payload: { value: number };
}) => {
  const { x, y, payload } = props;
  const label = tubeRawLabels[payload.value];

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

{/*
   estoe s del nuevo axis del cuando es tube chart optin  
*/}
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
  //no se va usar
  const tubeRawLabels = ["FeCl3", "SURP", "RAS", "RINT"];
  const rowIndexMap = {
    "FeCl3": 3,
    "SURP": 2,
    "RAS": 1,
    "RINT": 0,
  };
  const colIndexMap = {"INF": 1, "AN": 2, "AX1": 3, "AX2": 4, "AE1": 5, "AE2": 6, "AE3": 7, "AE4": 8, "ST": 9};
  
  const data_dumbbell = [
    {"var":rowIndexMap["RINT"],
      "P1":colIndexMap["AX1"],
      "P2":colIndexMap["AE3"],
    },
    {"var":rowIndexMap["RAS"],
      "P1":colIndexMap["AN"],
      "P2":colIndexMap["ST"],
    },
    {"var":rowIndexMap["SURP"],
      "P1":colIndexMap["ST"],
      "P2":null,
    },
    
    {"var":rowIndexMap["FeCl3"],
      "P1":colIndexMap["AE3"],
      "P2":null,
    }
  ];

  console.log(data_dumbbell);
  
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
                tickLine={false}
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
              {/* linea de los axis de do,nh4 */}
              <YAxis
                dataKey="y"
                type="number"
                domain={[4, 0]}
                orientation="left"
                axisLine={false}
                tickLine={false}
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
                  tickLine={false}
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
          //esto es si es tube chart
          <ScatterChart margin={{ top: 30, right: 0, left: 15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="0 0" stroke="#f2f2f2" />
            <XAxis
              dataKey="x"
              type="category"
              axisLine={true}
              tickLine={true}
              tickCount={headers.length}
              tick={(props) => <CustomXAxisTick {...props} />}
              orientation="top"
            />
              <YAxis
                dataKey="y"
                type="number"
                ticks={[0, 1, 2, 3]}
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={(props) => <CustomYAxisTick3 {...props} />}
              />
            {/* {showPoints && (
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
          )} */}
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              name="Data Points"
              data={data_dumbbell}
              fill="#1e3a8a"
            />
          </ScatterChart>
          //crea una linea
        )}
      </ResponsiveContainer>
    </div>
  );
};

const CustomScatterShape2 = (props: ScatterPointItem) => {
  const { cx, cy, payload } = props;
  // Validación de datos para evitar errores
  if (cx === undefined || cy === undefined || payload.value === undefined) {
    return <></>; // No renderizar nada si los datos son inválidos
  }
  // Renderizar el círculo y la línea
  return (
    <>
  <circle cx={cx} cy={cy} r={5} fill="#1e3a8a" />
    </>
  );
};


// Custom scatter shape function para el primer grafico
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
        x={cx} // Ajusta la posición horizontal
        y={cy} // Ajusta la posición vertical
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

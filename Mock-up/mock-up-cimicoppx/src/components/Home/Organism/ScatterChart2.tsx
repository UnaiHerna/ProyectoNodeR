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
  ComposedChart,
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
            {payload.value == 4 && showLine && activeDataType !== "tube" ? (
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
  {
    /*
   estoe s del nuevo axis del cuando es tube chart optin  
*/
  }
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

  {
    /*
   estoe s del nuevo axis del cuando es tube chart optin  
*/
  }
  // Custom tick for Y-axis (using metrics)
  const CustomYAxisTick2 = (props: {
    x: number;
    y: number;
    metrics: string[];
    payload: { value: number };
  }) => {
    const { x, y, metrics, payload } = props;
    const label = metrics[payload.value];
    if (showPoints) {
      return (
        <g transform={`translate(${x + 6},${y})`}>
          <foreignObject x={-1} y={-17} width={80} height={30}>
            <div className="flex text-start items-center w-full h-full">
              <span className="text-[#002060] font-lato text-[11pt]">
                {label}
              </span>
            </div>
          </foreignObject>
        </g>
      );
    } else {
      return <g transform={`translate(${x},${y})`}></g>;
    }
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
        <foreignObject x={-40} y={0} width={80} height={30}>
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
          <div className="text-[#002060] text-[13pt]">{label}:00</div>
          {/* Valor + Unidad */}
          <div className="text-[#002060] text-[13pt]">
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
    FeCl3: 3,
    SURP: 2,
    RAS: 1,
    RINT: 0,
  };

  const unidades_tube = ["L/h", "m³/h", "m³/h", "m³/h"];

  const data_dumbbell = [
    { var: tubeRawLabels[rowIndexMap["RINT"]], y: 3, x: 2, value: null },
    { var: tubeRawLabels[rowIndexMap["RAS"]], y: 2, x: 1, value: null },
    { var: tubeRawLabels[rowIndexMap["SURP"]], y: 1, x: 8, value: 65 },
    { var: tubeRawLabels[rowIndexMap["FeCl3"]], y: 0, x: 6, value: 23 },
  ];

  const data_dumbbell2 = [
    { var: tubeRawLabels[rowIndexMap["RINT"]], y: 3, x: 6, value: 2915 },
    { var: tubeRawLabels[rowIndexMap["RAS"]], y: 2, x: 8, value: 1235 },
  ];

  const linea_RINT = [
    { var: tubeRawLabels[rowIndexMap["RINT"]], y: 3, x: 2, value: 70 },
    { var: tubeRawLabels[rowIndexMap["RINT"]], y: 3, x: 6, value: 80 },
  ];
  const linea_RAS = [
    { var: tubeRawLabels[rowIndexMap["RAS"]], y: 2, x: 1, value: 90 },
    { var: tubeRawLabels[rowIndexMap["RAS"]], y: 2, x: 8, value: 100 },
  ];

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
                stroke="#082464"
                dot={false}
                strokeWidth={4}
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
              <Scatter
                name="Data Points"
                data={data}
                fill="#082464"
                shape={showPoints ? CustomScatterShape : "circle"} // Show cross shape when showPoints is true
              />
            </ScatterChart>
          )
        ) : (
          //esto es si es tube chart
          <ComposedChart margin={{ top: 20, right: 0, left: 12, bottom: 50 }}>
            <CartesianGrid strokeDasharray="0 0" stroke="#f2f2f2" />
            <XAxis
              dataKey="x"
              type="number"
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
              axisLine={false}
              tickLine={false}
              tick={(props) => <CustomXAxisTick {...props} />}
              orientation="top"
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[4, 0]}
              ticks={[3, 2, 1, 0]}
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={(props) => <CustomYAxisTick3 {...props} />}
            />

            <YAxis
              dataKey="y"
              type="number"
              domain={[4, 0]}
              ticks={[3, 2, 1, 0]}
              orientation="right"
              yAxisId={"right"}
              axisLine={false}
              tickLine={false}
              tick={(props) => (
                <CustomYAxisTick2 {...props} metrics={unidades_tube} />
              )}
            />
            <Line
              type="bump"
              dataKey="y"
              data={linea_RINT}
              stroke={showPoints ? "#f8f4f4" : "#082464"}
              strokeWidth={5} // Set the line width here
              dot={false} // Hide the dot
            />
            <Line
              type="bump"
              dataKey="y"
              data={linea_RAS}
              stroke={showPoints ? "#f8f4f4" : "#082464"}
              fill="white"
              dot={false} // Hide the dot
              strokeWidth={5} // Set the line width here
            />
            <Scatter
              name="Data Points"
              data={data_dumbbell}
              shape={(props: ScatterPointItem) => (
                <>
                
                  <circle cx={props.cx} cy={props.cy} r={10} fill="white" />
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    fill={showPoints ? "#f8f4f4" : "#082464"}
                  />
                  {/* Fondo (rect) centrado con el texto */}
                  {showPoints&&(<>
                  {props.payload.value && (
                    <rect
                    x={props.cx ? props.cx  - 50 : 0} // Centrar el rect con respecto al texto
                    y={props.cy ? props.cy - 40 : 0} // Centrar verticalmente el rect
                    width={60} // Ancho del fondo
                    height={60} // Alto del fondo
                    fill="white" // Color del fondo
                    stroke="none" // Sin borde
                    rx={10} // Bordes redondeados
                  />
                  )}
                {/* Texto sobre el fondo */}
                <text
                  x={props.cx? props.cx-3 : 0} // Texto centrado horizontalmente
                  y={props.cy? props.cy+5: 0} // Texto centrado verticalmente
                  textAnchor="middle"
                  fill="#002060"
                  fontFamily="Lato"
                  fontSize="17pt"
                >{props.payload.value}</text>
                  </>)}
                </>
              )}
            />
            <Scatter
              name="Data Points"
              data={data_dumbbell2}
              shape={(props: ScatterPointItem) => (
                <>
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={10}
                    fill={showPoints ? "#f8f4f4" : "#082464"}
                  />
                  <circle cx={props.cx} cy={props.cy} r={6} fill="white" />
                  {/* Fondo (rect) centrado con el texto */}
                  {showPoints && (
                    <>
                      <rect
                        x={props.cx ? props.cx / 1.5 - 40 : 0} // Centrar el rect con respecto al texto
                        y={props.cy ? props.cy - 20 : 0} // Centrar verticalmente el rect
                        width={80} // Ancho del fondo
                        height={60} // Alto del fondo
                        fill="white" // Color del fondo
                        stroke="none" // Sin borde
                        rx={10} // Bordes redondeados
                      />
                      {/* Texto sobre el fondo */}
                      <text
                        x={props.cx ? props.cx / 1.5 : 0} // Texto centrado horizontalmente
                        y={props.cy ? props.cy + 5 : 0} // Texto centrado verticalmente
                        textAnchor="middle"
                        fill="#002060"
                        fontFamily="Lato"
                        fontSize="17pt"
                      >
                        {props.payload.value}
                      </text>
                    </>
                  )}
                </>
              )}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
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
        x={cx - 16} // Ajusta la posición horizontal
        y={cy - 13} // Ajusta la posición vertical
        width={40} // Ancho del fondo
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

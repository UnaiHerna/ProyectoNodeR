import { CartesianGrid, ScatterChart, XAxis, YAxis, Scatter, ResponsiveContainer } from "recharts";
import SensorButton from "../Atoms/SensorButton";
import { ScatterPointItem } from "recharts/types/cartesian/Scatter";

interface LineChartComponentProps {
  data: { x: number; y: number }[]; // Data for both scatter and line charts
  headers: string[]; // Headers for X-axis (headers)
  showLine: boolean; // Show line chart
  activeDataType: string; // Active data type
  rowLabels: string[];
  showPoints: boolean; // Show points
  metrics: string[]; // Metrics for Y-axis
}

const ScatterChartWW: React.FC<LineChartComponentProps> = ({
  data,
  headers,
  showPoints,
  rowLabels,
  metrics,
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
            {label === "INF" ? (
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
          <div className="flex pl-1 text-start items-center w-full h-full">
            <SensorButton
              label={label}
              className="rounded-md self-start text-start w-16 bg-gray-100"
            />
          </div>
        </foreignObject>
      </g>
    );
  };

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
          fontSize="16.8pt"
        >
          {payload.value}
        </text>
      </>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 0, left: 12, bottom: 40 }}>
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
          tick={(props) => <CustomYAxisTick2 {...props} metrics={metrics} />}
        />
      )}
      <Scatter
        name="Data Points"
        data={data}
        fill="#082464"
        fontSize={19}
        shape={showPoints ? CustomScatterShape : (props: ScatterPointItem)=>(
          <>
          <circle cx={props.cx} cy={props.cy} r={6} fill="#082464" />
          </>
        )} // Show custom when showPoints(show numbers) is true
      />
    </ScatterChart>
    </ResponsiveContainer>
  );
};
export default ScatterChartWW;

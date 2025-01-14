import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";
import SensorButton from "../Atoms/SensorButton";

interface LineChartComponentProps {
  data: { x: number; y: number }[]; // Data for both scatter and line charts
  headers: string[]; // Headers for X-axis (headers)
  showLine: boolean; // Show line chart
  activeDataType: string; // Active data type
  rowLabels: string[];
}

const ShowLineWW: React.FC<LineChartComponentProps> = ({
  data,
  headers,
  showLine,
  activeDataType,
  rowLabels,
}) => {
  console.log({ activeDataType });

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
          <div className="flex justify-center items-center w-full h-full pl-1">
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 40, left: 15, bottom: 0 }}
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
    </ResponsiveContainer>
  );
};

export default ShowLineWW;

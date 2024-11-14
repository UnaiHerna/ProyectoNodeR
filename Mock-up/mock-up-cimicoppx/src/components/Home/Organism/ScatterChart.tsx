import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SensorButton from '../Atoms/SensorButton';

interface ScatterChartComponentProps {
  data: { x: number; y: number }[];  // Data for the scatter plot
  rowLabels: string[];               // Labels for Y-axis (row labels)
  headers: string[];                 // Labels for X-axis (headers)
}

const ScatterChartComponent: React.FC<ScatterChartComponentProps> = ({ data, rowLabels, headers }) => {
  // Custom tick for X-axis (using headers)
  const CustomXAxisTick = (props: { x: number, y: number, payload: { value: number } }) => {
    const { x, y, payload } = props;
    const label = headers[payload.value]; // Use headers for X-axis ticks

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-40} y={-25} width={80} height={30}> {/* Adjusted y to -25 */}
          <div className="flex justify-center items-center w-full h-full">
            {label==="INF"?
            <SensorButton label={label} className='rounded-full w-10'/>
            :<SensorButton label={label} className='rounded-md w-16'/>
            }
            
          </div>
        </foreignObject>
      </g>
    );
  };

  // Custom tick for Y-axis (using rowLabels)
  const CustomYAxisTick = (props: { x: number, y: number, payload: { value: number } }) => {
    const { x, y, payload } = props;
    const label = rowLabels[payload.value]; // Use rowLabels for Y-axis ticks

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-65} y={-15} width={80} height={30}> {/* Adjusted x to -65 */}
          <div className="flex text-start items-center w-full h-full">
            <SensorButton label={label} className='rounded-md self-start text-start  w-16'/>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="w-full h-72"> {/* Adjusted height and padding */}
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 30, left: 25, bottom: 20 }}> {/* Moved margin here */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X-axis with category type (headers for X-axis) */}
          <XAxis
            dataKey="x"
            type="category"
            axisLine={false}
            tickLine={false}
            tickCount={headers.length}
            tick={(props) => <CustomXAxisTick {...props} />}
            orientation="top"
          />

          {/* Y-axis with rowLabels */}
          <YAxis
            dataKey="y"
            type="number"
            domain={[4,0]}
            axisLine={false}
            tickLine={true}
            tick={(props) =>{return <CustomYAxisTick {...props} />}}
          />

          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Data Points" data={data} fill="#1e3a8a" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChartComponent;

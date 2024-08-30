import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '03:00', DO_SENS: 2.5, DOSP: 2.5 },
  { name: '03:30', DO_SENS: 2.7, DOSP: 2.5 },
  // Add all your chart data here
];

const LineChartComponent = () => (
  <div className="w-full h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="DO_SENS" stroke="#0000FF" />
        <Line type="monotone" dataKey="DOSP" stroke="#FF4500" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChartComponent;

// src/components/LineChart.tsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  labels: string[];
  v_conc_anx: number[];
  v_conc_aer: number[];
}

interface LineChartProps {
  data: ChartData;
}

const LineChartComponent: React.FC<LineChartProps> = ({ data }) => {
  // Transform the data into a format suitable for recharts
  const chartData = data.labels.map((label, index) => ({
    label,
    v_conc_anx: data.v_conc_anx[index],
    v_conc_aer: data.v_conc_aer[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="v_conc_anx" stroke="#8884d8" />
        <Line type="monotone" dataKey="v_conc_aer" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;

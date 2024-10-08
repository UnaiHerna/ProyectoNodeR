import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {
  fetchNH4Data,
  fetchNH4FiltData,
  fetchDO_SPData,
  fetchDOSensData,
} from '../../helpers/apiHelper';

type VariableType = 'NH4' | 'NH4_FILT' | 'DO_SP' | 'DO';

interface DataPoint {
  value: number;
  maxValue?: number;
}

interface GaugeChartProps {
  variable: VariableType;
}

const RADIAN = Math.PI / 180;

const GaugeChart: React.FC<GaugeChartProps> = ({ variable }) => {
  const [value, setValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(5);

  // Calcular las fechas para las últimas 6 horas
  const now = new Date();
  const endDate = now.toISOString();
  now.setHours(now.getHours() - 6);
  const startDate = now.toISOString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: DataPoint[];
        switch (variable) {
          case 'NH4':
            data = await fetchNH4Data(startDate, endDate);
            break;
          case 'NH4_FILT':
            data = await fetchNH4FiltData(startDate, endDate, 'timeseries');
            break;
          case 'DO_SP':
            data = await fetchDO_SPData(startDate, endDate);
            break;
          case 'DO':
            data = await fetchDOSensData(startDate, endDate);
            break;
          default:
            console.warn(`No se definió una función de obtención de datos para la variable: ${variable}`);
            return;
        }

        if (data.length > 0) {
          const latestDataPoint = data[data.length - 1];
          setValue(latestDataPoint.value);
          if (latestDataPoint.maxValue !== undefined) {
            setMaxValue(latestDataPoint.maxValue);
          }
        }
      } catch (error) {
        console.error('Error al obtener datos para el gauge:', error);
      }
    };

    fetchData();
  }, [variable, startDate, endDate]);

  // Ajustar el centro y radios del gráfico
  const cx = 150; // Centro del gráfico
  const cy = 150; // Centro del gráfico
  const iR = 80; // Radio interno (ajustado)
  const oR = 150; // Radio externo (ajustado)

  const needle = (
    value: number,
    data: DataPoint[],
    cx: number,
    cy: number,
    iR: number,
    oR: number,
    color: string
  ) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5; // Radio del círculo en el centro
    const x0 = cx + 5; // Ajuste para centrar
    const y0 = cy + 5; // Ajuste para centrar
    const xba = x0 + r * sin; // Punto A
    const yba = y0 - r * cos; // Punto A
    const xbb = x0 - r * sin; // Punto B
    const ybb = y0 + r * cos; // Punto B
    const xp = x0 + length * cos; // Punta de la aguja
    const yp = y0 + length * sin; // Punta de la aguja

    return [
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" key="needle-circle" />,
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        fill={color}
        stroke="none"
        key="needle-path"
      />,
    ];
  };

  const colorMapping: Record<VariableType, { gaugeColor: string }> = {
    NH4: { gaugeColor: '#198754' },
    NH4_FILT: { gaugeColor: '#198754' },
    DO_SP: { gaugeColor: '#198754' },
    DO: { gaugeColor: '#198754' },
  };

  const { gaugeColor } = colorMapping[variable];

  const data = [
    { name: 'Value', value, color: gaugeColor },
    { name: 'Max', value: maxValue - value, color: '#D3D3D3' },
  ];

  return (
    <div className="flex flex-col items-center mb-2">
      <div className="text-lg font-bold text-gray-800 mb-1">{variable}</div>

      <PieChart width={320} height={190}> {/* Ajustar el tamaño del gráfico */}
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(value, data, cx, cy, iR, oR, '#666')} {/* Cambiado el color de las agujas a #a7a7a7 */}
      </PieChart>

      <div className="text-blue-800 text-xl font-bold">{value.toFixed(2)} ppm</div>
    </div>
  );
};

export default GaugeChart;

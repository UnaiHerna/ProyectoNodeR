import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchConsignaAvgModoData } from '../../helpers/apiHelper';
import { Spinner } from '@nextui-org/react';

interface BarChartProps {
  startDate: string;
  endDate: string;
}

const BarChartComponent: React.FC<BarChartProps> = ({ startDate, endDate }) => {
  const [data, setData] = useState<{ product: string[]; values: number[][] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const nh4Data = await fetchConsignaAvgModoData('nnh4_sp', startDate, endDate);
        const doSpData = await fetchConsignaAvgModoData('do_sp', startDate, endDate);
        const product = ['NH4_SP', 'DO_SP'];

        // Cambiando la estructura de los valores a un formato compatible
        const values = [
          [nh4Data.manual, nh4Data.automatico], // NH4_SP
          [doSpData.manual, doSpData.automatico], // DO_SP
        ];

        setData({ product, values });
      } catch (error) {
        setError('Error fetching data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Usando la estructura de valores como número para los trazos
  const traces = data
    ? [
        {
          x: data.product,
          y: data.values.map(val => val[0]), // Manual
          name: 'Manual',
          type: 'bar' as const,
          marker: { color: '#909DAD' }, // Color gris para Manual
        },
        {
          x: data.product,
          y: data.values.map(val => val[1]), // Automatico
          name: 'Automatico',
          type: 'bar' as const,
          marker: { color: '#072AC8' }, // Color azul para Automatico
        },
      ]
    : [];

  return (
    <div className="relative w-full h-full">
      {/* Gráfico de barras */}
      <Plot
        data={traces}
        layout={{
          barmode: 'group',
          title: 'Avg Modo',
          xaxis: {
            title: 'Consigna',
            type: 'category',
          },
          yaxis: {
            title: '(ppm)',
          },
          dragmode: false,
        }}
        config={{
          responsive: true,
          scrollZoom: false,
          displayModeBar: false,
          doubleClick: false,
        }}
         className='h-[100%] w-[100%]'
      />
      {/* Spinner que se muestra cuando loading está activo */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50">
          <Spinner size="md" color="primary" />
        </div>
      )}

      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default BarChartComponent;

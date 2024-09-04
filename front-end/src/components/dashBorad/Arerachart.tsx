import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { fetchDOSensData } from '../../helpers/apiHelper'; // Ajusta la ruta según sea necesario

// Define los tipos de los puntos de datos
interface DataPoint {
  time: string;
  value: number;
}

const ElectricityChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isDataFetched = false;  // Control booleano para la solicitud de datos

    const fetchData = async () => {
      if (!isDataFetched) {  // Solo procede si no se han obtenido los datos
        try {
          const fetchedData = await fetchDOSensData('2024-01-01', '2024-12-31', 'timeseries');
          setData(fetchedData);
        } catch (err) {
          setError('Error fetching data');
          console.error(err);
        } finally {
          setLoading(false);
        }
        isDataFetched = true;  // Marca como que los datos ya fueron solicitados
      }
    };

    fetchData();

    // Cleanup function para reiniciar el control cuando el componente se desmonte
    return () => {
      isDataFetched = true;  // Evita reintentos innecesarios
    };
  }, []);

  const getOption = () => {
    return {
      title: {
        text: 'Distribución de Electricidad',
        subtext: 'Datos Reales'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((dp) => dp.time), // Datos dinámicos para el eje X
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} W'
        },
        axisPointer: {
          snap: true
        }
      },
      series: [
        {
          name: 'Electricidad',
          type: 'line',
          smooth: true,
          data: data.map((dp) => dp.value), // Datos dinámicos para la serie
          markArea: {
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.4)'
            },
            data: [
              [
                {
                  name: 'Pico de la Mañana',
                  xAxis: '07:30'
                },
                {
                  xAxis: '10:00'
                }
              ],
              [
                {
                  name: 'Pico de la Tarde',
                  xAxis: '17:30'
                },
                {
                  xAxis: '21:15'
                }
              ]
            ]
          }
        }
      ]
    };
  };

  return (
    <div className='w-9/12 h-full p-0 m-0'>
      {loading && <p>Cargando...</p>}
      {error && <p>Error al obtener datos: {error}</p>}
      {!loading && !error && (
        <ReactEcharts
          option={getOption()}
          style={{ height: '100%', width: '100%' }}
        />
      )}
    </div>
  );
};

export default ElectricityChart;

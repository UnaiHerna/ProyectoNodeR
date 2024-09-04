import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/component/calendar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/visualMap';
import { fetchHeatmapDataForYear } from '../../helpers/apiHelper'; // Ajusta la ruta según tu estructura de carpetas

interface HeatmapDayData {
  day: string; // El día de la semana, por ejemplo, "Tuesday"
  week: number; // El número de la semana en el año
  average_value: number; // El valor promedio para ese día
}

const HeatmapComponent: React.FC<{ year: string; variable: string; equipo: string; }> = ({ year, variable, equipo }) => {
  const [data, setData] = useState<HeatmapDayData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchHeatmapDataForYear(year, variable, equipo);
        setData(result);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, variable, equipo]);

  useEffect(() => {
    if (data) {
      const chartContainer = document.getElementById('heatmap') as HTMLDivElement;
      const chart = echarts.init(chartContainer);

      const transformHeatmapData = (data: HeatmapDayData[]) => {
        return data.map(item => {
          const [dayName, weekNumber] = [item.day, item.week];
          const date = new Date(Date.UTC(Number(year), 0, (weekNumber - 1) * 7 + (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayName) + 1)));
          const value = Math.max(item.average_value, 5000); // Asegura que el valor sea al menos 5000
          return [
            echarts.time.format(date.getTime(), '{yyyy}-{MM}-{dd}', false),
            value
          ];
        });
      };

      const option = {
        title: {
          top: 30,
          left: 'center',
          text: 'Water Quality (QW) 2024'
        },
        tooltip: {},
        visualMap: {
          min: 0, // Asegúrate de que el valor mínimo sea 5000
          max: Math.max(...data.map(item => item.average_value)), // Asegúrate de que el máximo sea al menos 5000
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65,
          inRange: {
            color: [
              '#d0e4f5', // Light blue
              '#9ab8e8', // Medium light blue
              '#5e7dbd', // Medium blue
              '#1e4a9c', // Dark blue
              'rgb(5, 35, 170)' // Very dark blue
            ]
          }
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: year,
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: { show: false }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: transformHeatmapData(data)
        }
      };

      chart.setOption(option);

      // Resize the chart when the window is resized
      window.addEventListener('resize', () => chart.resize());

      return () => {
        chart.dispose();
        window.removeEventListener('resize', () => chart.resize());
      };
    }
  }, [data, year]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div id="heatmap" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default HeatmapComponent;

import React, { useEffect, useState } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { fetchHeatmapDataForYear } from '../../helpers/apiHelper'; // Ajusta la ruta según tu estructura de carpetas

interface HeatmapDayData {
  day: string; // La fecha en formato 'YYYY-MM-DD'
  average_value: number; // El valor promedio para ese día
}

const HeatmapComponent: React.FC<{ year: string; variable: string; equipo: string; }> = ({ year, variable, equipo }) => {
  const [data, setData] = useState<HeatmapDayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchHeatmapDataForYear(year, variable, equipo);
        const transformedData = result.map(item => {
          const date = new Date(Date.UTC(Number(year), 0, (item.week - 1) * 7 + (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(item.day) + 1)));
          return {
            day: date.toISOString().split('T')[0], // Convertir a 'YYYY-MM-DD'
            average_value: Math.max(item.average_value, 5000), // Asegura que el valor sea al menos 5000
          };
        });
        setData(transformedData);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, variable, equipo]);

  // Función para obtener el color basado en el valor
  const getColorByValue = (value: number, minValue: number, maxValue: number) => {
    const scale = (value - minValue) / (maxValue - minValue);
    
    // Interpolación de color azul
    const r = Math.round(210 + (scale * (7 - 210))); // De 210 (azul claro) a 7 (casi negro)
    const g = Math.round(220 + (scale * (0 - 220))); // De 220 (azul claro) a 0 (negro)
    const b = Math.round(250 + (scale * (200 - 250))); // De 250 (azul claro) a 200 (azul más oscuro)

    return `rgb(${r}, ${g}, ${b})`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Encontrar el valor mínimo y máximo para la normalización
  const values = data.map(item => item.average_value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Mapeamos los datos para incluir el color correspondiente
  const calendarData = data.map(item => ({
    day: item.day,
    value: item.average_value,
    color: getColorByValue(item.average_value, minValue, maxValue), // Asignar color basado en el valor
  }));

  // Calcular el rango de fechas para 'from' y 'to'
  const fromDate = new Date(Math.min(...calendarData.map(item => new Date(item.day).getTime()))).toISOString().split('T')[0];
  const toDate = new Date(Math.max(...calendarData.map(item => new Date(item.day).getTime()))).toISOString().split('T')[0];

  return (
    <div style={{ height: '300px' }}>
      <h1 className='text-center'>Water Quality 2024</h1>
      <ResponsiveCalendar
        data={calendarData.map(item => ({
          day: item.day,
          value: item.value,
          color: item.color,
        }))}
        from={fromDate} // Fecha mínima desde los datos
        to={toDate} // Fecha máxima desde los datos
        emptyColor="#eeeeee"
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={40}
        colors={['#B6E3FF', '#54AEFF', '#0969DA', '#072AC8']}
        monthBorderColor="#ffff"
        dayBorderColor="#ffffff"
        legends={[{
          anchor: 'bottom-right',
          direction: 'row',
          translateY: 36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          itemDirection: 'right-to-left'
        }]}
      />
    </div>
  );
};

export default HeatmapComponent;

import React, { useEffect, useState } from 'react';
import GeneralChartComponent from './FrameWorkCimico';

// Utility function to format dates as YYYY-MM-DDTHH:mm:ss
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const LineChartComponent: React.FC = () => {
  const now = new Date();
  const endDate = formatDate(now);

  const startDate = new Date(now);
  startDate.setHours(startDate.getHours() - 6);
  const formattedStartDate = formatDate(startDate);

  const variables = ['NH4', 'NH4_FILT', 'DO_SP', 'DO'];
  const chartType = 'line';
  const zoomEnabled = false;
  const yAxisLeft = ['NH4', 'NH4_FILT', 'DO_SP', 'DO'];

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark component as loaded when it mounts
    setIsLoaded(true);
  }, []);

  return (
    <section className='w-full h-full'>
      {isLoaded && (
        <GeneralChartComponent
          variables={variables}
          startDate={formattedStartDate}
          endDate={endDate}
          chartType={chartType}
          zoomEnabled={zoomEnabled}
          yAxisLeft={yAxisLeft}
          useDataset={false}
        />
      )}
    </section>
  );
};

export default LineChartComponent;

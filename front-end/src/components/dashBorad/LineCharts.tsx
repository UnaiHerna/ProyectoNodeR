import GeneralChartComponent from './FrameWorkCimico';

// Utility function to format dates as YYYY-MM-DDTHH:mm:ss
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const LineChartComponent = () => {
  // Get the current date and time
  const now = new Date();
  
  // Calculate the endDate as the current date and time
  const endDate = formatDate(now);
  
  // Calculate the startDate as 6 hours ago
  now.setHours(now.getHours() - 6);
  const startDate = formatDate(now);
  
  // Define the chart parameters
  const variables = ['NH4', 'NH4_FILT', 'DO_SP', 'DO']; // Variables to fetch
  const chartType = 'line'; // Chart type: 'line', 'bar', or 'pie'
  const zoomEnabled = true; // Whether zoom is enabled
  const yAxisLeft = ['NH4', 'DO_SP']; // Variables for the left Y axis
  const yAxisRight = ['NH4_FILT', 'DO']; // Variables for the right Y axis

  return (
    <div className="w-full">
      <GeneralChartComponent
        variables={variables}
        startDate={startDate}
        endDate={endDate}
        chartType={chartType}
        zoomEnabled={zoomEnabled}
        yAxisLeft={yAxisLeft}
        yAxisRight={yAxisRight}
      />
    </div>
  );
};

export default LineChartComponent;

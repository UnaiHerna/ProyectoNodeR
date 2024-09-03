import GeneralChartComponent from "./FrameWorkCimico";
import React from "react";

// Utility function to format dates as YYYY-MM-DDTHH:mm:ss
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const BarChartComponent = () => {
  const now = new Date();
  const endDate = formatDate(now);

  const startDate = new Date(now);
  startDate.setHours(startDate.getHours() - 6);
  const formattedStartDate = formatDate(startDate);

  // Specifically for "DO" variable and bar chart type
  const variables = ["DO"];
  const chartType = "bar";
  const zoomEnabled = false;
  const yAxisLeft = ["DO"]; // You can adjust this based on what you need

  console.log(formattedStartDate, endDate, "Date range");

  return (
    <>
      <GeneralChartComponent
        variables={variables}
        startDate={formattedStartDate}
        endDate={endDate}
        chartType={chartType}
        zoomEnabled={zoomEnabled}
        yAxisLeft={yAxisLeft}
      />
    </>
  );
};

export default React.memo(BarChartComponent);

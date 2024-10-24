import { useState } from "react";
import BarChartComponent from "./Barchart";
import ModeComponent from "./cards/ModeCrad";
import DynamicChart from "./ComboChart";
import CustomLineChart from "./customLinechart";
import GaugeChart from "./Gauje";
import DatePicker2 from "./cards/DatePicker";
import HeatmapComponent from "./HeatCalendar";
import LineChartWithZoom from "./Last6H";
import SensorChartWithShadedAreas from "./areaPlotly";

export default function N_NH4TrainBody() {
  const currentDate = new Date();
  const endDate = currentDate.toISOString(); // Current date and time in ISO format
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 30); // Subtract 30 days

  const [barChartDateRange, setBarChartDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: startDate.toISOString(), // Start date 30 days ago
    endDate: endDate, // End date is today
  });

  const [dynamicChartDateRange, setDynamicChartDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: startDate.toISOString(), // Start date 30 days ago
    endDate: endDate, // End date is today
  });

  const [dynamicMarkArea, setDynamicMarkArea] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: startDate.toISOString(),
    endDate: endDate,
  });


  const handleBarChartDateChange = (startDate: string, endDate: string) => {
    setBarChartDateRange({ startDate, endDate });
    console.log("BarChart Date Range Changed:", { startDate, endDate });
  };

  const handleDynamicChartDateChange = (startDate: string, endDate: string) => {
    setDynamicChartDateRange({ startDate, endDate });
    console.log("DynamicChart Date Range Changed:", { startDate, endDate });
  };

  const handleDynamicMarkarea = (startDate: string, endDate: string) => {
    setDynamicMarkArea({ startDate, endDate });
    console.log("DynamicChart Date Range Changed:", { startDate, endDate });
  };


  return (
    <div className="grid grid-cols-1 gap-4 p-4 h-full w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <ModeComponent nombre="DO_SP" />
        <ModeComponent nombre="NNH4_SP" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 h-full">
        {/* LineChartComponent (without DatePicker) */}
        <LineChartWithZoom />

        {/* Gauge Charts (without DatePicker) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GaugeChart variable="NH4" />
          <GaugeChart variable="NH4_FILT" />
          <GaugeChart variable="DO_SP" />
          <GaugeChart variable="DO" />
        </div>

        {/* Custom Line Charts (without DatePicker) */}
        <div className="grid grid-cols-1 gap-4">
          <div className="h-20">
            <CustomLineChart variable="DO" />
          </div>
          <div className="h-40">
            <CustomLineChart variable="NH4" />
          </div>
        </div>
      </div>

      {/* BigChart with DatePicker */}
      <div className="grid grid-cols-1 gap-4 mt-4 h-[30rem]">
        <div className="col-span-1 max-h-auto">
          <section className="w-full max-w-sm mb-4">
            <DatePicker2 onDateChange={handleDynamicMarkarea} />
          </section>
          <SensorChartWithShadedAreas
            endDate={dynamicMarkArea.endDate}
            startDate={dynamicMarkArea.startDate}
          />
        </div>
      </div>

      {/* DynamicChart with DatePicker */}
      <div className="col-span-1 mt-[7rem] mb-10 h-[30rem]">
        <div className="col-span-1 h-full">
          <section className="w-full mb-4 flex flex-col md:flex-row justify-between">
            <section className="w-full max-w-sm">
              <DatePicker2 onDateChange={handleDynamicChartDateChange} />
            </section>
            <section className="w-full max-w-sm">
              <DatePicker2 onDateChange={handleBarChartDateChange} />
            </section>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-4 h-full mt-4 gap-4">
            <section className="col-span-1 md:col-span-3">
              <DynamicChart
                startDate={dynamicChartDateRange.startDate}
                endDate={dynamicChartDateRange.endDate}
              />
            </section>

            <section className="col-span-1 md:col-span-1">
              <BarChartComponent
                startDate={barChartDateRange.startDate}
                endDate={barChartDateRange.endDate}
              />
            </section>
          </div>
        </div>
      </div>

      {/* CalendarHeatmap with DatePicker */}
      <div className="col-span-1 mt-16">
        <HeatmapComponent year="2024" variable="qw" equipo="INF_PIPE.FM" />
      </div>

      {/* DragDrop components */}
      <div className="col-span-1 mt-16">
      <checkboxGroups
      </div>
    </div>
  );
}

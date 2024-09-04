import  { useState } from "react";
import BarChartComponent from "./Barchart";
import BigChart from "./BigLinechart";
import ModeComponent from "./cards/ModeCrad";
import DynamicChart from "./ComboChart";
import CustomLineChart from "./customLinechart";
import GaugeChart from "./Gauje";
import LineChartComponent from "./LineCharts";
import PieChartComponent from "./Piechart";
import DatePicker2 from "./cards/DatePicker";
import HeatmapComponent from "./HeatCalendar";
import ElectricityChart from "./Arerachart";

export default function N_NH4TrainBody() {
  // State for date ranges used by different charts
  const [bigChartDateRange, setBigChartDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "2024-09-01T00:00:00",
    endDate: "2024-09-30T23:59:59",
  });

  const [barChartDateRange, setBarChartDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "2024-09-01T00:00:00",
    endDate: "2024-09-30T23:59:59",
  });

  const [dynamicChartDateRange, setDynamicChartDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "2024-09-01T00:00:00",
    endDate: "2024-09-30T23:59:59",
  });

  // Callback functions to handle date changes
  const handleBigChartDateChange = (startDate: string, endDate: string) => {
    setBigChartDateRange({ startDate, endDate });
    console.log("BigChart Date Range Changed:", { startDate, endDate });
  };

  const handleBarChartDateChange = (startDate: string, endDate: string) => {
    setBarChartDateRange({ startDate, endDate });
    console.log("BarChart Date Range Changed:", { startDate, endDate });
  };

  const handleDynamicChartDateChange = (startDate: string, endDate: string) => {
    setDynamicChartDateRange({ startDate, endDate });
    console.log("DynamicChart Date Range Changed:", { startDate, endDate });
  };

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-4 p-4 h-full w-full">
      {/* Header */}
      <div className="flex flex-row gap-4 items-center">
        <ModeComponent nombre="DO_SP" />
        <ModeComponent nombre="NNH4_SP" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 h-full">
        {/* LineChartComponent (without DatePicker) */}
        <div className="h-[30rem]">
          <LineChartComponent />
        </div>

        {/* Gauge Charts (without DatePicker) */}
        <div className="grid grid-cols-4 gap-4">
          <GaugeChart variable="NH4" />
          <GaugeChart variable="NH4_FILT" />
          <GaugeChart variable="DO_SP" />
          <GaugeChart variable="DO" />
        </div>

        {/* Custom Line Charts (without DatePicker) */}
        <div className="grid grid-cols-1 gap-4">
          <div className="h-40">
            <CustomLineChart variable="DO" />
          </div>
          <div className="h-40">
            <CustomLineChart variable="NH4" />
          </div>
        </div>
      </div>

      {/* BigChart with DatePicker */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4 h-[30rem]">
        <div className="col-span-4 max-h-auto">
          <section className="w-64">
            <DatePicker2 onDateChange={handleBigChartDateChange} />
          </section>
          <BigChart
            startDate={bigChartDateRange.startDate}
            endDate={bigChartDateRange.endDate}
          />
        </div>
        <div className="col-span-2">
          <PieChartComponent
            startDate={bigChartDateRange.startDate}
            endDate={bigChartDateRange.endDate}
          />
        </div>
      </div>

      {/* BarChart with DatePicker */}
      <div className="col-span-1 mt-4 h-[30rem]">
        <section className="w-64 mb-4">
          <DatePicker2 onDateChange={handleBarChartDateChange} />
        </section>
        <BarChartComponent
          startDate={barChartDateRange.startDate}
          endDate={barChartDateRange.endDate}
        />
      </div>

      {/* DynamicChart with DatePicker */}
      <div className="col-span-1 mt-4 h-[30rem]">
        <section className="w-64 mb-4">
          <DatePicker2 onDateChange={handleDynamicChartDateChange} />
        </section>
        <DynamicChart
          startDate={dynamicChartDateRange.startDate}
          endDate={dynamicChartDateRange.endDate}
        />
      </div>

      {/* CalendarHeatmap with DatePicker */}
      <div className="col-span-1 mt-5 h-[40rem]">
        <HeatmapComponent year="2024" variable="qw" equipo="INF_PIPE.FM" />
      </div>
      {/* CalendarHeatmap with DatePicker */}
      <div className="col-span-1 h-[40rem]">
          <ElectricityChart />
      </div>
    </div>
  );
}

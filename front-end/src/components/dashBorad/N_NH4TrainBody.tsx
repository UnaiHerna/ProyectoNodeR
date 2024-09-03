import React from "react";
import BarChartComponent from "./Barchart";
import BigChart from "./BigLinechart";
import ModeComponent from "./cards/ModeCrad";
import DynamicChart from "./ComboChart";
import CustomLineChart from "./customLinechart";
import GaugeChart from "./Gauje";
import LineChartComponent from "./LineCharts";
import PieChartComponent from "./Piechart";
import CalendarHeatmap from "./HeatCalendar";
import DatePicker2 from "./cards/DatePicker";

export default function N_NH4TrainBody() {
  console.log("N_NH4TrainBody rendered");
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-4 p-4 h-full w-full">
      {/* Header */}
      <div className="flex flex-row gap-4 items-center">
        <ModeComponent nombre="DO_SP" />
        <ModeComponent nombre="NNH4_SP" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 h-full">
        {/* LineChartComponent */}
        <div className="h-[30rem]">
          <LineChartComponent />
        </div>

        {/* Gauge Charts */}
        <div className="grid grid-cols-4 gap-4">
          <GaugeChart variable="NH4" />
          <GaugeChart variable="NH4_FILT" />
          <GaugeChart variable="DO_SP" />
          <GaugeChart variable="DO" />
        </div>

        {/* Custom Line Charts */}
        <div className="grid grid-cols-1 gap-4">
          <div className="h-40">
            <CustomLineChart variable="DO" />
          </div>
          <div className="h-40">
            <CustomLineChart variable="NH4" />
          </div>
        </div>
      </div>

      {/* BigChart */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4 h-[30rem]">
        <div className="col-span-4 max-h-auto">
        <DatePicker2 />
          <BigChart />
        </div>
        <div className="col-span-2">
          <PieChartComponent />
        </div>
      </div>

      {/* BarChart */}
      <div className="col-span-1 mt-4 h-[30rem]">
        <BarChartComponent />
      </div>

      {/* DynamicChart */}
      <div className="col-span-1 mt-4 h-[30rem]">
        <DynamicChart />
      </div>
      {/* DynamicChart */}
      <div className="col-span-1 mt-4 h-[40rem]">
        <CalendarHeatmap />
      </div>
    </div>
  );
}

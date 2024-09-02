import ModeComponent from "./cards/ModeCrad";
import GaugeChart from "./Gauje";
import LineChartComponent from "./LineCharts";

export default function N_NH4TrainBody() {
  console.log("N_NH4TrainBody rendered");

  return (
    <div>
      <div className="w-full h-full flex flex-row p-2 gap-4">
        <div className="w-full flex flex-row gap-2 align-middle">
          <ModeComponent nombre="DO_SP" />
          <ModeComponent nombre="NNH4_SP" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 w-full h-[40rem] p-0 h-6/6">
        <LineChartComponent />
        <div className="flex flex-row gap-4">
          <GaugeChart variable="NH4" />
          <GaugeChart variable="NH4_FILT" />
          <GaugeChart variable="DO_SP" />
          <GaugeChart variable="DO" />
        </div>
      </div>
    </div>
  );
}

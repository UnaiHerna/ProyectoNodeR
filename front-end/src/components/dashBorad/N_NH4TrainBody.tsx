import ModeComponent from "./cards/ModeCrad";
import LineChartComponent from "./LineCharts";

export default function N_NH4TrainBody() {
  return (
    <div className="w-full h-full overflow-auto gap-3 flex flex-col">
      <div className="flex flex-row gap-4">
        <ModeComponent nombre="DO_SP" />
        <ModeComponent nombre="NNH4_SP" />
      </div>
      <div className="flex flex-row gap-2">
        <LineChartComponent />
      </div>
    </div>
  );
}

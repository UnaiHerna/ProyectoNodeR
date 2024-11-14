import React from "react";
import MapAndChart from "./MapAndChart";
import CylinderAndLine from "./CylinderAndLine";
import NavigationControls from "./NavigationsControl";

interface OnlineSensorsProps {
  lineLabel?: string;
}

const OnlineSensors: React.FC<OnlineSensorsProps> = ({ lineLabel = "Line #1" }) => {
  return (
    <div className="flex w-full">
      <MapAndChart />
      <CylinderAndLine/>
      <NavigationControls lineLabel={lineLabel} />
    </div>
  );
};

export default OnlineSensors;

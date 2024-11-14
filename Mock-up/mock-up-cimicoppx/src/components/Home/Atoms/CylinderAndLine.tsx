import React from "react";
import WWIcon from "./WWIcon";
import TubeIcon from "./TubeIcon";

const CylinderAndLine: React.FC = () => {
  // Define click handlers for each icon
  const handleWWIconClick = () => {
    console.log("WWIcon clicked");
    // Add additional actions here if needed
  };

  const handleTubeIconClick = () => {
    console.log("TubeIcon clicked");
    // Add additional actions here if needed
  };

  return (
    <div className="flex items-center flex-row gap-2 justify-center">
      {/* Clickable WWIcon */}
      <button
        onClick={handleWWIconClick}
        className="w-[1.75rem] bg-[#002060] rounded-full flex items-center justify-center"
      >
        <WWIcon className="text-blue-400" fill="#ffff" />
      </button>

      {/* Clickable TubeIcon */}
      <button
        onClick={handleTubeIconClick}
        className="w-[1.75rem] bg-[#cfcfcf75] rounded-full flex items-center justify-center"
      >
        <TubeIcon className="text-blue-400" fill="#ffff" />
      </button>
    </div>
  );
};

export default CylinderAndLine;

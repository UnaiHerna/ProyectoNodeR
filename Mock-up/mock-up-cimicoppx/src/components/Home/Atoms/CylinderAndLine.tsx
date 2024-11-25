import React from "react";
import WWIcon from "./WWIcon";
import TubeIcon from "./TubeIcon";

interface CylinderAndLineProps {
  handleWWIconClick: () => void;
  handleTubeIconClick: () => void;
}

const CylinderAndLine: React.FC<CylinderAndLineProps> = ({ handleWWIconClick, handleTubeIconClick }) => {
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

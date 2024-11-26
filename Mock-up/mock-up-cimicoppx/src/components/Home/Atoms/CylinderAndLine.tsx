import React from "react";
import WWIcon from "./WWIcon";
import TubeIcon from "./TubeIcon";

interface CylinderAndLineProps {
  handleWWIconClick: () => void;
  handleTubeIconClick: () => void;
  activeDataType: string;
}

const CylinderAndLine: React.FC<CylinderAndLineProps> = ({ handleWWIconClick, handleTubeIconClick, activeDataType }) => {
  return (
    <div className="flex items-center flex-row gap-2 justify-center">
      {/* Clickable WWIcon */}
      <button
        onClick={handleWWIconClick}
        className={`w-[1.75rem] ${activeDataType==="ww"?"bg-[#002060]":"bg-[#cfcfcf75]"} rounded-full flex items-center justify-center`}
      >
        <WWIcon className="text-blue-400" fill="#ffff" />
      </button>

      {/* Clickable TubeIcon */}
      <button
        onClick={handleTubeIconClick}
        className={`w-[1.75rem] ${activeDataType==="tube"?"bg-[#002060]":"bg-[#cfcfcf75]"} rounded-full flex items-center justify-center`}
      >
        <TubeIcon className="text-blue-400" fill="#ffff" />
      </button>
    </div>
  );
};

export default CylinderAndLine;

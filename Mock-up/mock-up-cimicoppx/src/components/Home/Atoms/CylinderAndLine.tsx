import React from "react";
import WWIcon from "./WWIcon";
import TubeIcon from "./TubeIcon";


const CylinderAndLine: React.FC = () => {
  return (
    <div className="flex items-center flex-row gap-2 justify-center">
      <WWIcon className="w-[1.75rem] bg-[#002060] rounded-full text-blue-400" fill="#ffff"/>
      <TubeIcon className="w-[1.75rem] bg-[#cfcfcf75] rounded-full text-blue-400" fill="#ffff"/>
    </div>
  );
};

export default CylinderAndLine;

import React from "react";

interface SensorButtonProps {
  label: string;
  className?: string;
}

const SensorButton: React.FC<SensorButtonProps> = ({ label,className }) => {
  
  return (
    <button className={`px-[0.3rem] text-[#002060] font-raleway text-[11pt] shadow-xl hover:bg-cimico hover:text-white ${className}`}>
      {label}
    </button>
  );
};

export default SensorButton;

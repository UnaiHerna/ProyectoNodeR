import React from "react";

interface SensorButtonProps {
  label: string;
  className?: string;
}

const SensorButton: React.FC<SensorButtonProps> = ({ label,className }) => {
  return (
    <button className={`py-0.5 bg-gray-100 text-[#002060] font-raleway text-[11pt] shadow-xl hover:bg-gray-200 ${className}`}>
      {label}
    </button>
  );
};

export default SensorButton;

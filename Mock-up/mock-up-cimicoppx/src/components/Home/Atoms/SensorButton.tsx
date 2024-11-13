import React from "react";

interface SensorButtonProps {
  label: string;
}

const SensorButton: React.FC<SensorButtonProps> = ({ label }) => {
  return (
    <button className="w-16 py-0.5 px-1 bg-gray-100 text-[#002060] font-raleway text-[11pt] rounded-sm shadow-md hover:bg-gray-200">
      {label}
    </button>
  );
};

export default SensorButton;

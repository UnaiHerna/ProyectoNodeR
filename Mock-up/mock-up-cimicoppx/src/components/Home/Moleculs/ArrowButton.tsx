import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Only import the necessary icons

type ArrowButtonProps = {
  onClick?: () => void;
  direction: "left" | "right";
  className?: string;
};

const ArrowButton: React.FC<ArrowButtonProps> = ({ onClick, direction, className }) => {
  const Icon = direction === "right" ?  FaArrowRight:FaArrowLeft;

  return (
    <section className={`p-[2px] bg-blue-500 rounded-full flex items-center justify-center ${className}`}>
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer border-2 border-white"
      >
        <Icon size={16} />
      </button>
    </section>
  );
};

export default ArrowButton;

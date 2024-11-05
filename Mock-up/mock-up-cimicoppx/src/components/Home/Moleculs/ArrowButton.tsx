import React from "react";
import { FaArrowLeft } from "react-icons/fa";

type ArrowButtonProps = {
  onClick?: () => void;
};

const ArrowButton: React.FC<ArrowButtonProps> = ({ onClick }) => {
  return (
    <section className="p-[2px] bg-blue-500 rounded-full flex items-center justify-center">
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer border-2 border-white"
      >
        <FaArrowLeft size={16} />
      </button>
    </section>
  );
};

export default ArrowButton;

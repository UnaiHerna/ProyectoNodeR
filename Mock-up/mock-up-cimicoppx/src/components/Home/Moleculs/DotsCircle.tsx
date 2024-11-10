import React from 'react';

const DotsCircle: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-[25px] h-[25px] bg-blue-500 rounded-full border-1 border-purple-600">
      <div className="flex space-x-1">
        <span className="w-[3px] h-[3px] bg-white rounded-full"></span>
        <span className="w-[3px] h-[3px] bg-white rounded-full"></span>
        <span className="w-[3px] h-[3px] bg-white rounded-full"></span>
      </div>
    </div>
  );
};

export default DotsCircle;

import React from 'react';

const DotsCircle: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center w-[30px] h-[30px] bg-blue-500 rounded-full"
      style={{ filter: 'drop-shadow(rgba(71, 71, 71,90%) 0px 1px 2px)' }}
    >
      <div className="flex space-x-1">
        <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
        <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
        <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
      </div>
    </div>
  );
};

export default DotsCircle;

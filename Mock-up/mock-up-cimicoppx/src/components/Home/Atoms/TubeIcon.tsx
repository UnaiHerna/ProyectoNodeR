import React from 'react';

interface TubeIconProps {
  className?: string; // Allow external styling via className
  fill?: string; // Allow external fill color
}

const TubeIcon: React.FC<TubeIconProps> = ({ className, fill = "currentColor" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 50"
      className={className} // Apply Tailwind classes or other external styling
    >
      {/* Left rounded end */}
      <rect x="5" y="10" width="20" height="30" rx="10" ry="10" fill={fill} />

      {/* Center rectangle */}
      <rect x="25" y="15" width="50" height="20" fill="#D3D3D3" />

      {/* Right rounded end */}
      <rect x="75" y="10" width="20" height="30" rx="10" ry="10" fill={fill} />
    </svg>
  );
};

export default TubeIcon;

import { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import Avatar_ from '../Atoms/avatar';

const SummaryCard = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  const handleMouseEnter = (topic: string) => {
    setHovered(topic);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 w-64 relative">
      <div className="flex justify-end">
        <GiHamburgerMenu className="text-red-500 text-2xl" />
        <Avatar_/>
      </div>
      
      <div className="flex mt-4">
        <div className="flex flex-col items-center mr-4">
          <GiHamburgerMenu
            className={`text-red-500 text-xl mb-2 transition-transform duration-300 ${
              hovered ? 'translate-x-2' : ''
            }`}
          />
          <div className="border-l-2 border-red-500 h-24"></div>
        </div>

        <div>
          <p
            className="text-red-500 font-bold text-xl"
            onMouseEnter={() => handleMouseEnter('SUMMARY')}
            onMouseLeave={handleMouseLeave}
          >
            SUMMARY
          </p>
          <p
            className="text-gray-500 font-semibold"
            onMouseEnter={() => handleMouseEnter('DATA ANALYTICS')}
            onMouseLeave={handleMouseLeave}
          >
            DATA ANALYTICS
          </p>
          <p
            className="text-gray-500 font-semibold"
            onMouseEnter={() => handleMouseEnter('RECOMMENDER')}
            onMouseLeave={handleMouseLeave}
          >
            RECOMMENDER
          </p>
          <p
            className="text-gray-500 font-semibold"
            onMouseEnter={() => handleMouseEnter('TRAINING')}
            onMouseLeave={handleMouseLeave}
          >
            TRAINING
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

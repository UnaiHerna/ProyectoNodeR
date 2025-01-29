import React, { useState } from 'react';
import './SideNav.css'; // You can keep the same styles in this file

const hierarchy = {
  INF: {
    children: {
      Q: {
        children: {
          toggle: {},
        },
      },
    },
  },
  AE1: {
    children: {
      DO_SNS: {
        children: {
          toggle: {},
        },
      },
      DO_SP: {
        children: {
          toggle: {},
        },
      },
    },
  },
  AE2: {
    children: {
      DO_SNS: {
        children: {
          toggle: {},
        },
      },
      DO_SP: {
        children: {
          toggle: {},
        },
      },
    },
  },
  AE4: {
    children: {
      NH4_SNS: {
        children: {
          toggle: {},
        },
      },
      NH4_SP: {
        children: {
          toggle: {},
        },
      },
    },
  },
};

const SideNav: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const handleButtonClick = (key: string) => {
    console.log(`Linea de : ${key}`);
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const generateMenu = (hierarchy: any) => {
    return Object.keys(hierarchy).map((key) => {
      const item = hierarchy[key];
      const isActive = activeKeys.includes(key);
      return (
        <div key={key}>
          <button
            className={`dropdown-btn w-full ${isActive ? 'active' : ''}`}
            onClick={() => handleButtonClick(key)}
          >
            {key} <i className={`fa fa-angle-up ${isActive ? 'rotate' : ''}`}></i>
          </button>
          <div className={`dropdown-container parent ${isActive ? 'block' : ''}`}>
            {item.children && generateMenu(item.children)}
            {item.toggle && (
              <div className="dropdown-container">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round" onClick={() => toggleSensorStatus(key)}></span>
                </label>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const toggleSensorStatus = (key: string) => {
    console.log(`Toggled sensor status for ${key}`);
  };

  return (
    <div className="w-full h-full">
      <div className="sidenav" id="sidenav">
        {generateMenu(hierarchy)}
      </div>
    </div>
  );
};

export default SideNav;

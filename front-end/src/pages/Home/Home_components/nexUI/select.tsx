import React from 'react';
import { Select, SelectItem, Selection } from '@nextui-org/react';

interface SelectUIProps {
  selectedStatus: string[];
  onChange: (status: string[]) => void;
}

const SelectUI: React.FC<SelectUIProps> = ({ selectedStatus, onChange }) => {
  const handleChange = (keys: Selection) => {
    // Convert the Selection type to an array of strings (if needed)
    // You might need to adjust this based on the actual structure of Selection
    let selectedStatusArray: string[] = [];

    if (Array.isArray(keys)) {
      selectedStatusArray = keys as string[];
    } else if (typeof keys === 'string') {
      selectedStatusArray = [keys];
    } else if (keys && typeof keys === 'object' && keys.keys) {
      selectedStatusArray = Array.from(keys.keys()) as string[];
    }

    onChange(selectedStatusArray);
  };

  return (
    <Select
      placeholder="Select status"
      selectedKeys={selectedStatus}
      onSelectionChange={handleChange}
      multiple
      className='w-40'
    >
      <SelectItem key="online">Online</SelectItem>
      <SelectItem key="offline">Offline</SelectItem>
      <SelectItem key="error">Error</SelectItem>
    </Select>
  );
};

export default SelectUI;

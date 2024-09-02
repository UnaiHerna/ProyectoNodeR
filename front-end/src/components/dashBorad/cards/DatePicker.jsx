import React, { useState, useEffect } from 'react';
import { DateRangePicker } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/react';

// Define the predefined ranges
const predefinedRanges = [
  { label: 'Today', startDate: () => new Date(), endDate: () => new Date() },
  { label: 'Yesterday', startDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }, endDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }},
  { label: 'Last 7 days', startDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }, endDate: () => new Date() },
  { label: 'This week', startDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    return date;
  }, endDate: () => new Date() },
  { label: 'Last 30 days', startDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }, endDate: () => new Date() },
  { label: 'This month', startDate: () => {
    const date = new Date();
    date.setDate(1);
    return date;
  }, endDate: () => new Date() },
  { label: 'Last month', startDate: () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(1);
    return date;
  }, endDate: () => {
    const date = new Date();
    date.setDate(0);
    return date;
  }},
  { label: 'Custom range', startDate: () => null, endDate: () => null },
];

const DatePicker2 = ({ onDateRangeChange }) => {
  const [range, setRange] = useState(null);
  const [selectedRange, setSelectedRange] = useState('Custom range');

  useEffect(() => {
    const selectedOption = predefinedRanges.find(range => range.label === selectedRange);
    if (selectedOption && selectedOption.startDate && selectedOption.endDate) {
      const startDate = selectedOption.startDate();
      const endDate = selectedOption.endDate();
      if (startDate && endDate) {
        onDateRangeChange(formatDate(startDate), formatDate(endDate));
      }
    }
  }, [selectedRange, onDateRangeChange]);

  const handleRangeChange = (range) => {
    setRange(range);
    if (range && range[0] && range[1]) {
      const startDate = convertDateValueToDate(range[0]);
      const endDate = convertDateValueToDate(range[1]);
      onDateRangeChange(formatDate(startDate), formatDate(endDate));
    }
  };

  const handleSelectChange = (value) => {
    setSelectedRange(value);
    if (value !== 'Custom range') {
      const selectedOption = predefinedRanges.find(range => range.label === value);
      if (selectedOption && selectedOption.startDate && selectedOption.endDate) {
        const startDate = selectedOption.startDate() || new Date();
        const endDate = selectedOption.endDate() || new Date();
        onDateRangeChange(formatDate(startDate), formatDate(endDate));
      }
    } else {
      setRange(null); // Show custom range picker if 'Custom range' is selected
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const convertDateValueToDate = (dateValue) => {
    if (dateValue instanceof Date) {
      return dateValue;
    } else if ('toDate' in dateValue) {
      return dateValue.toDate();
    } else {
      return new Date(dateValue.toString()); // Adjust based on your types
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <Select
          value={selectedRange}
          onChange={(value) => handleSelectChange(value)}
          className="max-w-xs"
          placeholder="Select date range"
        >
          {predefinedRanges.map((range) => (
            <SelectItem key={range.label} value={range.label}>
              {range.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      {selectedRange === 'Custom range' && (
        <DateRangePicker
          label="Select Date Range"
          visibleMonths={2}
          value={range}
          onChange={handleRangeChange}
        />
      )}
    </div>
  );
};

export default DatePicker2;

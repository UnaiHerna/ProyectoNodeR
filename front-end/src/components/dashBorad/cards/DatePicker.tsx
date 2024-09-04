import React from "react";
import { DateRangePicker } from "@nextui-org/react";

// Define el tipo de `date` esperado por `formatDate`.
interface Date {
  year: number;
  month: number;
  day: number;
}

// Define el tipo de `dates` esperado por `handleChange`.
interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DatePicker2Props {
  onDateChange: (startDate: string, endDate: string) => void;
}

const DatePicker2: React.FC<DatePicker2Props> = ({ onDateChange }) => {
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const { year, month, day } = date;
    const d = new Date(year, month - 1, day); // Los meses en JS empiezan en 0
    return d.toISOString();
  };

  const handleChange = (dates: DateRange): void => {
    if (dates && dates.start && dates.end) {
      const startDate = formatDate(dates.start);
      const endDate = formatDate(dates.end);
      onDateChange(startDate, endDate); // Notify parent component
    }
  };

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <DateRangePicker 
        label="Stay duration"
        visibleMonths={2}
        onChange={handleChange}
      />
    </div> 
  );
};

export default DatePicker2;

import {DateRangePicker} from "@nextui-org/react";

export default function DatePicker2() {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <DateRangePicker 
        label="Stay duration"
        visibleMonths={2}
      />
    </div> 
  );
}

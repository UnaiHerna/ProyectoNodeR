import React, { useState } from "react";
import { DateRangePicker, Select, SelectItem } from "@nextui-org/react";
import { I18nProvider } from '@react-aria/i18n';

// Define el tipo de `date` esperado por `formatDate`.
interface DateType {
  year: number;
  month: number;
  day: number;
}

// Define el tipo de `dates` esperado por `handleChange`.
interface DateRange {
  start: DateType | null;
  end: DateType | null;
}

interface DatePicker2Props {
  onDateChange: (startDate: string, endDate: string) => void;
}

// Rango de fechas predefinido, colocando "Last 24 hours" primero
const predefinedRanges = [
  { label: "Last 24 hours", key: "last24hours" },  // Nueva opción en primer lugar
  { label: "Last 7 days", key: "last7days" },
  { label: "Last 30 days", key: "last30days" },
  { label: "This month", key: "thismonth" },
  { label: "Last month", key: "lastmonth" },
  { label: "Custom range", key: "customrange" },
];

// Mapeo de rangos de fechas con un índice
const dateRanges: {
  [key: string]: { start: Date; end: Date } | null;
} = {
  last24hours: {  // Nuevo rango para las últimas 24 horas
    start: new Date(Date.now() - 86400000),
    end: new Date(),
  },
  last7days: {
    start: new Date(Date.now() - 7 * 86400000),
    end: new Date(),
  },
  last30days: {
    start: new Date(Date.now() - 30 * 86400000),
    end: new Date(),
  },
  thismonth: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  },
  lastmonth: {
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
  },
  customrange: null,
};

const DatePicker2: React.FC<DatePicker2Props> = ({ onDateChange }) => {
  const [selectedRange, setSelectedRange] = useState<string>("last7days");

  // Función para formatear la fecha al formato requerido
  const formatDate = (date: DateType | null): string => {
    if (!date) return '';
    const { year, month, day } = date;
    const d = new Date(year, month - 1, day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`; // Formato YYYY-MM-DDTHH:mm:ss
  };

  const handleChange = (dates: DateRange): void => {
    // Use the 'dates' parameter directly
    if (dates.start && dates.end) {
      const startDate = formatDate(dates.start);
      const endDate = formatDate(dates.end);
      onDateChange(startDate, endDate); // Notifica al componente padre
    } else if (selectedRange !== "customrange") {
      const customDates = dateRanges[selectedRange];
      if (customDates) {
        const startDate = formatDate({ 
          year: customDates.start.getFullYear(),
          month: customDates.start.getMonth() + 1, // Los meses en JS empiezan en 0
          day: customDates.start.getDate(),
        });
        const endDate = formatDate({
          year: customDates.end.getFullYear(),
          month: customDates.end.getMonth() + 1,
          day: customDates.end.getDate(),
        });
        onDateChange(startDate, endDate); // Notifica al componente padre
      }
    }
  };

  return (
    <I18nProvider locale="es-ES">
      <div className="flex w-full flex-nowrap md:flex-nowrap gap-4">
        <Select
          label="Select Date Range"
          placeholder="Choose a range"
          className="max-w-xs"
          selectedKeys={new Set([selectedRange])} // Usar Set para manejar selección individual
          onSelectionChange={(key) => {
            const selectedKey = Array.from(key as Set<string>)[0]; // Obtener el primer elemento del Set
            console.log(`Selected range: ${selectedKey}`); // Log de la selección
            setSelectedRange(selectedKey);

            // Manejar el rango seleccionado inmediatamente
            const customDates = dateRanges[selectedKey];
            if (customDates) {
              const startDate = formatDate({ 
                year: customDates.start.getFullYear(),
                month: customDates.start.getMonth() + 1,
                day: customDates.start.getDate(),
              });
              const endDate = formatDate({
                year: customDates.end.getFullYear(),
                month: customDates.end.getMonth() + 1,
                day: customDates.end.getDate(),
              });
              onDateChange(startDate, endDate); // Notifica al componente padre
            } else {
              handleChange({ start: null, end: null }); // Llama a handleChange para manejar el rango seleccionado
            }
          }} 
        >
          {predefinedRanges.map((range) => (
            <SelectItem key={range.key} value={range.key}>
              {range.label}
            </SelectItem>
          ))}
        </Select>

        {/* Renderiza el DateRangePicker solo si se selecciona "Custom range" */}
        {selectedRange === "customrange" && (
          <DateRangePicker 
            label="Rango de Fechas"
            visibleMonths={2}
            description="DD/MM/YYYY"
            onChange={handleChange}
          />
        )}
      </div> 
    </I18nProvider>
  );
};

export default DatePicker2;

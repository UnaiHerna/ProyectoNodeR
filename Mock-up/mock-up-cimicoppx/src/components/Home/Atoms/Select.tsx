import React from "react";
import { Select, SelectItem } from "@nextui-org/select";

// Define las props del componente Select_
interface SelectOption {
  key: string;  // Llave única para cada opción
  label: string; // Texto a mostrar para cada opción
}

interface SelectProps {
  className?: string;        // Clase adicional para el select
  defaultSelectedKeys?: string[]; // Claves de selección predeterminadas
  label: string;             // Etiqueta del select
  placeholder: string;       // Placeholder del select
  startContent?: React.ReactNode; // Contenido al inicio del select
  options: SelectOption[];   // Opciones que se pasarán al select
}

// Componente Select_
export function Select_(props: SelectProps) {
  const { className, defaultSelectedKeys, label, placeholder, startContent, options } = props;

  return (
    <Select
      className={className}
      defaultSelectedKeys={defaultSelectedKeys}
      label={label}
      placeholder={placeholder}
      startContent={startContent}
    >
      {options.map((option) => (
        <SelectItem key={option.key}>{option.label}</SelectItem>
      ))}
    </Select>
  );
}
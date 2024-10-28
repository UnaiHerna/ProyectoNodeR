import { Avatar as NextUIAvatar } from "@nextui-org/avatar";
import { CSSProperties, ReactNode } from "react";

interface AvatarProps {
    src?: string;                    // URL de la imagen del avatar
    name?: string;                   // Nombre para mostrar las iniciales
    size?: "sm" | "md" | "lg";       // Tamaño del avatar
    color?: "primary" | "secondary" | "success" | "warning" | "default" | "danger"; // Colores permitidos
    textColor?: string;              // Color del texto/iniciales
    isBordered?: boolean;            // Si el avatar tiene borde
    zoomed?: boolean;                // Si se permite hacer zoom al pasar el mouse
    icon?: ReactNode;                // Icono dentro del avatar en lugar de una imagen/nombre
    css?: CSSProperties;             // Estilos personalizados de CSS
    fallback?: string;               // Imagen alternativa en caso de error de carga de `src`
    showFallback?: boolean;          // Muestra una imagen o estilo de respaldo en caso de fallo de carga
    className?: string;              // Clase adicional para el avatar
}

export default function Avatar_(props: AvatarProps) {
  const { className, ...rest } = props; // Desestructuramos className de las props
  return (
    <div className={`flex gap-4 items-center ${className}`}>
      <NextUIAvatar {...rest} className={className} />
    </div>
  );
}

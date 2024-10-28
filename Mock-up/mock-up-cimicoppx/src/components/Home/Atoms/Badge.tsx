import { Badge as NextUIBadge } from "@nextui-org/badge"; // Asegúrate de que este paquete está instalado
import { CSSProperties, ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;             // Contenido del badge (número, texto, etc.)
    isInvisible?: boolean;           // Si el badge es invisible
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"; // Colores permitidos
    shape?: "circle" | "rectangle";  // Cambié "rect" a "rectangle" para que coincida con el tipo requerido
    css?: CSSProperties;              // Estilos personalizados de CSS
    className?: string;               // Clase adicional para el badge
}

export default function Badge_(props: BadgeProps) {
    const { className, children, ...rest } = props; // Desestructuramos className y children de las props
    return (
        <div className={`flex items-center ${className}`}>
            <NextUIBadge {...rest}>
                {children}  {/* Usamos children en lugar de content */}
            </NextUIBadge>
        </div>
    );
}

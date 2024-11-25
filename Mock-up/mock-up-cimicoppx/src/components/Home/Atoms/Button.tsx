import { Button as NextUIButton, ButtonProps } from "@nextui-org/button"; // Asegúrate de que este paquete está instalado
import {  ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
    className?: string;         // Clase adicional para el botón
    children: ReactNode;        // Contenido del botón
}

export default function Button_(props: CustomButtonProps) {
    const { className, children, ...rest } = props; // Desestructuramos className y children de las props
    return (
        <NextUIButton {...rest} className={className}>
            {children}  {/* Usamos children para mostrar el contenido del botón */}
        </NextUIButton>
    );
}

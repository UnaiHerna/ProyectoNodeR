import React from "react";
import { Card as NextUICard, CardProps as NextUICardProps, CardHeader, CardBody, CardFooter } from "@nextui-org/card"; // Asegúrate de que este paquete está instalado
import { ReactNode } from "react";

interface CustomCardProps extends NextUICardProps {
    className?: string;       // Clase adicional para la tarjeta
    children: ReactNode;      // Contenido de la tarjeta
}

export function Card_(props: CustomCardProps) {
    const { className, children, ...rest } = props; // Desestructuramos className y children de las props
    return (
        <NextUICard {...rest} className={className}>
            {children}  {/* Usamos children para mostrar el contenido de la tarjeta */}
        </NextUICard>
    );
}

export function CardHeader_(props: React.ComponentProps<typeof CardHeader>) {
    return <CardHeader {...props} />;
}

export function CardBody_(props: React.ComponentProps<typeof CardBody>) {
    return <CardBody {...props} />;
}

export function CardFooter_(props: React.ComponentProps<typeof CardFooter>) {
    return <CardFooter {...props} />;
}

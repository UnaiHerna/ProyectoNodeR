#!/bin/bash

# Variables de puertos
PORT1=8000
PORT2=8001
PORT3=8002

# Función para detener la aplicación en un puerto específico
stop_app() {
    PORT=$1
    echo "Deteniendo la aplicación en el puerto $PORT..."
    PID=$(lsof -t -i:$PORT)
    if [ -n "$PID" ]; then
        kill -9 $PID
        echo "Aplicación en el puerto $PORT detenida."
    else
        echo "No hay aplicación corriendo en el puerto $PORT."
    fi
}

# Detener las aplicaciones en los puertos especificados
stop_app $PORT1
stop_app $PORT2
stop_app $PORT3

# Detener Redis
echo "Deteniendo Redis..."
REDIS_PID=$(pgrep redis-server)
if [ -n "$REDIS_PID" ]; then
    kill -9 $REDIS_PID
    echo "Redis detenido."
else
    echo "Redis no está corriendo."
fi

echo "Todos los servidores han sido detenidos."

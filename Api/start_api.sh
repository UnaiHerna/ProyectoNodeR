#!/bin/bash

# Iniciar Redis en segundo plano con nohup
echo "Iniciando Redis con nohup"
nohup sudo redis-server /etc/redis.conf > redis.log 2>&1 &

# Variables de puertos
PORT1=8000
PORT2=8001
PORT3=8002

# Comando para iniciar la aplicación en diferentes puertos
echo "Iniciando la aplicación en el puerto $PORT1"
PORT=$PORT1 node Api.js &

echo "Iniciando la aplicación en el puerto $PORT2"
PORT=$PORT2 node Api.js &

echo "Iniciando la aplicación en el puerto $PORT3"
PORT=$PORT3 node Api.js &

echo "Aplicaciones iniciadas en puertos $PORT1, $PORT2 y $PORT3"

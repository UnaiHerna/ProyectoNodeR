const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const consignaRoutes = require('./routes/consigna');
const senalRoutes = require('./routes/senal'); 
const sensorRoutes = require('./routes/sensor');
const forecastRoutes = require('./routes/forecast'); 
const userRoutes = require('./security/jwt');
const externalRoutes = require('./routes/external');

require('dotenv').config();
console.log('Clave API:', process.env.OPENAI_API_KEY); // Esto debería imprimir la clave

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Middleware para manejar datos URL-encoded
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*', // Permitir todas las orígenes
    credentials: true, // Permitir cookies o autorizaciones
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Permitir todos los métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir todos los headers
}));

app.use('/datos/consigna', consignaRoutes);
app.use('/datos/senal', senalRoutes); 
app.use('/datos/sensorvacio', sensorRoutes); 
app.use('/datos/sensor', sensorRoutes);
app.use('/user', userRoutes);
app.use('/forecast', forecastRoutes);
app.use('/', externalRoutes);

// Sirve la aplicación React desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, '../front-end/dist')));

// Redirige todas las rutas al index.html de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/dist', 'index.html'));
});

// Configuración del puerto
const desiredPort = process.env.PORT ?? 8000;
server.listen(desiredPort, () => {
    console.log(`Server listening on port http://localhost:${desiredPort}`);
});
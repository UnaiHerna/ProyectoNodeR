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
const swaggerUi = require('swagger-ui-express');
const specs = require('./docs/swagger');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

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


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/datos/consigna', consignaRoutes);
app.use('/datos/senal', senalRoutes); 
app.use('/datos/sensor', sensorRoutes);
app.use('/user', userRoutes);
app.use('/forecast', forecastRoutes);
app.use('/', externalRoutes);

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
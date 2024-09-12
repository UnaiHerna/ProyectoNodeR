const express = require('express');
const path = require('path');
const executeRScript = require('./utils/executeRScript');
const connection = require('./db/database'); // Importa la conexión a la base de datos
const cors = require('cors');
const consignaRoutes = require('./routes/consigna');
const senalRoutes = require('./routes/senal'); 
const sensorRoutes = require('./routes/sensor'); 

const app = express();

app.use(cors({
    origin: '*', // Permitir todas las orígenes
    credentials: true, // Permitir cookies o autorizaciones
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Permitir todos los métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir todos los headers
}));

app.use('/datos/consigna', consignaRoutes);
app.use('/datos/senal', senalRoutes); 
app.use('/datos/sensorvacio', sensorRoutes); 


app.get('/heatmap', (req, res) => { //pese a no tener req, hay que ponerlo o no funciona
    connection.query('SELECT * FROM heatmap_sergio', (err, rows, fields) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(rows);
        }
    });
});

app.get('/r', async (req, res) => {
    const { mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp } = req.query;

    // Validar que todos los parámetros requeridos están presentes
    if (!mltss_sp || !so_aer_sp || !q_int || !tss_eff_sp || !temp) {
        return res.status(400).send('Faltan parámetros requeridos');
    }

    try {
        const result = await executeRScript(mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando el script R:', error.message, error.stack);
        res.status(500).send('Error interno del servidor');
    }
});

// Sirve la aplicación React desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, '../front-end/dist')));

// Redirige todas las rutas al index.html de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/dist', 'index.html'));
});

// Configuración del puerto
const desiredPort = process.env.PORT ?? 8000;
app.listen(desiredPort, () => {
    console.log(`Server listening on port http://localhost:${desiredPort}`);
});
const express = require('express');
const executeRScript = require('./utils/executeRScript');
const { readDatosSensorByVariable } = require('./utils/readDatos'); // Asegúrate de que la ruta sea correcta para importar la función
const connection = require('./db/database'); // Importa la conexión a la base de datos
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*', // Permitir todas las orígenes
    credentials: true, // Permitir cookies o autorizaciones
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Permitir todos los métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir todos los headers
}));

const desiredPort = process.env.PORT ?? 8000;

app.get('/heatmap', (res) => {
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
    try {
        const result = await executeRScript(mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error executing R script:', error);
        res.status(500).send('Internal server error');
    }
});

// Nueva ruta para /datos/sensorvacio/
app.get('/datos/sensorvacio', async (req, res) => {
    const { variable, equipo, start_date, end_date, tipo } = req.query;

    // Verificar que los parámetros requeridos estén presentes
    if (!variable || !equipo || !start_date || !end_date) {
        return res.status(400).send('Faltan parámetros requeridos');
    }
    try {
        // Llama a la función para leer los datos con los parámetros proporcionados
        const data = await readDatosSensorByVariable(variable, equipo, start_date, end_date, tipo);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los datos del sensor:', error.message);
        res.status(500).send('Error al obtener los datos del sensor.');
    }
});

app.listen(desiredPort, () => {
    console.log(`Server listening on port http://localhost:${desiredPort}`);
});

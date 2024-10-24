const express = require('express');
const path = require('path');
const executeRScript = require('./utils/executeRScript');
const connection = require('./db/database'); // Importa la conexión a la base de datos
const cors = require('cors');
const consignaRoutes = require('./routes/consigna');
const senalRoutes = require('./routes/senal'); 
const sensorRoutes = require('./routes/sensor'); 
const userRoutes = require('./security/jwt');
const executeJava = require('./utils/executeJava');
const executePython = require('./utils/executePython');
const { body, query, validationResult } = require('express-validator');

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

app.get('/r', [
    query('mltss_sp').isNumeric().withMessage('mltss_sp debe ser numérico'),
    query('so_aer_sp').isNumeric().withMessage('so_aer_sp debe ser numérico'),
    query('q_int').isNumeric().withMessage('q_int debe ser numérico'),
    query('tss_eff_sp').isNumeric().withMessage('tss_eff_sp debe ser numérico'),
    query('temp').isNumeric().withMessage('temp debe ser numérico')
], async (req, res) => {

    // Verificar los errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp } = req.query;

    try {
        const result = await executeRScript(mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando el script R:', error.message, error.stack);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/java', async (req, res) => {
    const { age, race, psa, gleason } = req.query;

    // Validar que todos los parámetros requeridos están presentes
    if (!age || !race || !psa || !gleason) {
        return res.status(400).send('Faltan parámetros requeridos');
    }

    try {
        const result = await executeJava(age, race, psa, gleason);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando el script Java:', error.message, error.stack);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/python', async (req, res) => {
    const { num1, num2 } = req.query;

    // Validar que todos los parámetros requeridos están presentes
    if (!num1 || !num2) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    try {
        // Espera el resultado de executePython
        const result = await executePython(num1, num2);
        // Envía el resultado en formato JSON
        res.status(200).json(result);
    } catch (error) {
        console.error('Error ejecutando el script Python:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
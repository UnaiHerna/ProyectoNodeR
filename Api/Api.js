const express = require('express')
const { query, validationResult } = require('express-validator');
const path = require('path');
const connection = require('./db/database'); // Importa la conexión a la base de datos
const cors = require('cors');
const consignaRoutes = require('./routes/consigna');
const senalRoutes = require('./routes/senal'); 
const sensorRoutes = require('./routes/sensor'); 
const userRoutes = require('./security/jwt');
const executeRScript = require('./utils/executeRScript');
const executeJava = require('./utils/executeJava');
const executePython = require('./utils/executePython');
const { ConectionError, ParameterError, InternalError, UnauthenticatedError, UnauthorizedError, ValidationError } = require('./utils/errors');

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

app.get('/java', [
    query('age').isNumeric().withMessage('age debe ser numérico'),
    query('race').isNumeric().withMessage('race debe ser numérico'),
    query('psa').isNumeric().withMessage('psa debe ser numérico'),
    query('gleason').isNumeric().withMessage('gleason debe ser numérico')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { age, race, psa, gleason } = req.query;

    try {
        const result = await executeJava(age, race, psa, gleason);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando el script Java:', error.message, error.stack);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/python', [
    query('num1').isNumeric().withMessage('num1 debe ser numérico'),
    query('num2').isNumeric().withMessage('num2 debe ser numérico')
],async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { num1, num2 } = req.query;

    try {
        const result = await executePython(num1, num2);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error ejecutando el script Python:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Middleware para manejar errores
app.use((err, req, res, next) => {

    if(err instanceof ConectionError){
        console.error('Error: ', err.message); // Administrador ve el error completo
        return res.status(503).json({ error: 'Service temporarily unavailable' }); // Usuario ve un mensaje genérico
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
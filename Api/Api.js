const express = require('express');
const logger = require('morgan');
const path = require('path');
const executeRScript = require('./utils/executeRScript');
const connection = require('./db/database'); // Importa la conexión a la base de datos
const cors = require('cors');
const consignaRoutes = require('./routes/consigna');
const senalRoutes = require('./routes/senal'); 
const sensorRoutes = require('./routes/sensor'); 
const userRoutes = require('./security/jwt');
const swaggerRoutes = require('./routes/swagger');
const executeJava = require('./utils/executeJava');
const executePython = require('./utils/executePython');
const { body, query, validationResult } = require('express-validator');
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const { Configuration, OpenAIApi } = require('openai');
const prompts = require('./utils/prompts.js');
const fetch = require('node-fetch');

require('dotenv').config();
console.log('Clave API:', process.env.OPENAI_API_KEY); // Esto debería imprimir la clave

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user has connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use(logger('dev'));

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
app.use(swaggerRoutes);


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

app.get('/clima', async (req, res) => {
    const aemetBaseUrl = 'https://opendata.aemet.es/opendata/api';
    const apiKey = process.env.AEMET_API_KEY;
    const municipioId = '41091'; // Código de municipio para Ranilla

    if (!apiKey) {
        return res.status(500).json({ error: 'Falta la clave de API de AEMET en las variables de entorno' });
    }

    try {
        // Obtener la URL con los datos de predicción
        const response = await fetch(`${aemetBaseUrl}/prediccion/especifica/municipio/diaria/${municipioId}/?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Error al obtener la URL de predicción: ${response.statusText}`);
        }

        const data = await response.json();

        // Obtener los datos reales desde la URL proporcionada
        const forecastResponse = await fetch(data.datos);
        if (!forecastResponse.ok) {
            throw new Error(`Error al obtener los datos de predicción: ${forecastResponse.statusText}`);
        }

        const forecastData = await forecastResponse.json();
        console.log('Datos de predicción:', forecastData);

        // Procesar los datos correctamente
        const forecastForSevenDays = forecastData[0]?.prediccion?.dia.map(day => ({
            fecha: day.fecha,
            estadoCielo: day.estadoCielo[0]?.descripcion || 'Desconocido',
            temperaturaMaxima: day.temperatura?.maxima || 'No disponible',
            temperaturaMinima: day.temperatura?.minima || 'No disponible',
            probabilidadPrecipitacion: day.probPrecipitacion[0]?.value || 0,
        }));

        res.status(200).json(forecastForSevenDays);
    } catch (error) {
        console.error('Error obteniendo el clima:', error.message);
        res.status(500).json({ error: 'Error interno al procesar la solicitud', details: error.message });
    }
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/chat-prueba', 'index.html'));
});

app.get('/ia', async (req, res) => {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: 'El parámetro "text" es requerido' });
    }
    
    const prompt = prompts.sqlConversion.replace('${text}', text);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                prompt: prompt,
                max_tokens: 200, 
                temperature: 0.3,
            }),
        });

        // Verifica que la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la respuesta de OpenAI: ${response.statusText}`);
        }

        const data = await response.json();

        // Agregar un log para ver la respuesta completa
        console.log('Respuesta de OpenAI:', data);

        // Verifica si 'choices' y 'choices[0]' están presentes en la respuesta
        if (!data.choices || data.choices.length === 0 || !data.choices[0].text) {
            return res.status(500).json({ error: 'No se pudo generar una consulta SQL válida', details: data });
        }

        const sqlQuery = data.choices[0].text.trim();

        console.log('Consulta SQL generada:', sqlQuery);

        res.status(200).json({ sql: sqlQuery });
    } catch (error) {
        console.error('Error generando consulta SQL:', error.message);
        res.status(500).json({ error: 'Error interno al procesar la solicitud', details: error.message });
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
server.listen(desiredPort, () => {
    console.log(`Server listening on port http://localhost:${desiredPort}`);
});
const express = require('express');
const router = express.Router();
const redisClient = require('../db/redisClient');
const executeJava = require('../utils/executeJava');
const executePython = require('../utils/executePython');
const executeRScript = require('../utils/executeRScript');
const connection = require('../db/database'); // Importa la conexión a la base de datos
const { body, query, validationResult } = require('express-validator');

router.get('/heatmap', (req, res) => { //pese a no tener req, hay que ponerlo o no funciona

    connection.query('SELECT * FROM heatmap_sergio', (err, rows, fields) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(rows);
        }
    });
});

router.get('/r', [
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

    const cacheKey = `r_${mltss_sp}_${so_aer_sp}_${q_int}_${tss_eff_sp}_${temp}`;
        
    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);

        if (cachedData) {
            return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
        }
        const result = await executeRScript(mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp);

        await redisClient.setCachedResponse(cacheKey, result);

        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando el script R:', error.message, error.stack);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/java', async (req, res) => {
    const { age, race, psa, gleason } = req.query;

    // Validar que todos los parámetros requeridos están presentes
    if (!age || !race || !psa || !gleason) {
        return res.status(400).send('Faltan parámetros requeridos');
    }

    const cacheKey = `java_${age}_${race}_${psa}_${gleason}`;

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);

        if (cachedData) {
            return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
        }
        const result = await executeJava(age, race, psa, gleason);

        await redisClient.setCachedResponse(cacheKey, result);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando el script Java:', error.message, error.stack);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/python', async (req, res) => {
    const { num1, num2 } = req.query;

    // Validar que todos los parámetros requeridos están presentes
    if (!num1 || !num2) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const cacheKey = `python_${num1}_${num2}`;

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);

        if (cachedData) {
            return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
        }

        // Espera el resultado de executePython
        const result = await executePython(num1, num2);

        // Guarda el resultado en la caché
        await redisClient.setCachedResponse(cacheKey, result);

        // Envía el resultado en formato JSON
        res.status(200).json(result);
    } catch (error) {
        console.error('Error ejecutando el script Python:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
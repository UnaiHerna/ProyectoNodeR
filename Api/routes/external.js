const express = require('express');
const router = express.Router();
const redisClient = require('../db/redisClient');
const executeJava = require('../utils/executeJava');
const executePython = require('../utils/executePython');
const executeRScript = require('../utils/executeRScript');
const connection = require('../db/database'); // Importa la conexión a la base de datos
const { body, query, validationResult } = require('express-validator');

/**
 * @swagger
 * /heatmap:
 *   get:
 *     summary: Obtiene datos del heatmap
 *     description: Recupera todos los datos de la tabla heatmap_sergio.
 *     tags:
 *       - External
 *     responses:
 *       200:
 *         description: Datos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /r:
 *   get:
 *     summary: Ejecuta un script R con parámetros proporcionados
 *     description: Ejecuta un script R con los parámetros proporcionados y devuelve el resultado.
 *     tags:
 *       - External
 *     parameters:
 *       - in: query
 *         name: mltss_sp
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro mltss_sp
 *       - in: query
 *         name: so_aer_sp
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro so_aer_sp
 *       - in: query
 *         name: q_int
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro q_int
 *       - in: query
 *         name: tss_eff_sp
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro tss_eff_sp
 *       - in: query
 *         name: temp
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro temp
 *     responses:
 *       200:
 *         description: Resultado del script R
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
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

        
    try {
        const result = await executeRScript(mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp);

        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando el script R:', error.message, error.stack);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * @swagger
 * /java:
 *   get:
 *     summary: Ejecuta un script Java con parámetros proporcionados
 *     description: Ejecuta un script Java con los parámetros proporcionados y devuelve el resultado.
 *     tags:
 *       - External
 *     parameters:
 *       - in: query
 *         name: age
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro age
 *       - in: query
 *         name: race
 *         schema:
 *           type: string
 *         required: true
 *         description: Parámetro race
 *       - in: query
 *         name: psa
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro psa
 *       - in: query
 *         name: gleason
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro gleason
 *     responses:
 *       200:
 *         description: Resultado del script Java
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Faltan parámetros requeridos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/java', async (req, res) => {
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

/**
 * @swagger
 * /python:
 *   get:
 *     summary: Ejecuta un randomizador Python con parámetros proporcionados
 *     description: Elige el num1 siendo el parámetro inicial y el num2 siendo el parámetro final y devuelve el resultado.
 *     tags:
 *       - External
 *     parameters:
 *       - in: query
 *         name: num1
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro num1
 *       - in: query
 *         name: num2
 *         schema:
 *           type: number
 *         required: true
 *         description: Parámetro num2
 *     responses:
 *       200:
 *         description: Resultado del script Python
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.get('/python', async (req, res) => {
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

module.exports = router;
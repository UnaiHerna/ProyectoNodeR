const express = require('express');
const router = express.Router();
const knex = require('../db/knex'); // Asegúrate de que este es el archivo de configuración de tu Knex
const redisClient = require('../db/redisClient'); // Manejador de cache Redis
const moment = require('moment');

/**
 * @swagger
 * /datos/senal:
 *   get:
 *     summary: Obtiene datos de señales
 *     description: Obtiene datos de una o múltiples señales por nombre(s) con fechas opcionales.
 *     tags:
 *       - Señales
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre de la señal
 *       - in: query
 *         name: nombres
 *         schema:
 *           type: string
 *         description: Nombres de las señales separados por comas
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de inicio en formato ISO 8601
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de fin en formato ISO 8601
 *     responses:
 *       200:
 *         description: Datos de las señales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       format: date-time
 *                     value:
 *                       type: number
 *                     señal:
 *                       type: string
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor
 */

// Función para leer los datos de una señal por nombre
async function readSeñalDatosByNombre(db, señal, startDate = null, endDate = null) {
    const cacheKey = `datos_señal_${señal}_${startDate}_${endDate}`;
    const cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let query = db('señal_datos')
        .select('señal_datos.timestamp as time', 'señal_datos.valor as value', 'señal.nombre as señal')
        .join('señal', 'señal_datos.id_señal', '=', 'señal.id')
        .where('señal.nombre', señal)
        .orderBy('señal_datos.timestamp', 'asc');

    if (startDate) {
        query = query.where('señal_datos.timestamp', '>=', startDate);
    }
    if (endDate) {
        query = query.where('señal_datos.timestamp', '<=', endDate);
    }

    const resultados = await query;
    const datos = resultados.map(r => ({
        time: moment(r.time).format('YYYY-MM-DDTHH:mm:ss'),
        value: r.value,
        señal: r.señal
    }));

    await redisClient.setCachedResponse(cacheKey, datos);
    return datos;
}

// Función para leer los datos de múltiples señales por nombres separados por comas
async function readSeñalMultipleByNombre(db, nombres, startDate = null, endDate = null) {
    const señalList = nombres.split(',');
    const allData = {};

    for (const señal of señalList) {
        allData[señal] = await readSeñalDatosByNombre(db, señal.trim(), startDate, endDate);
    }

    return allData;
}

// Ruta para obtener datos condicionales de señales
router.get('/', async (req, res) => {
    const { nombre, nombres, start_date: startDate, end_date: endDate } = req.query;

    try {
        const db = knex; // Utilizando Knex configurado para conectar con la base de datos

        if (nombre && !nombres) {
            const data = await readSeñalDatosByNombre(db, nombre, startDate, endDate);
            res.status(200).json(data);
        } else if (nombres && !nombre) {
            const data = await readSeñalMultipleByNombre(db, nombres, startDate, endDate);
            res.status(200).json(data);
        } else {
            // Manejo de solicitudes cuando no se proporcionan los parámetros esperados
            res.status(400).send('Debe proporcionar los datos de forma correcta.');
        }
    } catch (error) {
        console.error('Error interno del servidor:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

module.exports = router;

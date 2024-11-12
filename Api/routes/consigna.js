const express = require('express');
const router = express.Router();
const knex = require('../db/knex'); // Importa la configuración de Knex
const redisClient = require('../db/redisClient');
const moment = require('moment-timezone');

/**
 * @swagger
 * components:
 *   schemas:
 *     DatosConsigna:
 *       type: object
 *       properties:
 *         time:
 *           type: string
 *           description: El timestamp de los datos
 *         value:
 *           type: number
 *           description: El valor de la consigna
 *         mode:
 *           type: string
 *           description: El modo (Manual o Automático)
 *         consigna:
 *           type: string
 *           description: El nombre de la consigna
 */
async function readDatosConsignaByNombre(consigna, startDate, endDate) {
    const cacheKey = `datos_consigna_${consigna}_${startDate}_${endDate}`;
    let cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let query = knex('valores_consigna')
        .select('consigna.nombre as consigna', 'valores_consigna.valor as value', 'valores_consigna.timestamp as time', 'valores_consigna.mode as mode')
        .join('consigna', 'valores_consigna.id_consigna', '=', 'consigna.id')
        .where('consigna.nombre', consigna)
        .orderBy('valores_consigna.timestamp', 'asc');

    if (startDate) {
        query = query.andWhere('valores_consigna.timestamp', '>=', startDate);
    }
    if (endDate) {
        query = query.andWhere('valores_consigna.timestamp', '<=', endDate);
    }

    const results = await query;
    const datos = results.map(r => ({
        time: moment(r.time).format('YYYY-MM-DDTHH:mm:ss'),
        value: r.value,
        mode: r.mode,
        consigna: r.consigna
    }));

    redisClient.setCachedResponse(cacheKey, datos);
    return datos;
}

/**
 * Lee los datos de consigna por equipo desde la base de datos o la caché de Redis
 * 
 * @param {string} equipo - Nombre del equipo para filtrar
 * @param {string} startDate - Fecha de inicio para filtrar
 * @param {string} endDate - Fecha de fin para filtrar
 * @returns {Promise<Array>} - Una lista de datos de consigna
 */
async function readDatosConsignaByEquipo(equipo, startDate, endDate) {
    const cacheKey = `datos_consigna_${equipo}_${startDate}_${endDate}`;
    let cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let query = knex('valores_consigna')
        .select('consigna.nombre as consigna', 'valores_consigna.valor as value', 'valores_consigna.timestamp as time', 'valores_consigna.mode as mode')
        .join('consigna', 'valores_consigna.id_consigna', '=', 'consigna.id')
        .join('equipo', 'consigna.id_equipo', '=', 'equipo.id')
        .where('equipo.nombre', equipo)
        .orderBy('valores_consigna.timestamp', 'asc');

    if (startDate) {
        query = query.andWhere('valores_consigna.timestamp', '>=', startDate);
    }
    if (endDate) {
        query = query.andWhere('valores_consigna.timestamp', '<=', endDate);
    }

    const results = await query;
    const datos = results.map(r => ({
        time: moment(r.time).format('YYYY-MM-DDTHH:mm:ss'),
        value: r.value,
        mode: r.mode,
        consigna: r.consigna
    }));

    redisClient.setCachedResponse(cacheKey, datos);
    return datos;
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene los datos de consigna filtrados por nombre o equipo
 *     description: Filtra los datos de consigna según los parámetros proporcionados (nombre o equipo).
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre de la consigna
 *       - in: query
 *         name: equipo
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre del equipo
 *       - in: query
 *         name: start_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de inicio del rango
 *       - in: query
 *         name: end_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de fin del rango
 *     responses:
 *       200:
 *         description: Lista de datos de consigna filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DatosConsigna'
 *       400:
 *         description: Parámetros incorrectos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
    const { nombre, nombres, equipo, equipos, start_date, end_date } = req.query;

    if (nombre && !equipo && !nombres && !equipos) {
        try {
            const data = await readDatosConsignaByNombre(nombre, start_date, end_date);
            res.json(data);
        } catch (error) {
            res.status(500).send('Error interno del servidor');
        }
    } else if (equipo && !nombre && !nombres && !equipos) {
        try {
            const data = await readDatosConsignaByEquipo(equipo, start_date, end_date);
            res.json(data);
        } catch (error) {
            res.status(500).send('Error interno del servidor');
        }
    } else if (nombres && !equipo && !nombre && !equipos) {
        // Implementar función similar para múltiples consignas
    } else if (equipos && !equipo && !nombre && !nombres) {
        // Implementar función similar para múltiples equipos
    } else {
        res.status(400).send('Debe proporcionar los datos de forma correcta.');
    }
});

/**
 * @swagger
 * /porcentaje:
 *   get:
 *     summary: Obtiene el porcentaje de modo de una consigna
 *     description: Calcula el porcentaje de modos (Automático y Manual) para una consigna dentro de un rango de fechas
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la consigna
 *       - in: query
 *         name: start_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de inicio del rango
 *       - in: query
 *         name: end_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de fin del rango
 *     responses:
 *       200:
 *         description: Porcentaje de modos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consigna:
 *                   type: string
 *                 Automatico:
 *                   type: string
 *                 Manual:
 *                   type: string
 *       400:
 *         description: Parámetros incorrectos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/porcentaje', async (req, res) => {
    const { nombre, start_date, end_date } = req.query;
    const cacheKey = `porcentaje_${nombre}_${start_date}_${end_date}`;

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        let query = knex('valores_consigna')
            .count('valores_consigna.id_consigna as count')
            .select('valores_consigna.mode')
            .join('consigna', 'valores_consigna.id_consigna', '=', 'consigna.id')
            .where('consigna.nombre', nombre)
            .groupBy('valores_consigna.mode');

        if (start_date) {
            query = query.andWhere('valores_consigna.timestamp', '>=', start_date);
        }
        if (end_date) {
            query = query.andWhere('valores_consigna.timestamp', '<=', end_date);
        }

        const results = await query;

        // Calcular el total y porcentajes
        const totalCount = results.reduce((sum, r) => sum + parseInt(r.count), 0);
        const countMode1 = results.filter(r => r.mode == 1).reduce((sum, r) => sum + parseInt(r.count), 0);
        const countMode0 = results.filter(r => r.mode == 0).reduce((sum, r) => sum + parseInt(r.count), 0);

        const percentageMode1 = (countMode1 / totalCount) * 100 || 0;
        const percentageMode0 = (countMode0 / totalCount) * 100 || 0;

        const datos = {
            consigna: nombre,
            Automatico: `${percentageMode1.toFixed(2)}%`,
            Manual: `${percentageMode0.toFixed(2)}%`
        };

        await redisClient.setCachedResponse(cacheKey, datos);
        return res.json(datos);

    } catch (error) {
        console.error('Error al obtener el porcentaje:', error);
    }
});

// Ruta para obtener promedio del modo
/**
 * @swagger
 * /ruta:
 *   get:
 *     summary: Devuelve un ejemplo
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */
router.get('/avg_modo', async (req, res) => {
    const { nombre, start_date, end_date } = req.query;
    const cacheKey = `avg_modo_${nombre}_${start_date}_${end_date}`;

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        let query = knex('valores_consigna')
            .avg('valores_consigna.valor as avg')
            .select('consigna.nombre as consigna', 'valores_consigna.mode')
            .join('consigna', 'valores_consigna.id_consigna', '=', 'consigna.id')
            .where('consigna.nombre', nombre)
            .groupBy('consigna.nombre', 'valores_consigna.mode');

        if (start_date) {
            query = query.andWhere('valores_consigna.timestamp', '>=', start_date);
        }
        if (end_date) {
            query = query.andWhere('valores_consigna.timestamp', '<=', end_date);
        }

        const results = await query;

        const modosPresentes = results.reduce((acc, r) => {
            acc[r.mode] = r.avg;
            return acc;
        }, {});

        const datos = [
            { avg: modosPresentes[0] || null, consigna: nombre, mode: "MANUAL" },
            { avg: modosPresentes[1] || null, consigna: nombre, mode: "AUTO" }
        ];

        await redisClient.setCachedResponse(cacheKey, datos);
        return res.json(datos);

    } catch (error) {
        console.error('Error al obtener el promedio del modo:', error);
    }
});

module.exports = router;

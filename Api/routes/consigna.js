const express = require('express');
const router = express.Router();
const knex = require('../db/knex'); // Importa la configuración de Knex
const redisClient = require('../db/redisClient');
const moment = require('moment-timezone');

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
 * /datos/consigna:
 *   get:
 *     summary: Obtiene datos de consignas o equipos
 *     description: Recupera datos filtrados por nombre de consigna o equipo, con fechas opcionales.
 *     tags:
 *       - Consignas
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre de la consigna
 *       - in: query
 *         name: nombres
 *         schema:
 *           type: string
 *         description: Nombres de varias consignas separados por comas
 *       - in: query
 *         name: equipo
 *         schema:
 *           type: string
 *         description: Nombre del equipo
 *       - in: query
 *         name: equipos
 *         schema:
 *           type: string
 *         description: Nombres de varios equipos separados por comas
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
 *         description: Datos de consignas o equipos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   time:
 *                     type: string
 *                     format: date-time
 *                   value:
 *                     type: number
 *                   mode:
 *                     type: string
 *                   consigna:
 *                     type: string
 *       400:
 *         description: Solicitud incorrecta
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
 * /datos/consigna/porcentaje:
 *   get:
 *     summary: Obtiene el porcentaje de modos
 *     description: Calcula el porcentaje de tiempo en modo automático y manual de una consigna.
 *     tags:
 *       - Consignas
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre de la consigna
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
 *         description: Porcentaje de modos de la consigna
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
 *         description: Solicitud incorrecta
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

/**
 * @swagger
 * /datos/consigna/avg_modo:
 *   get:
 *     summary: Obtiene el promedio del valor por modo
 *     description: Calcula el promedio del valor de una consigna separando los modos Manual y Automático.
 *     tags:
 *       - Consignas
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre de la consigna
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
 *         description: Promedio del valor en cada modo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   avg:
 *                     type: number
 *                   consigna:
 *                     type: string
 *                   mode:
 *                     type: string
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor
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

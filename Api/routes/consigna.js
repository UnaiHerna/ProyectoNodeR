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

    let query = knex('Valores_Consigna')
        .select('Consigna.nombre as consigna', 'Valores_Consigna.valor as value', 'Valores_Consigna.timestamp as time', 'Valores_Consigna.mode as mode')
        .join('Consigna', 'Valores_Consigna.id_consigna', '=', 'Consigna.id')
        .where('Consigna.nombre', consigna)
        .orderBy('Valores_Consigna.timestamp', 'asc');

    if (startDate) {
        query = query.andWhere('Valores_Consigna.timestamp', '>=', startDate);
    }
    if (endDate) {
        query = query.andWhere('Valores_Consigna.timestamp', '<=', endDate);
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

// Función para leer datos por equipo
async function readDatosConsignaByEquipo(equipo, startDate, endDate) {
    const cacheKey = `datos_consigna_${equipo}_${startDate}_${endDate}`;
    let cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let query = knex('Valores_Consigna')
        .select('Consigna.nombre as consigna', 'Valores_Consigna.valor as value', 'Valores_Consigna.timestamp as time', 'Valores_Consigna.mode as mode')
        .join('Consigna', 'Valores_Consigna.id_consigna', '=', 'Consigna.id')
        .join('Equipo', 'Consigna.id_equipo', '=', 'Equipo.id')
        .where('Equipo.nombre', equipo)
        .orderBy('Valores_Consigna.timestamp', 'asc');

    if (startDate) {
        query = query.andWhere('Valores_Consigna.timestamp', '>=', startDate);
    }
    if (endDate) {
        query = query.andWhere('Valores_Consigna.timestamp', '<=', endDate);
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

// Ruta para obtener datos condicionales por nombre, equipo, etc.
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

// Ruta para obtener porcentaje de modo
router.get('/porcentaje', async (req, res) => {
    const { nombre, start_date, end_date } = req.query;
    const cacheKey = `porcentaje_${nombre}_${start_date}_${end_date}`;
    let cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let query = knex('Valores_Consigna')
        .count('Valores_Consigna.id_consigna as count')
        .select('Valores_Consigna.mode')
        .join('Consigna', 'Valores_Consigna.id_consigna', '=', 'Consigna.id')
        .where('Consigna.nombre', nombre)
        .groupBy('Valores_Consigna.mode');

    if (start_date) {
        query = query.andWhere('Valores_onsigna.timestamp', '>=', start_date);
    }
    if (end_date) {
        query = query.andWhere('Valores_Consigna.timestamp', '<=', end_date);
    }

    const results = await query;

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

    redisClient.setCachedResponse(cacheKey, datos);
    res.json(datos);
});

// Ruta para obtener promedio del modo
router.get('/avg_modo', async (req, res) => {
    const { nombre, start_date, end_date } = req.query;
    const cacheKey = `avg_modo_${nombre}_${start_date}_${end_date}`;
    let cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let query = knex('Valores_Consigna')
        .avg('Valores_Consigna.valor as avg')
        .select('Consigna.nombre as consigna', 'Valores_Consigna.mode')
        .join('Consigna', 'Valores_Consigna.id_consigna', '=', 'Consigna.id')
        .where('Consigna.nombre', nombre)
        .groupBy('Consigna.nombre', 'Valores_Consigna.mode');

    if (start_date) {
        query = query.andWhere('Valores_Consigna.timestamp', '>=', start_date);
    }
    if (end_date) {
        query = query.andWhere('Valores_Consigna.timestamp', '<=', end_date);
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

    redisClient.setCachedResponse(cacheKey, datos);
    res.json(datos);
});

module.exports = router;
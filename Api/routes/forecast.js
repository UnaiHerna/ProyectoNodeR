const express = require('express');
const router = express.Router();
const redisClient = require('../db/redisClient');
const fetch = require('node-fetch');
require('dotenv').config();

const aemetBaseUrl = 'https://opendata.aemet.es/opendata/api';
const apiKey = process.env.AEMET_API_KEY;

/**
 * @swagger
 * /forecast/diario/{municipioId}:
 *   get:
 *     summary: Obtiene la predicción diaria del clima para un municipio
 *     description: Recupera la predicción del clima diaria proporcionada por AEMET para un municipio específico.
 *     tags:
 *       - Forecast
 *     parameters:
 *       - in: path
 *         name: municipioId
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del municipio según AEMET
 *     responses:
 *       200:
 *         description: Predicción diaria del clima obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error interno al procesar la solicitud
 */
router.get('/diario/:municipioId', async (req, res) => {
    const municipioId = req.params.municipioId; // Código de municipio para Ranilla '41004'; 
    const cacheKey = `forecastDiario_${municipioId}`;

    if (!apiKey) {
        return res.status(500).json({ error: 'Falta la clave de API de AEMET en las variables de entorno' });
    }

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);

        if (cachedData) {
            return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
        }

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
        console.log('Datos de predicción:', forecastData[0].prediccion);

        // Procesar los datos correctamente
        const forecastForSevenDays = forecastData[0]?.prediccion?.dia.map(day => ({
            fecha: day.fecha,
            estadoCielo: day.estadoCielo[0]?.descripcion || 'Desconocido',
            temperaturaMaxima: day.temperatura?.maxima || 'No disponible',
            temperaturaMinima: day.temperatura?.minima || 'No disponible',
            probabilidadPrecipitacion: day.probPrecipitacion[0]?.value || 0,
        }));

        await redisClient.setCachedResponse(cacheKey, forecastForSevenDays, 3600); // Cache for 1 hour

        res.status(200).json(forecastForSevenDays);
    } catch (error) {
        console.error('Error obteniendo el clima:', error.message);
        res.status(500).json({ error: 'Error interno al procesar la solicitud', details: error.message });
    }
});

/**
 * @swagger
 * /forecast/horario/{municipioId}:
 *   get:
 *     summary: Obtiene la predicción horaria del clima para un municipio
 *     description: Recupera la predicción del clima horaria proporcionada por AEMET para un municipio específico.
 *     tags:
 *       - Forecast
 *     parameters:
 *       - in: path
 *         name: municipioId
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del municipio según AEMET
 *     responses:
 *       200:
 *         description: Predicción horaria del clima obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error interno al procesar la solicitud
 */
router.get('/horario/:municipioId', async (req, res) => {
    const municipioId = req.params.municipioId;
    const cacheKey = `forecastHorario_${municipioId}`;

    if (!apiKey) {
        return res.status(500).json({ error: 'Falta la clave de API de AEMET en las variables de entorno' });
    }

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);

        if (cachedData) {
            return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
        }

        // Obtener la URL con los datos de predicción horaria
        const response = await fetch(`${aemetBaseUrl}/prediccion/especifica/municipio/horaria/${municipioId}/?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Error al obtener la URL de predicción horaria: ${response.statusText}`);
        }

        const data = await response.json();

        // Obtener los datos reales desde la URL proporcionada
        const forecastResponse = await fetch(data.datos);
        if (!forecastResponse.ok) {
            throw new Error(`Error al obtener los datos de predicción horaria: ${forecastResponse.statusText}`);
        }

        const forecastData = await forecastResponse.json();
        console.log('Datos de predicción horaria:', forecastData.prediccion);

        // Procesar los datos correctamente
        const forecastForNextHours = forecastData[0]?.prediccion?.dia.flatMap(day =>
            day.estadoCielo.map((estado, index) => ({
                fecha: day.fecha,
                hora: `${index * 1}:00`, // AEMET organiza datos en intervalos de 3 horas
                estadoCielo: estado.descripcion || 'Desconocido',
                temperatura: day.temperatura[index]?.value || 'No disponible',
                probabilidadPrecipitacion: day.probPrecipitacion[index]?.value || 0,
            }))
        );

        if (!forecastForNextHours) {
            throw new Error('No se encontraron datos de predicción horaria.');
        }

        await redisClient.setCachedResponse(cacheKey, forecastForNextHours, 0.1); // Cache for 1 hour

        res.status(200).json(forecastForNextHours);
    } catch (error) {
        console.error('Error obteniendo el clima:', error.message);
        res.status(500).json({ error: 'Error interno al procesar la solicitud', details: error.message });
    }
});

/**
 * @swagger
 * /forecast/municipios:
 *   get:
 *     summary: Obtiene la lista de municipios con su ID y nombre
 *     description: Recupera la lista de municipios proporcionada por AEMET, con ID, nombre y provincia.
 *     tags:
 *       - Forecast
 *     responses:
 *       200:
 *         description: Lista de municipios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Código del municipio
 *                   nombre:
 *                     type: string
 *                     description: Nombre del municipio
 *                   provincia:
 *                     type: string
 *                     description: Código de la provincia
 *                   altitud:
 *                     type: number
 *                     description: Altitud del municipio
 *       500:
 *         description: Error interno del servidor o fallo en la API de AEMET
 */
router.get('/municipios', async (req, res) => {
    const cacheKey = 'municipios_lista';

    if (!apiKey) {
        return res.status(500).json({ error: 'Falta la clave de API de AEMET en las variables de entorno' });
    }

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await fetch(`${aemetBaseUrl}/maestro/municipios/?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Error al obtener la lista de municipios: ${response.statusText}`);
        }

        const data = await response.json();
        const municipiosUrl = data.datos;

        const municipiosResponse = await fetch(municipiosUrl);
        if (!municipiosResponse.ok) {
            throw new Error(`Error al obtener los datos de municipios: ${municipiosResponse.statusText}`);
        }

        const municipios = await municipiosResponse.json();
        await redisClient.setCachedResponse(cacheKey, municipios, 86400); // Cache por 24 horas

        res.status(200).json(municipios);
    } catch (error) {
        console.error('Error obteniendo la lista de municipios:', error.message);
        res.status(500).json({ error: 'Error interno al procesar la solicitud', details: error.message });
    }
});

module.exports = router;
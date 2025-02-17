const express = require('express');
const router = express.Router();
const redisClient = require('../db/redisClient');
const fetch = require('node-fetch');

router.get('/diario', async (req, res) => {
    const aemetBaseUrl = 'https://opendata.aemet.es/opendata/api';
    const apiKey = process.env.AEMET_API_KEY;
    const municipioId = '41004'; // Código de municipio para Ranilla
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

router.get('/horario', async (req, res) => {
    const aemetBaseUrl = 'https://opendata.aemet.es/opendata/api';
    const apiKey = process.env.AEMET_API_KEY;
    const municipioId = '41004'; // Código de municipio para Ranilla
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

module.exports = router;
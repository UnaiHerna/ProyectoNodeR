const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const redisClient = require('../db/redisClient');
const fetch = require('node-fetch');
const { obtenerDatosProximas6Horas, formatearHora } = require('../utils/dateUtils');
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
    const municipioId = req.params.municipioId;
    const cacheKey = `forecastDiario_${municipioId}_${ahora}`;

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

        // Procesar los datos correctamente
        const forecastForSevenDays = forecastData[0]?.prediccion?.dia.map(day => ({
            fecha: day.fecha,
            iconoCielo: day.estadoCielo[0]?.descripcion || 'Desconocido',
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

// Función auxiliar para implementar un timeout en fetch
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    options.signal = controller.signal;
    try {
        return await fetch(url, options);
    } finally {
        clearTimeout(id);
    }
}

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
    const ahora = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', hour12: false });
    const cacheKey = `forecastDiario_${municipioId}_${ahora}`;

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
            if (cachedData) {
                return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
            }else {
                throw new Error(`Error al obtener la URL de predicción horaria: ${response.statusText}`);
            }
        }

        const data = await response.json();

        // Obtener los datos reales desde la URL proporcionada
        const forecastResponse = await fetchWithTimeout(data.datos, {}, 10000);
        if (!forecastResponse.ok) {
            if (cachedData) {
                return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
            }else {
                throw new Error(`Error al obtener los datos de predicción horaria: ${forecastResponse.statusText}`);
            }
        }

        const forecastData = await forecastResponse.json();

        const datosFinales = obtenerDatosProximas6Horas(forecastData[0].prediccion.dia);

        let existingCache = await redisClient.getCachedResponse(cacheKey);
        if (!existingCache) {
            await redisClient.setCachedResponse(cacheKey, datosFinales, 1800); // Cache por 1 hora
        }

        res.status(200).json(datosFinales);

    } catch (error) {
        // Intentar recuperar desde la caché si la API falló
        let cachedData = await redisClient.getCachedResponse(cacheKey);
        if (cachedData) {
            console.log(`Usando datos en caché tras error: ${cacheKey}`);
            return res.json({ data: cachedData, message: 'Recurrido a caché por fallo de conexión' });
        }

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

// Función para obtener los datos de predicción horaria de AccuWeather
async function obtenerDatosAccuWeather(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al obtener la URL de predicción horaria: ${response.statusText}`);
    }

    const datosFinales = await response.json();
    return datosFinales.slice(0, 6).map((item, index) => {
        const horaEspañola = new Date(item.DateTime).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', hour12: false });
        return {
            tiempo: index === 0 ? "now" : formatearHora(parseInt(horaEspañola)),
            icono: item.IconPhrase,
            temperatura: item.Temperature.Value,
            probabilidadPrecipitacion: item.PrecipitationProbability
        };
    });
}

// Forecast de AccuWeather con la misma lógica que el horario
router.get('/forecast/accuweather/:municipioId', async (req, res) => {
    const accuWeatherApiKey = process.env.ACCUWEATHER_API_KEY;
    const municipioId = req.params.municipioId || 306733;
    // Obtener la hora actual en formato 24 horas
    const ahora = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', hour12: false });
    const ahoraMasUno = (parseInt(ahora) + 1) % 24;

    const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${municipioId}?apikey=${accuWeatherApiKey}&metric=true`;

    if (!accuWeatherApiKey) {
        return res.status(500).json({ error: 'Falta la clave de API de AccuWeather en las variables de entorno' });
    }

    try {
        // Intentar obtener los datos de Redis para la hora actual y la hora siguiente
        let cachedData = await redisClient.getCachedResponse(`forecastAccuweather_${municipioId}_${ahora}`);
        let cachedDataNextHour = await redisClient.getCachedResponse(`forecastAccuweather_${municipioId}_${ahoraMasUno}`);

        if (cachedData && cachedDataNextHour) {
            // Si tiene ambos datos en caché, se devuelve directamente
            return res.json(cachedData);
        }

        if (cachedData) {
            // Si solo tiene los datos de la hora actual en caché, pero no para la siguiente hora
            // Se realiza la petición para obtener los datos de la hora siguiente
            const datosFinalesNextHour = await obtenerDatosAccuWeather(url);
            await redisClient.setCachedResponse(`forecastAccuweather_${municipioId}_${ahoraMasUno}`, datosFinalesNextHour, 3600);

            // Devuelve los datos de la hora actual en caché
            return res.json(cachedData);
        }

        // Si no hay datos en caché, entonces hay que esperar una hora
        if (!cachedData && !cachedDataNextHour) {
            // Realizar la solicitud para obtener ambos datos
            const datosFinales = await obtenerDatosAccuWeather(url);
            
            console.log(url);

            // Guardar los datos en Redis
            await redisClient.setCachedResponse(`forecastAccuweather_${municipioId}_${ahora}`, datosFinales, 3600);
            await redisClient.setCachedResponse(`forecastAccuweather_${municipioId}_${ahoraMasUno}`, datosFinales, 3600);

            // Devolver los datos
            return res.status(200).json(datosFinales);
        }

    } catch (error) {
        console.error('Error obteniendo el clima de AccuWeather:', error.message);
        res.status(500).json({ error: 'Error interno al procesar la solicitud', details: error.message });
    }
});

router.get('/online_sensors', async (req, res) => {
    try {
        const result = await knex('analog_process_sensor as aps')
            .select(
                'apst.*',
                'amd.id_loc as localizacion',
                'var.name as unit',
                'nl.label as label'
            )
            .join('analog_measurement_device as amd', 'aps.id_md', 'amd.id')
            .join('variable as var', 'aps.id_variable', 'var.id')
            .join('md_location as mdl', 'amd.id', 'mdl.id_md')
            .join('node_layout as nl', 'amd.id_loc', 'nl.id')
            .joinRaw(
                `JOIN LATERAL (
                    SELECT * FROM analog_process_sensor_ts apst
                    WHERE apst.id_sensor = aps.id
                    ORDER BY apst.time_utc DESC
                    LIMIT 1
                ) apst ON true`
            )
            .where('mdl.id_lt', 1)
            .where('nl.id_ec', 9)
            .where('nl.id_treatment', 6);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching online sensors:", error.message);
        res.status(500).json({ error: 'Error fetching online sensors', details: error.message });
    }
});


module.exports = router;

const express = require('express');
const router = express.Router();
const { readDatosSensorByVariable } = require('../utils/readDatos'); // Asegúrate de que la ruta sea correcta para importar la función
const redisClient = require('../db/redisClient');
const knex = require('../db/knex');

/**
 * @swagger
 * /datos/sensor:
 *   get:
 *     summary: Obtiene datos de sensores
 *     description: Recupera datos de un sensor específico basado en la variable, equipo y rango de fechas proporcionados.
 *     tags:
 *       - Sensores
 *     parameters:
 *       - in: query
 *         name: variable
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la variable del sensor
 *       - in: query
 *         name: equipo
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del equipo del sensor
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha de inicio en formato ISO 8601
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha de fin en formato ISO 8601
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         required: false
 *         description: Tipo de datos opcional
 *     responses:
 *       200:
 *         description: Datos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Faltan parámetros requeridos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
    const { variable, equipo, start_date, end_date, tipo } = req.query;

    // Verificar que los parámetros requeridos estén presentes
    if (!variable || !equipo || !start_date || !end_date) {
        return res.status(400).send('Faltan parámetros requeridos');
    }
    try {
        // Llama a la función para leer los datos con los parámetros proporcionados
        const data = await readDatosSensorByVariable(variable, equipo, start_date, end_date, tipo);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los datos del sensor:', error.message);
        res.status(500).send('Error al obtener los datos del sensor.');
    }
});

/**
 * @swagger
 * /datos/sensor/heatmap:
 *   get:
 *     summary: Obtiene datos formateados para un heatmap
 *     description: Devuelve datos agregados de sensores organizados por semana y día de la semana para un heatmap.
 *     tags:
 *       - Sensores
 *     parameters:
 *       - in: query
 *         name: variable
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la variable del sensor
 *       - in: query
 *         name: equipo
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del equipo del sensor
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: false
 *         description: Año de los datos, por defecto el actual
 *     responses:
 *       200:
 *         description: Datos procesados exitosamente para el heatmap
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: No se encontraron datos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/heatmap', async (req, res) => {
    const { variable, equipo, year } = req.query;
    const cacheKey = `heatmap_sensor_${variable}_${equipo}`;

    try {
        let cachedData = await redisClient.getCachedResponse(cacheKey);
        if (cachedData) {
            return res.json(cachedData); // Devuelve la respuesta JSON directamente al cliente y termina la ejecución
        }

        // Definir el año actual si no se proporciona
        const queryYear = year || new Date().getFullYear();

        // Realizar la consulta a la base de datos y ejecutarla
        const resultados = await knex('sensor_datos')
            .select(
                knex.raw('DAYNAME(`timestamp`) as `day`'),
                knex.raw('WEEK(`timestamp`, 1) as `week`'),
                knex.raw('AVG(`valor`) as `average_value`')
            )
            .join('sensor', function() {
                this.on('sensor_datos.id_equipo', '=', 'sensor.id_equipo')
                    .andOn('sensor_datos.id_variable', '=', 'sensor.id_variable');
            })
            .join('variable', 'sensor.id_variable', 'variable.id')
            .join('equipo', 'sensor.id_equipo', 'equipo.id')
            .where('variable.simbolo', variable)
            .where('equipo.nombre', equipo)
            .whereRaw('YEAR(`sensor_datos`.`timestamp`) = ?', [queryYear])
            .groupByRaw('WEEK(`timestamp`, 1), DAYNAME(`timestamp`), DAYOFWEEK(`timestamp`)')
            .orderByRaw('WEEK(`timestamp`, 1), DAYOFWEEK(`timestamp`)');

        // Verificar si los resultados son un array y tienen datos
        if (!Array.isArray(resultados) || resultados.length === 0) {
            console.warn('La consulta no devolvió resultados o el formato no es correcto.');
            return res.status(404).json({ message: 'No se encontraron datos.' }); // Asegúrate de terminar la ejecución con return
        }

        // Procesar los resultados
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const weeksOfYear = Array.from({ length: 53 }, (_, i) => `week${i + 1}`);
        const daysData = {};

        daysOfWeek.forEach(day => {
            daysData[day] = Object.fromEntries(weeksOfYear.map(week => [week, null]));
        });

        resultados.forEach(r => {
            const week = `week${r.week}`;
            const day = r.day;
            const avgValue = r.average_value;

            if (daysData[day]) {
                daysData[day][week] = avgValue;
            }
        });


        // Cachear la respuesta si es necesario
        await redisClient.setCachedResponse(cacheKey, resultados);

        // Devolver los resultados formateados al cliente
        return res.json(resultados); // Asegúrate de terminar la ejecución con return

    } catch (error) {
        console.error('Error al obtener los datos del sensor:', error);

        // Asegúrate de no intentar enviar la respuesta de error si ya se ha enviado una respuesta
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error al procesar los datos del sensor.' });
        }
    }
});

module.exports = router;
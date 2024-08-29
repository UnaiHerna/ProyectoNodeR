const { Op, col } = require('sequelize');
const Cache = require('node-cache');
const { Sensor, SensorDatos, Variable, Equipo } = require('../models'); // Asegúrate de definir tus modelos
const redisClient = require('./redisClient'); // Implementa las funciones de caché
const { dateValidator } = require('./dateChecker'); // Implementa la función dateValidator
const { generarHuecos } = require('./gapGenerator'); // Implementa la función generarHuecos
const { calcularDeltaPrima, getDatosSinHueco } = require('./dateModifier'); // Implementa las funciones de agregación

const cache = new Cache({ stdTTL: 3600, checkperiod: 600 }); // TTL de caché de 1 hora

// Función para leer datos del sensor
async function readDatosSensorByVariable(variable, equipo, startDate = null, endDate = null, tipo = null) {
    const cacheKey = `datos_sensor_${variable}_${equipo}_${startDate}_${endDate}_${tipo}`;
    const cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const resultados = await SensorDatos.findAll({
        attributes: [
            ['timestamp', 'time'],
            ['valor', 'value'],
            [col('Sensor.deltat'), 'deltat'],
            [col('Sensor->Equipo.descripcion'), 'equipo']
        ],
        include: [
            {
                model: Sensor,
                required: true,
                include: [
                    {
                        model: Variable,
                        where: { simbolo: variable }
                    },
                    {
                        model: Equipo,
                        where: { nombre: equipo }
                    }
                ]
            }
        ],
        where: {
            timestamp: { [Op.between]: [startDate, endDate] }
        },
        order: [['timestamp', 'ASC']]
    });

    try {

        const datos = resultados.map(r => ({
            time: r.time,
            value: r.value,
            equipo: r.equipo
        }));

        if (datos.length === 0) {
            throw new Error('No hay datos suficientes.');
        }

        const nombreEquipo = datos[0].equipo;
        const deltat = resultados[0].deltat;

        const { datosWithGaps, huecosInfo } = generarHuecos(datos);
        const datosFinales = agregacion(datos, datosWithGaps, deltat, huecosInfo, nombreEquipo, tipo);

        redisClient.setCachedResponse(cacheKey, datosFinales);

        return datosFinales;
    } catch (error) {
        console.error('Error al leer datos del sensor:', error);
        throw new Error('Error al leer datos del sensor.');
    }
}

// Función de agregación
function agregacion(datos, datosWithGaps, deltat, huecosInfo, nombreEquipo, tipo) {
    const sData = datosWithGaps.map(dato => dato.value);
    const sTime = datosWithGaps.map(dato => new Date(dato.time).getTime());
    const z = calcularDeltaPrima(tipo, deltat, [datosWithGaps[0].time, datosWithGaps[datosWithGaps.length - 1].time]);

    if (z === deltat) {
        for (const [pos, length, time] of huecosInfo) {
            for (let i = pos; i < pos + length; i++) {
                datosWithGaps.splice(i, 0, { time: datos[i].time, value: null, equipo: datos[i].equipo });
            }
        }
        return datosWithGaps;
    }

    const datosAgregados = getDatosSinHueco([datosWithGaps[0].time, datosWithGaps[datosWithGaps.length - 1].time], sData, sTime, z);
    return datosAgregados.map(item => ({
        time: new Date(item[0]).toISOString(), // Convertir a string ISO 8601
        value: item[1],
        equipo: nombreEquipo
    }));
}

module.exports = {
    readDatosSensorByVariable
};
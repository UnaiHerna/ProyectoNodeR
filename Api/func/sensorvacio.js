const knex = require('./knex');
const redisClient = require('./redisClient');
const { dateValidator } = require('./dateChecker');
const { generarHuecos } = require('./gapGenerator');
const { calcularDeltaPrima, getDatosSinHueco } = require('./dateModifier');
const moment = require('moment-timezone');


async function readDatosSensorByVariable(variable, equipo, startDate = null, endDate = null, tipo = null) {
    const cacheKey = `datos_sensor_${variable}_${equipo}_${startDate}_${endDate}_${tipo}`;

    // Verificar si los datos ya están en caché
    const cachedData = await redisClient.getCachedResponse(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let resultados;
    try {
        let query = knex('sensor_datos')
            .select(
                'sensor_datos.timestamp as time',
                'sensor_datos.valor as value',
                'equipo.descripcion as equipo',
                'sensor.deltat as deltat'
            )
            .join('sensor', function() {
                this.on('sensor_datos.id_equipo', '=', 'sensor.id_equipo')
                    .andOn('sensor_datos.id_variable', '=', 'sensor.id_variable');
            })
            .join('variable', 'sensor.id_variable', '=', 'variable.id')
            .join('equipo', 'sensor.id_equipo', '=', 'equipo.id')
            .where('variable.simbolo', variable)
            .where('equipo.nombre', equipo)
            .orderBy('sensor_datos.timestamp', 'asc');

        // Aplicar validación de fechas
        query = dateValidator(query, startDate, endDate);

        resultados = await query;

        if (resultados.length === 0) {
            throw new Error('No hay datos suficientes.');
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error al leer datos del sensor.');
    }

    try {
        // Mapeo de los resultados a un formato de salida
        const datos = resultados.map(r => ({
            time: moment(r.time).format('YYYY-MM-DDTHH:mm:ss'), // Ajusta la fecha a la zona horaria local
            value: r.value,
            equipo: r.equipo,
            deltat: r.deltat
        }));

        // Obtener valores importantes para el procesamiento
        const nombreEquipo = datos[0].equipo;
        const deltat = datos[0].deltat;

        // Generar huecos y realizar agregación de datos
        const { datosWithGaps, huecosInfo } = generarHuecos(datos);
        const datosFinales = agregacion(datos, datosWithGaps, deltat, huecosInfo, nombreEquipo, tipo);

        // Almacenar en caché los datos procesados
        await redisClient.setCachedResponse(cacheKey, datosFinales);

        return datosFinales;

    } catch (error) {
        console.error('Error al procesar los datos del sensor:', error);
        throw new Error('Error al procesar los datos del sensor.');
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
        time: moment(item[0]).format('YYYY-MM-DDTHH:mm:ss'), // Ajusta la fecha a la zona horaria local
        value: item[1],
        equipo: nombreEquipo
    }));
}

module.exports = {
    readDatosSensorByVariable
};

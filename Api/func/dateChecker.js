const { Op } = require('sequelize');
const { SensorDatos } = require('./models'); // Asegúrate de definir y exportar el modelo SensorDatos

/**
 * Valida y ajusta las fechas en la consulta.
 * @param {Object} query - Consulta Sequelize.
 * @param {Date} endDate - Fecha de fin.
 * @param {Date} startDate - Fecha de inicio.
 * @returns {Object} Consulta ajustada.
 * @throws {Error} Si las fechas no son válidas.
 */
function dateValidator(query, endDate, startDate) {
    // Obtener la fecha y hora actuales
    const currentDatetime = new Date();

    if (startDate && startDate >= new Date(2024, 0, 1)) {
        query.where[SensorDatos.timestamp] = {
            ...query.where[SensorDatos.timestamp],
            [Op.gte]: startDate
        };
    } else {
        throw new Error("La fecha de inicio debe ser posterior a 2023");
    }

    if (endDate && endDate > startDate) {
        query.where[SensorDatos.timestamp] = {
            ...query.where[SensorDatos.timestamp],
            [Op.lte]: endDate
        };
    } else {
        throw new Error("La fecha de inicio debe ser menor a la fecha de fin.");
    }

    // Validar que endDate no sea posterior a la fecha actual
    query.where[SensorDatos.timestamp] = {
        ...query.where[SensorDatos.timestamp],
        [Op.lte]: currentDatetime
    };

    return query;
}

module.exports = { dateValidator };

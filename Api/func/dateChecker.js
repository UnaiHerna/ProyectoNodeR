// Api/func/dateChecker.js
const { Op } = require('sequelize');
const { SensorDatos } = require('../models'); // Asegúrate de definir y exportar el modelo SensorDatos

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

    if (startDate) {
        // Asegúrate de que startDate es posterior a 2023
        const minStartDate = new Date('2024-01-01');
        if (startDate <= minStartDate) {
            throw new Error("La fecha de inicio debe ser posterior a 2023");
        }

        // Establece el valor de la fecha de inicio en la consulta
        query.where[SensorDatos.timestamp] = {
            ...query.where[SensorDatos.timestamp],
            [Op.gte]: startDate
        };
    } else {
        throw new Error("La fecha de inicio es requerida.");
    }

    if (endDate) {
        // Verifica que endDate sea mayor que startDate
        if (endDate <= startDate) {
            throw new Error("La fecha de fin debe ser mayor que la fecha de inicio.");
        }

        // Verifica que endDate no sea posterior a la fecha actual
        if (endDate > currentDatetime) {
            throw new Error("La fecha de fin no puede ser posterior a la fecha actual.");
        }

        // Establece el valor de la fecha de fin en la consulta
        query.where[SensorDatos.timestamp] = {
            ...query.where[SensorDatos.timestamp],
            [Op.lte]: endDate
        };
    } else {
        throw new Error("La fecha de fin es requerida.");
    }

    return query;
}

module.exports = { dateValidator };

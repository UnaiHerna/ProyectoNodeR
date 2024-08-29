/**
 * Aplica los filtros de fecha a la consulta
 * @param {Object} query - La consulta Knex a la que se le aplicarán los filtros
 * @param {Date} startDate - La fecha de inicio para filtrar los datos
 * @param {Date} endDate - La fecha de fin para filtrar los datos
 * @returns {Object} - La consulta modificada con los filtros aplicados
 * @throws {Error} - Lanza errores con mensajes específicos si las validaciones fallan
 */
function dateValidator(query, startDate, endDate) {
    const currentDatetime = new Date();

    // Validar fecha de inicio
    if (startDate) {
        if (startDate < new Date('2024-01-01')) {
            throw new Error("La fecha de inicio debe ser posterior a 2023");
        }
        query = query.where('timestamp', '>=', startDate);
    } else {
        throw new Error("La fecha de inicio es requerida y debe ser posterior a 2023");
    }

    // Validar fecha de fin
    if (endDate) {
        if (endDate <= startDate) {
            throw new Error("La fecha de fin debe ser posterior a la fecha de inicio.");
        }
        if (endDate > currentDatetime) {
            throw new Error("La fecha de fin no puede ser posterior a la fecha actual.");
        }
        query = query.where('timestamp', '<=', endDate);
    } else {
        throw new Error("La fecha de fin es requerida y debe ser posterior a la fecha de inicio.");
    }

    // Validar que la fecha final no sea posterior a la fecha actual
    query = query.where('timestamp', '<=', currentDatetime);

    return query;
}

module.exports = {
    dateValidator
};
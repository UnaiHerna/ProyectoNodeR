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

// Función para formatear la hora en formato AM/PM
function formatearHora(hora) {
    if (hora === 0) {
        return "12am";
    } else if (hora < 12) {
        return `${hora}am`;
    } else if (hora === 12) {
        return "12pm";
    } else {
        return `${hora - 12}pm`;
    }
}

// Función para obtener los datos de las próximas 6 horas
function obtenerDatosProximas6Horas(datos) {
    const horaActual = parseInt(new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', hour12: false }));
    const proximas6Horas = []; 
    const longitud = 6;

    // Representa el día actual
    let hoy = datos[0];
    
    for (let i = 0; i < longitud; i++) {
        const hora = (horaActual + i) % 24;
        const periodo = hora < 10 ? `0${hora}` : hora.toString();
        const tiempo = i === 0 ? "ahora" : formatearHora(hora);

        // Buscar los datos correspondientes al período
        const datosHora = hoy.estadoCielo.find(item => item.periodo === periodo);
        const temperatura = hoy.temperatura.find(temp => temp.periodo === periodo)?.value || 'No disponible';
        const probabilidadPrecipitacion = hoy.probPrecipitacion.find(prec => prec.periodo === periodo)?.value || 0;

        if (datosHora) {
            proximas6Horas.push({
                tiempo: tiempo,
                icono: datosHora.descripcion,
                temperatura: temperatura,
                probabilidadPrecipitacion: probabilidadPrecipitacion
            });
        }
    }

    return proximas6Horas;
}

module.exports = {
    dateValidator, formatearHora, obtenerDatosProximas6Horas
};
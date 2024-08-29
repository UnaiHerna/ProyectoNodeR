const moment = require('moment');

/**
 * Obtiene el diccionario y el máximo de puntos basado en el tipo.
 * @param {string} tipo - Tipo de gráfico ('timeseries' o 'barchart').
 * @returns {[Object, number]} Diccionario de intervalos y máximo de puntos.
 * @throws {Error} Si el tipo de gráfico no es válido.
 */
function getDiccionario1(tipo) {
    if (tipo === 'timeseries') {
        const diccionario1 = {
            's': [1, 2, 3, 5, 10, 30],
            'm': [1, 2, 3, 5, 10, 30],
            'h': [1, 2, 3, 5, 12, 24, 48],
            'd': [1, 2, 3]
        };
        const maxPoints = 400;
        return [diccionario1, maxPoints];
    } else if (tipo === 'barchart') {
        const diccionario1 = {
            'h': [3, 6, 12],
            'd': [1, 2, 3, 4, 5, 6, 7, 14, 31, 92]
        };
        const maxPoints = 10;
        return [diccionario1, maxPoints];
    } else {
        throw new Error("Tipo de gráfico no válido");
    }
}

/**
 * Calcula el valor de delta prima.
 * @param {string} tipo - Tipo de gráfico.
 * @param {number} deltaDts - Delta en segundos.
 * @param {Array} timeLimits - Rango de tiempo [start, end].
 * @returns {number} Valor calculado de delta prima.
 */
function calcularDeltaPrima(tipo, deltaDts, timeLimits) {
    const [diccionario1, maxDataPointsVisibleDef] = getDiccionario1(tipo);

    const diccionario2 = {
        's': 1,
        'm': 60,
        'h': 3600,
        'd': 86400
    };

    const deltaDt = deltaDts * 1000;
    const tiempoInicial = moment(timeLimits[0]).valueOf();
    const tiempoFinal = moment(timeLimits[1]).valueOf();
    const diferenciaTotal = tiempoFinal - tiempoInicial;
    const lTotales = Math.floor(diferenciaTotal / deltaDt);

    const a = lTotales / maxDataPointsVisibleDef;
    const b = a * deltaDts;

    if (b < deltaDts) return deltaDts;

    let k = -1;
    const clavesD1 = Object.keys(diccionario2);

    for (let i = 0; i < clavesD1.length; i++) {
        const key = clavesD1[i];
        if (b < diccionario2[key]) break;
        k++;
    }

    const key = clavesD1[k];
    const values = {
        unidad: key,
        valor: diccionario2[key],
        rango: diccionario1[key]
    };

    const numTime = b / values.valor;
    let agrupacionRangoValor = 0;

    for (const rango of values.rango) {
        if (numTime < rango) {
            agrupacionRangoValor = rango;
            break;
        }
    }

    const z = agrupacionRangoValor * diccionario2[values.unidad];
    return z;
}

/**
 * Agrupa los datos sin huecos.
 * @param {Array} timeLimits - Rango de tiempo [start, end].
 * @param {Array} rawData - Datos crudos.
 * @param {Array} rawTime - Tiempos crudos.
 * @param {number} z - Intervalo en segundos.
 * @returns {Array} Datos agrupados.
 */
function getDatosSinHueco(timeLimits, rawData, rawTime, z) {
    const groupedData = [];
    let currentGroup = [];

    let t0 = moment(timeLimits[0]).valueOf();
    let tiempoFinal = moment(timeLimits[1]).valueOf();
    let intervalo = z * 1000; // en milisegundos

    let offset_ = 0;
    let t1 = t0 + intervalo;

    for (let i = 0; i < rawData.length; i++) {
        const valorOffset = valorOffsetFunc(rawData, rawTime, t0, t1, offset_);
        if (valorOffset !== null) {
            currentGroup.push(valorOffset.datos);
            const sum_ = currentGroup[0].reduce((acc, val) => acc + val, 0);
            const avg = sum_ / currentGroup[0].length;
            groupedData.push([moment(t0).toDate(), parseFloat(avg.toFixed(2))]);
            offset_ = valorOffset.offset[1];
        } else {
            groupedData.push([moment(t0).toDate(), null]);
        }

        t0 = t1;
        t1 = t0 + intervalo;
        currentGroup = [];

        if (t0 > tiempoFinal) break;
    }

    return groupedData;
}

/**
 * Obtiene valores y offsets dentro del intervalo especificado.
 * @param {Array} rowData - Datos.
 * @param {Array} rowTime - Tiempos.
 * @param {number} t0 - Inicio del intervalo.
 * @param {number} t1 - Fin del intervalo.
 * @param {number} posIn - Posición inicial.
 * @returns {Object|null} Datos agrupados y offsets, o null si no hay datos.
 */
function valorOffsetFunc(rowData, rowTime, t0, t1, posIn) {
    const indices = [];
    const datos = [];

    if (rowTime[0] > t1 || rowTime[rowTime.length - 1] < t0) return null;

    for (let i = posIn; i < rowTime.length; i++) {
        if (t0 <= rowTime[i] && rowTime[i] <= t1) {
            datos.push(rowData[i]);
            indices.push(i);
        } else if (rowTime[i] > t1) {
            break;
        }
    }

    if (indices.length === 0) return null;

    return {
        datos: datos,
        offset: [indices[0], indices[indices.length - 1]]
    };
}

module.exports = { getDiccionario1, calcularDeltaPrima, getDatosSinHueco, valorOffsetFunc };

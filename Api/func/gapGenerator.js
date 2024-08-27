const math = require('mathjs');

/**
 * Genera huecos en los datos.
 * @param {Array} datos - Array de datos donde cada dato es un objeto con una propiedad 'time'.
 * @returns {Object} Un objeto que contiene dos propiedades:
 *   - datosWithGaps: Array de datos con huecos generados.
 *   - huecosInfo: Array de información sobre los huecos generados.
 */
function generarHuecos(datos) {
    const huecosTotales = math.randomInt(1, 5); // Número de huecos (1 a 4)
    const huecosPosiciones = new Set();
    const huecosInfo = [];
    const sigma = (datos.length / 100) * 0.25;

    // Generar huecos
    for (let i = 0; i < huecosTotales; i++) {
        const longHueco = Math.min(datos.length / 100 + sigma, Math.max(datos.length / 100 - sigma, math.randomInt(Math.floor(datos.length / 100 - sigma), Math.ceil(datos.length / 100 + sigma))));
        const pos = math.randomInt(0, datos.length - longHueco);

        // Comprobar que no caigan 2 huecos en la misma posición
        let overlap = false;
        for (let j = pos; j < pos + longHueco; j++) {
            if (huecosPosiciones.has(j)) {
                overlap = true;
                break;
            }
        }

        if (!overlap) {
            for (let j = pos; j < pos + longHueco; j++) {
                huecosPosiciones.add(j);
            }
            huecosInfo.push({ pos, length: longHueco, time: datos[pos].time });
        }
    }

    // Imprimir huecos
    huecosInfo.forEach(({ pos, length, time }) => {
        console.log(`Hueco en la posición: ${pos} de ${length} de largo, empezando en ${time}`);
    });

    const datosWithGaps = datos.filter((_, i) => !huecosPosiciones.has(i));

    return { datosWithGaps, huecosInfo };
}

module.exports = { generarHuecos };

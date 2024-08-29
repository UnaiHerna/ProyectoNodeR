const knex = require('knex');
const knexConfig = require('./knexfile'); // Asegúrate de que la ruta sea correcta

const db = knex(knexConfig.development); // Usa el entorno adecuado aquí (desarrollo, producción, etc.)

module.exports = db;
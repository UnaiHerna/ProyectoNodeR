const { Sequelize } = require('sequelize');

// Configura tu conexión aquí
const sequelize = new Sequelize('datos', 'root', 'Cim12345!', {
    host: 'localhost',
    dialect: 'mysql' // Cambia esto según tu base de datos
});

module.exports = sequelize;
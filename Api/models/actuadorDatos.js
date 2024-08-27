const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Actuador = require('./actuador');

const ActuadorDatos = sequelize.define('ActuadorDatos', {
    id_actuador: {
        type: DataTypes.INTEGER,
        references: {
            model: Actuador,
            key: 'id'
        },
        primaryKey: true,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'actuador_datos',
    timestamps: false
});

module.exports = ActuadorDatos;
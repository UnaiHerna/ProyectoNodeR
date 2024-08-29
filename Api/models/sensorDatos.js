const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Sensor = require('./sensor');

const SensorDatos = sequelize.define('SensorDatos', {
    id_equipo: {
        type: DataTypes.INTEGER,
        references: {
            model: Sensor,  // Referencia al modelo 'Sensor'
            key: 'id_equipo'
        },
        allowNull: false,
        primaryKey: true,
    },
    id_variable: {
        type: DataTypes.INTEGER,
        references: {
            model: Sensor,  // Referencia al modelo 'Sensor'
            key: 'id_variable'
        },
        allowNull: false,
        primaryKey: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
    },
    valor: {
        type: DataTypes.FLOAT
    }
}, {
    tableName: 'sensor_datos',
    timestamps: false
});

module.exports = SensorDatos;
const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Sensor = require('./sensor');

const SensorDatos = sequelize.define('SensorDatos', {
    id_equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_variable: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        primaryKey: true,
        allowNull: false
    },
    valor: {
        type: DataTypes.FLOAT
    }
}, {
    tableName: 'sensor_datos',
    timestamps: false,
    foreignKeys: [
        {
            name: 'fk_sensor',
            references: {
                model: 'Sensor',
                key: 'id_equipo'
            }
        }
    ]
});

module.exports = SensorDatos;
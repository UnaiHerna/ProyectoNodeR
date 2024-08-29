const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Variable = require('./variable');
const Equipo = require('./equipo');

const Sensor = sequelize.define('Sensor', {
    id_equipo: {
        type: DataTypes.INTEGER,
        references: {
            model: Equipo,
            key: 'id'
        },
        primaryKey: true,
        allowNull: false
    },
    id_variable: {
        type: DataTypes.INTEGER,
        references: {
            model: Variable,
            key: 'id'
        },
        primaryKey: true,
        allowNull: false
    },
    deltat: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'sensor',
    timestamps: false
});

module.exports = Sensor;
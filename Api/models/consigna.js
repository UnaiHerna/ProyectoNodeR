const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Sensor = require('./sensor');

const Consigna = sequelize.define('Consigna', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_equipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_variable: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'consigna',
    timestamps: false,
    uniqueKeys: {
        unique_cons: {
            fields: ['id_equipo', 'id_variable']
        }
    }
});

module.exports = Consigna;
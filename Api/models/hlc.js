const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Consigna = require('./consigna');

const HLC = sequelize.define('HLC', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_consigna_entrada: {
        type: DataTypes.INTEGER,
        references: {
            model: Consigna,
            key: 'id'
        },
        allowNull: false
    },
    id_consigna_salida: {
        type: DataTypes.INTEGER,
        references: {
            model: Consigna,
            key: 'id'
        },
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'hlc',
    timestamps: false
});

module.exports = HLC;
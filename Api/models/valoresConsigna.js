const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Consigna = require('./consigna');

const ValoresConsigna = sequelize.define('ValoresConsigna', {
    id_consigna: {
        type: DataTypes.INTEGER,
        references: {
            model: Consigna,
            key: 'id'
        },
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
    },
    mode: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'valores_consigna',
    timestamps: false
});

module.exports = ValoresConsigna;
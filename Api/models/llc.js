const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const Consigna = require('./consigna');

const LLC = sequelize.define('LLC', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_consigna: {
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
    tableName: 'llc',
    timestamps: false
});

module.exports = LLC;
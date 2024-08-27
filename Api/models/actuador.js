const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');
const LLC = require('./llc');

const Actuador = sequelize.define('Actuador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_llc: {
        type: DataTypes.INTEGER,
        references: {
            model: LLC,
            key: 'id'
        },
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'actuador',
    timestamps: false
});

module.exports = Actuador;
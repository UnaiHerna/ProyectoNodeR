const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');

const Equipo = sequelize.define('Equipo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50)
    },
    descripcion: {
        type: DataTypes.STRING(100)
    }
}, {
    tableName: 'equipo',
    timestamps: false
});

module.exports = Equipo;
const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js');

const Variable = sequelize.define('Variable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    simbolo: {
        type: DataTypes.STRING(10)
    },
    u_medida: {
        type: DataTypes.STRING(10)
    },
    descripcion: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'variable',
    timestamps: false
});

module.exports = Variable;
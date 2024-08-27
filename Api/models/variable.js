const { DataTypes } = require('sequelize');
const sequelize = require('../func/sequelize.js'); // Importa la configuración de sequelize

const Variable = sequelize.define('Variable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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
    timestamps: false // Ajusta esto si usas timestamps
});

module.exports = Variable;
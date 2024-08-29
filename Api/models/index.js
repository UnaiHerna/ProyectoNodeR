const sequelize = require('../func/sequelize.js');
const Sensor = require('./sensor');
const SensorDatos = require('./sensorDatos');
const Variable = require('./variable');
const Equipo = require('./equipo');

// Asociaciones
Sensor.belongsTo(Equipo, { foreignKey: 'id_equipo' });
Equipo.hasMany(Sensor, { foreignKey: 'id_equipo' });

Sensor.belongsTo(Variable, { foreignKey: 'id_variable' });
Variable.hasMany(Sensor, { foreignKey: 'id_variable' });

Sensor.hasMany(SensorDatos, { foreignKey: 'id_equipo' });
SensorDatos.belongsTo(Sensor, { foreignKey: 'id_equipo' });

Sensor.hasMany(SensorDatos, { foreignKey: 'id_variable' });
SensorDatos.belongsTo(Sensor, { foreignKey: 'id_variable' });

module.exports = {
    sequelize,
    Sensor,
    SensorDatos,
    Variable,
    Equipo
};
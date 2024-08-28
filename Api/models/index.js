// Api/models/index.js

const Sensor = require('./sensor');
const SensorDatos = require('./sensorDatos'); // Importa el modelo de SensorDatos
const Variable = require('./variable'); // Importa el modelo de Variable
const Equipo = require('./equipo'); // Importa el modelo de Equipo

// Exporta todos los modelos
module.exports = {
    Sensor,
    SensorDatos,
    Variable,
    Equipo
};
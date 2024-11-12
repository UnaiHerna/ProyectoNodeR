const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');
const router = express.Router();

const opciones = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Cimico',
            version: '1.0.0',
        },
    },
    apis: ['consigna.js'], // Asegúrate de que esta ruta sea correcta
};

//Inicialización de Swagger
const swaggerSpec = swaggerJSDoc(opciones);

//Set up
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;



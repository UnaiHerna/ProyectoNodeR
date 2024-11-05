const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');
const router = express.Router();

//Documentación de la API
const opciones= {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Cimico',
            version: '1.0.0',
        }
    },
    apis: ['./*.js'],
};

//Inicialización de Swagger
const swaggerSpec = swaggerJSDoc(opciones);

//Set up
router.get('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
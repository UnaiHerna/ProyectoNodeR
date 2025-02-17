const swaggerJsdoc = require('swagger-jsdoc');

const options = {

    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cimico API',
            version: '1.0.0',
            description:
                'Esta es una API para organizar las plantas depuradoras',
            contact: {
                name: 'Unai',
            },
            servers: [
                {
                    url: 'http://localhost:8000',
                    description: 'Development server',
                },
            ]
        }
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;

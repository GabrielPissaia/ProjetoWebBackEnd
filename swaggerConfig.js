const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Seu Projeto API',
            version: '1.0.0',
            description: 'Documentação da API do Seu Projeto',
        },
    },
    apis: ['./src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

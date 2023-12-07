const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes.js');

const app = express();

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProjetoWebBackEnd API',
      version: '1.0.0',
      description: 'Documentação da API do ProjetoWebBackEnd',
    },
  },
  apis: ['./src/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

// Rota do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

require('./database');

app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

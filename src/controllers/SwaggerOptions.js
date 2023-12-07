const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'ProjetoWebBackEnd API',
        version: '1.0.0',
        description: 'Documentação da API ProjetoWebBackEnd',
      },
    },
    apis: ['./src/controllers/*.js'],
    tags: [
      {
        name: 'Users',
        description: 'Endpoints relacionados a usuários',
      },
      {
        name: 'Addresses',
        description: 'Endpoints relacionados a endereços',
      },
      {
        name: 'Courses',
        description: 'Endpoints relacionados a cursos',
      },
    ],
  };
  
  module.exports = swaggerOptions;
  
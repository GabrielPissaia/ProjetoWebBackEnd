const Sequelize = require('sequelize');

const dbConfig = require('../config/database.js');

const Admin = require('../models/admin.js')

const User = require('../models/User.js');
const Course = require('../models/Course');
const Address = require('../models/Address');

const connection = new Sequelize(dbConfig);

User.init(connection);
Course.init(connection);
Address.init(connection);
Admin.init(connection);

Address.associate(connection.models);
User.associate(connection.models);
Course.associate(connection.models)

connection.authenticate()
.then(() => {
    // Sincroniza as tabelas e adiciona registros iniciais
    return connection.sync({ force: true })
      .then(() => {
        return User.bulkCreate([
          { name: 'Gabriel', password: '000', email: 'Gabriel@example.com' },
          { name: 'Camilla', password: '000', email: 'Camilla@example.com' },
          { name: 'Monique', password: '000', email: 'Monique@example.com' }
        ]);
      })
      .then(() => {
        return Admin.bulkCreate([
          { name: 'Chefe', password: '111', email: 'Chefe@example.com' }
        ]);
      });
  })
  .then(() => console.log('Conexão com o banco de dados estabelecida.'))
  .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));


module.exports = connection;
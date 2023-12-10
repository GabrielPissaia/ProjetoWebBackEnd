const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
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
          { name: 'Gabriel', password: bcrypt.hashSync('000', 10), email: 'Gabriel@gmail.com' },
          { name: 'Camilla', password: bcrypt.hashSync('000', 10), email: 'Camilla@gmail.com' },
          { name: 'Monique', password: bcrypt.hashSync('000', 10), email: 'Monique@gmail.com' },
          { name: 'Carol', password: bcrypt.hashSync('000', 10), email: 'Carol@gmail.com' },
          { name: 'Alexandre', password: bcrypt.hashSync('000', 10), email: 'Alexandre@gmail.com' },
        ]);
      })
      .then(() => {
        return Address.bulkCreate([
          { street: 'Rua 1', number: '123', district: 'Centro', city: 'Cidade A', user_id: 1 },
          { street: 'Rua 2', number: '456', district: 'Bairro B', city: 'Cidade B', user_id: 2 },
          { street: 'Rua 3', number: '789', district: 'Bairro C', city: 'Cidade C', user_id: 3 },
          { street: 'Rua 4', number: '101', district: 'Bairro D', city: 'Cidade D', user_id: 4 },
          { street: 'Rua 5', number: '131', district: 'Bairro E', city: 'Cidade E', user_id: 5 },
        ]);
      })
      .then(() => {
        return Admin.bulkCreate([
          { name: 'Chefe', password: bcrypt.hashSync('000', 10), email: 'Chefe@gmail.com' },
          { name: 'Captao', password: bcrypt.hashSync('000', 10), email: 'Capitao@gmail.com' },
          { name: 'Superior', password: bcrypt.hashSync('000', 10), email: 'Superior@gmail.com' },
          { name: 'Presidente', password: bcrypt.hashSync('000', 10), email: 'Presidente@gmail.com' },
          { name: 'Administrador', password: bcrypt.hashSync('000', 10), email: 'Administrador@gmail.com' },
        ]);
      });
  })
  .then(() => console.log('Conexão com o banco de dados estabelecida.'))
  .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));


module.exports = connection;
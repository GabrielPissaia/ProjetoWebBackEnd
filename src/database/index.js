const Sequelize = require('sequelize');

const dbConfig = require('../config/database.js');

const User = require('../models/user.js');

const Address = require('../models/Address');

const connection = new Sequelize(dbConfig);

User.init(connection);

Address.init(connection);

Address.associate(connection.models);
User.associate(connection.models);

module.exports = connection;
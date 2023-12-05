const Sequelize = require('sequelize');

const dbConfig = require('../config/database.js');

const User = require('../models/User.js');
const Course = require('../models/Course');
const Address = require('../models/Address');

const connection = new Sequelize(dbConfig);

User.init(connection);
Course.init(connection);
Address.init(connection);

Address.associate(connection.models);
User.associate(connection.models);
Course.associate(connection.models)

module.exports = connection;
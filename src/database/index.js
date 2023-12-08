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
.then(() => connection.sync())
.catch((error) => console.log(error));

module.exports = connection;
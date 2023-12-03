const Sequelize = require('sequelize');

const dbConfig = require('../config/database.js');

const connection = new Sequelize(dbConfig);

try {
    connection.authenticate();
        console.log('conectado com sucesso');
    } catch (erro) {
        console.error('erro ao conectar', error);    
    }

module.exports = connection;
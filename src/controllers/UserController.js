const User = require('../models/user');

module.exports = {
    async index(req, res) {
    
    const users = await User.findAll();

    if (users == '' || users == null) {
        return res.status(200).send({ message: 'Sem usuario cadastrado'});
    }

    return res.status(200).send({ users });

    },

    async store(req, res) {

    },

    async update(req, res) {

    },

    async delete(req, res) {

    },

};
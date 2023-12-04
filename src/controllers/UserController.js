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

    const { name, password, email } = req.body;

    const user = await User.create({ name, password, email });

    return res.status(200).send({
        status: 1,
        menssage: 'usuario cadastrado com sucesso!',
        user
    });

    },

    async update(req, res) {

    const { name, password, email } = req.body;
    const { user_id } = req.params;

    await User.update({
        name, password, email
    }, {
        where: {
            id: user_id
        }
    });

    return res.status(200).send({
        status: 1,
        menssage: "Usuario atualizado com sucesso!",
    });

    },

    async delete(req, res) {

        const { user_id } = req.params;

        await User.destroy({
            where:{
                id: user_id
            } 
    });
        
    return res.status(200).send({
        status: 1,
        menssage: "Usuario deletado com sucesso!",
    });

    },

};
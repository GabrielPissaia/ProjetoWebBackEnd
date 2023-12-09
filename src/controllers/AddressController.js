const User = require('../models/User');
const Address = require('../models/Address');

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Endpoints relacionados a endereços de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - number
 *         - district
 *         - city
 *       properties:
 *         street:
 *           type: string
 *           description: Rua do endereço
 *         number:
 *           type: string
 *           description: Número do endereço
 *         district:
 *           type: string
 *           description: Bairro do endereço
 *         city:
 *           type: string
 *           description: Cidade do endereço
 *       example:
 *         street: Rua A
 *         number: 123
 *         district: Bairro X
 *         city: Cidade Y
 */

module.exports = {

    /**
     * @swagger
     * /users/{user_id}/address:
     *   get:
     *     summary: Retorna os endereços de um usuário
     *     tags: [Address]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         description: ID do usuário
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Address'
     */
    async index(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            include: { association: 'address'}
        });

        if (!user) {
            return res.status(400).send({
                status: 0,
                message: 'Produtos não encontrados!'
            });
        }

        return res.status(200).send(user.address)
    },

    /**
     * @swagger
     * /users/{user_id}/address:
     *   post:
     *     summary: Cria um novo endereço para um usuário
     *     tags: [Address]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         description: ID do usuário
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Dados do endereço a ser criado
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Address'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Address'
     */

    async store(req, res) {
        try {
            
            const { user_id } = req.params;
            const { street, number, district, city } = req.body;

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(400).json({
                    status: 0,
                    message: 'Usuario Não encontrado!'
                });
            }

            const address = await Address.create({
                street,
                number,
                district,
                city,
                user_id,
            });

            return res.status(200).json({
                status: 1,
                message: 'Address cadastrado com sucesso!',
                address
            });

            } catch (err) {
                return res.status(400).json({ error: err });
            }
        },

         /**
     * @swagger
     * /users/address/{id}:
     *   delete:
     *     summary: Deleta um endereço pelo ID
     *     tags: [Address]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID do endereço
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             example:
     *               status: 1
     *               message: Address apagado com sucesso!
     *       400:
     *         description: Endereço não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Address não encontrado!
     */

        async delete(req, res) {
            const id = req.params.id;

            try {
                const address = await Address.findByPk(id);

                if (address) {
                    await Address.destroy({ where: { id } });

                    return res.status(200).json({
                        status: 1,
                        message: 'Address apagado com sucesso!',
                    });
                } else {
                    return res.status(400).json({
                        status: 0,
                        message: 'Address não encontrado!'
                    });
                }


            } catch (err) {
                return res.status(400).json({ error: err });
            }
        },

        /**
     * @swagger
     * /users/address/{id}:
     *   put:
     *     summary: Atualiza um endereço pelo ID
     *     tags: [Address]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID do endereço
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Dados do endereço a serem atualizados
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Address'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             example:
     *               status: 1
     *               message: Address atualizado com sucesso!
     *       400:
     *         description: Endereço não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Address não encontrado!
     */
        async update(req, res) {

            const id = req.params.id;
            const { street, number, district, city } = req.body;
    
            try {
                const address = await Address.findByPk(id);
    
                if (address) {
                    await Address.update({ street, number, district, city }, { where: { id } });
    
                    return res.status(200).json({
                        status: 1,
                        message: "Address atualizado com sucesso!",
                    });
    
                } else {
                    return res.status(400).json({
                        status: 0,
                        message: 'Address não encontrado!'
                    });
                }
    
    
            } catch (err) {
                return res.status(400).json({
                    status: 0,
                    message: 'Erro ao atualizar Address!'
                });
            }
        }
    };
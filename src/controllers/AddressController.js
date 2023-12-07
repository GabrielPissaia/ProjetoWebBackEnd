/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: API para gerenciamento de endereços
 */

const User = require('../models/User');
const Address = require('../models/Address');

/**
 * @swagger
 * /users/{user_id}/address:
 *   get:
 *     summary: Lista todos os endereços de um usuário
 *     description: Retorna uma lista de todos os endereços de um usuário.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Uma lista de endereços.
 *         content:
 *           application/json:
 *             example:
 *               addresses: [{ id: 1, street: 'Street 1' }, { id: 2, street: 'Street 2' }]
 *       '401':
 *         description: Não autorizado.
 */
const index = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id, {
      include: { association: 'address' },
    });

    if (!user) {
      return res.status(400).send({
        status: 0,
        message: 'Usuário não encontrado!',
      });
    }

    return res.status(200).send(user.address);
  } catch (error) {
    return res.status(500).send({
      status: 0,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * @swagger
 * /users/{user_id}/address:
 *   post:
 *     summary: Adiciona um endereço a um usuário
 *     description: Adiciona um endereço a um usuário existente.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             street: 'New Street'
 *             number: '123'
 *             district: 'District'
 *             city: 'City'
 *     responses:
 *       '200':
 *         description: Endereço adicionado com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const store = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { street, number, district, city } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({
        status: 0,
        message: 'Usuário não encontrado!',
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
      message: 'Endereço cadastrado com sucesso!',
      address,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, error: 'Erro ao adicionar endereço' });
  }
};

/**
 * @swagger
 * /users/{id}/address:
 *   put:
 *     summary: Atualiza um endereço de um usuário
 *     description: Atualiza um endereço de um usuário existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do endereço.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             street: 'Updated Street'
 *             number: '456'
 *             district: 'Updated District'
 *             city: 'Updated City'
 *     responses:
 *       '200':
 *         description: Endereço atualizado com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { street, number, district, city } = req.body;

    const address = await Address.findByPk(id);

    if (address) {
      await Address.update({ street, number, district, city }, { where: { id } });

      return res.status(200).json({
        status: 1,
        message: 'Endereço atualizado com sucesso!',
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: 'Endereço não encontrado!',
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: 'Erro ao atualizar endereço!',
    });
  }
};

/**
 * @swagger
 * /users/{id}/address:
 *   delete:
 *     summary: Remove um endereço de um usuário
 *     description: Remove um endereço de um usuário existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do endereço.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Endereço removido com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const deleteAddress = async (req, res) => {
  try {
    const id = req.params.id;
    const address = await Address.findByPk(id);

    if (address) {
      await Address.destroy({ where: { id } });

      return res.status(200).json({
        status: 1,
        message: 'Endereço apagado com sucesso!',
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: 'Endereço não encontrado!',
      });
    }
  } catch (error) {
    return res.status(400).json({ status: 0, error: 'Erro ao remover endereço' });
  }
};

module.exports = {
  index,
  store,
  update,
  deleteAddress,
};

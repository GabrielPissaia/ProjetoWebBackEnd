/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gerenciamento de usuários
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários.
 *     responses:
 *       '200':
 *         description: Uma lista de usuários.
 *         content:
 *           application/json:
 *             example:
 *               users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 *       '401':
 *         description: Não autorizado.
 */
const index = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users || users.length === 0) {
      return res.status(200).send({ message: 'Sem usuários cadastrados' });
    }

    return res.status(200).send({ users });
  } catch (error) {
    return res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um novo usuário.
 *     parameters:
 *       - in: body
 *         name: user
 *         required: true
 *         description: O usuário a ser criado.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             password:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       '200':
 *         description: O usuário recém-criado.
 *         content:
 *           application/json:
 *             example:
 *               user: { id: 3, name: 'Bob', email: 'bob@example.com' }
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const store = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const user = await User.create({ name, password, email });

    const token = generateToken({ id: user.id });

    return res.status(200).send({
      status: 1,
      message: 'Usuário cadastrado com sucesso!',
      user,
      token,
    });
  } catch (error) {
    return res.status(400).send({ error: 'Erro ao criar usuário' });
  }
};

/**
 * @swagger
 * /users/{user_id}:
 *   put:
 *     summary: Atualiza um usuário
 *     description: Atualiza um usuário existente.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário a ser atualizado.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: 'Novo Nome'
 *             password: 'novasenha'
 *             email: 'novoemail@example.com'
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const update = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const { user_id } = req.params;

    await User.update({ name, password, email }, { where: { id: user_id } });

    return res.status(200).send({
      status: 1,
      message: 'Usuário atualizado com sucesso!',
    });
  } catch (error) {
    return res.status(400).send({
      status: 0,
      message: 'Erro ao atualizar usuário!',
    });
  }
};

/**
 * @swagger
 * /users/{user_id}:
 *   delete:
 *     summary: Deleta um usuário
 *     description: Deleta um usuário existente.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário a ser deletado.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Usuário deletado com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await User.destroy({ where: { id: user_id } });

    return res.status(200).send({
      status: 1,
      message: 'Usuário deletado com sucesso!',
    });
  } catch (error) {
    return res.status(400).send({
      status: 0,
      message: 'Erro ao deletar usuário!',
    });
  }
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Loga um usuário
 *     description: Loga um usuário existente.
 *     parameters:
 *       - in: body
 *         name: credentials
 *         required: true
 *         description: Credenciais de login.
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       '200':
 *         description: Usuário logado com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).send({
        status: 0,
        message: 'E-mail ou senha incorretos!',
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        status: 0,
        message: 'Senha incorreta!',
      });
    }

    const user_id = user.id;

    await User.update(
      {
        islogged: true,
      },
      {
        where: {
          id: user_id,
        },
      }
    );

    user.password = undefined;

    const token = generateToken({ id: user.id });

    return res.status(200).send({
      status: 1,
      message: 'Usuário logado com sucesso!',
      user,
      token,
    });
} catch (error) {
    return res.status(500).send({
      status: 0,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Gera um token de autenticação.
 * @param {object} params - Parâmetros para geração do token.
 * @param {number} params.id - ID do usuário.
 * @returns {string} Token gerado.
 */
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 78300,
  });
}

module.exports = {
  index,
  store,
  update,
  deleteUser,
  login,
};

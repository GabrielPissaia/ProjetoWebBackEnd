const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const authConfig = require('../config/auth');

const PAGE_SIZE = 5;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints relacionados à autenticação
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       required:
 *         - password
 *         - email
 *       properties:
 *         password:
 *           type: string
 *           description: Senha do usuário
 *         email:
 *           type: string
 *           description: E-mail do usuário
 *       example:
 *         password: password123
 *         email: john.doe@example.com
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Auth]
 *     requestBody:
 *       description: Dados do usuário para autenticação
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthUser'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               status: 1
 *               message: Usuário logado com sucesso!
 *               user:
 *                 $ref: '#/components/schemas/User'
 *               token: string
 *       400:
 *         description: E-mail ou senha incorretos
 *         content:
 *           application/json:
 *             example:
 *               status: 0
 *               message: E-mail ou senha incorreto!
 */
async function login(req, res) {
    const { password, email, isLogged } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(400).send({
            status: 0,
            message: 'E-mail ou senha incorreto!'
        });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({
            status: 0,
            message: 'Senha incorreta!'
        });
    }

    const user_id = user.id;

    await User.update({
        isLogged
    }, {
        where: {
            id: user_id
        }   
    });

    user.password = undefined;
    
    const token = generateToken({ id: user.id });

    return res.status(200).send({
        status: 1,
        message: 'Usuario Logado com sucesso!',
        user, token
    });
}

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Retorna a lista de usuários paginada
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 totalCount:
 *                   type: integer
 *                   description: Número total de usuários
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas
 *                 currentPage:
 *                   type: integer
 *                   description: Página atual
 *       500:
 *         description: Erro ao buscar usuários
 */
async function index(req, res) {
    const { page = 0 } = req.query;

    try {
        const users = await User.findAndCountAll({
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
        });

        if (users.count === 0) {
            return res.status(200).json({ message: 'Sem usuários cadastrados' });
        }

        const totalPages = Math.ceil(users.count / PAGE_SIZE);

        return res.status(200).json({
            users: users.rows,
            totalCount: users.count,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}

/**
 * @swagger
 * /auth/users:
 *   post:
 *     summary: Cadastra um novo usuário ou admin
 *     tags: [Auth]
 *     requestBody:
 *       description: Dados do usuário a ser cadastrado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro no cadastro
 *         content:
 *           application/json:
 *             example:
 *               status: 0
 *               message: Erro no cadastro
 */
async function store(req, res) {
    const { name, password, email, isAdmin } = req.body;

    if (isAdmin) {
        try {
            const admin = await Admin.create({ name, password, email });
            const token = generateToken({ id: admin.id });

            return res.status(200).json({
                status: 1,
                message: 'Admin cadastrado com sucesso!',
                admin,
                token
            });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    try {
        const user = await User.create({ name, password, email });
        const token = generateToken({ id: user.id });

        return res.status(200).send({
            status: 1,
            menssage: 'usuario cadastrado com sucesso!',
            user, token
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

/**
 * @swagger
 * /auth/users/{user_id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Dados do usuário a serem atualizados
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               status: 1
 *               message: Usuário atualizado com sucesso!
 *       500:
 *         description: Erro ao atualizar o usuário
 */
async function update(req, res) {
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
}

/**
 * @swagger
 * /auth/users/{user_id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Auth]
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
 *             example:
 *               status: 1
 *               message: Usuário deletado com sucesso!
 *       500:
 *         description: Erro ao deletar o usuário
 */
async function deleteUser(req, res) {
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
}

/**
 * Função auxiliar para gerar token JWT.
 * @param {Object} params - Parâmetros para o token.
 * @returns {string} - Token JWT gerado.
 */
function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300,
    });
}

module.exports = {
    login,
    index,
    store,
    update,
    deleteUser
};

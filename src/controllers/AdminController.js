const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300,
    });
}

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints relacionados a administradores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - name
 *         - password
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do administrador
 *         password:
 *           type: string
 *           description: Senha do administrador
 *         email:
 *           type: string
 *           description: Email do administrador
 *       example:
 *         name: Admin1
 *         password: senha123
 *         email: admin1@example.com
 */

module.exports = {

    /**
     * @swagger
     * /admins:
     *   post:
     *     summary: Cadastra um novo administrador
     *     tags: [Admin]
     *     requestBody:
     *       description: Dados do administrador a ser cadastrado
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Admin'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Admin'
     */

    async store(req, res) {
        const { name, password, email } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = await Admin.create({ name, password: hashedPassword, email });
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
    },

    /**
     * @swagger
     * /admins:
     *   get:
     *     summary: Retorna a lista de todos os administradores
     *     tags: [Admin]
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Admin'
     */

    async getAllAdmins(req, res) {
        try {
            const admins = await Admin.findAll();
            return res.status(200).json({
                status: 1,
                message: 'Lista de todos os Admins',
                admins,
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: 'Erro ao recuperar a lista de Admins',
                error: error.message,
            });
        }
    },

    /**
     * @swagger
     * /admins/{adminId}/users/{userId}:
     *   delete:
     *     summary: Deleta um usuário pelo ID, realizado por um administrador
     *     tags: [Admin]
     *     parameters:
     *       - in: path
     *         name: adminId
     *         required: true
     *         description: ID do administrador
     *         schema:
     *           type: integer
     *       - in: path
     *         name: userId
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
     *               message: Usuário deletado com sucesso pelo Admin!
     *       404:
     *         description: Admin não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Admin não encontrado!
     *       500:
     *         description: Erro ao deletar o usuário pelo Admin
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Erro ao deletar o usuário pelo Admin
     */

    async deleteUser(req, res) {
        const { adminId, userId } = req.params;

        try {
            const admin = await Admin.findByPk(adminId);

            if (!admin) {
                return res.status(404).json({
                    status: 0,
                    message: 'Admin não encontrado!',
                });
            }

            await Admin.deleteUser(adminId, userId);

            return res.status(200).json({
                status: 1,
                message: 'Usuário deletado com sucesso pelo Admin!',
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: 'Erro ao deletar o usuário pelo Admin',
                error: error.message,
            });
        }
    },

     /**
     * @swagger
     * /admins/{adminId}:
     *   put:
     *     summary: Atualiza um administrador pelo ID
     *     tags: [Admin]
     *     parameters:
     *       - in: path
     *         name: adminId
     *         required: true
     *         description: ID do administrador
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Dados do administrador a serem atualizados
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Admin'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             example:
     *               status: 1
     *               message: Admin atualizado com sucesso!
     *       404:
     *         description: Admin não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Admin não encontrado!
     *       500:
     *         description: Erro ao atualizar o Admin
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Erro ao atualizar o Admin
     */

    async updateAdmin(req, res) {
        const { adminId } = req.params;
        const { name, password, email } = req.body;

        try {
            const admin = await Admin.findByPk(adminId);

            if (!admin) {
                return res.status(404).json({
                    status: 0,
                    message: 'Admin não encontrado!',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await admin.update({ name, password: hashedPassword, email });

            return res.status(200).json({
                status: 1,
                message: 'Admin atualizado com sucesso!',
                admin,
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: 'Erro ao atualizar o Admin',
                error: error.message,
            });
        }
    },

     /**
     * @swagger
     * /admins/{adminId}:
     *   delete:
     *     summary: Deleta um administrador pelo ID
     *     tags: [Admin]
     *     parameters:
     *       - in: path
     *         name: adminId
     *         required: true
     *         description: ID do administrador
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             example:
     *               status: 1
     *               message: Admin deletado com sucesso!
     *       404:
     *         description: Admin não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Admin não encontrado!
     *       500:
     *         description: Erro ao deletar o Admin
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Erro ao deletar o Admin
     */
    
    async deleteAdmin(req, res) {
        const { adminId } = req.params;
    
        try {
            const admin = await Admin.findByPk(adminId);
    
            if (!admin) {
                return res.status(404).json({
                    status: 0,
                    message: 'Admin não encontrado!',
                });
            }
    
            await admin.destroy();
    
            return res.status(200).json({
                status: 1,
                message: 'Admin deletado com sucesso!',
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: 'Erro ao deletar o Admin',
                error: error.message,
            });
        }
    }
    
};
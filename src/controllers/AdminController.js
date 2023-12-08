const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300,
    });
}

module.exports = {
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
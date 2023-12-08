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
    },
};
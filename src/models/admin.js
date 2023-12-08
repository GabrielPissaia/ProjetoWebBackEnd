const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class Admin extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
        }, { sequelize });
    }
    
    static async deleteUser(userId) {
        await this.sequelize.models.User.destroy({ where: { id: userId } });
    }

    static async deleteAdmin(adminId) {
        await this.destroy({ where: { id: adminId } });
    }
}

module.exports = Admin;
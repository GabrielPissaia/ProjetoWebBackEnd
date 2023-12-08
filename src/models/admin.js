const { DataTypes, Model } = require('sequelize');

class Admin extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
        }, { sequelize });
    }
}

module.exports = Admin;
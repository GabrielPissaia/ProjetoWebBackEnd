module.exports = {
    host: 'localhost',
    dialect: 'mysql',
    username: 'root',
    password: '123789',
    database: 'gabrielpiss',
    define: {
        // acressentando o timestamps para armazenar
        // que hora foi criado e o momento que foi atualizado 
        // o registro
        timestamps: true, 
        underscored: true,
    },
};
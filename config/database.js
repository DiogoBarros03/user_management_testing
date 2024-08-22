const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('user_management', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;
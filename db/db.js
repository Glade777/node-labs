
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("labs_node_js", "dari", "", {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    logging: false,
});

module.exports = sequelize;
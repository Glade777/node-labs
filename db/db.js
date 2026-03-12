const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("labs_node_js", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

module.exports = sequelize;

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "labs_node_js",
  password: "root",
  port: 5432,
});

module.exports = pool;

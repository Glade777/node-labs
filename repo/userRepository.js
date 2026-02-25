const user = require("../models/user");

class userRepository {
  costructor(db) {
    this.db = db;
  }

  async getAll() {
    const query = `SELECT * FROM users`;
    const res = await this.db.query(query);

    return res.rows.map((row) => {
      return new user(row.userId, row.name, row.contacts, row.balance);
    });
  }

  async getUserById(Id) {
    const query = `SELECT user_id FROM users WHERE user_id = 1$`;
    const res = await this.db.query(query, [Id]);

    const row = res.rows[0];
    return new user(row.userId, row.name, row.contacts, row.balance);
  }
}

module.exports = userRepository;

const user = require("../models/user");

class userRepository {
  constructor(db) {
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
    const query = `SELECT * FROM users WHERE user_id = $1`;
    const res = await this.db.query(query, [Id]);

    const row = res.rows[0];
    return new user(row.user_id, row.name, row.contacts, row.balance);
  }

  async createUser(User) {
    const query = `
      INSERT INTO users (name, balance, contacts, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [User.name, User.balance, User.contacts, User.password];

    const res = await this.db.query(query, values);
    const row = res.rows[0];
    return new user(
      row.user_id,
      row.name,
      row.balance || 0,
      row.contacts || [],
      row.password_hash,
    );
  }

  async deleteUser(Id) {
    const query = `DELETE FROM users WHERE user_id = 1$`;
    const res = this.db.query(query, [Id]);
    return res.rowCount > 0;
  }

  async loginUser(name, password) {
    const user = await repo.user.getUserByName(name);
    console.log(user);
    if (!user) return null;

    const isValid = await hash.comparePassword(password, user.password_hash);

    if (!isValid) return null;

    return user;
  }

  async updateUserById(Id, newUser) {
    const query = `
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        contacts = COALESCE($2, contacts),
        balance = COALESCE($3, balance)
      WHERE user_id = $4
      RETURNING *;
    `;
    const values = [
      newUser.name || null,
      newUser.contacts || null,
      newUser.balance || null,
      Id,
    ];

    const res = await this.db.query(query, values);
    const row = res.rows[0];

    return new user(
      row.user_id,
      row.name,
      row.contacts || "",
      row.balance || 0,
    );
  }

  async getUserByName(name) {
    const res = await this.db.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);
    return res.rows[0] || null;
  }
}

module.exports = userRepository;

class User {
  constructor(userId, name, contacts = [], balance, password_hash) {
    this.userId = userId;
    this.name = name;
    this.contacts = contacts;
    this.balance = balance;
    this.password_hash = password_hash;
  }
}

module.exports = User;

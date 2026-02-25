class User {
  constructor(userId, name, contacts = [], balance) {
    this.userId = userId;
    this.name = name;
    this.contacts = contacts;
    this.balance = balance;
  }
}

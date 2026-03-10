const repo = require("../repo/repository");
const hash = require("../utilits/hashing");

class userService {
  async createUser(userData) {
    const { name, password, contacts, balance } = userData;
    const newUser = {
      name: name,
      contacts: contacts || "",
      balance: balance || 0,
      password: await hash.hashPassword(password),
    };
    return await repo.user.createUser(newUser);
  }

  async getUserById(Id) {
    const userId = await repo.user.getUserById(Id);
    return userId;
  }

  async updateUserById(Id, updateUser) {
    const { name, contacts } = updateUser;
    const newUser = {
      name: name,
      contacts: contacts,
    };
    const updatedUser = await repo.user.updateUserById(Id, newUser);
    return updatedUser;
  }

  async loginUser(name, password) {
    const hash = await hash.comparePassword(password);
    if (!hash) return null;

    return await hash.user.loginUser(name, hash);
  }
}

module.exports = new userService();

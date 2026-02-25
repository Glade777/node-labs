const repo = require("../repo/repository");

class userService {
  async getById() {
    const users = await repo.user.getById();
    return users;
  }
}

const userService = require("../services/userService");

class userController {
  async createUser(req, res) {
    const UserData = req.body;
    await userService.createUser(UserData);
  }
}

module.exports = new userController();

const userService = require("../services/userService");

class userController {
  async getById(req, res) {
    const users = userService.getById();
    res.render("userInfo", { users: users });
  }
}

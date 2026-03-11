const userService = require("../services/userService");

class userController {
  async createUser(req, res) {
    const UserData = req.body;
    const newUser = await userService.createUser(UserData);
    req.session.newUser = {
      id: newUser.userId,
      name: newUser.name,
      balance: newUser.balance,
    };
    res.status(201).json(newUser);
  }

  async getUserById(req, res) {
    const userId = req.params.userId;
    const parseId = parseInt(userId);
    const user = await userService.getUserById(parseId);
    res.render("userInfo", { user: user, currentUser: req.session.newUser });
  }

  async updateUserById(req, res) {
    const userId = req.params.userId;
    const parseId = parseInt(userId);
    const UserData = req.body;
    const updateUser = await userService.updateUserById(parseId, UserData);
    res.json(updateUser);
  }
}

module.exports = new userController();

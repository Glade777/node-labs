class loginController {
  async getLogin(req, res) {
    res.render("login");
  }
  async getRegister(req, res) {
    res.render("register");
  }
}

module.exports = new loginController();

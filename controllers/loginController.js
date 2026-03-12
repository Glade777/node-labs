const userService = require("../services/userService");

class LoginController {
    async getLogin(req, res) {
        res.render("login");
    }

    async getRegister(req, res) {
        res.render("register");
    }

    async postLogin(req, res) {
        try {
            const { name, password } = req.body;

            const user = await userService.loginUser(name, password);

            if (!user) {
                return res.status(401).json({
                    error: "Невірний логін або пароль",
                });
            }

            req.session.newUser = {
                user_id: user.user_id,
                id: user.user_id,
                name: user.name,
                balance: user.balance,
            };

            res.status(200).json({
                userId: user.user_id,
            });
        } catch (error) {
            res.status(500).json({
                error: error.message,
            });
        }
    }
}

module.exports = new LoginController();
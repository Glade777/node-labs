const userService = require("../services/userService");

class UserController {
    async createUser(req, res) {
        try {
            const userData = req.body;
            const newUser = await userService.createUser(userData);

            req.session.newUser = {
                user_id: newUser.user_id,
                id: newUser.user_id,
                name: newUser.name,
                balance: newUser.balance,
            };

            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const user = await userService.getUserById(userId);

            if (!user) {
                return res.status(404).send("Користувача не знайдено");
            }

            res.render("userInfo", {
                user,
                currentUser: req.session.newUser,
            });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }

    async updateUserById(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const userData = req.body;

            const updatedUser = await userService.updateUserById(userId, userData);

            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UserController();
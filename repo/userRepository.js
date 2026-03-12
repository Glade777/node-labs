const User = require("../models/User");
const hash = require("../utilits/hashing");

class UserRepository {
    async getAll() {
        return await User.findAll({
            order: [["user_id", "ASC"]],
        });
    }

    async getUserById(id) {
        return await User.findByPk(Number(id));
    }

    async getUserByName(name) {
        return await User.findOne({
            where: { name },
        });
    }

    async createUser(userData) {
        const createdUser = await User.create({
            name: userData.name,
            contacts: userData.contacts ?? "",
            balance: userData.balance ?? 0,
            password_hash: userData.password_hash,
        });

        return createdUser;
    }

    async updateUserById(id, newUser) {
        const user = await User.findByPk(Number(id));

        if (!user) {
            throw new Error("Користувача не знайдено");
        }

        await user.update({
            name: newUser.name ?? user.name,
            contacts: newUser.contacts ?? user.contacts,
            balance: newUser.balance ?? user.balance,
        });

        return user;
    }

    async deleteUser(id) {
        const deletedCount = await User.destroy({
            where: { user_id: Number(id) },
        });

        return deletedCount > 0;
    }

    async loginUser(name, password) {
        const user = await this.getUserByName(name);

        if (!user) {
            return null;
        }

        const isValid = await hash.comparePassword(password, user.password_hash);

        if (!isValid) {
            return null;
        }

        return user;
    }
}

module.exports = UserRepository;
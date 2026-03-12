const repo = require("../repo/repository");
const hash = require("../utilits/hashing");

class UserService {
    async createUser(userData) {
        const { name, password, contacts, balance } = userData;

        if (!name || !password) {
            throw new Error("Ім'я та пароль обов'язкові");
        }

        const existingUser = await repo.user.getUserByName(name);

        if (existingUser) {
            throw new Error("Користувач з таким ім’ям вже існує");
        }

        const newUser = {
            name,
            contacts: contacts || "",
            balance: balance || 0,
            password_hash: await hash.hashPassword(password),
        };

        return await repo.user.createUser(newUser);
    }

    async getUserById(id) {
        return await repo.user.getUserById(id);
    }

    async updateUserById(id, updateUser) {
        const { name, contacts, balance } = updateUser;

        const newUser = {
            name,
            contacts,
            balance,
        };

        return await repo.user.updateUserById(id, newUser);
    }

    async loginUser(name, password) {
        const user = await repo.user.getUserByName(name);

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

module.exports = new UserService();
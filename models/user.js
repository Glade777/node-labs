const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const User = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contacts: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        balance: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "users",
        timestamps: false,
    }
);

module.exports = User;
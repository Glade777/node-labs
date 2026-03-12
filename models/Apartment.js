const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Apartment = sequelize.define(
    "Apartment",
    {
        apartment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "available",
        },
    },
    {
        tableName: "apartments",
        timestamps: false,
    }
);

module.exports = Apartment;
const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const ApartmentParams = sequelize.define(
    "ApartmentParams",
    {
        apartment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        rooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        area: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        floor: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "apartment_params",
        timestamps: false,
    }
);

module.exports = ApartmentParams;
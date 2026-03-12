const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const ApartmentDescription = sequelize.define(
    "ApartmentDescription",
    {
        apartment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        full_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        features: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
    },
    {
        tableName: "apartment_descriptions",
        timestamps: false,
    }
);

module.exports = ApartmentDescription;
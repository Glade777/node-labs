const User = require("./User");
const Apartment = require("./Apartment");
const ApartmentParams = require("./ApartmentParams");
const ApartmentDescription = require("./ApartmentDescription");

User.hasMany(Apartment, {
    foreignKey: "owner_id",
    as: "apartments",
});

Apartment.belongsTo(User, {
    foreignKey: "owner_id",
    as: "owner",
});

Apartment.hasOne(ApartmentParams, {
    foreignKey: "apartment_id",
    as: "params",
});

ApartmentParams.belongsTo(Apartment, {
    foreignKey: "apartment_id",
    as: "apartment",
});

Apartment.hasOne(ApartmentDescription, {
    foreignKey: "apartment_id",
    as: "description",
});

ApartmentDescription.belongsTo(Apartment, {
    foreignKey: "apartment_id",
    as: "apartment",
});

module.exports = {
    User,
    Apartment,
    ApartmentParams,
    ApartmentDescription,
};
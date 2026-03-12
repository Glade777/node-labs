const {
    Apartment,
    ApartmentParams,
    ApartmentDescription,
    User
} = require("../models");

class ApartmentRepository {

    async getAll() {
        const apartments = await Apartment.findAll({
            include: [
                { model: ApartmentParams, as: "params" },
                { model: ApartmentDescription, as: "description" },
                { model: User, as: "owner", attributes: ["user_id", "name", "contacts"] }
            ],
            order: [["apartment_id", "ASC"]]
        });

        return apartments;
    }

    async getById(id) {
        const apartment = await Apartment.findByPk(id, {
            include: [
                { model: ApartmentParams, as: "params" },
                { model: ApartmentDescription, as: "description" },
                { model: User, as: "owner", attributes: ["user_id", "name", "contacts"] }
            ]
        });

        return apartment;
    }
}

module.exports = ApartmentRepository;
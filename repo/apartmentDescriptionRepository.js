const { ApartmentDescription } = require("../models");

class ApartmentDescriptionRepository {

    async getAll() {
        const descriptions = await ApartmentDescription.findAll();

        return descriptions;
    }

}

module.exports = ApartmentDescriptionRepository;
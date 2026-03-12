const { ApartmentDescription } = require("../models");

class ApartmentDescriptionService {

    async getDescription() {
        const descriptions = await ApartmentDescription.findAll();
        return descriptions;
    }

}

module.exports = new ApartmentDescriptionService();
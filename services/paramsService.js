const { ApartmentParams } = require("../models");

class ApartmentParamsService {

    async getParams() {
        const params = await ApartmentParams.findAll();
        return params;
    }

}

module.exports = new ApartmentParamsService();
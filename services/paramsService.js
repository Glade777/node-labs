const repo = require("../repo/repository");

class ApartmentParamsService {
  async getParams() {
    const params = await repo.params.getAll();
    return params;
  }
}

module.exports = new ApartmentParamsService();

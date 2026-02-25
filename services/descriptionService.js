const repo = require("../repo/repository");

class ApartmentDescriptionService {
  async getDescription() {
    const description = await repo.description.getAll();
    return description;
  }
}

module.exports = new ApartmentDescriptionService();

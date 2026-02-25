const apartmentDescription = require("../models/ApartmentDescription");

class apartmentDescriptionRepository {
  constructor(db) {
    this.db = db;
  }
  async getAll() {
    return this.db.map(
      (item) =>
        new apartmentDescription(
          item.description.fullText,
          item.description.features,
        ),
    );
  }
}

module.exports = apartmentDescriptionRepository;

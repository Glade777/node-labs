const ApartmentParams = require("../models/apartmentParams");

class ApartmentParamsRepository {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    return this.db.map(
      (item) =>
        new ApartmentParams(
          item.params.rooms,
          item.params.area,
          item.params.floor,
          item.params.address,
        ),
    );
  }
}

module.exports = ApartmentParamsRepository;

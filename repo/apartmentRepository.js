const apartment = require("../models/Apartment");

class apartmentRepository {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    return this.db.map(
      (item) =>
        new apartment(
          item.apartmentId,
          item.title,
          item.price,
          item.params,
          item.description,
          item.ownerId,
        ),
    );
  }

  async getById(id) {
    const targetId = parseInt(id);
    const item = this.db.find((item) => item.apartmentId === targetId);

    if (!item) {
      return null;
    }

    return new apartment(
      item.apartment_id,
      item.title,
      item.price,
      item.params,
      item.description,
      item.ownerId,
    );
  }
}

module.exports = apartmentRepository;

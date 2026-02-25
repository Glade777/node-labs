const apartmentDescription = require("../models/ApartmentDescription");

class apartmentDescriptionRepository {
  constructor(db) {
    this.db = db;
  }
  // async getAll() {
  //   return this.db.map(
  //     (item) =>
  //       new apartmentDescription(
  //         item.description.fullText,
  //         item.description.features,
  //       ),
  //   );
  // }

  async getAll() {
    const query = `SELECT full_text, features FROM apartment_descriptions`;
    const res = await this.db.query(query);

    return res.rows.map(
      (row) => new apartmentDescription(row.fullText, row.features),
    );
  }
}

module.exports = apartmentDescriptionRepository;

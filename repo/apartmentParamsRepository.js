const ApartmentParams = require("../models/apartmentParams");

class ApartmentParamsRepository {
  constructor(db) {
    this.db = db;
  }

  // async getAll() {
  //   return this.db.map(
  //     (item) =>
  //       new ApartmentParams(
  //         item.params.rooms,
  //         item.params.area,
  //         item.params.floor,
  //         item.params.address,
  //       ),
  //   );
  // }

  async getAll() {
    const query = `SELECT rooms, area, floor, address FROM apartment_params`;

    const res = await this.db.query(query);

    return res.rows.map(
      (row) =>
        new ApartmentParams(
          row.rooms,
          parseFloat(row.area),
          row.floor,
          row.address,
        ),
    );
  }
}

module.exports = ApartmentParamsRepository;

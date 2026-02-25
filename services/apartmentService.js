const repo = require("../repo/repository");

class ApartmentService {
  // асинхронна
  async getApartmentSorted(order, rooms) {
    let apartment = await repo.apartments.getAll();

    if (rooms) {
      const roomCount = parseInt(rooms);
      apartment = apartment.filter((p) => {
        return Number(p.params.rooms) === roomCount;
      });
    }

    return apartment.sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else if (order === "desc") {
        return b.price - a.price;
      } else return 0;
    });
  }

  async getApartmentById(parseid) {
    const apartmentId = await repo.apartments.getById(parseid);

    return apartmentId;
  }
}

module.exports = new ApartmentService();

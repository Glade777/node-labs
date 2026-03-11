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

  async purchaseApartment(apartmentId, buyerId) {
    // 1. Отримуємо дані через репозиторій
    const apartmentInstance = await repo.apartments.getById(apartmentId);
    const buyerInstance = await repo.user.getUserById(buyerId);

    // 2. Бізнес-валідація ДО транзакції
    if (!apartmentInstance) {
      throw new Error(`Квартиру з ID ${apartmentId} не знайдено`);
    }

    if (apartmentInstance.status === "sold") {
      throw new Error(`Квартира вже продана`);
    }

    if (apartmentInstance.ownerId === buyerId) {
      throw new Error(`Покупець вже є власником цієї квартири`);
    }

    if (!buyerInstance) {
      throw new Error(`Користувача з ID ${buyerId} не знайдено`);
    }

    if (buyerInstance.balance < apartmentInstance.price) {
      throw new Error(
        `Недостатньо коштів: потрібно ${apartmentInstance.price}, є ${buyerInstance.balance}`,
      );
    }

    // 3. Викликаємо транзакцію в репозиторії
    const result = await repo.apartments.executePurchaseTransaction(
      apartmentInstance,
      buyerInstance,
    );

    return result;
  }
}

module.exports = new ApartmentService();

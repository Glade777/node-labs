const repo = require("../repo/repository");

class ApartmentService {
  // асинхронна
  async getApartmentSorted(order, rooms, page = 1, limit = 5) {
    let apartment = await repo.apartments.getAll();

    if (rooms) {
      const roomCount = parseInt(rooms);
      apartment = apartment.filter((p) => {
        return Number(p.params.rooms) === roomCount;
      });
    }

    apartment = apartment.sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else if (order === "desc") {
        return b.price - a.price;
      } else return 0;
    });

    //пагінація

    const total = apartment.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit; //скільки елементів буде пропущено на наст сторінці
    const data = apartment.slice(offset, offset + limit);
    return { data, pagination: { page, limit, total, totalPages } };
  }

  async getApartmentById(parseid) {
    const apartmentId = await repo.apartments.getById(parseid);

    return apartmentId;
  }

  async createApartment(data, ownerId) {
    const { title, price, rooms, area, floor, address, fullText } = data;

    if (!title || !price) {
      throw new Error("Назва та ціна обов'язкові");
    }

    return await repo.apartments.createApartment({
      title,
      price,
      rooms,
      area,
      floor,
      address,
      fullText,
      ownerId,
    });
  }

  async deleteApartment(apartmentId, userId) {
    const apartment = await repo.apartments.getById(apartmentId);

    if (!apartment) {
      throw new Error("Квартиру не знайдено");
    }

    if (apartment.ownerId !== userId) {
      throw new Error("Ви не є власником цієї квартири");
    }

    return await repo.apartments.deleteApartment(apartmentId);
  }

  async updateApartment(apartmentId, userId, data) {
    const apartment = await repo.apartments.getById(apartmentId);

    if (!apartment) {
      throw new Error("Квартиру не знайдено");
    }

    if (apartment.ownerId !== userId) {
      throw new Error("Ви не є власником цієї квартири");
    }

    return await repo.apartments.updateApartment(apartmentId, data);
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

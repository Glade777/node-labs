const repo = require("../repo/repository");

class ApartmentService {
    async getApartmentSorted(order, rooms, page = 1, limit = 5) {
        let apartments = await repo.apartments.getAll();

        if (rooms) {
            const roomCount = parseInt(rooms);
            apartments = apartments.filter((apartment) => {
                return Number(apartment.params?.rooms) === roomCount;
            });
        }

        apartments = apartments.sort((a, b) => {
            const priceA = Number(a.price);
            const priceB = Number(b.price);

            if (order === "asc") {
                return priceA - priceB;
            }

            if (order === "desc") {
                return priceB - priceA;
            }

            return 0;
        });

        const total = apartments.length;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;
        const data = apartments.slice(offset, offset + limit);

        return {
            data,
            pagination: { page, limit, total, totalPages },
        };
    }

    async getApartmentById(apartmentId) {
        return await repo.apartments.getById(apartmentId);
    }

    async createApartment(data, ownerId) {
        const { title, price, rooms, area, floor, address, fullText, features } =
            data;

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
            features,
            ownerId,
        });
    }

    async deleteApartment(apartmentId, userId) {
        const apartment = await repo.apartments.getById(apartmentId);

        if (!apartment) {
            throw new Error("Квартиру не знайдено");
        }

        if (Number(apartment.owner_id) !== Number(userId)) {
            throw new Error("Ви не є власником цієї квартири");
        }

        return await repo.apartments.deleteApartment(apartmentId);
    }

    async updateApartment(apartmentId, userId, data) {
        const apartment = await repo.apartments.getById(apartmentId);

        if (!apartment) {
            throw new Error("Квартиру не знайдено");
        }

        if (Number(apartment.owner_id) !== Number(userId)) {
            throw new Error("Ви не є власником цієї квартири");
        }

        return await repo.apartments.updateApartment(apartmentId, data);
    }

    async purchaseApartment(apartmentId, buyerId) {
        const apartment = await repo.apartments.getById(apartmentId);

        if (!apartment) {
            throw new Error(`Квартиру з ID ${apartmentId} не знайдено`);
        }

        if (apartment.status === "sold") {
            throw new Error("Квартира вже продана");
        }

        if (Number(apartment.owner_id) === Number(buyerId)) {
            throw new Error("Покупець вже є власником цієї квартири");
        }

        return await repo.apartments.executePurchaseTransaction(
            apartmentId,
            buyerId,
        );
    }
}

module.exports = new ApartmentService();
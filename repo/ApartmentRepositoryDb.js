const sequelize = require("../db/db");
const {
    Apartment,
    ApartmentParams,
    ApartmentDescription,
    User,
} = require("../models");

class ApartmentRepository {
    async getAll() {
        const apartments = await Apartment.findAll({
            include: [
                {
                    model: ApartmentParams,
                    as: "params",
                },
                {
                    model: ApartmentDescription,
                    as: "description",
                },
            ],
            order: [["apartment_id", "ASC"]],
        });

        return apartments;
    }

    async getById(id) {
        const apartment = await Apartment.findByPk(parseInt(id), {
            include: [
                {
                    model: User,
                    as: "owner",
                    attributes: ["user_id", "name", "contacts", "balance"],
                },
                {
                    model: ApartmentParams,
                    as: "params",
                },
                {
                    model: ApartmentDescription,
                    as: "description",
                },
            ],
        });

        return apartment;
    }

    async createApartment(data) {
        const transaction = await sequelize.transaction();

        try {
            const apartment = await Apartment.create(
                {
                    title: data.title,
                    price: data.price,
                    owner_id: data.ownerId,
                    status: "active",
                },
                { transaction },
            );

            await ApartmentParams.create(
                {
                    apartment_id: apartment.apartment_id,
                    rooms: data.rooms,
                    area: data.area,
                    floor: data.floor,
                    address: data.address,
                },
                { transaction },
            );

            await ApartmentDescription.create(
                {
                    apartment_id: apartment.apartment_id,
                    full_text: data.fullText,
                    features: data.features || [],
                },
                { transaction },
            );

            await transaction.commit();

            return {
                success: true,
                apartmentId: apartment.apartment_id,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateApartment(apartmentId, data) {
        const transaction = await sequelize.transaction();

        try {
            const apartment = await Apartment.findByPk(apartmentId, { transaction });

            if (!apartment) {
                throw new Error("Квартиру не знайдено");
            }

            await apartment.update(
                {
                    title: data.title ?? apartment.title,
                    price: data.price ?? apartment.price,
                },
                { transaction },
            );

            const params = await ApartmentParams.findByPk(apartmentId, {
                transaction,
            });

            if (params) {
                await params.update(
                    {
                        rooms: data.rooms ?? params.rooms,
                        area: data.area ?? params.area,
                        floor: data.floor ?? params.floor,
                        address: data.address ?? params.address,
                    },
                    { transaction },
                );
            }

            const description = await ApartmentDescription.findByPk(apartmentId, {
                transaction,
            });

            if (description) {
                await description.update(
                    {
                        full_text: data.fullText ?? description.full_text,
                        features: data.features ?? description.features,
                    },
                    { transaction },
                );
            }

            await transaction.commit();

            return {
                success: true,
                apartmentId,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteApartment(apartmentId) {
        const transaction = await sequelize.transaction();

        try {
            await ApartmentParams.destroy({
                where: { apartment_id: apartmentId },
                transaction,
            });

            await ApartmentDescription.destroy({
                where: { apartment_id: apartmentId },
                transaction,
            });

            const deletedCount = await Apartment.destroy({
                where: { apartment_id: apartmentId },
                transaction,
            });

            if (!deletedCount) {
                throw new Error("Квартиру не знайдено");
            }

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async executePurchaseTransaction(apartmentId, buyerId) {
        const transaction = await sequelize.transaction();

        try {
            const apartment = await Apartment.findByPk(apartmentId, { transaction });

            if (!apartment) {
                throw new Error("Квартиру не знайдено");
            }

            const buyer = await User.findByPk(buyerId, { transaction });

            if (!buyer) {
                throw new Error("Покупця не знайдено");
            }

            const seller = await User.findByPk(apartment.owner_id, { transaction });

            if (!seller) {
                throw new Error("Продавця не знайдено");
            }

            if (apartment.status === "sold") {
                throw new Error("Квартира вже продана");
            }

            if (Number(buyer.balance) < Number(apartment.price)) {
                throw new Error(`Покупець ${buyer.name} має недостатньо коштів`);
            }

            buyer.balance = Number(buyer.balance) - Number(apartment.price);
            seller.balance = Number(seller.balance) + Number(apartment.price);
            apartment.owner_id = buyer.user_id;
            apartment.status = "sold";

            await buyer.save({ transaction });
            await seller.save({ transaction });
            await apartment.save({ transaction });

            await transaction.commit();

            return {
                success: true,
                updatedApartment: apartment,
                updatedBuyer: buyer,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new ApartmentRepository();
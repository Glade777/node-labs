const ApartmentService = require("../services/apartmentService");

class ApartmentController {
    async getApartments(req, res) {
        try {
            const sort = req.query.sort;
            const rooms = req.query.rooms;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const result = await ApartmentService.getApartmentSorted(
                sort,
                rooms,
                page,
                limit,
            );

            const isFetch =
                req.headers.accept && req.headers.accept.includes("json");

            if (isFetch) {
                return res.status(200).json(result);
            }

            res.render("index", {
                apartments: result.data,
                pagination: result.pagination,
                currentUser: req.session.newUser,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    async getApartmentById(req, res) {
        try {
            const apartmentId = parseInt(req.params.apartmentId);
            const apartment = await ApartmentService.getApartmentById(apartmentId);

            if (!apartment) {
                return res.status(404).send("Квартиру не знайдено");
            }

            res.render("apartment", {
                apartment,
                currentUser: req.session.newUser,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    async purchaseApartment(req, res) {
        try {
            const apartmentId = parseInt(req.params.apartmentId);
            const { buyerId } = req.body;

            const result = await ApartmentService.purchaseApartment(
                apartmentId,
                buyerId,
            );

            if (req.session.newUser) {
                req.session.newUser.balance = result.updatedBuyer.balance;
            }

            res.status(200).json({
                message: "Квартиру успішно придбано",
                data: result,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getCreateApartment(req, res) {
        if (!req.session.newUser) {
            return res.redirect("/login");
        }

        res.render("create", { currentUser: req.session.newUser });
    }

    async createApartment(req, res) {
        try {
            if (!req.session.newUser) {
                return res.status(401).json({ error: "Не авторизований" });
            }

            const ownerId =
                req.session.newUser.user_id ?? req.session.newUser.id;

            const result = await ApartmentService.createApartment(req.body, ownerId);

            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteApartment(req, res) {
        try {
            const apartmentId = parseInt(req.params.apartmentId);
            const userId =
                req.session.newUser?.user_id ?? req.session.newUser?.id;

            if (!userId) {
                return res.status(401).json({ error: "Не авторизований" });
            }

            await ApartmentService.deleteApartment(apartmentId, userId);

            res.status(200).json({ message: "Квартиру видалено" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateApartment(req, res) {
        try {
            const apartmentId = parseInt(req.params.apartmentId);
            const userId =
                req.session.newUser?.user_id ?? req.session.newUser?.id;

            if (!userId) {
                return res.status(401).json({ error: "Не авторизований" });
            }

            const result = await ApartmentService.updateApartment(
                apartmentId,
                userId,
                req.body,
            );

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ApartmentController();
const ApartmentService = require("../services/apartmentService");
const ApartmentDescriptionService = require("../services/descriptionService");
const ApartmentParamsService = require("../services/paramsService");
const userService = require("../services/userService");

class ApartmentController {
  async getApartments(req, res) {
    try {
      const sort = req.query.sort;
      const rooms = req.query.rooms;
      const apartments = await ApartmentService.getApartmentSorted(sort, rooms);
      const description = await ApartmentDescriptionService.getDescription();
      const params = await ApartmentParamsService.getParams();

      const isFetch = req.headers.accept && req.headers.accept.includes("json");
      if (isFetch) {
        return res.json(apartments);
      }

      res.render("index", {
        apartments: apartments,
        description: description,
        params: params,
        currentUser: req.session.newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async getApartmentById(req, res) {
    const Id = req.params.apartmentId;
    const parseId = parseInt(Id);
    const description = await ApartmentDescriptionService.getDescription();
    const params = await ApartmentParamsService.getParams();
    const apartment = await ApartmentService.getApartmentById(parseId);

    res.render("apartment", {
      apartment: apartment,
      description: description,
      params: params,
      currentUser: req.session.newUser,
    });
  }

  async purchaseApartment(req, res) {
    try {
      const apartmentId = parseInt(req.params.apartmentId);
      const { buyerId } = req.body;
      console.log("apartmentId:", apartmentId, "buyerId:", buyerId);
      const result = await ApartmentService.purchaseApartment(
        apartmentId,
        buyerId,
      );
      if (req.session.newUser) {
        req.session.newUser.balance = result.updatedBuyer.balance;
      }
      res
        .status(200)
        .json({ message: "Квартиру успішно придбано", data: result });
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
      const ownerId = req.session.newUser.id;
      const result = await ApartmentService.createApartment(req.body, ownerId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteApartment(req, res) {
    try {
      const apartmentId = parseInt(req.params.apartmentId);
      const userId = req.session.newUser?.id;

      if (!userId) {
        return res.status(401).json({ error: "Не авторизований" });
      }

      await ApartmentService.deleteApartment(apartmentId, userId);
      res.status(200).json({ message: "Квартиру видалено" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ApartmentController();

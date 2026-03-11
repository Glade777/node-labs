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
}

module.exports = new ApartmentController();

const ApartmentService = require("../services/ApartmentService");
const ApartmentDescriptionService = require("../services/descriptionService");
const ApartmentParamsService = require("../services/paramsService");

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
    });
  }
}

module.exports = new ApartmentController();

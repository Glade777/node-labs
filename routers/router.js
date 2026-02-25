const ApartmentController = require("../controllers/apartmentController");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  ApartmentController.getApartments(req, res);
});

router.get("/apartment/:apartmentId", (req, res) => {
  ApartmentController.getApartmentById(req, res);
});

module.exports = router;

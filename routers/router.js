const express = require("express");
const router = express.Router();

const ApartmentController = require("../controllers/apartmentController");
const ApartmentFileController = require("../controllers/apartmentFileController");

router.get("/", ApartmentController.getApartments);

router.get("/apartment/:apartmentId", ApartmentController.getApartmentById);

router.get("/file/apartments/sync", ApartmentFileController.getAllSync);

router.get("/file/apartments", ApartmentFileController.getAll);

router.get("/file/apartments/async", ApartmentFileController.getAllAsync);

module.exports = router;
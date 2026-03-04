const ApartmentController = require("../controllers/apartmentController");
const userController = require("../controllers/userController");
const loginController = require("../controllers/loginController");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  ApartmentController.getApartments(req, res);
});

router.get("/apartment/:apartmentId", (req, res) => {
  ApartmentController.getApartmentById(req, res);
});

router.get("/login", (req, res) => {
  loginController.getLogin(req, res);
});

router.get("/login/register", (req, res) => {
  loginController.getRegister(req, res);
});

router.post("/login/register", (req, res) => {
  userController.createUser(req, res);
});

module.exports = router;

const ApartmentController = require("../controllers/apartmentController");
const userController = require("../controllers/userController");
const loginController = require("../controllers/loginController");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  ApartmentController.getApartments(req, res);
});

router.get("/apartment/create", (req, res) => {
  ApartmentController.getCreateApartment(req, res);
});

router.post("/apartment/create", (req, res) => {
  ApartmentController.createApartment(req, res);
});

router.delete("/apartment/:apartmentId", (req, res) => {
  ApartmentController.deleteApartment(req, res);
});

router.patch("/apartment/:apartmentId", (req, res) => {
  ApartmentController.updateApartment(req, res);
});

router.get("/apartment/:apartmentId", (req, res) => {
  ApartmentController.getApartmentById(req, res);
});

router.post("/apartment/:apartmentId/purchase", (req, res) => {
  ApartmentController.purchaseApartment(req, res);
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

router.post("/auth/login", (req, res) => {
  loginController.postLogin(req, res);
});

router.get("/auth/login", (req, res) => {
  res.redirect("/login");
});

router.get("/user/:userId", (req, res) => {
  userController.getUserById(req, res);
});

router.patch("/user/:userId", (req, res) => {
  userController.updateUserById(req, res);
});

module.exports = router;

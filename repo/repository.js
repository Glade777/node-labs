const pool = require("../db/db.js");
const mock = require("../db/mock.js");
const apartmentRepository = require("./apartmentRepository.js");
const apartmentParamsRepository = require("./apartmentParamsRepository.js");
const apartmentDescriptionRepository = require("./apartmentDescriptionRepository.js");

class Repository {
  constructor(db) {
    //створення екземплярів класів
    this.apartment = new apartmentRepository(db.apartments);
    this.params = new apartmentParamsRepository(db.apartments);
    this.description = new apartmentDescriptionRepository(db.apartments);
  }
}

const test = true;
const repository = new Repository(test ? mock : pool);

module.exports = repository;

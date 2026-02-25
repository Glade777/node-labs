const db = require("../db/db.js");
const mock = require("../db/mock.js");
const apartmentRepository = require("./apartmentRepository.js");
const apartmentParamsRepository = require("./apartmentParamsRepository.js");
const apartmentDescriptionRepository = require("./apartmentDescriptionRepository.js");
const apartmentRepositoryDb = require("../repo/ApartmentRepositoryDb.js");

class Repository {
  constructor(db) {
    //створення екземплярів класів
    // this.apartment = new apartmentRepository(db);
    this.params = new apartmentParamsRepository(db);
    this.description = new apartmentDescriptionRepository(db);
    this.apartments = new apartmentRepositoryDb(db);
  }
}

const test = false;
const repository = new Repository(test ? mock : db);

module.exports = repository;

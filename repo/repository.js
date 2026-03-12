const ApartmentRepository = require("./ApartmentRepositoryDb");
const UserRepository = require("./userRepository");

class Repository {
    constructor() {
        this.apartments = ApartmentRepository;
        this.user = new UserRepository();
    }
}

module.exports = new Repository();
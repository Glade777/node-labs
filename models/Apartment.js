class Apartment {
  constructor(apartmentId, title, price, params, description, ownerId) {
    this.apartmentId = apartmentId;
    this.title = title;
    this.price = price;
    this.params = params;
    this.description = description;
    this.ownerId = ownerId;
  }

  #validatePrice(value) {
    return value < 0 ? 0 : value;
  }

  set price(value) {
    this._price = this.#validatePrice(value);
  }

  get price() {
    return this._price;
  }
}

module.exports = Apartment;

const apartment = require("../models/Apartment");
const apartmentParams = require("../models/apartmentParams");
const apartmentDescription = require("../models/ApartmentDescription");
const user = require("../models/user");

class apartmentRepository {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    const query = `
      SELECT 
        a.apartment_id, a.title, a.price, a.owner_id, a.status,
        p.rooms, p.area, p.floor, p.address,
        d.full_text, d.features
      FROM apartments a
      LEFT JOIN apartment_params p ON a.apartment_id = p.apartment_id
      LEFT JOIN apartment_descriptions d ON a.apartment_id = d.apartment_id
      ORDER BY a.apartment_id ASC;
    `;

    const res = await this.db.query(query);
    return res.rows.map((row) => {
      const params = new apartmentParams(
        row.rooms,
        parseFloat(row.area),
        row.floor,
        row.address,
      );

      const description = new apartmentDescription(row.full_text, row.features);

      return new apartment(
        row.apartment_id,
        row.title,
        parseFloat(row.price),
        params,
        description,
        row.owner_id,
        row.status,
      );
    });
  }

  async getById(Id) {
    console.log("repo:", Id);
    const query = `
    SELECT 
        a.*, 
        u.user_id, u.name as user_name, u.balance, u.contacts,
        p.rooms, p.area, p.floor, p.address,
        d.full_text, d.features
    FROM apartments a
    LEFT JOIN users u ON a.owner_id = u.user_id
    LEFT JOIN apartment_params p ON a.apartment_id = p.apartment_id
    LEFT JOIN apartment_descriptions d ON a.apartment_id = d.apartment_id
    WHERE a.apartment_id = $1;
  `;

    const parseId = parseInt(Id);
    const res = await this.db.query(query, [parseId]);
    const row = res.rows[0];

    const params = new apartmentParams(
      row.rooms,
      parseFloat(row.area),
      row.floor,
      row.address,
    );

    const description = new apartmentDescription(row.full_text, row.features);

    const apt = new apartment(
      row.apartment_id,
      row.title,
      parseFloat(row.price),
      params,
      description,
      row.owner_id,
      row.status,
    );

    apt.ownerData = {
      name: row.user_name,
      contacts: row.contacts,
    };

    return apt;
  }

  // Передаємо екземпляри класів Apartment та User (покупець)
  async executePurchaseTransaction(apartmentInstance, buyerInstance) {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      // 1. Знімаємо гроші у покупця (використовуємо дані з екземпляра buyerInstance)
      const buyerRes = await client.query(
        "UPDATE users SET balance = balance - $1 WHERE user_id = $2 AND balance >= $1",
        [apartmentInstance.price, buyerInstance.userId],
      );

      if (buyerRes.rowCount === 0) {
        throw new Error(
          `Покупець ${buyerInstance.name} має недостатньо коштів`,
        );
      }

      // 2. Нараховуємо продавцю (використовуємо ownerId з екземпляра apartmentInstance)
      await client.query(
        "UPDATE users SET balance = balance + $1 WHERE user_id = $2",
        [apartmentInstance.price, apartmentInstance.ownerId],
      );

      // 3. Міняємо статус та власника квартири в БД
      await client.query(
        "UPDATE apartments SET owner_id = $1, status = 'sold' WHERE apartment_id = $2",
        [buyerInstance.userId, apartmentInstance.apartmentId],
      );

      await client.query("COMMIT");

      buyerInstance.balance -= apartmentInstance.price;
      apartmentInstance.status = "sold";
      apartmentInstance.ownerId = buyerInstance.userId;

      return {
        success: true,
        updatedApartment: apartmentInstance,
        updatedBuyer: buyerInstance,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async createApartment(data) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      // 1. створюємо квартиру
      const aptRes = await client.query(
        `INSERT INTO apartments (title, price, owner_id, status)
       VALUES ($1, $2, $3, 'active') RETURNING *`,
        [data.title, data.price, data.ownerId],
      );
      const apt = aptRes.rows[0];

      // 2. створюємо параметри
      await client.query(
        `INSERT INTO apartment_params (apartment_id, rooms, area, floor, address)
       VALUES ($1, $2, $3, $4, $5)`,
        [apt.apartment_id, data.rooms, data.area, data.floor, data.address],
      );

      // 3. створюємо опис
      await client.query(
        `INSERT INTO apartment_descriptions (apartment_id, full_text, features)
       VALUES ($1, $2, $3)`,
        [apt.apartment_id, data.fullText, []],
      );

      await client.query("COMMIT");
      return { apartmentId: apt.apartment_id };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteApartment(apartmentId) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        "DELETE FROM apartment_params WHERE apartment_id = $1",
        [apartmentId],
      );

      await client.query(
        "DELETE FROM apartment_descriptions WHERE apartment_id = $1",
        [apartmentId],
      );

      await client.query("DELETE FROM apartments WHERE apartment_id = $1", [
        apartmentId,
      ]);

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
module.exports = apartmentRepository;

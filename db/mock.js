const Data = {
  apartments: [
    {
      apartmentId: 1,
      title: "2-кімнатна студія в центрі",
      price: 15000,
      // Сутність "Параметри" (ApartmentParams)
      params: {
        rooms: 2,
        area: 60,
        floor: 5,
        address: "вул. Сонячна, 10",
      },
      // Сутність "Опис" (ApartmentDescription)
      description: {
        fullText:
          "Затишна квартира з видом на парк. Є все необхідне для комфортного проживання.",
        features: ["Wi-Fi", "Кондиціонер", "Балкон", "Парковка"],
      },
      ownerId: 101, // Актор: Хазяїн
    },
    {
      apartmentId: 2,
      title: "Затишна смарт-квартира",
      price: 8500,
      params: {
        rooms: 1,
        area: 25,
        floor: 2,
        address: "пр. Миру, 42",
      },
      description: {
        fullText:
          "Компактна квартира для однієї людини. Низькі комунальні платежі.",
        features: ["Wi-Fi", "Пральна машина"],
      },
      ownerId: 102,
    },
    {
      apartmentId: 3,
      title: "Пентхаус з терасою",
      price: 45000,
      params: {
        rooms: 4,
        area: 120,
        floor: 12,
        address: "вул. Морська, 1",
      },
      description: {
        fullText: "Ексклюзивна нерухомість для поціновувачів простору.",
        features: ["Wi-Fi", "Кондиціонер", "Тераса", "Охорона", "Смарт-ТБ"],
      },
      ownerId: 101,
    },
    {
      apartmentId: 5,
      title: "4-кімнатна студія в центрі",
      price: 60000,
      // Сутність "Параметри" (ApartmentParams)
      params: {
        rooms: 4,
        area: 120,
        floor: 2,
        address: "вул. Сонячна, 12",
      },
      // Сутність "Опис" (ApartmentDescription)
      description: {
        fullText:
          "Затишна квартира з видом на парк. Є все необхідне для комфортного проживання.",
        features: ["Wi-Fi", "Кондиціонер", "Балкон", "Парковка"],
      },
      ownerId: 105, // Актор: Хазяїн
    },
  ],
  // Актори системи (для реалізації сценаріїв Хазяїна та Клієнта)
  users: [
    { userId: 101, name: "Олександр", contacts: "" },
    { userId: 102, name: "Марія", contacts: "" },
    { userId: 201, name: "Дмитро", contacts: "" },
  ],
};

module.exports = Data;

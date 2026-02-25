function renderApartments(parameters) {
  const labels = {
    rooms: "Кімнат",
    area: "Площа (м²)",
    floor: "Поверх",
    address: "Адреса",
  };

  const container = document.getElementById("product-list");
  container.innerHTML = `<ul>${parameters
    .map((apart) => {
      const paramsList = Object.keys(apart.params)
        .map(
          (key) => `
        <li>
        <strong>${labels[key]}</strong>${apart.params[key]}
        </li>`,
        )
        .join("");

      return `
      <a href="/apartment/${apart.apartmentId}" id="productClicked" data-id="${apart.apartmentId}"><li class="card">
          <strong>${apart.title}</strong>
          <strong class="price">Ціна: ${apart._price} грн</strong>
          <p>Опис: ${apart.description.fullText || ""}</p>
          <ul>
            ${paramsList}
          </ul>
        </li>`;
    })
    .join("")}</ul>`;
}

async function updateUI() {
  const sort = document.getElementById("sortSelect").value;
  const count = document.getElementById("sortRooms").value;

  let url = `/?rooms=${count}&sort=${sort}`;

  if (!count) {
    url = `/?sort=${sort}`;
  }
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  // const target = target.closest("#productClicked");
  // const apartmentId = target.dataset.id;

  const data = await response.json();
  renderApartments(data);
}

document.getElementById("sortSelect").addEventListener("change", updateUI);
document.getElementById("applyFilters").addEventListener("click", updateUI);

document
  .querySelectorAll("product-list")
  .addEventListener("click", async () => {
    const target = target.closest(".productClicked");
    const apartmentId = target.dataset.id;
    const response = await fetch(`/apartment/${apartmentId}`, {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
  });

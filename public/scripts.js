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
      <a href="/apartment/${apart.apartmentId}" class="productClicked" data-id="${apart.apartmentId}"><li class="card">
          <strong>${apart.title}</strong>
          <strong class="price">Ціна: ${apart._price} грн</strong>
          <p>Опис: ${apart.description.fullText || ""}</p>
          <ul>
            ${paramsList}
          </ul>
        </li></a>`;
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

  const data = await response.json();
  renderApartments(data);
}

// головна сторінка
const sortSelect = document.getElementById("sortSelect");
const applyFilters = document.getElementById("applyFilters");

if (sortSelect) {
  sortSelect.addEventListener("change", updateUI);
}

if (applyFilters) {
  applyFilters.addEventListener("click", updateUI);
}

// сторінка квартири
const purchaseBtn = document.getElementById("purchaseBtn");

if (purchaseBtn) {
  purchaseBtn.addEventListener("click", async () => {
    const apartmentId = purchaseBtn.dataset.apartmentId;
    const buyerId = parseInt(purchaseBtn.dataset.buyerId);
    const messageDiv = document.getElementById("purchase-message");

    purchaseBtn.disabled = true;
    purchaseBtn.textContent = "Обробка...";

    try {
      const response = await fetch(`/apartment/${apartmentId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId }),
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.textContent = "Квартиру успішно придбано!";
        messageDiv.style.color = "green";
        purchaseBtn.textContent = "Продано";
      } else {
        messageDiv.textContent = `${data.error}`;
        messageDiv.style.color = "red";
        purchaseBtn.disabled = false;
        purchaseBtn.textContent = "Придбати";
      }
    } catch (err) {
      messageDiv.textContent = "Помилка з'єднання";
      messageDiv.style.color = "red";
      purchaseBtn.disabled = false;
      purchaseBtn.textContent = "Придбати";
    }
  });
}
const deleteBtn = document.getElementById("deleteBtn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const apartmentId = deleteBtn.dataset.apartmentId;

    if (!confirm("Ви впевнені що хочете видалити оголошення?")) return;

    const response = await fetch(`/apartment/${apartmentId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.href = "/";
    } else {
      const data = await response.json();
      alert(data.error);
    }
  });
}

const updateBtn = document.getElementById("updateBtn");

if (updateBtn) {
  updateBtn.addEventListener("click", async () => {
    const apartmentId = updateBtn.dataset.apartmentId;

    const body = {
      title: document.getElementById("editTitle").value,
      price: parseFloat(document.getElementById("editPrice").value),
      rooms: parseInt(document.getElementById("editRooms").value),
      area: parseFloat(document.getElementById("editArea").value),
      floor: parseInt(document.getElementById("editFloor").value),
      address: document.getElementById("editAddress").value,
      fullText: document.getElementById("editFullText").value,
    };

    const response = await fetch(`/apartment/${apartmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const messageDiv = document.getElementById("update-message");

    if (response.ok) {
      messageDiv.textContent = "Збережено!";
      messageDiv.style.color = "green";
      setTimeout(() => window.location.reload(), 1000);
    } else {
      messageDiv.textContent = data.error;
      messageDiv.style.color = "red";
    }
  });
}

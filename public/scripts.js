function renderApartments(apartments) {
    const labels = {
        rooms: "Кімнат",
        area: "Площа (м²)",
        floor: "Поверх",
        address: "Адреса",
    };

    const container = document.getElementById("product-list");

    if (!apartments.length) {
        container.innerHTML = `<p class="empty-state">Нічого не знайдено.</p>`;
        return;
    }

    container.innerHTML = `
    <ul>
      ${apartments
        .map((apartment) => {
            const paramsList = Object.keys(apartment.params || {})
                .map(
                    (key) => `
                <li>
                  <strong>${labels[key] || key}:</strong> ${apartment.params[key]}
                </li>
              `,
                )
                .join("");

            return `
            <a href="/apartment/${apartment.apartmentId}" class="productClicked" data-id="${apartment.apartmentId}">
              <li class="card">
                <strong>${apartment.title}</strong>
                <strong class="price">Ціна: ${apartment._price || apartment.price} грн</strong>
                <p>Опис: ${apartment.description?.fullText || ""}</p>
                <ul>
                  ${paramsList}
                </ul>
              </li>
            </a>
          `;
        })
        .join("")}
    </ul>
  `;
}

function applyClientFilters(apartments) {
    const sortValue = document.getElementById("sortSelect").value;
    const roomsValue = document.getElementById("sortRooms").value.trim();

    let result = [...apartments];

    if (roomsValue) {
        result = result.filter(
            (apartment) => String(apartment.params?.rooms) === roomsValue,
        );
    }

    result.sort((a, b) => {
        const left = a._price || a.price || 0;
        const right = b._price || b.price || 0;

        return sortValue === "desc" ? right - left : left - right;
    });

    return result;
}

async function loadApartments() {
    const dataSource = document.getElementById("dataSource").value;

    try {
        const response = await fetch(dataSource, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const apartments = await response.json();
        const preparedApartments = applyClientFilters(apartments);

        renderApartments(preparedApartments);
    } catch (error) {
        console.error("Failed to load apartments:", error);

        const container = document.getElementById("product-list");
        container.innerHTML = `
      <p class="error-state">
        Не вдалося завантажити дані. Спробуйте ще раз.
      </p>
    `;
    }
}

document
    .getElementById("dataSource")
    .addEventListener("change", loadApartments);

document
    .getElementById("sortSelect")
    .addEventListener("change", loadApartments);

document
    .getElementById("applyFilters")
    .addEventListener("click", loadApartments);

document
    .getElementById("sortRooms")
    .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            loadApartments();
        }
    });
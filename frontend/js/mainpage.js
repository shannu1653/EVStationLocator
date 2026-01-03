// ======================================
// FINAL FIXED DJANGO FRONTEND SCRIPT
// ======================================

const BASE_URL = "http://127.0.0.1:8000/api/accounts/";

// --------------------------------------
// 1️⃣ COMMON API CALL FUNCTION
// --------------------------------------
function apiCall(endpoint, method = "GET", data = null) {
  return fetch(BASE_URL + endpoint, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : null
  })
    .then(res => res.json())
    .catch(err => {
      console.error("API Error:", err);
      return { success: false, message: "Server error" };
    });
}


const STATIONS_API = "http://127.0.0.1:8000/api/accounts/stations/";
let ALL_STATIONS = [];

/* FETCH + RENDER STATIONS */
function loadStations() {
  fetch(STATIONS_API)
    .then(res => res.json())
    .then(data => {
      ALL_STATIONS = data.stations || [];
      renderStations(ALL_STATIONS); // show all initially
    })
    .catch(err => {
      console.error("Error loading stations:", err);
    });
}

function openHelpPage() {
    window.location.href = "help.html";
  }


/* START */
window.onload = function () {
  loadStations();

  document.getElementById("navToggle").onclick = function () {
    document.getElementById("navLinks").classList.toggle("open");
  };
};



// ⭐ 3. RENDER STATIONS (image + name + location + availability + click)
function renderStations(stations) {
  const list = document.getElementById("stationList");
  list.innerHTML = "";

  if (stations.length === 0) {
    list.innerHTML = "<p class='small-text'>No stations found.</p>";
    return;
  }

  stations.forEach(station => {
    if (!station.is_available) return;

    const freeSlots = station.slots_total - station.slots_booked;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${station.image_url}" alt="${station.name}">
      <div class="card-body">
        <div class="card-title-row">
          <h4>${station.name}</h4>
          <span class="status-dot status-online"></span>
        </div>

        <p class="small-text">${station.area}</p>

        <div class="card-tags">
          <span class="tag-pill">${station.connector}</span>
          <span class="tag-pill">${station.speed}</span>
          <span class="tag-pill">${freeSlots} free slots</span>
          <span class="tag-pill">₹${station.approx_rate}</span>
        </div>

        <div class="card-foot">
          <span class="small-text">Open now</span>
          <span class="small-text">Available</span>
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}

document.getElementById("locatorBtn").addEventListener("click", function () {
  const area = document.getElementById("searchArea").value.toLowerCase();
  const connector = document.getElementById("connectorFilter").value;
  const speed = document.getElementById("speedFilter").value;
  const openNow = document.getElementById("openNowFilter").checked;

  const filteredStations = ALL_STATIONS.filter(station => {

    // 1️⃣ Area filter
    if (area && !station.area.toLowerCase().includes(area)) {
      return false;
    }

    // 2️⃣ Connector filter
    if (connector !== "any" && station.connector !== connector) {
      return false;
    }

    // 3️⃣ Speed filter
    if (speed !== "any" && station.speed !== speed) {
      return false;
    }

    // 4️⃣ Open now filter
    if (openNow && !station.open_now) {
      return false;
    }

    return true;
  });

  renderStations(filteredStations);

  document.getElementById("locatorResult").textContent =
    `${filteredStations.length} station(s) found`;
});
window.addEventListener("DOMContentLoaded", loadStations);


// ⭐ 4. SEARCH STATIONS (optional - same style)

document.getElementById('locatorBtn').onclick = function () {
    // Example count (since backend filter not used now)
    const foundCount = document.querySelectorAll('#stationList .card').length;

    // 1️⃣ Show result text
    document.getElementById('locatorResult').textContent =
        "Found " + foundCount + " available station(s). Showing below ↓";

    // 2️⃣ Scroll to Available Stations section
    document.getElementById('stations')
        .scrollIntoView({ behavior: "smooth", block: "start" });

    // 3️⃣ Optional highlight effect
    const cards = document.getElementById('stationList');
    cards.style.boxShadow = "0 0 0 2px #22c55e";
    setTimeout(() => {
        cards.style.boxShadow = "none";
    }, 1200);
};
// Get elements
const bookingForm = document.getElementById("bookingForm");
const bookingStatus = document.getElementById("bookingStatus");
const bookingList = document.getElementById("bookingList");
const paymentBtn = document.getElementById("paymentBtn"); // ✅ IMPORTANT

// --------------------------------------
// 5️⃣ BOOK SLOT
// --------------------------------------
bookingForm.onsubmit = function (e) {
  e.preventDefault();

  const data = {
    user_name: document.getElementById("userName").value,
    vehicle: document.getElementById("userVehicle").value,
    connector: document.getElementById("bookingConnector").value,
    date: document.getElementById("bookingDate").value,
    time: document.getElementById("bookingTime").value,
    duration: Number(document.getElementById("bookingDuration").value),
    approx_amount: 150
  };

  apiCall("bookings/", "POST", data)
    .then(res => {
      bookingStatus.textContent = res.message;
      bookingStatus.style.color = res.success ? "green" : "red";

     if (res.success) {
  bookingStatus.textContent = "Booking created!";
  bookingStatus.style.color = "#22c55e";

  // ✅ Store booking flag
  localStorage.setItem("bookingDone", "true");

  paymentBtn.style.display = "block";
  loadBookings();
}

    })
    .catch(() => {
      bookingStatus.textContent = "Booking failed";
      bookingStatus.style.color = "red";
    });
};

// --------------------------------------
// 6️⃣ LOAD BOOKINGS
// --------------------------------------
// --------------------------------------
// 6️⃣ LOAD BOOKINGS
// --------------------------------------
function loadBookings() {
  bookingList.innerHTML = `
    <p class="small-text">
      Booking created successfully. Proceed to payment.
    </p>
  `;
}



// --------------------------------------
// 7️⃣ PAYMENT BUTTON CLICK
// --------------------------------------
paymentBtn.onclick = function () {
  window.location.href = "payment.html";
};


// --------------------------------------
//  8️⃣LOAD REVIEWS
// --------------------------------------
function loadReviews() {
  apiCall("get-reviews/").then(data => {
    reviewList.innerHTML = "";
    data.reviews?.forEach(r => {
      const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
      reviewList.innerHTML += `
        <div class="review-item">
          <div class="review-stars">${stars}</div>
          <strong>${r.name}</strong>
          <p class="small-text">${r.text}</p>
        </div>`;
    });
  });
}

// --------------------------------------
//9️⃣ ADD REVIEW
// --------------------------------------
reviewForm.onsubmit = function (e) {
  e.preventDefault();

  apiCall("reviews/", "POST", {
    name: reviewName.value,
    rating: reviewRating.value,
    text: reviewText.value
  }).then(res => {
    reviewStatus.textContent = res.message;
    loadReviews();
    reviewForm.reset();
  });
};

// --------------------------------------
// 🔟 CONTACT FORM
// --------------------------------------
contactForm.onsubmit = function (e) {
  e.preventDefault();

  apiCall("contact/", "POST", {
    name: contactName.value,
    email: contactEmail.value,
    message: contactMessage.value
  }).then(res => contactResult.textContent = res.message);
};

// --------------------------------------
// 1️⃣1️⃣ NEWSLETTER
// --------------------------------------
newsletterForm.onsubmit = function (e) {
  e.preventDefault();

  apiCall("newsletter/", "POST", {
    email: newsletterEmail.value
  }).then(res => newsletterResult.textContent = res.message);
};

// --------------------------------------
// 1️⃣2️⃣ START APP
// --------------------------------------
window.onload = function () {
  loadStations();
  loadBookings();
  loadReviews();

  navToggle.onclick = function () {
    navLinks.classList.toggle("open");
  };
};